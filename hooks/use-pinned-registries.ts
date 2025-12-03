"use client";

import { useState, useCallback, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import {
  getPins,
  pinRegistry as apiPinRegistry,
  unpinRegistry as apiUnpinRegistry,
  PinnedRegistryResponse,
} from "@/lib/api/pins";
import { Registry } from "@/types";

const LOCAL_STORAGE_KEY = "pinned-registries";

// ============================================
// LocalStorage Helpers
// ============================================

function getLocalStoragePins(): PinnedRegistryResponse[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalStoragePins(registries: PinnedRegistryResponse[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(registries));
  } catch {
    // Ignore storage errors
  }
}

function clearLocalStoragePins(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function usePinnedRegistries() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [registryIdMap, setRegistryIdMap] = useState<Map<string, number>>(
    new Map()
  );
  const [pins, setPins] = useState<PinnedRegistryResponse[]>([]);

  const isAuthenticated = !!session?.user;

  // Load pins based on auth state
  const loadPins = useCallback(async () => {
    setIsLoading(true);
    try {
      const pins = await getPins();
      setPins(pins);
    } catch (error) {
      setPins(getLocalStoragePins());
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Handle auth state changes

  const isPinned = (name: string) =>
    pins.some((pin) => pin.registryName === name);

  const pinRegistryFn = async (registry: Registry) => {
    // Optimistic update
    setPins((prev) => {
      if (prev.some((pin) => pin.registryName === registry.name)) return prev;
      return [
        ...prev,
        {
          registryId: registry.id,
          registryName: registry.name,
          pinnedAt: new Date().toISOString(),
        },
      ];
    });

    try {
      if (isAuthenticated) {
        if (registry.id) {
          await apiPinRegistry(registry.id);
        }
      } else {
        const current = getLocalStoragePins();
        if (!current.some((pin) => pin.registryName === registry.name)) {
          setLocalStoragePins([
            ...current,
            {
              registryId: registry.id,
              registryName: registry.name,
              pinnedAt: new Date().toISOString(),
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Failed to pin registry:", error);
      // Revert optimistic update
      setPins((prev) =>
        prev.filter((pin) => pin.registryName !== registry.name)
      );
      throw error;
    }
  };

  const unpinRegistryFn = async (registry: Registry) => {
    // Optimistic update
    setPins((prev) => prev.filter((pin) => pin.registryName !== registry.name));

    try {
      if (isAuthenticated) {
        await apiUnpinRegistry(registry.id);
      } else {
        const current = getLocalStoragePins();
        setLocalStoragePins(
          current.filter((n) => n.registryName !== registry.name)
        );
      }
    } catch (error) {
      console.error("Failed to unpin registry:", error);
      setPins((prev) => [
        ...prev,
        {
          registryId: registry.id,
          registryName: registry.name,
          pinnedAt: new Date().toISOString(),
        },
      ]);
      throw error;
    }
  };

  const togglePin = async (registry: Registry) => {
    if (isPinned(registry.name)) {
      await unpinRegistryFn(registry);
    } else {
      await pinRegistryFn(registry);
    }
  };

  return {
    pins,
    isPinned,
    togglePin,
    pinRegistry: pinRegistryFn,
    unpinRegistry: unpinRegistryFn,
    isLoading: isLoading || isSessionLoading,
    registryIdMap,
    setRegistryIdMap,
  };
}

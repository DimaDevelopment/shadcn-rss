"use client";

// ============================================
// Types
// ============================================

export type PinnedRegistryResponse = {
  registryId: number;
  registryName: string;
  pinnedAt: string;
};

export type GetPinsResponse = {
  pins: PinnedRegistryResponse[];
};

export type MigratePinsResponse = {
  success: boolean;
  migratedCount: number;
  pins: PinnedRegistryResponse[];
};

// ============================================
// API Client Functions
// ============================================

/**
 * Get all pinned registries for the current user
 */
export async function getPins(): Promise<PinnedRegistryResponse[]> {
  const response = await fetch("/api/pins", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      return []; // Not authenticated, return empty
    }
    throw new Error("Failed to fetch pinned registries");
  }

  const data: GetPinsResponse = await response.json();
  return data.pins;
}

/**
 * Pin a registry
 */
export async function pinRegistry(registryId: number): Promise<void> {
  const response = await fetch("/api/pins", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registryId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to pin registry");
  }
}

/**
 * Unpin a registry
 */
export async function unpinRegistry(registryId: number): Promise<void> {
  const response = await fetch(`/api/pins?registryId=${registryId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to unpin registry");
  }
}

/**
 * Migrate pins from localStorage to account (bulk pin)
 */
export async function migratePinsToAccount(
  registryNames: string[]
): Promise<MigratePinsResponse> {
  const response = await fetch("/api/pins", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registryNames }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to migrate pins");
  }

  return response.json();
}

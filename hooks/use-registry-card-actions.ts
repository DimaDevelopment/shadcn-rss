"use client";

import * as React from "react";
import { toast } from "sonner";

import { Registry } from "@/types";

export function useRegistryCardActions(
  registry: Registry,
  onToggle?: (registry: Registry) => void
) {
  const handleCopyRss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (registry.rssUrl) {
      navigator.clipboard.writeText(registry.rssUrl);
      toast.success("RSS link copied to clipboard");
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle?.(registry);
  };

  return {
    handleCopyRss,
    handleToggle,
  };
}

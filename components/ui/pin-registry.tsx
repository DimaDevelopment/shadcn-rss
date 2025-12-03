import React from "react";
import { Pin } from "lucide-react";
import { Registry } from "@/types";
import { cn } from "@/lib/utils";
import { usePinnedRegistries } from "@/hooks/use-pinned-registries";

import { Button } from "@/components/ui/button";

export const PinRegistry: React.FC<{ registry: Registry }> = ({ registry }) => {
  const { isPinned, togglePin } = usePinnedRegistries();

  const handleTogglePin = async () => {
    try {
      await togglePin(registry);
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(
        "h-8 w-8 rounded-full text-muted-foreground hover:text-amber-500",
        isPinned(registry.name) && "text-amber-500 hover:text-amber-600"
      )}
      onClick={handleTogglePin}
      title={isPinned(registry.name) ? "Unpin registry" : "Pin registry"}
    >
      <Pin
        className={cn(
          "size-4 -rotate-45",
          isPinned(registry.name) && "fill-current"
        )}
      />
    </Button>
  );
};

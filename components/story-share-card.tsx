"use client";

import React, { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Registry } from "@/types";
import { cn } from "@/lib/utils";

type StoryShareCardProps = {
  registry: Registry;
};

export function StoryShareCard({ registry }: StoryShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const ensureImage = useCallback(async () => {
    if (imageUrl || !cardRef.current) return imageUrl;
    setIsGenerating(true);
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 2 });
      setImageUrl(url);
      return url;
    } finally {
      setIsGenerating(false);
    }
  }, [imageUrl, cardRef]);

  const handleDownload = useCallback(async () => {
    const url = await ensureImage();
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${registry.name}-wrapped.png`;
    link.click();
  }, [ensureImage, registry.name]);

  const handleShare = useCallback(async () => {
    const url = await ensureImage();
    if (!url) return;

    const stats = registry.story;
    const year = stats?.year ?? "2025";
    const items = stats?.totalItems ?? 0;
    const comps = stats?.componentCount ?? 0;
    const blocks = stats?.blockCount ?? 0;
    const peak = stats?.peakMonth ?? "N/A";

    const shareText = `My ${year} Wrapped for ${registry.name} on shadcn/rss 🚀
${items} items 📦 • ${comps} comps 🧩 • ${blocks} blocks/pages 📚
Peak month: ${peak} 🔥`;
    const tweetUrl = `https://x.com/intent/post?text=${encodeURIComponent(
      shareText
    )}&hashtags=${encodeURIComponent("shadcnrss,shadcnui")}`;

    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], `${registry.name}-wrapped.png`, {
        type: "image/png",
      });

      const canShareFile =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFile) {
        await navigator.share({
          text: shareText,
          files: [file],
        });
        return;
      }

      // Fallback: auto-download the image so the user can attach it in X composer
      const link = document.createElement("a");
      link.href = url;
      link.download = `${registry.name}-wrapped.png`;
      link.click();
    } catch {
      // ignore and continue to intent
    }

    window.open(tweetUrl, "_blank", "noopener,noreferrer");
  }, [ensureImage, registry.name, registry.story?.year]);

  return (
    <div className="w-full flex flex-col items-center gap-4 ">
      <div
        ref={cardRef}
        className={cn(
          "w-full rounded-2xl bg-white/10 backdrop-blur-lg border border-white/15",
          "p-6 text-center shadow-2xl text-white space-y-4"
        )}
      >
        <div className="flex items-center justify-center gap-3">
          <div
            className="size-10 rounded-xl bg-white/15 p-2 backdrop-blur-md overflow-hidden flex items-center justify-center [&>svg]:size-full [&>svg]:object-contain border border-white/10"
            dangerouslySetInnerHTML={{ __html: registry.logo }}
          />
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
              shadcn/rss
            </p>
            <p className="text-xl font-bold leading-tight">{registry.name}</p>
          </div>
        </div>

        <div className="rounded-xl bg-black/30 border border-white/10 p-4 grid grid-cols-2 gap-3 text-sm">
          <Stat label="First item" value={registry.story?.firstItemTitle} />
          <Stat
            label="First published"
            value={
              registry.story?.firstItemDate
                ? new Date(registry.story.firstItemDate).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric" }
                  )
                : "—"
            }
          />
          <Stat
            label="Components"
            value={registry.story?.componentCount ?? 0}
            accent
          />
          <Stat
            label="Blocks / Pages"
            value={registry.story?.blockCount ?? 0}
          />
          <Stat label="Peak month" value={registry.story?.peakMonth ?? "N/A"} />
          <Stat
            label="Pubs / Month"
            value={registry.story?.avgMonthlyPubs ?? 0}
          />
        </div>

        <p className="text-sm text-white/80 leading-relaxed">
          See the full story on shadcn/rss and share your year in components.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          size="sm"
          onClick={handleDownload}
          disabled={isGenerating}
          className="gap-2 bg-white text-black hover:bg-white/90"
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          Save image
        </Button>
        <Button
          size="sm"
          onClick={handleShare}
          disabled={isGenerating}
          className="gap-2 bg-[#1D9BF0] hover:bg-[#1D9BF0]/90 text-white z-10"
        >
          <Share2 className="size-4" />
          Share on X
        </Button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-[11px] uppercase tracking-[0.18em] text-white/60">
        {label}
      </span>
      <span
        className={cn(
          "text-base font-semibold",
          accent && "text-amber-200 drop-shadow"
        )}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

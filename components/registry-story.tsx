"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  PlayCircle,
  PartyPopper,
  TrendingUp,
  Calendar,
  Component,
  Package,
  Share2,
} from "lucide-react";
import { Registry } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { StoryShareCard } from "./story-share-card";

interface RegistryStoryProps {
  registry: Registry;
}

// Modern, vibrant gradients
const GRADIENTS = [
  "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
  "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
  "bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500",
  "bg-gradient-to-br from-fuchsia-500 via-violet-600 to-indigo-600",
  "bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500",
  "bg-gradient-to-br from-blue-400 via-teal-500 to-emerald-500",
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

const STORY_DURATION = 5000; // 5 seconds per slide

export function RegistryStory({ registry }: RegistryStoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const stats = registry.story;

  const handleOpen = () => {
    if (stats && stats.totalItems > 0) {
      setIsOpen(true);
    }
  };

  if (!stats || stats.totalItems === 0) {
    return null;
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.1, rotate: 3 }}
        whileTap={{ scale: 0.94 }}
        animate={{ scale: [1, 1.06, 1], rotate: [0, 1.5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
      >
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8 rounded-full text-pink-500 hover:text-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/30 dark:hover:text-pink-300 shadow-sm"
          onClick={handleOpen}
          title="View 2025 Story"
        >
          <PlayCircle className="size-4" />
        </Button>
      </motion.div>

      {isOpen && (
        <StoryOverlay registry={registry} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

interface StoryOverlayProps {
  registry: Registry;
  onClose: () => void;
}

function StoryOverlay({ registry, onClose }: StoryOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const stats = registry.story!;

  // Define the stories based on available data
  const stories = [
    {
      id: "intro",
      render: () => (
        <div className="flex flex-col items-center text-center space-y-8 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="size-32 rounded-3xl bg-white/20 p-6 backdrop-blur-2xl shadow-2xl flex items-center justify-center overflow-hidden [&>svg]:size-full [&>svg]:object-contain ring-1 ring-white/40"
            dangerouslySetInnerHTML={{ __html: registry.logo }}
          />
          <div className="space-y-4">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-6xl font-black text-white tracking-tighter drop-shadow-lg"
            >
              {registry.name}
            </motion.h2>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/10"
            >
              <p className="text-xl text-white font-bold tracking-wide">
                2025 WRAPPED
              </p>
            </motion.div>
          </div>
        </div>
      ),
    },
    stats.firstItemTitle &&
      stats.firstItemDate && {
        id: "first-item",
        render: () => (
          <div className="flex flex-col items-center text-center space-y-6 max-w-xs mx-auto">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-white text-sm font-bold bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2"
            >
              <Calendar className="size-4" />
              It started with
            </motion.div>
            <motion.h2
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1,
              }}
              className="text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg"
            >
              {stats.firstItemTitle}
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3 }}
              className="h-1 w-24 bg-white/40 rounded-full"
            />
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-2xl font-semibold"
            >
              {new Date(stats.firstItemDate!).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
              })}
            </motion.p>
          </div>
        ),
      },
    stats.componentCount > 0 && {
      id: "components",
      render: () => (
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="relative"
          >
            <Component className="absolute -top-12 -right-12 size-24 text-white/20 rotate-12" />
            <div className="text-[10rem] leading-none font-black text-white drop-shadow-2xl tracking-tighter tabular-nums relative z-10">
              {stats.componentCount}
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-white uppercase tracking-tight bg-white/10 px-6 py-2 rounded-2xl backdrop-blur-sm"
          >
            New Components
          </motion.div>
        </div>
      ),
    },
    stats.blockCount > 0 && {
      id: "blocks",
      render: () => (
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="relative"
          >
            <Package className="absolute -top-12 -left-12 size-24 text-white/20 -rotate-12" />
            <div className="text-[10rem] leading-none font-black text-white drop-shadow-2xl tracking-tighter tabular-nums relative z-10">
              {stats.blockCount}
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-white uppercase tracking-tight bg-white/10 px-6 py-2 rounded-2xl backdrop-blur-sm"
          >
            New Blocks
          </motion.div>
        </div>
      ),
    },
    stats.peakMonth !== "N/A" && {
      id: "peak",
      render: () => (
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white text-sm font-bold bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2"
          >
            <PartyPopper className="size-4" />
            Peak Productivity
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="text-7xl font-black text-white drop-shadow-2xl tracking-tighter"
          >
            {stats.peakMonth}
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/90 text-lg font-medium max-w-[200px] leading-relaxed"
          >
            Your most productive month of the year
          </motion.div>
        </div>
      ),
    },
    {
      id: "average",
      render: () => (
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="text-[9rem] leading-none font-black text-white drop-shadow-2xl tracking-tighter tabular-nums"
          >
            {stats.avgMonthlyPubs}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black text-white uppercase tracking-tight"
          >
            Pubs / Month
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white text-sm font-bold mt-4 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2"
          >
            <TrendingUp className="size-4" />
            Average consistency
          </motion.div>
        </div>
      ),
    },
    {
      id: "share",
      render: () => (
        <div className="flex flex-col items-center text-center space-y-4 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white/90 backdrop-blur-md border border-white/10"
          >
            <Share2 className="size-4" />
            Share your 2025 story
          </motion.div>
          <p className="text-white/80 text-sm max-w-sm leading-relaxed">
            Save a snapshot of your registry’s 2025 Wrapped and share it on X.
          </p>
          <div className="w-full">
            <StoryShareCard registry={registry} />
          </div>
        </div>
      ),
    },
  ].filter(Boolean) as { id: string; render: () => React.ReactNode }[];

  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, stories.length]);

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (isPaused) return;
    if (currentIndex >= stories.length - 1) return; // don't auto-close on last story
    const timer = setTimeout(goToNext, STORY_DURATION);
    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, goToNext, stories.length]);

  const currentStory = stories[currentIndex];
  const gradient = getGradient(registry.name);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, onClose]);

  return (
    <DialogPrimitive.Root open={true}>
      <DialogPrimitive.Portal>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8">
          {/* Story Card Container */}
          <div
            className={cn(
              "relative w-full max-w-md aspect-9/16 max-h-[90dvh] flex flex-col rounded-4xl overflow-hidden ring-1 ring-white/10 shadow-2xl",
              gradient
            )}
          >
            {/* Noise Texture Overlay */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Header / Progress */}
            <div className="relative z-20 flex flex-col p-6 pt-8 gap-6 bg-linear-to-b from-black/60 via-black/20 to-transparent">
              {/* Progress Bars */}
              <div className="flex gap-2 w-full">
                {stories.map((story, index) => (
                  <div
                    key={story.id}
                    className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
                  >
                    <motion.div
                      className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      initial={{ width: index < currentIndex ? "100%" : "0%" }}
                      animate={{
                        width:
                          index < currentIndex
                            ? "100%"
                            : index === currentIndex
                            ? "100%"
                            : "0%",
                      }}
                      transition={{
                        duration:
                          index === currentIndex ? STORY_DURATION / 1000 : 0,
                        ease: "linear",
                      }}
                      style={{ originX: 0 }}
                    />
                  </div>
                ))}
              </div>

              {/* Registry Info Header */}
              <div className="flex items-center justify-between text-white px-1">
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-xl bg-white/20 p-2 backdrop-blur-md overflow-hidden flex items-center justify-center [&>svg]:size-full [&>svg]:object-contain shadow-lg border border-white/10"
                    dangerouslySetInnerHTML={{ __html: registry.logo }}
                  />
                  <span className="font-bold text-lg tracking-tight drop-shadow-md">
                    {registry.name}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 hover:bg-white/20 rounded-full transition-colors active:scale-95 backdrop-blur-sm"
                >
                  <X className="size-6 drop-shadow-md" />
                </button>
              </div>
            </div>

            {/* Story Content Area */}
            <div
              className="flex-1 flex items-center justify-center py-8 px-2 relative z-40"
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {/* Tap Areas */}
              <div
                className="absolute inset-y-0 left-0 w-1/3 z-30 cursor-w-resize active:bg-black/5 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
              />
              <div
                className="absolute inset-y-0 right-0 w-1/3 z-30 cursor-e-resize active:bg-black/5 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStory.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 1.1,
                    filter: "blur(10px)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    opacity: { duration: 0.2 },
                  }}
                  className="w-full relative z-20 pointer-events-auto"
                >
                  {currentStory.render()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

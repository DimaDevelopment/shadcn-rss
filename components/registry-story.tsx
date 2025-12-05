"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, PlayCircle } from "lucide-react";
import { Registry } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface RegistryStoryProps {
  registry: Registry;
}

const GRADIENTS = [
  "bg-gradient-to-br from-rose-500 via-red-400 to-orange-300",
  "bg-gradient-to-br from-blue-500 via-indigo-400 to-purple-400",
  "bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-400",
  "bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-400",
  "bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-300",
  "bg-gradient-to-br from-pink-500 via-rose-400 to-red-300",
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
      <Button
        variant="ghost"
        size="icon-sm"
        className="h-7 w-7 text-muted-foreground hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/30 dark:hover:text-pink-400 transition-colors"
        onClick={handleOpen}
        title="View 2025 Story"
      >
        <PlayCircle className="size-4" />
      </Button>

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
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="size-24 rounded-3xl bg-white/20 p-6 backdrop-blur-xl shadow-lg flex items-center justify-center overflow-hidden [&>svg]:size-full [&>svg]:object-contain"
            dangerouslySetInnerHTML={{ __html: registry.logo }}
          />
          <div className="space-y-3">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-5xl font-black text-white  "
            >
              {registry.name}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl text-white/70 font-semibold tracking-wide"
            >
              2025 Year in Review
            </motion.p>
          </div>
        </div>
      ),
    },
    stats.firstItemTitle &&
      stats.firstItemDate && {
        id: "first-item",
        render: () => (
          <div className="flex flex-col items-center text-center space-y-4 max-w-xs mx-auto">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-white text-sm font-bold mt-2 bg-white/30 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/5"
            >
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
              className="text-5xl font-black text-white"
            >
              {stats.firstItemTitle}
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3 }}
              className="h-0.5 w-16 bg-white/50 rounded-full"
            />
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/95 text-2xl font-semibold"
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
        <div className="flex flex-col items-center text-center space-y-2">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="text-[9rem] leading-none font-black text-white drop-shadow-2xl tracking-tighter tabular-nums"
          >
            {stats.componentCount}
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-white/90 uppercase tracking-wide"
          >
            New Components
          </motion.div>
        </div>
      ),
    },
    stats.blockCount > 0 && {
      id: "blocks",
      render: () => (
        <div className="flex flex-col items-center text-center space-y-2">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="text-[9rem] leading-none font-black text-white drop-shadow-2xl tracking-tighter tabular-nums"
          >
            {stats.blockCount}
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-white/90 uppercase tracking-wide"
          >
            New Blocks
          </motion.div>
        </div>
      ),
    },
    stats.peakMonth !== "N/A" && {
      id: "peak",
      render: () => (
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white text-sm font-bold mt-2 bg-white/30 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/5"
          >
            Peak Productivity
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="text-7xl font-black text-white drop-shadow-xl tracking-tight"
          >
            {stats.peakMonth}
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white text-md font-semibold"
          >
            Most updates happened this month
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
            className="text-[8rem] leading-none font-black text-white drop-shadow-2xl tracking-tighter tabular-nums"
          >
            {stats.avgMonthlyPubs}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold text-white/90 uppercase tracking-wide"
          >
            Pubs / Month
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white text-sm font-bold mt-2 bg-white/30 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/5"
          >
            Average consistency
          </motion.div>
        </div>
      ),
    },
  ].filter(Boolean) as { id: string; render: () => React.ReactNode }[];

  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(goToNext, STORY_DURATION);
    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, goToNext]);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8">
          {/* Story Card Container */}
          <div
            className={cn(
              "relative w-full max-w-md aspect-9/16 max-h-[90dvh] flex flex-col rounded-3xl overflow-hidden ring-1 ring-white/10",
              gradient
            )}
          >
            {/* Header / Progress */}
            <div className="relative z-20 flex flex-col p-4 pt-6 gap-4 bg-linear-to-b from-black/40 to-transparent">
              {/* Progress Bars */}
              <div className="flex gap-1.5 w-full">
                {stories.map((story, index) => (
                  <div
                    key={story.id}
                    className="h-1 flex-1 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm"
                  >
                    <motion.div
                      className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
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
                    className="size-8 rounded-full bg-white/20 p-1.5 backdrop-blur-md overflow-hidden flex items-center justify-center [&>svg]:size-full [&>svg]:object-contain shadow-sm"
                    dangerouslySetInnerHTML={{ __html: registry.logo }}
                  />
                  <span className="font-bold text-sm tracking-tight drop-shadow-md">
                    {registry.name}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 hover:bg-white/20 rounded-full transition-colors active:scale-95"
                >
                  <X className="size-5 drop-shadow-md" />
                </button>
              </div>
            </div>

            {/* Story Content Area */}
            <div
              className="flex-1 flex items-center justify-center py-8 px-2 relative z-10"
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
                  initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 1.1,
                    rotate: 2,
                    filter: "blur(10px)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    opacity: { duration: 0.2 },
                  }}
                  className="w-full relative z-20 pointer-events-none"
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

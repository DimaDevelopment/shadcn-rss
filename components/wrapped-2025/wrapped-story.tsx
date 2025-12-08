"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { wrappedData } from "./data";
import { cn } from "@/lib/utils";

export function WrappedStory() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const slides = wrappedData.slides;

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      // End of wrapped
      router.push("/");
    }
  }, [currentSlide, slides.length, router]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  // Auto-advance slides (optional, maybe too fast for reading text, let's keep it manual or slow)
  // For a "Story" feel, it usually auto-advances. Let's add a long timer.
  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000); // 5 seconds per slide
    return () => clearTimeout(timer);
  }, [currentSlide, nextSlide]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") router.push("/");
    },
    [nextSlide, prevSlide, router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const slide = slides[currentSlide];

  // Background colors based on slide index to make it dynamic
  const bgColors = [
    "bg-zinc-950",
    "bg-indigo-950",
    "bg-purple-950",
    "bg-pink-950",
    "bg-blue-950",
    "bg-zinc-900",
  ];
  const currentBg = bgColors[currentSlide % bgColors.length];

  return (
    <div className={cn("fixed inset-0 flex items-center justify-center overflow-hidden transition-colors duration-700", currentBg)}>
      {/* Progress Bars */}
      <div className="absolute top-4 left-0 right-0 z-20 flex gap-2 px-4">
        {slides.map((_, index) => (
          <div key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{
                width: index < currentSlide ? "100%" : index === currentSlide ? "100%" : "0%",
              }}
              transition={{
                duration: index === currentSlide ? 5 : 0,
                ease: "linear",
              }}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute top-8 right-4 z-20">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.push("/")}>
          <X className="size-6" />
        </Button>
      </div>

      {/* Tap Areas */}
      <div className="absolute inset-0 z-10 flex">
        <div className="h-full w-1/3" onClick={prevSlide} />
        <div className="h-full w-2/3" onClick={nextSlide} />
      </div>

      {/* Content */}
      <div className="relative z-0 flex h-full w-full max-w-md flex-col items-center justify-center p-8 text-center text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6"
          >
            {slide.type === "intro" && (
              <>
                <motion.h1 
                  className="text-6xl font-black tracking-tighter"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p 
                  className="text-2xl font-light text-white/80"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {slide.subtitle}
                </motion.p>
              </>
            )}

            {slide.type === "stat" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="mb-8 flex size-48 items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
                >
                  <span className="text-6xl font-bold">{slide.value}</span>
                </motion.div>
                <h2 className="text-3xl font-bold">{slide.label}</h2>
                <p className="text-xl text-white/70">{slide.description}</p>
              </>
            )}

            {slide.type === "component" && (
              <>
                <h2 className="text-4xl font-bold mb-8">{slide.title}</h2>
                <div className="p-8 bg-white rounded-xl shadow-2xl text-black transform rotate-3">
                  <Button size="lg" className="text-xl px-8 py-6">
                    {slide.componentName}
                  </Button>
                </div>
                <p className="mt-8 text-xl text-white/70">{slide.description}</p>
              </>
            )}

            {slide.type === "outro" && (
              <>
                <h2 className="text-5xl font-bold">{slide.title}</h2>
                <p className="text-2xl text-white/80">{slide.subtitle}</p>
                <Button 
                  className="mt-8 bg-white text-black hover:bg-white/90"
                  onClick={() => {
                    // Share logic could go here
                    alert("Shared to clipboard!");
                  }}
                >
                  <Share2 className="mr-2 size-4" />
                  Share your Wrapped
                </Button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

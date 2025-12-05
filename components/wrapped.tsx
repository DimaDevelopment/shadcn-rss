"use client";
import { useEffect, useRef, useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Wrapped = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Auto-play video when dialog opens
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may fail, that's okay
      });
    } else if (!isOpen && videoRef.current) {
      // Pause and reset video when dialog closes
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md hover:scale-105 hover:shadow-lg transition-transform"
        >
          WRAPPED 2025
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen sm:max-w-[80vw]">
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden max-h-[80vh] ">
          {/* Video Element */}
          <video
            autoPlay
            ref={videoRef}
            src="/updates/wrapped.mp4"
            className="w-full h-full object-contain max-w-full max-h-full"
            onPlay={handlePlay}
            onPause={handlePause}
            onLoadedData={() => setIsLoaded(true)}
            onError={() => {
              setHasError(true);
              setIsLoaded(true);
            }}
            controls
            playsInline
            preload="auto"
            aria-label="What's new video"
          />

          {/* Loading State */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="size-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <p className="text-lg text-white mb-2">Failed to load video</p>
                <p className="text-sm text-white/60">Please try again later</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

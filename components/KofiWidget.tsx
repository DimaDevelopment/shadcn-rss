"use client";

import Link from "next/link";
import { Coffee } from "lucide-react";
import { motion } from "motion/react";

export const KofiWidget = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href="https://ko-fi.com/kapishdima"
        target="_blank"
        rel="noopener noreferrer"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="group relative flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/20"
          aria-label="View what's new"
        >
          <div className="relative z-10 flex items-center gap-2">
            <Coffee className="size-5 fill-white/20" />
            <span className="text-sm font-medium hidden sm:inline">
              Support me
            </span>
          </div>
        </motion.div>
      </Link>
    </div>
  );
};

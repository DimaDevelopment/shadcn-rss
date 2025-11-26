"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ProductHuntWidget() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const widgetTheme = currentTheme === "light" ? "light" : "dark";

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-transform duration-300 hover:scale-105">
      <Link
        href="https://www.producthunt.com/products/shadcn-rss?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-shadcn-rss"
        target="_blank"
      >
        <Image
          src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1040001&theme=${widgetTheme}&t=1764166945682`}
          alt="shadcn/rss - Stay updated with the shadcn/ui ecosystem | Product Hunt"
          width={175}
          height={38}
          className="h-[38px] w-[175px]"
          unoptimized
        />
      </Link>
    </div>
  );
}

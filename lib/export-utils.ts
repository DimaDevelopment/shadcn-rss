import { toast } from "sonner";

import { Registry } from "@/types";
import { generateOpml } from "@/lib/opml";

export const downloadOpml = (selectedRegistries: Registry[]) => {
  const opmlContent = generateOpml(selectedRegistries);
  const blob = new Blob([opmlContent], { type: "text/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "shadcn-rss-feeds.opml";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("OPML file downloaded");
};

export const copyRssUrls = (selectedRegistries: Registry[]) => {
  const urls = selectedRegistries
    .filter((r) => r.rssUrl)
    .map((r) => r.rssUrl)
    .join("\n");
  navigator.clipboard.writeText(urls);
  toast.success("RSS URLs copied to clipboard");
};

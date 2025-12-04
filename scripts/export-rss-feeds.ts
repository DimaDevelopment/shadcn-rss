import path from "path";
import fs from "node:fs/promises";
import { eq } from "drizzle-orm";

import { db, schema } from "../db";

const [, , outputArg] = process.argv;

const OUTPUT_FILE_NAME = outputArg || "aggregated-registries-rss.txt";
const OUTPUT_PATH = path.join(process.cwd(), "data", OUTPUT_FILE_NAME);

type RegistryFeedRecord = {
  name: string;
  rssUrl?: string | null;
  url: string;
  hasFeed?: 0 | 1 | null;
};

async function fetchFeedText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "shadrss-fetcher/1.0 (+https://github.com/DimaDevelopment/shadcn-rss)",
      Accept: "application/rss+xml, application/xml, text/xml, */*;q=0.1",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Fetch failed with ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

async function main() {
  const registries = await db
    .select({
      name: schema.registries.name,
      rssUrl: schema.registries.rssUrl,
      url: schema.registries.url,
      hasFeed: schema.registries.hasFeed,
    })
    .from(schema.registries)
    .where(eq(schema.registries.hasFeed, 1));

  if (registries.length === 0) {
    console.warn("No registries marked with an RSS feed were found.");
    return;
  }

  const feedEntries: string[] = [];

  for (const registry of registries as RegistryFeedRecord[]) {
    const feedUrl = registry.rssUrl?.trim();

    if (!feedUrl) {
      console.warn(`Skipping ${registry.name} — no rssUrl.`);
      continue;
    }

    try {
      console.log(`Fetching ${registry.name} → ${feedUrl}`);
      const feedText = await fetchFeedText(feedUrl);

      feedEntries.push(
        `### ${
          registry.name
        }\nURL: ${feedUrl}\nFetched: ${new Date().toISOString()}\n\n${feedText.trim()}`
      );
    } catch (error) {
      console.error(`Failed to fetch ${registry.name}:`, error);
    }
  }

  if (feedEntries.length === 0) {
    console.warn("No feeds were successfully fetched — nothing to write.");
    return;
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, feedEntries.join("\n\n---\n\n"), "utf-8");

  console.log(`Saved ${feedEntries.length} feeds to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error("Failed to export RSS feeds:", error);
  process.exitCode = 1;
});

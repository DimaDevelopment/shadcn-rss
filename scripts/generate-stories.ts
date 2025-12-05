import { db, schema } from "../db";
import { eq, and } from "drizzle-orm";
import { XMLParser } from "fast-xml-parser";
import { RssItem } from "../types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

async function fetchFeedText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "shadrss-fetcher/1.0",
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

function getItemsFromParsedXml(xml: any): RssItem[] {
  const channel = xml.rss?.channel || xml.feed;
  if (!channel) return [];

  let items = channel.item || channel.entry || [];
  if (!Array.isArray(items)) {
    items = [items];
  }

  return items.map((item: any) => ({
    title: item.title,
    link: item.link,
    guid: item.guid?.["#text"] || item.guid || item.id,
    description: item.description || item.summary,
    pubDate: item.pubDate || item.published || item.updated,
  }));
}

async function main() {
  console.log("Starting story generation...");

  const registries = await db.query.registries.findMany({
    where: eq(schema.registries.hasFeed, true),
  });

  console.log(`Found ${registries.length} registries with feeds.`);

  for (const registry of registries) {
    if (!registry.rssUrl) continue;

    try {
      console.log(`Processing ${registry.name}...`);
      const feedText = await fetchFeedText(registry.rssUrl);
      const parsed = parser.parse(feedText);
      const items = getItemsFromParsedXml(parsed);

      if (items.length === 0) {
        console.log(`No items found for ${registry.name}`);
        continue;
      }

      // 1. Upsert RSS Items (Optional, but good for history if we want to keep it)
      // For now, let's just calculate stats from the fetched items directly as per requirement "fetch all RSS feeds... transform... save values needed for stories"
      // But wait, the prompt says "save the values needed for stories". It doesn't explicitly say "store all RSS items".
      // However, I added rssItems table earlier. Maybe I should use it?
      // Let's stick to just calculating stats for now to be efficient,
      // unless we want to query the DB for items later.
      // The prompt says "fetch all RSS feeds... transform... save the values needed for stories".
      // So storing items might be a side effect or not required.
      // I will calculate stats from the `items` array I just parsed.

      const now = new Date();
      const currentYear = 2025; // Hardcoded as per "2025 Year in Review" context

      // Filter for current year
      const yearItems = items.filter((item) => {
        const date = new Date(item.pubDate);
        return !isNaN(date.getTime()) && date.getFullYear() === currentYear;
      });

      if (yearItems.length === 0) {
        console.log(`No items for ${currentYear} for ${registry.name}`);
        continue;
      }

      // Sort by date ascending
      yearItems.sort(
        (a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime()
      );

      const firstItem = yearItems[0];

      let componentCount = 0;
      let blockCount = 0;
      const monthCounts: Record<string, number> = {};

      yearItems.forEach((item) => {
        if (
          (item.link && item.link.includes("/blocks/")) ||
          (item.title && item.title.toLowerCase().includes("block"))
        ) {
          blockCount++;
        } else {
          componentCount++;
        }

        const date = new Date(item.pubDate);
        const month = date.toLocaleString("default", { month: "long" });
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      });

      // Peak month
      let peakMonth = "N/A";
      let maxCount = 0;
      Object.entries(monthCounts).forEach(([month, count]) => {
        if (count > maxCount) {
          maxCount = count;
          peakMonth = month;
        }
      });

      // Avg pubs
      // Assuming we are calculating for the whole year or up to now
      // If currentYear is 2025 and it is 2025, use current month.
      // But for "Year in Review" it's often static.
      // Let's use the logic from story-utils: months passed so far.
      const monthsPassed =
        now.getFullYear() === currentYear ? now.getMonth() + 1 : 12;
      const avgMonthlyPubs =
        monthsPassed > 0
          ? Math.round(yearItems.length / monthsPassed) // Round to int for storage
          : 0;

      // Save to DB
      await db
        .insert(schema.registryStories)
        .values({
          registryId: registry.id,
          year: currentYear,
          firstItemTitle: firstItem.title,
          firstItemDate: new Date(firstItem.pubDate),
          componentCount,
          blockCount,
          peakMonth,
          avgMonthlyPubs,
          totalItems: yearItems.length,
        })
        .onConflictDoUpdate({
          target: [
            schema.registryStories.registryId,
            schema.registryStories.year,
          ],
          set: {
            firstItemTitle: firstItem.title,
            firstItemDate: new Date(firstItem.pubDate),
            componentCount,
            blockCount,
            peakMonth,
            avgMonthlyPubs,
            totalItems: yearItems.length,
            updatedAt: new Date(),
          },
        });

      console.log(`Saved story for ${registry.name} (Year ${currentYear})`);
    } catch (error) {
      console.error(`Error processing ${registry.name}:`, error);
    }
  }

  console.log("Done.");
}

main().catch(console.error);

# shadcn/rss

A community-driven directory of RSS feeds for shadcn/ui registries. Stay updated with the latest components, blocks, and changes across the entire shadcn ecosystem.

## The Problem

The shadcn/ui ecosystem has grown significantly, with dozens of community registries offering components, blocks, and utilities. It has become quite difficult to keep track of everyone, find out about updates, and it is quite easy to miss something important.

## The Solution

**shadcn/rss** solves this by:

- 🔍 **Auto-discovering RSS feeds** from all registries in the official shadcn directory
- 📡 **Aggregating updates** into a single, browsable timeline
- 🔖 **Enabling subscriptions** — Select registries and export as OPML for your RSS reader
- ⚡ **Real-time tracking** — Shows which registries were updated recently (within 30 days)

## Features

### 📋 Registry Directory

Browse all shadcn/ui community registries with:

- Registry name, description, and logo
- Direct links to registry websites
- RSS feed availability indicators
- "Updated X days ago" badges for active registries

### 📰 Latest Changes Feed

A unified timeline showing the most recent updates across all registries:

- Component releases and updates
- New blocks and utilities
- Sorted chronologically with timestamps

### 📥 OPML Export

Select your favorite registries and export them as an OPML file:

- Import into any RSS reader (Feedly, Inoreader, NetNewsWire, etc.)
- Bulk subscribe to multiple registries at once
- Copy individual RSS URLs to clipboard

---

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/DimaDevelopment/shadrss.git
cd shadrss
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Build for production     |
| `pnpm start` | Start production server  |
| `pnpm lint`  | Run ESLint               |

---

## Adding RSS Feed to Your Registry

Want your registry to appear with update tracking? Add an RSS feed endpoint using `@wandry/analytics-sdk`:

### Step 1: Install the package

```bash
npm install @wandry/analytics-sdk
```

### Step 2: Create an RSS route

Create a route handler in your Next.js app (e.g., `app/rss.xml/route.ts`):

```typescript
import { generateRegistryRssFeed } from "@wandry/analytics-sdk";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = new URL(request.url).origin;

  const rssXml = await generateRegistryRssFeed({
    baseUrl,
    rss: {
      title: "Your Registry Name",
      description: "Subscribe to Your Registry updates",
      link: "https://your-registry-url.com",
      pubDateStrategy: "githubLastEdit",
    },
    github: {
      owner: "your-username",
      repo: "your-repo",
      token: process.env.GITHUB_TOKEN,
    },
  });

  if (!rssXml) {
    return new Response("RSS feed not available", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
```

### Step 3: Configure environment variables

Add your GitHub token to `.env.local`:

```env
GITHUB_TOKEN=your_github_token_here
```

### Step 4: Deploy

Once deployed, your RSS feed will be automatically discovered at one of the supported paths.

### Supported RSS Paths

The project automatically checks these paths for RSS feeds:

| Path                | Alternative          |
| ------------------- | -------------------- |
| `/rss.xml`          | `/feed.xml`          |
| `/rss`              | `/feed`              |
| `/feed.rss`         | `/rss.rss`           |
| `/registry/rss`     | `/registry/feed`     |
| `/registry/rss.xml` | `/registry/feed.xml` |

---

<p align="center">
  Made with ❤️ by <a href="https://x.com/kapish_dima">@KapishDima</a>
</p>

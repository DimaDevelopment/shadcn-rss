# ShadRSS

A directory of RSS feeds from the ShadCN UI community registries. Automatically discovers and tracks RSS feeds from various registry sources, showing the latest updates and activity.

## Getting Started

## Adding RSS Feed to Your Registry

To enable RSS feed tracking for your registry, you need to add an RSS feed endpoint. Here's how to do it using `@wandry/analytics-sdk`:

### Step 1: Install the package

```bash
npm install @wandry/analytics-sdk
```

### Step 2: Create an RSS route

Create a route handler in your Next.js app (e.g., `app/rss.xml/route.ts` or `app/feed.xml/route.ts`):

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

Add your GitHub token to your `.env.local`:

```env
GITHUB_TOKEN=your_github_token_here
```

### Step 4: Deploy

Once deployed, your RSS feed will be automatically discovered by ShadRSS at one of the supported paths (e.g., `/rss.xml` or `/feed.xml`).

**Note**: Make sure your RSS feed is accessible at one of the paths listed in the [RSS Feed Paths](#rss-feed-paths) section above.

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

## Project Structure

```
shadrss/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
    ...
│   └── ui/                    # UI components
├── lib/                   # Utility functions
│   ├── config.ts          # Configuration constants
│   ├── data.ts            # RSS fetching and processing
│   └── utils.ts           # Helper utilities
├── types/                 # TypeScript type definitions
│   └── index.ts           # Type definitions
└── public/                # Static assets
```

## RSS Feed Paths

The project automatically tries the following paths to find RSS feeds:

- `/rss.xml`
- `/feed.xml`
- `/rss`
- `/feed`
- `/atom.xml`
- `/atom`
- `/index.xml`
- `/index.rss`
- `/feed.rss`
- `/rss.rss`
- `/registry/rss`
- `/registry/rss.xml`
- `/registry/feed`
- `/registry/feed.xml`
- `/registry/atom`
- `/registry/atom.xml`

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

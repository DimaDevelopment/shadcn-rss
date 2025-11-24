import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog";
import { CodeBlock } from "./code-block";
import { Button } from "./ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface WithoutRssProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
}

export const WithoutRss: React.FC<WithoutRssProps> = ({
  children,
  title = "No RSS feed found",
  description = "Add a RSS feed to your registry to enable this feature.",
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 py-1 text-xs font-semibold cursor-pointer"
          >
            Connect RSS feed
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              <h3 className="font-medium leading-none">Install the SDK</h3>
            </div>
            <div className="pl-8">
              <CodeBlock
                code="npm install @wandry/analytics-sdk"
                filename="Terminal"
                lang="bash"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </span>
              <h3 className="font-medium leading-none">Create the RSS Route</h3>
            </div>
            <div className="pl-8">
              <p className="mb-3 text-sm text-muted-foreground">
                Create a new route handler at{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-foreground font-mono">
                  app/rss.xml/route.ts
                </code>{" "}
                and add the following code:
              </p>
              <CodeBlock
                code={`import { generateRegistryRssFeed } from "@wandry/analytics-sdk";
import type { NextRequest } from "next/server";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const baseUrl = new URL(request.url).origin;

  const rssXml = await generateRegistryRssFeed({
    baseUrl,
    rss: {
      title: "Wandry UI",
      description: "Subscribe to Wandry UI updates",
      link: "https://www.ui.wandry.com.ua",
      pubDateStrategy: "githubLastEdit",
    },
    github: {
      owner: "WandryDev",
      repo: "wandry-ui",
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
}`}
                filename="app/rss.xml/route.ts"
                lang="typescript"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Found a bug?</h4>
              <p className="text-sm text-muted-foreground">
                Let me know about this on GitHub.
              </p>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link
                href="https://github.com/DimaDevelopment/shadcn-rss"
                target="_blank"
                rel="noreferrer"
                className="gap-2"
              >
                Create an issue
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { Registry } from "@/types";

export const generateOpml = (registries: Registry[]): string => {
  const head = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>shadcn/rss Selection</title>
    <dateCreated>${new Date().toUTCString()}</dateCreated>
  </head>
  <body>`;

  const body = registries
    .filter((r) => r.rssUrl)
    .map((r) => {
      const title = r.name.replace(/"/g, "&quot;");
      const xmlUrl = r.rssUrl!.replace(/"/g, "&quot;");
      const htmlUrl = (r.homepage || r.url).replace(/"/g, "&quot;");
      return `    <outline text="${title}" title="${title}" type="rss" xmlUrl="${xmlUrl}" htmlUrl="${htmlUrl}"/>`;
    })
    .join("\n");

  const tail = `
  </body>
</opml>`;

  return `${head}\n${body}${tail}`;
};

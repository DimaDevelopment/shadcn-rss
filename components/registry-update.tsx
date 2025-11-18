import React from "react";
import { differenceInDays } from "date-fns";
import { Registry, RssItem } from "@/types";
import { Badge } from "./ui/badge";
import { STILL_UPDATED_DAYS } from "@/lib/config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ExternalLinkIcon } from "lucide-react";

type RegistryUpdateProps = {
  registry: Registry;
};

export const RegistryUpdate: React.FC<RegistryUpdateProps> = ({ registry }) => {
  if (!registry.updatedAt) return null;
  if (!registry.latestItems || registry.latestItems.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <Badge className="bg-green-300 text-green-800 font-semibold cursor-pointer py-1.5 px-3" suppressHydrationWarning>
          Updated on {registry.updatedAt?.toLocaleDateString()}
        </Badge>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto md:max-w-[60vw] md:w-[60vw] w-full">
        <DialogHeader>
          <DialogTitle>Latest updates</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[calc(80vh-10rem)] overflow-y-auto space-y-4">
          {registry.latestItems.map((item) => (
            <div key={item.guid} className="pb-2 border-b border-border">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer external"
                className="text-md font-bold flex items-center gap-2"
              >
                {item.title}
                <ExternalLinkIcon className="size-4" />
              </a>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
              <p className="text-sm text-muted-foreground">{item.pubDate}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

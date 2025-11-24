"use client";

import React from "react";
import { highlightCode } from "@/lib/highlight";
import { Button } from "./ui/button";
import { CheckCheck, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  lang?: string;
  containerClassName?: string;
  codeClassName?: string;
  hasCopyButton?: boolean;
  filename?: string;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  lang,
  containerClassName,
  codeClassName,
  hasCopyButton = true,
  filename,
}) => {
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const [html, setHtml] = React.useState<string>("");

  const getHighlightedCode = async () => {
    const highlighted = await highlightCode(code, lang);
    setHtml(highlighted);
  };

  const copyToClipboard = () => {
    window.navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  React.useEffect(() => {
    getHighlightedCode();
  }, [code, lang]);

  return (
    <div
      className={cn(
        "relative w-full rounded-lg bg-muted text-sm overflow-hidden",
        containerClassName
      )}
    >
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border/50">
          <span className="text-xs font-medium text-muted-foreground">
            {filename}
          </span>
        </div>
      )}
      <div className="relative">
        <div
          className={cn(
            "not-prose w-full px-4 py-2 pr-15 overflow-x-auto",
            codeClassName
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {hasCopyButton && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-1 right-1 z-10 h-6 w-6"
            onClick={copyToClipboard}
          >
            {isCopied ? (
              <CheckCheck className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

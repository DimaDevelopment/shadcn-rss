
import { WrappedStory } from "@/components/wrapped-2025/wrapped-story";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "2025 Wrapped - shadcn/ui",
  description: "A look back at 2025 for the shadcn/ui ecosystem.",
};

export default function WrappedPage() {
  return <WrappedStory />;
}

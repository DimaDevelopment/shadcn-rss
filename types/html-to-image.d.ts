declare module "html-to-image" {
  export function toPng(
    node: HTMLElement,
    options?: {
      cacheBust?: boolean;
      pixelRatio?: number;
      backgroundColor?: string;
      width?: number;
      height?: number;
      style?: Partial<CSSStyleDeclaration>;
      filter?: (domNode: HTMLElement) => boolean;
      skipFonts?: boolean;
      preferredFontFormat?: "woff" | "woff2";
    }
  ): Promise<string>;
}

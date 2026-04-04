/**
 * Hex palette for `opengraph-image` / `twitter-image` (ImageResponse has no CSS variables).
 * Aligns with app theme: rust primary + periwinkle accent on warm dark base.
 */
export const OG_IMAGE_THEME = {
  backgroundGradient:
    "linear-gradient(135deg, #3d0a06 0%, #1a1210 42%, #0a0908 100%)",
  /** Wordmark — matches public manifest primary */
  brand: "#c93f0d",
  headline: "#f5f5f4",
  /** Muted line — periwinkle, complements rust */
  subline: "#9ca8d9",
} as const

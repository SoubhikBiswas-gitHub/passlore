/**
 * Strength tier 1–5 badge styles (index 0 unused). Uses semantic tokens from globals.css
 * so light / dark / sepia / high-contrast stay aligned.
 */
export const STRENGTH_TIER_BADGE_CLASSES = [
  "",
  "border border-vulnerable/35 bg-vulnerable/10 text-vulnerable",
  "border border-warning/40 bg-warning/12 text-foreground",
  "border border-primary/35 bg-primary/10 text-primary",
  "border border-secure/35 bg-secure/10 text-secure",
  "border border-secure/35 bg-secure/12 text-secure",
] as const

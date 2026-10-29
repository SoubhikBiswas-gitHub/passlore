import { DISPLAY, OG_COLORS, UI, loadOgFonts } from "@/lib/og-image-theme"
import { ImageResponse } from "next/og"

export const alt = "How Passlore works: randomness you can watch."

export const size = { width: 1200, height: 630 }

export const contentType = "image/png"

const HEADLINE = "Randomness you can watch."
const FOOTER = "Live demos · Web Crypto · rejection sampling · 5 of 40"
const BARS: [number, number, number][] = [
  [120, 60, 400],
  [240, 140, 280],
  [60, 220, 460],
  [320, 300, 200],
  [180, 380, 340],
  [280, 460, 240],
  [100, 540, 420],
]

export default async function HowItWorksImage() {
  const fonts = await loadOgFonts({ display: HEADLINE, ui: "How it works" + FOOTER })
  const { navy, blue, white, periwinkle, haze } = OG_COLORS

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          background: navy,
          color: white,
          padding: "72px 80px",
          fontFamily: UI,
        }}
      >
        {BARS.map(([x, y, w]) => (
          <div key={y} style={{ position: "absolute", left: 680 + x, top: y, width: w, height: 44, borderRadius: 8, background: blue }} />
        ))}
        <span style={{ fontSize: 28, fontWeight: 600, color: periwinkle }}>How it works</span>
        <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 84, lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: 760 }}>
          {HEADLINE}
        </p>
        <p style={{ margin: 0, fontSize: 28, color: haze }}>{FOOTER}</p>
      </div>
    ),
    { ...size, fonts },
  )
}

import { DISPLAY, MONO, OG_COLORS, UI, loadOgFonts, markSrc } from "@/lib/og-image-theme"
import { ImageResponse } from "next/og"

export const alt = "Passlore: where is this password going? Pick one and Passlore cuts one that fits."

export const size = { width: 1200, height: 600 }

export const contentType = "image/png"

// a fixed decorative sample, never a real generated password
const SAMPLE = "r7#Vq2!mKe9@Lw4p"
const HEADLINE = "Where is this password going? Pick one — Passlore cuts one that fits."
const FOOTER = "Sample output shown · passlore.com"

export default async function TwitterImage() {
  const fonts = await loadOgFonts({ display: "passlore" + HEADLINE, ui: FOOTER, mono: SAMPLE })
  const { night, white, volt, chip, chipLine, mist } = OG_COLORS

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: night,
          color: white,
          padding: "68px 80px",
          fontFamily: UI,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={markSrc(volt)} width={44} height={44} alt="" />
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 36, letterSpacing: "-0.02em" }}>passlore</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              alignSelf: "flex-start",
              fontFamily: MONO,
              fontSize: 48,
              letterSpacing: "0.02em",
              background: chip,
              border: `2px solid ${chipLine}`,
              borderRadius: 20,
              padding: "20px 28px",
            }}
          >
            {SAMPLE}
          </span>
          <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 68, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            {HEADLINE}
          </p>
        </div>
        <p style={{ margin: 0, fontSize: 28, color: mist }}>{FOOTER}</p>
      </div>
    ),
    { ...size, fonts },
  )
}

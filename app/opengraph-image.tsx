import { DISPLAY, OG_COLORS, UI, loadOgFonts, markSrc } from "@/lib/og-image-theme"
import { ImageResponse } from "next/og"

export const alt = "Passlore: your next password starts in your browser. Free, open source, nothing uploaded."

export const size = { width: 1200, height: 630 }

export const contentType = "image/png"

const HEADLINE = "Your next password starts in your browser."
const FOOTER = "Free · open source · nothing uploaded · passlore.com"

export default async function OpenGraphImage() {
  const fonts = await loadOgFonts({ display: "passlore" + HEADLINE, ui: FOOTER })
  const { blue, blueDeep, white } = OG_COLORS

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
          overflow: "hidden",
          background: blue,
          color: white,
          padding: "72px 80px",
          fontFamily: UI,
        }}
      >
        <img src={markSrc(blueDeep)} width={560} height={560} alt="" style={{ position: "absolute", right: -192, bottom: -80 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={markSrc(white)} width={44} height={44} alt="" />
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 36, letterSpacing: "-0.02em" }}>passlore</span>
        </div>
        <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 84, lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: 720 }}>
          {HEADLINE}
        </p>
        <p style={{ margin: 0, fontSize: 28, fontWeight: 500 }}>{FOOTER}</p>
      </div>
    ),
    { ...size, fonts },
  )
}

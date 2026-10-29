import { OG_COPY, OG_IMAGE_THEME, OG_LORE_SRC, OG_MARK_SRC, loadOgFonts } from "@/lib/og-image-theme"
import { ImageResponse } from "next/og"

export const alt = "Passlore — Free strong password generator in your browser"

export const size = { width: 1200, height: 630 }

export const contentType = "image/png"

export default async function OpenGraphImage() {
  const fonts = await loadOgFonts()
  const { volt, ink, white } = OG_IMAGE_THEME

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: volt,
          padding: 10,
          fontFamily: fonts.length ? "Sora" : undefined,
          color: ink,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            position: "relative",
            border: `6px solid ${ink}`,
            borderRadius: 28,
            padding: "52px 60px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1, maxWidth: 720 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src={OG_MARK_SRC} width={52} height={52} alt="" />
              <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.025em" }}>passlore</span>
            </div>
            <div style={{ marginTop: 56, fontSize: 24, fontWeight: 800, letterSpacing: 3 }}>{OG_COPY.eyebrow}</div>
            <div
              style={{
                marginTop: 14,
                fontSize: 80,
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
              }}
            >
              {OG_COPY.headline}
            </div>
            <div style={{ marginTop: 22, fontSize: 30, fontWeight: 600, lineHeight: 1.3, maxWidth: 640 }}>
              {OG_COPY.subline}
            </div>
            <div style={{ marginTop: "auto", fontSize: 30, fontWeight: 800 }}>{OG_COPY.domain}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 360 }}>
            <img src={OG_LORE_SRC} width={360} height={309} alt="" />
          </div>
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            style={{ position: "absolute", top: 34, right: 60 }}
          >
            <path d="M28 4l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill={white} stroke={ink} strokeWidth="4" />
          </svg>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}

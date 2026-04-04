import { OG_IMAGE_THEME } from "@/lib/og-image-theme"
import { ImageResponse } from "next/og"

export const alt = "Passlore — Free strong password generator in your browser"

export const size = { width: 1200, height: 630 }

export const contentType = "image/png"

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: OG_IMAGE_THEME.backgroundGradient,
          padding: 72,
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: OG_IMAGE_THEME.brand,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          Passlore
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 46,
            fontWeight: 600,
            color: OG_IMAGE_THEME.headline,
            maxWidth: 920,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
          }}
        >
          Strong passwords from your browser
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: OG_IMAGE_THEME.subline,
            maxWidth: 780,
            lineHeight: 1.35,
          }}
        >
          Client-side generation · Nothing uploaded
        </div>
      </div>
    ),
    { ...size }
  )
}

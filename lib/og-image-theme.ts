export const OG_COLORS = {
  blue: "#2447F5",
  blueDeep: "#1A35D6",
  navy: "#1C2350",
  ink: "#0B0D17",
  night: "#0A0C14",
  chip: "#1A1E2B",
  chipLine: "#2C3242",
  volt: "#C8FF2E",
  white: "#FFFFFF",
  line: "#E1E4EC",
  text2: "#383D4D",
  mist: "#C9CEDD",
  periwinkle: "#C9D3FF",
  haze: "#E8ECFF",
} as const

export const MARK_PATH =
  "M6.5 3H17A8.5 8.5 0 0 1 17 20H12.5V22H17.5V24.5H12.5V26H15.5V29H6.5Z M18 8.5A3 3 0 0 1 19.4 14.15L20 16.5H16L16.6 14.15A3 3 0 0 1 18 8.5Z"

export function markSrc(fill: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="${fill}" fill-rule="evenodd" d="${MARK_PATH}"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
}

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 500 | 600 | 700; style: "normal" }

async function loadGoogleFont(family: string, weight: OgFont["weight"], text: string): Promise<OgFont | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`
    const css = await (await fetch(cssUrl)).text()
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    if (!src) return null
    const response = await fetch(src)
    if (!response.ok) return null
    return { name: family, data: await response.arrayBuffer(), weight, style: "normal" }
  } catch {
    return null
  }
}

// Falls back to the built-in font when Google Fonts cannot be reached at build time.
export async function loadOgFonts(text: { display: string; ui?: string; mono?: string }): Promise<OgFont[]> {
  const fonts = await Promise.all([
    loadGoogleFont("Sora", 600, text.display),
    loadGoogleFont("Sora", 700, text.display),
    text.ui ? loadGoogleFont("Plus Jakarta Sans", 500, text.ui) : null,
    text.ui ? loadGoogleFont("Plus Jakarta Sans", 600, text.ui) : null,
    text.mono ? loadGoogleFont("JetBrains Mono", 400, text.mono) : null,
  ])
  return fonts.filter((font): font is OgFont => font !== null)
}

export const DISPLAY = "Sora"
export const UI = "Plus Jakarta Sans"
export const MONO = "JetBrains Mono"

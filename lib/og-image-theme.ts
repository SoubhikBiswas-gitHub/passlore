export const OG_IMAGE_THEME = {
  volt: "#C8FF2E",
  ink: "#0B0D17",
  blue: "#2447F5",
  white: "#FFFFFF",
} as const

const INK = OG_IMAGE_THEME.ink
const VOLT = OG_IMAGE_THEME.volt
const BLUE = OG_IMAGE_THEME.blue

const LORE_COOL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -14 184 158" width="368" height="316">
<ellipse cx="80" cy="134" rx="46" ry="6" fill="${INK}" opacity=".12"/>
<g transform="rotate(-8 80 70)">
<path d="M60 104v14h-9 M80 104v14h9" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M88 58H142a7 7 0 0 1 7 7v6a7 7 0 0 1-7 7H88Z" fill="${BLUE}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
<path d="M116 78v13h9v-7h7v7h9V78" fill="${BLUE}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
<path d="M34 56Q22 36 30 22" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="30" cy="20" r="6.5" fill="${VOLT}" stroke="${INK}" stroke-width="3"/>
<circle cx="70" cy="68" r="40" fill="${VOLT}" stroke="${INK}" stroke-width="3.5"/>
<path d="M44 42a34 34 0 0 1 22-11" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".8"/>
<circle cx="50" cy="80" r="6" fill="${BLUE}" opacity=".22"/><circle cx="92" cy="80" r="6" fill="${BLUE}" opacity=".22"/>
<path d="M42 56h22a3 3 0 0 1 3 3v4a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10v-4a3 3 0 0 1 3-3z M74 56h22a3 3 0 0 1 3 3v4a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10v-4a3 3 0 0 1 3-3z M66 60h9" fill="${INK}"/>
<path d="M48 61l5-4 M80 61l5-4" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
<path d="M56 82Q70 98 84 82Z" fill="${INK}"/>
</g>
<g fill="#FFFFFF" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round">
<path d="M150 4l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z"/>
<path d="M160 58l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
</g>
</svg>`

const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64"><path fill="${INK}" fill-rule="evenodd" d="M6.5 3H17A8.5 8.5 0 0 1 17 20H12.5V22H17.5V24.5H12.5V26H15.5V29H6.5Z M18 8.5A3 3 0 0 1 19.4 14.15L20 16.5H16L16.6 14.15A3 3 0 0 1 18 8.5Z"/></svg>`

const toDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`

export const OG_LORE_SRC = toDataUri(LORE_COOL_SVG)
export const OG_MARK_SRC = toDataUri(MARK_SVG)

export const OG_COPY = {
  eyebrow: "FREE · OPEN SOURCE · MIT",
  headline: "Where is this password going?",
  subline: "Strong passwords made on your device. Never uploaded.",
  domain: "passlore.com",
} as const

type OgFont = { name: string; data: ArrayBuffer; weight: 600 | 800; style: "normal" }

async function loadSora(weight: 600 | 800, text: string): Promise<OgFont | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Sora:wght@${weight}&text=${encodeURIComponent(text)}`
    const css = await (await fetch(cssUrl)).text()
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    if (!src) return null
    const response = await fetch(src)
    if (!response.ok) return null
    return { name: "Sora", data: await response.arrayBuffer(), weight, style: "normal" }
  } catch {
    return null
  }
}

// Falls back to the built-in font when Google Fonts cannot be reached at build time.
export async function loadOgFonts(): Promise<OgFont[]> {
  const text = `passlore${Object.values(OG_COPY).join("")}`
  const fonts = await Promise.all([loadSora(600, text), loadSora(800, text)])
  return fonts.filter((font): font is OgFont => font !== null)
}

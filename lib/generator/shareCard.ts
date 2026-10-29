import type { Tier } from "./types"

export type LoreCardMood = "cool" | "proud" | "unsure" | "worried"
export type LoreCardScene = "sparkles" | "confetti"
export type CardLook = { mood: LoreCardMood; scene?: LoreCardScene }

export type ShareCardInput = { time: string; tier: Tier; bits: number; isWords: boolean; isPin?: boolean; recipe?: string }

export type TextMeasure = (text: string, size: number, weight: number) => number

const INK = "#0B0D17"
const VOLT = "#C8FF2E"
const BLUE = "#2447F5"
const FONT = "Sora, 'Plus Jakarta Sans', Arial, Helvetica, sans-serif"

export const LOGO_MARK =
  "M6.5 3H17A8.5 8.5 0 0 1 17 20H12.5V22H17.5V24.5H12.5V26H15.5V29H6.5Z M18 8.5A3 3 0 0 1 19.4 14.15L20 16.5H16L16.6 14.15A3 3 0 0 1 18 8.5Z"

const dot = (x: number, y: number, r: number) => "M" + (x - r) + " " + y + "a" + r + " " + r + " 0 1 0 " + 2 * r + " 0a" + r + " " + r + " 0 1 0 " + -2 * r + " 0"
const OPEN = dot(56, 66, 5) + " " + dot(84, 66, 5)
const BIG = dot(56, 64, 6.5) + " " + dot(84, 64, 6.5)
const stroke = (d: string, w = 3.5) => '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>'
const fill = (d: string, color = INK) => '<path d="' + d + '" fill="' + color + '"/>'

const ARMS = {
  cheer: ["M34 56Q22 36 30 22", 30, 20],
  down: ["M32 84Q20 94 18 106", 18, 108],
  up: ["M32 70Q14 64 14 48", 14, 46],
} as const

const FACES: Record<LoreCardMood, { arm: keyof typeof ARMS; face: string }> = {
  cool: {
    arm: "cheer",
    face:
      fill("M42 56h22a3 3 0 0 1 3 3v4a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10v-4a3 3 0 0 1 3-3z M74 56h22a3 3 0 0 1 3 3v4a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10v-4a3 3 0 0 1 3-3z M66 60h9") +
      '<path d="M48 61l5-4 M80 61l5-4" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>' +
      fill("M56 82Q70 98 84 82Z"),
  },
  proud: { arm: "cheer", face: fill(OPEN) + fill("M56 80Q70 98 84 80Z") + fill("M64 88q6 5 12 0q-6-3-12 0z", "#FF7A85") },
  unsure: { arm: "down", face: fill(OPEN) + stroke("M48 54h12 M80 54h12", 3) + stroke("M60 88H80") },
  worried: {
    arm: "up",
    face:
      fill(BIG) +
      stroke("M46 56l12-6 M94 56l-12-6", 3) +
      stroke("M60 90Q70 81 80 90") +
      '<path d="M104 34c5 7 5 12 0 14-5-2-5-7 0-14z" fill="#9AACFF" stroke="' + INK + '" stroke-width="2.5"/>',
  },
}

const SCENES: Record<LoreCardScene, string> = {
  sparkles:
    '<g fill="' + VOLT + '" stroke="' + INK + '" stroke-width="2.5" stroke-linejoin="round"><path d="M14 14l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/><path d="M150 4l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z"/><path d="M160 58l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></g>',
  confetti:
    '<g stroke="' + INK + '" stroke-width="2"><rect x="4" y="20" width="9" height="9" rx="2" fill="' + BLUE + '" transform="rotate(20 8 24)"/><rect x="148" y="26" width="9" height="9" rx="2" fill="' + VOLT + '" transform="rotate(-18 152 30)"/><circle cx="132" cy="2" r="5" fill="#FFFFFF"/><circle cx="22" cy="-4" r="4" fill="' + VOLT + '"/></g>',
}

// Same drawing as components/Lore, in the -12 -14 184 158 viewBox, as a static string for the exported image.
export function loreSvg({ mood, scene }: CardLook): string {
  const f = FACES[mood]
  const [armD, hx, hy] = ARMS[f.arm]
  return '<ellipse cx="80" cy="134" rx="46" ry="6" fill="' + INK + '" opacity=".12"/>'
    + '<g transform="rotate(-8 80 70)">'
    + stroke("M60 104v14h-9 M80 104v14h9")
    + '<path d="M88 58H142a7 7 0 0 1 7 7v6a7 7 0 0 1-7 7H88Z" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>'
    + '<path d="M116 78v13h9v-7h7v7h9V78" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>'
    + stroke(armD)
    + '<circle cx="' + hx + '" cy="' + hy + '" r="6.5" fill="' + VOLT + '" stroke="' + INK + '" stroke-width="3"/>'
    + '<circle cx="70" cy="68" r="40" fill="' + VOLT + '" stroke="' + INK + '" stroke-width="3.5"/>'
    + '<path d="M44 42a34 34 0 0 1 22-11" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".8"/>'
    + '<circle cx="50" cy="80" r="6" fill="' + BLUE + '" opacity=".22"/><circle cx="92" cy="80" r="6" fill="' + BLUE + '" opacity=".22"/>'
    + f.face
    + "</g>"
    + (scene ? SCENES[scene] : "")
}

export function cardLook(tier: Tier): CardLook {
  if (tier.n >= 5) return { mood: "cool", scene: "sparkles" }
  if (tier.n >= 4) return { mood: "proud", scene: "confetti" }
  if (tier.n >= 3) return { mood: "unsure" }
  return { mood: "worried" }
}

export function shareTime(crackText: string): string {
  return (crackText || "").replace(/^about /, "")
}

export function shareWhat({ isWords, isPin }: Pick<ShareCardInput, "isWords" | "isPin">): string {
  return isPin ? "PIN" : isWords ? "passphrase" : "password"
}

export function shareSub({ tier, bits, recipe }: Pick<ShareCardInput, "tier" | "bits" | "recipe">): string {
  return tier.name + " · ≈ " + Math.round(bits) + " bits · estimate" + (recipe ? " · cut for " + recipe : "")
}

const esc = (t: string) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const approxMeasure: TextMeasure = (text, size) => text.length * size * 0.54

const txt = (x: number, y: number, size: number, weight: number, body: string, extra = "") =>
  '<text x="' + Math.round(x) + '" y="' + Math.round(y) + '" font-family="' + FONT + '" font-weight="' + weight + '" font-size="' + size + '"' + extra + ">" + esc(body) + "</text>"

export function cardSvg(input: ShareCardInput, measure: TextMeasure = approxMeasure): string {
  const { time, tier, bits } = input
  const W = 1200
  const H = 630
  const left = 60
  const colW = 620
  const words: { t: string; hi: boolean }[] = [
    ...["would", "take"].map((t) => ({ t, hi: false })),
    ...time.split(" ").filter(Boolean).map((t) => ({ t, hi: true })),
    ...["to", "guess."].map((t) => ({ t, hi: false })),
  ]

  let size = 64
  let lines: { t: string; hi: boolean; x: number; w: number }[][] = []
  for (; size >= 44; size -= 4) {
    const pad = size * 0.18
    const space = measure(" ", size, 800)
    lines = [[]]
    let x = 0
    for (let i = 0; i < words.length; i++) {
      const wd = words[i]
      const w = measure(wd.t, size, 800)
      const lead = wd.hi && !words[i - 1]?.hi ? pad : 0
      const trail = wd.hi && !words[i + 1]?.hi ? pad : 0
      const line = lines[lines.length - 1]
      if (line.length && x + space + lead + w + trail > colW) {
        lines.push([])
        x = 0
      } else if (line.length) x += space
      x += lead
      lines[lines.length - 1].push({ t: wd.t, hi: wd.hi, x, w })
      x += w + trail
    }
    if (lines.length <= 4) break
  }

  const lineH = Math.round(size * 1.08)
  const blockH = 30 + 12 + lines.length * lineH + 22 + 26
  let y = Math.max(70, Math.round((540 - blockH) / 2) + 20)
  let out = txt(left, y + 26, 28, 800, "MY NEW " + shareWhat(input).toUpperCase(), ' letter-spacing="3" fill="' + INK + '"')
  y += 30 + 12
  const pad = size * 0.18
  for (const line of lines) {
    const base = y + Math.round(size * 0.86)
    const hi = line.filter((w) => w.hi)
    if (hi.length) {
      const x0 = left + hi[0].x - pad
      const x1 = left + hi[hi.length - 1].x + hi[hi.length - 1].w + pad
      out += '<rect x="' + Math.round(x0) + '" y="' + Math.round(base - size * 0.84) + '" width="' + Math.round(x1 - x0) + '" height="' + Math.round(size * 1.06) + '" rx="' + Math.round(size * 0.15) + '" fill="' + BLUE + '"/>'
    }
    for (const w of line) out += txt(left + w.x, base, size, 800, w.t, ' fill="' + (w.hi ? "#FFFFFF" : INK) + '"')
    y += lineH
  }
  out += txt(left, y + 22 + 22, 25, 600, shareSub(input), ' fill="' + INK + '"')

  const scale = 2.3
  const loreW = 184 * scale
  const loreH = 158 * scale
  const loreX = left + colW + (W - 60 - left - colW - loreW) / 2
  const loreY = (H - 60 - loreH) / 2

  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">'
    + '<rect x="3" y="3" width="' + (W - 6) + '" height="' + (H - 6) + '" rx="26" fill="' + VOLT + '" stroke="' + INK + '" stroke-width="6"/>'
    + out
    + '<g transform="translate(' + Math.round(loreX) + " " + Math.round(loreY) + ") scale(" + scale + ') translate(12 14)">' + loreSvg(cardLook(tier)) + "</g>"
    + '<g transform="translate(' + left + ' 552) scale(1.25)"><path d="' + LOGO_MARK + '" fill="' + INK + '" fill-rule="evenodd"/></g>'
    + txt(left + 46, 586, 31, 800, "passlore.com", ' fill="' + INK + '"')
    + txt(W - 60, 584, 23, 700, "Made on my device · never uploaded", ' text-anchor="end" fill="' + INK + '"')
    + "</svg>"
}

function canvasMeasure(ctx: CanvasRenderingContext2D): TextMeasure {
  return (text, size, weight) => {
    ctx.font = weight + " " + size + "px " + FONT
    return ctx.measureText(text).width
  }
}

export function cardPng(input: ShareCardInput): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const c = document.createElement("canvas")
      c.width = 1200
      c.height = 630
      const ctx = c.getContext("2d")
      if (!ctx) {
        resolve(null)
        return
      }
      const img = new Image()
      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0)
          c.toBlob((b) => resolve(b), "image/png")
        } catch {
          resolve(null)
        }
      }
      img.onerror = () => resolve(null)
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(cardSvg(input, canvasMeasure(ctx)))
    } catch {
      resolve(null)
    }
  })
}

// Accepts either the crack() text or the card time with "about " already stripped.
export function shareText({ time, isPin }: ShareCardInput): string {
  const t = time || ""
  const full = /^(about |less than|—)/.test(t) || !t ? t : "about " + t
  return "My new " + (isPin ? "PIN" : "password") + " would take " + full + " to guess (estimate) — and Passlore never saw it. Cut yours at passlore.com"
}

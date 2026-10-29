import type { Tier } from "./types"

export type LoreCardMood = "cool" | "happy" | "worried"

export type ShareCardInput = { time: string; tier: Tier; bits: number; isWords: boolean; isPin?: boolean }

const dot = (x: number, y: number, r: number) => "M" + (x - r) + " " + y + "a" + r + " " + r + " 0 1 0 " + 2 * r + " 0a" + r + " " + r + " 0 1 0 " + -2 * r + " 0"

export function loreSvg(mood: LoreCardMood): string {
  const face = mood === "cool"
    ? '<path d="M42 56h22a3 3 0 0 1 3 3v4a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10v-4a3 3 0 0 1 3-3z M74 56h22a3 3 0 0 1 3 3v4a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10v-4a3 3 0 0 1 3-3z M66 60h9" fill="#0B0D17"/><path d="M56 82Q70 98 84 82Z" fill="#0B0D17"/>'
    : mood === "worried"
      ? '<path d="' + dot(56, 64, 6.5) + " " + dot(84, 64, 6.5) + '" fill="#0B0D17"/><path d="M46 56l12-6 M94 56l-12-6 M60 90Q70 81 80 90" fill="none" stroke="#0B0D17" stroke-width="3.5" stroke-linecap="round"/>'
      : '<path d="' + dot(56, 66, 5) + " " + dot(84, 66, 5) + '" fill="#0B0D17"/><path d="M56 80Q70 98 84 80Z" fill="#0B0D17"/>'
  return '<g transform="rotate(-8 80 70)"><path d="M60 104v14h-9 M80 104v14h9" fill="none" stroke="#0B0D17" stroke-width="3.5" stroke-linecap="round"/><path d="M88 58H142a7 7 0 0 1 7 7v6a7 7 0 0 1-7 7H88Z" fill="#2447F5" stroke="#0B0D17" stroke-width="3"/><path d="M116 78v13h9v-7h7v7h9V78" fill="#2447F5" stroke="#0B0D17" stroke-width="3" stroke-linejoin="round"/><path d="M34 56Q22 36 30 22" fill="none" stroke="#0B0D17" stroke-width="3.5" stroke-linecap="round"/><circle cx="30" cy="20" r="6.5" fill="#C8FF2E" stroke="#0B0D17" stroke-width="3"/><circle cx="70" cy="68" r="40" fill="#C8FF2E" stroke="#0B0D17" stroke-width="3.5"/><path d="M44 42a34 34 0 0 1 22-11" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".8"/>' + face + "</g>"
}

export function cardMood(tier: Tier): LoreCardMood {
  return tier.n >= 5 ? "cool" : tier.n >= 3 ? "happy" : "worried"
}

export function shareTime(crackText: string): string {
  return (crackText || "").replace(/^about /, "")
}

const esc = (t: string) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

export function cardSvg({ time, tier, bits, isWords, isPin }: ShareCardInput): string {
  const what = isPin ? "PIN" : isWords ? "passphrase" : "password"
  const words = ("would take " + time + " to guess.").split(" ")
  const lines: string[] = []
  let cur = ""
  for (const w of words) {
    if ((cur + " " + w).trim().length > 20) { lines.push(cur.trim()); cur = w } else cur += " " + w
  }
  if (cur.trim()) lines.push(cur.trim())
  const font = "Sora, 'Plus Jakarta Sans', Arial, Helvetica, sans-serif"
  let y = 230
  const body = lines.map((l) => {
    const t = '<text x="70" y="' + y + '" font-family="' + font + '" font-weight="800" font-size="64" letter-spacing="-1.5" fill="#0B0D17">' + esc(l) + "</text>"
    y += 74
    return t
  }).join("")
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">'
    + '<rect width="1200" height="630" fill="#C8FF2E"/><rect x="10" y="10" width="1180" height="610" rx="28" fill="none" stroke="#0B0D17" stroke-width="6"/>'
    + '<path d="M1040 70l8 20 20 8-20 8-8 20-8-20-20-8 20-8z M1120 200l5 13 13 5-13 5-5 13-5-13-13-5 13-5z" fill="#FFFFFF" stroke="#0B0D17" stroke-width="4"/>'
    + '<text x="70" y="130" font-family="' + font + '" font-weight="800" font-size="28" letter-spacing="3" fill="#0B0D17">MY NEW ' + what.toUpperCase() + "</text>"
    + body
    + '<text x="70" y="' + (y + 10) + '" font-family="' + font + '" font-weight="700" font-size="26" fill="#0B0D17">' + esc(tier.name + " · ≈ " + Math.round(bits) + " bits · estimate") + "</text>"
    + '<g transform="translate(780 150) scale(2.4)">' + loreSvg(cardMood(tier)) + "</g>"
    + '<text x="70" y="580" font-family="' + font + '" font-weight="800" font-size="30" fill="#0B0D17">passlore.com</text>'
    + '<text x="1130" y="580" text-anchor="end" font-family="' + font + '" font-weight="700" font-size="24" fill="#0B0D17">Made on my device · the password never left it</text>'
    + "</svg>"
}

export function cardPng(input: ShareCardInput): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const img = new Image()
      img.onload = () => {
        try {
          const c = document.createElement("canvas")
          c.width = 1200
          c.height = 630
          const ctx = c.getContext("2d")
          if (!ctx) { resolve(null); return }
          ctx.drawImage(img, 0, 0)
          c.toBlob((b) => resolve(b), "image/png")
        } catch {
          resolve(null)
        }
      }
      img.onerror = () => resolve(null)
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(cardSvg(input))
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

import type { Icon } from "@phosphor-icons/react"
import {
  ClipboardText,
  DotsNine,
  Key,
  Lightning,
  Sliders,
  Stack,
  Television,
  Vault,
  WifiHigh,
} from "@phosphor-icons/react"
import type { RecipeId } from "@/lib/generator"

export type RecipeDef = {
  id: RecipeId
  deck: boolean
  name: string
  short: string
  line: string
  title: string
  why: string
  icon: Icon
}

export const RECIPES: RecipeDef[] = [
  { id: "quick", deck: true, name: "Just one", short: "Just one", line: "Strong, random, ready now", title: "Just one, ready to paste", why: "Random characters from all four types. Strong for nearly any account — let your password manager remember it.", icon: Lightning },
  { id: "manager", deck: true, name: "Password manager", short: "Manager", line: "You’ll never type it", title: "For your password manager", why: "Your manager fills it in, so length costs nothing. If a site rejects something this long, use Build your own → Fit site rules.", icon: Vault },
  { id: "form", deck: false, name: "Site rules", short: "Form", line: "Paste the site’s rules", title: "Fit a site’s rules", why: "Paste the site’s rules. Passlore reads them on this device, then cuts the longest password they allow, using every character type they accept.", icon: ClipboardText },
  { id: "wifi", deck: true, name: "Wi-Fi", short: "Wi-Fi", line: "Read it out, or scan a QR", title: "For your Wi-Fi", why: "Random words are easy to read out and type on a phone, and stay well inside Wi-Fi’s 8–63 character limit. Guests can scan the QR instead of typing.", icon: WifiHigh },
  { id: "tv", deck: false, name: "TV & consoles", short: "TV", line: "Typing with a remote", title: "For a TV or games console", why: "Lowercase words with spaces: every on-screen keyboard has them on its first page, so nobody hunts for symbols with a remote.", icon: Television },
  { id: "master", deck: false, name: "Master password", short: "Master", line: "The one you remember", title: "Your master password", why: "The password that unlocks all the others has to live in your head. Seven random words are strong and learnable.", icon: Key },
  { id: "pin", deck: true, name: "PIN", short: "PIN", line: "Phone, card, door", title: "A PIN", why: "Digits only. A PIN is safe only where guesses are limited — the device locks after a few wrong tries. Obvious PINs are skipped.", icon: DotsNine },
  { id: "bulk", deck: false, name: "Many at once", short: "Many", line: "For a team or test accounts", title: "Many at once", why: "Up to 500 from one recipe, each cut independently. Export as text, CSV or JSON for onboarding or test accounts.", icon: Stack },
  { id: "custom", deck: true, name: "Build your own", short: "Custom", line: "Words, site rules, many", title: "Build your own", why: "Pick characters or words, fit a site’s password rules, or make many at once.", icon: Sliders },
]

export const DECK = RECIPES.filter((r) => r.deck)

export function recipeDef(id: RecipeId): RecipeDef {
  return RECIPES.find((r) => r.id === id) ?? RECIPES[0]
}

export function deckOf(id: RecipeId): RecipeId {
  return id === "form" || id === "bulk" || id === "tv" || id === "master" ? "custom" : id
}

export type BuildKind = "random" | "words" | "rules" | "many"

export const BUILD_KINDS: [BuildKind, string][] = [
  ["random", "Characters"],
  ["words", "Words"],
  ["rules", "Fit site rules"],
  ["many", "Many at once"],
]

export const BUILD_ANNOUNCE: Record<BuildKind, string> = {
  random: "characters",
  words: "words",
  rules: "fit a site’s rules",
  many: "many at once",
}

export const NEXT_STEPS: Partial<Record<RecipeId, string[]>> & { _: string[] } = {
  wifi: ["Change the password in your router’s settings", "Show the QR to guests, or read it out", "Empty the drawer when you’re done"],
  tv: ["Type it on the TV, word by word", "Save it in your password manager too", "Empty the drawer when you’re done"],
  master: ["Set it in your password manager", "Say it to yourself a few times today", "Keep a paper copy at home for now"],
  pin: ["Set it on the device", "Don’t write it next to the device", "Never reuse it for a card and a phone"],
  bulk: ["Hand each one to its owner", "Ask them to change it at first sign-in", "Delete any exported file"],
  _: ["Paste it into the site", "Save it in your password manager", "Empty the drawer when you’re done"],
}

export function stubNote(id: RecipeId): string {
  if (id === "wifi") return "Or let guests scan the QR below"
  if (id === "form") return "Checked against the rules below"
  return "Lands in this tab’s drawer"
}

export function isWordsRecipe(id: RecipeId, kind: string): boolean {
  return id === "wifi" || id === "tv" || id === "master" || (id === "custom" && kind === "words")
}

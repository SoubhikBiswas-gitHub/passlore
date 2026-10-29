import { SETS } from "./charsets"
import { pickN } from "./random"
import { customPool, quickPool, wordsOrFallback } from "./generate"
import { formConflict, formLen, formOk, formPool, formRules } from "./siteRules"
import type { Config, Crack, MetricNote, Metrics, RecipeId, Tier } from "./types"

const L2 = Math.log2

let formKey = ""
let formShare = 1

function formShareOf(key: string, sample: () => boolean): number {
  if (formKey !== key) {
    let hits = 0
    const T = 600
    for (let i = 0; i < T; i++) if (sample()) hits++
    formKey = key
    formShare = Math.max(hits, 1) / T
  }
  return formShare
}

export function metrics(recipe: RecipeId, cfg: Config, words: string[]): Metrics {
  const notes: MetricNote[] = []
  const wordMetrics = (n: number): Metrics => {
    const N = wordsOrFallback(words).length
    return { bits: n * L2(N), pool: null, formula: "log₂(" + N.toLocaleString("en-GB") + " words) × " + n + " = " + (n * L2(N)).toFixed(1) + " bits", notes }
  }
  switch (recipe) {
    case "quick": {
      const c = cfg.quick
      const p = quickPool(c).length
      return { bits: c.length * L2(p), pool: p, formula: "log₂(" + p + " characters) × " + c.length + " = " + (c.length * L2(p)).toFixed(1) + " bits", notes }
    }
    case "manager": {
      const c = cfg.manager
      const p = 89
      return { bits: c.length * L2(p), pool: p, formula: "log₂(89 characters) × " + c.length + " = " + (c.length * L2(p)).toFixed(1) + " bits", notes }
    }
    case "form": {
      const r = formRules(cfg.form)
      const P = formPool(r)
      const L = formLen(r)
      if (formConflict(r)) return { bits: 0, pool: null, formula: "—", notes }
      const share = formShareOf(JSON.stringify(r) + L, () => formOk(pickN(P.all, L), r, P))
      const bits = L * L2(P.all.length) + L2(share)
      return { bits, pool: P.all.length, formula: "log₂(" + P.all.length + ") × " + L + " + log₂(share meeting every rule ≈ " + share.toFixed(2) + ") ≈ " + bits.toFixed(1) + " bits", notes }
    }
    case "wifi": return wordMetrics(cfg.wifi.words)
    case "tv": return wordMetrics(cfg.tv.words)
    case "master": return wordMetrics(cfg.master.words)
    case "pin": {
      const c = cfg.pin
      notes.push({ tone: "warning", text: "Only safe where guesses are limited. Against unlimited guessing, any PIN falls almost at once." })
      const b = c.digits * L2(10)
      return { bits: b, pool: 10, formula: "log₂(10) × " + c.digits + " = " + b.toFixed(1) + " bits" + (c.skip ? ", slightly less with obvious PINs skipped" : ""), notes }
    }
    case "bulk": {
      const c = cfg.bulk
      return { bits: c.length * L2(89), pool: 89, formula: "Each: log₂(89) × " + c.length + " = " + (c.length * L2(89)).toFixed(1) + " bits", notes }
    }
    default: {
      const c = cfg.custom
      if (c.kind === "words") return wordMetrics(c.words)
      if (c.kind === "pron") {
        const a = Math.ceil(c.pronLen / 2), v = Math.floor(c.pronLen / 2)
        const b = a * L2(21) + v * L2(5)
        notes.push({ tone: "warning", text: "Sayable, but each character carries about 3.4 bits instead of up to 6.5." })
        return { bits: b, pool: null, formula: a + " × log₂(21) + " + v + " × log₂(5) = " + b.toFixed(1) + " bits", notes }
      }
      if (c.kind === "digits") {
        const b = c.length * L2(10)
        return { bits: b, pool: 10, formula: "log₂(10) × " + c.length + " = " + b.toFixed(1) + " bits", notes }
      }
      if (c.kind === "pattern") {
        let b = 0, lit = 0
        const t = c.pattern || ""
        for (let i = 0; i < t.length; i++) {
          const ch = t[i]
          if (ch === "\\") { i++; lit++; continue }
          const n = ch === "A" || ch === "a" ? 26 : ch === "0" ? 10 : ch === "!" ? SETS.S.length : ch === "?" ? 89 : 0
          if (n) b += L2(n)
          else lit++
        }
        if (lit) notes.push({ tone: "info", text: lit + " typed-as-is character" + (lit > 1 ? "s" : "") + " add no unpredictability." })
        return { bits: b, pool: null, formula: "Sum of log₂(choices) per random slot = " + b.toFixed(1) + " bits", notes }
      }
      const p = customPool(c).length
      const n = Math.max(0, c.length - (c.include || "").length)
      const fixed = (c.include || "").length + (c.prefix || "").length + (c.suffix || "").length
      if (fixed) notes.push({ tone: "info", text: "Fixed text, prefix and suffix add " + fixed + " characters but no unpredictability, so they aren’t counted." })
      const b = p && n >= 4 ? n * L2(p) : 0
      return { bits: b, pool: p, formula: "log₂(" + p + ") × " + n + " random = " + b.toFixed(1) + " bits", notes }
    }
  }
}

const TIERS: Tier[] = [
  { n: 1, name: "Very weak", tone: "danger", line: "guessable almost at once" },
  { n: 2, name: "Weak", tone: "danger", line: "falls fast to an offline attack" },
  { n: 3, name: "Fair", tone: "warning", line: "fine where guesses are limited" },
  { n: 4, name: "Strong", tone: "success", line: "good for almost any account" },
  { n: 5, name: "Very strong", tone: "success", line: "beyond what guessing can reach" },
]

export function tier(bits: number): Tier {
  return bits < 28 ? TIERS[0] : bits < 50 ? TIERS[1] : bits < 70 ? TIERS[2] : bits < 100 ? TIERS[3] : TIERS[4]
}

const BIG: [number, string][] = [[1e12, "trillion"], [1e9, "billion"], [1e6, "million"], [1e3, "thousand"]]
const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹"

export function crack(bits: number): Crack {
  if (bits <= 0) return { lg: -3, text: "—", cmp: "" }
  const lg = (bits - 1) * Math.log10(2) - 11
  const s = Math.pow(10, lg)
  const r = (x: number) => (x < 10 ? x.toFixed(1).replace(".0", "") : String(Math.round(x)))
  const y = s / 31557600
  let text = ""
  if (lg < 0) text = "less than a second"
  else if (s < 60) text = "about " + r(s) + " seconds"
  else if (s < 3600) text = "about " + r(s / 60) + " minutes"
  else if (s < 86400) text = "about " + r(s / 3600) + " hours"
  else if (y < 1) text = "about " + r(s / 86400) + " days"
  else if (y < 1000) text = "about " + r(y) + " years"
  else if (y < 1e15) {
    for (const [size, word] of BIG) if (y >= size) { text = "about " + r(y / size) + " " + word + " years"; break }
  } else text = "about 10" + String(Math.floor(Math.log10(y))).split("").map((d) => SUPERSCRIPT[+d]).join("") + " years"
  let cmp: string
  const U = 13.8e9
  if (y >= U) {
    const k = y / U
    cmp = k < 1000 ? "≈ " + Math.round(k).toLocaleString("en-GB") + "× the age of the universe" : "far longer than the universe has existed"
  } else if (y >= 4.54e9) cmp = "longer than the Earth has existed"
  else if (y >= 3e5) cmp = "longer than humans have existed"
  else if (y >= 5000) cmp = "longer than all of recorded history"
  else if (y >= 80) cmp = "longer than a lifetime"
  else if (y >= 1) cmp = "within a lifetime"
  else if (s >= 86400) cmp = "days, not years"
  else cmp = "faster than you could read this"
  return { lg, text, cmp }
}

export const STRENGTH_MARKS: [string, number][] = [
  ["a second", 0],
  ["an hour", 3.556],
  ["a year", 7.499],
  ["a lifetime", 9.402],
  ["recorded history", 11.198],
  ["age of the universe", 17.639],
]

export function rulerPct(lg: number): number {
  return Math.round(Math.max(0, Math.min(100, ((lg + 2) / 32) * 100)) * 10) / 10
}

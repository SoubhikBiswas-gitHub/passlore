import { SETS, uniq } from "./charsets"
import { pickN, rnd } from "./random"
import { formConflict, formLen, formOk, formPool, formRules } from "./siteRules"
import { FALLBACK_WORDS } from "./wordlist"
import type { Config, GenResult, RecipeId } from "./types"

const OBVIOUS_PINS = ["2580", "0852", "1004", "6969", "1122", "1313", "5683", "0007", "7777", "123123", "112233", "696969", "159753", "147258"]

export function defaultCfg(): Config {
  return {
    quick: { length: 16, symbols: true, noSimilar: false },
    manager: { length: 32 },
    form: { text: "", ov: {} },
    wifi: { ssid: "", words: 6, sep: "-" },
    tv: { words: 6 },
    master: { words: 7 },
    pin: { digits: 6, skip: true },
    bulk: { count: 20, length: 16, format: "txt" },
    custom: {
      kind: "random", length: 16, upper: true, lower: true, digits: true, symbols: true, noSimilar: false,
      exclude: "", include: "", prefix: "", suffix: "", words: 6, sep: "-", pronLen: 12, pattern: "Aaaa-0000-!!!!",
    },
  }
}

export function wordsOrFallback(words: string[] | null | undefined): string[] {
  return words && words.length ? words : FALLBACK_WORDS
}

export function obviousPin(p: string): boolean {
  if (/^(\d)\1+$/.test(p)) return true
  const asc = "01234567890123456789", desc = "98765432109876543210"
  if (asc.indexOf(p) >= 0 || desc.indexOf(p) >= 0) return true
  if (/^(\d\d)\1+$/.test(p) || /^(\d\d\d)\1+$/.test(p)) return true
  if (p.length === 4 && /^(19|20)\d\d$/.test(p)) return true
  return OBVIOUS_PINS.indexOf(p) >= 0
}

export function phrase(n: number, sep: string, words: string[]): string {
  const W = wordsOrFallback(words)
  const w: string[] = []
  for (let i = 0; i < n; i++) w.push(W[rnd(W.length)])
  return w.join(sep)
}

export function quickPool(c: Config["quick"]): string {
  let p = SETS.U + SETS.L + SETS.D + (c.symbols ? SETS.S : "")
  if (c.noSimilar) p = p.split("").filter((x) => SETS.SIM.indexOf(x) < 0).join("")
  return p
}

export function customPool(c: Config["custom"]): string {
  const p = (c.upper ? SETS.U : "") + (c.lower ? SETS.L : "") + (c.digits ? SETS.D : "") + (c.symbols ? SETS.S : "")
  const drop = (c.noSimilar ? SETS.SIM : "") + (c.exclude || "")
  return uniq(p).split("").filter((x) => drop.indexOf(x) < 0).join("")
}

const ok = (password: string): GenResult => ({ password, err: "", bulk: [] })

export function genForm(form: Config["form"]): GenResult {
  const r = formRules(form)
  if (formConflict(r)) return { password: "", err: "form", bulk: [] }
  const P = formPool(r)
  const L = formLen(r)
  for (let i = 0; i < 4000; i++) {
    const pw = pickN(P.all, L)
    if (formOk(pw, r, P)) return ok(pw)
  }
  return { password: "", err: "form", bulk: [] }
}

export function genCustom(c: Config["custom"], words: string[]): GenResult {
  if (c.kind === "words") return ok(phrase(c.words, c.sep, words))
  if (c.kind === "pron") {
    const cs = "bcdfghjklmnpqrstvwxyz", v = "aeiou"
    let o = ""
    for (let i = 0; i < c.pronLen; i++) o += i % 2 === 0 ? cs[rnd(21)] : v[rnd(5)]
    return ok(o)
  }
  if (c.kind === "digits") return ok(pickN(SETS.D, c.length))
  if (c.kind === "pattern") {
    const t = c.pattern || ""
    let out = "", rand = 0
    for (let i = 0; i < t.length; i++) {
      const ch = t[i]
      if (ch === "\\") {
        if (i + 1 < t.length) { out += t[i + 1]; i++ }
        continue
      }
      const set = ch === "A" ? SETS.U : ch === "a" ? SETS.L : ch === "0" ? SETS.D : ch === "!" ? SETS.S : ch === "?" ? SETS.U + SETS.L + SETS.D + SETS.S : ""
      if (set) { out += set[rnd(set.length)]; rand++ } else out += ch
    }
    if (!rand) return { password: "", err: "pattern", bulk: [] }
    return ok(out)
  }
  const p = customPool(c)
  const inc = c.include || ""
  const n = c.length - inc.length
  if (!p.length) return { password: "", err: "empty", bulk: [] }
  if (n < 4) return { password: "", err: "fixed", bulk: [] }
  const out = pickN(p, n).split("")
  if (inc) out.splice(rnd(n + 1), 0, inc)
  return ok((c.prefix || "") + out.join("") + (c.suffix || ""))
}

export function gen(recipe: RecipeId, cfg: Config, words: string[]): GenResult {
  const all = SETS.U + SETS.L + SETS.D + SETS.S
  switch (recipe) {
    case "quick": return ok(pickN(quickPool(cfg.quick), cfg.quick.length))
    case "manager": return ok(pickN(all, cfg.manager.length))
    case "form": return genForm(cfg.form)
    case "wifi": return ok(phrase(cfg.wifi.words, cfg.wifi.sep, words))
    case "tv": return ok(phrase(cfg.tv.words, " ", words))
    case "master": return ok(phrase(cfg.master.words, " ", words))
    case "pin": {
      const c = cfg.pin
      let p = ""
      for (let i = 0; i < 200; i++) {
        p = pickN(SETS.D, c.digits)
        if (!c.skip || !obviousPin(p)) break
      }
      return ok(p)
    }
    case "bulk": {
      const list: string[] = []
      for (let i = 0; i < cfg.bulk.count; i++) list.push(pickN(all, cfg.bulk.length))
      return { password: "", err: "", bulk: list }
    }
    default: return genCustom(cfg.custom, words)
  }
}

import { SETS, uniq } from "./charsets"
import type { Config, Conflict, FormRules, ParsedRules } from "./types"

export type FormPool = { U: string; L: string; D: string; S: string; all: string }

export function parseRules(text: string): ParsedRules {
  const t = (text || "").toLowerCase().replace(/–|—/g, "-")
  const r: ParsedRules = {
    min: null, max: null, upper: false, lower: false, digit: false, symbol: false,
    noSymbols: false, syms: null, noSpaces: false, startLetter: false, found: [],
  }
  let m = t.match(/(\d{1,3})\s*(?:-|to)\s*(\d{1,3})\s*(?:characters|chars|letters|long)?/)
  if (m) { r.min = +m[1]; r.max = +m[2]; r.found.push("len") }
  m = t.match(/(?:at least|minimum(?: of)?|min\.?)\s*(\d{1,3})/)
  if (m && r.min == null) { r.min = +m[1]; r.found.push("min") }
  m = t.match(/(?:at most|maximum(?: of)?|max\.?|no more than|up to)\s*(\d{1,3})/)
  if (m && r.max == null) { r.max = +m[1]; r.found.push("max") }
  if (/upper\s?case|capital/.test(t)) r.upper = true
  if (/lower\s?case/.test(t)) r.lower = true
  if (/\b(number|digit|numeral)s?\b/.test(t)) r.digit = true
  if (/no (special|symbol)|only letters and (numbers|digits)|alphanumeric|letters and numbers only/.test(t)) r.noSymbols = true
  else if (/special|symbol|punctuation/.test(t)) r.symbol = true
  m = t.match(/\(\s*([^\sa-z0-9()]{2,})\s*\)/)
    || t.match(/(?:symbols?|special characters?)[^:]{0,30}:\s*([^\sa-z0-9]{2,})/)
    || t.match(/(?:only|allowed)[^.]{0,30}?([!@#$%^&*_\-+=.?~]{2,})/)
  if (m && !r.noSymbols) r.syms = uniq(m[1].replace(/[^\x21-\x7E]|[a-z0-9]/g, ""))
  if (/no spaces?|without spaces|cannot contain spaces/.test(t)) r.noSpaces = true
  if (/(start|begin)s?\s+with\s+a\s+letter/.test(t)) r.startLetter = true
  return r
}

export function formRules(form: Config["form"]): FormRules & { parsed: ParsedRules } {
  const p = parseRules(form.text)
  const o = form.ov || {}
  const take = <K extends keyof FormRules>(k: K, v: FormRules[K]): FormRules[K] => (o[k] !== undefined ? (o[k] as FormRules[K]) : v)
  return {
    min: take("min", p.min),
    max: take("max", p.max),
    upper: take("upper", p.upper),
    lower: take("lower", p.lower),
    digit: take("digit", p.digit),
    symbol: take("symbol", p.symbol),
    noSymbols: take("noSymbols", p.noSymbols),
    syms: take("syms", p.syms),
    noSpaces: true,
    startLetter: take("startLetter", p.startLetter),
    parsed: p,
  }
}

export function formPool(r: FormRules): FormPool {
  const sym = r.noSymbols ? "" : r.syms != null ? r.syms : SETS.S
  return { U: SETS.U, L: SETS.L, D: SETS.D, S: sym, all: SETS.U + SETS.L + SETS.D + sym }
}

export function formLen(r: FormRules): number {
  const len = r.max != null ? r.max : Math.max(r.min || 0, 20)
  return Math.max(1, Math.min(128, len))
}

export function formOk(pw: string, r: FormRules, P: FormPool): boolean {
  if (r.upper && !/[A-Z]/.test(pw)) return false
  if (r.lower && !/[a-z]/.test(pw)) return false
  if (r.digit && !/[0-9]/.test(pw)) return false
  if (r.symbol && !pw.split("").some((c) => P.S.indexOf(c) >= 0)) return false
  if (r.startLetter && !/^[A-Za-z]/.test(pw)) return false
  return true
}

export function formConflict(r: FormRules): Conflict | null {
  const P = formPool(r)
  const need = (r.upper ? 1 : 0) + (r.lower ? 1 : 0) + (r.digit ? 1 : 0) + (r.symbol ? 1 : 0)
  if (r.min != null && r.max != null && r.min > r.max) {
    return { title: "The length rules contradict each other", text: "Shortest is " + r.min + " but longest is " + r.max + ". Check the numbers you pasted.", fix: "Use " + r.max + " as both", patch: { min: r.max } }
  }
  if (r.symbol && !P.S.length) {
    return { title: "A symbol is required, but none are allowed", text: "The rules ask for a symbol and also allow no symbols. One of them is probably a misread — check the site.", fix: "Drop the symbol requirement", patch: { symbol: false } }
  }
  if (need > formLen(r)) {
    return { title: "Too short for everything it requires", text: "It must include " + need + " kinds of character but can only be " + formLen(r) + " long.", fix: "Allow " + need + " characters", patch: { max: need } }
  }
  return null
}

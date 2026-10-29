const NATO: Record<string, string> = {
  a: "alfa", b: "bravo", c: "charlie", d: "delta", e: "echo", f: "foxtrot", g: "golf", h: "hotel", i: "india",
  j: "juliett", k: "kilo", l: "lima", m: "mike", n: "november", o: "oscar", p: "papa", q: "quebec", r: "romeo",
  s: "sierra", t: "tango", u: "uniform", v: "victor", w: "whiskey", x: "x-ray", y: "yankee", z: "zulu",
}

const DIGITS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

const SYMBOLS: Record<string, string> = {
  "!": "exclamation", "@": "at", "#": "hash", "$": "dollar", "%": "percent", "^": "caret", "&": "ampersand",
  "*": "asterisk", "(": "open paren", ")": "close paren", "-": "hyphen", _: "underscore", "=": "equals", "+": "plus",
  "[": "open bracket", "]": "close bracket", "{": "open brace", "}": "close brace", ";": "semicolon", ":": "colon",
  ",": "comma", ".": "dot", "<": "less than", ">": "greater than", "/": "slash", "?": "question", "~": "tilde",
  " ": "space", "\\": "backslash", "|": "bar",
}

export type CharKind = "upper" | "lower" | "digit" | "space" | "symbol"

export function kindOf(ch: string): CharKind {
  if (ch >= "0" && ch <= "9") return "digit"
  if (ch >= "A" && ch <= "Z") return "upper"
  if (ch >= "a" && ch <= "z") return "lower"
  if (ch === " ") return "space"
  return "symbol"
}

export function sayChar(ch: string): string {
  const k = kindOf(ch)
  if (k === "upper") return "capital " + NATO[ch.toLowerCase()]
  if (k === "lower") return NATO[ch]
  if (k === "digit") return DIGITS[+ch]
  return SYMBOLS[ch] ?? ch
}

export function sayPassword(pw: string): string {
  return pw.split("").map(sayChar).join(", ")
}

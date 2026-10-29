export type RecipeId = "quick" | "manager" | "form" | "wifi" | "tv" | "master" | "pin" | "bulk" | "custom"

export type CustomKind = "random" | "words" | "pron" | "digits" | "pattern"

export type FormRules = {
  min: number | null
  max: number | null
  upper: boolean
  lower: boolean
  digit: boolean
  symbol: boolean
  noSymbols: boolean
  syms: string | null
  noSpaces: boolean
  startLetter: boolean
}

export type ParsedRules = FormRules & { found: string[] }

export type Conflict = { title: string; text: string; fix: string; patch: Partial<FormRules> }

export type Config = {
  quick: { length: number; symbols: boolean; noSimilar: boolean }
  manager: { length: number }
  form: { text: string; ov: Partial<FormRules> }
  wifi: { ssid: string; words: number; sep: string }
  tv: { words: number }
  master: { words: number }
  pin: { digits: number; skip: boolean }
  bulk: { count: number; length: number; format: "txt" | "csv" | "json" }
  custom: {
    kind: CustomKind
    length: number
    upper: boolean
    lower: boolean
    digits: boolean
    symbols: boolean
    noSimilar: boolean
    exclude: string
    include: string
    prefix: string
    suffix: string
    words: number
    sep: string
    pronLen: number
    pattern: string
  }
}

export type GenError = "" | "form" | "pattern" | "empty" | "fixed"

export type GenResult = { password: string; err: GenError; bulk: string[] }

export type MetricNote = { tone: "warning" | "info"; text: string }

export type Metrics = { bits: number; pool: number | null; formula: string; notes: MetricNote[] }

export type TierTone = "danger" | "warning" | "success"

export type Tier = { n: 1 | 2 | 3 | 4 | 5; name: string; tone: TierTone; line: string }

export type Crack = { lg: number; text: string; cmp: string }

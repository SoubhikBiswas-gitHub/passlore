const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LOWER = "abcdefghijklmnopqrstuvwxyz"
const NUMS = "0123456789"
const SYMS = "!@#$%^&*()-_=+[]{}|;:,.<>?"
const SIMILAR = "0O1lI|"
const AMBIGUOUS = "{}[]()/\\'\"`~,;:.<>"

const CONSONANTS = "bcdfghjklmnpqrstvwxyz"
const VOWELS = "aeiou"

export type GeneratorOptions = {
  length: number
  upper: boolean
  lower: boolean
  numbers: boolean
  symbols: boolean
  noSimilar: boolean
  noAmbiguous: boolean
  excludeChars: string
  includeChars: string
  prefix: string
  suffix: string
}

function cryptoRandom(max: number): number {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] % max
}

export function buildCharset(opts: GeneratorOptions): string {
  let charset = ""
  if (opts.upper) charset += UPPER
  if (opts.lower) charset += LOWER
  if (opts.numbers) charset += NUMS
  if (opts.symbols) charset += SYMS

  if (opts.noSimilar) {
    charset = charset
      .split("")
      .filter((c) => !SIMILAR.includes(c))
      .join("")
  }

  if (opts.noAmbiguous) {
    charset = charset
      .split("")
      .filter((c) => !AMBIGUOUS.includes(c))
      .join("")
  }

  if (opts.excludeChars) {
    const excludeSet = new Set(opts.excludeChars.split(""))
    charset = charset
      .split("")
      .filter((c) => !excludeSet.has(c))
      .join("")
  }

  if (charset.length === 0) {
    charset = LOWER
  }

  return charset
}

export function generatePassword(opts: GeneratorOptions): string {
  const charset = buildCharset(opts)
  const prefixLen = opts.prefix.length
  const suffixLen = opts.suffix.length
  const includeLen = opts.includeChars.length
  const randomLen = Math.max(0, opts.length - prefixLen - suffixLen - includeLen)

  let password = ""
  for (let i = 0; i < randomLen; i++) {
    password += charset[cryptoRandom(charset.length)]
  }

  if (opts.includeChars) {
    const insertPos = cryptoRandom(password.length + 1)
    password = password.slice(0, insertPos) + opts.includeChars + password.slice(insertPos)
  }

  password = opts.prefix + password + opts.suffix

  return password
}

export function generateBulk(opts: GeneratorOptions, count: number): string[] {
  return Array.from({ length: count }, () => generatePassword(opts))
}

export function generatePronounceable(length: number): string {
  let password = ""
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      password += CONSONANTS[cryptoRandom(CONSONANTS.length)]
    } else {
      password += VOWELS[cryptoRandom(VOWELS.length)]
    }
  }
  return password
}

export function generatePin(length: number): string {
  let pin = ""
  for (let i = 0; i < length; i++) {
    pin += NUMS[cryptoRandom(NUMS.length)]
  }
  return pin
}

export function generatePattern(pattern: string): string {
  let result = ""
  for (const char of pattern) {
    switch (char) {
      case "A":
        result += UPPER[cryptoRandom(UPPER.length)]
        break
      case "a":
        result += LOWER[cryptoRandom(LOWER.length)]
        break
      case "0":
        result += NUMS[cryptoRandom(NUMS.length)]
        break
      case "!":
        result += SYMS[cryptoRandom(SYMS.length)]
        break
      case "*":
        const allChars = UPPER + LOWER + NUMS + SYMS
        result += allChars[cryptoRandom(allChars.length)]
        break
      default:
        result += char
    }
  }
  return result
}

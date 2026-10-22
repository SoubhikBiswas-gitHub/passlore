import { test, expect } from "@playwright/test"
import { buildCharset, generatePassword, generatePin, generateBulk, type GeneratorOptions } from "../lib/generate"
import { generatePassphrase } from "../lib/passphrase"
import { randomIndex } from "../lib/unbiased-random"
import { WORDS } from "../lib/words"

const options: GeneratorOptions = {
  length: 32, upper: true, lower: true, numbers: true, symbols: true,
  noSimilar: false, noAmbiguous: false, excludeChars: "", includeChars: "", prefix: "", suffix: "",
}

test("restricted passwords respect length and excluded characters", () => {
  const opts = { ...options, upper: false, symbols: false, noSimilar: true, excludeChars: "abc" }
  for (const password of generateBulk(opts, 50)) {
    expect(password).toHaveLength(32)
    expect(password).toMatch(/^[a-z2-9]+$/)
    expect(password).not.toMatch(/[abc0O1lI|]/)
  }
})

test("fixed fragments fit within the requested password length", () => {
  const password = generatePassword({ ...options, prefix: "start-", suffix: "-end", includeChars: "XYZ" })
  expect(password).toHaveLength(32)
  expect(password.startsWith("start-")).toBe(true)
  expect(password.endsWith("-end")).toBe(true)
  expect(password).toContain("XYZ")
})

test("PINs and passphrases retain their selected format", () => {
  expect(generatePin(12)).toMatch(/^\d{12}$/)
  const words = generatePassphrase(6, "-").split("-")
  expect(words).toHaveLength(6)
  for (const word of words) expect(WORDS).toContain(word)
  expect(buildCharset({ ...options, upper: false, lower: false, numbers: false, symbols: false }).length).toBeGreaterThan(0)
})

test("random indices reject invalid bounds and biased samples", () => {
  for (const max of [0, -1, 1.5, NaN]) expect(() => randomIndex(max)).toThrow(RangeError)
  expect(randomIndex(1)).toBe(0)
  const original = crypto.getRandomValues
  let calls = 0
  crypto.getRandomValues = ((array: Uint32Array) => {
    array[0] = calls++ === 0 ? 0xffffffff : 7
    return array
  }) as typeof crypto.getRandomValues
  try {
    expect(randomIndex(10)).toBe(7)
    expect(calls).toBe(2)
  } finally {
    crypto.getRandomValues = original
  }
})

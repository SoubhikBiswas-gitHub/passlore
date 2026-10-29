import { test, expect } from "@playwright/test"
import {
  FALLBACK_WORDS, SETS, STRENGTH_MARKS, checkLeak, crack, defaultCfg, formConflict, formRules, gen, loadEffWords,
  metrics, obviousPin, parseRules, rnd, rulerPct, sha1Hex, tier, wifiPayload, qrMatrix, cardSvg, shareText,
  type FormRules,
} from "../lib/generator"

const README_RULES = "Your password must be 8-16 characters long and include at least one uppercase letter, one number and one special character (!@#$%). Spaces are not allowed."

const rules = (patch: Partial<FormRules>): FormRules => ({
  min: null, max: null, upper: false, lower: false, digit: false, symbol: false,
  noSymbols: false, syms: null, noSpaces: true, startLetter: false, ...patch,
})

test("rnd rejects invalid bounds and biased samples", () => {
  for (const n of [0, -1, 1.5, NaN, Infinity]) expect(() => rnd(n)).toThrow(RangeError)
  expect(rnd(1)).toBe(0)
  const original = crypto.getRandomValues
  let calls = 0
  crypto.getRandomValues = (<T extends ArrayBufferView | null>(array: T) => {
    ;(array as unknown as Uint32Array)[0] = calls++ === 0 ? 0xffffffff : 7
    return array
  }) as typeof crypto.getRandomValues
  try {
    expect(rnd(10)).toBe(7)
    expect(calls).toBe(2)
  } finally {
    crypto.getRandomValues = original
  }
})

test("every recipe returns the right shape", () => {
  const cfg = defaultCfg()
  const words = FALLBACK_WORDS
  const quick = gen("quick", cfg, words)
  expect(quick.err).toBe("")
  expect(quick.password).toHaveLength(16)
  expect(gen("manager", cfg, words).password).toHaveLength(32)

  for (let i = 0; i < 50; i++) {
    const pin = gen("pin", cfg, words).password
    expect(pin).toMatch(/^\d{6}$/)
    expect(obviousPin(pin)).toBe(false)
  }

  const wifi = gen("wifi", cfg, words).password.split("-")
  expect(wifi).toHaveLength(6)
  for (const w of wifi) expect(words).toContain(w)
  expect(gen("tv", cfg, words).password.split(" ")).toHaveLength(6)
  expect(gen("master", cfg, words).password.split(" ")).toHaveLength(7)

  const bulk = gen("bulk", cfg, words)
  expect(bulk.password).toBe("")
  expect(bulk.bulk).toHaveLength(20)
  for (const b of bulk.bulk) expect(b).toHaveLength(16)

  expect(gen("custom", cfg, words).password).toHaveLength(16)

  cfg.form.text = README_RULES
  const form = gen("form", cfg, words)
  expect(form.err).toBe("")
  expect(form.password).toHaveLength(16)
  expect(form.password).toMatch(/[A-Z]/)
  expect(form.password).toMatch(/[0-9]/)
  expect(form.password).toMatch(/[!@#$%]/)
  expect(form.password).toMatch(/^[A-Za-z0-9!@#$%]+$/)
})

test("an empty word list falls back to the built-in words", () => {
  const cfg = defaultCfg()
  const pass = gen("wifi", cfg, []).password.split("-")
  expect(pass).toHaveLength(6)
  for (const w of pass) expect(FALLBACK_WORDS).toContain(w)
  expect(new Set(FALLBACK_WORDS).size).toBe(FALLBACK_WORDS.length)
})

test("the EFF list loads with 7,771 single words and no 'undefined'", async () => {
  const list = await loadEffWords()
  expect(list).toHaveLength(7771)
  expect(list).not.toContain("undefined")
  expect(list.some((w) => w.includes("-"))).toBe(false)
  expect(await loadEffWords()).toBe(list)
})

test("obvious PINs are recognised", () => {
  for (const p of ["1111", "1234", "9876", "121212", "123123", "1987", "2580", "147258"]) expect(obviousPin(p)).toBe(true)
  for (const p of ["4719", "830215"]) expect(obviousPin(p)).toBe(false)
})

test("custom recipes report empty, fixed and pattern errors", () => {
  const base = defaultCfg()
  const run = (patch: Partial<typeof base.custom>) => gen("custom", { ...base, custom: { ...base.custom, ...patch } }, FALLBACK_WORDS)

  expect(run({ upper: false, lower: false, digits: false, symbols: false }).err).toBe("empty")
  expect(run({ upper: false, lower: false, symbols: false, exclude: "0123456789" }).err).toBe("empty")
  expect(run({ length: 8, include: "hello" }).err).toBe("fixed")
  expect(run({ kind: "pattern", pattern: "xyz-#" }).err).toBe("pattern")
  expect(run({ kind: "pattern", pattern: "\\A\\a" }).err).toBe("pattern")

  const pattern = run({ kind: "pattern", pattern: "Aaaa-0000-!!!!" })
  expect(pattern.err).toBe("")
  expect(pattern.password).toMatch(/^[A-Z][a-z]{3}-\d{4}-[!@#$%^&*()\-_=+[\]{};:,.<>/?~]{4}$/)

  const fixed = run({ length: 20, prefix: "start-", suffix: "-end", include: "XYZ", upper: false, symbols: false, noSimilar: true, exclude: "abc" })
  expect(fixed.password.startsWith("start-")).toBe(true)
  expect(fixed.password.endsWith("-end")).toBe(true)
  expect(fixed.password).toContain("XYZ")
  expect(fixed.password).toHaveLength(6 + 20 + 4)
  const core = fixed.password.slice(6, -4).replace("XYZ", "")
  expect(core).toMatch(/^[d-z2-9]{17}$/)
  expect(core).not.toMatch(/[o]/)

  expect(run({ kind: "digits", length: 9 }).password).toMatch(/^\d{9}$/)
  expect(run({ kind: "pron", pronLen: 12 }).password).toMatch(/^([bcdfghjklmnpqrstvwxyz][aeiou]){6}$/)
  expect(run({ kind: "words", words: 4, sep: "." }).password.split(".")).toHaveLength(4)
})

test("parseRules reads the README example", () => {
  const r = parseRules(README_RULES)
  expect(r.min).toBe(8)
  expect(r.max).toBe(16)
  expect(r.upper).toBe(true)
  expect(r.lower).toBe(false)
  expect(r.digit).toBe(true)
  expect(r.symbol).toBe(true)
  expect(r.noSymbols).toBe(false)
  expect(r.syms).toBe("!@#$%")
  // "Spaces are not allowed" is not one of the parser's phrasings; formRules forbids spaces regardless.
  expect(r.noSpaces).toBe(false)
  expect(formRules({ text: README_RULES, ov: {} }).noSpaces).toBe(true)
  expect(parseRules("No spaces please").noSpaces).toBe(true)
  expect(r.startLetter).toBe(false)
  expect(r.found).toEqual(["len"])

  const other = parseRules("Minimum of 10. Alphanumeric only, must start with a letter, lowercase required.")
  expect(other.min).toBe(10)
  expect(other.noSymbols).toBe(true)
  expect(other.symbol).toBe(false)
  expect(other.startLetter).toBe(true)
  expect(other.lower).toBe(true)
})

test("formRules applies overrides and always forbids spaces", () => {
  const r = formRules({ text: README_RULES, ov: { max: 12, symbol: false } })
  expect(r.max).toBe(12)
  expect(r.symbol).toBe(false)
  expect(r.min).toBe(8)
  expect(r.noSpaces).toBe(true)
  expect(r.parsed.max).toBe(16)
})

test("formConflict catches contradictions with a one-tap fix", () => {
  expect(formConflict(rules({ min: 8, max: 16, upper: true }))).toBeNull()

  const length = formConflict(rules({ min: 12, max: 8 }))
  expect(length?.title).toBe("The length rules contradict each other")
  expect(length?.text).toBe("Shortest is 12 but longest is 8. Check the numbers you pasted.")
  expect(length?.fix).toBe("Use 8 as both")
  expect(length?.patch).toEqual({ min: 8 })

  const symbol = formConflict(rules({ symbol: true, noSymbols: true }))
  expect(symbol?.title).toBe("A symbol is required, but none are allowed")
  expect(symbol?.patch).toEqual({ symbol: false })

  const short = formConflict(rules({ max: 3, upper: true, lower: true, digit: true, symbol: true }))
  expect(short?.title).toBe("Too short for everything it requires")
  expect(short?.text).toBe("It must include 4 kinds of character but can only be 3 long.")
  expect(short?.patch).toEqual({ max: 4 })

  const cfg = defaultCfg()
  cfg.form.text = "Must be 12 to 8 characters. No special characters allowed. Must include a symbol."
  expect(gen("form", cfg, FALLBACK_WORDS).err).toBe("form")
  expect(metrics("form", cfg, FALLBACK_WORDS).bits).toBe(0)
})

test("tiers follow the bit thresholds", () => {
  const cases: [number, number, string, string][] = [
    [0, 1, "Very weak", "danger"], [27.9, 1, "Very weak", "danger"],
    [28, 2, "Weak", "danger"], [49.9, 2, "Weak", "danger"],
    [50, 3, "Fair", "warning"], [69.9, 3, "Fair", "warning"],
    [70, 4, "Strong", "success"], [99.9, 4, "Strong", "success"],
    [100, 5, "Very strong", "success"], [200, 5, "Very strong", "success"],
  ]
  for (const [bits, n, name, tone] of cases) expect(tier(bits)).toMatchObject({ n, name, tone })
})

test("crack phrases guessing time with landmarks", () => {
  expect(crack(0)).toEqual({ lg: -3, text: "—", cmp: "" })
  expect(crack(20).text).toBe("less than a second")
  expect(crack(20).cmp).toBe("faster than you could read this")
  expect(crack(40).text).toBe("about 5.5 seconds")
  expect(crack(50).text).toBe("about 1.6 hours")
  expect(crack(60).text).toBe("about 67 days")
  expect(crack(60).cmp).toBe("days, not years")
  expect(crack(70).text).toBe("about 187 years")
  expect(crack(70).cmp).toBe("longer than a lifetime")
  expect(crack(100).text).toBe("about 201 billion years")
  expect(crack(100).cmp).toBe("≈ 15× the age of the universe")
  expect(crack(200).text).toBe("about 10⁴¹ years")
  expect(crack(200).cmp).toBe("far longer than the universe has existed")
})

test("metrics compute entropy from the recipe", () => {
  const cfg = defaultCfg()
  expect(metrics("quick", cfg, FALLBACK_WORDS)).toMatchObject({ pool: 89 })
  expect(metrics("quick", cfg, FALLBACK_WORDS).bits).toBeCloseTo(16 * Math.log2(89), 6)
  expect(metrics("manager", cfg, FALLBACK_WORDS).formula).toBe("log₂(89 characters) × 32 = 207.2 bits")
  const words = Array.from({ length: 7775 }, (_, i) => "w" + i)
  expect(metrics("wifi", cfg, words).formula).toBe("log₂(7,775 words) × 6 = 77.5 bits")
  expect(metrics("pin", cfg, FALLBACK_WORDS).notes[0].tone).toBe("warning")
  cfg.form.text = README_RULES
  const form = metrics("form", cfg, FALLBACK_WORDS)
  expect(form.pool).toBe(67)
  expect(form.bits).toBeGreaterThan(80)
  expect(form.bits).toBeLessThan(16 * Math.log2(67))
  expect(metrics("form", cfg, FALLBACK_WORDS).bits).toBe(form.bits)
})

test("the strength ruler maps marks to percentages", () => {
  expect(STRENGTH_MARKS[0]).toEqual(["a second", 0])
  expect(STRENGTH_MARKS[5]).toEqual(["age of the universe", 17.639])
  expect(rulerPct(-2)).toBe(0)
  expect(rulerPct(0)).toBe(6.3)
  expect(rulerPct(100)).toBe(100)
})

test("share text and card never include the password", () => {
  const t = tier(110)
  const time = crack(110).text.replace(/^about /, "")
  expect(shareText({ time, tier: t, bits: 110, isWords: false })).toBe(
    "My new password would take about 206 trillion years to guess (estimate) — and Passlore never saw it. Cut yours at passlore.com",
  )
  expect(shareText({ time: "less than a second", tier: tier(10), bits: 10, isWords: false, isPin: true })).toContain("My new PIN would take less than a second")
  const svg = cardSvg({ time, tier: t, bits: 110, isWords: true })
  expect(svg).toContain("MY NEW PASSPHRASE")
  expect(svg).toContain("Very strong · ≈ 110 bits · estimate")
})

test("wifiPayload escapes special characters", () => {
  expect(wifiPayload("Fern-House-5G", "able-acid-aged")).toBe("WIFI:T:WPA;S:Fern-House-5G;P:able-acid-aged;;")
  expect(wifiPayload('a\\b;c,d:e"f', "p;w")).toBe('WIFI:T:WPA;S:a\\\\b\\;c\\,d\\:e\\"f;P:p\\;w;;')
  const m = qrMatrix(wifiPayload("Café", "x"))
  expect(m.length).toBeGreaterThanOrEqual(21)
  expect(m.every((row) => row.length === m.length)).toBe(true)
  expect(m[0][0]).toBe(true)
})

test("sha1Hex returns uppercase hex", async () => {
  expect(await sha1Hex("password")).toBe("5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8")
})

test.describe("checkLeak", () => {
  const originalFetch = globalThis.fetch
  let requested: { url: string; headers: Record<string, string> }[] = []

  const mockFetch = (impl: () => Promise<Response>) => {
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      requested.push({ url: String(input), headers: (init?.headers ?? {}) as Record<string, string> })
      return impl()
    }) as typeof fetch
  }

  test.beforeEach(() => { requested = [] })
  test.afterEach(() => { globalThis.fetch = originalFetch })

  test("found sends only the prefix with padding", async () => {
    mockFetch(async () => new Response("0018A45C4D1DEF81644B54AB7F969B88D65:1\r\n1E4C9B93F3F0682250B6CF8331B7EE68FD8:9545824\r\n"))
    expect(await checkLeak("password")).toEqual({ status: "found", count: 9545824, prefix: "5BAA6" })
    expect(requested).toHaveLength(1)
    expect(requested[0].url).toBe("https://api.pwnedpasswords.com/range/5BAA6")
    expect(requested[0].headers["Add-Padding"]).toBe("true")
  })

  test("not found when the suffix is absent", async () => {
    mockFetch(async () => new Response("0018A45C4D1DEF81644B54AB7F969B88D65:1\n"))
    expect(await checkLeak("password")).toEqual({ status: "not-found", prefix: "5BAA6" })
  })

  test("padding rows with a zero count are ignored", async () => {
    mockFetch(async () => new Response("1E4C9B93F3F0682250B6CF8331B7EE68FD8:0\n0018A45C4D1DEF81644B54AB7F969B88D65:3\n"))
    expect(await checkLeak("password")).toEqual({ status: "not-found", prefix: "5BAA6" })
  })

  test("network and HTTP errors are reported as failed", async () => {
    mockFetch(async () => { throw new TypeError("Failed to fetch") })
    expect(await checkLeak("password")).toEqual({ status: "failed", reason: "error", prefix: "5BAA6" })
    mockFetch(async () => new Response("nope", { status: 503 }))
    expect(await checkLeak("password")).toEqual({ status: "failed", reason: "error", prefix: "5BAA6" })
  })

  test("an unreadable 200 response is failed, never not found", async () => {
    mockFetch(async () => new Response("<html>Sign in to the Wi-Fi</html>"))
    expect(await checkLeak("password")).toEqual({ status: "failed", reason: "error", prefix: "5BAA6" })
    mockFetch(async () => new Response(""))
    expect(await checkLeak("password")).toEqual({ status: "failed", reason: "error", prefix: "5BAA6" })
  })
})

test("allowed symbols keep only printable ASCII so passwords never hold half an emoji", () => {
  expect(parseRules("Use 8-12 characters with a symbol. Symbols allowed: £€😀!#").syms).toBe("!#")
})

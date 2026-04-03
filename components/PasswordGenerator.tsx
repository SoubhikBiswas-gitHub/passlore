"use client"

import { calcEntropy } from "@/lib/entropy"
import {
  buildCharset,
  generateBulk,
  generatePassword,
  generatePattern,
  generatePin,
  generatePronounceable,
  type GeneratorOptions,
} from "@/lib/generate"
import { generatePassphrase, getPassphraseEntropy } from "@/lib/passphrase"
import { motion, useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { AdvancedPanel } from "./AdvancedPanel"
import { BulkCountControl } from "./BulkCountControl"
import { BulkOutput } from "./BulkOutput"
import { CharsetToggles } from "./CharsetToggles"
import { HibpDatabasePanel } from "./HibpDatabasePanel"
import { HistoryPanel } from "./HistoryPanel"
import { LengthControl } from "./LengthControl"
import { ModeSelector } from "./ModeSelector"
import { PasswordOutput } from "./PasswordOutput"
import { RealtimeMetricsPanel } from "./RealtimeMetricsPanel"
import { StrengthMeter } from "./StrengthMeter"
import { NativeSelect } from "@/components/ui/native-select"

export type Mode = "single" | "bulk" | "passphrase" | "pronounceable" | "pin" | "pattern"
export type Separator = "-" | "." | "_" | " "
export interface HistoryItem {
  id: string
  password: string
  strength: number
  bits: number
  timestamp: number
}

export interface State {
  mode: Mode
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
  bulkCount: number
  separator: Separator
  wordCount: number
  patternString: string
  password: string
  bulkPasswords: string[]
  history: HistoryItem[]
  isRevealed: boolean
  isCopied: boolean
  isGenerating: boolean
  sessionCount: number
  hibpStatus: "idle" | "loading" | "clean" | "breached" | "error"
  hibpCount: number
}

type Action =
  | { type: "SET_MODE"; payload: Mode }
  | { type: "SET_LENGTH"; payload: number }
  | { type: "SET_UPPER"; payload: boolean }
  | { type: "SET_LOWER"; payload: boolean }
  | { type: "SET_NUMBERS"; payload: boolean }
  | { type: "SET_SYMBOLS"; payload: boolean }
  | { type: "SET_NO_SIMILAR"; payload: boolean }
  | { type: "SET_NO_AMBIGUOUS"; payload: boolean }
  | { type: "SET_EXCLUDE_CHARS"; payload: string }
  | { type: "SET_INCLUDE_CHARS"; payload: string }
  | { type: "SET_PREFIX"; payload: string }
  | { type: "SET_SUFFIX"; payload: string }
  | { type: "SET_BULK_COUNT"; payload: number }
  | { type: "SET_SEPARATOR"; payload: Separator }
  | { type: "SET_WORD_COUNT"; payload: number }
  | { type: "SET_PATTERN"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_BULK_PASSWORDS"; payload: string[] }
  | { type: "ADD_HISTORY"; payload: HistoryItem }
  | { type: "CLEAR_HISTORY" }
  | { type: "SET_REVEALED"; payload: boolean }
  | { type: "SET_COPIED"; payload: boolean }
  | { type: "SET_GENERATING"; payload: boolean }
  | { type: "INCREMENT_SESSION" }
  | { type: "SET_HIBP_STATUS"; payload: State["hibpStatus"] }
  | { type: "SET_HIBP_COUNT"; payload: number }

const initialState: State = {
  mode: "single",
  length: 16,
  upper: true,
  lower: true,
  numbers: true,
  symbols: true,
  noSimilar: false,
  noAmbiguous: false,
  excludeChars: "",
  includeChars: "",
  prefix: "",
  suffix: "",
  bulkCount: 10,
  separator: "-",
  wordCount: 4,
  patternString: "Aaaa-0000-!!!!",
  password: "",
  bulkPasswords: [],
  history: [],
  isRevealed: false,
  isCopied: false,
  isGenerating: false,
  sessionCount: 0,
  hibpStatus: "idle",
  hibpCount: 0,
}

function buildInitialState(layout: "stack" | "dashboard"): State {
  return {
    ...initialState,
    length: layout === "dashboard" ? 32 : 16,
    ...(layout === "dashboard" ? { isGenerating: true } : {}),
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload, password: "", bulkPasswords: [], hibpStatus: "idle" }
    case "SET_LENGTH":
      return { ...state, length: action.payload }
    case "SET_UPPER":
      return { ...state, upper: action.payload }
    case "SET_LOWER":
      return { ...state, lower: action.payload }
    case "SET_NUMBERS":
      return { ...state, numbers: action.payload }
    case "SET_SYMBOLS":
      return { ...state, symbols: action.payload }
    case "SET_NO_SIMILAR":
      return { ...state, noSimilar: action.payload }
    case "SET_NO_AMBIGUOUS":
      return { ...state, noAmbiguous: action.payload }
    case "SET_EXCLUDE_CHARS":
      return { ...state, excludeChars: action.payload }
    case "SET_INCLUDE_CHARS":
      return { ...state, includeChars: action.payload }
    case "SET_PREFIX":
      return { ...state, prefix: action.payload }
    case "SET_SUFFIX":
      return { ...state, suffix: action.payload }
    case "SET_BULK_COUNT": {
      const n = Math.round(Number(action.payload))
      const bulkCount = Number.isFinite(n) ? Math.min(500, Math.max(1, n)) : state.bulkCount
      return { ...state, bulkCount }
    }
    case "SET_SEPARATOR":
      return { ...state, separator: action.payload }
    case "SET_WORD_COUNT":
      return { ...state, wordCount: action.payload }
    case "SET_PATTERN":
      return { ...state, patternString: action.payload }
    case "SET_PASSWORD":
      return { ...state, password: action.payload, hibpStatus: "idle", hibpCount: 0 }
    case "SET_BULK_PASSWORDS":
      return { ...state, bulkPasswords: action.payload }
    case "ADD_HISTORY":
      return { ...state, history: [action.payload, ...state.history].slice(0, 20) }
    case "CLEAR_HISTORY":
      return { ...state, history: [] }
    case "SET_REVEALED":
      return { ...state, isRevealed: action.payload }
    case "SET_COPIED":
      return { ...state, isCopied: action.payload }
    case "SET_GENERATING":
      return { ...state, isGenerating: action.payload }
    case "INCREMENT_SESSION":
      return { ...state, sessionCount: state.sessionCount + 1 }
    case "SET_HIBP_STATUS":
      return { ...state, hibpStatus: action.payload }
    case "SET_HIBP_COUNT":
      return { ...state, hibpCount: action.payload }
    default:
      return state
  }
}

export interface PasswordGeneratorProps {
  layout?: "stack" | "dashboard"
}

export function PasswordGenerator({ layout = "stack" }: PasswordGeneratorProps) {
  const [state, dispatch] = useReducer(reducer, layout, buildInitialState)
  const reducedMotionQuery = useReducedMotion()
  const [motionReady, setMotionReady] = useState(false)
  useEffect(() => setMotionReady(true), [])
  /** Avoid SSR vs client mismatch: server has no matchMedia; defer reduced-motion until after hydrate. */
  const prefersReduced = motionReady ? reducedMotionQuery : false
  const isDashboard = layout === "dashboard"

  const getOptions = useCallback((): GeneratorOptions => {
    return {
      length: state.length,
      upper: state.upper,
      lower: state.lower,
      numbers: state.numbers,
      symbols: state.symbols,
      noSimilar: state.noSimilar,
      noAmbiguous: state.noAmbiguous,
      excludeChars: state.excludeChars,
      includeChars: state.includeChars,
      prefix: state.prefix,
      suffix: state.suffix,
    }
  }, [state.length, state.upper, state.lower, state.numbers, state.symbols, state.noSimilar, state.noAmbiguous, state.excludeChars, state.includeChars, state.prefix, state.suffix])

  const calculateEntropy = useCallback((): number => {
    if (!state.password) return 0

    if (state.mode === "passphrase") {
      return getPassphraseEntropy(state.wordCount)
    }

    if (state.mode === "pin") {
      return calcEntropy(10, state.password.length)
    }

    if (state.mode === "pronounceable") {
      return calcEntropy(26, state.password.length)
    }

    const opts = getOptions()
    const charset = buildCharset(opts)
    return calcEntropy(charset.length, state.password.length)
  }, [state.password, state.mode, state.wordCount, getOptions])

  const getStrengthLevel = useCallback((bits: number): number => {
    if (bits < 28) return 1
    if (bits < 36) return 2
    if (bits < 60) return 3
    if (bits < 128) return 4
    return 5
  }, [])

  const handleGenerate = useCallback(() => {
    dispatch({ type: "SET_GENERATING", payload: true })

    setTimeout(() => {
      let newPassword = ""
      let newBulkPasswords: string[] = []

      switch (state.mode) {
        case "single":
          newPassword = generatePassword(getOptions())
          break
        case "bulk":
          newBulkPasswords = generateBulk(getOptions(), state.bulkCount)
          newPassword = newBulkPasswords[0] || ""
          break
        case "passphrase":
          newPassword = generatePassphrase(state.wordCount, state.separator)
          break
        case "pronounceable":
          newPassword = generatePronounceable(state.length)
          break
        case "pin":
          newPassword = generatePin(state.length)
          break
        case "pattern":
          newPassword = generatePattern(state.patternString)
          break
      }

      dispatch({ type: "SET_PASSWORD", payload: newPassword })
      if (state.mode === "bulk") {
        dispatch({ type: "SET_BULK_PASSWORDS", payload: newBulkPasswords })
      }
      dispatch({ type: "INCREMENT_SESSION" })

      const bits = state.mode === "passphrase"
        ? getPassphraseEntropy(state.wordCount)
        : state.mode === "pin"
          ? calcEntropy(10, newPassword.length)
          : state.mode === "pronounceable"
            ? calcEntropy(26, newPassword.length)
            : calcEntropy(buildCharset(getOptions()).length, newPassword.length)

      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        password: newPassword,
        strength: getStrengthLevel(bits),
        bits,
        timestamp: Date.now(),
      }
      dispatch({ type: "ADD_HISTORY", payload: historyItem })
      dispatch({ type: "SET_GENERATING", payload: false })
      dispatch({ type: "SET_REVEALED", payload: true })
    }, 100)
  }, [state.mode, state.bulkCount, state.wordCount, state.separator, state.length, state.patternString, getOptions, getStrengthLevel])

  useEffect(() => {
    const savedHistory = sessionStorage.getItem("ssp-history")
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as HistoryItem[]
        parsed.forEach((item) => {
          dispatch({ type: "ADD_HISTORY", payload: item })
        })
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem("ssp-history", JSON.stringify(state.history))
  }, [state.history])

  useEffect(() => {
    if (layout === "dashboard" && state.mode === "pattern") {
      dispatch({ type: "SET_MODE", payload: "single" })
    }
  }, [layout, state.mode])

  /** First option sync runs immediately; later changes are debounced (typing in pattern/exclude, etc.). */
  const optionsRegenFirstRunRef = useRef(true)

  useEffect(() => {
    if (optionsRegenFirstRunRef.current) {
      optionsRegenFirstRunRef.current = false
      handleGenerate()
      return
    }
    const ms = 300
    const id = window.setTimeout(() => {
      handleGenerate()
    }, ms)
    return () => window.clearTimeout(id)
  }, [
    handleGenerate,
    state.mode,
    state.length,
    state.upper,
    state.lower,
    state.numbers,
    state.symbols,
    state.noSimilar,
    state.noAmbiguous,
    state.excludeChars,
    state.includeChars,
    state.prefix,
    state.suffix,
    state.bulkCount,
    state.separator,
    state.wordCount,
    state.patternString,
  ])

  const entropy = calculateEntropy()
  const strengthLevel = getStrengthLevel(entropy)

  const passwordRef = useRef(state.password)
  passwordRef.current = state.password
  const hibpAbortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    hibpAbortRef.current?.abort()
    hibpAbortRef.current = null
  }, [state.password])

  useEffect(() => {
    return () => hibpAbortRef.current?.abort()
  }, [])

  const runHibpCheck = useCallback(() => {
    const pwd = state.password
    if (!pwd) return

    hibpAbortRef.current?.abort()
    const ac = new AbortController()
    hibpAbortRef.current = ac

    dispatch({ type: "SET_HIBP_STATUS", payload: "loading" })

    import("@/lib/hibp")
      .then(({ checkHibp }) => checkHibp(pwd, { signal: ac.signal }))
      .then((result) => {
        if (passwordRef.current !== pwd) return
        if (result === null) {
          dispatch({ type: "SET_HIBP_STATUS", payload: "error" })
          return
        }
        if (result.breached) {
          dispatch({ type: "SET_HIBP_STATUS", payload: "breached" })
          dispatch({ type: "SET_HIBP_COUNT", payload: result.count })
        } else {
          dispatch({ type: "SET_HIBP_STATUS", payload: "clean" })
        }
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return
        if (passwordRef.current !== pwd) return
        dispatch({ type: "SET_HIBP_STATUS", payload: "error" })
      })
  }, [state.password])

  const copyPassword = useCallback(() => {
    if (state.password) {
      navigator.clipboard.writeText(state.password)
      dispatch({ type: "SET_COPIED", payload: true })
      setTimeout(() => dispatch({ type: "SET_COPIED", payload: false }), 2000)
    }
  }, [state.password])

  const passwordOutputProps = {
    password: state.password,
    isRevealed: state.isRevealed,
    isCopied: state.isCopied,
    isGenerating: state.isGenerating,
    onRevealToggle: () => dispatch({ type: "SET_REVEALED", payload: !state.isRevealed }),
    onCopy: copyPassword,
    onGenerate: handleGenerate,
    hibpStatus: state.hibpStatus,
    hibpCount: state.hibpCount,
    onHibpCheck: runHibpCheck,
  } as const

  const advancedPanelEl = (
    <AdvancedPanel
      variant={isDashboard ? "dashboard" : "default"}
      noSimilar={state.noSimilar}
      noAmbiguous={state.noAmbiguous}
      excludeChars={state.excludeChars}
      includeChars={state.includeChars}
      prefix={state.prefix}
      suffix={state.suffix}
      onNoSimilarChange={(v) => dispatch({ type: "SET_NO_SIMILAR", payload: v })}
      onNoAmbiguousChange={(v) => dispatch({ type: "SET_NO_AMBIGUOUS", payload: v })}
      onExcludeCharsChange={(v) => dispatch({ type: "SET_EXCLUDE_CHARS", payload: v })}
      onIncludeCharsChange={(v) => dispatch({ type: "SET_INCLUDE_CHARS", payload: v })}
      onPrefixChange={(v) => dispatch({ type: "SET_PREFIX", payload: v })}
      onSuffixChange={(v) => dispatch({ type: "SET_SUFFIX", payload: v })}
    />
  )

  const dashboardSparseModes =
    state.mode === "passphrase" || state.mode === "pin" || state.mode === "pronounceable"

  const dashboardLeftControls = (
    <div className="flex h-full min-h-0 flex-col gap-6">
      {state.mode !== "pin" && state.mode !== "passphrase" && (
        <div className="shrink-0 border border-border bg-muted p-4 sm:p-5">
          <LengthControl
            length={state.length}
            onLengthChange={(length) => dispatch({ type: "SET_LENGTH", payload: length })}
            min={4}
            max={128}
            label="Password length"
            unit="chars"
            variant="dashboard"
          />
        </div>
      )}
      {state.mode === "passphrase" && (
        <div className="flex min-h-0 flex-1 flex-col space-y-6 border border-border bg-muted p-4 sm:p-5">
          <LengthControl
            length={state.wordCount}
            onLengthChange={(count) => dispatch({ type: "SET_WORD_COUNT", payload: count })}
            min={3}
            max={8}
            label="Word count"
            unit="words"
            variant="dashboard"
          />
          <div className="flex flex-col gap-2">
            <label
              htmlFor="dashboard-passphrase-separator"
              className="text-[0.6875rem] uppercase tracking-widest text-muted-foreground font-bold"
            >
              Separator
            </label>
            <NativeSelect
              id="dashboard-passphrase-separator"
              value={state.separator}
              onChange={(e) => dispatch({ type: "SET_SEPARATOR", payload: e.target.value as Separator })}
              className="bg-card"
            >
              <option value="-">Hyphen (-)</option>
              <option value=".">Dot (.)</option>
              <option value="_">Underscore (_)</option>
              <option value=" ">Space ( )</option>
            </NativeSelect>
          </div>
        </div>
      )}
      {state.mode === "pin" && (
        <div className="shrink-0 border border-border bg-muted p-4 sm:p-5">
          <LengthControl
            length={state.length}
            onLengthChange={(length) => dispatch({ type: "SET_LENGTH", payload: length })}
            min={4}
            max={16}
            label="PIN length"
            unit="digits"
            variant="dashboard"
          />
        </div>
      )}
      {state.mode === "single" && (
        <div className="flex min-h-0 flex-1 flex-col border border-border bg-muted p-4 sm:p-5">
          <CharsetToggles
            upper={state.upper}
            lower={state.lower}
            numbers={state.numbers}
            symbols={state.symbols}
            onUpperChange={(v) => dispatch({ type: "SET_UPPER", payload: v })}
            onLowerChange={(v) => dispatch({ type: "SET_LOWER", payload: v })}
            onNumbersChange={(v) => dispatch({ type: "SET_NUMBERS", payload: v })}
            onSymbolsChange={(v) => dispatch({ type: "SET_SYMBOLS", payload: v })}
            variant="dashboard"
          />
        </div>
      )}
      {state.mode === "bulk" && (
        <div className="flex min-h-0 flex-1 flex-col border border-border bg-muted p-4 sm:p-5">
          <CharsetToggles
            upper={state.upper}
            lower={state.lower}
            numbers={state.numbers}
            symbols={state.symbols}
            onUpperChange={(v) => dispatch({ type: "SET_UPPER", payload: v })}
            onLowerChange={(v) => dispatch({ type: "SET_LOWER", payload: v })}
            onNumbersChange={(v) => dispatch({ type: "SET_NUMBERS", payload: v })}
            onSymbolsChange={(v) => dispatch({ type: "SET_SYMBOLS", payload: v })}
            variant="dashboard"
          />
        </div>
      )}
      {state.mode === "pattern" && (
        <div className="space-y-2">
          <label className="text-[0.6875rem] uppercase tracking-widest text-muted-foreground font-bold">
            Pattern (A=upper, a=lower, 0=digit, !=symbol, *=any)
          </label>
          <input
            type="text"
            value={state.patternString}
            onChange={(e) => dispatch({ type: "SET_PATTERN", payload: e.target.value })}
            className="w-full px-3 py-2 text-sm font-mono border border-border rounded-none bg-card text-foreground focus:outline-none focus:border-primary"
            placeholder="e.g. Aaaa-0000-!!!!"
          />
        </div>
      )}
    </div>
  )

  const dashboardRightColumn =
    state.mode === "single" || state.mode === "bulk" ? (
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-6">
        {state.mode === "bulk" ? (
          <section aria-label="Bulk count" className="shrink-0 border border-border bg-card">
            <div className="border-b border-border bg-accent-2/35 px-5 py-4 sm:px-6 sm:py-5">
              <h3 className="ds-text-label-sm font-mono font-bold tracking-[0.18em] text-foreground">Bulk count</h3>
              <p className="mt-2 max-w-prose text-xs leading-relaxed text-muted-foreground">
                Set how many passwords to generate each time you press Generate (1–500).
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <BulkCountControl
                variant="dashboard"
                embedded
                count={state.bulkCount}
                onCountChange={(n) => dispatch({ type: "SET_BULK_COUNT", payload: n })}
              />
            </div>
          </section>
        ) : null}
        <HibpDatabasePanel
          variant="dashboard"
          panelClassName="min-h-0 flex-1"
          password={state.password}
          hibpStatus={state.hibpStatus}
          hibpCount={state.hibpCount}
          onHibpCheck={runHibpCheck}
        />
      </div>
    ) : null

  const dashboardAdvancedFullWidth =
    state.mode === "single" || state.mode === "bulk" ? (
      <div className="w-full min-w-0">{advancedPanelEl}</div>
    ) : null

  if (isDashboard) {
    return (
      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
        animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
        className="grid grid-cols-1 items-stretch gap-px bg-border p-1 border border-border lg:grid-cols-12"
      >
        <div className="flex min-h-0 w-full min-w-0 flex-col bg-background p-6 sm:p-8 space-y-6 lg:col-span-8">
          <ModeSelector
            variant="dashboard"
            mode={state.mode}
            onModeChange={(mode) => dispatch({ type: "SET_MODE", payload: mode })}
          />

          <div className="flex flex-col gap-4">
            <div className="min-w-0 w-full">
              <PasswordOutput {...passwordOutputProps} variant="dashboard" />
            </div>
            {state.mode !== "bulk" && (
              <div className="min-h-30 w-full min-w-0">
                {state.password ? (
                  <StrengthMeter bits={entropy} strength={strengthLevel} variant="dashboard" />
                ) : (
                  <div
                    className="flex h-full min-h-30 flex-col justify-center border border-dashed border-border/70 bg-accent-2/20 px-4 py-3"
                    aria-hidden
                  >
                    <p className="text-center text-[0.625rem] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                      Security score after generate
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {dashboardSparseModes ? (
            <div className="flex min-w-0 flex-col gap-6">
              <div className="min-w-0">{dashboardLeftControls}</div>
              <div
                className="border border-border bg-accent-2/35 px-4 py-3"
                role="note"
                aria-label="Breach check availability"
              >
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Breach check available in single and bulk modes.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-0 grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-8">
              <div className="flex min-h-0 min-w-0 flex-col">{dashboardLeftControls}</div>
              <div className="flex min-h-0 min-w-0 flex-col">{dashboardRightColumn}</div>
            </div>
          )}

          {dashboardAdvancedFullWidth}

          {state.mode === "bulk" && (
            <div className="min-h-72 w-full min-w-0">
              {state.bulkPasswords.length > 0 ? (
                <BulkOutput passwords={state.bulkPasswords} />
              ) : (
                <div className="space-y-3">
                  <div className="flex min-h-8 items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Bulk results</span>
                  </div>
                  <div className="flex h-64 items-center justify-center border border-dashed border-border bg-card/50 px-4">
                    <p className="text-center text-xs font-mono uppercase tracking-widest text-muted-foreground">
                      Generate to list bulk passwords
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-px bg-card lg:col-span-4">
          <HistoryPanel
            variant="dashboard"
            history={state.history}
            onClear={() => dispatch({ type: "CLEAR_HISTORY" })}
          />
          <RealtimeMetricsPanel sessionCount={state.sessionCount} />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
      animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.32, ease: "easeOut" }}
    >
      <div className="p-4 sm:p-6 rounded-none bg-surface-1">
        <div className="space-y-6">
          <ModeSelector
            mode={state.mode}
            onModeChange={(mode) => dispatch({ type: "SET_MODE", payload: mode })}
          />

          {state.mode !== "pin" && state.mode !== "passphrase" && (
            <LengthControl
              length={state.length}
              onLengthChange={(length) => dispatch({ type: "SET_LENGTH", payload: length })}
              min={4}
              max={256}
              label="Length"
              unit="chars"
            />
          )}

          {state.mode === "passphrase" && (
            <LengthControl
              length={state.wordCount}
              onLengthChange={(count) => dispatch({ type: "SET_WORD_COUNT", payload: count })}
              min={3}
              max={8}
              label="Word Count"
              unit="words"
            />
          )}

          {state.mode === "pin" && (
            <LengthControl
              length={state.length}
              onLengthChange={(length) => dispatch({ type: "SET_LENGTH", payload: length })}
              min={4}
              max={16}
              label="PIN Length"
              unit="digits"
            />
          )}

          {(state.mode === "single" || state.mode === "bulk") && (
            <CharsetToggles
              upper={state.upper}
              lower={state.lower}
              numbers={state.numbers}
              symbols={state.symbols}
              onUpperChange={(v) => dispatch({ type: "SET_UPPER", payload: v })}
              onLowerChange={(v) => dispatch({ type: "SET_LOWER", payload: v })}
              onNumbersChange={(v) => dispatch({ type: "SET_NUMBERS", payload: v })}
              onSymbolsChange={(v) => dispatch({ type: "SET_SYMBOLS", payload: v })}
            />
          )}

          {state.mode === "bulk" && (
            <div className="rounded-none border border-border bg-accent-2/35 p-4">
              <BulkCountControl
                count={state.bulkCount}
                onCountChange={(n) => dispatch({ type: "SET_BULK_COUNT", payload: n })}
              />
            </div>
          )}

          {state.mode === "pattern" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Pattern (A=upper, a=lower, 0=digit, !=symbol, *=any)
              </label>
              <input
                type="text"
                value={state.patternString}
                onChange={(e) => dispatch({ type: "SET_PATTERN", payload: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono border border-border rounded-none bg-background text-foreground focus:outline-none focus:border-ring"
                placeholder="e.g. Aaaa-0000-!!!!"
              />
            </div>
          )}

          {(state.mode === "single" || state.mode === "bulk") && advancedPanelEl}

          {state.mode === "passphrase" && (
            <div className="flex items-center gap-4">
              <label htmlFor="passphrase-separator" className="text-sm font-medium text-foreground">
                Separator:
              </label>
              <NativeSelect
                id="passphrase-separator"
                value={state.separator}
                onChange={(e) => dispatch({ type: "SET_SEPARATOR", payload: e.target.value as Separator })}
                className="w-full bg-background"
                wrapperClassName="inline-block min-w-48 max-w-full shrink-0"
              >
                <option value="-">Hyphen (-)</option>
                <option value=".">Dot (.)</option>
                <option value="_">Underscore (_)</option>
                <option value=" ">Space ( )</option>
              </NativeSelect>
            </div>
          )}

          <PasswordOutput {...passwordOutputProps} variant="default" />

          {state.password && state.mode !== "bulk" && (
            <StrengthMeter bits={entropy} strength={strengthLevel} />
          )}

          {state.mode === "bulk" && state.bulkPasswords.length > 0 && (
            <BulkOutput passwords={state.bulkPasswords} />
          )}

          <HistoryPanel
            history={state.history}
            onClear={() => dispatch({ type: "CLEAR_HISTORY" })}
          />
        </div>
      </div>
    </motion.div>
  )
}

"use client"

import { useReducer, useCallback, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowsClockwise } from "@phosphor-icons/react"
import { ModeSelector } from "./ModeSelector"
import { LengthControl } from "./LengthControl"
import { CharsetToggles } from "./CharsetToggles"
import { AdvancedPanel } from "./AdvancedPanel"
import { PasswordOutput } from "./PasswordOutput"
import { StrengthMeter } from "./StrengthMeter"
import { HistoryPanel } from "./HistoryPanel"
import { BulkOutput } from "./BulkOutput"
import { HibpDatabasePanel } from "./HibpDatabasePanel"
import { RealtimeMetricsPanel } from "./RealtimeMetricsPanel"
import {
  generatePassword,
  generateBulk,
  generatePronounceable,
  generatePin,
  generatePattern,
  buildCharset,
  type GeneratorOptions,
} from "@/lib/generate"
import { generatePassphrase, getPassphraseEntropy } from "@/lib/passphrase"
import { calcEntropy } from "@/lib/entropy"

export type Mode = "single" | "bulk" | "passphrase" | "pronounceable" | "pin" | "pattern"
export type Separator = "-" | "." | "_" | " "
export type BulkCount = 10 | 20 | 50 | 100

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
  bulkCount: BulkCount
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
  | { type: "SET_BULK_COUNT"; payload: BulkCount }
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
    case "SET_BULK_COUNT":
      return { ...state, bulkCount: action.payload }
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
  const prefersReduced = useReducedMotion()
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
    dispatch({ type: "SET_REVEALED", payload: false })

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

  const entropy = calculateEntropy()
  const strengthLevel = getStrengthLevel(entropy)

  const runHibpCheck = useCallback(() => {
    dispatch({ type: "SET_HIBP_STATUS", payload: "loading" })
    import("@/lib/hibp").then(({ checkHibp }) => {
      checkHibp(state.password).then((result) => {
        if (result === null) {
          dispatch({ type: "SET_HIBP_STATUS", payload: "error" })
        } else if (result.breached) {
          dispatch({ type: "SET_HIBP_STATUS", payload: "breached" })
          dispatch({ type: "SET_HIBP_COUNT", payload: result.count })
        } else {
          dispatch({ type: "SET_HIBP_STATUS", payload: "clean" })
        }
      })
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

  const dashboardLeftControls = (
    <div className="space-y-8">
      {state.mode !== "pin" && state.mode !== "passphrase" && (
        <LengthControl
          length={state.length}
          onLengthChange={(length) => dispatch({ type: "SET_LENGTH", payload: length })}
          min={4}
          max={128}
          label="Password length"
          unit="chars"
          variant="dashboard"
        />
      )}
      {state.mode === "passphrase" && (
        <LengthControl
          length={state.wordCount}
          onLengthChange={(count) => dispatch({ type: "SET_WORD_COUNT", payload: count })}
          min={3}
          max={8}
          label="Word count"
          unit="words"
          variant="dashboard"
        />
      )}
      {state.mode === "pin" && (
        <LengthControl
          length={state.length}
          onLengthChange={(length) => dispatch({ type: "SET_LENGTH", payload: length })}
          min={4}
          max={16}
          label="PIN length"
          unit="digits"
          variant="dashboard"
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
          variant="dashboard"
        />
      )}
      {state.mode === "pattern" && (
        <div className="space-y-2">
          <label className="text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-bold">
            Pattern (A=upper, a=lower, 0=digit, !=symbol, *=any)
          </label>
          <input
            type="text"
            value={state.patternString}
            onChange={(e) => dispatch({ type: "SET_PATTERN", payload: e.target.value })}
            className="w-full px-3 py-2 text-sm font-mono border border-zinc-800 rounded-none bg-[#18181b] text-zinc-50 focus:outline-none focus:border-blue-600"
            placeholder="e.g. Aaaa-0000-!!!!"
          />
        </div>
      )}
      {state.mode === "bulk" && (
        <div className="flex flex-col gap-2">
          <label className="text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-bold">Count</label>
          <select
            value={state.bulkCount}
            onChange={(e) => dispatch({ type: "SET_BULK_COUNT", payload: Number(e.target.value) as BulkCount })}
            className="w-full px-3 py-2 text-sm border border-zinc-800 rounded-none bg-[#18181b] text-zinc-50 focus:outline-none focus:border-blue-600"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      )}
      {state.mode === "passphrase" && (
        <div className="flex flex-col gap-2">
          <label className="text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-bold">Separator</label>
          <select
            value={state.separator}
            onChange={(e) => dispatch({ type: "SET_SEPARATOR", payload: e.target.value as Separator })}
            className="w-full px-3 py-2 text-sm border border-zinc-800 rounded-none bg-[#18181b] text-zinc-50 focus:outline-none focus:border-blue-600"
          >
            <option value="-">Hyphen (-)</option>
            <option value=".">Dot (.)</option>
            <option value="_">Underscore (_)</option>
            <option value=" ">Space ( )</option>
          </select>
        </div>
      )}
    </div>
  )

  const dashboardRightColumn =
    state.mode === "single" || state.mode === "bulk" ? (
      <div className="space-y-8">
        <HibpDatabasePanel
          variant="dashboard"
          password={state.password}
          hibpStatus={state.hibpStatus}
          hibpCount={state.hibpCount}
          onHibpCheck={runHibpCheck}
        />
        {advancedPanelEl}
      </div>
    ) : null

  if (isDashboard) {
    return (
      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
        animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-zinc-900 p-1 border border-zinc-800/80"
      >
        <div className="lg:col-span-8 bg-[#0a0a0a] p-6 sm:p-8 space-y-8">
          <ModeSelector
            variant="dashboard"
            mode={state.mode}
            onModeChange={(mode) => dispatch({ type: "SET_MODE", payload: mode })}
          />

          <PasswordOutput {...passwordOutputProps} variant="dashboard" showGenerateButton={false} />

          {state.password && state.mode !== "bulk" && (
            <StrengthMeter bits={entropy} strength={strengthLevel} variant="dashboard" />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>{dashboardLeftControls}</div>
            <div>
              {dashboardRightColumn ?? (
                <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
                  Breach check available in single and bulk modes.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={state.isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-none bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium uppercase tracking-wider font-mono transition-colors disabled:opacity-50"
          >
            <motion.div
              animate={prefersReduced || !state.isGenerating ? undefined : { rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <ArrowsClockwise size={18} weight="bold" />
            </motion.div>
            Generate password
          </button>

          {state.mode === "bulk" && state.bulkPasswords.length > 0 && (
            <BulkOutput passwords={state.bulkPasswords} />
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-px bg-[#18181b] min-h-0">
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

          {state.mode === "pattern" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Pattern (A=upper, a=lower, 0=digit, !=symbol, *=any)
              </label>
              <input
                type="text"
                value={state.patternString}
                onChange={(e) => dispatch({ type: "SET_PATTERN", payload: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono border border-zinc-200 dark:border-zinc-800 rounded-none bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
                placeholder="e.g. Aaaa-0000-!!!!"
              />
            </div>
          )}

          {(state.mode === "single" || state.mode === "bulk") && advancedPanelEl}

          {state.mode === "bulk" && (
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Count:</label>
              <select
                value={state.bulkCount}
                onChange={(e) => dispatch({ type: "SET_BULK_COUNT", payload: Number(e.target.value) as BulkCount })}
                className="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-none bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          )}

          {state.mode === "passphrase" && (
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Separator:</label>
              <select
                value={state.separator}
                onChange={(e) => dispatch({ type: "SET_SEPARATOR", payload: e.target.value as Separator })}
                className="px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-none bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
              >
                <option value="-">Hyphen (-)</option>
                <option value=".">Dot (.)</option>
                <option value="_">Underscore (_)</option>
                <option value=" ">Space ( )</option>
              </select>
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

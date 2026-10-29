"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowsClockwise } from "@phosphor-icons/react"
import { pickN, rnd } from "@/lib/generator/random"
import { STRENGTH_MARKS, crack, rulerPct, tier } from "@/lib/generator/strength"
import { FALLBACK_WORDS, loadEffWords } from "@/lib/generator/wordlist"
import { POOL } from "@/components/content/LiveDraw"
import { btn } from "@/components/content/styles"

const fmt = (n: number) => n.toLocaleString("en-GB")
const marks = STRENGTH_MARKS.map(([label, lg], i) => ({ label, pos: `${rulerPct(lg)}%`, top: i % 2 ? "20px" : "0px" }))

const side = "flex min-w-0 flex-col gap-2 rounded-2xl bg-primary-soft p-4 text-on-primary-soft"
const sample =
  "!m-0 min-h-[76px] rounded-sm bg-surface px-3 py-2.5 font-mono text-lg leading-[1.35] text-ink [overflow-wrap:anywhere]"
const needle = "absolute -top-1.5 h-6 w-1 -translate-x-0.5 rounded-sm bg-ink transition-[left] duration-500 ease-calm"
const lab =
  "absolute -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2 py-px text-xs font-bold text-bg transition-[left] duration-500 ease-calm"

export function ArticleCompare() {
  const [words, setWords] = useState<string[] | null>(null)
  const [w, setW] = useState(6)
  const [c, setC] = useState(12)
  const [wordPool, setWordPool] = useState<string[]>([])
  const [chars, setChars] = useState("")
  const [announce, setAnnounce] = useState("")

  useEffect(() => {
    loadEffWords().then(setWords, () => undefined)
  }, [])

  const list = words ?? FALLBACK_WORDS

  useEffect(() => {
    setWordPool(Array.from({ length: w }, () => list[rnd(list.length)]))
  }, [list])

  useEffect(() => {
    setWordPool((prev) => {
      const next = prev.slice(0, w)
      while (next.length < w) next.push(list[rnd(list.length)])
      return next
    })
  }, [w])

  useEffect(() => {
    setChars((prev) => (prev.length >= c ? prev.slice(0, c) : prev + pickN(POOL, c - prev.length)))
  }, [c])

  const reroll = () => {
    setWordPool(Array.from({ length: w }, () => list[rnd(list.length)]))
    setChars(pickN(POOL, c))
    setAnnounce("New examples cut.")
  }

  const v = useMemo(() => {
    const wBits = w * Math.log2(list.length)
    const cBits = c * Math.log2(POOL.length)
    const wT = tier(wBits)
    const cT = tier(cBits)
    const wC = crack(wBits)
    const cC = crack(cBits)
    const diff = wBits - cBits
    let verdict =
      Math.abs(diff) < 3
        ? "About the same strength — pick by who types it."
        : diff > 0
          ? `The words are stronger here by ${diff.toFixed(0)} bits.`
          : `The characters are stronger here by ${(-diff).toFixed(0)} bits.`
    if (!words) verdict += " (Sample words from a short built-in list until the full list loads.)"
    return {
      wBits: wBits.toFixed(1),
      cBits: cBits.toFixed(1),
      wTier: wT.name,
      cTier: cT.name,
      wPos: `${rulerPct(wC.lg)}%`,
      cPos: `${rulerPct(cC.lg)}%`,
      aria: `Time-to-guess scale. Words: ${wT.name}, ${wC.text}. Characters: ${cT.name}, ${cC.text}.`,
      verdict,
    }
  }, [w, c, list, words])

  const phrase = wordPool.join(" ")

  return (
    <div className="my-3 mb-7 flex flex-col gap-3.5 rounded-lg border border-line bg-surface p-4 text-base leading-normal shadow-e2 md:p-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-primary before:size-2 before:rounded-full before:bg-current before:content-['']">
          Live · side by side
        </span>
        <button type="button" className={btn.secondarySm} onClick={reroll}>
          <ArrowsClockwise className="size-4" weight="bold" aria-hidden />
          Cut new examples
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={side}>
          <div className="flex items-center justify-between">
            <label htmlFor="art-w" className="font-bold">
              Words
            </label>
            <output htmlFor="art-w" className="font-mono text-lg font-bold">
              {w}
            </output>
          </div>
          <input
            id="art-w"
            type="range"
            min={3}
            max={10}
            value={w}
            onChange={(e) => setW(Number(e.target.value))}
            className="m-0 h-8 w-full cursor-pointer accent-primary"
          />
          <p className={sample}>{phrase}</p>
          <p className="!m-0 text-[15px]">
            <strong>{v.wBits} bits</strong> · {v.wTier} · {phrase.length} characters to type
          </p>
        </div>
        <div className={side}>
          <div className="flex items-center justify-between">
            <label htmlFor="art-c" className="font-bold">
              Random characters
            </label>
            <output htmlFor="art-c" className="font-mono text-lg font-bold">
              {c}
            </output>
          </div>
          <input
            id="art-c"
            type="range"
            min={6}
            max={32}
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            className="m-0 h-8 w-full cursor-pointer accent-primary"
          />
          <p className={sample}>{chars}</p>
          <p className="!m-0 text-[15px]">
            <strong>{v.cBits} bits</strong> · {v.cTier} · {c} characters to type
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 rounded-2xl bg-surface-2 px-5 pb-2 pt-[38px]">
        <div className="relative h-3 rounded-full bg-track" role="img" aria-label={v.aria}>
          <div className={needle} style={{ left: v.wPos }} />
          <span className={`${lab} bottom-[22px]`} style={{ left: v.wPos }}>
            Words
          </span>
          <div className={needle} style={{ left: v.cPos }} />
          <span className={`${lab} top-[22px]`} style={{ left: v.cPos }}>
            Characters
          </span>
        </div>
        <div className="relative mt-[26px] hidden h-[42px] md:block" aria-hidden>
          {marks.map((k) => (
            <span
              key={k.label}
              className="absolute flex -translate-x-1/2 flex-col items-center gap-0.5 whitespace-nowrap text-xs text-ink-2"
              style={{ left: k.pos, top: k.top }}
            >
              <i className="block h-2 w-px bg-ink-2" />
              {k.label}
            </span>
          ))}
        </div>
        <div className="h-6 md:hidden" aria-hidden />
      </div>
      <p className="!m-0 text-sm text-ink-3">
        {v.verdict} Words from the EFF long list ({fmt(list.length)} words); characters from all {POOL.length}.
        Estimates assume 100 billion guesses a second.
      </p>
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  )
}

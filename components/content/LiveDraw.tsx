"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowsClockwise } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { btn } from "./styles"

export const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>/?~"
const RANGE = 4294967296
const LIMIT = Math.floor(RANGE / POOL.length) * POOL.length
const LENGTH = 16
const fmt = (n: number) => n.toLocaleString("en-GB")

type Draw = { u: number; ok: boolean; idx: number; cut: string }

// Mirrors rnd() in lib/generator/random but keeps the raw number so the page can show it.
function drawNext(prev: string): Draw {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  const u = buf[0]
  const ok = u < LIMIT
  const idx = u % POOL.length
  const start = prev.length >= LENGTH ? "" : prev
  return { u, ok, idx, cut: ok ? start + POOL[idx] : start }
}

const stepClass =
  "grid min-h-10 grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-line text-[15px]"
const stepNum =
  "inline-flex size-6 items-center justify-center text-[13px] font-bold text-ink"

export function LiveDraw() {
  const [draw, setDraw] = useState<Draw | null>(null)
  const [announce, setAnnounce] = useState("")
  const reduce = useReducedMotion()

  useEffect(() => {
    setDraw(drawNext(""))
  }, [])

  const d = draw ?? { u: 0, ok: true, idx: -1, cut: "" }
  const done = d.cut.length >= LENGTH

  const drawOne = () => {
    const n = drawNext(d.cut)
    setDraw(n)
    setAnnounce(`Number ${fmt(n.u)}, ${n.ok ? "kept" : "redrawn"}, character ${POOL[n.idx]}`)
  }

  const drawAll = () => {
    let cur = done ? "" : d.cut
    let last: Draw = d
    while (cur.length < LENGTH) {
      last = drawNext(cur)
      cur = last.cut
    }
    setDraw(last)
    setAnnounce(`Cut the rest: ${cur.length} characters, ${cur.split("").join(" ")}`)
  }

  return (
    <div
      role="group"
      aria-labelledby="cut-h"
      className="flex flex-col gap-2 rounded-2xl bg-surface p-[22px] text-ink shadow-ticket"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-primary before:size-2 before:rounded-full before:bg-current before:content-['']">
          Live on this page
        </span>
        <span className="font-mono text-[13px] text-ink-3">
          {d.cut.length} of {LENGTH}
        </span>
      </div>
      <h2 id="cut-h" className="m-0 font-display text-2xl font-bold leading-[1.15] tracking-[-0.02em]">
        Cut one character, slowly
      </h2>
      <div>
        <div className={stepClass}>
          <b className={stepNum}>1</b>
          <span>Your device’s random number</span>
          <code className="font-mono text-[15px] font-semibold">{draw ? fmt(d.u) : "…"}</code>
        </div>
        <div className={stepClass}>
          <b className={stepNum}>2</b>
          <span>
            {d.ok
              ? "Below 4,294,967,251, the largest multiple of 89"
              : "In the top 45 values — thrown away, draw again"}
          </span>
          <code className={`font-mono text-[15px] font-semibold ${d.ok ? "text-success" : "text-warning"}`}>
            {d.ok ? "kept" : "redrawn"}
          </code>
        </div>
        <div className={stepClass}>
          <b className={stepNum}>3</b>
          <span>Remainder after dividing by 89</span>
          <code className="font-mono text-[15px] font-semibold">{draw ? d.idx : "…"}</code>
        </div>
        <div className={`${stepClass} border-b-0`}>
          <b className={stepNum}>4</b>
          <span>Character {draw ? d.idx : "…"} of the pool</span>
          <code className="font-mono text-2xl font-semibold text-primary">{draw ? POOL[d.idx] : "…"}</code>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-0.5 font-mono text-[13px] leading-[1.75] text-ink-2" aria-hidden>
        {POOL.split("").map((ch, i) => (
          <span
            key={ch}
            className={`w-3 rounded-[3px] text-center transition-colors duration-200 ease-calm ${i === d.idx ? "bg-primary font-bold text-on-primary" : ""}`}
          >
            {ch}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-md bg-surface-2 px-3.5 py-3">
        <span className="shrink-0 text-[13px] text-ink-3">So far</span>
        <span className="flex-1 font-mono text-xl tracking-[0.04em] [overflow-wrap:anywhere]">
          {d.cut.split("").map((ch, i) => (
            <motion.span
              key={`${i}-${ch}`}
              className="inline-block"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {ch}
            </motion.span>
          ))}
          <span className="text-ink-3">{"·".repeat(Math.max(0, LENGTH - d.cut.length))}</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={cn(btn.primary, "flex-1")} onClick={drawOne} disabled={!draw}>
          <ArrowsClockwise className="size-5" weight="bold" aria-hidden />
          {done ? "Start a new one" : "Draw the next character"}
        </button>
        <button type="button" className={btn.secondary} onClick={drawAll} disabled={!draw}>
          Cut the rest
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  )
}

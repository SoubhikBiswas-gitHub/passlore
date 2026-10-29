"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { ArrowsLeftRight, CaretDown, CaretUp, Info, Question, ShieldCheck, ShieldWarning, Warning, XCircle } from "@phosphor-icons/react"
import { STRENGTH_MARKS, crack, rulerPct, tier } from "@/lib/generator"
import type { Metrics } from "@/lib/generator"
import s from "./Generator.module.css"

type Props = {
  metrics: Metrics
  hasError: boolean
  note: string
  share: ReactNode
}

const TONE = { danger: "var(--st-danger)", warning: "var(--st-warning)", success: "var(--st-success)" } as const

export function StrengthRuler({ metrics, hasError, note, share }: Props) {
  const [detail, setDetail] = useState(false)
  const tr = tier(metrics.bits)
  const ck = crack(metrics.bits)
  const tone = hasError ? "var(--on-stage-2)" : TONE[tr.tone]
  const TierIcon = hasError ? Question : tr.n === 1 ? XCircle : tr.n === 2 ? ShieldWarning : tr.n === 3 ? Warning : ShieldCheck
  const pct = hasError ? 0 : rulerPct(ck.lg)

  return (
    <div className={s.ruler} role="group" aria-label="Strength estimate">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <p className="m-0 flex flex-wrap items-center gap-2.5">
          <TierIcon size={24} weight="bold" aria-hidden="true" style={{ color: tone, alignSelf: "center" }} />
          <strong className="font-display text-2xl tracking-[-0.01em]">{hasError ? "No estimate yet" : tr.name}</strong>
          {!hasError && <span className="text-[15px]" style={{ color: "var(--on-stage-2)" }}>≈ {Math.round(metrics.bits)} bits</span>}
        </p>
        <p className="m-0 text-[15px]" style={{ color: "var(--on-stage)" }}>
          {hasError ? "Fix the rule above to get a password." : "Time to guess: " + ck.text + (ck.cmp ? " — " + ck.cmp : "")}
        </p>
      </div>
      <div className={s.rTrack} aria-hidden="true">
        <span className={s.rFill} style={{ width: pct + "%", background: tone }} />
        <span className={s.rNeedle} style={{ left: pct + "%" }} />
      </div>
      <ol className={s.rMarks} aria-hidden="true">
        {STRENGTH_MARKS.map(([label, lg], i) => (
          <li key={label} className={s.rMark} style={{ left: rulerPct(lg) + "%", top: i % 2 ? 18 : 0 }}>
            <i />
            {label}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-[13px]" style={{ color: "var(--on-stage-2)" }}>
          An estimate: the average time at 100 billion guesses a second
        </p>
        <span className="flex-1" />
        {!hasError && metrics.bits > 0 && share}
        <button type="button" className={s.linkBtn} aria-expanded={detail} aria-controls="strength-detail" onClick={() => setDetail(!detail)}>
          {detail ? "Hide the maths" : "How is this worked out?"}
          {detail ? <CaretUp size={16} aria-hidden="true" /> : <CaretDown size={16} aria-hidden="true" />}
        </button>
      </div>
      {detail && (
        <div id="strength-detail" className={s.detail}>
          <div>
            <h3>The maths</h3>
            <p className={s.formula}>{hasError ? "—" : metrics.formula}</p>
          </div>
          <div>
            <h3>What the time assumes</h3>
            <p>An attacker who knows this recipe, guessing 100 billion times a second against a leaked, fast-hashed database. On average they need half the possibilities.</p>
          </div>
          <div>
            <h3>What it can’t know</h3>
            <p>Whether the site stores it well, whether you reuse it, or whether malware sees it. Tiers: &lt;28 · &lt;50 · &lt;70 · &lt;100 · ≥100 bits.</p>
          </div>
        </div>
      )}
      {!hasError &&
        metrics.notes.map((n) => (
          <p key={n.text} className={s.noteLine}>
            {n.tone === "warning" ? (
              <Warning size={16} aria-hidden="true" className="mt-[3px] flex-none" style={{ color: "var(--st-warning)" }} />
            ) : (
              <Info size={16} aria-hidden="true" className="mt-[3px] flex-none" style={{ color: "var(--st-link)" }} />
            )}
            <span>{n.text}</span>
          </p>
        ))}
      {note && (
        <p className={s.noteLine} style={{ color: "var(--on-stage)" }}>
          <ArrowsLeftRight size={16} aria-hidden="true" className="mt-[3px] flex-none" style={{ color: "var(--st-link)" }} />
          <span>{note}</span>
        </p>
      )}
    </div>
  )
}

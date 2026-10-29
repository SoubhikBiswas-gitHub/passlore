"use client"

import { CheckCircle } from "@phosphor-icons/react"
import s from "./Generator.module.css"

type Props = {
  steps: string[]
  clearOn: boolean
  clearLeft: number
  onToggleClear: () => void
}

function clock(sec: number): string {
  return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0")
}

export function NextSteps({ steps, clearOn, clearLeft, onToggleClear }: Props) {
  return (
    <div className={s.next} role="region" aria-label="What to do next">
      <span className="flex items-center gap-2 font-bold" style={{ color: "var(--st-success)" }}>
        <CheckCircle size={24} weight="bold" aria-hidden="true" />
        Copied
      </span>
      {steps.map((t, i) => (
        <span key={t} className={s.step}>
          <b>{i + 1}</b>
          <span>{t}</span>
        </span>
      ))}
      <span className="flex items-center gap-2.5 text-sm" style={{ color: "var(--on-stage-2)" }}>
        <span id="clr">{clearLeft > 0 ? "Clipboard clears in " + clock(clearLeft) : "Clear clipboard in 60 s"}</span>
        <button className={s.sw} type="button" role="switch" aria-checked={clearOn} aria-labelledby="clr" onClick={onToggleClear}>
          <span className={s.k} />
        </button>
      </span>
    </div>
  )
}

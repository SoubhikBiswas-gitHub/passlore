"use client"

import { useId, useState } from "react"
import type { ReactNode } from "react"
import { Warning } from "@phosphor-icons/react"
import s from "./Generator.module.css"

export function SwitchRow({ id, name, sample, on, onToggle, mono }: { id: string; name: string; sample: ReactNode; on: boolean; onToggle: () => void; mono?: boolean }) {
  return (
    <div className={s.row}>
      <span className={s.rowText}>
        <span id={id} className={s.rowName}>{name}</span>
        <span className={`${s.meta} ${mono ? s.mono : ""}`}>{sample}</span>
      </span>
      <button className={s.sw} type="button" role="switch" aria-checked={on} aria-labelledby={id} onClick={onToggle}>
        <span className={s.k} />
      </button>
    </div>
  )
}

type NumberFieldProps = {
  value: number | null
  min: number
  max: number
  onCommit: (v: number | null) => void
  label?: string
  className?: string
  allowEmpty?: boolean
  id?: string
  full?: boolean
  overMax?: string
  underMin?: string
}

export function NumberField({ value, min, max, onCommit, label, className, allowEmpty, id, full, overMax, underMin }: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const errId = useId()
  const n = draft === null ? NaN : parseInt(draft, 10)
  const error = isNaN(n) ? "" : n > max ? overMax ?? "Up to " + max + "." : n < min ? underMin ?? "At least " + min + "." : ""
  const commit = () => {
    if (draft === null) return
    const n = parseInt(draft, 10)
    setDraft(null)
    if (isNaN(n)) {
      if (allowEmpty) onCommit(null)
      return
    }
    onCommit(Math.max(min, Math.min(max, n)))
  }
  return (
    <span className={`${s.numWrap} ${full ? s.numFull : ""} ${className ?? ""}`}>
      <input
        id={id}
        className={`${s.field} ${s.num}`}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        aria-label={label}
        aria-invalid={error ? true : undefined}
        aria-describedby={errId}
        value={draft ?? (value == null ? "" : String(value))}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit()
        }}
      />
      <span id={errId} className={s.fieldErr} aria-live="polite">
        {error ? (
          <>
            <Warning size={16} aria-hidden="true" className="flex-none" />
            {error}
          </>
        ) : null}
      </span>
    </span>
  )
}

export function LengthControl({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className={s.row} style={{ minHeight: 44 }}>
        <label className={s.lbl} htmlFor="len">{label}</label>
        <NumberField value={value} min={min} max={max} label={label} onCommit={(v) => v != null && onChange(v)} />
      </div>
      <input
        id="len"
        className={s.range}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
      <div className={`${s.meta} flex justify-between`} aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export function TextField({ label, value, onChange, placeholder, mono }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <label className={s.fieldLabel}>
      <span className={s.lbl}>{label}</span>
      <input
        className={`${s.field} ${mono ? s.mono : ""}`}
        type="text"
        value={value}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

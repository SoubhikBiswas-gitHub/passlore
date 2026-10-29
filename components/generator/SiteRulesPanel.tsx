"use client"

import { Check, CheckCircle, Plus, Warning, X } from "@phosphor-icons/react"
import { SETS, formConflict, formRules } from "@/lib/generator"
import type { Config, FormRules } from "@/lib/generator"
import { NumberField } from "./controls"
import s from "./Generator.module.css"

type Props = {
  form: Config["form"]
  password: string
  onForm: (patch: Partial<Config["form"]>) => void
}

type Chip = { label: string; on: boolean; aria: string; toggle: (() => void) | null }

const NEEDS: [keyof FormRules, string][] = [
  ["upper", "Uppercase"],
  ["lower", "Lowercase"],
  ["digit", "Number"],
  ["symbol", "Symbol"],
  ["startLetter", "Starts with a letter"],
]

function uniq(str: string): string {
  return Array.from(new Set(str.split(""))).join("")
}

export function SiteRulesPanel({ form, password, onForm }: Props) {
  const r = formRules(form)
  const p = r.parsed
  const conflict = formConflict(r)
  const ov = form.ov
  const setOv = (patch: Partial<FormRules>) => onForm({ ov: { ...ov, ...patch } })
  const symPool = r.noSymbols ? "" : r.syms != null ? r.syms : SETS.S

  const chips: Chip[] = []
  const mk = (key: keyof FormRules, label: string, on: boolean) =>
    chips.push({ label, on, aria: (on ? "Ignore rule: " : "Use rule: ") + label, toggle: () => setOv({ [key]: !on }) })
  if (p.min != null || p.max != null) chips.push({ label: (p.min ?? "?") + "–" + (p.max ?? "?") + " characters", on: true, aria: "", toggle: null })
  if (p.upper) mk("upper", "Uppercase letter", r.upper)
  if (p.lower) mk("lower", "Lowercase letter", r.lower)
  if (p.digit) mk("digit", "A number", r.digit)
  if (p.symbol) mk("symbol", "A symbol", r.symbol)
  if (p.syms) chips.push({ label: "Symbols: " + p.syms, on: true, aria: "", toggle: null })
  if (p.noSymbols) mk("noSymbols", "No symbols", r.noSymbols)
  if (p.startLetter) mk("startLetter", "Starts with a letter", r.startLetter)
  if (p.noSpaces) chips.push({ label: "No spaces", on: true, aria: "", toggle: null })

  const fit: { ok: boolean; text: string }[] = []
  if (!conflict && password) {
    const L = password.length
    fit.push({ ok: L >= (r.min ?? 0) && L <= (r.max ?? 999), text: (r.min ?? 1) + "–" + (r.max ?? "∞") + " characters → " + L + " (the longest allowed)" })
    if (r.upper) fit.push({ ok: /[A-Z]/.test(password), text: "An uppercase letter" })
    if (r.lower) fit.push({ ok: /[a-z]/.test(password), text: "A lowercase letter" })
    if (r.digit) fit.push({ ok: /[0-9]/.test(password), text: "A number" })
    if (r.symbol) fit.push({ ok: password.split("").some((x) => symPool.includes(x)), text: "A symbol" + (r.syms ? " from " + r.syms : "") })
    if (r.syms != null || r.noSymbols) fit.push({ ok: password.split("").every((x) => /[A-Za-z0-9]/.test(x) || symPool.includes(x)), text: r.noSymbols ? "No symbols at all" : "Only the symbols it accepts" })
    if (r.startLetter) fit.push({ ok: /^[A-Za-z]/.test(password), text: "Starts with a letter" })
    fit.push({ ok: !password.includes(" "), text: "No spaces" })
  }

  return (
    <div className="flex flex-col gap-3.5">
      <label className="flex flex-col gap-1.5">
        <span className={s.lbl}>Paste the site’s password rules</span>
        <textarea
          className={s.field}
          value={form.text}
          spellCheck={false}
          placeholder="e.g. 8–16 characters, at least one uppercase letter and one number, symbols !@#$ only, no spaces"
          onChange={(e) => onForm({ text: e.target.value, ov: {} })}
        />
        <span className={s.meta}>Read on this device — the text never leaves it. Or skip pasting and set the rules below.</span>
      </label>

      <div className="flex flex-col gap-2">
        <p className={s.lbl}>{chips.length ? "Found in the text — tap × to ignore one" : "No rules found yet — paste them above or set them here"}</p>
        {chips.length > 0 && (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Rules found in the text">
            {chips.map((c) => (
              <li key={c.label} className={`${s.chip} ${c.on ? "" : s.chipOff} ${c.toggle ? "" : s.chipStatic}`}>
                <span>{c.label}</span>
                {c.toggle ? (
                  <button type="button" aria-label={c.aria} onClick={c.toggle}>
                    {c.on ? <X size={16} weight="bold" aria-hidden="true" /> : <Plus size={16} weight="bold" aria-hidden="true" />}
                  </button>
                ) : (
                  <Check size={16} weight="bold" aria-hidden="true" style={{ color: "var(--success)" }} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-x-6 gap-y-3 border-t pt-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", borderColor: "var(--border)" }}>
        <div className="flex items-end gap-2.5">
          <label className={`${s.fieldLabel} flex-1`}>
            <span className={s.lbl}>Shortest</span>
            <NumberField className="w-full" value={r.min} min={1} max={128} allowEmpty onCommit={(v) => setOv({ min: v })} />
          </label>
          <label className={`${s.fieldLabel} flex-1`}>
            <span className={s.lbl}>Longest</span>
            <NumberField className="w-full" value={r.max} min={1} max={128} allowEmpty onCommit={(v) => setOv({ max: v })} />
          </label>
        </div>
        <label className={s.fieldLabel}>
          <span className={s.lbl}>Symbols it accepts</span>
          <input
            className={`${s.field} ${s.mono}`}
            type="text"
            value={symPool}
            placeholder="Leave empty for none"
            spellCheck={false}
            autoComplete="off"
            onChange={(e) => {
              const v = uniq(e.target.value.replace(/[^\x21-\x7E]|[A-Za-z0-9]/g, ""))
              setOv({ syms: v, noSymbols: v.length === 0 })
            }}
          />
        </label>
      </div>

      <div role="group" aria-label="Must include" className={s.picks}>
        {NEEDS.map(([key, label]) => (
          <button key={key} className={s.pick} type="button" aria-pressed={!!r[key]} onClick={() => setOv({ [key]: !r[key] })}>
            {label}
          </button>
        ))}
      </div>

      <div className={s.fitBox} style={{ background: conflict ? "var(--warning-soft)" : "var(--success-soft)" }}>
        <p className={s.fitTitle}>
          {conflict ? (
            <Warning size={20} weight="bold" aria-hidden="true" style={{ color: "var(--warning)" }} />
          ) : (
            <CheckCircle size={20} weight="bold" aria-hidden="true" style={{ color: "var(--success)" }} />
          )}
          {conflict ? "These rules can’t all be met" : "Fits every rule"}
        </p>
        {fit.length > 0 && (
          <ul className="m-0 list-none p-0" aria-label="How this password fits the rules">
            {fit.map((f) => (
              <li key={f.text} className={s.fit}>
                {f.ok ? (
                  <Check size={16} weight="bold" aria-hidden="true" style={{ color: "var(--success)" }} />
                ) : (
                  <X size={16} weight="bold" aria-hidden="true" style={{ color: "var(--danger)" }} />
                )}
                <span>
                  <span className={s.sr}>{f.ok ? "Met: " : "Not met: "}</span>
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

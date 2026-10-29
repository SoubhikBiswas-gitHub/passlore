"use client"

import { CheckCircle, Warning } from "@phosphor-icons/react"
import type { Config, RecipeId } from "@/lib/generator"
import { BulkList } from "./BulkList"
import { WifiQr } from "./WifiQr"
import { SiteRulesPanel } from "./SiteRulesPanel"
import { LengthControl, NumberField, SwitchRow, TextField } from "./controls"
import { BUILD_KINDS, recipeDef } from "./recipes"
import type { BuildKind } from "./recipes"
import s from "./Generator.module.css"

export type SetCfg = <K extends keyof Config>(key: K, patch: Partial<Config[K]>, why: string) => void

type Props = {
  recipe: RecipeId
  cfg: Config
  password: string
  bulk: string[]
  wordCount: number
  fullList: boolean
  buildKind: BuildKind | null
  onBuild: (k: BuildKind) => void
  setCfg: SetCfg
  revealed: boolean
  onCopyValue: (value: string) => Promise<boolean>
}

type LenCfg = { label: string; min: number; max: number; value: number; key: string }

function lenCfgOf(recipe: RecipeId, cfg: Config): LenCfg | null {
  if (recipe === "quick") return { label: "Length", min: 8, max: 64, value: cfg.quick.length, key: "length" }
  if (recipe === "manager") return { label: "Length", min: 16, max: 128, value: cfg.manager.length, key: "length" }
  if (recipe === "wifi") return { label: "Words", min: 4, max: 9, value: cfg.wifi.words, key: "words" }
  if (recipe === "tv") return { label: "Words", min: 4, max: 9, value: cfg.tv.words, key: "words" }
  if (recipe === "master") return { label: "Words", min: 5, max: 10, value: cfg.master.words, key: "words" }
  if (recipe === "bulk") return { label: "Length of each", min: 8, max: 64, value: cfg.bulk.length, key: "length" }
  if (recipe === "custom") {
    const c = cfg.custom
    if (c.kind === "words") return { label: "Words", min: 3, max: 10, value: c.words, key: "words" }
    if (c.kind === "pron") return { label: "Length", min: 6, max: 32, value: c.pronLen, key: "pronLen" }
    if (c.kind === "pattern") return null
    return { label: "Length", min: 4, max: 128, value: c.length, key: "length" }
  }
  return null
}

const SEPS: [string, string, string][] = [
  ["-", "Hyphen", "-"],
  [".", "Dot", "."],
  ["_", "Underscore", "_"],
  [" ", "Space", "␣"],
]

const CHAR_OPTS: ["upper" | "lower" | "digits" | "symbols" | "noSimilar", string, string][] = [
  ["upper", "Uppercase", "A B C … Z"],
  ["lower", "Lowercase", "a b c … z"],
  ["digits", "Digits", "0 1 2 … 9"],
  ["symbols", "Symbols", "! @ # $ % & …"],
  ["noSimilar", "Avoid look-alikes", "0 O o 1 l I |"],
]

export function RecipePanel(p: Props) {
  const { recipe, cfg, setCfg } = p
  const def = recipeDef(recipe)
  const Icon = def.icon
  const len = lenCfgOf(recipe, cfg)
  const words = recipe === "wifi" || (recipe === "custom" && cfg.custom.kind === "words")
  const sepKey = recipe === "wifi" ? "wifi" : "custom"
  const sep = recipe === "wifi" ? cfg.wifi.sep : cfg.custom.sep

  const onLen = (v: number) => {
    if (!len || v === len.value) return
    setCfg(recipe as keyof Config, { [len.key]: v } as never, len.label + " " + len.value + " → " + v)
  }

  return (
    <div className={`${s.card} ${s.panel}`}>
      <div className={s.panelHead}>
        <span className={s.panelIcon} aria-hidden="true"><Icon size={32} /></span>
        <div className="flex flex-col gap-1">
          <h2 className={s.h2}>{def.title}</h2>
          <p className={s.why}>{def.why}</p>
        </div>
      </div>

      {p.buildKind && (
        <div role="radiogroup" aria-label="What to build" className={s.bk}>
          {BUILD_KINDS.map(([k, name]) => (
            <button
              key={k}
              className={s.pick}
              type="button"
              role="radio"
              aria-checked={p.buildKind === k}
              tabIndex={p.buildKind === k ? 0 : -1}
              onClick={() => p.onBuild(k)}
              onKeyDown={(ev) => {
                const i = BUILD_KINDS.findIndex(([x]) => x === k)
                let n = -1
                if (ev.key === "ArrowRight" || ev.key === "ArrowDown") n = (i + 1) % BUILD_KINDS.length
                if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") n = (i + BUILD_KINDS.length - 1) % BUILD_KINDS.length
                if (n < 0) return
                ev.preventDefault()
                p.onBuild(BUILD_KINDS[n][0])
                const sib = ev.currentTarget.parentElement?.children[n] as HTMLElement | undefined
                sib?.focus()
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {len && <LengthControl label={len.label} min={len.min} max={len.max} value={len.value} onChange={onLen} />}

      {recipe === "quick" && (
        <div className="grid gap-x-6 border-t" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", borderColor: "var(--border)" }}>
          <SwitchRow id="o-sym" name="Symbols" sample="! @ # $ % & * …" mono on={cfg.quick.symbols} onToggle={() => setCfg("quick", { symbols: !cfg.quick.symbols }, cfg.quick.symbols ? "Symbols off" : "Symbols on")} />
          <SwitchRow id="o-sim" name="Avoid look-alikes" sample={<>Drops <code className={s.mono}>0 O o 1 l I |</code></>} on={cfg.quick.noSimilar} onToggle={() => setCfg("quick", { noSimilar: !cfg.quick.noSimilar }, cfg.quick.noSimilar ? "Look-alikes allowed" : "Look-alikes dropped")} />
        </div>
      )}

      {recipe === "form" && <SiteRulesPanel form={cfg.form} password={p.password} onForm={(patch) => setCfg("form", patch, "")} />}

      {words && (
        <div className={s.section} style={{ gap: 8 }}>
          <p className={s.lbl} id="sepl">Between words</p>
          <div role="group" aria-labelledby="sepl" className={s.sepGrid}>
            {SEPS.map(([v, name, glyph]) => (
              <button key={name} className={`${s.pick} ${s.sepPick}`} type="button" aria-pressed={sep === v} aria-label={"Between words: " + name} onClick={() => setCfg(sepKey, { sep: v }, "")}>
                <span className={s.sepGlyph} aria-hidden="true">{glyph}</span>
                <span className={s.sepName} aria-hidden="true">{name}</span>
              </button>
            ))}
          </div>
          <p className={s.meta} style={{ margin: 0 }}>
            Words from the EFF long list — {p.wordCount.toLocaleString("en-GB")}
            {p.fullList ? " of its 7,776; “undefined” reads like a bug and the four hyphenated words blur word breaks, so they are left out" : " for now (loading the full list…)"}. The estimate assumes an attacker has the same list.
          </p>
        </div>
      )}

      {recipe === "wifi" && (
        <div className={`${s.cols2} ${s.section}`}>
          <div className="flex flex-col gap-2.5">
            <label className="flex flex-col gap-1.5">
              <span className={s.lbl}>Network name (for the QR code)</span>
              <input
                className={s.field}
                type="text"
                value={cfg.wifi.ssid}
                placeholder="e.g. Home-5G"
                spellCheck={false}
                autoComplete="off"
                onChange={(e) => setCfg("wifi", { ssid: e.target.value }, "")}
              />
              <span className={s.meta}>Stays on this device. Only used to draw the QR.</span>
            </label>
            {p.password && (
              <p className="m-0 flex items-start gap-2 text-[15px]">
                {p.password.length <= 63 ? (
                  <CheckCircle size={16} weight="bold" aria-hidden="true" className="mt-1 flex-none" style={{ color: "var(--success)" }} />
                ) : (
                  <Warning size={16} weight="bold" aria-hidden="true" className="mt-1 flex-none" style={{ color: "var(--warning)" }} />
                )}
                <span>
                  {p.password.length} characters — {p.password.length <= 63 ? "inside Wi-Fi’s 8–63 limit" : "over Wi-Fi’s 63 limit; use fewer words"}
                </span>
              </p>
            )}
            <p className={s.meta} style={{ margin: 0 }}>
              Guests point their phone camera at the code to join — no typing. Print it or keep it on screen; anyone who sees it can join.
            </p>
          </div>
          <WifiQr ssid={cfg.wifi.ssid} password={p.password} />
        </div>
      )}

      {recipe === "pin" && (
        <div className={s.section} style={{ gap: 10 }}>
          <p className={s.lbl} id="pin-digits">Digits</p>
          <div role="group" aria-labelledby="pin-digits" className="flex gap-2">
            {[4, 6, 8].map((n) => (
              <button key={n} className={s.pick} type="button" aria-pressed={cfg.pin.digits === n} onClick={() => n !== cfg.pin.digits && setCfg("pin", { digits: n }, "Digits " + cfg.pin.digits + " → " + n)}>
                {n}
              </button>
            ))}
          </div>
          <SwitchRow id="o-obv" name="Skip obvious PINs" sample="1234, 0000, 1212, 2580 and others people guess first" on={cfg.pin.skip} onToggle={() => setCfg("pin", { skip: !cfg.pin.skip }, "")} />
        </div>
      )}

      {recipe === "bulk" && (
        <div className={s.section}>
          <div role="group" aria-labelledby="bulk-count" className={s.picks}>
            <span className={s.lbl} id="bulk-count" style={{ marginRight: 4 }}>How many</span>
            {[10, 50, 200, 500].map((n) => (
              <button key={n} className={s.pick} type="button" aria-pressed={cfg.bulk.count === n} onClick={() => setCfg("bulk", { count: n }, "")}>
                {n}
              </button>
            ))}
            <NumberField value={cfg.bulk.count} min={1} max={500} label="How many passwords" onCommit={(v) => v != null && setCfg("bulk", { count: v }, "")} />
          </div>
          <BulkList items={p.bulk} length={cfg.bulk.length} revealed={p.revealed} onCopy={p.onCopyValue} />
        </div>
      )}

      {recipe === "custom" && cfg.custom.kind === "random" && (
        <div className={s.section}>
          <div className={s.switchGrid}>
            {CHAR_OPTS.map(([k, name, sample]) => (
              <SwitchRow
                key={k}
                id={"cu-" + k}
                name={name}
                sample={sample}
                on={cfg.custom[k]}
                onToggle={() => setCfg("custom", { [k]: !cfg.custom[k] }, name + (cfg.custom[k] ? " off" : " on"))}
              />
            ))}
          </div>
          <div className={s.fieldGrid}>
            <TextField label="Never use" mono placeholder="e.g. @ % &" value={cfg.custom.exclude} onChange={(v) => setCfg("custom", { exclude: v }, "Exclusions changed")} />
            <TextField label="Must include" mono placeholder="At a random spot" value={cfg.custom.include} onChange={(v) => setCfg("custom", { include: v }, "")} />
            <TextField label="Prefix" mono value={cfg.custom.prefix} onChange={(v) => setCfg("custom", { prefix: v }, "")} />
            <TextField label="Suffix" mono value={cfg.custom.suffix} onChange={(v) => setCfg("custom", { suffix: v }, "")} />
          </div>
        </div>
      )}
    </div>
  )
}

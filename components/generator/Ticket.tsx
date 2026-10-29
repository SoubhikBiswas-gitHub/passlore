"use client"

import { ArrowsClockwise, ArrowsOut, Eye, EyeSlash, TextAa, Warning } from "@phosphor-icons/react"
import { SpellItOut } from "./SpellItOut"
import { CopyButton } from "./CopyButton"
import type { RecipeDef } from "./recipes"
import { kindOf, sayPassword } from "./speech"
import s from "./Generator.module.css"

export type TicketError = { title: string; text: string; fixLabel: string; onFix: () => void }

type Props = {
  def: RecipeDef
  meta: string
  error: TicketError | null
  password: string
  shown: string
  bulk: string[] | null
  isWords: boolean
  revealed: boolean
  spell: boolean
  ready: boolean
  copied: boolean
  burst: number
  copyLabel: string
  regenLabel: string
  note: string
  onCopy: () => void
  onRegen: () => void
  onToggleReveal: () => void
  onToggleSpell: () => void
  onShowBig: (() => void) | null
}

const COLOR = { digit: "var(--digit)", symbol: "var(--sym)", upper: "var(--text)", lower: "var(--text)", space: "var(--text)" } as const

export function Ticket(p: Props) {
  const Icon = p.def.icon
  const single = !p.error && !p.bulk
  const len = p.password.length
  const sizeCls = len > 90 ? s.pwHuge : len > 40 ? s.pwLong : ""
  const noOutput = !!p.error || !p.ready || (p.bulk ? p.bulk.length === 0 : !p.password)

  return (
    <div className={s.tw}>
      <div id="ticket" className={s.ticket} role="region" aria-label={"Password for " + p.def.name}>
        <div className={s.tMain}>
          <div className={s.tTop}>
            <span className={s.for}>
              <Icon size={16} weight="bold" aria-hidden="true" />
              For · {p.def.name}
            </span>
            <span className={s.meta}>{p.meta}</span>
          </div>

          {p.error && (
            <div role="alert" className={s.alert}>
              <Warning size={24} aria-hidden="true" className="mt-[3px] flex-none" style={{ color: "var(--warning)" }} />
              <div className="flex flex-col items-start gap-2">
                <p className={s.alertTitle}>{p.error.title}</p>
                <p className="m-0" style={{ color: "var(--text-2)" }}>{p.error.text}</p>
                <button className={`${s.btn} ${s.btnS}`} type="button" onClick={p.error.onFix}>{p.error.fixLabel}</button>
              </div>
            </div>
          )}

          {single && (
            <>
              <p
                className={`${s.pw} ${sizeCls}`}
                aria-hidden="true"
                data-testid="password-value"
                style={{ wordBreak: p.isWords ? "normal" : "break-all" }}
              >
                {p.revealed
                  ? p.shown.split("").map((ch, i) => (
                      <span key={i} style={{ color: COLOR[kindOf(ch)] }}>{ch}</span>
                    ))
                  : <span style={{ color: "var(--text-3)" }}>{"•".repeat(len)}</span>}
              </p>
              <p className={s.sr}>{p.ready ? (p.revealed ? "Password: " + sayPassword(p.password) : "Password hidden.") : "Cutting a password…"}</p>
            </>
          )}

          {!p.error && p.bulk && (
            <div className="flex flex-col gap-1">
              <p className={s.bulkTitle}>{p.bulk.length} passwords, cut</p>
              {p.bulk.slice(0, 3).map((v, i) => (
                <p key={i} className={s.bulkPeek}>{p.revealed ? v : "•".repeat(v.length)}</p>
              ))}
              <a href="#tune" className={s.howLink} style={{ fontSize: 15 }}>See all and export</a>
            </div>
          )}

          {single && p.spell && p.revealed && p.password && <SpellItOut password={p.password} />}

          <div className={s.tTools}>
            <button
              className={s.ib}
              type="button"
              aria-pressed={!p.revealed}
              aria-label={p.revealed ? "Hide password" : "Show password"}
              title={p.revealed ? "Hide password" : "Show password"}
              onClick={p.onToggleReveal}
              disabled={!!p.error}
            >
              {p.revealed ? <EyeSlash size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
            </button>
            <button
              className={s.ib}
              type="button"
              aria-pressed={p.spell}
              aria-label="Spell it out, with the phonetic alphabet"
              title="Spell it out"
              onClick={p.onToggleSpell}
              disabled={!single || !p.revealed}
            >
              <TextAa size={20} aria-hidden="true" />
            </button>
            {single && p.onShowBig && (
              <button className={`${s.btn} ${s.btnG} ${s.btnSm}`} type="button" onClick={p.onShowBig}>
                <ArrowsOut size={20} aria-hidden="true" />
                Show big
              </button>
            )}
          </div>
        </div>

        <div className={s.tStub}>
          <CopyButton
            className={s.stubMain}
            label={p.copyLabel}
            copied={p.copied}
            burst={p.burst}
            disabled={noOutput}
            onCopy={p.onCopy}
          />
          <button className={`${s.btn} ${s.btnS} ${s.stubMain} w-full`} type="button" onClick={p.onRegen}>
            <ArrowsClockwise size={20} aria-hidden="true" />
            {p.regenLabel}
          </button>
          <p className={`${s.meta} ${s.stubNote} ${s.stubMain}`}>{p.note}</p>
          <span className={`${s.meta} ${s.onlyNarrow} min-h-8 items-center gap-1.5`}>{p.note}</span>
        </div>
      </div>
    </div>
  )
}

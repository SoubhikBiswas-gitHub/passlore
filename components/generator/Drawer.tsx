"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Check, Copy, Eye, X } from "@phosphor-icons/react"
import { Lore } from "@/components/Lore"
import type { HistoryEntry } from "@/lib/generator"
import { recipeDef } from "./recipes"
import s from "./Generator.module.css"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  entries: HistoryEntry[]
  copiedKey: string
  onCopy: (entry: HistoryEntry) => void
  onEmpty: () => void
}

export function timeOf(at: number): string {
  return new Date(at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

export function labelOf(e: HistoryEntry): string {
  const name = recipeDef(e.recipe).name
  if (e.recipe === "bulk") return name + " · " + e.value.split("\n").length
  return name + " · " + e.value.length + " chars"
}

export function Drawer({ open, onOpenChange, entries, copiedKey, onCopy, onEmpty }: Props) {
  const [peek, setPeek] = useState<number | null>(null)
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) setPeek(null); onOpenChange(o) }}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.scrim} />
        <Dialog.Content className={s.sheet}>
          <div className={s.grab} aria-hidden="true" />
          <div className={s.sheetHead}>
            <Dialog.Title className={s.sheetTitle}>This tab’s drawer</Dialog.Title>
            <Dialog.Close className={s.ib} aria-label="Close the drawer">
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <Dialog.Description className={s.meta} style={{ margin: 0, padding: "0 20px 8px" }}>
            Today · {today} · hold the eye to peek · copy without revealing
          </Dialog.Description>
          {entries.length === 0 ? (
            <div className={s.empty}>
              <Lore mood="sleepy" scene="drawer" size={170} />
              <p className="m-0 text-[17px] font-bold">Nothing in the drawer yet</p>
              <p className="m-0 max-w-[340px]" style={{ color: "var(--text-2)" }}>
                Passwords you copy or cut land here, masked, for this tab only.
              </p>
            </div>
          ) : (
            <ul className={s.sheetList}>
              {entries.map((e) => {
                const def = recipeDef(e.recipe)
                const Icon = def.icon
                const label = labelOf(e)
                const time = timeOf(e.at)
                const one = e.value.replace(/\n/g, " ")
                const shown = peek === e.id
                const done = copiedKey === "h" + e.id
                return (
                  <li key={e.id} className={s.hRow}>
                    <span className={s.hIcon} aria-hidden="true"><Icon size={20} /></span>
                    <span className="flex min-w-0 flex-col">
                      <span className={s.hValue} style={{ letterSpacing: shown ? "0.02em" : "0.08em" }}>
                        {shown ? one : "•".repeat(Math.min(32, one.length))}
                      </span>
                      <span className={s.meta}>{label} · {time}</span>
                    </span>
                    <button
                      className={s.ib}
                      type="button"
                      aria-label={"Hold to peek at " + label + " from " + time}
                      aria-pressed={shown}
                      onPointerDown={() => setPeek(e.id)}
                      onPointerUp={() => setPeek(null)}
                      onPointerLeave={() => setPeek(null)}
                      onPointerCancel={() => setPeek(null)}
                      onContextMenu={(ev) => ev.preventDefault()}
                      onKeyDown={(ev) => {
                        if (ev.key === " " || ev.key === "Enter") {
                          ev.preventDefault()
                          setPeek(e.id)
                        }
                      }}
                      onKeyUp={() => setPeek(null)}
                      onBlur={() => setPeek(null)}
                    >
                      <Eye size={20} aria-hidden="true" />
                    </button>
                    <button className={s.ib} type="button" aria-label={"Copy " + label + " from " + time} onClick={() => onCopy(e)}>
                      {done ? <Check size={20} weight="bold" aria-hidden="true" style={{ color: "var(--success)" }} /> : <Copy size={20} aria-hidden="true" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          <div className={s.sheetFoot}>
            <button className={`${s.btn} ${s.btnS} flex-1`} type="button" style={{ color: "var(--danger)" }} onClick={onEmpty} disabled={entries.length === 0}>
              Empty it
            </button>
            <Dialog.Close className={`${s.btn} ${s.btnP} flex-1`}>Done</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

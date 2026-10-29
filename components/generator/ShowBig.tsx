"use client"

import * as Dialog from "@radix-ui/react-dialog"
import type { RecipeDef } from "./recipes"
import s from "./Generator.module.css"

const SEP_NAME: Record<string, string> = { "-": "a hyphen", " ": "a space", ".": "a dot", _: "an underscore" }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  def: RecipeDef
  password: string
  isWords: boolean
  sep: string
}

export function ShowBig({ open, onOpenChange, def, password, isWords, sep }: Props) {
  const parts = isWords ? password.split(/[ \-._]/) : password.match(/.{1,4}/g) ?? []
  const Icon = def.icon
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Content className={s.big}>
          <div className="flex items-center justify-between gap-3">
            <span className={s.for}>
              <Icon size={16} weight="bold" aria-hidden="true" />
              For · {def.name}
            </span>
            <Dialog.Close className={`${s.btn} ${s.btnP} ${s.btnLg}`}>Done</Dialog.Close>
          </div>
          <Dialog.Title className={s.sr}>Password, shown big</Dialog.Title>
          <ol className={s.bigList}>
            {parts.map((t, i) => (
              <li key={i}>
                <span className={s.bigN} aria-hidden="true">{i + 1}</span>
                <span className={s.bigWord}>{t}</span>
              </li>
            ))}
          </ol>
          <Dialog.Description className="m-0 text-base" style={{ color: "var(--on-stage-2)" }}>
            {isWords
              ? "One word per line, in order. Type " + (SEP_NAME[sep] ?? "the separator") + " between words."
              : "Groups of four, in order. Type them without spaces."}
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

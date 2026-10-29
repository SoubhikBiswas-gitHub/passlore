"use client"

import { useRef } from "react"
import type { KeyboardEvent } from "react"
import type { RecipeId } from "@/lib/generator"
import { DECK } from "./recipes"
import s from "./Generator.module.css"

type Props = {
  selected: RecipeId
  onPick: (id: RecipeId) => void
}

export function RecipeDeck({ selected, onPick }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (ev: KeyboardEvent<HTMLDivElement>) => {
    let i = DECK.findIndex((d) => d.id === selected)
    if (ev.key === "ArrowRight" || ev.key === "ArrowDown") i = (i + 1) % DECK.length
    else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") i = (i + DECK.length - 1) % DECK.length
    else if (ev.key === "Home") i = 0
    else if (ev.key === "End") i = DECK.length - 1
    else return
    ev.preventDefault()
    onPick(DECK[i].id)
    refs.current[i]?.focus()
  }

  return (
    <div className={s.deck} role="radiogroup" aria-label="Where is this password going?" onKeyDown={onKey}>
      {DECK.map((r, i) => {
        const on = r.id === selected
        const Icon = r.icon
        return (
          <button
            key={r.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            className={s.rc}
            type="button"
            role="radio"
            aria-checked={on}
            aria-labelledby={`rc-${r.id}`}
            aria-describedby={`rc-${r.id}-line`}
            tabIndex={on ? 0 : -1}
            onClick={() => onPick(r.id)}
          >
            <Icon className={s.rcIcon} aria-hidden="true" />
            <span id={`rc-${r.id}`} className={s.rcName}>{r.name}</span>
            <span className={s.rcShort} aria-hidden="true">{r.short}</span>
            <span id={`rc-${r.id}-line`} className={s.rcLine}>{r.line}</span>
            {on && <span className={s.rcTag} aria-hidden="true">Using</span>}
          </button>
        )
      })}
    </div>
  )
}

"use client"

import type { CSSProperties } from "react"
import { Check, Copy } from "@phosphor-icons/react"
import s from "./Generator.module.css"

const BURST: [number, number, string][] = [
  [-96, -44, "#C8FF2E"],
  [-40, -62, "#2447F5"],
  [30, -58, "#FFFFFF"],
  [96, -36, "#C8FF2E"],
  [110, 18, "#2447F5"],
  [-110, 16, "#FFFFFF"],
]

type Props = {
  label: string
  copied: boolean
  burst: number
  disabled: boolean
  onCopy: () => void
  className?: string
  style?: CSSProperties
}

export function CopyButton({ label, copied, burst, disabled, onCopy, className, style }: Props) {
  return (
    <span className={`${s.cpw} ${className ?? ""}`} style={style}>
      <button
        className={`${s.btn} ${s.btnP} ${s.btnLg} w-full`}
        type="button"
        data-done={copied}
        disabled={disabled}
        onClick={onCopy}
      >
        {copied ? <Check size={20} weight="bold" aria-hidden="true" /> : <Copy size={20} aria-hidden="true" />}
        {copied ? "Copied" : label}
      </button>
      {burst > 0 && (
        <span key={burst} className={s.burst} aria-hidden="true">
          {BURST.map(([x, y, bg], i) => (
            <i key={i} style={{ "--x": x + "px", "--y": y + "px", background: bg } as CSSProperties} />
          ))}
        </span>
      )}
    </span>
  )
}

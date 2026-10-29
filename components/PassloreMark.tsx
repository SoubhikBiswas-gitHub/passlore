"use client"

import { useEffect, useId, useState } from "react"
import { cn } from "@/lib/utils"

export const NEW_PASSWORD_EVENT = "passlore:new-password"

const BOW = "M6.5 3H17A8.5 8.5 0 0 1 17 20H12.5V29H6.5Z"
const HOLE = "M18 8.5A3 3 0 0 1 19.4 14.15L20 16.5H16L16.6 14.15A3 3 0 0 1 18 8.5Z"

const MARK_CSS = `
.pl-mark-bow,.pl-mark-hole,.pl-mark-tooth{transform-box:fill-box}
.pl-mark-bow,.pl-mark-hole{transform-origin:center}
.pl-mark-tooth{transform-origin:left center}
.pl-mark-arrive .pl-mark-bow{animation:pl-mark-bow var(--t-arrive) var(--ease-expo) both}
.pl-mark-arrive .pl-mark-hole{animation:pl-mark-hole var(--t-arrive) var(--ease-expo) 120ms both}
.pl-mark-arrive .pl-mark-t1{animation:pl-mark-cut 260ms var(--ease) 300ms both}
.pl-mark-arrive .pl-mark-t2{animation:pl-mark-cut 260ms var(--ease) 380ms both}
.pl-mark-tick-a .pl-mark-tooth{animation:pl-mark-tick-a var(--t-base) var(--ease)}
.pl-mark-tick-b .pl-mark-tooth{animation:pl-mark-tick-b var(--t-base) var(--ease)}
@keyframes pl-mark-bow{from{transform:scale(.86);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes pl-mark-hole{from{transform:scale(0)}to{transform:scale(1)}}
@keyframes pl-mark-cut{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes pl-mark-tick-a{50%{transform:scaleX(.55)}}
@keyframes pl-mark-tick-b{50%{transform:scaleX(.55)}}
@media (prefers-reduced-motion:reduce){.pl-mark *{animation:none!important}}
`

type Props = {
  size?: number
  className?: string
  arrive?: boolean
  tick?: boolean
}

export function PassloreMark({ size = 30, className, arrive = false, tick = false }: Props) {
  const maskId = `pl-mark-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const [ticks, setTicks] = useState(0)

  useEffect(() => {
    if (!tick) return
    const onNew = () => setTicks((n) => n + 1)
    window.addEventListener(NEW_PASSWORD_EVENT, onNew)
    return () => window.removeEventListener(NEW_PASSWORD_EVENT, onNew)
  }, [tick])

  return (
    <>
      <style href="passlore-mark" precedence="default">
        {MARK_CSS}
      </style>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
        className={cn(
          "pl-mark",
          arrive && "pl-mark-arrive",
          ticks > 0 && (ticks % 2 ? "pl-mark-tick-a" : "pl-mark-tick-b"),
          className
        )}
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
            <rect width="32" height="32" fill="white" />
            <path className="pl-mark-hole" d={HOLE} fill="black" />
          </mask>
        </defs>
        <path className="pl-mark-bow" d={BOW} fill="currentColor" mask={`url(#${maskId})`} />
        <g className="pl-mark-teeth" fill="currentColor">
          <rect className="pl-mark-tooth pl-mark-t1" x="12.5" y="22" width="5" height="2.5" />
          <rect className="pl-mark-tooth pl-mark-t2" x="12.5" y="26" width="3" height="3" />
        </g>
      </svg>
    </>
  )
}

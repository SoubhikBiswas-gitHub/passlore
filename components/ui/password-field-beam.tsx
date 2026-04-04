"use client"

import type { ReactNode } from "react"
import { useReducedMotion } from "framer-motion"
import { BorderBeam } from "@/components/ui/border-beam"
import { cn } from "@/lib/utils"

export interface PasswordFieldBeamProps {
  children: ReactNode
  className?: string
  /** When true, shows the animated border chase (e.g. password present or generating). */
  active: boolean
}

/** Magenta → cyan rim; small `size` keeps a traveling highlight (large sizes read as a static bar). */
const NEON_MAGENTA = "#ff2ec7"
const NEON_MINT = "#7dff9a"
const NEON_CYAN = "#2cfbff"

/**
 * Thin traveling neon rim for the password field via {@link BorderBeam}.
 */
export function PasswordFieldBeam({ children, className, active }: PasswordFieldBeamProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={cn("relative rounded-none", className)}>
      {children}
      {active &&
        (reduceMotion ? (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 z-1 rounded-[inherit]",
              "ring-2 ring-inset ring-fuchsia-400/50",
              "shadow-[inset_0_0_14px_rgba(255,46,199,0.18),inset_0_0_18px_rgba(125,255,154,0.12),inset_0_0_20px_rgba(44,251,255,0.1)]",
            )}
          />
        ) : (
          <BorderBeam
            className="z-1"
            size={108}
            duration={13}
            borderWidth={1.5}
            anchor={90}
            delay={0}
            colorFrom={NEON_MAGENTA}
            colorTo={NEON_CYAN}
          />
        ))}
    </div>
  )
}

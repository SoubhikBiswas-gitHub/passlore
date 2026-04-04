"use client"

import type { CSSProperties, ReactNode } from "react"
import { useReducedMotion } from "framer-motion"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export interface PasswordFieldBeamProps {
  children: ReactNode
  className?: string
  /** When true, shows the animated border chase (e.g. password present or generating). */
  active: boolean
}

/** Masked border band: only the stroke is visible; gradient “dot” runs the full perimeter. */
const borderMaskClass =
  "pointer-events-none absolute -inset-px z-1 rounded-[inherit] border-2 border-transparent " +
  "[mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"

/**
 * Animated beam on **all four sides** of the password field (offset-path around the box).
 * Token gradient (primary → secure); respects reduced motion.
 */
export function PasswordFieldBeam({ children, className, active }: PasswordFieldBeamProps) {
  const reduceMotion = useReducedMotion()

  /** Long streak along the border path (still clipped to the 2px mask band). */
  const beamStyle = {
    width: 96,
    height: 22,
    offsetPath: "rect(0 auto auto 0 round 0px)",
  } as CSSProperties

  return (
    <div className={cn("relative rounded-none", className)}>
      {children}
      {active &&
        (reduceMotion ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-1 rounded-[inherit] ring-2 ring-primary/45 ring-inset"
          />
        ) : (
          <div aria-hidden className={borderMaskClass}>
            <motion.div
              className="absolute left-0 top-0 bg-gradient-to-r from-transparent from-[8%] via-primary via-[45%] to-secure-fg to-[92%]"
              animate={{ offsetDistance: ["0%", "100%"] }}
              style={beamStyle}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 12,
                ease: "linear",
              }}
            />
          </div>
        ))}
    </div>
  )
}

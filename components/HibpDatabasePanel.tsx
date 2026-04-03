"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShieldCheck, WarningCircle, CheckCircle, Info, MagnifyingGlass, ArrowsClockwise } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export interface HibpDatabasePanelProps {
  password: string
  hibpStatus: "idle" | "loading" | "clean" | "breached" | "error"
  hibpCount: number
  onHibpCheck: () => void
  variant?: "default" | "dashboard"
}

const statusSlotMin = "min-h-[3.25rem] flex flex-col justify-center"

export function HibpDatabasePanel({
  password,
  hibpStatus,
  hibpCount,
  onHibpCheck,
  variant = "default",
}: HibpDatabasePanelProps) {
  const prefersReduced = useReducedMotion()
  const isDashboard = variant === "dashboard"

  const inner = (
    <>
      {hibpStatus === "idle" && (
        <Button
          type="button"
          variant="secondary"
          onClick={onHibpCheck}
          disabled={!password}
          className={
            isDashboard
              ? cn(
                  "w-full min-h-12 py-3 h-auto rounded-none border border-border",
                  "bg-secondary text-secondary-foreground hover:bg-secondary/90",
                  "ds-text-label-sm font-mono tracking-[0.14em]",
                  "flex items-center justify-center gap-2.5"
                )
              : "rounded-none"
          }
        >
          <MagnifyingGlass className={cn(isDashboard && "text-red-400 shrink-0")} size={18} weight="bold" aria-hidden />
          {isDashboard ? "Quick-check database" : (
            <>
              <ShieldCheck size={14} weight="fill" className="mr-1 shrink-0" aria-hidden />
              Check for breaches
            </>
          )}
        </Button>
      )}
      {hibpStatus === "loading" && (
        <div className={statusSlotMin}>
          <Skeleton className="w-full min-h-12 rounded-none" />
        </div>
      )}
      <AnimatePresence mode="wait">
        {hibpStatus === "clean" && (
          <motion.div
            key="clean"
            className={statusSlotMin}
            initial={prefersReduced ? undefined : { opacity: 0 }}
            animate={prefersReduced ? undefined : { opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Badge className="rounded-none w-full max-w-none justify-center py-2.5 px-3 text-center font-mono ds-text-label-sm tracking-wide leading-snug h-auto min-h-14 whitespace-normal [&>svg]:size-3.5 border border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/90 dark:text-green-200">
              <CheckCircle size={14} weight="fill" className="shrink-0" aria-hidden />
              <span>Not in Have I Been Pwned password corpus</span>
            </Badge>
          </motion.div>
        )}
        {hibpStatus === "breached" && (
          <motion.div
            key="breached"
            className={statusSlotMin}
            initial={prefersReduced ? undefined : { opacity: 0 }}
            animate={prefersReduced ? undefined : { opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Badge variant="destructive" className="rounded-none w-full max-w-none justify-center py-2.5 px-3 text-center font-mono ds-text-label-sm tracking-wide leading-snug h-auto min-h-12 whitespace-normal [&>svg]:size-3.5">
              <WarningCircle size={14} weight="bold" className="shrink-0" aria-hidden />
              <span>
                Appeared {hibpCount.toLocaleString()} times in breach data — choose another
              </span>
            </Badge>
          </motion.div>
        )}
        {hibpStatus === "error" && (
          <motion.div
            key="error"
            className={cn(statusSlotMin, "gap-2")}
            initial={prefersReduced ? undefined : { opacity: 0 }}
            animate={prefersReduced ? undefined : { opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Badge className="rounded-none w-full max-w-none justify-center py-2.5 px-3 font-mono ds-text-label-sm tracking-wide leading-snug h-auto min-h-14 whitespace-normal [&>svg]:size-3.5 border border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/90 dark:text-amber-100">
              <Info size={14} weight="regular" className="shrink-0" aria-hidden />
              <span>Could not reach Have I Been Pwned</span>
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onHibpCheck}
              disabled={!password}
              className={cn("w-full rounded-none font-mono ds-text-label-sm tracking-widest", isDashboard && "min-h-10")}
            >
              <ArrowsClockwise size={14} weight="bold" className="mr-2 shrink-0" aria-hidden />
              Try again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  if (isDashboard) {
    return (
      <section aria-label="Breach check" className="border border-border bg-card">
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border bg-muted/20">
          <h3 className="ds-text-label-sm tracking-[0.18em] text-foreground font-bold font-mono">Breach check</h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-prose">
            SHA-1 hash is computed in your browser; only the first 5 hex characters are sent to Have I Been Pwned (k-anonymity). Plaintext never leaves this device.
          </p>
        </div>
        <div className="p-5 sm:p-6">{inner}</div>
      </section>
    )
  }

  return <div className="flex flex-wrap items-center gap-2 justify-end">{inner}</div>
}

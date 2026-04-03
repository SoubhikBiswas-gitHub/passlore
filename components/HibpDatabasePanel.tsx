"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ArrowsClockwise,
  CheckCircle,
  CircleNotch,
  Info,
  MagnifyingGlass,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

export interface HibpDatabasePanelProps {
  password: string
  hibpStatus: "idle" | "loading" | "clean" | "breached" | "error"
  hibpCount: number
  onHibpCheck: () => void
  variant?: "default" | "dashboard"
  /** Merged into dashboard `<section>` (e.g. `flex-1` to fill column height). */
  panelClassName?: string
}

const statusSlotMin = "min-h-[3.25rem] flex flex-col justify-center"

const hibpStatusRow =
  "flex w-full items-center gap-3 border px-4 py-3.5 text-left motion-reduce:transition-none"

const hibpStatusIcon = "size-5 shrink-0"

const hibpStatusText =
  "min-w-0 flex-1 font-mono text-[11px] font-medium uppercase leading-snug tracking-[0.08em] text-balance sm:tracking-[0.1em]"

export function HibpDatabasePanel({
  password,
  hibpStatus,
  hibpCount,
  onHibpCheck,
  variant = "default",
  panelClassName,
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
          <MagnifyingGlass className={cn(isDashboard && "shrink-0 text-primary")} size={18} weight="bold" aria-hidden />
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
          <div
            role="status"
            aria-busy="true"
            aria-live="polite"
            className={cn(
              hibpStatusRow,
              "border-secure/40 bg-secure/10"
            )}
          >
            <CircleNotch
              className={cn(hibpStatusIcon, "text-secure motion-safe:animate-spin")}
              weight="bold"
              aria-hidden
            />
            <p className={cn(hibpStatusText, "text-foreground")}>
              {isDashboard ? "Querying Have I Been Pwned…" : "Checking HIBP…"}
            </p>
          </div>
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
            <div
              role="status"
              aria-live="polite"
              className={cn(
                hibpStatusRow,
                "min-h-14 border-secure/40 bg-secure/12"
              )}
            >
              <CheckCircle
                className={cn(hibpStatusIcon, "text-secure")}
                weight="fill"
                aria-hidden
              />
              <p className={cn(hibpStatusText, "text-foreground")}>
                Not in Have I Been Pwned password corpus
              </p>
            </div>
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
            <div
              role="alert"
              className={cn(
                hibpStatusRow,
                "min-h-12 border-destructive/55 bg-destructive/12"
              )}
            >
              <WarningCircle className={cn(hibpStatusIcon, "text-destructive")} weight="bold" aria-hidden />
              <p className={cn(hibpStatusText, "text-destructive")}>
                Appeared {hibpCount.toLocaleString()} times in breach data — choose another
              </p>
            </div>
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
            <div
              role="alert"
              className={cn(
                hibpStatusRow,
                "min-h-14 border-warning/40 bg-warning/12"
              )}
            >
              <Info className={cn(hibpStatusIcon, "text-warning")} weight="regular" aria-hidden />
              <p className={cn(hibpStatusText, "text-foreground")}>
                Could not reach Have I Been Pwned
              </p>
            </div>
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
      <section
        aria-label="Breach check"
        className={cn("flex min-h-0 flex-col border border-border bg-card", panelClassName)}
      >
        <div className="shrink-0 border-b border-border bg-accent-2/35 px-5 py-4 sm:px-6 sm:py-5">
          <h3 className="ds-text-label-sm font-mono font-bold tracking-[0.18em] text-foreground">Breach check</h3>
          <p className="mt-2 max-w-prose text-xs leading-relaxed text-muted-foreground">
            SHA-1 hash is computed in your browser; only the first 5 hex characters are sent to Have I Been Pwned (k-anonymity). Plaintext never leaves this device.
          </p>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
          {/* Fixed min height for CLS; flex-1 + justify-center fills extra column space */}
          <div className="flex min-h-35 flex-1 flex-col justify-center">{inner}</div>
        </div>
      </section>
    )
  }

  return <div className="flex flex-wrap items-center gap-2 justify-end">{inner}</div>
}

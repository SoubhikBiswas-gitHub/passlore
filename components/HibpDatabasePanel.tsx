"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShieldCheck, WarningCircle, CheckCircle, Info, MagnifyingGlass } from "@phosphor-icons/react"

export interface HibpDatabasePanelProps {
  password: string
  hibpStatus: "idle" | "loading" | "clean" | "breached" | "error"
  hibpCount: number
  onHibpCheck: () => void
  variant?: "default" | "dashboard"
}

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
              ? "w-full py-3 h-auto rounded-none border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 text-zinc-100"
              : "rounded-none"
          }
        >
          <MagnifyingGlass className={isDashboard ? "text-red-400" : ""} size={18} weight="bold" />
          {isDashboard ? "Quick-check database" : (
            <>
              <ShieldCheck size={14} weight="fill" className="mr-1" />
              Check for breaches
            </>
          )}
        </Button>
      )}
      {hibpStatus === "loading" && <Skeleton className="w-full h-12 rounded-none" />}
      <AnimatePresence mode="wait">
        {hibpStatus === "clean" && (
          <motion.div
            initial={prefersReduced ? undefined : { opacity: 0 }}
            animate={prefersReduced ? undefined : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Badge className="rounded-none bg-green-950/40 text-green-600 dark:text-green-400 border-green-800/50 w-full justify-center py-2">
              <CheckCircle size={14} weight="fill" className="mr-1" />
              Not found in any breach
            </Badge>
          </motion.div>
        )}
        {hibpStatus === "breached" && (
          <motion.div
            initial={prefersReduced ? undefined : { opacity: 0 }}
            animate={prefersReduced ? undefined : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Badge variant="destructive" className="rounded-none w-full justify-center py-2">
              <WarningCircle size={14} weight="bold" className="mr-1" />
              Found in {hibpCount.toLocaleString()} breaches!
            </Badge>
          </motion.div>
        )}
        {hibpStatus === "error" && (
          <motion.div
            initial={prefersReduced ? undefined : { opacity: 0 }}
            animate={prefersReduced ? undefined : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Badge className="rounded-none bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-800/50 w-full justify-center py-2">
              <Info size={14} weight="regular" className="mr-1" />
              Check failed — try again
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  if (isDashboard) {
    return (
      <div className="bg-zinc-900/50 p-6 border border-zinc-800">
        <h3 className="text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-bold mb-4">
          Breach check
        </h3>
        {inner}
      </div>
    )
  }

  return <div className="flex flex-wrap items-center gap-2 justify-end">{inner}</div>
}

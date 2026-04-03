"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { STRENGTH_TIER_BADGE_CLASSES } from "@/lib/strengthTierStyles"
import { cn } from "@/lib/utils"
import { CheckSquare, ClockCounterClockwise, Copy, Trash } from "@phosphor-icons/react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useCallback, useState } from "react"
import type { HistoryItem } from "./PasswordGenerator"

interface HistoryPanelProps {
  history: HistoryItem[]
  onClear: () => void
  variant?: "default" | "dashboard"
}

function getRelativeTime(timestamp: number): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const now = Date.now()
  const diff = (timestamp - now) / 1000

  if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), "second")
  if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), "minute")
  if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), "hour")
  return rtf.format(Math.round(diff / 86400), "day")
}

function HistoryEntry({
  item,
  variant,
}: {
  item: HistoryItem
  variant: "default" | "dashboard"
}) {
  const [isCopied, setIsCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const prefersReduced = useReducedMotion()

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(item.password)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }, [item.password])

  const maskedPassword = "\u2022".repeat(Math.min(item.password.length, 16))

  if (variant === "dashboard") {
    const preview =
      item.password.length > 14 ? `${item.password.slice(0, 11)}...` : item.password

    return (
      <div
        role="button"
        tabIndex={0}
        aria-label="Copy masked password from history"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleCopy()
          }
        }}
        className="flex items-center justify-between group hover:bg-accent-2 active:bg-accent-3/60 p-2 cursor-pointer transition-colors duration-150 border-b border-border"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="font-mono text-xs text-muted-foreground truncate pr-2">
          {isHovered ? preview : maskedPassword}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleCopy()
          }}
          className="shrink-0 p-1 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Copy password from history"
        >
          {isCopied ? (
            <CheckSquare size={16} weight="fill" className="text-secure" aria-hidden />
          ) : (
            <Copy size={16} weight="regular" aria-hidden />
          )}
        </button>
      </div>
    )
  }

  return (
    <motion.div
      layout="position"
      initial={prefersReduced ? undefined : { opacity: 0, height: 0, y: -10 }}
      animate={prefersReduced ? undefined : { opacity: 1, height: "auto", y: 0 }}
      exit={prefersReduced ? undefined : { opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group py-2 px-3 flex items-center justify-between gap-2 rounded-none hover:bg-accent-2 active:bg-accent-3/50 mb-2 transition-colors duration-150"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1 min-w-0">
        <span className="font-mono text-xs truncate block text-foreground/90">
          {isHovered ? item.password.slice(0, 24) + (item.password.length > 24 ? "..." : "") : maskedPassword}
        </span>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{getRelativeTime(item.timestamp)}</span>
      <Badge className={cn("text-xs shrink-0", STRENGTH_TIER_BADGE_CLASSES[item.strength])}>
        {item.bits}b
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-6 w-6 shrink-0", isCopied && "bg-secure/15")}
        onClick={handleCopy}
        aria-label="Copy password"
      >
        <AnimatePresence mode="wait">
          {isCopied ? (
            <motion.div
              key="check"
              initial={prefersReduced ? undefined : { scale: 0.6, opacity: 0 }}
              animate={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
              exit={prefersReduced ? undefined : { scale: 0.6, opacity: 0 }}
            >
              <CheckSquare size={14} weight="fill" className="text-secure" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={prefersReduced ? undefined : { scale: 0.6, opacity: 0 }}
              animate={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
              exit={prefersReduced ? undefined : { scale: 0.6, opacity: 0 }}
            >
              <Copy size={14} weight="regular" className="text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}

export function HistoryPanel({ history, onClear, variant = "default" }: HistoryPanelProps) {
  const prefersReduced = useReducedMotion()

  if (variant === "dashboard") {
    return (
      <div className="flex max-h-[min(50vh,24rem)] min-h-48 flex-1 flex-col overflow-hidden bg-card p-6 lg:max-h-none">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h3 className="text-[0.6875rem] uppercase tracking-widest font-bold text-muted-foreground">Session history</h3>
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-[10px] uppercase font-mono text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="flex flex-1 items-center justify-center py-6 text-center text-sm font-mono text-muted-foreground">
            No session entries
          </p>
        ) : (
          <ScrollArea className="min-h-0 flex-1 pr-2">
            <div className="space-y-0">
              {history.map((item) => (
                <HistoryEntry key={item.id} item={item} variant="dashboard" />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClockCounterClockwise size={20} weight="regular" className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Recent</h3>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash size={14} weight="bold" className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0 }}
          animate={prefersReduced ? undefined : { opacity: 1 }}
          className="py-8 text-center"
        >
          <ClockCounterClockwise
            size={32}
            weight="regular"
            className="mx-auto text-muted-foreground mb-2"
            aria-hidden
          />
          <p className="text-sm text-muted-foreground">No passwords generated yet</p>
        </motion.div>
      ) : (
        <ScrollArea className="max-h-64">
          <AnimatePresence>
            {history.map((item) => (
              <HistoryEntry key={item.id} item={item} variant="default" />
            ))}
          </AnimatePresence>
        </ScrollArea>
      )}
    </div>
  )
}

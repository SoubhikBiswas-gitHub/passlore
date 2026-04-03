"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClockCounterClockwise, Trash, Copy, CheckSquare } from "@phosphor-icons/react"
import type { HistoryItem } from "./PasswordGenerator"
import { cn } from "@/lib/utils"

interface HistoryPanelProps {
  history: HistoryItem[]
  onClear: () => void
  variant?: "default" | "dashboard"
}

const strengthBadgeColors = [
  "",
  "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
  "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
  "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
]

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
        className="flex items-center justify-between group hover:bg-zinc-900 p-2 cursor-pointer transition-colors border-b border-zinc-900/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="font-mono text-xs text-zinc-400 truncate pr-2">
          {isHovered ? preview : maskedPassword}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleCopy()
          }}
          className="shrink-0 p-1 text-zinc-700 hover:text-blue-400 transition-colors"
          aria-label="Copy password from history"
        >
          {isCopied ? (
            <CheckSquare size={16} weight="fill" className="text-green-400" />
          ) : (
            <Copy size={16} weight="regular" />
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
      className="group py-2 px-3 flex items-center justify-between gap-2 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800/80 mb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1 min-w-0">
        <span className="font-mono text-xs truncate block text-zinc-700 dark:text-zinc-300">
          {isHovered ? item.password.slice(0, 24) + (item.password.length > 24 ? "..." : "") : maskedPassword}
        </span>
      </div>
      <span className="text-xs text-zinc-400 shrink-0">{getRelativeTime(item.timestamp)}</span>
      <Badge className={cn("text-xs shrink-0", strengthBadgeColors[item.strength])}>
        {item.bits}b
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-6 w-6 shrink-0", isCopied && "bg-green-50 dark:bg-green-950")}
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
              <CheckSquare size={14} weight="fill" className="text-green-600 dark:text-green-400" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={prefersReduced ? undefined : { scale: 0.6, opacity: 0 }}
              animate={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
              exit={prefersReduced ? undefined : { scale: 0.6, opacity: 0 }}
            >
              <Copy size={14} weight="regular" className="text-zinc-500" />
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
      <div className="bg-zinc-950 p-6 min-h-0 flex flex-col h-[400px]">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h3 className="text-[0.6875rem] uppercase tracking-widest font-bold text-zinc-500">Session history</h3>
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-[10px] uppercase font-mono text-zinc-600 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-zinc-600 font-mono text-center py-8">No session entries</p>
        ) : (
          <ScrollArea className="flex-1 min-h-0 pr-2">
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
          <ClockCounterClockwise size={20} weight="regular" className="text-zinc-500 dark:text-zinc-400" />
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Recent</h3>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 text-xs text-zinc-500 hover:text-red-600"
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
          <ClockCounterClockwise size={32} weight="regular" className="mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No passwords generated yet</p>
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

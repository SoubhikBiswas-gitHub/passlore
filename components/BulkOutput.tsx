"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { DownloadSimple, Copy, CheckSquare } from "@phosphor-icons/react"
import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BulkOutputProps {
  passwords: string[]
}

export function BulkOutput({ passwords }: BulkOutputProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const prefersReduced = useReducedMotion()

  const handleCopy = async (password: string, index: number) => {
    await navigator.clipboard.writeText(password)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleDownloadAll = () => {
    const blob = new Blob([passwords.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "passwords.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Generated {passwords.length} passwords
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadAll}
          className="h-8 text-xs"
        >
          <DownloadSimple size={14} weight="regular" className="mr-1" />
          Download all
        </Button>
      </div>

      <ScrollArea className="h-64 border border-border rounded-none bg-card">
        <div className="p-2">
          {passwords.map((password, idx) => (
            <motion.div
              key={idx}
              initial={prefersReduced ? undefined : { opacity: 0, height: 0 }}
              animate={prefersReduced ? undefined : { opacity: 1, height: "auto" }}
              transition={{ duration: 0.22, delay: idx * 0.02, ease: "easeOut" }}
              className={cn(
                "flex items-center justify-between py-2 px-3 rounded-none hover:bg-accent transition-colors",
                idx !== passwords.length - 1 && "border-b border-border"
              )}
            >
              <span className="font-mono text-xs text-foreground/90 truncate flex-1 mr-2">
                {password}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => handleCopy(password, idx)}
                aria-label={`Copy password ${idx + 1}`}
              >
                <AnimatePresence mode="wait">
                  {copiedIndex === idx ? (
                    <motion.div
                      key="check"
                      initial={prefersReduced ? undefined : { scale: 0.6, opacity: 0 }}
                      animate={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
                      exit={prefersReduced ? undefined : { scale: 0.6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <CheckSquare size={14} weight="fill" className="text-green-600 dark:text-green-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={prefersReduced ? undefined : { scale: 0.6, opacity: 0 }}
                      animate={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
                      exit={prefersReduced ? undefined : { scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Copy size={14} weight="regular" className="text-muted-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

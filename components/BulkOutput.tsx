"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { DownloadSimple, Copy, CheckSquare, BracketsCurly } from "@phosphor-icons/react"
import { useCallback, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

interface BulkOutputProps {
  passwords: string[]
}

export function BulkOutput({ passwords }: BulkOutputProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const prefersReduced = useReducedMotion()

  const handleCopy = useCallback(async (password: string, index: number) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      /* clipboard denied */
    }
  }, [])

  const handleCopyAll = useCallback(async () => {
    if (passwords.length === 0) return
    try {
      await navigator.clipboard.writeText(passwords.join("\n"))
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    } catch {
      /* clipboard denied */
    }
  }, [passwords])

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadAll = useCallback(() => {
    const blob = new Blob([passwords.join("\n")], { type: "text/plain;charset=utf-8" })
    triggerDownload(blob, "passwords.txt")
  }, [passwords])

  const handleDownloadJson = useCallback(() => {
    const payload = JSON.stringify(
      {
        count: passwords.length,
        exportedAt: new Date().toISOString(),
        passwords,
      },
      null,
      2
    )
    const blob = new Blob([payload], { type: "application/json;charset=utf-8" })
    triggerDownload(blob, "passwords.json")
  }, [passwords])

  const n = passwords.length

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm font-medium text-foreground">
          Generated <span className="font-mono tabular-nums">{n}</span>{" "}
          {n === 1 ? "password" : "passwords"}
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyAll}
            disabled={n === 0}
            className="h-8 gap-1.5 text-xs"
            aria-label="Copy all passwords to clipboard"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copiedAll ? (
                <motion.span
                  key="ok"
                  initial={prefersReduced ? undefined : { opacity: 0 }}
                  animate={prefersReduced ? undefined : { opacity: 1 }}
                  exit={prefersReduced ? undefined : { opacity: 0 }}
                  className="inline-flex items-center gap-1.5"
                >
                  <CheckSquare size={14} weight="fill" className="text-secure" />
                  Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={prefersReduced ? undefined : { opacity: 0 }}
                  animate={prefersReduced ? undefined : { opacity: 1 }}
                  exit={prefersReduced ? undefined : { opacity: 0 }}
                  className="inline-flex items-center gap-1.5"
                >
                  <Copy size={14} weight="regular" />
                  Copy all
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadAll}
            disabled={n === 0}
            className="h-8 gap-1.5 text-xs"
            aria-label="Download all passwords as a text file"
          >
            <DownloadSimple size={14} weight="regular" />
            Download all
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadJson}
            disabled={n === 0}
            className="h-8 gap-1.5 text-xs"
            aria-label="Download passwords as JSON"
          >
            <BracketsCurly size={14} weight="regular" />
            Download JSON
          </Button>
        </div>
      </div>

      <ScrollArea className="h-72 rounded-none border border-border bg-card shadow-sm">
        <div className="p-3">
          <ul className="divide-y divide-border" role="list">
            {passwords.map((password, idx) => (
              <motion.li
                key={`${idx}-${password}`}
                initial={prefersReduced ? undefined : { opacity: 0, height: 0 }}
                animate={prefersReduced ? undefined : { opacity: 1, height: "auto" }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.4), ease: "easeOut" }}
                className="flex min-h-11 items-center gap-2 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="min-w-0 flex-1 break-all font-mono text-sm leading-relaxed text-foreground">
                  {password}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => handleCopy(password, idx)}
                  aria-label={`Copy password ${idx + 1}`}
                >
                  <AnimatePresence mode="wait">
                    {copiedIndex === idx ? (
                      <motion.span
                        key="check"
                        initial={prefersReduced ? undefined : { scale: 0.85, opacity: 0 }}
                        animate={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
                        exit={prefersReduced ? undefined : { scale: 0.85, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 24 }}
                        className="inline-flex"
                      >
                        <CheckSquare size={16} weight="fill" className="text-secure" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={prefersReduced ? undefined : { opacity: 0 }}
                        animate={prefersReduced ? undefined : { opacity: 1 }}
                        exit={prefersReduced ? undefined : { opacity: 0 }}
                        className="inline-flex"
                      >
                        <Copy size={16} weight="regular" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.li>
            ))}
          </ul>
        </div>
      </ScrollArea>
    </div>
  )
}

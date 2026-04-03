"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Lock,
  LockOpen,
  Eye,
  EyeSlash,
  Copy,
  CheckSquare,
  DownloadSimple,
  ArrowsClockwise,
  ShieldCheck,
  ShareNetwork,
  WarningCircle,
  CheckCircle,
  Info,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useCallback } from "react"

export interface PasswordOutputProps {
  password: string
  isRevealed: boolean
  isCopied: boolean
  isGenerating: boolean
  onRevealToggle: () => void
  onCopy: () => void
  onGenerate: () => void
  hibpStatus: "idle" | "loading" | "clean" | "breached" | "error"
  hibpCount: number
  onHibpCheck: () => void
  variant?: "default" | "dashboard"
  showGenerateButton?: boolean
}

export function PasswordOutput({
  password,
  isRevealed,
  isCopied,
  isGenerating,
  onRevealToggle,
  onCopy,
  onGenerate,
  hibpStatus,
  hibpCount,
  onHibpCheck,
  variant = "default",
  showGenerateButton,
}: PasswordOutputProps) {
  const prefersReduced = useReducedMotion()
  const isDashboard = variant === "dashboard"
  const showGen = showGenerateButton ?? !isDashboard

  const handleSharePassword = useCallback(async () => {
    if (!password) return
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "SecurePass Pro",
          text: password,
        })
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(password)
      }
    } catch {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(password)
        }
      } catch {
        /* ignore */
      }
    }
  }, [password])

  const displayPassword = password
    ? isRevealed
      ? password
      : "\u2022".repeat(password.length)
    : ""

  const handleDownload = () => {
    if (!password) return
    const blob = new Blob([password], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "password.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isDashboard) {
    return (
      <div className="space-y-4">
        <div
          className={cn(
            "flex flex-col md:flex-row items-stretch md:items-center gap-6 p-6 border-l-4 border-blue-600 bg-[#18181b] transition-colors duration-150",
            isCopied && "bg-zinc-100 ring-1 ring-zinc-300"
          )}
        >
          <div className="flex flex-1 items-center gap-4 min-w-0 w-full">
            <Lock className="size-6 text-zinc-500 shrink-0" weight="fill" aria-hidden />
            <div
              className={cn(
                "font-mono text-2xl md:text-4xl tracking-tight break-all select-all flex-1 px-4 py-2 bg-black/40 text-blue-400 min-h-12 flex items-center",
                isCopied && "text-zinc-900 bg-zinc-100"
              )}
            >
              {password ? (
                isRevealed ? password : displayPassword
              ) : (
                <span className="text-sm md:text-base text-zinc-500 font-mono normal-case tracking-normal">
                  Generate to preview output
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-end shrink-0">
            <button
              type="button"
              onClick={onRevealToggle}
              disabled={!password}
              className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors disabled:opacity-40"
              aria-label={isRevealed ? "Hide password" : "Reveal password"}
            >
              {isRevealed ? (
                <EyeSlash size={22} className="text-zinc-100" weight="regular" />
              ) : (
                <Eye size={22} className="text-zinc-100" weight="regular" />
              )}
            </button>
            <button
              type="button"
              onClick={onCopy}
              disabled={!password}
              className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors disabled:opacity-40"
              aria-label="Copy password"
            >
              <AnimatePresence mode="wait">
                {isCopied ? (
                  <CheckSquare key="c" size={22} className="text-green-400" weight="fill" />
                ) : (
                  <Copy key="o" size={22} className="text-zinc-100" weight="regular" />
                )}
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={handleSharePassword}
              disabled={!password}
              className="w-12 h-12 bg-zinc-800 hover:bg-blue-600 flex items-center justify-center transition-colors disabled:opacity-40"
              aria-label="Share password"
            >
              <ShareNetwork size={22} weight="bold" className="text-zinc-100" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "group/password p-4 rounded-none border border-zinc-800 transition-colors duration-150",
          "focus-within:border-indigo-600 dark:focus-within:border-indigo-400",
          "focus-within:bg-black dark:focus-within:bg-black",
          password && isCopied
            ? "bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-50 dark:text-zinc-950 dark:border-zinc-50"
            : "bg-white dark:bg-zinc-950"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {isRevealed ? (
              <LockOpen
                size={20}
                weight="regular"
                className="text-zinc-500 group-focus-within/password:text-zinc-400 dark:text-zinc-400 dark:group-focus-within/password:text-zinc-500"
              />
            ) : (
              <Lock
                size={20}
                weight="fill"
                className="text-indigo-600 group-focus-within/password:text-indigo-400 dark:text-indigo-400 dark:group-focus-within/password:text-indigo-300"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {password ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={password}
                  className={cn(
                    "font-mono ds-text-display-lg break-all select-all cursor-text",
                    "text-zinc-900 dark:text-zinc-50",
                    "group-focus-within/password:text-zinc-50 dark:group-focus-within/password:text-zinc-50",
                    isCopied &&
                      "text-zinc-50 dark:text-zinc-950 group-focus-within/password:text-zinc-50 dark:group-focus-within/password:text-zinc-950"
                  )}
                  initial={prefersReduced ? undefined : { opacity: 0 }}
                  animate={prefersReduced ? undefined : { opacity: 1 }}
                  exit={prefersReduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  {isRevealed ? password : displayPassword}
                </motion.div>
              </AnimatePresence>
            ) : (
              <span className="ds-text-body-md italic text-zinc-500 dark:text-zinc-500 group-focus-within/password:text-zinc-400">
                Click Generate to create a password
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none group-focus-within/password:text-zinc-300 dark:group-focus-within/password:text-zinc-300"
              onClick={onRevealToggle}
              aria-label={isRevealed ? "Hide password" : "Reveal password"}
              disabled={!password}
            >
              {isRevealed ? (
                <EyeSlash size={18} weight="regular" className="text-zinc-500" />
              ) : (
                <Eye size={18} weight="regular" className="text-zinc-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none group-focus-within/password:text-zinc-300 dark:group-focus-within/password:text-zinc-300"
              onClick={onCopy}
              aria-label="Copy password"
              disabled={!password}
            >
              <AnimatePresence mode="wait">
                {isCopied ? (
                  <motion.div
                    key="check"
                    initial={prefersReduced ? undefined : { scale: 0.85, opacity: 0 }}
                    animate={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
                    exit={prefersReduced ? undefined : { scale: 0.85, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    <CheckSquare size={18} weight="fill" className="text-green-600 dark:text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={prefersReduced ? undefined : { opacity: 0 }}
                    animate={prefersReduced ? undefined : { opacity: 1 }}
                    exit={prefersReduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Copy size={18} weight="regular" className="text-zinc-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none group-focus-within/password:text-zinc-300 dark:group-focus-within/password:text-zinc-300"
              onClick={handleDownload}
              aria-label="Download password"
              disabled={!password}
            >
              <DownloadSimple size={18} weight="regular" className="text-zinc-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none group-focus-within/password:text-zinc-300 dark:group-focus-within/password:text-zinc-300"
              onClick={onGenerate}
              aria-label="Regenerate password"
            >
              <motion.div
                animate={prefersReduced || !isGenerating ? undefined : { rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <ArrowsClockwise size={18} weight="bold" className="text-zinc-500" />
              </motion.div>
            </Button>
          </div>
        </div>

        {password && (
          <div
            className={cn(
              "mt-3 pt-3 flex flex-wrap items-center justify-between gap-3 -mx-4 -mb-4 px-4 pb-4",
              "bg-zinc-100 dark:bg-zinc-900",
              "group-focus-within/password:bg-zinc-950 dark:group-focus-within/password:bg-black"
            )}
          >
            <div
              className={cn(
                "ds-text-label-sm flex items-center gap-1 normal-case",
                isCopied ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500",
                "group-focus-within/password:text-zinc-400 dark:group-focus-within/password:text-zinc-500"
              )}
            >
              <Info size={12} weight="regular" />
              Uses k-anonymity — your password never leaves your browser
            </div>
            {hibpStatus === "idle" && (
              <Button variant="outline" size="sm" onClick={onHibpCheck} className="h-7 text-xs rounded-none">
                <ShieldCheck size={14} weight="fill" className="mr-1" />
                Check for breaches
              </Button>
            )}
            {hibpStatus === "loading" && <Skeleton className="w-48 h-7 rounded-none" />}
            <AnimatePresence mode="wait">
              {hibpStatus === "clean" && (
                <motion.div
                  initial={prefersReduced ? undefined : { opacity: 0 }}
                  animate={prefersReduced ? undefined : { opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <Badge className="rounded-none bg-green-950/40 text-green-600 dark:text-green-400 border-green-800/50">
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
                  <Badge variant="destructive" className="rounded-none">
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
                  <Badge className="rounded-none bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-800/50">
                    <Info size={14} weight="regular" className="mr-1" />
                    Check failed — try again
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {showGen && (
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-none bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          <motion.div
            animate={prefersReduced || !isGenerating ? undefined : { rotate: 360 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <ArrowsClockwise size={18} weight="bold" />
          </motion.div>
          Generate password
        </button>
      )}
    </div>
  )
}

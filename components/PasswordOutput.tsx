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

/** Stepped font scale so long passwords stay readable without horizontal truncation. */
function dashboardPasswordFontClass(length: number): string {
  if (length <= 0) return "text-sm sm:text-base"
  if (length <= 12) return "text-xl sm:text-2xl md:text-3xl leading-tight"
  if (length <= 24) return "text-lg sm:text-xl md:text-2xl leading-tight"
  if (length <= 40) return "text-base sm:text-lg md:text-xl leading-snug"
  if (length <= 64) return "text-sm sm:text-base md:text-lg leading-snug"
  return "text-xs sm:text-sm md:text-base leading-snug"
}

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
    const iconBtn =
      "flex h-12 sm:h-14 min-w-0 flex-1 basis-0 items-center justify-center " +
      "text-foreground transition-colors " +
      "hover:bg-muted/90 active:bg-muted " +
      "disabled:pointer-events-none disabled:opacity-40 " +
      "focus-visible:outline-none focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"

    const showDashboardGenerate = showGenerateButton !== false
    const passwordFontClass = dashboardPasswordFontClass(password.length)

    return (
      <section
        aria-label="Password"
        aria-busy={isGenerating && !password}
        className={cn(
          "w-full border border-border bg-card transition-colors",
          isCopied && "border-primary bg-primary/4 dark:bg-primary/10"
        )}
      >
        <div className="flex w-full min-w-0 flex-col">
          <div className="flex min-h-16 min-w-0 w-full items-stretch md:min-h-18">
            <div
              className="flex w-14 max-sm:shrink-0 items-center justify-center border-b border-r border-border bg-muted/25 px-2 sm:px-3"
              aria-hidden
            >
              <Lock className="size-5 sm:size-6 text-primary" weight="fill" />
            </div>

            <div
              className={cn(
                "flex min-w-0 flex-1 items-center border-b border-border px-3 py-3 font-mono tracking-tight sm:px-5 sm:py-4",
                "bg-primary/8 dark:bg-primary/14",
                password && !isRevealed && "text-primary",
                password && isRevealed && "text-foreground"
              )}
              aria-label={
                !password
                  ? isGenerating
                    ? "Generating password"
                    : "Password output"
                  : isRevealed
                    ? password
                    : `Concealed password, ${password.length} characters`
              }
            >
              {password ? (
                <span
                  className={cn(
                    "block w-full min-w-0 select-text wrap-break-word break-all",
                    passwordFontClass,
                    isRevealed && "text-foreground"
                  )}
                >
                  {isRevealed ? password : displayPassword}
                </span>
              ) : isGenerating ? (
                <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center" aria-hidden>
                  <Skeleton className="h-6 w-full max-w-none rounded-none sm:flex-1" />
                  <Skeleton className="h-6 w-full max-w-48 rounded-none sm:w-24 sm:shrink-0" />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground font-mono normal-case tracking-normal">
                  Generate to preview output
                </span>
              )}
            </div>
          </div>

          <div
            className="flex w-full min-w-0 flex-col sm:flex-row sm:items-stretch"
            role="toolbar"
            aria-label="Password actions"
          >
            <div className="flex min-h-12 min-w-0 w-full flex-1 divide-x divide-border border-b border-border sm:min-h-14 sm:border-b-0 sm:border-r">
              <button
                type="button"
                onClick={onRevealToggle}
                disabled={!password}
                className={iconBtn}
                aria-label={isRevealed ? "Hide password" : "Reveal password"}
              >
                {isRevealed ? (
                  <EyeSlash size={22} weight="regular" aria-hidden />
                ) : (
                  <Eye size={22} weight="regular" aria-hidden />
                )}
              </button>
              <button type="button" onClick={onCopy} disabled={!password} className={iconBtn} aria-label="Copy password">
                <AnimatePresence mode="wait">
                  {isCopied ? (
                    <CheckSquare key="c" size={22} className="text-green-600 dark:text-green-400" weight="fill" aria-hidden />
                  ) : (
                    <Copy key="o" size={22} weight="regular" aria-hidden />
                  )}
                </AnimatePresence>
              </button>
              <button
                type="button"
                onClick={handleSharePassword}
                disabled={!password}
                className={cn(iconBtn, "hover:bg-primary/15 active:bg-primary/25 dark:hover:bg-primary/20")}
                aria-label="Share password"
              >
                <ShareNetwork size={22} weight="bold" aria-hidden />
              </button>
            </div>

            {showDashboardGenerate && (
              <button
                type="button"
                onClick={onGenerate}
                disabled={isGenerating}
                className={cn(
                  "flex min-h-12 w-full min-w-0 items-center justify-center gap-2 sm:min-h-14 sm:min-w-60 sm:flex-[1.45]",
                  "bg-primary px-4 text-primary-foreground hover:bg-primary/90",
                  "text-xs sm:text-sm font-medium uppercase tracking-wider font-mono transition-colors disabled:opacity-50",
                  "focus-visible:outline-none focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                )}
              >
                <motion.div
                  animate={prefersReduced || !isGenerating ? undefined : { rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <ArrowsClockwise size={18} weight="bold" aria-hidden />
                </motion.div>
                Generate
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "group/password p-4 rounded-none border border-border transition-colors duration-150 bg-card text-foreground",
          "focus-within:border-ring focus-within:bg-muted/30",
          password && isCopied && "bg-primary text-primary-foreground border-primary"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {isRevealed ? (
              <LockOpen
                size={20}
                weight="regular"
                className={cn(
                  password && isCopied
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground group-focus-within/password:text-muted-foreground/80"
                )}
              />
            ) : (
              <Lock
                size={20}
                weight="fill"
                className={cn(
                  password && isCopied ? "text-primary-foreground" : "text-primary group-focus-within/password:text-primary/90"
                )}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {password ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={password}
                  className={cn(
                    "font-mono ds-text-display-lg break-all select-all cursor-text text-foreground",
                    "group-focus-within/password:text-foreground",
                    isCopied && "text-primary-foreground group-focus-within/password:text-primary-foreground"
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
              <span className="ds-text-body-md italic text-muted-foreground group-focus-within/password:text-muted-foreground/90">
                Click Generate to create a password
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-none",
                password && isCopied
                  ? "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  : "text-muted-foreground hover:text-foreground group-focus-within/password:text-foreground/80"
              )}
              onClick={onRevealToggle}
              aria-label={isRevealed ? "Hide password" : "Reveal password"}
              disabled={!password}
            >
              {isRevealed ? (
                <EyeSlash size={18} weight="regular" />
              ) : (
                <Eye size={18} weight="regular" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-none",
                password && isCopied
                  ? "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  : "text-muted-foreground hover:text-foreground group-focus-within/password:text-foreground/80"
              )}
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
                    <CheckSquare size={18} weight="fill" className="text-green-600 dark:text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={prefersReduced ? undefined : { opacity: 0 }}
                    animate={prefersReduced ? undefined : { opacity: 1 }}
                    exit={prefersReduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Copy size={18} weight="regular" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-none",
                password && isCopied
                  ? "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  : "text-muted-foreground hover:text-foreground group-focus-within/password:text-foreground/80"
              )}
              onClick={handleDownload}
              aria-label="Download password"
              disabled={!password}
            >
              <DownloadSimple size={18} weight="regular" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-none",
                password && isCopied
                  ? "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  : "text-muted-foreground hover:text-foreground group-focus-within/password:text-foreground/80"
              )}
              onClick={onGenerate}
              aria-label="Regenerate password"
            >
              <motion.div
                animate={prefersReduced || !isGenerating ? undefined : { rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <ArrowsClockwise size={18} weight="bold" />
              </motion.div>
            </Button>
          </div>
        </div>

        {password && (
          <div
            className={cn(
              "mt-3 pt-3 flex flex-wrap items-center justify-between gap-3 -mx-4 -mb-4 px-4 pb-4 border-t",
              isCopied
                ? "border-primary-foreground/25 bg-primary/20"
                : "border-border bg-muted/50 group-focus-within/password:bg-muted/70"
            )}
          >
            <div
              className={cn(
                "ds-text-label-sm flex items-center gap-1 normal-case",
                isCopied ? "text-primary-foreground/90" : "text-muted-foreground"
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
                  <Badge className="rounded-none border border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/90 dark:text-green-200">
                    <CheckCircle size={14} weight="fill" className="mr-1" />
                    Not in HIBP password corpus
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
                    Appeared {hibpCount.toLocaleString()} times in breach data
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
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors disabled:opacity-50"
        >
          <motion.div
            animate={prefersReduced || !isGenerating ? undefined : { rotate: 360 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <ArrowsClockwise size={18} weight="bold" />
          </motion.div>
          Generate
        </button>
      )}
    </div>
  )
}

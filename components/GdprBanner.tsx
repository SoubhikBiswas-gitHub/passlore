"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Check, X } from "@phosphor-icons/react"

// GoogleAnalytics.tsx reads this key and listens for the "adsense:ready" event.
const GDPR_KEY = "gdpr-consent"
const LATER_KEY = "gdpr-consent-later"
const TOAST_MS = 6000
const THANKS = "Thanks — visits will be counted. Change it any time in Privacy."
const DECLINED = "No analytics. Everything works the same."

const choiceButton =
  "inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-sm border border-line-strong bg-surface px-[18px] text-[15px] font-semibold text-ink transition-colors duration-(--t-glide) ease-calm hover:bg-surface-2 active:translate-y-px [[data-theme=hc]_&]:border-2"

export function GdprBanner() {
  const [visible, setVisible] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const reduce = useReducedMotion()

  const startTimer = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), TOAST_MS)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    let undecided = false
    try {
      const consent = localStorage.getItem(GDPR_KEY)
      undecided = consent !== "true" && consent !== "false" && sessionStorage.getItem(LATER_KEY) !== "1"
    } catch {
      undecided = false
    }
    const hide = () => setVisible(false)
    window.addEventListener("passlore:consent-changed", hide)
    if (!undecided) return () => window.removeEventListener("passlore:consent-changed", hide)
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("passlore:consent-changed", hide)
    }
  }, [])

  const decide = (allow: boolean) => {
    try {
      localStorage.setItem(GDPR_KEY, allow ? "true" : "false")
    } catch {}
    setVisible(false)
    setToast(allow ? THANKS : DECLINED)
    startTimer()
    window.dispatchEvent(new Event("passlore:consent-changed"))
    if (allow) window.dispatchEvent(new Event("adsense:ready"))
  }

  const later = () => {
    try {
      sessionStorage.setItem(LATER_KEY, "1")
    } catch {}
    setVisible(false)
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            role="region"
            aria-label="Analytics choice"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: reduce ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[calc(16px+var(--dock-h,0px))] left-4 z-40 flex w-[calc(100%-32px)] max-w-[420px] flex-col gap-2.5 rounded-lg border border-line bg-surface p-3.5 text-ink shadow-e3 min-[720px]:p-4 [[data-theme=hc]_&]:border-2"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="m-0 font-bold">Count this visit?</p>
              <button
                type="button"
                aria-label="Decide later"
                onClick={later}
                className="-mt-2.5 -mr-2.5 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-sm text-ink-2 transition-colors duration-(--t-glide) ease-calm hover:bg-surface-2"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <p className="m-0 text-sm text-ink-2">
              Only with your OK, via Google Analytics. Passwords are never included, and Passlore works the same if you
              say no.{" "}
              <Link href="/privacy" className="font-semibold text-link underline underline-offset-2">
                What we count
              </Link>
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => decide(true)} className={choiceButton}>
                Allow
              </button>
              <button type="button" onClick={() => decide(false)} className={choiceButton}>
                No thanks
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-[calc(16px+var(--dock-h,0px))] z-40 flex justify-center"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              initial={reduce ? false : { opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
              transition={{ duration: reduce ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
              onFocus={() => clearTimeout(timer.current)}
              onBlur={startTimer}
              onMouseEnter={() => clearTimeout(timer.current)}
              onMouseLeave={startTimer}
              className="pointer-events-auto flex max-w-[540px] items-center gap-2.5 rounded-md bg-[var(--text)] py-2.5 pr-2 pl-4 text-[var(--bg)] shadow-e3"
            >
              <Check className="size-5 shrink-0" weight="bold" aria-hidden />
              <span className="flex-1 text-[15px]">{toast}</span>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setToast(null)}
                className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-inherit transition-colors duration-(--t-glide) ease-calm hover:bg-[color-mix(in_srgb,var(--bg)_14%,transparent)] focus-visible:outline-[var(--bg)]"
              >
                <X className="size-5" aria-hidden />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

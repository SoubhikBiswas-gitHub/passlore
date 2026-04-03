"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Cookie } from "@phosphor-icons/react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const GDPR_KEY = "gdpr-consent"

export function GdprBanner() {
  const [visible, setVisible] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const consent = localStorage.getItem(GDPR_KEY)
    if (consent !== "true" && consent !== "false") {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(GDPR_KEY, "true")
    setVisible(false)
    window.dispatchEvent(new Event("adsense:ready"))
  }

  const handleReject = () => {
    localStorage.setItem(GDPR_KEY, "false")
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={prefersReduced ? undefined : { y: 100, opacity: 0 }}
          animate={prefersReduced ? undefined : { y: 0, opacity: 1 }}
          exit={prefersReduced ? undefined : { y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-none shrink-0">
                <Cookie className="h-5 w-5 text-indigo-600 dark:text-indigo-400" weight="fill" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">
                    We value your privacy
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                    We use cookies to enhance your experience. Your passwords are never
                    stored or transmitted.{" "}
                    <Link
                      href="/privacy"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReject}
                    className="h-8 text-xs"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAccept}
                    className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                  >
                    Accept
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReject}
                className="h-8 w-8 shrink-0 -mt-1 -mr-1"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4 text-zinc-500" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

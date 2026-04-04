"use client"

import { ShareNetwork } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { SITE_NAME } from "@/lib/seo"
import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

export function ShareButton() {
  const [showToast, setShowToast] = useState(false)
  const prefersReduced = useReducedMotion()

  const handleShare = async () => {
    const shareData = {
      title: SITE_NAME,
      text: `Generate secure passwords instantly with ${SITE_NAME}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000)
      }
    } catch {
      // User cancelled or error
      try {
        await navigator.clipboard.writeText(window.location.href)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000)
      } catch {
        // Ignore clipboard errors
      }
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        aria-label="Share this page"
        className="h-9 w-9"
      >
        <ShareNetwork className="h-[18px] w-[18px]" weight="regular" />
      </Button>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-popover text-popover-foreground text-sm rounded-none border border-border shadow-md"
          >
            Link copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

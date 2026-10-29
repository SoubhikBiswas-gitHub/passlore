"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowsClockwise, Check, Copy, Lightning } from "@phosphor-icons/react"
import { pickN } from "@/lib/generator/random"
import { tier } from "@/lib/generator/strength"
import { POOL } from "./LiveDraw"
import { PasswordText } from "./PasswordText"
import { Toast, copyText, useToast } from "./Toast"
import { btn, forTag } from "./styles"

const LENGTH = 16
const BITS = LENGTH * Math.log2(POOL.length)
const CUT = "260px"
const notch = (y: string) => `radial-gradient(circle 13px at calc(100% - ${CUT}) ${y}, #0000 97%, #000)`
const mask = `${notch("0")} top/100% 51% no-repeat, ${notch("100%")} bottom/100% 51% no-repeat`

export function FreshTicket() {
  const [pw, setPw] = useState("")
  const [copied, setCopied] = useState(false)
  const [announce, setAnnounce] = useState("")
  const toast = useToast()
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    setPw(pickN(POOL, LENGTH))
    return () => clearTimeout(timer.current)
  }, [])

  const copy = async () => {
    if (!pw) return
    if (await copyText(pw)) {
      setCopied(true)
      setAnnounce("Password copied.")
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2400)
    } else toast.show("Couldn’t reach the clipboard. Select the password and copy it.")
  }

  const fresh = () => {
    setPw(pickN(POOL, LENGTH))
    setCopied(false)
    setAnnounce("New password cut.")
  }

  return (
    <>
      <div className="relative mt-2 w-full max-w-[760px] drop-shadow-[0_18px_30px_rgba(11,13,23,0.16)] dark:drop-shadow-[0_18px_34px_rgba(0,0,0,0.6)]">
        <div
          className="grid grid-cols-1 rounded-ticket bg-surface text-left text-ink shadow-[inset_0_0_0_1px_var(--border)] md:grid-cols-[minmax(0,1fr)_260px] md:[mask:var(--ticket-mask)]"
          style={{ "--ticket-mask": mask } as React.CSSProperties}
        >
          <div className="flex min-w-0 flex-col gap-2.5 px-4 py-[18px] md:px-[26px] md:py-[22px]">
            <span className={forTag}>
              <Lightning className="size-4" weight="bold" aria-hidden />
              For · Just one
            </span>
            <p
              className="m-0 min-h-[1.22em] font-mono text-[26px] leading-[1.22] tracking-[0.02em] [overflow-wrap:anywhere] md:text-4xl"
              aria-label={pw ? `Password: ${pw.split("").join(" ")}` : "Cutting a password"}
            >
              {pw ? <PasswordText value={pw} /> : "················"}
            </p>
            <span className="text-[13px] text-ink-3">
              {LENGTH} characters · from all {POOL.length} · ≈ {BITS.toFixed(1)} bits · {tier(BITS).name}
            </span>
          </div>
          <div className="relative flex flex-row gap-2.5 px-4 pb-3.5 pt-3 before:absolute before:inset-x-[18px] before:top-0 before:h-0.5 before:bg-[repeating-linear-gradient(to_right,var(--border-strong)_0_6px,transparent_6px_12px)] before:content-[''] md:flex-col md:justify-center md:px-[22px] md:py-5 md:before:inset-x-auto md:before:-left-px md:before:bottom-6 md:before:top-6 md:before:h-auto md:before:w-0.5 md:before:bg-[repeating-linear-gradient(to_bottom,var(--border-strong)_0_6px,transparent_6px_12px)]">
            <button
              type="button"
              onClick={copy}
              className={`${copied ? btn.copied : btn.primaryLg} flex-1`}
              disabled={!pw}
            >
              {copied ? (
                <Check className="size-5" weight="bold" aria-hidden />
              ) : (
                <Copy className="size-5" weight="bold" aria-hidden />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button type="button" onClick={fresh} className={`${btn.secondary} flex-1`}>
              <ArrowsClockwise className="size-5" weight="bold" aria-hidden />
              Cut a new one
            </button>
          </div>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {announce}
        </p>
      </div>
      <Toast text={toast.text} onDismiss={toast.dismiss} />
    </>
  )
}

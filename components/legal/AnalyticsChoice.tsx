"use client"

import { useEffect, useState } from "react"
import { Toast, useToast } from "@/components/content/Toast"
import { card } from "@/components/content/styles"

// Must match the key the consent banner and GoogleAnalytics read.
const CONSENT_KEY = "gdpr-consent"
const CHANGED = "passlore:consent-changed"

type Consent = "unset" | "yes" | "no"

function read(): Consent {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    return v === "true" ? "yes" : v === "false" ? "no" : "unset"
  } catch {
    return "unset"
  }
}

function useConsent() {
  const [consent, setConsent] = useState<Consent>("unset")
  useEffect(() => {
    const sync = () => setConsent(read())
    sync()
    window.addEventListener(CHANGED, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(CHANGED, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])
  return consent
}

function write(value: "true" | "false") {
  try {
    window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    return false
  }
  window.dispatchEvent(new Event(CHANGED))
  if (value === "true") window.dispatchEvent(new Event("adsense:ready"))
  return true
}

export function ConsentSummary() {
  const consent = useConsent()
  if (consent === "yes") return <>You allowed it: page visits and basic device details, nothing else.</>
  if (consent === "no") return <>You said no. Nothing is collected.</>
  return <>Nothing until you choose. You haven’t yet.</>
}

const pick =
  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface px-3.5 text-sm font-semibold text-ink transition-colors duration-150 ease-calm hover:bg-surface-2 aria-pressed:border-primary aria-pressed:bg-primary-soft aria-pressed:text-on-primary-soft"

export function AnalyticsChoice() {
  const consent = useConsent()
  const toast = useToast()

  const allow = () => {
    if (!write("true")) return toast.show("Couldn’t save your choice in this browser. Nothing is collected.", "error")
    toast.show("Analytics allowed. You can change this any time.", "ok")
  }

  const decline = () => {
    if (!write("false")) return toast.show("Couldn’t save your choice in this browser. Nothing is collected.", "error")
    toast.show("Analytics off. Nothing is collected.", "ok")
  }

  const line =
    consent === "yes"
      ? "You allowed analytics on this device."
      : consent === "no"
        ? "You declined analytics on this device. Nothing is collected."
        : "You haven’t chosen yet, so nothing is collected."

  return (
    <div className={`${card} mt-6 flex flex-col gap-3 p-5`}>
      <p className="!m-0 text-lg font-semibold">Your analytics choice</p>
      <p className="!m-0 text-base text-ink-2">{line}</p>
      <div role="group" aria-label="Analytics" className="flex flex-wrap gap-2">
        <button type="button" className={pick} aria-pressed={consent === "yes"} onClick={allow}>
          Allow analytics
        </button>
        <button type="button" className={pick} aria-pressed={consent === "no"} onClick={decline}>
          No analytics
        </button>
      </div>
      <Toast text={toast.text} kind={toast.kind} onDismiss={toast.dismiss} />
    </div>
  )
}

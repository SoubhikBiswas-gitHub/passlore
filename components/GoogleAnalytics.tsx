"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

// Must match the key in GdprBanner.tsx and AnalyticsChoice.tsx.
const GDPR_KEY = "gdpr-consent"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === "play"
  ? ""
  : process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? ""

function setDisabled(disabled: boolean) {
  ;(window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = disabled
}

export function GoogleAnalytics() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const readConsent = () => {
      try {
        return typeof window !== "undefined" && window.localStorage.getItem(GDPR_KEY) === "true"
      } catch {
        return false
      }
    }

    if (readConsent()) {
      setConsented(true)
    }

    const onConsentAccept = () => {
      setDisabled(false)
      setConsented(true)
    }
    // gtag honours this flag, so a withdrawal takes effect without a reload
    const onConsentChanged = () => {
      if (!readConsent()) setDisabled(true)
    }
    window.addEventListener("adsense:ready", onConsentAccept)
    window.addEventListener("passlore:consent-changed", onConsentChanged)
    return () => {
      window.removeEventListener("adsense:ready", onConsentAccept)
      window.removeEventListener("passlore:consent-changed", onConsentChanged)
    }
  }, [])

  if (!GA_MEASUREMENT_ID || !consented) {
    return null
  }

  const idForScript = encodeURIComponent(GA_MEASUREMENT_ID)

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${idForScript}`}
        strategy="afterInteractive"
      />
      <Script id="ga-gtag-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}');
`}
      </Script>
    </>
  )
}

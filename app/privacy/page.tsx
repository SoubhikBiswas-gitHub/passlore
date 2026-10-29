import type { Metadata } from "next"
import { ChartBar, MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react/dist/ssr"
import { AnalyticsChoice, ConsentSummary } from "@/components/legal/AnalyticsChoice"
import { LegalShell, type LegalSectionData } from "@/components/legal/LegalShell"
import { card } from "@/components/content/styles"
import { privacyMetadata } from "@/lib/seo"

export const metadata: Metadata = privacyMetadata

const sections: LegalSectionData[] = [
  {
    id: "summary",
    h: "The short version",
    body: (
      <p>
        Passlore generates passwords in your browser. No generated password, and no password you check, is ever sent to
        Passlore or stored on a server we run.
      </p>
    ),
  },
  {
    id: "device",
    h: "What stays on your device",
    body: (
      <p>
        Generated passwords, your settings and the drawer (this tab’s history). The drawer is plain text in this tab’s
        session storage, holds the last 20 items and is erased when the tab closes. Your theme and analytics choice are
        kept in local storage so they persist between visits. The clipboard is cleared after 60 seconds only if you turn
        that on.
      </p>
    ),
  },
  {
    id: "breach",
    h: "The optional breach check",
    body: (
      <p>
        Only when you press it, your browser computes a SHA-1 hash of the password and sends the first 5 of its 40
        characters to Have I Been Pwned (a third-party service). The match happens on your device. Have I Been Pwned’s
        own privacy terms apply to that request.
      </p>
    ),
  },
  {
    id: "analytics",
    h: "Analytics, only with your consent",
    body: (
      <p>
        If you choose “Allow”, Google Analytics counts page visits along with standard browser details such as device
        type and approximate region. Passwords, site rules you paste and network names are never included. If you
        decline, nothing is collected and the site works exactly the same. Google keeps analytics data for no more
        than 14 months, and Passlore stores none of it on servers of its own.
      </p>
    ),
  },
  {
    id: "hosting",
    h: "Hosting",
    body: (
      <p>
        The site is served by Cloudflare, which may process standard request data such as IP address and browser type to
        deliver pages and prevent abuse. Cloudflare’s own privacy policy covers how long it keeps that data.
      </p>
    ),
  },
  {
    id: "contact",
    h: "Your rights and contact",
    body: (
      <p>
        You can change your analytics choice below at any time. For questions or requests, contact{" "}
        <a href="mailto:privacy@passlore.com">privacy@passlore.com</a>.
      </p>
    ),
  },
]

const flow =
  "grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3.5 border-b border-line py-4 md:grid-cols-[44px_minmax(0,1fr)_minmax(0,1.3fr)]"
const dot = "flex size-11 items-center justify-center rounded-md"

function WhatLeaves() {
  return (
    <div role="group" aria-labelledby="leaves" className={`${card} mt-10 px-[22px] py-2 text-base leading-normal`}>
      <p id="leaves" className="!mb-0 mt-3.5 font-display text-[22px] font-bold tracking-[-0.02em]">
        What leaves your device
      </p>
      <div className={flow}>
        <span className={`${dot} bg-success-soft text-success`}>
          <ShieldCheck className="size-6" aria-hidden />
        </span>
        <strong>Your passwords</strong>
        <span className="col-start-2 md:col-start-auto">
          <strong className="text-success">Never.</strong> Generated, checked and practised passwords stay in this tab.
        </span>
      </div>
      <div className={flow}>
        <span className={`${dot} bg-lore-soft text-link`}>
          <MagnifyingGlass className="size-6" aria-hidden />
        </span>
        <strong>Breach check</strong>
        <span className="col-start-2 md:col-start-auto">
          Only when you press <em>Check</em>: 5 of the 40 hash characters, to Have I Been Pwned.
        </span>
      </div>
      <div className={`${flow} border-b-0`}>
        <span className={`${dot} bg-surface-2 text-ink-2`}>
          <ChartBar className="size-6" aria-hidden />
        </span>
        <strong>Analytics</strong>
        <span className="col-start-2 md:col-start-auto">
          <ConsentSummary />
        </span>
      </div>
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <LegalShell
      doc="/privacy"
      title="Privacy"
      intro="Passlore is built so there’s almost nothing to tell you: your passwords never reach us."
      sections={sections}
      before={<WhatLeaves />}
      after={<AnalyticsChoice />}
    />
  )
}

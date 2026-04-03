"use client"

import { useState } from "react"
import Link from "next/link"

export function BlogNewsletter() {
  const [email, setEmail] = useState("")
  const [acknowledged, setAcknowledged] = useState(false)

  return (
    <section className="py-16 px-4 sm:px-6 bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-headline text-xl sm:text-2xl font-bold text-primary-foreground uppercase tracking-[0.15em] mb-4">
          Stay informed
        </h2>
        <p className="text-sm text-primary-foreground/95 mb-4 leading-relaxed">
          <strong className="text-primary-foreground">Demo only:</strong> there is no newsletter service connected yet. Submitting
          does not send your email anywhere or store it on a server—it only acknowledges in your browser for this
          session.
        </p>
        <p className="text-xs text-primary-foreground/90 mb-8 leading-relaxed">
          For how we handle data when we add features, see the{" "}
          <Link href="/privacy" className="text-primary-foreground underline underline-offset-2 hover:text-primary-foreground">
            privacy policy
          </Link>
          .
        </p>
        <form
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          onSubmit={(e) => {
            e.preventDefault()
            if (!email.trim()) return
            setAcknowledged(true)
          }}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address (not transmitted)
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@domain.com"
            className="flex-1 px-4 py-3 text-sm bg-primary-foreground/10 border border-primary-foreground/25 text-primary-foreground placeholder:text-primary-foreground/60 rounded-none focus:outline-none focus:ring-2 focus:ring-primary-foreground/35"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-background text-foreground font-headline text-xs font-bold uppercase tracking-widest rounded-none hover:bg-accent-2 active:bg-accent-3 border border-foreground/15 transition-colors duration-150"
          >
            {acknowledged ? "Acknowledged" : "Try demo"}
          </button>
        </form>
      </div>
    </section>
  )
}

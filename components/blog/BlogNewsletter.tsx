"use client"

import { useState } from "react"
import Link from "next/link"

export function BlogNewsletter() {
  const [email, setEmail] = useState("")
  const [acknowledged, setAcknowledged] = useState(false)

  return (
    <section className="py-16 px-4 sm:px-6 bg-blue-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-headline text-xl sm:text-2xl font-bold text-white uppercase tracking-[0.15em] mb-4">
          Stay informed
        </h2>
        <p className="text-sm text-blue-100 mb-4 leading-relaxed">
          <strong className="text-white">Demo only:</strong> there is no newsletter service connected yet. Submitting
          does not send your email anywhere or store it on a server—it only acknowledges in your browser for this
          session.
        </p>
        <p className="text-xs text-blue-200/90 mb-8 leading-relaxed">
          For how we handle data when we add features, see the{" "}
          <Link href="/privacy" className="text-white underline underline-offset-2 hover:text-blue-50">
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
            className="flex-1 px-4 py-3 text-sm bg-blue-800/80 border border-blue-700 text-zinc-100 placeholder:text-blue-200/60 rounded-none focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-background text-foreground font-headline text-xs font-bold uppercase tracking-widest rounded-none hover:bg-accent border border-foreground/15 transition-colors"
          >
            {acknowledged ? "Acknowledged" : "Try demo"}
          </button>
        </form>
      </div>
    </section>
  )
}

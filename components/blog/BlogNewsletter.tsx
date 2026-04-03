"use client"

import { useState } from "react"

export function BlogNewsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="py-16 px-4 sm:px-6 bg-blue-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-headline text-xl sm:text-2xl font-bold text-white uppercase tracking-[0.15em] mb-4">
          Zero trust news
        </h2>
        <p className="text-sm text-blue-100 mb-8 leading-relaxed">
          Direct security updates for professionals. No fluff, just precision data.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          onSubmit={(e) => {
            e.preventDefault()
            if (!email.trim()) return
            setSubmitted(true)
          }}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
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
            className="px-8 py-3 bg-white text-zinc-950 font-headline text-xs font-bold uppercase tracking-widest rounded-none hover:bg-zinc-100 transition-colors"
          >
            {submitted ? "Joined" : "Join"}
          </button>
        </form>
      </div>
    </section>
  )
}

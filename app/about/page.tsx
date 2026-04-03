import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, Plus } from "@phosphor-icons/react/dist/ssr"
import { aboutMetadata, getBreadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = aboutMetadata

const toc = [
  { id: "our-mission", label: "Our mission" },
  { id: "client-side-crypto", label: "Client-side crypto" },
  { id: "strength-factors", label: "Strength factors" },
  { id: "understanding-entropy", label: "Understanding entropy" },
  { id: "hibp-k-anonymity", label: "HIBP & k-anonymity" },
  { id: "best-practices-2025", label: "2025 best practices" },
] as const

const entropySegments = [
  "ent-a",
  "ent-b",
  "ent-c",
  "ent-d",
  "ent-e",
  "ent-f",
  "ent-g",
  "ent-h",
  "ent-i",
  "ent-j",
] as const

export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://securepass.pro" },
    { name: "About", url: "https://securepass.pro/about" },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#0a0a0a] text-zinc-50 min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
            <aside className="lg:col-span-3 mb-12 lg:mb-0 lg:sticky lg:top-24 space-y-8">
              <nav aria-label="On this page">
                <p className="text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-headline font-bold mb-4">
                  In this article
                </p>
                <ul className="space-y-2">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm text-zinc-400 hover:text-blue-400 transition-colors font-mono"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 bg-[#18181b] border border-zinc-800 space-y-2 font-mono text-[11px] text-emerald-400 leading-relaxed">
                <p className="uppercase tracking-wide">Security status: encrypted connection</p>
                <p className="uppercase tracking-wide">Protocol: TLS 1.3</p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-headline uppercase tracking-widest text-blue-500 hover:text-blue-400"
              >
                <Plus className="size-4" weight="bold" aria-hidden />
                Try our free password generator
              </Link>
            </aside>

            <article className="lg:col-span-9">
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                <span className="text-zinc-50">About SecurePass Pro &amp; </span>
                <span className="text-violet-400">password security</span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-mono mb-10">
                <span>Published: Jun 2024</span>
                <span className="text-zinc-700" aria-hidden>
                  ·
                </span>
                <span>Reading time: 12 min</span>
                <span className="text-zinc-700" aria-hidden>
                  ·
                </span>
                <span className="inline-flex items-center gap-1 text-blue-400">
                  <CheckCircle className="size-3.5" weight="fill" aria-hidden />
                  Peer reviewed
                </span>
              </div>

              <div
                className="aspect-[21/9] w-full mb-12 bg-gradient-to-br from-zinc-900 via-violet-950/40 to-zinc-950 border border-zinc-800 relative overflow-hidden"
                role="img"
                aria-label="Abstract server infrastructure visualization"
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(255,255,255,0.04) 8px)",
                  }}
                  aria-hidden
                />
              </div>

              <section id="our-mission" className="scroll-mt-28 mb-14">
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-zinc-50 mb-4">
                  Our mission
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Security is a fundamental right, not a product tier. SecurePass Pro exists to put industrial-grade
                  password generation in every browser — with zero telemetry, zero accounts, and zero excuses.
                </p>
                <div className="grid md:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800">
                  <div className="bg-[#18181b] p-6">
                    <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-zinc-300 mb-3">
                      Zero-knowledge architecture
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      Random material is sourced from the Web Crypto API. Passwords and passphrases are composed
                      locally; optional breach checks use k-anonymity so full secrets never leave your device.
                    </p>
                  </div>
                  <div className="bg-black p-4 font-mono text-xs text-emerald-400/90 overflow-x-auto border-t md:border-t-0 md:border-l border-zinc-800">
                    <pre className="whitespace-pre-wrap">{`async function deriveKey(seed: Uint8Array) {
  return crypto.subtle.importKey(
    "raw", seed, "PBKDF2", false,
    ["deriveBits"]
  );
}`}</pre>
                  </div>
                </div>
              </section>

              <section id="client-side-crypto" className="scroll-mt-28 mb-14">
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-zinc-50 mb-4">
                  How it works (client-side crypto)
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  Entropy is drawn from the platform CSPRNG, then mapped into your selected character sets or word lists.
                  No server round-trip is required to produce credentials.
                </p>
                <h3 className="text-xs font-headline uppercase tracking-widest text-violet-400 mb-3">
                  PBKDF2 with SHA-256
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
                  <li>Collect random bytes via getRandomValues.</li>
                  <li>Map bytes into charset indices without modulo bias where possible.</li>
                  <li>Apply length, prefix, suffix, and exclusion rules.</li>
                  <li>Re-roll when constraints cannot be satisfied (e.g. required symbols).</li>
                </ol>
              </section>

              <section id="strength-factors" className="scroll-mt-28 mb-14">
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-zinc-50 mb-4">
                  What makes a strong password
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Length buys exponential space; variety ensures the alphabet your attacker must search is wide;
                  randomness removes dictionary shortcuts.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
                  <div className="bg-[#18181b] p-6 text-center">
                    <p className="font-headline text-2xl font-bold text-zinc-50 mb-1">16+</p>
                    <p className="text-[0.6875rem] uppercase tracking-widest text-zinc-500">Character length</p>
                  </div>
                  <div className="bg-[#18181b] p-6 text-center">
                    <p className="font-headline text-2xl font-bold text-zinc-50 mb-1">4</p>
                    <p className="text-[0.6875rem] uppercase tracking-widest text-zinc-500">Variety of sets</p>
                  </div>
                  <div className="bg-[#18181b] p-6 text-center">
                    <p className="font-headline text-2xl font-bold text-zinc-50 mb-1">0</p>
                    <p className="text-[0.6875rem] uppercase tracking-widest text-zinc-500">Dictionary words</p>
                  </div>
                </div>
              </section>

              <section id="understanding-entropy" className="scroll-mt-28 mb-14">
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-zinc-50 mb-4">
                  Understanding entropy
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-2 font-mono">
                  E = log₂(R^L)
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                  R is the size of the character set; L is length. Each extra bit doubles the work for an idealized
                  brute-force attacker.
                </p>
                <div className="space-y-3">
                  <div className="flex gap-1 h-10" role="img" aria-label="Entropy meter, five of ten segments filled">
                    {entropySegments.map((key, i) => (
                      <div key={key} className={i < 5 ? "flex-1 bg-emerald-500" : "flex-1 bg-zinc-800"} />
                    ))}
                  </div>
                  <div className="flex justify-between text-[0.6875rem] font-mono uppercase tracking-widest text-zinc-500">
                    <span>128 bits</span>
                    <span className="text-emerald-500">Military grade</span>
                  </div>
                </div>
              </section>

              <section id="hibp-k-anonymity" className="scroll-mt-28 mb-14">
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-zinc-50 mb-4">
                  The HIBP check
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  When you run a breach check, we hash locally and send only a short prefix to Have I Been Pwned&apos;s
                  range API — a standard k-anonymity pattern used industry-wide.
                </p>
                <div className="bg-[#18181b] border border-zinc-800 p-6">
                  <h3 className="text-xs font-headline uppercase tracking-widest text-blue-400 mb-3">
                    K-anonymity explained
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Your full hash never leaves the browser. The service returns a bucket of hashes sharing the same
                    prefix; matching is completed offline. That reveals whether a password appeared in known dumps —
                    not whether you personally reused it elsewhere.
                  </p>
                </div>
              </section>

              <section id="best-practices-2025" className="scroll-mt-28 mb-14">
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-zinc-50 mb-6">
                  Security best practices for 2025
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      n: "01",
                      t: "Hardware MFA is mandatory",
                      d: "Phishing-resistant factors beat SMS and TOTP when protecting high-value accounts.",
                    },
                    {
                      n: "02",
                      t: "Adopt passkeys",
                      d: "Where supported, passkeys remove shared secrets from the authentication path entirely.",
                    },
                    {
                      n: "03",
                      t: "Rotate on breach, not schedule",
                      d: "NIST-style guidance: change secrets when compromised, not on an arbitrary calendar.",
                    },
                  ].map((card) => (
                    <div
                      key={card.n}
                      className="flex gap-6 p-6 bg-[#18181b] border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      <span className="font-headline text-3xl font-bold text-violet-500/80 shrink-0">{card.n}</span>
                      <div>
                        <h3 className="font-headline text-sm font-bold uppercase tracking-wide text-zinc-100 mb-2">
                          {card.t}
                        </h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{card.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          </div>
        </div>

        <section className="bg-violet-600 border-t border-violet-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <p className="font-headline text-lg sm:text-xl font-bold text-white uppercase tracking-[0.08em] max-w-xl leading-snug">
              Ready to upgrade your security? Generate industrial-grade passwords in seconds.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-zinc-950 font-headline text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors shrink-0"
            >
              Get started now
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

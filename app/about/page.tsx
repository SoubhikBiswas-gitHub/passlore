import type { Metadata } from "next"
import Link from "next/link"
import { Key } from "@phosphor-icons/react/dist/ssr"
import { TocScrollNav } from "@/components/TocScrollNav"
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

const lastUpdatedAbout = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})

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

      <div className="bg-background text-foreground min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
            <aside className="lg:col-span-3 mb-12 lg:mb-0 lg:sticky lg:top-24 space-y-8">
              <TocScrollNav items={toc} heading="In this article" />

              <div className="p-4 bg-card border border-border space-y-2 font-mono text-[11px] text-secure-fg leading-relaxed">
                <p className="uppercase tracking-wide">Connection: HTTPS</p>
                <p className="uppercase tracking-wide">TLS version: browser-negotiated</p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-headline uppercase tracking-widest text-primary hover:text-primary/90"
              >
                <Key className="size-4" weight="bold" aria-hidden />
                Try our free password generator
              </Link>
            </aside>

            <article className="lg:col-span-9">
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                <span className="text-foreground">About SecurePass Pro &amp; </span>
                <span className="text-violet-400">password security</span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-[0.6875rem] uppercase tracking-widest text-muted-foreground font-mono mb-10">
                <span>Last updated · {lastUpdatedAbout}</span>
                <span className="text-muted-foreground/60" aria-hidden>
                  ·
                </span>
                <span>Reading time: 12 min</span>
                <span className="text-muted-foreground/60" aria-hidden>
                  ·
                </span>
                <a
                  href="https://pages.nist.gov/800-63-3/sp800-63b.html"
                  className="text-primary hover:text-primary/90 underline-offset-2 hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  NIST SP 800-63B reference
                </a>
              </div>

              <div
                className="aspect-[21/9] w-full mb-12 bg-gradient-to-br from-muted via-primary/10 to-background border border-border relative overflow-hidden"
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
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-foreground mb-4">
                  Our mission
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Security is a fundamental right, not a product tier. SecurePass Pro exists to put strong, random
                  password generation in your browser — with no account required and generation performed locally.
                  See our{" "}
                  <Link href="/privacy" className="text-primary hover:underline underline-offset-2">
                    privacy policy
                  </Link>{" "}
                  for cookies; optional analytics; third parties.
                </p>
                <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
                  <div className="bg-card p-6">
                    <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-foreground/90 mb-3">
                      Client-side generation
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Random indices come from <code className="text-foreground/80">crypto.getRandomValues</code> via
                      unbiased rejection sampling. Secrets are assembled in your browser; optional HIBP checks send only a
                      SHA-1 hash prefix, not your plaintext password.
                    </p>
                  </div>
                  <div className="bg-muted p-4 font-mono text-xs text-secure-fg overflow-x-auto border-t md:border-t-0 md:border-l border-border">
                    <pre className="whitespace-pre-wrap">{`// Simplified: CSPRNG → uniform index
const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
// …rejection sampling so each index in
// [0, charset.length) is equally likely…
const ch = charset[uniformIndex];`}</pre>
                  </div>
                </div>
              </section>

              <section id="client-side-crypto" className="scroll-mt-28 mb-14">
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-foreground mb-4">
                  How it works (client-side crypto)
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Entropy is drawn from the platform CSPRNG, then mapped into your selected character sets or word lists.
                  No server round-trip is required to produce credentials.
                </p>
                <h3 className="text-xs font-headline uppercase tracking-widest text-violet-400 mb-3">
                  CSPRNG and unbiased selection
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Draw 32-bit values from <code className="text-muted-foreground">crypto.getRandomValues</code>.</li>
                  <li>Map to charset or word-list indices using rejection sampling (no modulo bias).</li>
                  <li>Apply length, prefix, suffix, and character-set rules you choose in the UI.</li>
                  <li>Re-roll when constraints cannot be satisfied (for example required symbols).</li>
                </ol>
              </section>

              <section id="strength-factors" className="scroll-mt-28 mb-14">
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-foreground mb-4">
                  What makes a strong password
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Length buys exponential space; variety ensures the alphabet your attacker must search is wide;
                  randomness removes dictionary shortcuts.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
                  <div className="bg-card p-6 text-center">
                    <p className="font-headline text-2xl font-bold text-foreground mb-1">16+</p>
                    <p className="text-[0.6875rem] uppercase tracking-widest text-muted-foreground">Character length</p>
                  </div>
                  <div className="bg-card p-6 text-center">
                    <p className="font-headline text-2xl font-bold text-foreground mb-1">4</p>
                    <p className="text-[0.6875rem] uppercase tracking-widest text-muted-foreground">Variety of sets</p>
                  </div>
                  <div className="bg-card p-6 text-center">
                    <p className="font-headline text-2xl font-bold text-foreground mb-1">0</p>
                    <p className="text-[0.6875rem] uppercase tracking-widest text-muted-foreground">Dictionary words</p>
                  </div>
                </div>
              </section>

              <section id="understanding-entropy" className="scroll-mt-28 mb-14">
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-foreground mb-4">
                  Understanding entropy
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-2 font-mono">
                  E = log₂(R^L)
                </p>
                <p className="text-muted-foreground/90 text-sm leading-relaxed mb-6">
                  R is the size of the character set; L is length. Each extra bit doubles the work for an idealized
                  brute-force attacker.
                </p>
                <div className="space-y-3">
                  <div className="flex gap-1 h-10" role="img" aria-label="Entropy meter, five of ten segments filled">
                    {entropySegments.map((key, i) => (
                      <div key={key} className={i < 5 ? "flex-1 bg-secure" : "flex-1 bg-muted"} />
                    ))}
                  </div>
                  <div className="flex justify-between text-[0.6875rem] font-mono uppercase tracking-widest text-muted-foreground">
                    <span>128 bits (example)</span>
                    <span className="text-secure-fg">High entropy</span>
                  </div>
                </div>
              </section>

              <section id="hibp-k-anonymity" className="scroll-mt-28 mb-14">
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-foreground mb-4">
                  The HIBP check
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  When you run a breach check, we SHA-1 hash locally and send only the first five{" "}
                  <strong className="text-foreground">hexadecimal</strong> characters of that hash to Have I Been
                  Pwned&apos;s range API — the k-anonymity model described in their Pwned Passwords documentation.
                </p>
                <div className="bg-card border border-border p-6">
                  <h3 className="text-xs font-headline uppercase tracking-widest text-primary mb-3">
                    K-anonymity explained
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your full hash never leaves the browser. The service returns a bucket of hashes sharing the same
                    prefix; matching is completed offline. That reveals whether a password appeared in known dumps —
                    not whether you personally reused it elsewhere.
                  </p>
                </div>
              </section>

              <section id="best-practices-2025" className="scroll-mt-28 mb-14">
                <h2 className="font-headline text-xl font-bold uppercase tracking-[0.12em] text-foreground mb-6">
                  Security best practices for 2025
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      n: "01",
                      t: "Use phishing-resistant MFA",
                      d: "Hardware security keys and passkeys beat SMS and plain app codes when protecting high-value accounts.",
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
                      className="flex gap-6 p-6 bg-card border border-border hover:border-muted-foreground/30 transition-colors"
                    >
                      <span className="font-headline text-3xl font-bold text-violet-500/80 shrink-0">{card.n}</span>
                      <div>
                        <h3 className="font-headline text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                          {card.t}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{card.d}</p>
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
              Ready to upgrade your security? Generate strong random passwords in your browser.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-headline text-xs font-bold uppercase tracking-widest hover:bg-accent border border-foreground/15 transition-colors shrink-0"
            >
              Get started now
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

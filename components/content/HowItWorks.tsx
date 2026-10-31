import type { Metadata } from "next"
import Link from "next/link"
import { Bug, MagnifyingGlass, Repeat, Tray } from "@phosphor-icons/react/dist/ssr"
import { Lore } from "@/components/Lore"
import { cn } from "@/lib/utils"
import { getBreadcrumbSchema, SITE_NAME, SITE_URL } from "@/lib/seo"
import { ISSUES_URL, REPO_URL } from "./links"
import { LiveDraw } from "./LiveDraw"
import { RecipeDeck } from "./RecipeDeck"
import { TocSide } from "./Toc"
import { btn, card, eyebrow, prose, stageBtn, wrap } from "./styles"

const TITLE = `How ${SITE_NAME} works`
const DESCRIPTION =
  "Every Passlore password is cut on your device, one character at a time. Watch the same code run: where the randomness comes from, how strength is counted and what the breach check sends."

export const howItWorksMetadata: Metadata = {
  title: `${TITLE} — randomness you can watch`,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/how-it-works`,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: "/how-it-works/opengraph-image", width: 1200, height: 630, alt: "How Passlore works: randomness you can watch." }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/how-it-works/opengraph-image"] },
  alternates: { canonical: `${SITE_URL}/how-it-works` },
}

const toc = [
  { id: "random", label: "Where randomness comes from" },
  { id: "fair", label: "Every character equally likely" },
  { id: "strength", label: "What makes it strong" },
  { id: "breach", label: "What the breach check sends" },
  { id: "limits", label: "What it can’t promise" },
  { id: "open", label: "Open source" },
]

const limits = [
  {
    Icon: Bug,
    h: "Malware wins.",
    p: "Nothing in a web page can protect a password from malware, a malicious extension or someone watching your screen.",
  },
  {
    Icon: Tray,
    h: "The drawer isn’t a vault.",
    p: "It’s plain text in this tab until you close it. Save what you keep in a password manager.",
  },
  {
    Icon: MagnifyingGlass,
    h: "“Not found” isn’t “safe”.",
    p: "It only covers breaches in Have I Been Pwned’s dataset.",
  },
  { Icon: Repeat, h: "Reuse undoes everything.", p: "Every estimate assumes the password is used in one place only." },
]

function N({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="mr-3 inline-flex size-10 items-center justify-center align-[4px] text-xl text-primary"
    >
      {n}
    </span>
  )
}

function Figure({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden className="mb-2 flex justify-center leading-none md:float-right md:mb-2 md:ml-5">
      {children}
    </div>
  )
}

export function HowItWorksPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "How it works", url: `${SITE_URL}/how-it-works` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section aria-labelledby="ab-h" className="bg-bg text-ink">
        <div
          className={`${wrap} grid grid-cols-1 items-center gap-12 py-8 md:py-[72px] md:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]`}
        >
          <div className="flex flex-col gap-[18px]">
            <div className="-mb-2.5 -ml-3.5 -mt-6 hidden md:block" aria-hidden>
              <Lore mood="happy" scene="dice" size={170} />
            </div>
            <p className={eyebrow}>How it works · 5 min read</p>
            <h1
              id="ab-h"
              className="m-0 font-display text-[40px] font-extrabold leading-[0.98] tracking-[-0.045em] text-balance md:text-[76px]"
            >
              Randomness you can watch.
            </h1>
            <p className="m-0 max-w-[600px] text-xl leading-[1.55] text-ink-2">
              Every Passlore password is cut on your device, one character at a time. This page doesn’t ask you to trust
              that — it runs the same code in front of you. Press the button and watch a character get made.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/" className={btn.primaryLg}>
                Open the generator
              </Link>
              <a href="#limits" className={cn(stageBtn, "min-h-14 rounded-md px-5 text-base")}>
                What it can’t promise
              </a>
            </div>
          </div>
          <LiveDraw />
        </div>
      </section>

      <div className={`${wrap} grid grid-cols-1 gap-14 pt-6 lg:grid-cols-[240px_minmax(0,1fr)]`}>
        <TocSide items={toc} className="pt-16" />
        <article className={`${prose} max-w-[780px]`}>
          <h2 id="random">
            <N n={1} />
            Where the randomness comes from
          </h2>
          <p>
            Passlore asks your browser for random numbers with <code>crypto.getRandomValues</code>, part of the Web
            Crypto API. The browser takes them from the operating system’s cryptographically secure generator — the same
            source used for encryption keys. It never uses <code>Math.random</code>, which is fast but predictable.
          </p>
          <pre>{`const buf = new Uint32Array(1);
crypto.getRandomValues(buf);   // 0 … 4,294,967,295, unpredictable`}</pre>
          <p>That’s step 1 in the card above. Every number you see there came from this call, just now.</p>

          <h2 id="fair">
            <N n={2} />
            Every character equally likely
          </h2>
          <p>
            A random number has to become a character. The obvious way — divide by the number of characters and keep the
            remainder — quietly favours some characters whenever the range of numbers isn’t an exact multiple of the
            pool. Passlore uses <strong>rejection sampling</strong>: it throws away the few numbers that would cause the
            unevenness and draws again, so every character is exactly as likely as every other.
          </p>
          <pre>{`function randomIndex(n) {
  const limit = Math.floor(2 ** 32 / n) * n;   // largest multiple of n
  const buf = new Uint32Array(1);
  do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
  return buf[0] % n;
}`}</pre>

          <h2 id="strength">
            <N n={3} />
            What makes a password strong
          </h2>
          <p>
            Strength is counted in <strong>bits of entropy</strong>: how many equally likely possibilities there are.
            For random characters it’s <code>log₂(pool size) × length</code>. Length multiplies, variety adds a little
            per character, and anything predictable — words you chose, patterns, a fixed prefix — adds nothing, so
            Passlore doesn’t count it.
          </p>
          <p>
            The time assumes an attacker who knows how the password was made and tests 100 billion guesses a second.
            It’s an estimate, not a guarantee, and Passlore always labels it that way.
          </p>

          <h2 id="breach">
            <N n={4} />
            What the breach check sends
          </h2>
          <Figure>
            <Lore mood="happy" scene="shield" size={150} animate={false} />
          </Figure>
          <p>
            The check is off until you press it. Then your device computes the password’s SHA-1 hash — 40 characters —
            and sends only the <strong>first 5</strong> to Have I Been Pwned. The service replies with hundreds of hash
            endings that share those 5 characters, padded so the size of the reply gives nothing away. Passlore looks
            for the rest of your hash in that list, here, on your device.
          </p>
          <p>
            Three outcomes, never blurred: <strong>found</strong> (don’t use it), <strong>not found</strong> (a good
            sign, not proof of safety), or <strong>couldn’t check</strong> (unknown — never shown as safe).
          </p>

          <h2 id="limits">
            <N n={5} />
            What Passlore can’t promise
          </h2>
          <Figure>
            <Lore mood="worried" scene="cloud" size={150} animate={false} />
          </Figure>
          <div className="mb-4 grid grid-cols-1 gap-3 text-base leading-normal md:grid-cols-2">
            {limits.map(({ Icon, h, p }) => (
              <div key={h} className={`${card} flex items-start gap-3 px-[18px] py-4`}>
                <Icon className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
                <span>
                  <strong>{h}</strong> {p}
                </span>
              </div>
            ))}
          </div>

          <h2 id="open">
            <N n={6} />
            Open source
          </h2>
          <p>
            Every line is public under the MIT licence. The generation code is a few small browser-only modules you can
            read in minutes — the same ones running the demos on this page. Source:{" "}
            <a href={REPO_URL}>github.com/soubhik-biswas/passlore</a>. Found something wrong?{" "}
            <a href={ISSUES_URL}>Open an issue</a>.
          </p>
        </article>
      </div>

      <section aria-labelledby="ab-cta" className="mt-[88px] bg-bg text-ink">
        <div className={`${wrap} flex flex-col gap-[22px] py-14`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="-my-6 -ml-3.5 -mr-2 hidden md:block" aria-hidden>
                <Lore mood="proud" scene="confetti" size={130} />
              </span>
              <h2 id="ab-cta" className="m-0 font-sans text-2xl font-bold leading-[1.2]">
                Where is your next password going?
              </h2>
            </div>
            <p className="m-0 text-ink-2 md:self-end md:text-right">Pick one — the generator opens already set up for it.</p>
          </div>
          <RecipeDeck />
        </div>
      </section>
    </>
  )
}

import Link from "next/link"
import { ShieldCheck, LockKey, Terminal } from "@phosphor-icons/react/dist/ssr"

export function HomeHero() {
  return (
    <section className="mb-16 text-center">
      <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 bg-card border border-border mb-8">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-secure shrink-0" aria-hidden />
          <ShieldCheck className="text-secure-fg size-[14px]" weight="fill" aria-hidden />
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-muted-foreground font-bold">
          Browser CSPRNG (getRandomValues)
        </span>
        <div className="hidden sm:block w-px h-3 bg-border" aria-hidden />
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-primary font-bold">
          Unbiased random indices
        </span>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-[5.5rem] font-headline font-bold tracking-[0.08em] text-foreground mb-6 leading-[1.05] uppercase">
        Free strong
        <br />
        <span className="text-primary">password</span> generator
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-12">
        Generate random passwords and passphrases locally in your browser. No account required. Optional Have I Been
        Pwned check uses k-anonymity (hash prefix only). See our{" "}
        <Link href="/privacy" className="text-primary hover:underline underline-offset-2">
          privacy policy
        </Link>{" "}
        for cookies; optional ads after consent; analytics.
      </p>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        <div className="flex items-center gap-2.5 px-5 py-3 border border-border bg-card/80 hover:bg-accent transition-colors">
          <ShieldCheck className="text-primary size-5 shrink-0" weight="fill" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest text-foreground/90">Client-side generation</span>
        </div>
        <div className="flex items-center gap-2.5 px-5 py-3 border border-border bg-card/80 hover:bg-accent transition-colors">
          <LockKey className="text-primary size-5 shrink-0" weight="fill" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest text-foreground/90">No signup</span>
        </div>
        <div className="flex items-center gap-2.5 px-5 py-3 border border-border bg-card/80 hover:bg-accent transition-colors">
          <Terminal className="text-primary size-5 shrink-0" weight="bold" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest text-foreground/90">HIBP optional</span>
        </div>
      </div>
    </section>
  )
}

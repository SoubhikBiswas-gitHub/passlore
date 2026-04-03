import type { ReactNode } from "react"
import { Cpu, Scales, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"

interface ISpecCardProps {
  readonly id: string
  readonly label: string
  readonly title: string
  readonly detail: string
  readonly icon: ReactNode
}

function SpecCard({ id, label, title, detail, icon }: ISpecCardProps) {
  return (
    <article
      className="group relative flex flex-col gap-4 border border-border bg-card p-6 sm:p-7 transition-colors duration-200 hover:bg-accent/60 hover:border-primary/35 focus-within:border-primary/50"
      aria-labelledby={id}
    >
      <div
        className="flex size-12 shrink-0 items-center justify-center border border-border bg-background text-primary transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-primary/6"
        aria-hidden
      >
        {icon}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="ds-text-label-sm tracking-[0.2em] text-muted-foreground">{label}</div>
        <h3 id={id} className="text-xl sm:text-2xl font-headline font-bold text-foreground leading-snug">
          {title}
        </h3>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-tighter leading-relaxed">
          {detail}
        </p>
      </div>
    </article>
  )
}

export function HomeStatsStrip() {
  return (
    <section
      className="mt-10 sm:mt-12 md:mt-14 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-5 lg:gap-6"
      aria-label="Cryptographic and privacy specifications"
    >
      <SpecCard
        id="spec-randomness-source"
        label="Randomness source"
        title="Web Crypto API"
        detail="crypto.getRandomValues — uniform indices via rejection sampling"
        icon={<Cpu className="size-7" weight="duotone" />}
      />
      <SpecCard
        id="spec-guidance-alignment"
        label="Guidance alignment"
        title="NIST SP 800-63B-style"
        detail="Long secrets, optional breach check — not a formal certification"
        icon={<Scales className="size-7" weight="duotone" />}
      />
      <SpecCard
        id="spec-breach-check"
        label="Breach check"
        title="HIBP k-anonymity"
        detail="SHA-1 hash prefix only; plaintext stays in your browser"
        icon={<MagnifyingGlass className="size-7" weight="duotone" />}
      />
    </section>
  )
}

import Link from "next/link"
import { Lock, ShieldCheck, Terminal } from "@phosphor-icons/react/dist/ssr"
import DotPattern from "@/components/ui/dot-pattern-1"

export function HomeHero() {
  return (
    <section className="relative mx-auto mb-10 max-w-7xl px-0 md:mb-16 xl:px-0">
      <div className="relative flex flex-col items-center overflow-hidden border border-border bg-background">
        <DotPattern
          width={5}
          height={5}
          className="fill-muted-foreground/12 dark:fill-muted-foreground/18 md:fill-muted-foreground/15 md:dark:fill-muted-foreground/22"
        />

        <div className="absolute -left-1.5 -top-1.5 size-3 bg-primary" aria-hidden />
        <div className="absolute -bottom-1.5 -left-1.5 size-3 bg-primary" aria-hidden />
        <div className="absolute -right-1.5 -top-1.5 size-3 bg-primary" aria-hidden />
        <div className="absolute -bottom-1.5 -right-1.5 size-3 bg-primary" aria-hidden />

        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:p-10 xl:py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary md:text-xs">
            Client-side · CSPRNG · Optional HIBP
          </p>

          <h1 className="mt-4 font-sans text-2xl uppercase tracking-tight md:mt-6 md:font-headline md:text-5xl lg:text-7xl xl:text-8xl">
            <span className="flex flex-wrap gap-x-1 gap-y-1 md:gap-x-2 lg:gap-x-3 xl:gap-x-4">
              <span className="font-extrabold text-primary md:font-black">Strong</span>
              <span className="font-semibold text-muted-foreground">passwords</span>
            </span>
            <span className="mt-1 flex flex-wrap gap-x-1 gap-y-1 md:mt-0 md:gap-x-2 lg:gap-x-3 xl:gap-x-4">
              <span className="font-semibold text-muted-foreground">from your</span>
              <span className="font-extrabold text-primary md:font-black">browser —</span>
            </span>
            <span className="mt-1 flex flex-wrap gap-x-1 gap-y-1 md:mt-0 md:gap-x-2 lg:gap-x-3 xl:gap-x-4">
              <span className="font-semibold text-muted-foreground">Nothing</span>
              <span className="font-extrabold text-primary md:font-black">uploaded</span>
              <span className="font-semibold text-muted-foreground">ever</span>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:mt-8 md:text-base">
            Secrets are generated with{" "}
            <span className="text-primary">crypto.getRandomValues</span> in your browser—no server sees them. Optional
            Have I Been Pwned lookup sends only a hash prefix (k-anonymity), never the full string. Read our{" "}
            <Link href="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">
              privacy policy
            </Link>{" "}
            for cookies, analytics, and consent.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <div className="flex w-full items-center gap-2.5 border border-border bg-card/60 px-4 py-3 sm:w-auto sm:min-w-48 sm:py-2.5 dark:bg-card/40">
              <ShieldCheck className="size-5 shrink-0 text-primary" weight="fill" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-widest text-foreground/90">
                Client-side generation
              </span>
            </div>
            <div className="flex w-full items-center gap-2.5 border border-border bg-card/60 px-4 py-3 sm:w-auto sm:min-w-48 sm:py-2.5 dark:bg-card/40">
              <Lock className="size-5 shrink-0 text-primary" weight="fill" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-widest text-foreground/90">No signup</span>
            </div>
            <div className="flex w-full items-center gap-2.5 border border-border bg-card/60 px-4 py-3 sm:w-auto sm:min-w-48 sm:py-2.5 dark:bg-card/40">
              <Terminal className="size-5 shrink-0 text-primary" weight="bold" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-widest text-foreground/90">HIBP optional</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

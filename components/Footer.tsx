import Link from "next/link"
import { Terminal, LockKey, BracketsCurly } from "@phosphor-icons/react/dist/ssr"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16 mt-auto">
      <div className="flex flex-col items-center gap-8 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex flex-wrap justify-center gap-8 sm:gap-10" aria-label="Footer">
          <Link
            href="/about"
            className="font-headline text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="font-headline text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/privacy"
            className="font-headline text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="font-headline text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms
          </Link>
        </nav>

        <div className="flex gap-6 text-muted-foreground/40" aria-hidden>
          <Terminal className="size-6" weight="regular" />
          <LockKey className="size-6" weight="fill" />
          <BracketsCurly className="size-6" weight="regular" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-headline text-[0.6875rem] uppercase tracking-[0.25em] text-muted-foreground">
            &copy; {new Date().getFullYear()} SecurePass Pro. Precision brutalism.
          </p>
          <p className="font-headline text-[0.55rem] uppercase tracking-[0.35em] text-muted-foreground/90 max-w-xl">
            Passwords and passphrases generated locally in your browser. See About for NIST-oriented context—not a
            formal certification.
          </p>
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"
import { Terminal, LockKey, BracketsCurly } from "@phosphor-icons/react/dist/ssr"

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-zinc-800 py-16 mt-auto">
      <div className="flex flex-col items-center gap-8 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex flex-wrap justify-center gap-8 sm:gap-10" aria-label="Footer">
          <Link
            href="/about"
            className="font-headline text-[0.6875rem] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50 transition-colors"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="font-headline text-[0.6875rem] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/privacy"
            className="font-headline text-[0.6875rem] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="font-headline text-[0.6875rem] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-50 transition-colors"
          >
            Terms
          </Link>
        </nav>

        <div className="flex gap-6 text-zinc-800" aria-hidden>
          <Terminal className="size-6" weight="regular" />
          <LockKey className="size-6" weight="fill" />
          <BracketsCurly className="size-6" weight="regular" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-headline text-[0.6875rem] uppercase tracking-[0.25em] text-zinc-600">
            &copy; {new Date().getFullYear()} SecurePass Pro. Precision brutalism.
          </p>
          <p className="font-headline text-[0.55rem] uppercase tracking-[0.35em] text-zinc-700 max-w-xl">
            Adhering to highest security standards. Passwords generated locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  )
}

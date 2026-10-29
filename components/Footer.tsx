import Link from "next/link"
import { InstallApp } from "@/components/InstallApp"
import { PassloreMark } from "@/components/PassloreMark"

export const REPO_URL = "https://github.com/SoubhikBiswas-gitHub/passlore"
const ISSUES_URL = `${REPO_URL}/issues`
const SECURITY_URL = `${REPO_URL}/security/advisories/new`
const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`

const linkClass =
  "flex min-h-11 items-center self-start text-[var(--on-stage)] underline decoration-current decoration-1 underline-offset-4 transition-colors duration-(--t-glide) ease-calm hover:decoration-[var(--accent-on-band)] hover:decoration-2"

const headingClass = "mb-1.5 text-sm font-semibold text-[var(--on-stage-2)]"

export function Footer() {
  return (
    <footer className="border-t border-[var(--stage-line)] bg-[var(--stage)] text-[var(--on-stage)]">
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-8 px-4 py-11 min-[720px]:px-8 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <PassloreMark size={26} className="text-[var(--accent-on-band)]" />
            <span className="font-display text-xl font-[650] tracking-[-0.025em]">passlore</span>
          </div>
          <p className="m-0 max-w-[340px] text-sm text-[var(--on-stage-2)]">
            Your next password starts in your browser. Free and open source under the MIT licence.
          </p>
          <InstallApp variant="footer" />
        </div>

        <nav aria-label="Product" className="flex flex-col text-[15px]">
          <p className={headingClass}>Product</p>
          <Link href="/" className={linkClass}>
            Generator
          </Link>
          <Link href="/how-it-works" className={linkClass}>
            How it works
          </Link>
          <Link href="/blog" className={linkClass}>
            Blog
          </Link>
        </nav>

        <nav aria-label="Legal" className="flex flex-col text-[15px]">
          <p className={headingClass}>Legal</p>
          <Link href="/privacy" className={linkClass}>
            Privacy
          </Link>
          <Link href="/terms" className={linkClass}>
            Terms
          </Link>
          <a href={LICENSE_URL} className={linkClass}>
            Licence: MIT
          </a>
        </nav>

        <nav aria-label="Open source" className="flex flex-col text-[15px]">
          <p className={headingClass}>Open source</p>
          <a href={REPO_URL} className={linkClass}>
            Source code on GitHub
          </a>
          <a href={ISSUES_URL} className={linkClass}>
            Report an issue
          </a>
          <a href={SECURITY_URL} className={linkClass}>
            Report a security problem
          </a>
        </nav>
      </div>
    </footer>
  )
}

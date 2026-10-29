import Link from "next/link"

export const REPO_URL = "https://github.com/SoubhikBiswas-gitHub/passlore"
const ISSUES_URL = `${REPO_URL}/issues`
const SECURITY_URL = `${REPO_URL}/security/advisories/new`
const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`

export function PassloreMark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.5 3H17A8.5 8.5 0 0 1 17 20H12.5V22H17.5V24.5H12.5V26H15.5V29H6.5Z M18 8.5A3 3 0 0 1 19.4 14.15L20 16.5H16L16.6 14.15A3 3 0 0 1 18 8.5Z"
      />
    </svg>
  )
}

const linkClass =
  "flex min-h-11 items-center self-start text-[var(--on-stage)] underline decoration-[var(--stage-line)] decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-[var(--accent-on-band)] hover:decoration-2"

const headingClass = "mb-1.5 text-sm font-semibold text-[var(--on-stage-2)]"

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--stage-line)] bg-[var(--stage)] text-[var(--on-stage)]">
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-8 px-4 py-11 min-[720px]:px-8 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <PassloreMark size={26} className="text-[var(--accent-on-band)]" />
            <span className="font-display text-xl font-[650] tracking-[-0.025em]">passlore</span>
          </div>
          <p className="m-0 max-w-[340px] text-sm text-[var(--on-stage-2)]">
            Your next password starts in your browser. Free and open source under the MIT licence.
          </p>
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

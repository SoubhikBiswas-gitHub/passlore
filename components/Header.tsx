"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { GithubLogo, Lightning, List, X } from "@phosphor-icons/react"
import { PassloreMark, REPO_URL } from "@/components/Footer"
import { ThemeRadioGroup, ThemeSelector } from "@/components/ThemeSelector"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Generator" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/blog", label: "Blog" },
]

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

const stageButton =
  "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[var(--stage-line)] bg-transparent text-sm font-semibold text-[var(--on-stage)] transition-colors duration-150 ease-calm hover:bg-[var(--stage-2)]"

export function Header() {
  const pathname = usePathname() ?? "/"
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(pathname)
  const reduce = useReducedMotion()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const onGenerator = pathname === "/"

  if (open && openedAt !== pathname) {
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpen(false)
      toggleRef.current?.focus()
    }
    const onResize = () => {
      if (window.matchMedia("(min-width: 720px)").matches) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
    }
  }, [open])

  const toggle = () => {
    setOpenedAt(pathname)
    setOpen((value) => !value)
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-[10px] bg-primary px-4 py-3 font-semibold text-on-primary shadow-e2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
      >
        Skip to content
      </a>
      <header className="relative z-[35] border-b border-[var(--stage-line)] bg-[var(--stage)] text-[var(--on-stage)]">
        <div className="mx-auto flex min-h-[68px] w-full max-w-[1240px] items-center justify-between gap-4 px-4 min-[720px]:px-8">
          <Link
            href="/"
            aria-label="Passlore home"
            className="flex min-h-11 items-center gap-2.5 rounded-[10px] text-[var(--on-stage)] no-underline"
          >
            <PassloreMark size={30} className="text-[var(--accent-on-band)]" />
            <span className="font-display text-2xl font-[650] tracking-[-0.025em]" aria-hidden>
              passlore
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 min-[720px]:flex">
            {NAV.map((item) => {
              const current = isCurrent(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-[10px] px-2.5 text-[15px] transition-colors duration-150",
                    current
                      ? "font-semibold text-[var(--on-stage)] underline decoration-[var(--accent-on-band)] decoration-2 underline-offset-8"
                      : "font-[550] text-[var(--on-stage-2)] no-underline hover:bg-[var(--stage-2)] hover:text-[var(--on-stage)]"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeSelector />
            <div id="header-actions" className="contents" />
            {!onGenerator && (
              <Link
                href="/"
                className="hidden min-h-11 items-center gap-2 rounded-[10px] bg-[var(--accent-on-band)] px-3 text-sm font-semibold whitespace-nowrap text-[var(--on-accent-on-band)] no-underline transition-[filter] duration-150 hover:brightness-110 min-[720px]:inline-flex"
              >
                <Lightning className="size-5" weight="fill" aria-hidden />
                Cut a password
              </Link>
            )}
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={toggle}
              className={cn(stageButton, "w-11 px-0 min-[720px]:hidden")}
            >
              {open ? <X className="size-5" weight="bold" aria-hidden /> : <List className="size-5" aria-hidden />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-line bg-surface px-4 pt-2 pb-5 text-ink shadow-e3 min-[720px]:hidden"
            >
              <nav aria-label="Main" className="flex flex-col">
                {NAV.map((item) => {
                  const current = isCurrent(pathname, item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-[52px] items-center border-b border-line text-lg text-ink no-underline",
                        current && "font-[650] underline decoration-primary decoration-2 underline-offset-8"
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <a
                  href={REPO_URL}
                  className="flex min-h-[52px] items-center gap-2 border-b border-line text-lg text-ink no-underline"
                >
                  <GithubLogo className="size-5" aria-hidden />
                  Source code
                </a>
              </nav>
              <p className="mt-3.5 mb-1 text-sm font-semibold text-ink-2">Theme</p>
              <ThemeRadioGroup />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

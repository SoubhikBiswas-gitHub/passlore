"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeSelector } from "./ThemeSelector"
import { ShareButton } from "./ShareButton"
import { Shield, List, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

type NavItem = { href: string; label: string }

const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Generator" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const prefersReduced = useReducedMotion()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0 z-10">
          <Shield className="h-[22px] w-[22px] text-primary" weight="fill" aria-hidden />
          <span className="font-headline font-bold text-sm sm:text-lg text-foreground uppercase tracking-[0.08em]">
            SecurePass Pro
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center justify-center gap-8 lg:gap-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="Main"
        >
          {MAIN_NAV.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "font-headline text-xs uppercase tracking-[0.12em] transition-colors whitespace-nowrap",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 z-10 text-muted-foreground [&_button]:text-muted-foreground [&_button:hover]:text-primary">
          <ThemeSelector />
          <ShareButton />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 text-muted-foreground hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" weight="bold" />
            ) : (
              <List className="h-5 w-5" weight="regular" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={prefersReduced ? undefined : { height: 0, opacity: 0 }}
            animate={prefersReduced ? undefined : { height: "auto", opacity: 1 }}
            exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-background border-t border-border"
          >
            <nav className="flex flex-col p-4 gap-0.5" aria-label="Mobile main">
              {MAIN_NAV.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={`m-${item.label}`}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 text-sm font-headline font-medium uppercase tracking-wide transition-colors rounded-none",
                      isActive
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

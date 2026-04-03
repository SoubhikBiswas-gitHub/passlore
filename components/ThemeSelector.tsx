"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Desktop, Book, CircleHalf, CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const themes = [
  { value: "system", label: "System", Icon: Desktop, weight: "regular" as const },
  { value: "light", label: "Light", Icon: Sun, weight: "fill" as const },
  { value: "dark", label: "Dark", Icon: Moon, weight: "fill" as const },
  { value: "sepia", label: "Sepia", Icon: Book, weight: "duotone" as const },
  { value: "high-contrast", label: "High Contrast", Icon: CircleHalf, weight: "bold" as const },
]

export function ThemeSelector() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0]
  const CurrentIcon = currentTheme.Icon

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          aria-label="Select theme"
        >
          <CurrentIcon className="h-4 w-4" weight={currentTheme.weight} />
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {open && (
          <DropdownMenuContent
            align="end"
            className="min-w-[160px]"
            asChild
            forceMount
          >
            <motion.div
              initial={prefersReduced ? undefined : { opacity: 0, scale: 0.95, y: -4 }}
              animate={prefersReduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {themes.map(({ value, label, Icon, weight }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex items-center justify-between gap-2 cursor-pointer",
                    theme === value && "bg-zinc-100 dark:bg-zinc-800"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" weight={weight} />
                    <span>{label}</span>
                  </span>
                  {theme === value && (
                    <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" weight="fill" />
                  )}
                </DropdownMenuItem>
              ))}
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  )
}

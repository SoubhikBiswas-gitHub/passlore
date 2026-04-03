"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Password,
  Rows,
  TextAa,
  SpeakerHigh,
  ListNumbers,
  Keyboard,
} from "@phosphor-icons/react"
import type { Mode } from "./PasswordGenerator"
import { cn } from "@/lib/utils"

interface ModeSelectorProps {
  mode: Mode
  onModeChange: (mode: Mode) => void
  variant?: "default" | "dashboard"
}

const modes: { value: Mode; label: string; shortLabel: string; Icon: typeof Password }[] = [
  { value: "single", label: "Single", shortLabel: "Single", Icon: Password },
  { value: "bulk", label: "Bulk", shortLabel: "Bulk", Icon: Rows },
  { value: "passphrase", label: "Passphrase", shortLabel: "Passphrase", Icon: TextAa },
  { value: "pronounceable", label: "Pronounceable", shortLabel: "Pronounce", Icon: SpeakerHigh },
  { value: "pin", label: "PIN", shortLabel: "PIN", Icon: ListNumbers },
  { value: "pattern", label: "Pattern", shortLabel: "Pattern", Icon: Keyboard },
]

const dashboardModes = modes.filter((m) => m.value !== "pattern")

export function ModeSelector({ mode, onModeChange, variant = "default" }: ModeSelectorProps) {
  if (variant === "dashboard") {
    return (
      <div className="flex flex-wrap gap-1" role="tablist" aria-label="Generator mode">
        {dashboardModes.map(({ value, shortLabel, Icon }) => {
          const isActive = mode === value
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onModeChange(value)}
              className={cn(
                "px-4 py-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-[#18181b] text-zinc-400 hover:bg-zinc-800"
              )}
            >
              <Icon size={16} weight={isActive ? "fill" : "regular"} aria-hidden />
              {shortLabel}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as Mode)}>
        <TabsList className="flex flex-wrap w-full h-auto gap-0.5 p-1 bg-surface-2 rounded-none border-0">
          {modes.map(({ value, label, Icon }) => {
            const isActive = mode === value
            return (
              <Tooltip key={value}>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={value}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium rounded-none transition-colors",
                      "data-[state=active]:shadow-none",
                      isActive
                        ? "bg-surface-0 dark:bg-surface-1 text-indigo-600 dark:text-indigo-400"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-surface-0/90 dark:hover:bg-surface-1"
                    )}
                  >
                    <Icon size={18} weight={isActive ? "fill" : "regular"} />
                    <span className="hidden sm:inline">{label}</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="sm:hidden rounded-none">
                  {label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TabsList>
      </Tabs>
    </TooltipProvider>
  )
}

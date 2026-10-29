"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { BookOpen, Check, CircleHalf, Desktop, Moon, Sun, type Icon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export type ThemeValue = "system" | "light" | "dark" | "sepia" | "hc"

export const THEME_OPTIONS: { value: ThemeValue; label: string; hint?: string; Icon: Icon }[] = [
  { value: "system", label: "Auto", hint: "Follows your device", Icon: Desktop },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "sepia", label: "Sepia", Icon: BookOpen },
  { value: "hc", label: "High contrast", Icon: CircleHalf },
]

const noopSubscribe = () => () => {}

function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
}

function useThemeChoice() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()
  const current = THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[0]
  return { mounted, current, setTheme }
}

export function ThemeSelector({ className }: { className?: string }) {
  const { mounted, current, setTheme } = useThemeChoice()
  const CurrentIcon = mounted ? current.Icon : Desktop

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        type="button"
        aria-label={mounted ? `Theme: ${current.label}` : "Theme"}
        className={cn(
          "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[var(--stage-line)] bg-transparent px-3 text-sm font-semibold text-[var(--on-stage)] transition-colors duration-150 ease-calm hover:bg-[var(--stage-2)] data-[state=open]:bg-[var(--stage-2)]",
          className
        )}
      >
        <CurrentIcon className="size-5 shrink-0" weight="regular" aria-hidden />
        <span className="hidden min-[720px]:inline" aria-hidden>
          {mounted ? current.label : ""}
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          aria-label="Theme"
          className="z-50 min-w-[232px] rounded-md border border-line bg-surface p-1.5 text-ink shadow-e2 outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-200 ease-expo [[data-theme=hc]_&]:border-2"
        >
          <DropdownMenu.RadioGroup value={current.value} onValueChange={(value) => setTheme(value)}>
            {THEME_OPTIONS.map(({ value, label, hint, Icon }) => (
              <DropdownMenu.RadioItem
                key={value}
                value={value}
                className="group flex min-h-11 w-full cursor-pointer select-none items-center gap-2.5 rounded-[10px] px-3 py-1.5 text-[15px] text-ink outline-none transition-colors duration-100 data-[highlighted]:bg-surface-2 data-[state=checked]:font-semibold focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus)]"
              >
                <Icon className="size-5 shrink-0" weight="regular" aria-hidden />
                <span className="flex flex-1 flex-col leading-tight">
                  <span>{label}</span>
                  {hint ? <span className="text-xs font-normal text-ink-3">{hint}</span> : null}
                </span>
                <DropdownMenu.ItemIndicator>
                  <Check className="size-5 text-[var(--link)]" weight="bold" aria-hidden />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export function ThemeRadioGroup({ className }: { className?: string }) {
  const { mounted, current, setTheme } = useThemeChoice()

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1
    const index = THEME_OPTIONS.findIndex((option) => option.value === current.value)
    const next = THEME_OPTIONS[(index + step + THEME_OPTIONS.length) % THEME_OPTIONS.length]
    setTheme(next.value)
    const target = event.currentTarget.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)
    target?.focus()
  }

  return (
    <div role="radiogroup" aria-label="Theme" onKeyDown={onKeyDown} className={cn("grid grid-cols-2 gap-1.5", className)}>
      {THEME_OPTIONS.map(({ value, label, Icon }) => {
        const checked = mounted && current.value === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            data-value={value}
            aria-checked={checked}
            tabIndex={checked || (!mounted && value === "system") ? 0 : -1}
            onClick={() => setTheme(value)}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] border px-3 text-left text-sm font-semibold transition-colors duration-150",
              checked
                ? "border-primary bg-primary-soft text-on-primary-soft [[data-theme=hc]_&]:border-[3px]"
                : "border-line-strong bg-surface text-ink hover:bg-surface-2"
            )}
          >
            <Icon className="size-5 shrink-0" weight="regular" aria-hidden />
            {label}
          </button>
        )
      })}
    </div>
  )
}

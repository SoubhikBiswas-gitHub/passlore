"use client"

import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TextAa, Hash, Asterisk, WarningCircle } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface CharsetTogglesProps {
  upper: boolean
  lower: boolean
  numbers: boolean
  symbols: boolean
  onUpperChange: (value: boolean) => void
  onLowerChange: (value: boolean) => void
  onNumbersChange: (value: boolean) => void
  onSymbolsChange: (value: boolean) => void
  variant?: "default" | "dashboard"
}

export function CharsetToggles({
  upper,
  lower,
  numbers,
  symbols,
  onUpperChange,
  onLowerChange,
  onNumbersChange,
  onSymbolsChange,
  variant = "default",
}: CharsetTogglesProps) {
  const activeCount = [upper, lower, numbers, symbols].filter(Boolean).length
  const isLastActive = activeCount === 1

  const charsets = [
    {
      id: "upper",
      label: "Uppercase",
      hint: "(A-Z)",
      value: upper,
      onChange: onUpperChange,
      Icon: TextAa,
    },
    {
      id: "lower",
      label: "Lowercase",
      hint: "(a-z)",
      value: lower,
      onChange: onLowerChange,
      Icon: TextAa,
    },
    {
      id: "numbers",
      label: "Numbers",
      hint: "(0-9)",
      value: numbers,
      onChange: onNumbersChange,
      Icon: Hash,
    },
    {
      id: "symbols",
      label: "Symbols",
      hint: "(!@#$%^&*)",
      value: symbols,
      onChange: onSymbolsChange,
      Icon: Asterisk,
    },
  ]

  if (variant === "dashboard") {
    return (
      <TooltipProvider>
        <div className="space-y-4">
          {isLastActive && (
            <Badge variant="destructive" className="text-[10px] uppercase tracking-wider rounded-none flex w-fit items-center gap-1">
              <WarningCircle size={12} weight="bold" />
              At least one set required
            </Badge>
          )}
          {charsets.map(({ id, label, hint, value, onChange, Icon }) => {
            const isDisabled = value && isLastActive
            return (
              <div key={id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={20} weight="regular" className="text-muted-foreground shrink-0" />
                  <span className="text-xs uppercase tracking-wider text-foreground truncate">
                    {label} {hint}
                  </span>
                </div>
                {isDisabled ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={cn(
                          "w-10 h-5 flex items-center px-0.5 shrink-0",
                          value ? "bg-primary justify-end" : "bg-muted justify-start"
                        )}
                        aria-hidden
                      >
                        <span className="w-4 h-4 bg-background block" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Cannot disable last active charset</TooltipContent>
                  </Tooltip>
                ) : (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={value}
                    disabled={isDisabled}
                    onClick={() => onChange(!value)}
                    className={cn(
                      "w-10 h-5 flex items-center px-0.5 cursor-pointer shrink-0 transition-colors",
                      value ? "bg-primary justify-end" : "bg-muted justify-start"
                    )}
                  >
                    <span className={cn("w-4 h-4 block", value ? "bg-background" : "bg-muted-foreground/50")} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Character Sets</span>
          {isLastActive && (
            <Badge variant="destructive" className="text-xs flex items-center gap-1">
              <WarningCircle size={12} weight="bold" />
              At least one required
            </Badge>
          )}
        </div>
        <div className="space-y-2">
          {charsets.map(({ id, label, hint, value, onChange, Icon }) => {
            const isDisabled = value && isLastActive

            return (
              <div
                key={id}
                className="flex items-center justify-between py-2 px-3 rounded-none bg-muted/60"
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} weight="regular" className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground">{hint}</span>
                </div>
                {isDisabled ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Switch checked={value} disabled className="data-[state=checked]:bg-primary" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Cannot disable last active charset</TooltipContent>
                  </Tooltip>
                ) : (
                  <Switch
                    checked={value}
                    onCheckedChange={onChange}
                    className="data-[state=checked]:bg-primary"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}

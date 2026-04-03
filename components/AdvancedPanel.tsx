"use client"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { CaretDown, Gear, GearSix, Info } from "@phosphor-icons/react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useId, useState } from "react"

interface IAdvancedPanelProps {
  noSimilar: boolean
  noAmbiguous: boolean
  excludeChars: string
  includeChars: string
  prefix: string
  suffix: string
  onNoSimilarChange: (value: boolean) => void
  onNoAmbiguousChange: (value: boolean) => void
  onExcludeCharsChange: (value: string) => void
  onIncludeCharsChange: (value: string) => void
  onPrefixChange: (value: string) => void
  onSuffixChange: (value: string) => void
  variant?: "default" | "dashboard"
}

export function AdvancedPanel({
  noSimilar,
  noAmbiguous,
  excludeChars,
  includeChars,
  prefix,
  suffix,
  onNoSimilarChange,
  onNoAmbiguousChange,
  onExcludeCharsChange,
  onIncludeCharsChange,
  onPrefixChange,
  onSuffixChange,
  variant = "default",
}: IAdvancedPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const prefersReduced = useReducedMotion()
  const isDashboard = variant === "dashboard"
  const baseId = useId()

  const inputClass = cn(
    "w-full min-h-11 border border-border bg-background px-3 py-2.5 font-mono text-sm text-foreground",
    "transition-[border-color,box-shadow] placeholder:text-muted-foreground",
    "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
  )

  const labelClass = cn(
    isDashboard
      ? "font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/90"
      : "text-sm font-medium text-muted-foreground"
  )

  const fieldWrap = "flex flex-col gap-2"

  const sectionTitle = (title: string, description?: string) => (
    <div className="space-y-1">
      <h3 className={cn(isDashboard ? labelClass : "text-xs font-semibold uppercase tracking-wide text-muted-foreground")}>
        {title}
      </h3>
      {description ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn(
          "w-full min-w-0",
          isOpen &&
          (isDashboard
            ? "border-2 border-primary"
            : "rounded-md border-2 border-primary/80")
        )}
      >
        <CollapsibleTrigger asChild>
          {isDashboard ? (
            <button
              type="button"
              className={cn(
                "group flex w-full min-w-0 items-center justify-between gap-4 bg-muted p-4 text-left",
                "transition-[background-color,border-color,box-shadow] hover:bg-accent-2",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "motion-reduce:transition-none sm:p-6",
                isOpen
                  ? "border-0 border-b border-border hover:border-b-border"
                  : "border border-border hover:border-primary/25"
              )}
            >
              <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                <span className="flex size-10 shrink-0 items-center justify-center border border-border bg-card/80 text-foreground transition-colors group-hover:border-primary/40 group-hover:bg-accent-2/50">
                  <Gear size={18} weight="regular" aria-hidden />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-foreground sm:tracking-[0.22em]">
                    Advanced parameters
                  </span>
                  <span className="text-[11px] leading-snug text-foreground/85 sm:text-xs">
                    Charset filters, fixed prefix/suffix, and readability options
                  </span>
                </div>
              </div>
              <CaretDown
                className={cn(
                  "size-5 shrink-0 text-foreground transition-transform motion-reduce:transition-none",
                  isOpen && "rotate-180"
                )}
                weight="bold"
                aria-hidden
              />
            </button>
          ) : (
            <Button
              variant="ghost"
              className={cn(
                "h-auto w-full justify-between gap-3 px-3 py-3 text-left hover:bg-accent-2",
                isOpen && "rounded-b-none rounded-t-md border-0 border-b border-border"
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <motion.div
                  animate={prefersReduced ? undefined : { rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-muted-foreground"
                >
                  {isOpen ? <GearSix size={18} weight="fill" aria-hidden /> : <Gear size={18} weight="regular" aria-hidden />}
                </motion.div>
                <div className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">Advanced options</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">Filters, affixes, and character rules</span>
                </div>
              </div>
              <motion.div
                animate={prefersReduced ? undefined : { rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 text-muted-foreground"
              >
                <CaretDown size={18} weight="regular" aria-hidden />
              </motion.div>
            </Button>
          )}
        </CollapsibleTrigger>
        <AnimatePresence initial={false}>
          {isOpen && (
            <CollapsibleContent forceMount asChild>
              <motion.div
                initial={prefersReduced ? undefined : { opacity: 0, height: 0 }}
                animate={prefersReduced ? undefined : { opacity: 1, height: "auto" }}
                exit={prefersReduced ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="w-full min-w-0 overflow-hidden"
              >
                <div
                  className={cn(
                    "space-y-6 pt-5",
                    isDashboard && "bg-accent-2/20 px-4 pb-6 sm:px-6"
                  )}
                >
                  <div className="space-y-4">
                    {sectionTitle(
                      "Character rules",
                      "Exclude or require specific symbols; pin a prefix or suffix to every generated secret."
                    )}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                      <div className={fieldWrap}>
                        <label htmlFor={`${baseId}-exclude`} className={labelClass}>
                          Exclude characters
                        </label>
                        <input
                          id={`${baseId}-exclude`}
                          type="text"
                          value={excludeChars}
                          onChange={(e) => onExcludeCharsChange(e.target.value)}
                          placeholder="e.g. 0O1l"
                          autoComplete="off"
                          spellCheck={false}
                          className={inputClass}
                        />
                      </div>
                      <div className={fieldWrap}>
                        <label htmlFor={`${baseId}-include`} className={labelClass}>
                          Must include
                        </label>
                        <input
                          id={`${baseId}-include`}
                          type="text"
                          value={includeChars}
                          onChange={(e) => onIncludeCharsChange(e.target.value)}
                          placeholder="e.g. #8A"
                          autoComplete="off"
                          spellCheck={false}
                          className={inputClass}
                        />
                      </div>
                      <div className={fieldWrap}>
                        <label htmlFor={`${baseId}-prefix`} className={labelClass}>
                          Prefix
                        </label>
                        <input
                          id={`${baseId}-prefix`}
                          type="text"
                          value={prefix}
                          onChange={(e) => onPrefixChange(e.target.value)}
                          placeholder="e.g. MyApp-"
                          autoComplete="off"
                          spellCheck={false}
                          className={inputClass}
                        />
                      </div>
                      <div className={fieldWrap}>
                        <label htmlFor={`${baseId}-suffix`} className={labelClass}>
                          Suffix
                        </label>
                        <input
                          id={`${baseId}-suffix`}
                          type="text"
                          value={suffix}
                          onChange={(e) => onSuffixChange(e.target.value)}
                          placeholder="e.g. -2025"
                          autoComplete="off"
                          spellCheck={false}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {sectionTitle(
                      "Readability",
                      "Reduce ambiguous or visually similar characters in the final output."
                    )}
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 sm:items-stretch">
                      <li
                        className={cn(
                          "flex h-full min-h-0 flex-col justify-between gap-3 border border-border",
                          "bg-card/70 px-4 py-3.5 transition-colors hover:bg-accent-2/70",
                          isDashboard ? "" : "rounded-none"
                        )}
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-2">
                          <div className="min-w-0 flex-1 space-y-0.5 pt-0.5">
                            <span className="text-sm font-medium text-foreground">No similar characters</span>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              Omits 0/O, 1/l/I, and pipe — fewer copy-paste mistakes.
                            </p>
                          </div>
                          <Tooltip delayDuration={220}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-none text-muted-foreground transition-colors hover:bg-accent-2 active:bg-accent-3/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label="Exact characters removed for similar-character rule"
                              >
                                <Info size={16} weight="regular" aria-hidden />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs rounded-none text-xs">
                              Removes: 0, O, 1, l, I, |
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Switch
                          checked={noSimilar}
                          onCheckedChange={onNoSimilarChange}
                          className="shrink-0 self-end data-[state=checked]:bg-primary"
                          aria-label="No similar characters"
                        />
                      </li>
                      <li
                        className={cn(
                          "flex h-full min-h-0 flex-col justify-between gap-3 border border-border",
                          "bg-card/70 px-4 py-3.5 transition-colors hover:bg-accent-2/70",
                          isDashboard ? "" : "rounded-none"
                        )}
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-2">
                          <div className="min-w-0 flex-1 space-y-0.5 pt-0.5">
                            <span className="text-sm font-medium text-foreground">No ambiguous characters</span>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              Drops brackets, quotes, slashes, and punctuation that read poorly in some fonts.
                            </p>
                          </div>
                          <Tooltip delayDuration={220}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-none text-muted-foreground transition-colors hover:bg-accent-2 active:bg-accent-3/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label="Exact characters removed for ambiguous-character rule"
                              >
                                <Info size={16} weight="regular" aria-hidden />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs rounded-none text-xs">
                              {"Removes: { } [ ] ( ) / \\ ' \" ` ~ , ; : . < >"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Switch
                          checked={noAmbiguous}
                          onCheckedChange={onNoAmbiguousChange}
                          className="shrink-0 self-end data-[state=checked]:bg-primary"
                          aria-label="No ambiguous characters"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Gear, GearSix, CaretDown, Info } from "@phosphor-icons/react"

interface AdvancedPanelProps {
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
}: AdvancedPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const prefersReduced = useReducedMotion()
  const isDashboard = variant === "dashboard"

  return (
    <TooltipProvider>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          {isDashboard ? (
            <button
              type="button"
              className="w-full p-6 flex items-center justify-between bg-zinc-900/30 hover:bg-zinc-900 transition-colors border border-zinc-800 text-left"
            >
              <div className="flex items-center gap-2">
                <Gear size={18} weight="regular" className="text-zinc-500" aria-hidden />
                <span className="text-xs uppercase tracking-widest text-zinc-200">Advanced parameters</span>
              </div>
              <CaretDown
                size={20}
                weight="regular"
                className={cn("text-zinc-500 transition-transform", isOpen && "rotate-180")}
                aria-hidden
              />
            </button>
          ) : (
            <Button variant="ghost" className="w-full justify-between px-3 py-2 h-auto">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={prefersReduced ? undefined : { rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <GearSix size={18} weight="fill" className="text-zinc-700 dark:text-zinc-300" />
                  ) : (
                    <Gear size={18} weight="regular" className="text-zinc-500 dark:text-zinc-400" />
                  )}
                </motion.div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Advanced Options
                </span>
              </div>
              <motion.div
                animate={prefersReduced ? undefined : { rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <CaretDown size={16} weight="regular" className="text-zinc-500 dark:text-zinc-400" />
              </motion.div>
            </Button>
          )}
        </CollapsibleTrigger>
        <AnimatePresence>
          {isOpen && (
            <CollapsibleContent forceMount asChild>
              <motion.div
                initial={prefersReduced ? undefined : { opacity: 0, height: 0 }}
                animate={prefersReduced ? undefined : { opacity: 1, height: "auto" }}
                exit={prefersReduced ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-700 dark:text-zinc-300">Exclude characters</label>
                      <input
                        type="text"
                        value={excludeChars}
                        onChange={(e) => onExcludeCharsChange(e.target.value)}
                        placeholder="e.g. 0O1l"
                        className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-none bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-700 dark:text-zinc-300">Must include</label>
                      <input
                        type="text"
                        value={includeChars}
                        onChange={(e) => onIncludeCharsChange(e.target.value)}
                        placeholder="e.g. #8A"
                        className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-none bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-700 dark:text-zinc-300">Prefix</label>
                      <input
                        type="text"
                        value={prefix}
                        onChange={(e) => onPrefixChange(e.target.value)}
                        placeholder="e.g. MyApp-"
                        className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-none bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-zinc-700 dark:text-zinc-300">Suffix</label>
                      <input
                        type="text"
                        value={suffix}
                        onChange={(e) => onSuffixChange(e.target.value)}
                        placeholder="e.g. -2025"
                        className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-none bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 px-3 rounded-none bg-zinc-50 dark:bg-zinc-900">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-900 dark:text-zinc-50">No similar characters</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={14} weight="regular" className="text-zinc-400" />
                          </TooltipTrigger>
                          <TooltipContent>{"Removes: 0, O, 1, l, I, |"}</TooltipContent>
                        </Tooltip>
                      </div>
                      <Switch
                        checked={noSimilar}
                        onCheckedChange={onNoSimilarChange}
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-none bg-zinc-50 dark:bg-zinc-900">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-900 dark:text-zinc-50">No ambiguous characters</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={14} weight="regular" className="text-zinc-400" />
                          </TooltipTrigger>
                          <TooltipContent>{"Removes: { } [ ] ( ) / \\ ' \" ` ~ , ; : . < >"}</TooltipContent>
                        </Tooltip>
                      </div>
                      <Switch
                        checked={noAmbiguous}
                        onCheckedChange={onNoAmbiguousChange}
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </TooltipProvider>
  )
}

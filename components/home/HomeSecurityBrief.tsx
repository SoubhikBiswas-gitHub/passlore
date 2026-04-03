"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Plus } from "@phosphor-icons/react"
import { FAQ_ITEMS } from "@/lib/faq-data"
import { cn } from "@/lib/utils"

export function HomeSecurityBrief() {
  return (
    <section className="max-w-4xl mx-auto mb-24 px-0">
      <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-[0.1em] text-zinc-50 mb-12 text-center uppercase">
        Security technical brief
      </h2>
      <Accordion type="single" collapsible className="space-y-px bg-zinc-800 border border-zinc-800">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem
            key={item.question}
            value={item.question}
            className="border-0 bg-zinc-950 data-[state=open]:bg-zinc-900"
          >
            <AccordionTrigger
              className={cn(
                "px-6 py-5 hover:no-underline text-left",
                "text-sm font-bold text-zinc-300 uppercase tracking-wide",
                "[&>svg]:hidden"
              )}
            >
              <span className="flex w-full items-center justify-between gap-4">
                {item.question}
                <Plus className="size-5 shrink-0 text-blue-500" weight="bold" aria-hidden />
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-zinc-900/50">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

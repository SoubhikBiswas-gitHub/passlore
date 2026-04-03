"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ_ITEMS } from "@/lib/faq-data"
import { cn } from "@/lib/utils"

export function HomeSecurityBrief() {
  return (
    <section className="max-w-4xl mx-auto mb-24 px-0 pt-14 sm:pt-16 md:pt-20">
      <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-[0.14em] text-foreground mb-10 sm:mb-12 text-center uppercase">
        Security <span className="text-primary">technical brief</span>
      </h2>
      <Accordion type="single" collapsible className="space-y-px bg-border border border-border">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem
            key={item.question}
            value={item.question}
            className="border-0 bg-card transition-colors data-[state=open]:bg-accent-3"
          >
            <AccordionTrigger
              className={cn(
                "items-center px-6 py-4.5 sm:py-5 hover:no-underline text-left transition-colors",
                "text-sm font-bold text-foreground uppercase tracking-wide",
                "data-[state=closed]:hover:bg-accent-2/80 data-[state=open]:bg-transparent",
                "[&>svg]:text-primary [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:translate-y-0"
              )}
            >
              <span className="flex-1 pr-4">{item.question}</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5 pt-0 text-sm text-foreground/90 leading-relaxed border-t border-border">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

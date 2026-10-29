import type { Metadata } from "next"
import { HowItWorksPage, howItWorksMetadata } from "@/components/content/HowItWorks"

export const metadata: Metadata = howItWorksMetadata

export default function AboutPage() {
  return <HowItWorksPage />
}

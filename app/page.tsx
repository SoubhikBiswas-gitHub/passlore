import { PasswordGenerator } from "@/components/PasswordGenerator"
import { HomeHero } from "@/components/home/HomeHero"
import { faqSchema, webApplicationSchema } from "@/lib/seo"
import dynamic from "next/dynamic"

/** Static import avoids Turbopack/dev SSR–client skew for `next/dynamic` (hydration class mismatches). */
const HomeStatsStrip = dynamic(
  () => import("@/components/home/HomeStatsStrip").then((m) => ({ default: m.HomeStatsStrip })),
  {
    loading: () => <div className="mt-10 min-h-48 w-full bg-muted/20" aria-hidden />,
    ssr: true,
  }
)

const HomeSecurityBrief = dynamic(
  () => import("@/components/home/HomeSecurityBrief").then((m) => ({ default: m.HomeSecurityBrief })),
  {
    loading: () => <div className="mb-24 min-h-80 w-full max-w-4xl mx-auto bg-muted/15" aria-hidden />,
    ssr: true,
  }
)

const HomeBlogDispatch = dynamic(
  () => import("@/components/home/HomeBlogDispatch").then((m) => ({ default: m.HomeBlogDispatch })),
  {
    loading: () => <div className="mb-24 min-h-96 w-full bg-muted/15" aria-hidden />,
    ssr: true,
  }
)

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="bg-background text-foreground min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
          <HomeHero />

          <section aria-labelledby="home-generator-heading">
            <h2 id="home-generator-heading" className="sr-only">
              Password generator
            </h2>
            <PasswordGenerator layout="dashboard" />
          </section>

          <HomeStatsStrip />

          <HomeSecurityBrief />

          <HomeBlogDispatch />
        </div>
      </div>
    </>
  )
}

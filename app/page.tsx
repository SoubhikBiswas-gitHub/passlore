import { PasswordGenerator } from "@/components/PasswordGenerator"
import { HomeHero } from "@/components/home/HomeHero"
import { HomeAdPlaceholder } from "@/components/home/HomeAdPlaceholder"
import { HomeStatsStrip } from "@/components/home/HomeStatsStrip"
import { HomeSecurityBrief } from "@/components/home/HomeSecurityBrief"
import { HomeBlogDispatch } from "@/components/home/HomeBlogDispatch"
import { webApplicationSchema, faqSchema } from "@/lib/seo"

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

      <div className="bg-[#0a0a0a] text-zinc-50 min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
          <HomeHero />

          <HomeAdPlaceholder format="leaderboard" />

          <PasswordGenerator layout="dashboard" />

          <HomeStatsStrip />

          <HomeAdPlaceholder format="rectangle" />

          <HomeSecurityBrief />

          <HomeBlogDispatch />
        </div>
      </div>
    </>
  )
}

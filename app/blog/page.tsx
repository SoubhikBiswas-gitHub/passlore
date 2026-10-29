import type { Metadata } from "next"
import { Lore } from "@/components/Lore"
import { BlogIndex, type BlogCard } from "@/components/blog/BlogIndex"
import { postMeta } from "@/components/blog/postMeta"
import { eyebrow, h1Hero, lede, wrap } from "@/components/content/styles"
import { blogPosts, formatReadableDate } from "@/lib/blogPosts"
import { cn } from "@/lib/utils"
import { blogMetadata, getBreadcrumbSchema, SITE_URL } from "@/lib/seo"

export const metadata: Metadata = blogMetadata

export default function BlogPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ])

  const posts: BlogCard[] = blogPosts.map((p) => {
    const m = postMeta(p.slug)
    return {
      slug: p.slug,
      title: p.title,
      description: p.description,
      readingTime: p.readingTime,
      date: formatReadableDate(p.datePublished),
      category: m.category,
      recipe: m.recipe,
      motif: m.motif,
      featured: !!m.featured,
      tickets: m.tickets,
    }
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className={`${wrap} pb-24`}>
        <BlogIndex
          posts={posts}
          hero={
            <>
              <div className="absolute bottom-5 right-0 hidden leading-none lg:block" aria-hidden>
                <Lore mood="wink" scene="sparkles" size={230} />
              </div>
              <p className={eyebrow}>Blog</p>
              <h1 id="bl-h" className={cn(h1Hero, "md:text-[72px]")}>
                Notes on passwords
              </h1>
              <p className={lede}>
                Plain explanations of strength, passphrases, managers and the standards behind them. Every article ends
                with a recipe you can use straight away.
              </p>
            </>
          }
        />
      </div>
    </>
  )
}

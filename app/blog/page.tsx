import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { blogPosts } from "@/lib/blogPosts"
import { BlogNewsletter } from "@/components/blog/BlogNewsletter"
import {
  FileText,
  ChartBar,
  ArrowsLeftRight,
  Code,
  ListBullets,
  ArrowRight,
  User,
} from "@phosphor-icons/react/dist/ssr"
import { blogMetadata, getBreadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = blogMetadata

const secondaryIcons = [ChartBar, ArrowsLeftRight, Code, ListBullets] as const

export default function BlogPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://securepass.pro" },
    { name: "Blog", url: "https://securepass.pro/blog" },
  ])

  const [featured, ...rest] = blogPosts

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#0a0a0a] text-zinc-50 min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-8">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-zinc-50 tracking-tight mb-4">
            Security{" "}
            <span className="relative inline-block">
              <span className="relative z-10">insights</span>
              <span className="absolute left-0 right-0 bottom-0 h-1 bg-blue-600" aria-hidden />
            </span>{" "}
            &amp; best practices
          </h1>
          <p className="text-zinc-400 max-w-2xl text-sm sm:text-base leading-relaxed">
            Deep dives on password entropy, breach resilience, and the standards that keep credentials safe in
            hostile environments.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
            <Link
              href={`/blog/${featured.slug}`}
              className="md:col-span-2 group flex flex-col bg-[#18181b] hover:bg-zinc-900 transition-colors"
            >
              {featured.coverImage && (
                <div className="relative aspect-[2/1] border-b border-zinc-800 overflow-hidden shrink-0">
                  <Image
                    src={featured.coverImage}
                    alt={`Cover: ${featured.title}`}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale group-hover:grayscale-[0.4]"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
              )}
              <div className="p-6 sm:p-10 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-blue-500 mb-4">
                  <FileText className="size-5" weight="bold" aria-hidden />
                </div>
                <p className="text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-headline mb-3">
                  {featured.dispatchTag ?? "Article"}
                </p>
                <h2 className="font-headline text-2xl sm:text-3xl font-bold text-zinc-50 mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                  {featured.title}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8 line-clamp-3 flex-1">{featured.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <User className="size-4" weight="regular" aria-hidden />
                    <span className="font-mono uppercase tracking-wider">{featured.author}</span>
                    <span className="text-zinc-600">·</span>
                    <time dateTime={featured.datePublished}>{featured.datePublished}</time>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-headline font-bold uppercase tracking-widest text-blue-500 group-hover:gap-2 transition-all">
                    Read more
                    <ArrowRight className="size-4" weight="bold" />
                  </span>
                </div>
              </div>
            </Link>

            <div className="md:col-span-1 flex flex-col gap-px bg-zinc-800">
              {rest.slice(0, 4).map((post, i) => {
                const Icon = secondaryIcons[i] ?? FileText
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex-1 min-h-0 bg-[#18181b] p-6 hover:bg-zinc-900 transition-colors flex flex-col border-b border-zinc-800 last:border-b-0 md:border-b-0"
                  >
                    <Icon className="size-5 text-blue-500 mb-3" weight="bold" aria-hidden />
                    <h3 className="font-headline text-base font-bold text-zinc-50 mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 flex-1 mb-4">{post.description}</p>
                    <div className="flex items-center justify-between text-[0.625rem] uppercase tracking-wider text-zinc-600 font-mono mt-auto">
                      <span>{post.datePublished}</span>
                      <ArrowRight className="size-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <BlogNewsletter />
      </div>
    </>
  )
}

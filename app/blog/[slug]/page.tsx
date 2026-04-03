import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { blogPosts, type BlogPost, type ContentSection } from "@/lib/blogPosts"
import {
  ArrowLeft,
  ArrowRight,
  CalendarBlank,
  Clock,
  FileText,
  Plus,
  User,
} from "@phosphor-icons/react/dist/ssr"
import { getBlogPostSchema, getBreadcrumbSchema } from "@/lib/seo"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return {
      title: "Post Not Found — SecurePass Pro",
    }
  }

  const site = "https://securepass.pro"
  const ogImage = post.coverImage ? [{ url: `${site}${post.coverImage}`, alt: post.title }] : undefined

  return {
    title: `${post.title} — SecurePass Pro`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.datePublished,
      authors: [post.author],
      url: `${site}/blog/${post.slug}`,
      ...(ogImage && { images: ogImage }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(post.coverImage && { images: [`https://securepass.pro${post.coverImage}`] }),
    },
    alternates: {
      canonical: `https://securepass.pro/blog/${post.slug}`,
    },
  }
}

function buildTocFromPost(post: BlogPost): { id: string; label: string }[] {
  return post.content.reduce<{ id: string; label: string }[]>((acc, section, index) => {
    if (section.type === "heading" && section.text?.trim()) {
      acc.push({ id: `section-${index}`, label: section.text.trim() })
    }
    return acc
  }, [])
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const postIndex = blogPosts.findIndex((p) => p.slug === slug)
  const post = blogPosts[postIndex]

  if (!post) {
    notFound()
  }

  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null
  const toc = buildTocFromPost(post)
  const firstHeadingIndex = post.content.findIndex((s) => s.type === "heading")

  const articleSchema = getBlogPostSchema({
    title: post.title,
    description: post.description,
    slug: post.slug,
    author: post.author,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    keywords: post.keywords || [],
  })

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://securepass.pro" },
    { name: "Blog", url: "https://securepass.pro/blog" },
    { name: post.title, url: `https://securepass.pro/blog/${post.slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#0a0a0a] text-zinc-50 min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
            <aside className="lg:col-span-3 mb-12 lg:mb-0 lg:sticky lg:top-24 space-y-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-headline uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="size-4" weight="bold" aria-hidden />
                Back to blog
              </Link>

              <div>
                <p className="text-[0.6875rem] uppercase tracking-widest text-blue-500 font-headline font-bold mb-2 flex items-center gap-2">
                  <FileText className="size-4" weight="bold" aria-hidden />
                  {post.dispatchTag ?? "Article"}
                </p>
                <p className="text-xs text-zinc-500 leading-snug line-clamp-3">{post.title}</p>
              </div>

              {toc.length > 0 && (
                <nav aria-label="On this page">
                  <p className="text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-headline font-bold mb-4">
                    On this page
                  </p>
                  <ul className="space-y-2">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-sm text-zinc-400 hover:text-blue-400 transition-colors font-mono leading-snug"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div className="p-4 bg-[#18181b] border border-zinc-800 space-y-2 font-mono text-[11px] text-emerald-400 leading-relaxed">
                <p className="uppercase tracking-wide">Format: long-form guide</p>
                <p className="uppercase tracking-wide">Updated: {post.dateModified ?? post.datePublished}</p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-headline uppercase tracking-widest text-blue-500 hover:text-blue-400"
              >
                <Plus className="size-4" weight="bold" aria-hidden />
                Try our free password generator
              </Link>
            </aside>

            <article className="lg:col-span-9">
              <header className="mb-10">
                <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zinc-50 mb-6 text-balance">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-mono mb-6">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarBlank className="size-3.5" weight="regular" aria-hidden />
                    {post.datePublished}
                  </span>
                  <span className="text-zinc-700" aria-hidden>
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" weight="regular" aria-hidden />
                    {post.readingTime}
                  </span>
                  <span className="text-zinc-700" aria-hidden>
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-zinc-400">
                    <User className="size-3.5" weight="regular" aria-hidden />
                    {post.author}
                  </span>
                </div>

                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-3xl mb-10">
                  {post.description}
                </p>

                {post.coverImage && (
                  <div className="relative aspect-[21/9] w-full border border-zinc-800 overflow-hidden bg-zinc-900">
                    <Image
                      src={post.coverImage}
                      alt={`Illustration for ${post.title}`}
                      fill
                      className="object-cover opacity-80 grayscale-[0.35] hover:grayscale-[0.15] transition-all duration-500"
                      sizes="(max-width: 1024px) 100vw, 75vw"
                      priority
                    />
                    <div
                      className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-transparent"
                      aria-hidden
                    />
                  </div>
                )}
              </header>

              <div className="space-y-0 max-w-3xl">
                <BlogContent post={post} firstHeadingIndex={firstHeadingIndex} />
              </div>

              {post.keywords && post.keywords.length > 0 && (
                <div className="mt-12 pt-10 border-t border-zinc-800 max-w-3xl">
                  <p className="text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-headline font-bold mb-4">
                    Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.keywords.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1.5 bg-[#18181b] border border-zinc-800 text-zinc-400 text-[0.6875rem] uppercase tracking-widest font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <nav
                className="mt-12 max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800"
                aria-label="Previous and next articles"
              >
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group p-6 bg-[#18181b] hover:bg-zinc-900 transition-colors flex flex-col min-h-[7rem]"
                  >
                    <span className="text-[0.625rem] uppercase tracking-wider text-zinc-500 font-mono flex items-center gap-1 mb-2">
                      <ArrowLeft className="size-3.5" weight="bold" aria-hidden />
                      Previous
                    </span>
                    <span className="font-headline text-sm font-bold text-zinc-50 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mt-auto">
                      {prevPost.title}
                    </span>
                  </Link>
                ) : (
                  <div className="bg-[#18181b] min-h-[7rem] hidden sm:block" aria-hidden />
                )}
                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group p-6 bg-[#18181b] hover:bg-zinc-900 transition-colors flex flex-col min-h-[7rem] sm:text-right"
                  >
                    <span className="text-[0.625rem] uppercase tracking-wider text-zinc-500 font-mono flex items-center gap-1 mb-2 sm:justify-end">
                      Next
                      <ArrowRight className="size-3.5" weight="bold" aria-hidden />
                    </span>
                    <span className="font-headline text-sm font-bold text-zinc-50 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mt-auto">
                      {nextPost.title}
                    </span>
                  </Link>
                ) : (
                  <div className="bg-[#18181b] min-h-[7rem] hidden sm:block" aria-hidden />
                )}
              </nav>
            </article>
          </div>
        </div>

        <section className="bg-violet-600 border-t border-violet-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <p className="font-headline text-lg sm:text-xl font-bold text-white uppercase tracking-[0.08em] max-w-xl leading-snug">
              More guides on entropy, passphrases, and zero-knowledge checks — all in one place.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-zinc-950 font-headline text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors shrink-0"
            >
              View all posts
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

function sectionKey(section: ContentSection, index: number): string {
  const head = section.text?.slice(0, 48) ?? section.items?.[0]?.slice(0, 24) ?? ""
  return `${section.type}-${index}-${head}`
}

function BlogContent({ post, firstHeadingIndex }: { post: BlogPost; firstHeadingIndex: number }) {
  return (
    <>
      {post.content.map((section, index) => (
        <div key={sectionKey(section, index)}>
          {section.type === "heading" && (
            <h2
              id={`section-${index}`}
              className={`scroll-mt-28 font-headline text-sm font-bold uppercase tracking-[0.14em] text-zinc-200 mb-4 ${
                index !== firstHeadingIndex ? "mt-12 pt-10 border-t border-zinc-800" : ""
              }`}
            >
              {section.text}
            </h2>
          )}
          {section.type === "paragraph" && (
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">{section.text}</p>
          )}
          {section.type === "list" && (
            <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-400 leading-relaxed mb-6">
              {section.items?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.type === "code" && (
            <pre className="bg-[#18181b] border border-zinc-800 p-4 overflow-x-auto text-xs font-mono text-zinc-300 mb-6">
              <code>{section.text}</code>
            </pre>
          )}
          {section.type === "quote" && (
            <blockquote className="border-l-4 border-violet-500 pl-4 py-3 mb-6 bg-[#18181b]/80 text-sm text-zinc-400 italic leading-relaxed">
              {section.text}
            </blockquote>
          )}
        </div>
      ))}
    </>
  )
}

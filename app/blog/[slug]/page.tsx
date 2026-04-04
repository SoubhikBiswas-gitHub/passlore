import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { blogPosts, formatBlogDate, type BlogPost, type ContentSection } from "@/lib/blogPosts"
import {
  ArrowLeft,
  ArrowRight,
  CalendarBlank,
  Clock,
  FileText,
  Key,
  User,
} from "@phosphor-icons/react/dist/ssr"
import { TocScrollNav } from "@/components/TocScrollNav"
import { getBlogPostSchema, getBreadcrumbSchema, SITE_NAME, SITE_URL } from "@/lib/seo"

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
      title: `Post Not Found — ${SITE_NAME}`,
    }
  }

  const ogImage = post.coverImage
    ? [{ url: `${SITE_URL}${post.coverImage}`, alt: post.title }]
    : undefined
  const publishedTime = `${post.datePublished}T12:00:00.000Z`
  const modifiedTime = `${(post.dateModified ?? post.datePublished)}T12:00:00.000Z`

  return {
    title: `${post.title} — ${SITE_NAME}`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: [post.author],
      url: `${SITE_URL}/blog/${post.slug}`,
      ...(ogImage && { images: ogImage }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(post.coverImage && { images: [`${SITE_URL}${post.coverImage}`] }),
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
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
    coverImage: post.coverImage,
  })

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
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

      <div className="bg-background text-foreground min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
            <aside className="lg:col-span-3 mb-12 lg:mb-0 lg:sticky lg:top-24 space-y-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-headline uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="size-4" weight="bold" aria-hidden />
                Back to blog
              </Link>

              <div>
                <p className="text-[0.6875rem] uppercase tracking-widest text-primary font-headline font-bold mb-2 flex items-center gap-2">
                  <FileText className="size-4" weight="bold" aria-hidden />
                  {post.dispatchTag ?? "Article"}
                </p>
                <p className="text-xs text-muted-foreground leading-snug line-clamp-3">{post.title}</p>
              </div>

              {toc.length > 0 && <TocScrollNav items={toc} />}

              <div className="p-4 bg-card border border-border space-y-2 font-mono text-[11px] text-secure-fg leading-relaxed">
                <p className="uppercase tracking-wide">Format: long-form guide</p>
                <p className="uppercase tracking-wide">
                  Updated: {formatBlogDate(post.dateModified ?? post.datePublished)}
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-headline uppercase tracking-widest text-primary hover:text-primary/90"
              >
                <Key className="size-4" weight="bold" aria-hidden />
                Try our free password generator
              </Link>
            </aside>

            <article className="lg:col-span-9">
              <header className="mb-10">
                <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-foreground mb-6 text-balance">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.6875rem] uppercase tracking-widest text-muted-foreground font-mono mb-6">
                  <time
                    dateTime={post.datePublished}
                    className="inline-flex items-center gap-1.5"
                  >
                    <CalendarBlank className="size-3.5" weight="regular" aria-hidden />
                    {formatBlogDate(post.datePublished)}
                  </time>
                  <span className="text-muted-foreground/60" aria-hidden>
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" weight="regular" aria-hidden />
                    {post.readingTime}
                  </span>
                  <span className="text-muted-foreground/60" aria-hidden>
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <User className="size-3.5" weight="regular" aria-hidden />
                    {post.author}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl mb-10">
                  {post.description}
                </p>

                {post.coverImage && (
                  <div className="relative aspect-[21/9] w-full border border-border overflow-hidden bg-accent-2/35">
                    <Image
                      src={post.coverImage}
                      alt={`Illustration for ${post.title}`}
                      fill
                      className="object-cover opacity-80 grayscale-[0.35] hover:grayscale-[0.15] transition-all duration-500"
                      sizes="(max-width: 1024px) 100vw, 75vw"
                      priority
                    />
                    <div
                      className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/90 via-transparent to-transparent"
                      aria-hidden
                    />
                  </div>
                )}
              </header>

              <div className="space-y-0 max-w-3xl">
                <BlogContent post={post} firstHeadingIndex={firstHeadingIndex} />
              </div>

              {post.keywords && post.keywords.length > 0 && (
                <div className="mt-12 pt-10 border-t border-border max-w-3xl">
                  <p className="text-[0.6875rem] uppercase tracking-widest text-muted-foreground font-headline font-bold mb-4">
                    Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.keywords.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1.5 bg-card border border-border text-muted-foreground text-[0.6875rem] uppercase tracking-widest font-mono transition-colors hover:border-primary/25 hover:bg-accent-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <nav
                className="mt-12 max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border"
                aria-label="Previous and next articles"
              >
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group p-6 bg-card hover:bg-accent-2 active:bg-accent-3/70 transition-colors duration-150 flex flex-col min-h-[7rem]"
                  >
                    <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1 mb-2">
                      <ArrowLeft className="size-3.5" weight="bold" aria-hidden />
                      Previous
                    </span>
                    <span className="font-headline text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mt-auto">
                      {prevPost.title}
                    </span>
                  </Link>
                ) : (
                  <div className="bg-card min-h-[7rem] hidden sm:block" aria-hidden />
                )}
                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group p-6 bg-card hover:bg-accent-2 active:bg-accent-3/70 transition-colors duration-150 flex flex-col min-h-[7rem] sm:text-right"
                  >
                    <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1 mb-2 sm:justify-end">
                      Next
                      <ArrowRight className="size-3.5" weight="bold" aria-hidden />
                    </span>
                    <span className="font-headline text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mt-auto">
                      {nextPost.title}
                    </span>
                  </Link>
                ) : (
                  <div className="bg-card min-h-[7rem] hidden sm:block" aria-hidden />
                )}
              </nav>
            </article>
          </div>
        </div>

        <section className="bg-primary border-t border-primary/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <p className="font-headline text-lg sm:text-xl font-bold text-primary-foreground uppercase tracking-[0.08em] max-w-xl leading-snug">
              More guides on entropy, passphrases, and zero-knowledge checks — all in one place.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-headline text-xs font-bold uppercase tracking-widest hover:bg-accent-2 active:bg-accent-3 border border-foreground/15 transition-colors duration-150 shrink-0"
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
              className={`scroll-mt-28 font-headline text-sm font-bold uppercase tracking-[0.14em] text-foreground mb-4 ${
                index !== firstHeadingIndex ? "mt-12 pt-10 border-t border-border" : ""
              }`}
            >
              {section.text}
            </h2>
          )}
          {section.type === "paragraph" && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{section.text}</p>
          )}
          {section.type === "list" && (
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground leading-relaxed mb-6">
              {section.items?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.type === "code" && (
            <pre className="bg-card border border-border p-4 overflow-x-auto text-xs font-mono text-foreground/90 mb-6">
              <code>{section.text}</code>
            </pre>
          )}
          {section.type === "quote" && (
            <blockquote className="border-l-4 border-primary pl-4 py-3 mb-6 bg-card/80 text-sm text-muted-foreground italic leading-relaxed">
              {section.text}
            </blockquote>
          )}
        </div>
      ))}
    </>
  )
}

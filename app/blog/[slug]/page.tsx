import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Lightbulb } from "@phosphor-icons/react/dist/ssr"
import { ArticleActions } from "@/components/blog/ArticleActions"
import { ArticleCompare } from "@/components/blog/ArticleCompare"
import { postMeta } from "@/components/blog/postMeta"
import { TocMobile, TocSide } from "@/components/content/Toc"
import { btn, card, forTag, prose, tinyTicket, wrap } from "@/components/content/styles"
import { blogPosts, formatReadableDate, type BlogPost, type ContentSection } from "@/lib/blogPosts"
import { getBlogPostSchema, getBreadcrumbSchema, SITE_NAME, SITE_URL } from "@/lib/seo"

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return { title: `Post Not Found — ${SITE_NAME}` }
  }

  const ogImage = post.coverImage ? [{ url: `${SITE_URL}${post.coverImage}`, alt: post.title }] : undefined
  const publishedTime = `${post.datePublished}T12:00:00.000Z`
  const modifiedTime = `${post.dateModified ?? post.datePublished}T12:00:00.000Z`

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
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
  }
}

const headingId = (index: number) => `section-${index}`

function buildToc(post: BlogPost) {
  return post.content.flatMap((s, i) =>
    s.type === "heading" && s.text?.trim() ? [{ id: headingId(i), label: s.text.trim() }] : [],
  )
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const index = blogPosts.findIndex((p) => p.slug === slug)
  const post = blogPosts[index]
  if (!post) notFound()

  const meta = postMeta(post.slug)
  const prev = index > 0 ? blogPosts[index - 1] : null
  const next = index < blogPosts.length - 1 ? blogPosts[index + 1] : null
  const toc = buildToc(post)
  const url = `${SITE_URL}/blog/${post.slug}`
  const updated = post.dateModified && post.dateModified !== post.datePublished ? post.dateModified : null

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
    { name: post.title, url },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article>
        <header className="bg-bg text-ink">
          <div
            className={`${wrap} grid grid-cols-1 items-center gap-12 py-8 md:pb-14 md:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]`}
          >
            <div className="flex flex-col gap-4">
              <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
                <Link href="/blog" className="text-ink underline underline-offset-[3px] hover:decoration-2">
                  Blog
                </Link>{" "}
                / {meta.category}
              </nav>
              <h1 className="m-0 font-display text-[36px] font-extrabold leading-[1.02] tracking-[-0.04em] text-balance md:text-[60px]">
                {post.title}
              </h1>
              <p className="m-0 max-w-[640px] text-lg text-ink-2 md:text-xl">{post.description}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-sm text-ink-2">
                  By {post.author} · <time dateTime={post.datePublished}>{formatReadableDate(post.datePublished)}</time>{" "}
                  · {post.readingTime}
                  {updated ? (
                    <>
                      {" "}
                      · Updated <time dateTime={updated}>{formatReadableDate(updated)}</time>
                    </>
                  ) : null}
                </span>
                <span className="flex-1" />
                <ArticleActions title={post.title} url={url} />
              </div>
            </div>
            <div aria-hidden className="hidden flex-col gap-[18px] lg:flex">
              {meta.tickets.map((t, i) => (
                <span key={t.tag} className={`${tinyTicket} ${i % 2 ? "ml-10 rotate-2" : "-rotate-3"}`}>
                  <span className={forTag}>{t.tag}</span>
                  <span className="font-mono text-2xl leading-[1.3] [overflow-wrap:anywhere]">{t.value}</span>
                  <span className="text-[13px] text-ink-3">{t.note}</span>
                </span>
              ))}
            </div>
          </div>
        </header>

        {toc.length > 0 && <TocMobile items={toc} />}

        <div className={`${wrap} grid grid-cols-1 gap-14 pb-24 pt-10 lg:grid-cols-[minmax(0,1fr)_260px]`}>
          <div className={`${prose} max-w-[760px]`}>
            <BlogContent post={post} compareBefore={meta.compareBefore} />

            <div className={`${card} mt-10 flex flex-wrap items-center justify-between gap-4 p-6`}>
              <div className="flex flex-col gap-1">
                <p className="!m-0 font-display text-2xl font-bold tracking-[-0.02em]">{meta.tryTitle}</p>
                <p className="!m-0 text-sm text-ink-3">{meta.tryLine}</p>
              </div>
              <Link href={meta.recipeHref} className={`${btn.primary} !text-on-primary !no-underline`}>
                {meta.tryCta}
              </Link>
            </div>

            <nav aria-label="More articles" className="mt-10 grid grid-cols-1 gap-3 text-base sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className={`${card} flex min-h-24 flex-col gap-1 p-5 !text-ink !no-underline transition-shadow duration-200 ease-calm hover:shadow-e2`}
                >
                  <span className="inline-flex items-center gap-1 text-[13px] text-ink-3">
                    <ArrowLeft className="size-4" aria-hidden />
                    Previous
                  </span>
                  <span className="font-semibold leading-snug">{prev.title}</span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className={`${card} flex min-h-24 flex-col gap-1 p-5 !text-ink !no-underline transition-shadow duration-200 ease-calm hover:shadow-e2 sm:items-end sm:text-right`}
                >
                  <span className="inline-flex items-center gap-1 text-[13px] text-ink-3">
                    Next
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                  <span className="font-semibold leading-snug">{next.title}</span>
                </Link>
              ) : null}
            </nav>
          </div>
          {toc.length > 0 && <TocSide items={toc} className="pt-12" />}
        </div>
      </article>
    </>
  )
}

function sectionKey(section: ContentSection, index: number): string {
  const head = section.text?.slice(0, 48) ?? section.items?.[0]?.slice(0, 24) ?? ""
  return `${section.type}-${index}-${head}`
}

function BlogContent({ post, compareBefore }: { post: BlogPost; compareBefore?: string }) {
  return (
    <>
      {post.content.map((section, index) => (
        <div key={sectionKey(section, index)} className="contents">
          {compareBefore && section.type === "heading" && section.text === compareBefore ? <ArticleCompare /> : null}
          {section.type === "heading" && <h2 id={headingId(index)}>{section.text}</h2>}
          {section.type === "paragraph" && <p>{section.text}</p>}
          {section.type === "list" && (
            <ul>
              {section.items?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.type === "code" && (
            <pre>
              <code>{section.text}</code>
            </pre>
          )}
          {section.type === "quote" && (
            <blockquote className="my-2 mb-4 flex gap-3 rounded-md bg-lore-soft px-5 py-[18px]">
              <Lightbulb className="mt-1 size-6 shrink-0 text-link" aria-hidden />
              <p className="!m-0">{section.text}</p>
            </blockquote>
          )}
        </div>
      ))}
    </>
  )
}

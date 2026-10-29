import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Info, Lightbulb, Warning } from "@phosphor-icons/react/dist/ssr"
import { ArticleActions } from "@/components/blog/ArticleActions"
import { ArticleCompare } from "@/components/blog/ArticleCompare"
import { postMeta } from "@/components/blog/postMeta"
import { TocMobile, TocSide } from "@/components/content/Toc"
import { btn, card, forTag, prose, tinyTicket, wrap } from "@/components/content/styles"
import { blogPosts, formatReadableDate, type BlogPost, type ContentSection } from "@/lib/blogPosts"
import { cn } from "@/lib/utils"
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

  const ogImage = `${SITE_URL}/blog/${post.slug}/opengraph-image`
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
  }
}

const headingId = (section: ContentSection, index: number) => section.id ?? `section-${index}`

function buildToc(post: BlogPost) {
  return post.content.flatMap((s, i) =>
    s.type === "heading" && s.text?.trim() ? [{ id: headingId(s, i), label: s.toc ?? s.text.trim() }] : [],
  )
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const meta = postMeta(post.slug)
  const toc = buildToc(post)
  const url = `${SITE_URL}/blog/${post.slug}`

  const articleSchema = getBlogPostSchema({
    title: post.title,
    description: post.description,
    slug: post.slug,
    author: post.author,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    keywords: post.keywords || [],
    coverImage: `/blog/${post.slug}/opengraph-image`,
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
              <h1 className="m-0 font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.04em] text-balance md:text-[60px]">
                {post.title}
              </h1>
              <p className="m-0 max-w-[640px] text-xl text-ink-2">{post.intro ?? post.description}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-sm text-ink-2">
                  By {post.author} · <time dateTime={post.datePublished}>{formatReadableDate(post.datePublished)}</time>{" "}
                  · {post.readingTime}
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

            <div className={cn(card, "mt-10 flex flex-wrap items-center justify-between gap-4 p-6")}>
              <div className="flex flex-col gap-1">
                <p className="!m-0 font-display text-2xl font-bold tracking-[-0.02em]">{meta.tryTitle}</p>
                <p className="!m-0 text-sm text-ink-3">{meta.tryLine}</p>
              </div>
              <Link href={meta.recipeHref} className={cn(btn.primary, "!text-on-primary !no-underline")}>
                {meta.tryCta}
              </Link>
            </div>
          </div>
          {toc.length > 0 && <TocSide items={toc} className="pt-12" />}
        </div>
      </article>
    </>
  )
}

function sectionKey(section: ContentSection, index: number): string {
  const head = section.text?.slice(0, 48) ?? section.items?.[0]?.slice(0, 24) ?? section.questions?.[0]?.q ?? ""
  return `${section.type}-${index}-${head}`
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>
        if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>
        return part
      })}
    </>
  )
}

const callout = {
  info: { Icon: Info, box: "bg-lore-soft", icon: "text-link" },
  warning: { Icon: Warning, box: "bg-warning-soft", icon: "text-warning" },
} as const

function Callout({ section }: { section: ContentSection }) {
  const c = callout[section.tone ?? "info"]
  return (
    <div role="note" className={cn("my-2 mb-4 flex gap-3 rounded-md px-5 py-[18px]", c.box)}>
      <c.Icon className={cn("mt-[3px] size-6 shrink-0", c.icon)} aria-hidden />
      <p className="!m-0">
        {section.title ? <strong>{section.title}</strong> : null} <Inline text={section.text ?? ""} />
      </p>
    </div>
  )
}

function BlogContent({ post, compareBefore }: { post: BlogPost; compareBefore?: string }) {
  return (
    <>
      {post.content.map((section, index) => (
        <div key={sectionKey(section, index)} className="contents">
          {compareBefore && section.type === "heading" && section.text === compareBefore ? <ArticleCompare /> : null}
          {section.type === "heading" && <h2 id={headingId(section, index)}>{section.text}</h2>}
          {section.type === "paragraph" && (
            <p>
              <Inline text={section.text ?? ""} />
            </p>
          )}
          {section.type === "list" && (
            <ul>
              {section.items?.map((item) => (
                <li key={item}>
                  <Inline text={item} />
                </li>
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
          {section.type === "callout" && <Callout section={section} />}
          {section.type === "questions" &&
            section.questions?.map(({ q, a }) => (
              <div key={q} className="contents">
                <h3>{q}</h3>
                <p>
                  <Inline text={a} />
                </p>
              </div>
            ))}
        </div>
      ))}
    </>
  )
}

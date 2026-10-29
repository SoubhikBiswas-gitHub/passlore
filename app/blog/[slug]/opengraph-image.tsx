import { postMeta } from "@/components/blog/postMeta"
import { blogPosts } from "@/lib/blogPosts"
import { DISPLAY, MONO, OG_COLORS, UI, loadOgFonts, markSrc } from "@/lib/og-image-theme"
import { ImageResponse } from "next/og"

export const alt = "A Passlore blog article"

export const size = { width: 1200, height: 630 }

export const contentType = "image/png"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

// keep each sample short enough to sit on one line in the cover panel
function chip(value: string): string {
  if (value.includes(" ")) return value.split(" ").slice(0, 3).join("-")
  return value.length > 14 ? value.slice(0, 12) : value
}

export default async function ArticleImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  const meta = postMeta(slug)
  const title = post?.title ?? "Notes on passwords"
  const line = `${meta.category} · ${post?.readingTime ?? ""}`.replace(/ · $/, "")
  const chips = meta.tickets.slice(0, 2).map((t) => chip(t.value))
  const fonts = await loadOgFonts({ display: "passlore · Blog" + title, ui: line, mono: chips.join("") })
  const { white, blue, blueDeep, ink, line: border, text2 } = OG_COLORS

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: white, border: `2px solid ${border}`, fontFamily: UI }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 48px 64px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={markSrc(blue)} width={40} height={40} alt="" />
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 32, letterSpacing: "-0.02em", color: ink }}>passlore · Blog</span>
          </div>
          <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: title.length > 48 ? 60 : 72, lineHeight: 1.04, letterSpacing: "-0.03em", color: ink }}>
            {title}
          </p>
          <p style={{ margin: 0, fontSize: 28, color: text2 }}>{line}</p>
        </div>
        <div style={{ width: 460, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, padding: 48, background: blue }}>
          {chips.map((c) => (
            <span key={c} style={{ alignSelf: "flex-start", fontFamily: MONO, fontSize: 30, color: white, background: blueDeep, borderRadius: 12, padding: "12px 20px" }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}

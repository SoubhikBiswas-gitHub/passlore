import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { blogPosts } from "@/lib/blogPosts"

export function HomeBlogDispatch() {
  const posts = blogPosts.slice(0, 3)

  return (
    <section className="mb-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <h2 className="text-xl sm:text-2xl font-headline font-bold text-foreground uppercase tracking-widest">
          Security <span className="text-primary">dispatch</span>
        </h2>
        <Link
          href="/blog"
          className="text-xs font-mono text-primary hover:text-primary/90 tracking-widest uppercase border-b border-primary/30 pb-1 w-fit inline-flex items-center gap-1"
        >
          View all articles
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <div className="aspect-video bg-accent-2/40 mb-6 relative overflow-hidden border border-border">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={`Cover: ${post.title}`}
                  fill
                  className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500 grayscale group-hover:grayscale-[0.3]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-background" aria-hidden />
              )}
              {post.dispatchTag && (
                <div className="absolute top-4 left-4 bg-primary px-2 py-1 text-[10px] font-mono text-primary-foreground font-bold tracking-widest uppercase">
                  {post.dispatchTag}
                </div>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-headline font-bold text-foreground mb-3 group-hover:text-primary transition-colors uppercase tracking-wide line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

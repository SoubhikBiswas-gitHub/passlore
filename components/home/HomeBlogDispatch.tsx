import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { blogPosts } from "@/lib/blogPosts"

export function HomeBlogDispatch() {
  const posts = blogPosts.slice(0, 3)

  return (
    <section className="mb-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <h2 className="text-xl sm:text-2xl font-headline font-bold text-zinc-50 uppercase tracking-widest">
          Security dispatch
        </h2>
        <Link
          href="/blog"
          className="text-xs font-mono text-blue-400 hover:text-blue-300 tracking-widest uppercase border-b border-blue-400/30 pb-1 w-fit inline-flex items-center gap-1"
        >
          View all articles
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <div className="aspect-video bg-zinc-900 mb-6 relative overflow-hidden border border-zinc-800">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={`Cover: ${post.title}`}
                  fill
                  className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500 grayscale group-hover:grayscale-[0.3]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" aria-hidden />
              )}
              {post.dispatchTag && (
                <div className="absolute top-4 left-4 bg-blue-600 px-2 py-1 text-[10px] font-mono text-white font-bold tracking-widest uppercase">
                  {post.dispatchTag}
                </div>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-headline font-bold text-zinc-50 mb-3 group-hover:text-blue-400 transition-colors uppercase tracking-wide line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{post.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

import { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blogPosts"
import { SITE_URL } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
  ]

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.dateModified ?? post.datePublished),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages]
}

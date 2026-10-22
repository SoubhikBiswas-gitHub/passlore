/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [{
      source: "/:path*",
      ...(process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === "play" ? {} : {
        has: [{ type: "host", value: "(play\\.passlore\\.com|passlore-play\\..*)" }],
      }),
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
    }]
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
}

export default nextConfig

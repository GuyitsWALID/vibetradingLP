/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.ytimg.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // WebSocket proxy (optional: if running WS server on same domain)
  async rewrites() {
    if (process.env.NEXT_PUBLIC_WS_URL) {
      return [
        {
          source: '/ws',
          destination: process.env.NEXT_PUBLIC_WS_URL,
        },
      ]
    }
    return []
  },
}

export default nextConfig

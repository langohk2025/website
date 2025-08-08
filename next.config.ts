/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['lango.ai'],
    unoptimized: true
    
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig


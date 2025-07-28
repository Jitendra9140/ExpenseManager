/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    unoptimized: true,
  },
  // Ensure proper static generation
  output: 'standalone',
  // Fix for deployment issues
  trailingSlash: false,
  // Disable static optimization for pages that need server-side rendering
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    missingSuspenseWithCSRBailout: false,
  },
}

export default nextConfig


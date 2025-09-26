/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable React 19 features
    reactCompiler: false,
    // Enable PPR (Partial Prerendering) - Next.js 15 feature
    ppr: false,
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Optimize images and enable modern formats
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // SWC minification is enabled by default in Next.js 15
}

module.exports = nextConfig
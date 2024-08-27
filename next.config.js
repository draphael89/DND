/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'],
  },
  // Remove the env section as it's not needed when using Vercel
}

module.exports = nextConfig;
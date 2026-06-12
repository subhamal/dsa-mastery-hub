/** @type {import('next').Config} */
const nextConfig = {
  reactStrictMode: true,
  // Allow Dicebear / Dicebear API for avatars
  images: {
    domains: ['api.dicebear.com'],
  },
}

module.exports = nextConfig

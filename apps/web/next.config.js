/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'cdn.coindesk.com',
      'coindesk.com',
      'static.reuters.com',
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'Gecko\'s Daily',
  },
}

module.exports = nextConfig

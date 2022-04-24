/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path',
          destination: 'https://my.vanmoof.com/api/v8/:path',
        }
      ]
    }
  }
}

module.exports = nextConfig

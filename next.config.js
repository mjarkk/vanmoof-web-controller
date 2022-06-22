/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/my_vanmoof_com/:path',
          destination: 'https://my.vanmoof.com/api/v8/:path',
        },
        {
          source: '/api/api_vanmoof-api_com/:path',
          destination: 'https://api.vanmoof-api.com/v8/:path',
        },
        {
          source: '/api/api_vanmoof-api_com/:path',
          destination: 'https://api.vanmoof-api.com/v8/:path',
        }
      ]
    }
  }
}

module.exports = nextConfig

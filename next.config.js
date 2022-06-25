const withPWA = require('next-pwa')

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
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
          source: '/api/api_vanmoof-api_com/getBikeSharingInvitationsForBike/:path',
          destination: 'https://api.vanmoof-api.com/v8/getBikeSharingInvitationsForBike/:path',
        },
        {
          source: '/api/api_vanmoof-api_com/revokeBikeSharingInvitation/:path',
          destination: 'https://api.vanmoof-api.com/v8/revokeBikeSharingInvitation/:path',
        },
      ]
    }
  },
  pwa: {
    dest: 'public',
  },
})

module.exports = nextConfig

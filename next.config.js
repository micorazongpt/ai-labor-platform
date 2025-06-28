/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 환경 변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 이미지 최적화
  images: {
    domains: ['ai-labor.vercel.app'],
  },
  
  // PWA 설정을 위한 헤더
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
  
  // 리디렉션 설정
  async redirects() {
    return [
      {
        source: '/calculator',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig;
import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.youtube.com https://s.ytimg.com",
      "frame-src https://www.youtube.com",
      "img-src 'self' data: https://i.ytimg.com https://lh3.googleusercontent.com https://lihqutmhaxcshnabzcxz.supabase.co",
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https://lihqutmhaxcshnabzcxz.supabase.co",
      "font-src 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lihqutmhaxcshnabzcxz.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
    ],
  },
};

export default nextConfig;

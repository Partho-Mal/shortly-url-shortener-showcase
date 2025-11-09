/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  images: {
    remotePatterns: [
      ...(isDev
        ? [
            {
              protocol: 'http',
              hostname: 'localhost',
              port: '8080',
              pathname: '/api/qr-code/**',
            },
          ]
        : [
            {
              protocol: 'https',
              hostname: 'https://shortly-url-shortener-showcase.onrender.com',
              pathname: '/api/qr-code/**',
            },
          ]),
      {
        protocol: 'https',
        hostname: 'api.producthunt.com',
        pathname: '**',
      },
    ],
  },
  async rewrites() {
    return isDev
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:8080/api/:path*',
          },
        ]
      : [
          {
            source: '/api/:path*',
            destination: 'https://shortly-url-shortener-showcase.onrender.com/api/:path*',
          },
        ];
  },


   async redirects() {
    return [
      {
        source: '/free-tool/url-shortener',
        destination: '/shortly/url-shortener',
        permanent: true, // 308 redirect (SEO friendly)
      },
    ];
  },
};

export default nextConfig;

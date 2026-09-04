/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://digital-life-lessons-server.vercel.app'
        : 'http://localhost:5000');
    return [
      {
        source: '/api/:path*',
        destination: `${serverUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

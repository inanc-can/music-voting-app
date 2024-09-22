/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: "i.scdn.co" }],
  },
};

export default nextConfig;

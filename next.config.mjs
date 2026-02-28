/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  outputFileTracingIncludes: {
    "/api/**": ["./prisma/dev.db"],
  },
};

export default nextConfig;

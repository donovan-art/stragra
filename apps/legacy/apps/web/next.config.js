/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@stragra/file-explorer", "@stragra/core", "@stragra/ui"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;

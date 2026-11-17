import type { NextConfig } from "next";

const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isStatic ? "export" : undefined,
  trailingSlash: isStatic,
  images: { unoptimized: isStatic },
  transpilePackages: ["three"],
};

export default nextConfig;

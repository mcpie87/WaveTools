import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  ...(isProd && {
    basePath: "/wuwa-tracker",
    assetPrefix: "/wuwa-tracker/",
  }),
  trailingSlash: true,
  images: {
    domains: ['raw.githubusercontent.com'],
  }
};

export default nextConfig;

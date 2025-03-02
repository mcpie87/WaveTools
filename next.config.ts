import type { NextConfig } from "next";
const isProduction = process.env.NODE_ENV === 'production';
const repositoryName = 'wuwa-tracker';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: isProduction ? `/${repositoryName}` : '',
  assetPrefix: isProduction ? `/${repositoryName}/` : '',
  trailingSlash: true,
  images: {
    domains: ['raw.githubusercontent.com'],
  }
};

export default nextConfig;

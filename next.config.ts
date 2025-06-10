import type { NextConfig } from "next";
const isProduction = process.env.NODE_ENV === 'production';
const repositoryName = 'WaveTools';

const nextConfig: NextConfig = {
  /* config options here */
  output: isProduction ? 'export' : undefined, // needed in order to deploy public folder
  basePath: isProduction ? `/${repositoryName}` : '',
  assetPrefix: isProduction ? `/${repositoryName}/` : '',
  trailingSlash: true,
  images: {
    domains: [
      'raw.githubusercontent.com',
      'git.encore.moe', // WW assets
    ],
  }
};

export default nextConfig;

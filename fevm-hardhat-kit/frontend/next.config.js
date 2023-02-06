// https://github.com/enricobottazzi/ZK-SBT-FrontEnd/blob/master/next.config.js

/** @type {import('next').NextConfig} */
module.exports = {
  swcMinify: true,
  experimental: {
    externalDir: true,
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

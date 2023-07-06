/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.pexels.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["sequelize","@types/sequelize"],
  },
};

module.exports = nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  webpack(config) {
    config.module.rules.push({
      test: /\.task$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name][ext]",
      },
    });

    return config;
  },

  reactStrictMode: false

};

export default nextConfig;

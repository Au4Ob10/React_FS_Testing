import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   webpack(config) {
    config.module.rules.push({
      test: /\.task$/,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name][ext]",
      },
    })
  reactStrictMode: false
  return config
}};

export default nextConfig;

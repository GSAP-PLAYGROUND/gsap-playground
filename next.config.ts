import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    "/api/registry/[slug]": ["./src/app/**/*"],
    "/code/[slug]": ["./src/app/**/*"],
  },
  async headers() {
    return [
      {
        source: "/:path*(svg|png|jpg|jpeg|gif|webp|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

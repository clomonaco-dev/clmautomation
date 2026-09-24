import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  ...(process.env.NODE_ENV === "development"
    ? {
        rewrites: async () => [
          {
            source: "/.netlify/functions/google-reviews",
            destination:
              "https://clmautomation.it/.netlify/functions/google-reviews",
          },
        ],
      }
    : {}),
};
export default nextConfig;

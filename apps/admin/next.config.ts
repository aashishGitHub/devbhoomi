import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.devtatva.com",
            },
            {
                protocol: "https",
                hostname: "**.amazonaws.com",
            },
        ],
        formats: ["image/avif", "image/webp"],
    },
    experimental: {
        optimizePackageImports: ["lucide-react", "recharts"],
    },
};

export default nextConfig;

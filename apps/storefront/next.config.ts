import type { NextConfig } from "next";
import withSerwist from "@serwist/next";

const isMockBuild = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const nextConfig: NextConfig = {
    ...(isMockBuild ? { output: "export" } : {}),

    images: {
        // Static export does not support Next.js image optimisation — use
        // unoptimized so <next/image> renders plain <img> tags.
        // In production (Vercel) this is removed and real optimisation applies.
        ...(isMockBuild ? { unoptimized: true } : {}),
        remotePatterns: [
            { protocol: "https", hostname: "cdn.devtatva.com" },
            { protocol: "https", hostname: "**.amazonaws.com" },
            // Placeholder images used in mock/demo mode
            { protocol: "https", hostname: "picsum.photos" },
        ],
        formats: ["image/avif", "image/webp"],
        // Cache optimised images on the server host for 30 days (default is 60s).
        // Means product images fetched from the Go API are served from
        // .next/cache/images/ on subsequent requests — no re-fetch from the origin.
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days in seconds
        // Keep up to 1000 distinct image variants in the server-side cache
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    experimental: {
        optimizePackageImports: ["lucide-react", "framer-motion"],
    },
};

export default withSerwist({
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",
    disable: process.env.NODE_ENV === "development",
})(nextConfig);

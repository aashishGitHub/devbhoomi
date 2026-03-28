import type { NextConfig } from "next";
import withSerwist from "@serwist/next";

const isMockBuild = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const nextConfig: NextConfig = {
    // Static export for Cloudflare Pages (mock/demo builds).
    // Remove this line when deploying to Vercel with the real Go backend.
    ...(isMockBuild ? { output: "export" } : {}),

    images: {
        // Static export does not support Next.js image optimisation — use
        // unoptimized so <next/image> renders plain <img> tags.
        // In production (Vercel) this is removed and real optimisation applies.
        ...(isMockBuild ? { unoptimized: true } : {}),
        remotePatterns: [
            { protocol: "https", hostname: "cdn.devbhoomi.com" },
            { protocol: "https", hostname: "**.amazonaws.com" },
            // Placeholder images used in mock/demo mode
            { protocol: "https", hostname: "picsum.photos" },
        ],
        formats: ["image/avif", "image/webp"],
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

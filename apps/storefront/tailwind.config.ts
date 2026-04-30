import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                forest: "#254B5A",
                misty: "#A6CBD3",
                rust: "#9D5F1B",
                cream: "#FDF1DB",
                stone: "#344E95",
                muted: "#BBA48D",
                snow: "#FFFFFF",
            },
            fontFamily: {
                sans: ["Manrope", "Inter", "sans-serif"],
                serif: ["Georgia", "'Times New Roman'", "serif"],
                signature: ["var(--font-signature)", "cursive"],
            },
            backgroundImage: {
                "gradient-hero":
                    "linear-gradient(135deg, #254B5A 0%, #344E95 100%)",
                "gradient-warm":
                    "linear-gradient(135deg, #FDF1DB 0%, #BBA48D 100%)",
            },
            boxShadow: {
                card: "0 2px 16px 0 rgba(37, 75, 90, 0.10)",
                "card-hover": "0 8px 32px 0 rgba(37, 75, 90, 0.18)",
            },
            animation: {
                "fade-up": "fadeUp 0.5s ease-out forwards",
                shimmer: "shimmer 1.5s infinite",
                "gradient-x": "gradientX 4s ease infinite",
                float: "float 6s ease-in-out infinite",
            },
            keyframes: {
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                gradientX: {
                    "0%, 100%": { backgroundSize: "200% 200%", backgroundPosition: "left center" },
                    "50%": { backgroundSize: "200% 200%", backgroundPosition: "right center" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;

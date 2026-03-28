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
                // Admin-specific
                sidebar: "#1A3340",
                "sidebar-hover": "#254B5A",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                display: ["var(--font-manrope)", "system-ui", "sans-serif"],
            },
            boxShadow: {
                card: "0 1px 3px rgba(37,75,90,0.06), 0 1px 2px rgba(37,75,90,0.04)",
                "card-hover": "0 4px 12px rgba(37,75,90,0.10), 0 2px 4px rgba(37,75,90,0.06)",
            },
        },
    },
    plugins: [],
};

export default config;

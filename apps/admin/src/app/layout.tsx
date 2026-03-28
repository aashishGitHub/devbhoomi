import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Devbhoomi Admin",
        template: "%s | Devbhoomi Admin",
    },
    description: "Admin dashboard for Devbhoomi Himalayan Heritage E-Commerce Platform",
    robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
            <body className="min-h-screen bg-gray-50">{children}</body>
        </html>
    );
}

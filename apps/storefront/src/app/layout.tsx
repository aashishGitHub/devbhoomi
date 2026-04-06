import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import LogoutButton from "@/components/auth/LogoutButton";

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
  metadataBase: new URL("https://devbhoomi.com"),
  title: {
    default: "Devbhoomi — Sacred & Organic Himalayan Products",
    template: "%s | Devbhoomi",
  },
  description:
    "Authentic sacred items, organic Himalayan foods, and heritage wellness products sourced directly from artisans and farmers of Uttarakhand.",
  keywords: [
    "himalayan products",
    "organic honey",
    "rudraksha",
    "uttarakhand",
    "sacred items",
    "shilajit",
    "himalayan herbs",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://devbhoomi.com",
    siteName: "Devbhoomi Himalayan Heritage",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Devbhoomi — Himalayan Heritage Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@devbhoomi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#254B5A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen flex flex-col bg-cream">
        <QueryProvider>
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
          <CartDrawer />
          <LogoutButton />
        </QueryProvider>
      </body>
    </html>
  );
}

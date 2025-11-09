// app/page.tsx
/**
 * Main landing page for Shortly URL Shortener
 *
 * This file defines the root page of the Next.js app, providing:
 * - Metadata for SEO, OpenGraph, Twitter Cards, and robots.
 * - LandingPage component rendering with a professional showcase banner.
 *
 * Standards applied:
 * - TypeScript types enforced for metadata.
 * - Clean, maintainable, production-ready code.
 * - Comments follow Google/Meta TS/React style.
 */

import LandingPage from "./landing/page";
import type { Metadata } from "next";

/**
 * Page-level metadata for SEO, social media, and indexing.
 */
export const metadata: Metadata = {
  title: "Showcase of Shortly",
  description:
    "Shortly is a fast, privacy-focused URL shortener built with Go & Next.js. Create branded short links, track analytics, and generate QR codes — open-source and free.",
  metadataBase: new URL("https://shortly.streamlab.in"),
  openGraph: {
    title: "Showcase of Shortly",
    description:
      "Create custom short URLs with real-time analytics and QR generation. Open-source and privacy-friendly.",
    url: "https://shortly.streamlab.in",
    siteName: "Shortly",
    images: [
      {
        url: "/shortlycovermain.png",
        width: 1200,
        height: 630,
        alt: "Shortly URL Shortener Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shortly - Free URL Shortener & QR Generator",
    description:
      "Shorten links, track clicks, and share via QR instantly. Free, fast, and secure.",
    images: ["/shortlycovermain.png"],
    creator: "@Streamlab",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://shortly.streamlab.in",
  },
  keywords: [
    "URL shortener",
    "short link generator",
    "custom short URLs",
    "QR code generator",
    "link analytics",
    "open source URL shortener",
    "Go URL shortener",
    "Next.js URL shortener",
  ],
};

/**
 * Page component renders the landing page.
 * Includes a minimal showcase message below the header.
 */
export default function Page() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen">
      {/* ---- Showcase Banner ---- */}


      {/* ---- Landing Page ---- */}
      <LandingPage />
    </main>
  );
}

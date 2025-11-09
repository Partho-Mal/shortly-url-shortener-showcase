// app/layout.tsx

/**
 * Root layout for Shortly URL Shortener
 *
 * Responsibilities:
 * - Provides HTML <head> with metadata, OpenGraph, Twitter cards, and structured data.
 * - Sets up Google Fonts using Next.js font optimization.
 * - Wraps the app in ThemeProvider for light/dark mode.
 * - Configures global styles and viewport settings.
 *
 * Standards:
 * - TypeScript enforced.
 * - Clean, maintainable, production-ready code.
 * - No emojis or non-standard comments.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import WarmBackend from "@/components/WarmBackend";
import { Toaster } from "sonner";

// Load Google Fonts with CSS variable support
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Page metadata including SEO, OpenGraph, Twitter Cards, and icons.
 */
export const metadata: Metadata = {
  title: "Showcase of Shortly",
  description:
    "Free online URL shortener to create short links, custom slugs, and QR codes. Track clicks in real-time with analytics. No signup required.",
  metadataBase: new URL("https://shortly.streamlab.in"),
  openGraph: {
    title: "Free URL Shortener — Create Short Links & QR Codes",
    description:
      "Shorten long URLs, customize slugs, generate QR codes, and track real-time analytics. Simple, fast, and free.",
    url: "https://shortly.streamlab.in",
    siteName: "Shortly",
    images: [
      {
        url: "/shortlycovermain.png",
        width: 1200,
        height: 630,
        alt: "Shortly URL Shortener App",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free URL Shortener - Create Short Links & QR Codes",
    description:
      "Create branded short links and QR codes with real-time analytics. Fast, privacy-focused, and free to use.",
    images: ["/shortlycovermain.png"],
    creator: "@streamlab.in",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/favicon-32x32.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://shortly.streamlab.in",
  },
};

/**
 * Default viewport settings for responsive design.
 */
export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * RootLayout component wraps all pages.
 * Provides fonts, global styles, theme provider, and head metadata.
 */
export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Google AdSense script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4678985847893657"
          crossOrigin="anonymous"
        />
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Shortly",
              url: "https://shortly.streamlab.in",
              applicationCategory: "Utility",
              offers: {
                "@type": "Offer",
                price: "0.00",
                priceCurrency: "USD",
              },
              operatingSystem: "All",
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>  

        <WarmBackend />
        {/* 
          Issues a one-time lightweight GET /health request to the backend.
          Purpose:
          - Helps reduce initial latency on cold-start serverless environments.
          - Request is non-blocking; UI is unaffected.
          Usage:
          - Safe to keep mounted globally for best user experience.
        */}


        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Toaster position="top-right" richColors closeButton /> 
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

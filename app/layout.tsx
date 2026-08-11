import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/lib/portfolio";
import "./globals.css";

const display = localFont({ src: "./fonts/newsreader.woff2", variable: "--font-display", weight: "200 800", display: "swap" });
const body = localFont({ src: "./fonts/manrope.woff2", variable: "--font-body", weight: "200 800", display: "swap" });
const mono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-400.woff2", weight: "400" },
    { path: "./fonts/ibm-plex-mono-500.woff2", weight: "500" },
  ],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Santosh Kumar — Software Engineer", template: "%s — Santosh Kumar" },
  description: profile.intro,
  keywords: ["Santosh Kumar", "Software Engineer", "Backend Engineer", "Applied AI", "Coimbatore"],
  authors: [{ name: profile.name }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Santosh Kumar — Software Engineer",
    description: profile.headline,
    url: "/",
    siteName: "Santosh Kumar",
    locale: "en_IN",
    type: "profile",
  },
  twitter: { card: "summary_large_image", title: "Santosh Kumar — Software Engineer", description: profile.headline },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#090A0C" },
    { media: "(prefers-color-scheme: dark)", color: "#090A0C" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      jobTitle: "Software Engineer",
      address: { "@type": "PostalAddress", addressLocality: "Coimbatore", addressRegion: "Tamil Nadu", addressCountry: "IN" },
      sameAs: ["https://github.com/marsh15", "https://www.linkedin.com/in/s-santosh-kumar/", "https://x.com/santu_0101"],
    },
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} js`} data-theme="dark">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <Analytics />
      </body>
    </html>
  );
}

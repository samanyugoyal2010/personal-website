import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/profile";
import { CommandMenu } from "@/components/CommandMenu";
import { NowPlayingBar } from "@/components/NowPlayingBar";
import { Analytics } from "@vercel/analytics/next";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

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

const url = profile.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.metaDescription,
  keywords: [...profile.keywords],
  authors: [{ name: profile.name, url }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url,
    title: `${profile.name} — ${profile.role}`,
    description: profile.metaDescription,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.metaDescription,
    creator: profile.twitterHandle,
  },
  alternates: { canonical: url },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-canvas"
        >
          Skip to content
        </a>
        {children}
        <CommandMenu />
        <NowPlayingBar />
        <Analytics />
      </body>
    </html>
  );
}

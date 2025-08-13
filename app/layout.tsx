import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
// import { OnboardingReset } from "@/components/onboarding-reset";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lookbook - Share & Collect Inspiring Fashion",
  description:
    "Explore trending styles, share your own looks, tip your favorite creators, and build your personal Lookbook. All powered by Farcaster & Base.",
  keywords: [
    "fashion",
    "style",
    "outfits",
    "looks",
    "lookbook",
    "collect",
    "tip creators",
    "Base",
    "Farcaster",
    "web3 social",
  ],
  openGraph: {
    title: "Lookbook - Share & Collect Inspiring Fashion",
    description:
      "Your social fashion hub: discover styles, share your own, tip creators, and curate your Lookbook.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lookbook - Share & Collect Inspiring Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lookbook - Share & Collect Inspiring Fashion",
    description:
      "Discover the latest styles, share your looks, tip creators, and curate your Lookbook on Farcaster & Base.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {children}
        {/* <OnboardingReset /> */}
      </body>
    </html>
  );
}

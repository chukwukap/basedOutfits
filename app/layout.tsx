import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { Providers } from "./providers";
import { ThemeProvider } from "@/contexts/theme-context";

import "./globals.css";
import { OnboardingReset } from "./_components/onboarding-reset";

export const metadata: Metadata = {
  title: "Outfitly - Share & Collect Inspiring Fashion",
  description:
    "Explore trending styles, share your own outfits, tip your favorite creators, and build your personal Outfitly. All powered by Farcaster & Base.",
  keywords: [
    "fashion",
    "style",
    "outfits",
    "outfits",
    "outfit",
    "collect",
    "tip creators",
    "Base",
    "Farcaster",
    "web3 social",
  ],
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
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
        <OnboardingReset />
      </body>
    </html>
  );
}

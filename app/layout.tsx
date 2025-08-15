import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
// import { OnboardingReset } from "@/components/onboarding-reset";
import { Providers } from "./providers";
import { ThemeProvider } from "@/contexts/theme-context";
import { ThemeSettingsModal } from "./_components/theme-settings-modal";
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
          <Providers>
            {children}
            {/* Floating Theme Selector (mobile-first) */}
            <div className="fixed bottom-20 right-4 z-50 md:bottom-6">
              <ThemeSettingsModal />
            </div>
          </Providers>
        </ThemeProvider>
        {/* <OnboardingReset /> */}
      </body>
    </html>
  );
}

import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { Providers } from "./providers";
import { ThemeProvider } from "@/contexts/theme-context";

import "./globals.css";
import { OnboardingReset } from "./_components/onboarding-reset";

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "";
  const appName =
    process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "BasedOutfits";
  const imageUrl = `${URL}/hero.png`;
  const splashImageUrl =
    process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${URL}/splash.png`;
  const splashBackgroundColor =
    process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#ffffff";

  const miniappEmbed = {
    version: "1",
    imageUrl,
    button: {
      title: `Launch ${appName}`,
      action: {
        type: "launch_miniapp" as const,
        name: appName,
        url: URL,
        splashImageUrl,
        splashBackgroundColor,
      },
    },
  };

  return {
    title: appName,
    description: "Discover, post, and collect outfits.",
    other: {
      "fc:miniapp": JSON.stringify(miniappEmbed),
      "fc:frame": JSON.stringify({
        version: "1",
        imageUrl,
        button: {
          title: `Launch ${appName}`,
          action: {
            type: "launch_frame",
            name: appName,
            url: URL,
            splashImageUrl,
            splashBackgroundColor,
          },
        },
      }),
    },
  };
}

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

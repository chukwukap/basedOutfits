import WardrobesPageClient from "./_components/wardrobes-page-client";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const appName = "Outfitly";
  const imageUrl = `https://basedoutfits.vercel.app/hero.png`;
  const splashImageUrl = `https://basedoutfits.vercel.app/splash.png`;
  const splashBackgroundColor = "#ffffff";

  return {
    title: appName,
    description: "Discover, post, and collect outfits.",
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl,
        button: {
          title: `Launch ${appName}`,
          action: {
            type: "launch_frame",
            name: appName,
            url: "https://basedoutfits.vercel.app",
            splashImageUrl,
            splashBackgroundColor,
          },
        },
      }),
    },
  };
}

export default function WardrobesPage() {
  return <WardrobesPageClient />;
}

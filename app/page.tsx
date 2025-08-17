import HomePageClient from "./_components/home-page-client";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "";
  const appName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Outfitly";
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
        type: "launch_miniapp",
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

export default function HomePage() {
  return <HomePageClient />;
}

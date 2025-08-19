import OutfitDetailPageClient from "./_components/outfit-details-page-client";

import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
import { prisma } from "@/lib/db";

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  console.log("id", id);
  if (!id)
    return {
      title: "View Outfit",
      description: "View Outfit 🔥",
      openGraph: {
        images: ["https://basedoutfits.vercel.app/hero.png"],
      },
      other: {
        "fc:frame": JSON.stringify({
          version: "1",
          imageUrl: "https://basedoutfits.vercel.app/hero.png",
          button: {
            title: `View Outfit 🔥`,
            action: {
              type: "launch_frame",
              name: "Outfitly",
              url: "https://basedoutfits.vercel.app",
              splashImageUrl: "https://basedoutfits.vercel.app/splash.png",
              splashBackgroundColor: "#ffffff",
            },
          },
        }),
      },
    };

  const previousImages = (await parent).openGraph?.images || [];

  try {
    const outfit = await prisma.outfit.findUnique({ where: { id } });
    if (!outfit) return {};
    const appName = "Outfitly";
    const splashImageUrl = `https://basedoutfits.vercel.app/splash.png`;
    const splashBackgroundColor = "#ffffff";
    const image = outfit.imageUrls?.[0]
      ? outfit.imageUrls[0].startsWith("http")
        ? outfit.imageUrls[0]
        : `https://basedoutfits.vercel.app${outfit?.imageUrls?.[0]}`
      : `https://basedoutfits.vercel.app/hero.png`;

    return {
      title: "View Outfit",
      description: "View Outfit 🔥",
      openGraph: {
        images: image ? [image, ...previousImages] : previousImages || [],
      },
      other: {
        "fc:frame": JSON.stringify({
          version: "1",
          imageUrl: image,
          button: {
            title: `View Outfit 🔥`,
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
  } catch {
    return {};
  }
}

export default function OutfitDetailPage() {
  return <OutfitDetailPageClient />;
}

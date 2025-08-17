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
  if (!id) return {};

  const previousImages = (await parent).openGraph?.images || [];

  try {
    const outfit = await prisma.outfit.findUnique({ where: { id } });
    if (!outfit) return {};
    const host = process.env.NEXT_PUBLIC_URL || "";
    const appName =
      process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "BasedOutfits";
    const splashImageUrl =
      process.env.NEXT_PUBLIC_SPLASH_IMAGE || `${host}/icon.jpg`;
    const splashBackgroundColor =
      process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#ffffff";
    const image = outfit.imageUrls?.[0]
      ? outfit.imageUrls[0].startsWith("http")
        ? outfit.imageUrls[0]
        : `${host}${outfit.imageUrls[0]}`
      : process.env.NEXT_PUBLIC_APP_HERO_IMAGE;

    return {
      title: outfit.caption || process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      description: outfit.description || "",
      openGraph: {
        images: image ? [image, ...previousImages] : previousImages || [],
      },
      other: {
        "fc:miniapp": JSON.stringify({
          version: "1",
          imageUrl: image,
          button: {
            title: "Open BasedOutfits",
            action: {
              type: "launch_miniapp",
              name: appName,
              url: host,
              splashImageUrl,
              splashBackgroundColor,
            },
          },
        }),
        "fc:frame": JSON.stringify({
          version: "1",
          imageUrl: image,
          button: {
            title: "View this outfit",
            action: {
              type: "launch_frame",
              name: appName,
              url: `${host}/outfits/${id}`,
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

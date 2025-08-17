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
        "fc:frame": JSON.stringify({
          version: "next",
          imageUrl: image,
          button: {
            title: `Check out this outfit!`,
            action: {
              type: "launch_frame",
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
              url: `${host}/outfit/${id}`,
              splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
              splashBackgroundColor:
                process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
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

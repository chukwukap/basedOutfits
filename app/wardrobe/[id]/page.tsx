import OutfitDetailsPageClient from "./_components/wardrobe-details-page-client";
import { prisma } from "@/lib/db";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
    const image = outfit.imageUrls[0]
      ? outfit.imageUrls[0].startsWith("http")
        ? outfit.imageUrls[0]
        : `${host}${outfit.imageUrls[0]}`
      : process.env.NEXT_PUBLIC_APP_HERO_IMAGE;

    return {
      title: outfit.caption || "",
      description: outfit.description || "",
      openGraph: {
        images: image ? [image, ...previousImages] : previousImages || [],
      },
      other: {
        "fc:frame": JSON.stringify({
          version: "next",
          imageUrl: image,
          button: {
            title: `View ${outfit.caption} outfit!`,
            action: {
              type: "launch_frame",
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
              url: `${host}/outfits/${id}`,
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

export default function OutfitDetailsPage() {
  return <OutfitDetailsPageClient />;
}

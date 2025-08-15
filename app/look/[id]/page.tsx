import LookDetailPageClient from "./_components/look-details-page-client";

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
    const look = await prisma.look.findUnique({ where: { id } });
    if (!look) return {};
    const host = process.env.NEXT_PUBLIC_URL || "";
    const image = look.imageUrls?.[0]
      ? look.imageUrls[0].startsWith("http")
        ? look.imageUrls[0]
        : `${host}${look.imageUrls[0]}`
      : process.env.NEXT_PUBLIC_APP_HERO_IMAGE;

    return {
      title: look.caption || process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      description: look.description || "",
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
              url: host,
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

export default function LookDetailPage() {
  return <LookDetailPageClient />;
}

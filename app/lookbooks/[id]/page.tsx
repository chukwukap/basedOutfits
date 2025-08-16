import LookbookDetailsPageClient from "./_components/post-details-page-client";
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
    const lb = await prisma.lookbook.findUnique({ where: { id } });
    if (!lb) return {};
    const host = process.env.NEXT_PUBLIC_URL || "";
    const image = lb.coverImage
      ? lb.coverImage.startsWith("http")
        ? lb.coverImage
        : `${host}${lb.coverImage}`
      : process.env.NEXT_PUBLIC_APP_HERO_IMAGE;

    return {
      title: lb.name,
      description: lb.description || "",
      openGraph: {
        images: image ? [image, ...previousImages] : previousImages || [],
      },
      other: {
        "fc:frame": JSON.stringify({
          version: "next",
          imageUrl: image,
          button: {
            title: `View ${lb.name} outfit!`,
            action: {
              type: "launch_frame",
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
              url: `${host}/lookbooks/${id}`,
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

export default function LookbookDetailsPage() {
  return <LookbookDetailsPageClient />;
}

import LookbookDetailsPageClient from "./_components/post-details-page-client";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import type { PageProps } from "next";

export async function generateMetadata({ params }: PageProps<{ id: string }>): Promise<Metadata> {
  const id = params?.id;
  if (!id) return {};
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
        images: image ? [image] : [],
      },
      other: {
        "fc:frame": JSON.stringify({
          version: "next",
          imageUrl: image,
          button: {
            title: `Open ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}`,
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

export default function LookbookDetailsPage() {
  return <LookbookDetailsPageClient />;
}

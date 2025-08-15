import LookDetailPageClient from "./_components/look-details-page-client";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { PageProps } from "next";

export async function generateMetadata({ params }: PageProps<{ id: string }>): Promise<Metadata> {
  const id = params?.id;
  if (!id) return {};
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

export default function LookDetailPage() {
  return <LookDetailPageClient />;
}

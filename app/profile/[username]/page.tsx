import UserProfilePageClient from "./profile-page-client";
import type { Metadata, ResolvingMetadata } from "next";
import { prisma } from "@/lib/db";
import { APP_URL } from "@/lib/utils";

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { username } = await params;
  if (!username) return {};

  const previousImages = (await parent).openGraph?.images || [];

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return {};
    const appName = "Outfitly";
    const splashImageUrl = `${APP_URL}/splash.png`;
    const splashBackgroundColor =
      process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#ffffff";
    const image = user.avatarUrl
      ? user.avatarUrl.startsWith("http")
        ? user.avatarUrl
        : `${APP_URL}${user.avatarUrl}`
      : `${APP_URL}${process.env.NEXT_PUBLIC_APP_HERO_IMAGE}`;

    return {
      title: user.name || `@${user.username} profile`,
      description: user.bio || "",
      openGraph: {
        images: image ? [image, ...previousImages] : previousImages || [],
      },
      other: {
        "fc:frame": JSON.stringify({
          version: "next",
          imageUrl: image,
          button: {
            title: `View @${user.username}'s profile`,
            action: {
              type: "launch_frame",
              name: appName,
              url: APP_URL,
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

export default function UserProfilePage() {
  return <UserProfilePageClient />;
}

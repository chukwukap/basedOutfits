import UserProfilePageClient from "./profile-page-client";
import type { Metadata, ResolvingMetadata } from "next";
import { prisma } from "@/lib/db";

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
    const host = process.env.NEXT_PUBLIC_URL || "";
    const image = user.avatarUrl
      ? user.avatarUrl.startsWith("http")
        ? user.avatarUrl
        : `${host}${user.avatarUrl}`
      : process.env.NEXT_PUBLIC_APP_HERO_IMAGE;

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
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
              url: `${host}/profile/${user.username}`,
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

export default function UserProfilePage() {
  return <UserProfilePageClient />;
}

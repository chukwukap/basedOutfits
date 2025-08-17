import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Returns a small list of suggested creators for the Discover widget.
 * Security: response is public-safe; excludes sensitive fields.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = Number.parseInt(searchParams.get("limit") || "10", 10);
    const limit = Math.min(Math.max(limitParam, 1), 20);

    // Simple heuristic: users who have updated recently and have at least one public wardrobe
    const users = await prisma.user.findMany({
      where: {
        wardrobes: { some: { isPublic: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      include: {
        wardrobes: {
          where: { isPublic: true },
          select: { id: true },
        },
        outfits: {
          select: { id: true },
        },
      },
    });

    const payload = users.map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name ?? u.username,
      avatar: u.avatarUrl ?? "",
      followers: 0, // TODO: replace when follower system is implemented
      totalOutfits: u.outfits.length,
      wardrobesCount: u.wardrobes.length,
      isFollowing: false, // TODO: hydrate from viewer relationship when available
      updatedAt: u.updatedAt,
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET /api/users/suggested error", error);
    return NextResponse.json(
      { error: "Failed to fetch suggested users" },
      { status: 500 },
    );
  }
}

// Avoid static caching for personalized freshness.
export const dynamic = "force-dynamic";



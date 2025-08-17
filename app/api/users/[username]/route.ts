import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const match = new URL(req.url).pathname.match(/\/api\/users\/([^/]+)/);
    const username = match ? decodeURIComponent(match[1]) : "";
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        wardrobes: {
          where: { isPublic: true },
          include: { items: true },
          orderBy: { updatedAt: "desc" },
        },
        outfits: true,
      },
    });

    if (!user)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const payload = {
      id: user.id,
      username: user.username,
      name: user.name ?? user.username,
      avatar: user.avatarUrl ?? "",
      bio: user.bio ?? "",
      followers: 0,
      following: 0,
      totalOutfits: user.outfits.length,
      joinedDate: user.createdAt.toISOString(),
      isFollowing: false,
      updatedAt: user.updatedAt.toISOString(),
      publicWardrobes: user.wardrobes.map((wb) => ({
        id: wb.id,
        name: wb.name,
        description: wb.description ?? "",
        coverImage: wb.coverImage ?? "",
        wardrobeCount: wb.items.length,
        isPublic: wb.isPublic,
        followers: 0,
        isFollowing: false,
        updatedAt: wb.updatedAt,
        ownerId: wb.ownerId,
        createdAt: wb.createdAt,
      })),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET /api/users/[username] error", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";

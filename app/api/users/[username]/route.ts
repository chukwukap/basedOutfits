import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const match = new URL(req.url).pathname.match(/\/api\/users\/([^/]+)/);
    const username = match ? decodeURIComponent(match[1]) : "";
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        lookbooks: {
          where: { isPublic: true },
          include: { items: true },
          orderBy: { updatedAt: "desc" },
        },
        looks: true,
        followers: true,
        following: true,
      },
    });

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const payload = {
      id: user.id,
      username: user.username,
      name: user.name ?? user.username,
      avatar: user.avatarUrl ?? "",
      bio: user.bio ?? "",
      followers: user.followers.length,
      following: user.following.length,
      totalLooks: user.looks.length,
      joinedDate: user.createdAt.toISOString(),
      isFollowing: false,
      updatedAt: user.updatedAt.toISOString(),
      publicLookbooks: user.lookbooks.map((lb) => ({
        id: lb.id,
        name: lb.name,
        description: lb.description ?? "",
        coverImage: lb.coverImage ?? "",
        lookCount: lb.items.length,
        isPublic: lb.isPublic,
        followers: 0,
        isFollowing: false,
        updatedAt: lb.updatedAt,
        ownerId: lb.ownerId,
        createdAt: lb.createdAt,
      })),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET /api/users/[username] error", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";



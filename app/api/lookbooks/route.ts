import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId") || undefined;
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10);
    const isPublicOnly = searchParams.get("public") !== "0";

    const lookbooks = await prisma.lookbook.findMany({
      where: {
        ...(ownerId ? { ownerId } : {}),
        ...(isPublicOnly ? { isPublic: true } : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: Math.min(Math.max(limit, 1), 50),
      include: {
        owner: true,
        items: true,
      },
    });

    const payload = lookbooks.map((lb) => ({
      id: lb.id,
      name: lb.name,
      description: lb.description ?? "",
      coverImage: lb.coverImage ?? "",
      isPublic: lb.isPublic,
      createdAt: lb.createdAt,
      updatedAt: lb.updatedAt,
      ownerId: lb.ownerId,
      lookCount: lb.items.length,
      followers: 0,
      isFollowing: false,
      creator: {
        username: lb.owner.username,
        name: lb.owner.name ?? lb.owner.username,
        avatar: lb.owner.avatarUrl ?? "",
      },
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET /api/lookbooks error", error);
    return NextResponse.json(
      { error: "Failed to fetch lookbooks" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ownerId, name, description, coverImage, isPublic } = body as {
      ownerId: string;
      name: string;
      description?: string;
      coverImage?: string;
      isPublic?: boolean;
    };

    if (!ownerId || !name)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Resolve owner id: allow passing either user id or username (e.g., "demo")
    let resolvedOwnerId = ownerId;
    const byId = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!byId) {
      const byUsername = await prisma.user.findUnique({
        where: { username: ownerId },
      });
      if (byUsername) {
        resolvedOwnerId = byUsername.id;
      } else if (ownerId === "demo" && process.env.NODE_ENV !== "production") {
        // Dev convenience: create demo user automatically
        const demo = await prisma.user.upsert({
          where: { username: "demo" },
          update: {},
          create: {
            username: "demo",
            name: "Demo User",
            avatarUrl: "/looks/diverse-group-profile.png",
          },
        });
        resolvedOwnerId = demo.id;
      } else {
        return NextResponse.json({ error: "Owner not found" }, { status: 400 });
      }
    }

    const created = await prisma.lookbook.create({
      data: {
        ownerId: resolvedOwnerId,
        name,
        description,
        coverImage,
        isPublic: !!isPublic,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/lookbooks error", error);
    return NextResponse.json(
      { error: "Failed to create lookbook" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const match = new URL(req.url).pathname.match(/\/api\/looks\/([^/]+)/);
    const id = match ? decodeURIComponent(match[1]) : "";
    const look = await prisma.look.findUnique({
      where: { id },
      include: {
        author: true,
        tips: true,
        saves: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!look) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const payload = {
      id: look.id,
      caption: look.caption ?? "",
      description: look.description ?? "",
      imageUrls: look.imageUrls,
      tags: look.tags,
      brands: look.brands,
      location: look.location ?? "",
      createdAt: look.createdAt,
      updatedAt: look.updatedAt,
      isPublic: look.isPublic,
      authorId: look.authorId,
      tips: look.tips.length,
      collections: look.saves.length,
      author: {
        isFollowing: false,
        avatarUrl: look.author.avatarUrl ?? "",
        fid: look.author.fid ?? look.author.username,
        name: look.author.name ?? look.author.username,
      },
      comments: look.comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        author: {
          id: c.authorId,
          name: c.author.name ?? c.author.username,
          avatarUrl: c.author.avatarUrl ?? "",
          fid: c.author.fid ?? c.author.username,
        },
      })),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET /api/looks/[id] error", error);
    return NextResponse.json({ error: "Failed to fetch look" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";



import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const match = new URL(req.url).pathname.match(/\/api\/outfits\/([^/]+)/);
    const id = match ? decodeURIComponent(match[1]) : "";
    const outfit = await prisma.outfit.findUnique({
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

    if (!outfit)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const payload = {
      id: outfit.id,
      caption: outfit.caption ?? "",
      description: outfit.description ?? "",
      imageUrls: outfit.imageUrls,
      createdAt: outfit.createdAt,
      updatedAt: outfit.updatedAt,
      isPublic: outfit.isPublic,
      authorId: outfit.authorId,
      tips: outfit.tips.length,
      collections: outfit.saves.length,
      author: {
        isFollowing: false,
        avatarUrl: outfit.author.avatarUrl ?? "",
        fid: outfit.author.fid ?? outfit.author.username,
        name: outfit.author.name ?? outfit.author.username,
      },
      comments: outfit.comments.map((c) => ({
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
    console.error("GET /api/outfits/[id] error", error);
    return NextResponse.json(
      { error: "Failed to fetch outfit" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";

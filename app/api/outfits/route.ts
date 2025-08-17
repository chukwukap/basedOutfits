import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10);

    const outfits = await prisma.outfit.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(limit, 1), 50),
      include: {
        author: true,
        tips: true,
        saves: true,
      },
    });

    const payload = outfits.map((l) => ({
      id: l.id,
      caption: l.caption ?? "",
      description: l.description ?? "",
      imageUrls: l.imageUrls,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
      isPublic: l.isPublic,
      authorId: l.authorId,
      tips: l.tips.length,
      collections: l.saves.length,
      author: {
        isFollowing: false,
        avatarUrl: l.author.avatarUrl ?? "",
        fid: l.author.fid ?? l.author.username,
        name: l.author.name ?? l.author.username,
      },
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET /api/outfits error", error);
    return NextResponse.json(
      { error: "Failed to fetch outfits" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authorId, caption, description, imageUrls, isPublic } = body as {
      authorId: string;
      caption?: string;
      description?: string;
      imageUrls: string[];
      isPublic?: boolean;
    };

    console.log("body", body);

    if (!authorId || !imageUrls?.length) {
      return NextResponse.json(
        { error: "authorId and imageUrls required" },
        { status: 400 },
      );
    }

    // Resolve placeholder usernames to real ids (e.g., "demo")
    let resolvedAuthorId = authorId;
    const authorById = await prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!authorById) {
      const authorByUsername = await prisma.user.findUnique({
        where: { username: authorId },
      });
      if (authorByUsername) resolvedAuthorId = authorByUsername.id;
    }

    const created = await prisma.outfit.create({
      data: {
        authorId: resolvedAuthorId,
        caption,
        description,
        imageUrls,
        isPublic: !!isPublic,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/outfits error", error);
    return NextResponse.json(
      { error: "Failed to create outfit" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const outfitId = searchParams.get("outfitId");
    if (!outfitId) return NextResponse.json([], { status: 200 });

    const comments = await prisma.comment.findMany({
      where: { outfitId },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });

    const payload = comments.map((c) => ({
      id: c.id,
      outfitId: c.outfitId,
      content: c.content,
      createdAt: c.createdAt,
      author: {
        name: c.author.name ?? c.author.username,
        avatar: c.author.avatarUrl ?? "",
        fid: c.author.fid ?? c.author.username,
      },
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET /api/comments error", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { outfitId, authorId, content } = body as {
      outfitId: string;
      authorId: string; // may be user id, username, or fid
      content: string;
    };

    if (!outfitId || !authorId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Security: basic input length checks
    if (content.length > 500) {
      return NextResponse.json({ error: "Comment too long" }, { status: 400 });
    }

    // Resolve authorId: accept id, username, or fid
    let resolvedAuthorId = authorId;
    const byId = await prisma.user.findUnique({ where: { id: authorId } });
    if (!byId) {
      const byUsername = await prisma.user.findUnique({
        where: { username: authorId },
      });
      if (byUsername) resolvedAuthorId = byUsername.id;
      else {
        const byFid = await prisma.user.findFirst({
          where: { fid: authorId },
        });
        if (byFid) resolvedAuthorId = byFid.id;
      }
    }

    const created = await prisma.comment.create({
      data: {
        outfitId,
        authorId: resolvedAuthorId,
        content,
      },
      include: { author: true },
    });

    return NextResponse.json({
      id: created.id,
      outfitId: created.outfitId,
      content: created.content,
      createdAt: created.createdAt,
      author: {
        name: created.author.name ?? created.author.username,
        avatar: created.author.avatarUrl ?? "",
        fid: created.author.fid ?? created.author.username,
      },
    });
  } catch (error) {
    console.error("POST /api/comments error", error);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lookId = searchParams.get("lookId");
    if (!lookId) return NextResponse.json([], { status: 200 });

    const comments = await prisma.comment.findMany({
      where: { lookId },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });

    const payload = comments.map((c) => ({
      id: c.id,
      lookId: c.lookId,
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
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lookId, authorId, content } = body as {
      lookId: string;
      authorId: string;
      content: string;
    };

    if (!lookId || !authorId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Security: basic input length checks
    if (content.length > 500) {
      return NextResponse.json({ error: "Comment too long" }, { status: 400 });
    }

    const created = await prisma.comment.create({
      data: {
        lookId,
        authorId,
        content,
      },
      include: { author: true },
    });

    return NextResponse.json({
      id: created.id,
      lookId: created.lookId,
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
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";



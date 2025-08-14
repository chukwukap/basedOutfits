import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const match = url.pathname.match(/\/api\/lookbooks\/([^/]+)\/items/);
    const lookbookId = match ? decodeURIComponent(match[1]) : "";
    const body = await req.json();
    const { lookId, addedById } = body as { lookId: string; addedById: string };

    if (!lookbookId || !lookId || !addedById) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Resolve addedById as id or username
    let resolvedAddedById = addedById;
    const byId = await prisma.user.findUnique({ where: { id: addedById } });
    if (!byId) {
      const byUsername = await prisma.user.findUnique({ where: { username: addedById } });
      if (byUsername) resolvedAddedById = byUsername.id;
    }

    const created = await prisma.lookbookItem.create({
      data: { lookId, lookbookId, addedById: resolvedAddedById },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/lookbooks/[id]/items error", error);
    return NextResponse.json({ error: "Failed to add look to lookbook" }, { status: 500 });
  }
}



import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const match = url.pathname.match(/\/api\/wardrobes\/([^/]+)\/items/);
    const wardrobeId = match ? decodeURIComponent(match[1]) : "";
    const body = await req.json();
    const { outfitId, addedById } = body as {
      outfitId: string;
      addedById: string;
    };

    if (!wardrobeId || !outfitId || !addedById) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Resolve addedById as id or username
    let resolvedAddedById = addedById;
    const byId = await prisma.user.findUnique({ where: { id: addedById } });
    if (!byId) {
      const byUsername = await prisma.user.findUnique({
        where: { username: addedById },
      });
      if (byUsername) resolvedAddedById = byUsername.id;
    }

    const created = await prisma.wardrobeItem.create({
      data: { outfitId, wardrobeId, addedById: resolvedAddedById },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/wardrobes/[id]/items error", error);
    return NextResponse.json(
      { error: "Failed to add outfit to wardrobe" },
      { status: 500 },
    );
  }
}

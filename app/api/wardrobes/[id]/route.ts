import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function extractIdFromUrl(url: string): string | null {
  const match = new URL(url).pathname.match(/\/api\/wardrobes\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(req: Request) {
  try {
    const id = extractIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const wb = await prisma.wardrobe.findUnique({
      where: { id },
      include: { items: { include: { outfit: true } }, owner: true },
    });
    if (!wb) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(wb);
  } catch (error) {
    console.error("GET /api/wardrobes/[id] error", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const id = extractIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = await req.json();
    const { name, description, isPublic, coverImage } = body as Partial<{
      name: string;
      description: string | null;
      isPublic: boolean;
      coverImage: string | null;
    }>;

    const updated = await prisma.wardrobe.update({
      where: { id },
      data: { name, description, isPublic, coverImage },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/wardrobes/[id] error", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = extractIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await prisma.wardrobe.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/wardrobes/[id] error", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

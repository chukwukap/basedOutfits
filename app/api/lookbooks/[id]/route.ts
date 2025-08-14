import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function extractIdFromUrl(url: string): string | null {
  const match = new URL(url).pathname.match(/\/api\/lookbooks\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(req: Request) {
  try {
    const id = extractIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const lb = await prisma.lookbook.findUnique({
      where: { id },
      include: { items: { include: { look: true } }, owner: true },
    });
    if (!lb) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(lb);
  } catch (error) {
    console.error("GET /api/lookbooks/[id] error", error);
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

    const updated = await prisma.lookbook.update({
      where: { id },
      data: { name, description, isPublic, coverImage },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/lookbooks/[id] error", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = extractIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await prisma.lookbook.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/lookbooks/[id] error", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";



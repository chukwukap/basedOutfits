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

/**
 * Delete an outfit by id. Security considerations:
 * - We require a caller-supplied `authorId` (via header `x-author-id` or JSON body `{ authorId }`).
 * - We verify the `authorId` matches the outfit's persisted `authorId` to prevent arbitrary deletions.
 * - In a production environment, this should be backed by a real authentication mechanism
 *   (e.g., session/cookie, JWT, or signed Farcaster/Wallet proof) to prevent spoofing.
 * - We also perform a defensive, transactional cleanup of dependent rows to maintain referential integrity.
 */
export async function DELETE(req: Request) {
  try {
    const match = new URL(req.url).pathname.match(/\/api\/outfits\/([^/]+)/);
    const id = match ? decodeURIComponent(match[1]) : "";
    if (!id) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    // Accept authorId from header (preferred) or request body as fallback
    const headerAuthorId = req.headers.get("x-author-id")?.trim();
    let bodyAuthorId: string | undefined;
    try {
      // Best-effort parse; DELETE may not carry a body in some clients
      const text = await req.text();
      if (text) {
        const parsed = JSON.parse(text) as { authorId?: string };
        bodyAuthorId = parsed.authorId;
      }
    } catch {
      // ignore malformed body; we'll rely on header value
    }
    const providedAuthorId = headerAuthorId || bodyAuthorId;
    if (!providedAuthorId) {
      return NextResponse.json(
        { error: "Missing authorId (x-author-id header or JSON body)" },
        { status: 401 },
      );
    }

    const outfit = await prisma.outfit.findUnique({ where: { id } });
    if (!outfit) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (outfit.authorId !== providedAuthorId) {
      return NextResponse.json(
        { error: "Not authorized to delete this outfit" },
        { status: 403 },
      );
    }

    // Transactional cleanup to maintain referential integrity
    await prisma.$transaction([
      // Tips: retain records but detach from outfit for auditability
      prisma.tip.updateMany({ where: { outfitId: id }, data: { outfitId: null } }),
      prisma.comment.deleteMany({ where: { outfitId: id } }),
      prisma.like.deleteMany({ where: { outfitId: id } }),
      prisma.wardrobeItem.deleteMany({ where: { outfitId: id } }),
      prisma.outfit.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/outfits/[id] error", error);
    return NextResponse.json(
      { error: "Failed to delete outfit" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";

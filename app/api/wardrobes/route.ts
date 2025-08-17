import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId") || undefined;
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10);
    const isPublicOnly = searchParams.get("public") !== "0";

    const wardrobes = await prisma.wardrobe.findMany({
      where: {
        ...(ownerId ? { ownerId } : {}),
        ...(isPublicOnly ? { isPublic: true } : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: Math.min(Math.max(limit, 1), 50),
      include: {
        owner: true,
        items: { select: { id: true } },
      },
    });

    const payload = wardrobes.map((wb) => ({
      id: wb.id,
      name: wb.name,
      description: wb.description ?? "",
      coverImage: wb.coverImage ?? "",
      isPublic: wb.isPublic,
      createdAt: wb.createdAt,
      updatedAt: wb.updatedAt,
      ownerId: wb.ownerId,
      wardrobeCount: wb.items.length,
      creator: wb.owner
        ? {
            username: wb.owner.username,
            name: wb.owner.name ?? wb.owner.username,
            avatar: wb.owner.avatarUrl ?? "",
          }
        : undefined,
    }));

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      ownerId,
      name,
      description,
      isPublic,
      coverImage,
    }: {
      ownerId: string;
      name: string;
      description?: string;
      isPublic?: boolean;
      coverImage?: string;
    } = body;

    if (!ownerId || !name) {
      return NextResponse.json(
        { error: "ownerId and name are required" },
        { status: 400 },
      );
    }

    const created = await prisma.wardrobe.create({
      data: {
        ownerId,
        name,
        description: description ?? null,
        isPublic: isPublic ?? true,
        coverImage: coverImage ?? null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const ownerId = searchParams.get("ownerId") || undefined;
//     const limit = Number.parseInt(searchParams.get("limit") || "20", 10);
//     const isPublicOnly = searchParams.get("public") !== "0";

//     const wardrobes = await prisma.wardrobe.findMany({
//       where: {
//         ...(ownerId ? { ownerId } : {}),
//         ...(isPublicOnly ? { isPublic: true } : {}),
//       },
//       orderBy: { updatedAt: "desc" },
//       take: Math.min(Math.max(limit, 1), 50),
//       include: {
//         owner: true,
//         items: true,
//       },
//     });

//     const payload = wardrobes.map((wb) => ({
//       id: wb.id,
//       name: wb.name,
//       description: wb.description ?? "",
//       coverImage: wb.coverImage ?? "",
//       isPublic: wb.isPublic,
//       createdAt: wb.createdAt,
//       updatedAt: lb.updatedAt,
//       ownerId: wb.ownerId,
//       wardrobeCount: wb.items.length,
//       followers: 0,
//       isFollowing: false,
//       creator: {

//         username: wb.owner.username,
//         name: wb.owner.name ?? wb.owner.username,
//         avatar: wb.owner.avatarUrl ?? "",
//       },
//     }));

//     return NextResponse.json(payload);
//   } catch (error) {
//     console.error("GET /api/wardrobes error", error);
//     return NextResponse.json(
//       { error: "Failed to fetch wardrobes" },
//       { status: 500 },
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { ownerId, name, description, coverImage, isPublic } = body as {
//       ownerId: string;
//       name: string;
//       description?: string;
//       coverImage?: string;
//       isPublic?: boolean;
//     };

//     if (!ownerId || !name)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     // Resolve owner id: allow passing either user id or username (e.g., "demo")
//     let resolvedOwnerId = ownerId;
//     const byId = await prisma.user.findUnique({ where: { id: ownerId } });
//     if (!byId) {
//       const byUsername = await prisma.user.findUnique({
//         where: { username: ownerId },
//       });
//       if (byUsername) {
//         resolvedOwnerId = byUsername.id;
//       } else if (ownerId === "demo" && process.env.NODE_ENV !== "production") {
//         // Dev convenience: create demo user automatically
//         const demo = await prisma.user.upsert({
//           where: { username: "demo" },
//           update: {},
//           create: {
//             username: "demo",
//             name: "Demo User",
//             avatarUrl: "/outfits/diverse-group-profile.png",
//           },
//         });
//         resolvedOwnerId = demo.id;
//       } else {
//         return NextResponse.json({ error: "Owner not found" }, { status: 400 });
//       }
//     }

//     const created = await prisma.wardrobe.create({
//       data: {
//         ownerId: resolvedOwnerId,
//         name,
//         description,
//         coverImage,
//         isPublic: !!isPublic,
//       },
//     });

//     return NextResponse.json(created, { status: 201 });
//   } catch (error) {
//     console.error("POST /api/wardrobes error", error);
//     return NextResponse.json(
//       { error: "Failed to create wardrobe" },
//       { status: 500 },
//     );
//   }
// }

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    // Ensure a demo user exists
    const demoUser = await prisma.user.upsert({
      where: { username: "demo" },
      update: {},
      create: {
        username: "demo",
        name: "Demo User",
        avatarUrl: "/looks/diverse-group-profile.png",
        bio: "Demo account",
      },
    });

    // Seed a few looks if none
    const lookCount = await prisma.look.count();
    if (lookCount === 0) {
      await prisma.look.createMany({
        data: [
          {
            authorId: demoUser.id,
            caption: "Summer Vibes",
            description: "Perfect outfit for a sunny day in the city.",
            imageUrls: ["/looks/fashionable-summer-outfit.png"],
            tags: ["SummerFits", "Streetwear", "Accessories"],
            brands: ["Zara", "Nike"],
            location: "New York",
            isPublic: true,
          },
          {
            authorId: demoUser.id,
            caption: "Evening Elegance",
            description: "Sophisticated look for dinner dates.",
            imageUrls: ["/looks/elegant-evening-dress.png"],
            tags: ["OfficeChic", "Minimalist", "DateNight"],
            brands: ["H&M", "Mango"],
            location: "Paris",
            isPublic: true,
          },
        ],
      });
    }

    // Seed one lookbook
    const lbCount = await prisma.lookbook.count();
    if (lbCount === 0) {
      await prisma.lookbook.create({
        data: {
          ownerId: demoUser.id,
          name: "Minimalist Chic",
          description: "Clean lines and neutral tones",
          coverImage: "/looks/business-casual-outfit.png",
          isPublic: true,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/dev/seed error", error);
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

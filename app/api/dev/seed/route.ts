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

    // Seed diverse looks across cultures and styles if none
    const lookCount = await prisma.look.count();
    if (lookCount === 0) {
      await prisma.look.createMany({
        data: [
          // African streetwear (Lagos)
          {
            authorId: demoUser.id,
            caption: "Lagos Street Style",
            description: "Bold Ankara patterns with modern sneakers.",
            imageUrls: [
              "https://images.unsplash.com/photo-1553514029-1318c9127859",
            ],
            tags: ["African", "Ankara", "Streetwear"],
            brands: ["Local Tailor"],
            location: "Lagos",
            isPublic: true,
          },
          // African formal (Nairobi)
          {
            authorId: demoUser.id,
            caption: "Kitenge Elegance",
            description: "Contemporary Kitenge suit for evening events.",
            imageUrls: [
              "https://images.unsplash.com/photo-1519741497674-611481863552",
            ],
            tags: ["African", "Kitenge", "Formal"],
            brands: ["Custom"],
            location: "Nairobi",
            isPublic: true,
          },
          // Asian casual (Tokyo)
          {
            authorId: demoUser.id,
            caption: "Tokyo Minimalist",
            description: "Clean lines, neutral palette, understated layers.",
            imageUrls: [
              "https://images.unsplash.com/photo-1517940310602-75bc0f6798e0",
            ],
            tags: ["Asian", "Minimalist", "Urban"],
            brands: ["Uniqlo", "Comme des Garçons"],
            location: "Tokyo",
            isPublic: true,
          },
          // Asian traditional-fusion (Seoul)
          {
            authorId: demoUser.id,
            caption: "Hanbok Fusion",
            description: "Classic hanbok silhouette with modern fabrics.",
            imageUrls: [
              "https://images.unsplash.com/photo-1578926374373-46b6b5a4513d",
            ],
            tags: ["Asian", "Traditional", "Fusion"],
            brands: ["Independent"],
            location: "Seoul",
            isPublic: true,
          },
          // American streetwear (NYC)
          {
            authorId: demoUser.id,
            caption: "NYC Street Classic",
            description: "Denim, tees, and high-tops—timeless combo.",
            imageUrls: [
              "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
            ],
            tags: ["American", "Streetwear", "Denim"],
            brands: ["Levi's", "Converse"],
            location: "New York",
            isPublic: true,
          },
          // American evening (LA)
          {
            authorId: demoUser.id,
            caption: "LA Red Carpet Ready",
            description: "Elegant evening dress with metallic accents.",
            imageUrls: [
              "https://images.unsplash.com/photo-1519741497674-611481863552",
            ],
            tags: ["American", "Evening", "Elegant"],
            brands: ["Vintage", "Mango"],
            location: "Los Angeles",
            isPublic: true,
          },
          // European chic (Paris)
          {
            authorId: demoUser.id,
            caption: "Parisian Chic",
            description: "Trench coat, tailored trousers, silk scarf.",
            imageUrls: [
              "https://images.unsplash.com/photo-1520975916090-3105956dac38",
            ],
            tags: ["European", "Chic", "Trench"],
            brands: ["Burberry", "COS"],
            location: "Paris",
            isPublic: true,
          },
          // Indian festive (Mumbai)
          {
            authorId: demoUser.id,
            caption: "Festive Sari Glow",
            description: "Traditional sari with contemporary drape.",
            imageUrls: [
              "https://images.unsplash.com/photo-1596464716121-e1ee26cfe7f6",
            ],
            tags: ["Indian", "Festive", "Traditional"],
            brands: ["Local Designer"],
            location: "Mumbai",
            isPublic: true,
          },
          // Middle Eastern modern (Dubai)
          {
            authorId: demoUser.id,
            caption: "Desert Modern",
            description: "Flowing silhouettes and refined neutrals.",
            imageUrls: [
              "https://images.unsplash.com/photo-1503342217505-b0a15cf70489",
            ],
            tags: ["MiddleEast", "Modern", "Neutrals"],
            brands: ["Independent"],
            location: "Dubai",
            isPublic: true,
          },
          // Latin American color (São Paulo)
          {
            authorId: demoUser.id,
            caption: "São Paulo Colors",
            description: "Vibrant prints with relaxed tailoring.",
            imageUrls: [
              "https://images.unsplash.com/photo-1516826957135-700dedea698c",
            ],
            tags: ["Latin", "Vibrant", "Casual"],
            brands: ["H&M", "Zara"],
            location: "São Paulo",
            isPublic: true,
          },
          // Scandinavian minimalist (Copenhagen)
          {
            authorId: demoUser.id,
            caption: "Scandi Minimal",
            description: "Monochrome layers with functional design.",
            imageUrls: [
              "https://images.unsplash.com/photo-1514809811547-777d130a4211",
            ],
            tags: ["Scandinavian", "Minimalist", "Functional"],
            brands: ["Acne Studios", "Arket"],
            location: "Copenhagen",
            isPublic: true,
          },
        ],
      });
    }

    // Seed several lookbooks
    const lbCount = await prisma.lookbook.count();
    if (lbCount === 0) {
      await prisma.lookbook.createMany({
        data: [
          {
            ownerId: demoUser.id,
            name: "Minimalist Chic",
            description: "Clean lines and neutral tones",
            coverImage:
              "https://images.unsplash.com/photo-1514809811547-777d130a4211",
            isPublic: true,
          },
          {
            ownerId: demoUser.id,
            name: "Global Streetwear",
            description: "Curated urban styles from across the world",
            coverImage:
              "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
            isPublic: true,
          },
          {
            ownerId: demoUser.id,
            name: "Festive & Traditional",
            description: "Cultural celebrations and heritage wear",
            coverImage:
              "https://images.unsplash.com/photo-1596464716121-e1ee26cfe7f6",
            isPublic: true,
          },
        ],
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/dev/seed error", error);
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

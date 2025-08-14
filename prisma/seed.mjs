// Seed script for Prisma (Node ESM)
// Usage:
//   pnpm prisma migrate dev
//   pnpm db:seed

import { PrismaClient } from "../lib/generated/prisma/index.js";

const prisma = new PrismaClient();

async function upsertUsers() {
  const sampleUsers = [
    {
      username: "demo",
      fid: "1000",
      name: "Demo User",
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=60",
      walletAddress: null,
    },
    {
      username: "lagos_style",
      fid: "2001",
      name: "Aisha",
      avatarUrl:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=256&q=60",
      walletAddress: null,
    },
    {
      username: "tokyo_minimal",
      fid: "2002",
      name: "Kenji",
      avatarUrl:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=256&q=60",
      walletAddress: null,
    },
    {
      username: "paris_chic",
      fid: "2003",
      name: "Camille",
      avatarUrl:
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=256&q=60",
      walletAddress: null,
    },
    {
      username: "mumbai_festive",
      fid: "2004",
      name: "Arjun",
      avatarUrl:
        "https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=256&q=60",
      walletAddress: null,
    },
  ];

  const results = [];
  for (const u of sampleUsers) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {
        fid: u.fid,
        name: u.name,
        avatarUrl: u.avatarUrl,
        walletAddress: u.walletAddress,
      },
      create: u,
    });
    results.push(user);
  }
  return results;
}

async function seedLooks(users) {
  const byUsername = Object.fromEntries(users.map((u) => [u.username, u]));

  const current = await prisma.look.count();
  if (current > 0) return;

  const looks = [
    // African streetwear (Lagos)
    {
      authorId: byUsername.demo.id,
      caption: "Lagos Street Style",
      description: "Bold Ankara patterns with modern sneakers.",
      imageUrls: [
        "https://images.unsplash.com/photo-1553514029-1318c9127859?auto=format&fit=crop&w=1080&q=80",
      ],
      tags: ["African", "Ankara", "Streetwear"],
      brands: ["Local Tailor"],
      location: "Lagos",
      isPublic: true,
    },
    // African formal (Nairobi)
    {
      authorId: byUsername.demo.id,
      caption: "Kitenge Elegance",
      description: "Contemporary Kitenge suit for evening events.",
      imageUrls: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1080&q=80",
      ],
      tags: ["African", "Kitenge", "Formal"],
      brands: ["Custom"],
      location: "Nairobi",
      isPublic: true,
    },
    // Asian casual (Tokyo)
    {
      authorId: byUsername.tokyo_minimal.id,
      caption: "Tokyo Minimalist",
      description: "Clean lines, neutral palette, understated layers.",
      imageUrls: [
        "https://images.unsplash.com/photo-1517940310602-75bc0f6798e0?auto=format&fit=crop&w=1080&q=80",
      ],
      tags: ["Asian", "Minimalist", "Urban"],
      brands: ["Uniqlo", "Comme des Garçons"],
      location: "Tokyo",
      isPublic: true,
    },
    // Asian traditional-fusion (Seoul)
    {
      authorId: byUsername.tokyo_minimal.id,
      caption: "Hanbok Fusion",
      description: "Classic hanbok silhouette with modern fabrics.",
      imageUrls: [
        "https://images.unsplash.com/photo-1578926374373-46b6b5a4513d?auto=format&fit=crop&w=1080&q=80",
      ],
      tags: ["Asian", "Traditional", "Fusion"],
      brands: ["Independent"],
      location: "Seoul",
      isPublic: true,
    },
    // American streetwear (NYC)
    {
      authorId: byUsername.demo.id,
      caption: "NYC Street Classic",
      description: "Denim, tees, and high-tops—timeless combo.",
      imageUrls: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1080&q=80",
      ],
      tags: ["American", "Streetwear", "Denim"],
      brands: ["Levi's", "Converse"],
      location: "New York",
      isPublic: true,
    },
    // American evening (LA)
    {
      authorId: byUsername.paris_chic.id,
      caption: "LA Red Carpet Ready",
      description: "Elegant evening dress with metallic accents.",
      imageUrls: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1080&q=80",
      ],
      tags: ["American", "Evening", "Elegant"],
      brands: ["Vintage", "Mango"],
      location: "Los Angeles",
      isPublic: true,
    },
    // European chic (Paris)
    {
      authorId: byUsername.paris_chic.id,
      caption: "Parisian Chic",
      description: "Trench coat, tailored trousers, silk scarf.",
      imageUrls: [
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1080&q=80",
      ],
      tags: ["European", "Chic", "Trench"],
      brands: ["Burberry", "COS"],
      location: "Paris",
      isPublic: true,
    },
    // Indian festive (Mumbai)
    {
      authorId: byUsername.mumbai_festive.id,
      caption: "Festive Sari Glow",
      description: "Traditional sari with contemporary drape.",
      imageUrls: [
        "https://images.unsplash.com/photo-1596464716121-e1ee26cfe7f6?auto=format&fit=crop&w=1080&q=80",
      ],
      tags: ["Indian", "Festive", "Traditional"],
      brands: ["Local Designer"],
      location: "Mumbai",
      isPublic: true,
    },
    // Middle Eastern modern (Dubai)
    {
      authorId: byUsername.demo.id,
      caption: "Desert Modern",
      description: "Flowing silhouettes and refined neutrals.",
      imageUrls: [
        "https://images.unsplash.com/photo-1503342217505-b0a15cf70489?auto=format&fit=crop&w=1080&q=80",
      ],
      tags: ["MiddleEast", "Modern", "Neutrals"],
      brands: ["Independent"],
      location: "Dubai",
      isPublic: true,
    },
    // Latin American color (São Paulo)
    {
      authorId: byUsername.lagos_style.id,
      caption: "São Paulo Colors",
      description: "Vibrant prints with relaxed tailoring.",
      imageUrls: [
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1080&q=80",
      ],
      tags: ["Latin", "Vibrant", "Casual"],
      brands: ["H&M", "Zara"],
      location: "São Paulo",
      isPublic: true,
    },
    // Scandinavian minimalist (Copenhagen)
    {
      authorId: byUsername.paris_chic.id,
      caption: "Scandi Minimal",
      description: "Monochrome layers with functional design.",
      imageUrls: [
        "https://images.unsplash.com/photo-1514809811547-777d130a4211?auto=format&fit=crop&w=1080&q=80",
      ],
      tags: ["Scandinavian", "Minimalist", "Functional"],
      brands: ["Acne Studios", "Arket"],
      location: "Copenhagen",
      isPublic: true,
    },
  ];

  for (const l of looks) {
    await prisma.look.create({ data: l });
  }
}

async function seedLookbooks(users) {
  const owner = users.find((u) => u.username === "demo")!;
  const count = await prisma.lookbook.count();
  if (count > 0) return;

  const lookbooks = [
    {
      ownerId: owner.id,
      name: "Minimalist Chic",
      description: "Clean lines and neutral tones",
      coverImage:
        "https://images.unsplash.com/photo-1514809811547-777d130a4211?auto=format&fit=crop&w=1080&q=80",
      isPublic: true,
    },
    {
      ownerId: owner.id,
      name: "Global Streetwear",
      description: "Curated urban styles from across the world",
      coverImage:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1080&q=80",
      isPublic: true,
    },
    {
      ownerId: owner.id,
      name: "Festive & Traditional",
      description: "Cultural celebrations and heritage wear",
      coverImage:
        "https://images.unsplash.com/photo-1596464716121-e1ee26cfe7f6?auto=format&fit=crop&w=1080&q=80",
      isPublic: true,
    },
  ];

  for (const lb of lookbooks) {
    await prisma.lookbook.create({ data: lb });
  }
}

async function main() {
  const users = await upsertUsers();
  await seedLooks(users);
  await seedLookbooks(users);
  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



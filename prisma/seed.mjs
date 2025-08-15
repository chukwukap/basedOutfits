// Seed script for Prisma (Node ESM)
// Usage:
//   pnpm prisma migrate dev
//   pnpm db:seed

import { PrismaClient } from "../lib/generated/prisma/index.js";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function readSeedData() {
  const filePath = path.join(process.cwd(), "prisma", "seed-data.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function buildUnsplashQuery(look) {
  const tags = (look.tags || []).map((t) => t.toLowerCase());
  const caption = (look.caption || "").toLowerCase();
  const location = (look.location || "").toLowerCase();

  const parts = new Set();
  let orientation = "portrait";

  // Cultural / specific garments
  if (
    tags.includes("senator") ||
    tags.includes("igbo") ||
    caption.includes("senator")
  ) {
    parts.add("nigerian senator wear");
    parts.add("male");
  }
  if (
    tags.includes("sari") ||
    caption.includes("sari") ||
    tags.includes("indian")
  ) {
    parts.add("indian sari");
    parts.add("woman");
  }
  if (tags.includes("hanbok") || caption.includes("hanbok")) {
    parts.add("korean hanbok");
  }

  // Style categories
  if (tags.includes("streetwear") || caption.includes("street")) {
    parts.add("streetwear");
    parts.add("urban");
    parts.add("full body");
  }
  if (
    tags.includes("minimalist") ||
    tags.includes("scandinavian") ||
    tags.includes("functional")
  ) {
    parts.add("minimalist fashion");
    parts.add("monochrome");
    parts.add("studio");
  }
  if (tags.includes("evening") || tags.includes("elegant")) {
    if (caption.includes("dress") || tags.includes("dress")) {
      parts.add("evening dress");
      parts.add("woman");
    } else {
      parts.add("tuxedo suit");
      parts.add("men");
    }
  }
  if (
    tags.includes("traditional") ||
    tags.includes("festive") ||
    tags.includes("kitenge") ||
    tags.includes("ankara")
  ) {
    parts.add("traditional attire");
  }

  // Location hints
  if (location) parts.add(location);

  // Fallbacks
  if (parts.size === 0) {
    parts.add("fashion");
    parts.add("portrait");
    parts.add("full body");
  }

  const query = Array.from(parts).join(" ");
  return { query, orientation };
}

async function searchUnsplashOne({ query, orientation = "portrait" }) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("content_filter", "high");
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const first = data?.results?.[0];
  if (!first) return null;
  return first.urls?.regular || first.urls?.full || first.links?.html || null;
}

async function upsertUsers() {
  const { users: sampleUsers } = readSeedData();

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
  const { looks: lookInputs } = readSeedData();
  const useUnsplash = process.env.USE_UNSPLASH_FOR_SEED === "1";

  for (const l of lookInputs) {
    const authorId = byUsername[l.authorUsername]?.id;
    if (!authorId) continue;

    let imageUrls = l.imageUrls || [];
    if (useUnsplash || imageUrls.length === 0) {
      const { query, orientation } = buildUnsplashQuery(l);
      try {
        const u = await searchUnsplashOne({ query, orientation });
        if (u) imageUrls = [u];
        await new Promise((r) => setTimeout(r, 250));
      } catch {}
    }

    await prisma.look.create({
      data: {
        authorId,
        caption: l.caption,
        description: l.description,
        imageUrls,
        tags: l.tags,
        brands: l.brands,
        location: l.location,
        isPublic: l.isPublic,
      },
    });
  }
}

async function seedLookbooks(users) {
  const { lookbooks: lookbookInputs } = readSeedData();
  const count = await prisma.lookbook.count();
  if (count > 0) return;
  const byUsername = Object.fromEntries(users.map((u) => [u.username, u]));
  const lookbooks = lookbookInputs
    .map((lb) => ({
      ownerId: byUsername[lb.ownerUsername]?.id,
      name: lb.name,
      description: lb.description,
      coverImage: lb.coverImage,
      isPublic: lb.isPublic,
    }))
    .filter((lb) => !!lb.ownerId);

  for (const lb of lookbooks) {
    await prisma.lookbook.create({ data: lb });
  }
}

async function seedLookbookItems() {
  // Fetch created lookbooks and looks
  const lookbooks = await prisma.lookbook.findMany({
    include: { owner: true },
  });
  const looks = await prisma.look.findMany();

  if (lookbooks.length === 0 || looks.length === 0) return;

  const byName = Object.fromEntries(lookbooks.map((lb) => [lb.name, lb]));

  const minimalLb = byName["Minimalist Chic"];
  const streetLb = byName["Global Streetwear"];
  const festiveLb = byName["Festive & Traditional"];

  const classify = (tags) => {
    const lower = (tags || []).map((t) => t.toLowerCase());
    const hasAny = (...keys) =>
      keys.some((k) => lower.includes(k.toLowerCase()));

    const targets = [];
    if (hasAny("minimalist", "scandinavian", "functional", "chic", "trench")) {
      if (minimalLb) targets.push(minimalLb);
    }
    if (hasAny("streetwear", "denim", "urban", "ankara", "latin", "casual")) {
      if (streetLb) targets.push(streetLb);
    }
    if (hasAny("traditional", "festive", "kitenge", "indian", "middleeast")) {
      if (festiveLb) targets.push(festiveLb);
    }
    // Fallback
    if (targets.length === 0 && streetLb) targets.push(streetLb);
    return targets;
  };

  for (const look of looks) {
    const targets = classify(look.tags);
    for (const lb of targets) {
      try {
        await prisma.lookbookItem.create({
          data: {
            lookId: look.id,
            lookbookId: lb.id,
            addedById: lb.ownerId,
          },
        });
      } catch {
        // ignore duplicates due to @@unique([lookId, lookbookId])
      }
    }
  }
}

async function main() {
  const users = await upsertUsers();
  await seedLooks(users);
  await seedLookbooks(users);
  await seedLookbookItems();
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

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
  const looks = lookInputs
    .map((l) => ({
      authorId: byUsername[l.authorUsername]?.id,
      caption: l.caption,
      description: l.description,
      imageUrls: l.imageUrls,
      tags: l.tags,
      brands: l.brands,
      location: l.location,
      isPublic: l.isPublic,
    }))
    .filter((l) => !!l.authorId);

  for (const l of looks) {
    await prisma.look.create({ data: l });
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

// Prisma Seed Script (Node ESM, 2025)
// Usage:
//   pnpm prisma migrate dev
//   pnpm db:seed

import { PrismaClient } from "../lib/generated/prisma/index.js";
import fs from "fs";
import path from "path";

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Reads and parses the seed data JSON file.
 * @returns {Object} Parsed seed data.
 */
function readSeedData() {
  const filePath = path.join(process.cwd(), "prisma", "seed-data.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

/**
 * Derives the season for an outfit based on tags and text.
 * @param {Object} outfit
 * @returns {string|undefined}
 */
function deriveSeason(outfit) {
  const t = (outfit.tags || []).map((x) => x.toLowerCase()).join(" ");
  const txt = `${(outfit.caption || "").toLowerCase()} ${(outfit.description || "").toLowerCase()} ${(outfit.location || "").toLowerCase()}`;
  if (/winter|coat|jacket|snow|cold/.test(txt)) return "winter";
  if (/summer|beach|linen|hot/.test(txt)) return "summer";
  if (/spring|bloom|light layer/.test(txt)) return "spring";
  if (/fall|autumn|trench/.test(txt)) return "fall";
  if (t.includes("scandinavian")) return "winter";
  if (t.includes("coastal")) return "summer";
  return undefined;
}

/**
 * Derives the occasion for an outfit based on tags and text.
 * @param {Object} outfit
 * @returns {string}
 */
function deriveOccasion(outfit) {
  const t = (outfit.tags || []).map((x) => x.toLowerCase());
  const txt = `${(outfit.caption || "").toLowerCase()} ${(outfit.description || "").toLowerCase()}`;
  if (t.includes("evening") || /red carpet|gala|tuxedo/.test(txt))
    return "evening";
  if (
    t.includes("traditional") ||
    t.includes("festive") ||
    /wedding|festival/.test(txt)
  )
    return "festive";
  if (t.includes("streetwear") || t.includes("urban")) return "casual";
  if (t.includes("formal") || /tailored|suit/.test(txt)) return "formal";
  return "casual";
}

/**
 * Derives color keywords from an outfit's caption and description.
 * @param {Object} outfit
 * @returns {string[]|undefined}
 */
function deriveColors(outfit) {
  const base =
    `${outfit.caption || ""} ${outfit.description || ""}`.toLowerCase();
  const colors = [];
  const map = [
    ["navy", /navy/],
    ["cream", /cream/],
    ["red", /red/],
    ["black", /black/],
    ["white", /white/],
    ["beige", /beige/],
    ["green", /green/],
    ["blue", /blue/],
    ["brown", /brown/],
  ];
  for (const [name, rx] of map) if (rx.test(base)) colors.push(name);
  return colors.length ? colors : undefined;
}

/**
 * Derives details for an outfit, including items and brands.
 * @param {Object} outfit
 * @returns {Object}
 */
function deriveDetails(outfit) {
  const items = [];
  const brands = outfit.brands || [];
  const t = (outfit.tags || []).map((x) => x.toLowerCase());
  if (t.includes("senator"))
    items.push({ type: "two-piece", name: "Senator set" });
  if (t.includes("sari")) items.push({ type: "dress", name: "Sari" });
  if (t.includes("trench")) items.push({ type: "coat", name: "Trench coat" });
  if (t.includes("denim")) items.push({ type: "jacket", name: "Denim jacket" });
  if (t.includes("techwear"))
    items.push({ type: "jacket", name: "Techwear shell" });
  if (items.length === 0) items.push({ type: "top", name: "Styled top" });
  const brandItems = brands.map((b) => ({ brand: b }));
  return { items, brandItems };
}

/**
 * Extracts tag-like keywords from an outfit record in DB.
 * Uses details.tags when present; falls back to caption/description keyword heuristics.
 * @param {Object} outfitRecord
 * @returns {string[]}
 */
function getTagsFromOutfitRecord(outfitRecord) {
  const tags = [
    ...(outfitRecord.details && Array.isArray(outfitRecord.details.tags)
      ? outfitRecord.details.tags
      : []),
  ];
  const text = `${(outfitRecord.caption || "").toLowerCase()} ${(outfitRecord.description || "").toLowerCase()}`;
  const addIf = (word, rx) => {
    if (
      !tags.map((t) => String(t).toLowerCase()).includes(word) &&
      rx.test(text)
    ) {
      tags.push(word);
    }
  };
  addIf("minimalist", /minimal/);
  addIf("scandinavian", /scandi|copenhagen|nordic/);
  addIf("functional", /functional|technical/);
  addIf("trench", /trench/);
  addIf("streetwear", /streetwear|street style|urban/);
  addIf("denim", /denim/);
  addIf("ankara", /ankara/);
  addIf("latin", /são paulo|rio|carnival|latin/);
  addIf("casual", /casual|weekend|coffee run|cozy/);
  addIf("traditional", /traditional|kaftan|hanbok|sari|senator/);
  addIf("festive", /festive|festival|carnival|owambe/);
  addIf("kitenge", /kitenge/);
  addIf("indian", /mumbai|indian|sari/);
  addIf("middleeast", /dubai|casablanca|morocco|medina|middle east/);
  addIf("igbo", /igbo/);
  addIf("senator", /senator/);
  return tags;
}

/**
 * Upserts users from seed data.
 * @returns {Promise<Array>} Array of upserted user records.
 */
async function upsertUsers() {
  const { users: sampleUsers } = readSeedData();

  const results = [];
  for (const u of sampleUsers) {
    // Security: Only upsert allowed fields, never raw user input
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {
        fid: u.fid,
        name: u.name,
        avatarUrl: u.avatarUrl,
        walletAddress: u.walletAddress,
        email: u.email,
        bio: u.bio,
        updatedAt: new Date(),
      },
      create: {
        username: u.username,
        fid: u.fid,
        name: u.name,
        avatarUrl: u.avatarUrl,
        walletAddress: u.walletAddress,
        email: u.email,
        bio: u.bio,
        // createdAt and updatedAt are handled by Prisma defaults
      },
    });
    results.push(user);
  }
  return results;
}

/**
 * Seeds outfits (Outfit model) from seed data.
 * @param {Array} users - Array of user records.
 */
async function seedOutfits(users) {
  const byUsername = Object.fromEntries(users.map((u) => [u.username, u]));

  const current = await prisma.outfit.count();
  if (current > 0) return;
  const { outfits: outfitInputs } = readSeedData();

  for (const o of outfitInputs) {
    const authorId = byUsername[o.authorUsername]?.id;
    if (!authorId) continue;

    const imageUrls =
      o.imageUrls && o.imageUrls.length > 0
        ? o.imageUrls
        : ["/outfits/placeholder.png"]; // Placeholder; replace in JSON later

    // Build details JSON and embed additional metadata that no longer exists as top-level columns
    const season = o.season ?? deriveSeason(o);
    const occasion = o.occasion ?? deriveOccasion(o);
    const colors = o.colors ?? deriveColors(o) ?? [];
    const baseDetails = o.details ?? deriveDetails(o);
    const details = {
      ...baseDetails,
      ...(o.tags ? { tags: o.tags } : {}),
      ...(o.brands ? { brands: o.brands } : {}),
      ...(o.location ? { location: o.location } : {}),
      ...(season ? { season } : {}),
      ...(occasion ? { occasion } : {}),
      ...(colors && colors.length ? { colors } : {}),
    };

    await prisma.outfit.create({
      data: {
        authorId,
        caption: o.caption,
        description: o.description,
        imageUrls,
        isPublic: typeof o.isPublic === "boolean" ? o.isPublic : true,
        details,
      },
    });
  }
}

/**
 * Seeds wardrobes (Wardrobe model) from seed data.
 * @param {Array} users - Array of user records.
 */
async function seedWardrobes(users) {
  const { wardrobes: wardrobeInputs } = readSeedData();
  const count = await prisma.wardrobe.count();
  if (count > 0) return;
  const byUsername = Object.fromEntries(users.map((u) => [u.username, u]));
  const wardrobes = wardrobeInputs
    .map((wb) => ({
      ownerId: byUsername[wb.ownerUsername]?.id,
      name: wb.name,
      description: wb.description,
      coverImage: wb.coverImage || "/outfits/placeholder.png", // Placeholder if missing
      isPublic: typeof wb.isPublic === "boolean" ? wb.isPublic : true,
    }))
    .filter((wb) => !!wb.ownerId);

  for (const wb of wardrobes) {
    await prisma.wardrobe.create({ data: wb });
  }
}

/**
 * Seeds wardrobe items (WardrobeItem model) by associating outfits to wardrobes.
 */
async function seedWardrobeItems() {
  // Fetch created wardrobes and outfits
  const wardrobes = await prisma.wardrobe.findMany({
    include: { owner: true },
  });
  const outfits = await prisma.outfit.findMany();

  if (wardrobes.length === 0 || outfits.length === 0) return;

  const byName = Object.fromEntries(wardrobes.map((wb) => [wb.name, wb]));

  // These names must match the seed-data.json and schema
  const minimalWb = byName["Minimalist Chic"];
  const streetWb = byName["Global Streetwear"];
  const festiveWb = byName["Festive & Traditional"];

  /**
   * Classifies outfits into wardrobes by tags.
   * @param {string[]} tags
   * @returns {Array} Array of wardrobe objects
   */
  const classify = (tags) => {
    const lower = (tags || []).map((t) => t.toLowerCase());
    const hasAny = (...keys) =>
      keys.some((k) => lower.includes(k.toLowerCase()));

    const targets = [];
    if (hasAny("minimalist", "scandinavian", "functional", "chic", "trench")) {
      if (minimalWb) targets.push(minimalWb);
    }
    if (hasAny("streetwear", "denim", "urban", "ankara", "latin", "casual")) {
      if (streetWb) targets.push(streetWb);
    }
    if (
      hasAny(
        "traditional",
        "festive",
        "kitenge",
        "indian",
        "middleeast",
        "igbo",
        "senator",
      )
    ) {
      if (festiveWb) targets.push(festiveWb);
    }
    // Fallback
    if (targets.length === 0 && streetWb) targets.push(streetWb);
    return targets;
  };

  for (const outfit of outfits) {
    const inferredTags = getTagsFromOutfitRecord(outfit);
    const targets = classify(inferredTags);
    for (const wb of targets) {
      try {
        await prisma.wardrobeItem.create({
          data: {
            wardrobeId: wb.id,
            outfitId: outfit.id,
            addedById: wb.ownerId,
          },
        });
      } catch {
        // ignore duplicates due to @@unique([wardrobeId, outfitId])
      }
    }
  }
}

/**
 * Main seed function.
 */
async function main() {
  const users = await upsertUsers();
  await seedOutfits(users);
  await seedWardrobes(users);
  await seedWardrobeItems();
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

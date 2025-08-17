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

function deriveSeason(look) {
  const t = (look.tags || []).map((x) => x.toLowerCase()).join(" ");
  const txt = `${(look.caption || "").toLowerCase()} ${(look.description || "").toLowerCase()} ${(look.location || "").toLowerCase()}`;
  if (/winter|coat|jacket|snow|cold/.test(txt)) return "winter";
  if (/summer|beach|linen|hot/.test(txt)) return "summer";
  if (/spring|bloom|light layer/.test(txt)) return "spring";
  if (/fall|autumn|trench/.test(txt)) return "fall";
  if (t.includes("scandinavian")) return "winter";
  if (t.includes("coastal")) return "summer";
  return undefined;
}

function deriveOccasion(look) {
  const t = (look.tags || []).map((x) => x.toLowerCase());
  const txt = `${(look.caption || "").toLowerCase()} ${(look.description || "").toLowerCase()}`;
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

function deriveColors(look) {
  const base = `${look.caption || ""} ${look.description || ""}`.toLowerCase();
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

function deriveDetails(look) {
  const items = [];
  const brands = look.brands || [];
  const t = (look.tags || []).map((x) => x.toLowerCase());
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

// Extract tag-like keywords from a Look record in DB (which lacks a tags column).
// Uses details.tags when present; falls back to caption/description keyword heuristics.
function getTagsFromLookRecord(lookRecord) {
  const tags = [
    ...((lookRecord.details && Array.isArray(lookRecord.details.tags))
      ? lookRecord.details.tags
      : []),
  ];
  const text = `${(lookRecord.caption || "").toLowerCase()} ${(lookRecord.description || "").toLowerCase()}`;
  const addIf = (word, rx) => {
    if (!tags.map((t) => String(t).toLowerCase()).includes(word) && rx.test(text)) {
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

  for (const l of lookInputs) {
    const authorId = byUsername[l.authorUsername]?.id;
    if (!authorId) continue;

    const imageUrls =
      l.imageUrls && l.imageUrls.length > 0
        ? l.imageUrls
        : ["/looks/placeholder.png"]; // Placeholder; replace in JSON later

    // Build details JSON and embed additional metadata that no longer exists as top-level columns
    const season = l.season ?? deriveSeason(l);
    const occasion = l.occasion ?? deriveOccasion(l);
    const colors = l.colors ?? deriveColors(l) ?? [];
    const baseDetails = l.details ?? deriveDetails(l);
    const details = {
      ...baseDetails,
      ...(l.tags ? { tags: l.tags } : {}),
      ...(l.brands ? { brands: l.brands } : {}),
      ...(l.location ? { location: l.location } : {}),
      ...(season ? { season } : {}),
      ...(occasion ? { occasion } : {}),
      ...(colors && colors.length ? { colors } : {}),
    };

    await prisma.look.create({
      data: {
        authorId,
        caption: l.caption,
        description: l.description,
        imageUrls,
        isPublic: l.isPublic,
        details,
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
      coverImage: lb.coverImage || "/looks/placeholder.png", // Placeholder if missing
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
      if (festiveLb) targets.push(festiveLb);
    }
    // Fallback
    if (targets.length === 0 && streetLb) targets.push(streetLb);
    return targets;
  };

  for (const look of looks) {
    const inferredTags = getTagsFromLookRecord(look);
    const targets = classify(inferredTags);
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

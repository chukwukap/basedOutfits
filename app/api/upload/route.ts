import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads are allowed" },
        { status: 400 },
      );
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 },
      );
    }

    // Local dev storage under public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name || "");
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(uploadsDir, safeName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error("POST /api/upload error", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

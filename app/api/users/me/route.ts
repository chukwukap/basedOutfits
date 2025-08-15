import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fid, username, name, avatarUrl, bio, walletAddress } = body as {
      fid: string;
      username: string;
      name?: string;
      avatarUrl?: string;
      bio?: string;
      walletAddress?: string;
    };

    if (!fid || !username) {
      return NextResponse.json(
        { error: "Missing fid or username" },
        { status: 400 },
      );
    }

    const user = await prisma.user.upsert({
      where: { username },
      update: {
        fid,
        name,
        avatarUrl,
        bio,
        walletAddress,
      },
      create: {
        username,
        fid,
        name,
        avatarUrl,
        bio,
        walletAddress,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("POST /api/users/me error", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const fid = searchParams.get("fid");
    if (!username && !fid) {
      return NextResponse.json(
        { error: "username or fid is required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [...(username ? [{ username }] : []), ...(fid ? [{ fid }] : [])],
      },
    });
    if (!user) return NextResponse.json({ user: null }, { status: 200 });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/me error", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

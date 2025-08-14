import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderId, receiverId, lookId, amount, currency, txHash } = body as {
      senderId: string;
      receiverId: string;
      lookId?: string;
      amount: number;
      currency: string;
      txHash?: string;
    };

    if (!senderId || !receiverId || !amount || !currency) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const tip = await prisma.tip.create({
      data: {
        senderId,
        receiverId,
        lookId,
        amount,
        currency,
        txHash,
      },
    });

    return NextResponse.json(tip, { status: 201 });
  } catch (error) {
    console.error("POST /api/tips error", error);
    return NextResponse.json({ error: "Failed to create tip" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";



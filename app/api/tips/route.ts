import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderId, receiverId, lookId, amount, currency, txHash } = body as {
      senderId: string; // may be id or username
      receiverId: string; // may be id or username
      lookId?: string;
      amount: number;
      currency: string;
      txHash?: string;
    };

    if (!senderId || !receiverId || !amount || !currency) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Resolve both ids
    const resolveUserId = async (idOrUsername: string) => {
      const byId = await prisma.user.findUnique({ where: { id: idOrUsername } });
      if (byId) return byId.id;
      const byUsername = await prisma.user.findUnique({ where: { username: idOrUsername } });
      if (byUsername) return byUsername.id;
      return idOrUsername; // fallback
    };
    const senderResolved = await resolveUserId(senderId);
    const receiverResolved = await resolveUserId(receiverId);

    const tip = await prisma.tip.create({
      data: {
        senderId: senderResolved,
        receiverId: receiverResolved,
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



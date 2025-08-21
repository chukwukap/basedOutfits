import { NextResponse } from "next/server";
import crypto from "crypto";
import { redis } from "@/lib/redis";

// Generate a fresh nonce and persist it with TTL when Redis is available.
// Also set an HttpOnly cookie as a fallback for environments without Redis.
export async function GET() {
  const nonce = crypto.randomBytes(16).toString("hex");

  // Prefer Redis so we can prevent nonce reuse securely across instances.
  if (redis) {
    // 10 minutes TTL is sufficient for a sign-in flow
    await redis.set(`nonce:${nonce}`, 1, { ex: 600 });
  }

  const res = new NextResponse(nonce, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store",
    },
  });

  // Fallback cookie: allows verification if Redis is not configured.
  res.cookies.set("siwb_nonce", nonce, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return res;
}

export const dynamic = "force-dynamic";



import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import crypto from "crypto";
import { redis } from "@/lib/redis";

const SESSION_COOKIE = "siwb_session";
const NONCE_COOKIE = "siwb_nonce";

type VerifyBody = {
  address?: `0x${string}`;
  message?: string;
  signature?: `0x${string}`;
};

const client = createPublicClient({ chain: base, transport: http() });

function getEnvSecret(): string | null {
  return process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || null;
}

function base64url(input: Buffer | string): string {
  return (typeof input === "string" ? Buffer.from(input) : input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signSession(payload: object, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const mac = crypto.createHmac("sha256", secret).update(data).digest();
  const signature = base64url(mac);
  return `${data}.${signature}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VerifyBody;
    const { address, message, signature } = body;

    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: "Missing address, message, or signature" },
        { status: 400 },
      );
    }

    // Extract the SIWE nonce from the message body ("... at <nonce>")
    const nonceFromMessage = message.match(/at (\w{32})$/)?.[1] ?? null;

    if (!nonceFromMessage) {
      return NextResponse.json({ error: "Missing nonce in message" }, { status: 400 });
    }

    // Enforce single-use nonce: prefer Redis; otherwise fall back to cookie.
    if (redis) {
      const key = `nonce:${nonceFromMessage}`;
      const exists = await redis.get<number | string | null>(key);
      if (!exists) {
        return NextResponse.json(
          { error: "Invalid or reused nonce" },
          { status: 400 },
        );
      }
      await redis.del(key);
    } else {
      const cookieNonce = req.cookies.get(NONCE_COOKIE)?.value;
      if (!cookieNonce || cookieNonce !== nonceFromMessage) {
        return NextResponse.json(
          { error: "Invalid or reused nonce" },
          { status: 400 },
        );
      }
    }

    // Verify the message signature per EIP-4361 (ERC-6492 handled by viem)
    const valid = await client.verifyMessage({ address, message, signature });
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const secret = getEnvSecret();
    if (!secret) {
      // Security-first: require a secret to mint a session token
      return NextResponse.json(
        { error: "Server misconfigured: SESSION_SECRET is required" },
        { status: 500 },
      );
    }

    // Create a compact HS256-signed token (JWT-like) with short claims
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60 * 24 * 7; // 7 days
    const token = signSession({ sub: address, iat: now, exp }, secret);

    const res = NextResponse.json({ ok: true }, { status: 200 });
    // Clear nonce cookie regardless of storage strategy
    res.cookies.set(NONCE_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    console.error("POST /api/auth/verify error", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";



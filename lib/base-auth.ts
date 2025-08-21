"use client";

import { createBaseAccountSDK } from "@base-org/account";

/**
 * Initiates a Sign in with Base flow using the Base Account SDK.
 * - Prefetches a nonce from the backend (falls back to local if needed)
 * - Requests `wallet_connect` with SIWE capability
 * - POSTs the signed message to `/api/auth/verify` to create a session cookie
 */
export async function signInWithBase(): Promise<boolean> {
  try {
    const sdk = createBaseAccountSDK();
    const provider = sdk.getProvider();

    // Prefetch a server nonce to allow reuse protection server-side
    let nonce: string | null = null;
    try {
      const res = await fetch("/api/auth/nonce", { cache: "no-store" });
      if (res.ok) {
        nonce = await res.text();
      }
    } catch {
      // Fallback in case route is temporarily unreachable
      nonce = null;
    }
    if (!nonce) {
      nonce = (window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2))
        .replace(/-/g, "");
    }

    const { accounts } = await provider.request({
      method: "wallet_connect",
      params: [
        {
          version: "1",
          capabilities: {
            signInWithEthereum: {
              nonce,
              chainId: "0x2105", // Base Mainnet (8453)
            },
          },
        },
      ],
    });

    const { address } = accounts[0];
    const { message, signature } = (accounts[0] as any).capabilities
      .signInWithEthereum as { message: string; signature: `0x${string}` };

    const verifyRes = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, message, signature }),
    });
    return verifyRes.ok;
  } catch (error) {
    console.error("signInWithBase error", error);
    return false;
  }
}



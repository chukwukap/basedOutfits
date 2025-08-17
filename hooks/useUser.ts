"use client";

import useSWR from "swr";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect, useMemo } from "react";
import { User } from "@/lib/generated/prisma";
import { Context } from "@farcaster/frame-sdk";
import { useAccount } from "wagmi";

type UseUserResult = {
  loading: boolean;
  error?: string;
  mini: {
    raw: Context.MiniAppContext | null;
    fid?: string;
    username?: string;
    name?: string;
    avatarUrl?: string;
    walletAddress?: string;
  };
  db: User | null;
  refresh: () => void;
  /**
   * Explicitly create or update the current user in the database using the
   * MiniKit and wallet context. This function performs a real API call and
   * never uses mock/demo data.
   */
  sync: () => Promise<void>;
};

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user");
  return (await res.json()) as { user: User | null };
};

export function useUser(): UseUserResult {
  const { context } = useMiniKit();
  const { address } = useAccount();

  const mini = useMemo(() => {
    const c = context || null;
    return {
      raw: c,
      fid: c?.user?.fid?.toString(),
      username: c?.user?.username,
      name: c?.user?.displayName,
      avatarUrl: c?.user?.pfpUrl,
      walletAddress: address,
    };
  }, [context, address]);

  const key =
    mini.username || mini.fid
      ? `/api/users/me?${new URLSearchParams({
          ...(mini.username ? { username: mini.username } : {}),
          ...(mini.fid ? { fid: mini.fid } : {}),
        }).toString()}`
      : null;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher);

  // Provide an explicit, opt-in sync function to avoid any demo/mock behavior
  const sync = async () => {
    if (!mini.username || !mini.fid) return;
    await fetch("/api/users/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fid: mini.fid,
        username: mini.username,
        name: mini.name,
        avatarUrl: mini.avatarUrl,
        walletAddress: mini.walletAddress,
      }),
    });
    await mutate();
  };

  // Auto-create user when MiniKit context becomes available and DB user is missing
  useEffect(() => {
    const autoCreate = async () => {
      try {
        if (!mini.username || !mini.fid) return;
        if (data && data.user) return; // already exists
        await fetch("/api/users/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fid: mini.fid,
            username: mini.username,
            name: mini.name,
            avatarUrl: mini.avatarUrl,
            walletAddress: mini.walletAddress,
          }),
        });
        await mutate();
      } catch {
        // no-op
      }
    };
    if (key) void autoCreate();
  }, [mini.fid, mini.username, mini.name, mini.avatarUrl, mini.walletAddress, key, data, mutate]);

  return {
    loading: isLoading,
    error: error?.message,
    mini,
    db: data?.user ?? null,
    refresh: () => mutate(),
    sync,
  };
}

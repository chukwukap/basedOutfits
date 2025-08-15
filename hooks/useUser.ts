"use client";

import useSWR from "swr";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect, useMemo } from "react";

type DbUser = {
  id: string;
  username: string;
  fid?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  walletAddress?: string | null;
  createdAt: string;
  updatedAt: string;
};

type UseUserResult = {
  loading: boolean;
  error?: string;
  mini: {
    raw: any | null;
    fid?: string;
    username?: string;
    name?: string;
    avatarUrl?: string;
  };
  db: DbUser | null;
  refresh: () => void;
};

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user");
  return (await res.json()) as { user: DbUser | null };
};

export function useUser(): UseUserResult {
  const { context } = useMiniKit();

  const mini = useMemo(() => {
    const c = context || null;
    return {
      raw: c,
      fid: c?.user?.fid?.toString(),
      username: c?.user?.username,
      name: c?.user?.displayName,
      avatarUrl: c?.user?.pfpUrl,
    };
  }, [context]);

  const key = mini.username || mini.fid ? `/api/users/me?${new URLSearchParams({
    ...(mini.username ? { username: mini.username } : {}),
    ...(mini.fid ? { fid: mini.fid } : {}),
  }).toString()}` : null;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher);

  // Optionally, sync to DB if present and not found yet
  useEffect(() => {
    const maybeSync = async () => {
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
          }),
        });
        mutate();
      } catch {
        // no-op
      }
    };
    if (key) {
      void maybeSync();
    }
  }, [mini.fid, mini.username, mini.name, mini.avatarUrl, key, mutate, data]);

  return {
    loading: isLoading,
    error: error?.message,
    mini,
    db: data?.user ?? null,
    refresh: () => mutate(),
  };
}



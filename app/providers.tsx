"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect } from "react";

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      <MiniKitBootstrap />
      {props.children}
    </MiniKitProvider>
  );
}

function MiniKitBootstrap() {
  const { context, isFrameReady, setFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  useEffect(() => {
    // On first app open with context, ensure user exists in DB
    const syncUser = async () => {
      try {
        if (!context) return;
        const stored = localStorage.getItem("looks_user_synced");
        type CtxUser = {
          fid?: number | string;
          username?: string;
          displayName?: string;
          pfpUrl?: string;
        };
        type Ctx = { user?: CtxUser; client?: CtxUser } | null;
        const c = (context as Ctx) || null;
        const fid: string | undefined = (
          (c?.user?.fid ?? c?.client?.fid) as number | string | undefined
        )?.toString();
        const username: string | undefined = (c?.user?.username ??
          c?.client?.username) as string | undefined;
        const name: string | undefined = (c?.user?.displayName ??
          c?.client?.displayName) as string | undefined;
        const avatarUrl: string | undefined = (c?.user?.pfpUrl ??
          c?.client?.pfpUrl) as string | undefined;
        if (!fid || !username) return;
        if (stored === username) return;
        await fetch("/api/users/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fid, username, name, avatarUrl }),
        });
        localStorage.setItem("looks_user_synced", username);
      } catch {
        // no-op
      }
    };
    syncUser();
  }, [context]);

  return null;
}

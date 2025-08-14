"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider, useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect } from "react";
import { useAccount } from "wagmi";

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
  const { address: walletAddress } = useAccount();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  useEffect(() => {
    // On first app open with context, ensure user exists in DB
    const syncUser = async () => {
      try {
        if (!context) return;
        const stored = localStorage.getItem("looks_user_synced");
        const c = context || null;
        const fid = c?.user?.fid?.toString();
        const username = c?.user?.username;
        const name = c?.user?.displayName;
        const avatarUrl = c?.user?.pfpUrl;

        if (!fid || !username) return;
        if (stored === username) return;
        await fetch("/api/users/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fid,
            username,
            name,
            avatarUrl,
            walletAddress,
          }),
        });
        localStorage.setItem("looks_user_synced", username);
      } catch {
        // no-op
      }
    };
    syncUser();
  }, [context, walletAddress]);

  return null;
}

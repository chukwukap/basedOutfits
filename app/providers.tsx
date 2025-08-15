"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider, useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect } from "react";
import { ThemeSelector } from "./_components/theme-selector";
import { useUser } from "@/hooks/useUser";

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
      <ThemeSelector />
      {props.children}
    </MiniKitProvider>
  );
}

function MiniKitBootstrap() {
  const { isFrameReady, setFrameReady } = useMiniKit();
  // Initialize and auto-sync user via hook
  useUser();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  return null;
}

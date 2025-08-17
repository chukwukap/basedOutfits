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
      <MiniKitBootstrap>{props.children}</MiniKitBootstrap>
      <ThemeSelector />
    </MiniKitProvider>
  );
}

function MiniKitBootstrap({ children }: { children: ReactNode }) {
  const { isFrameReady, setFrameReady } = useMiniKit();
  useUser();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  return <>{children}</>;
}

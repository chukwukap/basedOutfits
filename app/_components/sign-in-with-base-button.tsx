"use client";

import * as React from "react";
import { signInWithBase } from "@/lib/base-auth";

type Props = {
  colorScheme?: "light" | "dark";
  onSignedIn?: () => void;
};

/**
 * Minimal brand-compliant Sign in with Base button (custom variant).
 * Note: For full brand enforcement, prefer `@base-org/account-ui`'s component.
 */
export function SignInWithBaseButton({ colorScheme = "light", onSignedIn }: Props) {
  const isLight = colorScheme === "light";
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const ok = await signInWithBase();
      if (ok) onSignedIn?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Sign in with Base"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 16px",
        backgroundColor: isLight ? "#ffffff" : "#000000",
        border: "none",
        borderRadius: "8px",
        cursor: loading ? "default" : "pointer",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "14px",
        fontWeight: 500,
        color: isLight ? "#000000" : "#ffffff",
        minWidth: "180px",
        height: "44px",
        opacity: loading ? 0.8 : 1,
      }}
      disabled={loading}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: isLight ? "#0000FF" : "#FFFFFF",
          borderRadius: "2px",
          flexShrink: 0,
        }}
      />
      <span>{loading ? "Connecting…" : "Sign in with Base"}</span>
    </button>
  );
}



"use client";

import { useCallback } from "react";
import { useComposeCast } from "@coinbase/onchainkit/minikit";
import { Button } from "@/app/_components/ui/button";
import { Share2 } from "lucide-react";

interface ComposeCastButtonProps {
  text: string;
  embedUrl?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "secondary" | "outline" | "ghost";
  className?: string;
  label?: string;
}

export function ComposeCastButton({
  text,
  embedUrl,
  size = "sm",
  variant = "outline",
  className,
  label = "Cast",
}: ComposeCastButtonProps) {
  const { composeCast } = useComposeCast();

  const onShare = useCallback(() => {
    const url = embedUrl || (typeof window !== "undefined" ? window.location.href : undefined);
    composeCast({
      text,
      ...(url ? { embeds: [url] } : {}),
    });
  }, [composeCast, embedUrl, text]);

  return (
    <Button onClick={onShare} size={size} variant={variant} className={className}>
      <Share2 className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}

"use client";

import { Button } from "@/app/_components/ui/button";
import { useComposeCast } from "@coinbase/onchainkit/minikit";

interface ComposeCastButtonProps {
  text: string;
  embeds?: string[];
  className?: string;
  children?: React.ReactNode;
}

export function ComposeCastButton({ text, embeds, className, children }: ComposeCastButtonProps) {
  const { composeCast } = useComposeCast();

  const onClick = () => {
    composeCast({ text, embeds });
  };

  return (
    <Button onClick={onClick} className={className} variant="outline">
      {children ?? "Share on Farcaster"}
    </Button>
  );
}



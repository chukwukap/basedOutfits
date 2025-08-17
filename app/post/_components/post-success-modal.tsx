"use client";

import { Dialog, DialogContent } from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { CheckCircle, Home, Share2 } from "lucide-react";
import { useComposeCast } from "@coinbase/onchainkit/minikit";
import { OutfitFetchPayload } from "@/lib/types";
import Image from "next/image";

interface PostSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outfit: OutfitFetchPayload | null;
  onClose: () => void;
}

export function PostSuccessModal({
  open,
  onOpenChange,
  outfit,
  onClose,
}: PostSuccessModalProps) {
  const { composeCast } = useComposeCast();

  const handleShare = async () => {
    if (!outfit) return;
    // Prefer MiniKit compose flow with embed
    try {
      composeCast({
        text: `I just posted a new outfit on Outfitly! ${outfit.caption ?? ""} #Outfitly`,
        embeds: [`${window.location.origin}/outfit/${outfit.id}`],
      });
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Check out my outfit: ${outfit.caption} - ${window.location.origin}/outfit/${outfit.id}`,
      );
    }
  };

  if (!outfit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-6 py-4">
          {/* Success icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Success message */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Outfit Posted Successfully!
            </h2>
            <p className="text-muted-foreground text-sm">
              Your outfit is now live and ready to inspire others.
            </p>
          </div>

          {/* Outfit preview */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
              <Image
                src={outfit.imageUrls[0] || "/placeholder.svg"}
                width={48}
                height={48}
                alt={outfit.caption || "Outfit image"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{outfit.caption}</p>
              <p className="text-xs text-muted-foreground">
                by {outfit.author.name}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={onClose} className="w-full" size="lg">
              <Home className="w-4 h-4 mr-2" />
              View in Feed
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Outfit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

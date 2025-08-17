"use client";

import { Card } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Lock, Globe, Calendar } from "lucide-react";
import { WardrobeOptionsMenu } from "@/app/wardrobe/[id]/_components/wardrobe-options-menu";
import Image from "next/image";
import { useState } from "react";
import { WardrobeResponse } from "@/lib/types";

interface WardrobeCardProps {
  wardrobe: WardrobeResponse;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePrivacy: () => void;
  onShare: () => void;
  onDuplicate: () => void;
}

export function WardrobeCard({
  wardrobe,
  onClick,
  onEdit,
  onDelete,
  onTogglePrivacy,
  onShare,
  onDuplicate,
}: WardrobeCardProps) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group relative"
      onClick={onClick}
    >
      {/* Options Menu */}
      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <WardrobeOptionsMenu
          wardrobe={wardrobe}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePrivacy={onTogglePrivacy}
          onShare={onShare}
          onDuplicate={onDuplicate}
        />
      </div>

      {/* Cover Image */}
      <div className="relative aspect-square bg-muted">
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <Image
          src={wardrobe.coverImage || "/placeholder.svg"}
          alt={wardrobe.name || "Wardrobe Image"}
          fill
          className="object-cover transition-opacity duration-300 group-hover:scale-105"
          onLoad={() => setImageLoading(false)}
        />

        {/* Overlay with privacy indicator */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="bg-black/50 text-white border-0 backdrop-blur-sm"
          >
            {wardrobe.isPublic ? (
              <>
                <Globe className="w-3 h-3 mr-1" />
                Public
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Private
              </>
            )}
          </Badge>
        </div>

        {/* Outfit count overlay */}
        <div className="absolute bottom-3 left-3">
          <Badge
            variant="secondary"
            className="bg-black/50 text-white border-0 backdrop-blur-sm"
          >
            {wardrobe.outfitCount}{" "}
            {wardrobe.outfitCount === 1 ? "outfit" : "outfits"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div>
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {wardrobe.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {wardrobe.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Updated{" "}
            {new Date(wardrobe.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Card>
  );
}

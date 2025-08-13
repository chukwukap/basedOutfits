"use client";

import { Card } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Lock, Globe, Calendar } from "lucide-react";
import { LookbookOptionsMenu } from "@/app/lookbooks/[id]/_components/lookbook-options-menu";
import Image from "next/image";
import { useState } from "react";
import { LookbookResponse } from "@/lib/types";

interface LookbookCardProps {
  lookbook: LookbookResponse;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePrivacy: () => void;
  onShare: () => void;
  onDuplicate: () => void;
}

export function LookbookCard({
  lookbook,
  onClick,
  onEdit,
  onDelete,
  onTogglePrivacy,
  onShare,
  onDuplicate,
}: LookbookCardProps) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group relative"
      onClick={onClick}
    >
      {/* Options Menu */}
      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <LookbookOptionsMenu
          lookbook={lookbook}
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
          src={lookbook.coverImage || "/placeholder.svg"}
          alt={lookbook.name}
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
            {lookbook.isPublic ? (
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

        {/* Look count overlay */}
        <div className="absolute bottom-3 left-3">
          <Badge
            variant="secondary"
            className="bg-black/50 text-white border-0 backdrop-blur-sm"
          >
            {lookbook.lookCount} {lookbook.lookCount === 1 ? "look" : "looks"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div>
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {lookbook.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {lookbook.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Updated{" "}
            {new Date(lookbook.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Card>
  );
}

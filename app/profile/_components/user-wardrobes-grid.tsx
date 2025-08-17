"use client";

import type React from "react";

import { Card } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { Heart, Users, Calendar, HeartOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { UserWardrobe } from "@/lib/types";

interface UserWardrobesGridProps {
  wardrobes: UserWardrobe[];
  onWardrobeClick: (wardrobe: UserWardrobe) => void;
  onFollowWardrobe: (wardrobeId: string) => void;
}

export function UserWardrobesGrid({
  wardrobes,
  onWardrobeClick,
  onFollowWardrobe,
}: UserWardrobesGridProps) {
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >(wardrobes.reduce((acc, wardrobe) => ({ ...acc, [wardrobe.id]: true }), {}));

  const handleImageLoad = (outfitId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [outfitId]: false }));
  };

  const handleFollowClick = (e: React.MouseEvent, wardrobeId: string) => {
    e.stopPropagation();
    onFollowWardrobe(wardrobeId);
  };

  if (wardrobes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">📚</span>
        </div>
        <h3 className="font-semibold text-lg mb-2">No Public Outfits</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          This user hasn&apos;t made any outfits public yet. Check back later
          for new collections!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {wardrobes.map((wardrobe) => (
          <Card
            key={wardrobe.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group"
            onClick={() => onWardrobeClick(wardrobe)}
          >
            {/* Cover Image */}
            <div className="relative aspect-square bg-muted">
              {imageLoadingStates[wardrobe.id] && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              <Image
                src={wardrobe.coverImage || "/placeholder.svg"}
                alt={wardrobe.name || "Wardrobe Image"}
                fill
                className="object-cover transition-opacity duration-300 group-hover:scale-105"
                onLoad={() => handleImageLoad(wardrobe.id)}
              />

              {/* Follow Button Overlay */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-black/50 text-white border-0 backdrop-blur-sm hover:bg-black/70"
                  onClick={(e) => handleFollowClick(e, wardrobe.id)}
                >
                  {wardrobe.isFollowing ? (
                    <>
                      <HeartOff className="w-3 h-3 mr-1" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <Heart className="w-3 h-3 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
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

              {/* Stats and Metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {wardrobe.followers} followers
                  </span>
                  {wardrobe.isFollowing && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary"
                    >
                      Following
                    </Badge>
                  )}
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(wardrobe.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

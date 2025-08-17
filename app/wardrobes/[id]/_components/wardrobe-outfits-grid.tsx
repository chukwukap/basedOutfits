"use client";

import type React from "react";

import { Card } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import {
  Heart,
  DollarSign,
  MoreVertical,
  Trash2,
  ExternalLink,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import Image from "next/image";
import { useState } from "react";

export interface Outfit {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
    fid: string;
  };
  tips: number;
  collections: number;
  createdAt: string;
  addedAt: string;
}

interface WardrobeOutfitsGridProps {
  outfits: Outfit[];
  onOutfitClick: (outfit: Outfit) => void;
  onTipOutfit: (outfit: Outfit) => void;
  onCollectOutfit: (outfit: Outfit) => void;
  onRemoveOutfit: (outfitId: string) => void;
}

export function WardrobeOutfitsGrid({
  outfits,
  onOutfitClick,
  onTipOutfit,
  onCollectOutfit,
  onRemoveOutfit,
}: WardrobeOutfitsGridProps) {
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >(outfits.reduce((acc, outfit) => ({ ...acc, [outfit.id]: true }), {}));

  const handleImageLoad = (outfitId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [outfitId]: false }));
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (outfits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Heart className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No outfits yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm mb-4">
          Start adding outfits to this wardrobe from the home feed or your other
          collections.
        </p>
        <Button onClick={() => (window.location.href = "/")}>
          Browse Outfits
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {outfits.length} {outfits.length === 1 ? "outfit" : "outfits"} in this
          wardrobe
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {outfits.map((outfit) => (
          <Card
            key={outfit.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group"
            onClick={() => onOutfitClick(outfit)}
          >
            <div className="flex gap-4 p-4">
              {/* Image */}
              <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                {imageLoadingStates[outfit.id] && (
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
                <Image
                  src={outfit.imageUrl || "/placeholder.svg"}
                  alt={outfit.title}
                  fill
                  className="object-cover transition-opacity duration-300"
                  onLoad={() => handleImageLoad(outfit.id)}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Header with menu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base leading-tight line-clamp-1">
                      {outfit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {outfit.description}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleMenuClick}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onOutfitClick(outfit);
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveOutfit(outfit.id);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove from Outfitly
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={outfit.author.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-xs">
                      {outfit.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    by {outfit.author.name}
                  </span>
                  {/* location removed in simplified model */}
                </div>

                {/* tags removed in simplified model */}

                {/* Stats and Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {outfit.tips}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {outfit.collections}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Added{" "}
                      {new Date(outfit.addedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTipOutfit(outfit);
                      }}
                    >
                      <DollarSign className="w-3 h-3 mr-1" />
                      Tip
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCollectOutfit(outfit);
                      }}
                    >
                      <Heart className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

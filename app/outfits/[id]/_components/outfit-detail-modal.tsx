"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import {
  Heart,
  DollarSign,
  Share2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface Outfit {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  tags: string[];
  brands: string[];
  collectedAt: string;
  tips: number;
  collections: number;
  isFavorite: boolean;
  category: string;
}

interface OutfitDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outfit: Outfit;
}

export function OutfitDetailModal({
  open,
  onOpenChange,
  outfit,
}: OutfitDetailModalProps) {
  const [imageLoading, setImageLoading] = useState(true);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: outfit.title,
          text: `Check out this outfit from my closet: ${outfit.title}`,
          url: `${window.location.origin}/outfits/${outfit.id}`,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/outfits/${outfit.id}`,
      );
    }
  };

  const handleViewOriginal = () => {
    // Navigate to original outfit page
    window.location.href = `/outfits/${outfit.id}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate">{outfit.title}</span>
            {outfit.isFavorite && (
              <Heart className="w-4 h-4 fill-current text-pink-500 flex-shrink-0 ml-2" />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {imageLoading && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <Image
              src={outfit.imageUrl || "/placeholder.svg"}
              alt={outfit.title}
              fill
              className="object-cover transition-opacity duration-300"
              onLoad={() => setImageLoading(false)}
            />
          </div>

          {/* Author */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/diverse-group-profile.png" />
              <AvatarFallback>{outfit.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-sm">{outfit.author}</p>
              <p className="text-xs text-muted-foreground">Original creator</p>
            </div>
          </div>

          {/* Collection Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Collected {new Date(outfit.collectedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              {outfit.tips} tips
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Heart className="w-4 h-4" />
              {outfit.collections} collected
            </span>
          </div>

          {/* Tags */}
          {outfit.tags.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {outfit.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Brands */}
          {outfit.brands.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Brands</p>
              <div className="flex flex-wrap gap-2">
                {outfit.brands.map((brand) => (
                  <Badge key={brand} variant="outline" className="text-xs">
                    {brand}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleViewOriginal} className="flex-1" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Original
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="bg-transparent"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

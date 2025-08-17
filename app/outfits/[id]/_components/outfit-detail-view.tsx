"use client";

import { ImageGallery } from "@/app/_components/image-gallery";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";

import { Badge } from "@/app/_components/ui/badge";
import { Card } from "@/app/_components/ui/card";
import { Separator } from "@/app/_components/ui/separator";
import { Heart, DollarSign, Calendar, Users } from "lucide-react";

interface Outfit {
  id: string;
  title: string;
  description: string;
  images: string[];
  author: {
    name: string;
    avatar: string;
    fid: string;
    bio: string;
    followers: number;
    following: number;
  };
  // simplified: no tags/brands
  tips: number;
  collections: number;
  // simplified: no location
  createdAt: string;
  // simplified: no extras
}

interface OutfitDetailViewProps {
  outfit: Outfit;
}

export function OutfitDetailView({ outfit }: OutfitDetailViewProps) {
  return (
    <div>
      {/* Image Gallery - Immersive Section */}
      <div className="h-[60vh] min-h-[400px]">
        <ImageGallery images={outfit.images} title={outfit.title} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Outfit Title - Large and Bold */}
        <div>
          <h2 className="text-2xl font-bold mb-3">{outfit.title}</h2>
        </div>
        {/* Full Description */}
        <div>
          <p className="text-muted-foreground leading-relaxed text-base">
            {outfit.description}
          </p>
        </div>
        {/* Author Info */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-background">
              <AvatarImage src={outfit.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{outfit.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base">
                  {outfit.author.name}
                </h3>
                <Badge variant="outline" className="text-xs">
                  @{outfit.author.fid}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {outfit.author.bio}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {outfit.author.followers.toLocaleString()} followers
                </span>
                <span>
                  {outfit.author.following.toLocaleString()} following
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Meta Info (date only in simplified model) */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {outfit.createdAt}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">{outfit.tips}</span> tips
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Heart className="w-4 h-4" />
            <span className="font-medium">{outfit.collections}</span> collected
          </span>
        </div>

        <Separator />

        {/* Tags removed in simplified model */}

        {/* Brands removed in simplified model */}

        {/* Details removed in simplified model */}

        {/* Colors removed in simplified model */}
      </div>
    </div>
  );
}

"use client";

import type React from "react";

import { Card } from "@/app/_components/ui/card";
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
  MoreVertical,
  Trash2,
  ExternalLink,
  MapPin,
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

export interface Look {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
    fid: string;
  };
  tags: string[];
  brands: string[];
  tips: number;
  collections: number;
  location?: string;
  createdAt: string;
  addedAt: string;
}

interface LookbookLooksGridProps {
  looks: Look[];
  onLookClick: (look: Look) => void;
  onTipLook: (look: Look) => void;
  onCollectLook: (look: Look) => void;
  onRemoveLook: (lookId: string) => void;
}

export function LookbookLooksGrid({
  looks,
  onLookClick,
  onTipLook,
  onCollectLook,
  onRemoveLook,
}: LookbookLooksGridProps) {
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >(looks.reduce((acc, look) => ({ ...acc, [look.id]: true }), {}));

  const handleImageLoad = (lookId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [lookId]: false }));
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (looks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Heart className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No looks yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm mb-4">
          Start adding looks to this lookbook from the home feed or your other
          collections.
        </p>
        <Button onClick={() => (window.location.href = "/")}>
          Browse Looks
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {looks.length} {looks.length === 1 ? "look" : "looks"} in this
          lookbook
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {looks.map((look) => (
          <Card
            key={look.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group"
            onClick={() => onLookClick(look)}
          >
            <div className="flex gap-4 p-4">
              {/* Image */}
              <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                {imageLoadingStates[look.id] && (
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
                <Image
                  src={look.imageUrl || "/placeholder.svg"}
                  alt={look.title}
                  fill
                  className="object-cover transition-opacity duration-300"
                  onLoad={() => handleImageLoad(look.id)}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Header with menu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base leading-tight line-clamp-1">
                      {look.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {look.description}
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
                          onLookClick(look);
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveLook(look.id);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove from Lookbook
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={look.author.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-xs">
                      {look.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    by {look.author.name}
                  </span>
                  {look.location && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {look.location}
                      </span>
                    </>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {look.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0 h-5"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {look.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                      +{look.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Stats and Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {look.tips}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {look.collections}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Added{" "}
                      {new Date(look.addedAt).toLocaleDateString("en-US", {
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
                        onTipLook(look);
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
                        onCollectLook(look);
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

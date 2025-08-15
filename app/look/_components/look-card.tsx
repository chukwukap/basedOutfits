"use client";

import type React from "react";

import { Heart, DollarSign, Share2, Clock, Plus } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Badge } from "@/app/_components/ui/badge";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useComposeCast } from "@coinbase/onchainkit/minikit";
import { LookFetchPayload } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface LookCardProps {
  look: LookFetchPayload;
  onTip: () => void;
  onCollect: () => void;
}

export function LookCard({ look, onTip, onCollect }: LookCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [tipping, setTipping] = useState(false);
  const [adding, setAdding] = useState(false); // Renamed from collecting to adding
  const router = useRouter();
  const { composeCast } = useComposeCast();

  const handleCardClick = () => {
    router.push(`/look/${look.id}`);
  };

  const handleTip = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setTipping(true);
    onTip();
    // Reset after a delay to show feedback
    setTimeout(() => setTipping(false), 1000);
  };

  const handleAdd = async (e: React.MouseEvent) => {
    // Renamed from handleCollect to handleAdd
    e.stopPropagation();
    setAdding(true); // Updated state variable
    onCollect(); // Keep the same callback for now, will update the prop name later
    // Reset after a delay to show feedback
    setTimeout(() => setAdding(false), 1000); // Updated state variable
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    composeCast({
      text: `I just discovered "${look.caption || "this look"}" on Looks! #Lookbook`,
      embeds: [`${window.location.origin}/look/${look.id}`],
    });
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-muted">
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <Image
          src={
            (look.imageUrls && look.imageUrls[0]) || "/looks/placeholder.png"
          }
          alt={look.caption || "Look image"}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          onLoad={() => setImageLoading(false)}
        />
        {/* Overlay with location and time */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {/* Location removed in simplified model */}
          <Badge
            variant="secondary"
            className="bg-black/50 text-white border-0 backdrop-blur-sm"
          >
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(look.createdAt)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Author */}
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 ring-2 ring-background">
            <AvatarImage src={look.author.avatarUrl || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">
              {look.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{look.author.name}</p>
            <p className="text-xs text-muted-foreground">@{look.author.fid}</p>
          </div>
        </div>

        {/* Title and Description */}
        <div>
          <h3 className="font-semibold text-lg leading-tight mb-1">
            {look.caption}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {look.description}
          </p>
        </div>

        {/* Tags/Brands removed in simplified model */}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {look.tips} tips
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {look.collections} added
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTip}
            disabled={tipping}
            className="flex-1 bg-transparent hover:bg-primary/5"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            {tipping ? "Tipping..." : "Tip"}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAdd}
            disabled={adding}
            className="flex-1"
          >
            {" "}
            {/* Updated handler and state */}
            <Plus className="w-4 h-4 mr-2" />{" "}
            {/* Changed icon from Heart to Plus */}
            {adding ? "Adding..." : "Add"}{" "}
            {/* Changed text from Collect to Add */}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="px-3"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

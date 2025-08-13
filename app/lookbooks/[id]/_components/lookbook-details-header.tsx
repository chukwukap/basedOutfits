"use client";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  MoreVertical,
  Lock,
  Globe,
  Calendar,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import Image from "next/image";
import { useState } from "react";

interface Lookbook {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  lookCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface LookbookDetailsHeaderProps {
  lookbook: Lookbook;
  onEdit: () => void;
  onDelete: () => void;
}

export function LookbookDetailsHeader({
  lookbook,
  onEdit,
  onDelete,
}: LookbookDetailsHeaderProps) {
  const [imageLoading, setImageLoading] = useState(true);

  const handleBack = () => {
    window.history.back();
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/lookbooks/${lookbook.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: lookbook.name,
          text: lookbook.description,
          url: shareUrl,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <header className="relative">
      {/* Cover Image */}
      <div className="relative h-64 bg-muted">
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <Image
          src={lookbook.coverImage || "/placeholder.svg"}
          alt={lookbook.name}
          fill
          className="object-cover"
          onLoad={() => setImageLoading(false)}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="bg-black/20 text-white hover:bg-black/40"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="bg-black/20 text-white hover:bg-black/40"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Lookbook
              </DropdownMenuItem>

              {lookbook.isPublic && (
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Lookbook
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Lookbook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Privacy Badge */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
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
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title and Stats */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold leading-tight">
              {lookbook.name}
            </h1>
            <Badge variant="secondary" className="text-sm">
              {lookbook.lookCount} {lookbook.lookCount === 1 ? "look" : "looks"}
            </Badge>
          </div>

          {lookbook.description && (
            <p className="text-muted-foreground leading-relaxed">
              {lookbook.description}
            </p>
          )}
        </div>

        {/* Author and Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={lookbook.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{lookbook.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{lookbook.author.name}</p>
              <p className="text-xs text-muted-foreground">Lookbook creator</p>
            </div>
          </div>

          <div className="text-right text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Updated{" "}
              {new Date(lookbook.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

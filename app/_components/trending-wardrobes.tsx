"use client";

import type React from "react";

import { Card } from "@/app/_components/ui/card";
// import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type TrendingWardrobe = {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  wardrobeCount: number;
  creator: { username: string; name: string; avatar?: string };
  category?: string;
  trending?: boolean;
};

async function fetchTrendingWardrobes(): Promise<TrendingWardrobe[]> {
  const res = await fetch("/api/wardrobes?public=1&limit=12", {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}

interface TrendingWardrobesProps {
  searchQuery: string;
  selectedCategory: string;
}

export function TrendingWardrobes({
  searchQuery,
  selectedCategory,
}: TrendingWardrobesProps) {
  const [wardrobes, setWardrobes] = useState<TrendingWardrobe[]>([]);

  useEffect(() => {
    fetchTrendingWardrobes()
      .then(setWardrobes)
      .catch(() => setWardrobes([]));
  }, []);

  // Follow feature removed

  const handleWardrobeClick = (wardrobe: TrendingWardrobe) => {
    window.location.href = `/profile/${wardrobe.creator.username}/wardrobe/${wardrobe.id}`;
  };

  const handleCreatorClick = (e: React.MouseEvent, username: string) => {
    e.stopPropagation();
    window.location.href = `/profile/${username}`;
  };

  // Filter wardrobes
  const filteredWardrobes = wardrobes.filter((wardrobe) => {
    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      return (
        wardrobe.name.toLowerCase().includes(sq) ||
        (wardrobe.description
          ? wardrobe.description.toLowerCase().includes(sq)
          : false) ||
        wardrobe.creator.name.toLowerCase().includes(sq)
      );
    }
    if (selectedCategory !== "all") {
      return wardrobe.category === selectedCategory;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Trending Wardrobes</h2>
      </div>

      {filteredWardrobes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No wardrobes found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredWardrobes.map((wardrobe) => (
            <Card
              key={wardrobe.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group"
              onClick={() => handleWardrobeClick(wardrobe)}
            >
              {/* Cover Image */}
              <div className="relative aspect-square bg-muted">
                <Image
                  src={wardrobe.coverImage || "/placeholder.svg"}
                  alt={wardrobe.name}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:scale-105"
                />

                {/* Trending Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                </div>

                {/* Follow feature removed */}

                {/* Stats */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-black/50 text-white border-0 backdrop-blur-sm"
                  >
                    {wardrobe.wardrobeCount} outfits
                  </Badge>
                  {/* Followers removed */}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                    {wardrobe.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {wardrobe.description}
                  </p>
                </div>

                {/* Creator */}
                <div
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded p-1 -m-1 transition-colors"
                  onClick={(e) =>
                    handleCreatorClick(e, wardrobe.creator.username)
                  }
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={wardrobe.creator.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-xs">
                      {wardrobe.creator.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    by {wardrobe.creator.name}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

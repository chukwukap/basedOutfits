"use client";

import { Card } from "@/app/_components/ui/card";

import { Badge } from "@/app/_components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type FeaturedCreator = {
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  wardrobesCount: number;
  totalOutfits: number;
  isFeatured: boolean;
  // simplified: no tags
};

async function fetchFeaturedCreators(): Promise<FeaturedCreator[]> {
  // Use suggested users as provisional featured creators
  const res = await fetch(`/api/users/suggested?limit=6`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = (await res.json()) as Array<{
    username: string;
    name: string;
    avatar: string;
    wardrobesCount: number;
    totalOutfits: number;
  }>;
  return data.map((u) => ({
    username: u.username,
    name: u.name,
    avatar: u.avatar,
    wardrobesCount: u.wardrobesCount,
    totalOutfits: u.totalOutfits,
    isFeatured: true,
  }));
}

export function FeaturedCreators() {
  const [creators, setCreators] = useState<FeaturedCreator[]>([]);

  useEffect(() => {
    fetchFeaturedCreators()
      .then(setCreators)
      .catch(() => setCreators([]));
  }, []);

  // Follow feature removed

  const handleCreatorClick = (username: string) => {
    window.location.href = `/profile/${username}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Featured Creators</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {creators.map((creator) => (
          <Card
            key={creator.username}
            className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 group"
            onClick={() => handleCreatorClick(creator.username)}
          >
            <div className="space-y-3">
              {/* Header with Avatar */}
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12 ring-2 ring-background">
                  <AvatarImage src={creator.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{creator.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">
                      {creator.name}
                    </h3>
                    {creator.isFeatured && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    @{creator.username}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {creator.bio}
                  </p>
                </div>

                {/* Follow button removed */}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 text-xs text-muted-foreground">
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {creator.totalOutfits}
                  </p>
                  <p>Outfits</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {creator.wardrobesCount}
                  </p>
                  <p>Wardrobes</p>
                </div>
              </div>

              {/* Tags removed in simplified model */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

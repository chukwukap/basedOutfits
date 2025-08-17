"use client";

import { Card } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { UserPlus, UserCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";

type FeaturedCreator = {
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  followers: number;
  wardrobesCount: number;
  totalOutfits: number;
  isFollowing: boolean;
  isFeatured: boolean;
  // simplified: no tags
};

async function fetchFeaturedCreators(): Promise<FeaturedCreator[]> {
  // Use suggested users as provisional featured creators
  const res = await fetch(`/api/users/suggested?limit=6`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as Array<{
    username: string;
    name: string;
    avatar: string;
    followers: number;
    wardrobesCount: number;
    totalOutfits: number;
    isFollowing: boolean;
  }>;
  return data.map((u) => ({
    username: u.username,
    name: u.name,
    avatar: u.avatar,
    followers: u.followers,
    wardrobesCount: u.wardrobesCount,
    totalOutfits: u.totalOutfits,
    isFollowing: u.isFollowing,
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

  const handleFollowCreator = (username: string) => {
    setCreators(
      creators.map((creator) =>
        creator.username === username
          ? {
              ...creator,
              isFollowing: !creator.isFollowing,
              followers: creator.isFollowing
                ? creator.followers - 1
                : creator.followers + 1,
            }
          : creator,
      ),
    );
  };

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
              {/* Header with Avatar and Follow Button */}
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

                <Button
                  variant={creator.isFollowing ? "outline" : "default"}
                  size="sm"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollowCreator(creator.username);
                  }}
                >
                  {creator.isFollowing ? (
                    <>
                      <UserCheck className="w-3 h-3 mr-1" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {creator.followers.toLocaleString()}
                  </p>
                  <p>Followers</p>
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

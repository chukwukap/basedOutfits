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
import { Heart, Users, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type TrendingLookbook = {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  lookCount: number;
  followers: number;
  isFollowing: boolean;
  creator: { username: string; name: string; avatar?: string };
  category?: string;
  trending?: boolean;
};

async function fetchTrendingLookbooks(): Promise<TrendingLookbook[]> {
  const res = await fetch("/api/lookbooks?public=1&limit=12", {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}

interface TrendingLookbooksProps {
  searchQuery: string;
  selectedCategory: string;
}

export function TrendingLookbooks({
  searchQuery,
  selectedCategory,
}: TrendingLookbooksProps) {
  const [lookbooks, setLookbooks] = useState<TrendingLookbook[]>([]);

  useEffect(() => {
    fetchTrendingLookbooks()
      .then(setLookbooks)
      .catch(() => setLookbooks([]));
  }, []);

  const handleFollowLookbook = (lookbookId: string) => {
    setLookbooks(
      lookbooks.map((lb) =>
        lb.id === lookbookId
          ? {
              ...lb,
              isFollowing: !lb.isFollowing,
              followers: lb.isFollowing ? lb.followers - 1 : lb.followers + 1,
            }
          : lb,
      ),
    );
  };

  const handleLookbookClick = (lookbook: TrendingLookbook) => {
    window.location.href = `/profile/${lookbook.creator.username}/lookbook/${lookbook.id}`;
  };

  const handleCreatorClick = (e: React.MouseEvent, username: string) => {
    e.stopPropagation();
    window.location.href = `/profile/${username}`;
  };

  // Filter lookbooks
  const filteredLookbooks = lookbooks.filter((lookbook) => {
    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      return (
        lookbook.name.toLowerCase().includes(sq) ||
        (lookbook.description
          ? lookbook.description.toLowerCase().includes(sq)
          : false) ||
        lookbook.creator.name.toLowerCase().includes(sq)
      );
    }
    if (selectedCategory !== "all") {
      return lookbook.category === selectedCategory;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Trending Lookbooks</h2>
      </div>

      {filteredLookbooks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No lookbooks found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredLookbooks.map((lookbook) => (
            <Card
              key={lookbook.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group"
              onClick={() => handleLookbookClick(lookbook)}
            >
              {/* Cover Image */}
              <div className="relative aspect-square bg-muted">
                <Image
                  src={lookbook.coverImage || "/placeholder.svg"}
                  alt={lookbook.name}
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

                {/* Follow Button */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 text-white border-0 backdrop-blur-sm hover:bg-black/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowLookbook(lookbook.id);
                    }}
                  >
                    <Heart
                      className={`w-3 h-3 mr-1 ${lookbook.isFollowing ? "fill-current" : ""}`}
                    />
                    {lookbook.isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>

                {/* Stats */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-black/50 text-white border-0 backdrop-blur-sm"
                  >
                    {lookbook.lookCount} looks
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-black/50 text-white border-0 backdrop-blur-sm"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {lookbook.followers}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                    {lookbook.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {lookbook.description}
                  </p>
                </div>

                {/* Creator */}
                <div
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded p-1 -m-1 transition-colors"
                  onClick={(e) =>
                    handleCreatorClick(e, lookbook.creator.username)
                  }
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={lookbook.creator.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-xs">
                      {lookbook.creator.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    by {lookbook.creator.name}
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

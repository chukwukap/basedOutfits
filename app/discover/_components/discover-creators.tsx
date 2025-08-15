"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Card } from "@/app/_components/ui/card";

const suggestedCreators = [
  {
    id: "1",
    name: "Emma Style",
    username: "@emmastyle",
    avatar: "/diverse-group-profile.png",
    followers: "12.5K",
    isFollowing: false,
  },
  {
    id: "2",
    name: "Min Chen",
    username: "@minimalmin",
    avatar: "/diverse-group-profile.png",
    followers: "8.2K",
    isFollowing: false,
  },
  {
    id: "3",
    name: "Alex Urban",
    username: "@alexurban",
    avatar: "/diverse-group-profile.png",
    followers: "15.1K",
    isFollowing: false,
  },
  {
    id: "4",
    name: "Sofia Chic",
    username: "@sofiachic",
    avatar: "/diverse-group-profile.png",
    followers: "9.8K",
    isFollowing: false,
  },
  {
    id: "5",
    name: "Rio Street",
    username: "@riostreet",
    avatar: "/diverse-group-profile.png",
    followers: "11.3K",
    isFollowing: false,
  },
];

type DiscoverCreatorsProps = object;

export function DiscoverCreators({}: DiscoverCreatorsProps) {
  const [followingStates, setFollowingStates] = useState<
    Record<string, boolean>
  >({});

  const filteredCreators = suggestedCreators;

  const handleFollow = (creatorId: string) => {
    setFollowingStates((prev) => ({
      ...prev,
      [creatorId]: !prev[creatorId],
    }));
  };

  if (filteredCreators.length === 0) return null;

  return (
    <div className="px-4 py-6 border-t bg-muted/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Discover Creators</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          See All
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filteredCreators.map((creator) => (
          <Card key={creator.id} className="flex-shrink-0 w-40 p-4 text-center">
            <Avatar className="w-12 h-12 mx-auto mb-3">
              <AvatarImage
                src={creator.avatar || "/placeholder.svg"}
                alt={creator.name}
              />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>

            <h4 className="font-medium text-sm mb-1 truncate">
              {creator.name}
            </h4>
            <p className="text-xs text-muted-foreground mb-1">
              {creator.username}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              {creator.followers} followers
            </p>

            <Button
              size="sm"
              variant={followingStates[creator.id] ? "secondary" : "default"}
              onClick={() => handleFollow(creator.id)}
              className="w-full text-xs"
            >
              {followingStates[creator.id] ? "Following" : "Follow"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

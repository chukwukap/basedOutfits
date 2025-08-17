"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Card } from "@/app/_components/ui/card";

type DiscoverCreatorsProps = object;

export function DiscoverCreators({}: DiscoverCreatorsProps) {
  // Local type to keep the UI strongly typed and readable
  type DiscoverCreator = {
    id: string;
    username: string;
    name: string;
    avatar: string;
    totalOutfits: number;
    isFollowing: boolean;
  };

  const [creators, setCreators] = useState<DiscoverCreator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [followingStates, setFollowingStates] = useState<
    Record<string, boolean>
  >({});

  // Security: use no-store and defensive parsing
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/users/suggested?limit=10", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load creators");
        const data = (await res.json()) as Array<{
          id: string;
          username: string;
          name: string;
          avatar: string;
          totalOutfits: number;
          isFollowing: boolean;
        }>;
        if (cancelled) return;
        setCreators(
          data.map((c) => ({
            id: String(c.id),
            username: c.username.startsWith("@")
              ? c.username
              : `@${c.username}`,
            name: c.name,
            avatar: c.avatar,
            totalOutfits: Number.isFinite(c.totalOutfits) ? c.totalOutfits : 0,
            isFollowing: Boolean(c.isFollowing),
          })),
        );
        // Seed local follow state from server payload (optimistic updates later)
        setFollowingStates(
          data.reduce<Record<string, boolean>>((acc, c) => {
            acc[String(c.id)] = Boolean(c.isFollowing);
            return acc;
          }, {}),
        );
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFollow = (creatorId: string) => {
    // Optimistic local toggle; TODO: integrate with real follow API when available
    setFollowingStates((prev) => ({
      ...prev,
      [creatorId]: !prev[creatorId],
    }));
  };

  const formatCount = (n: number) => {
    try {
      if (n >= 1000000)
        return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
      if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
      return n.toLocaleString();
    } catch {
      return String(n);
    }
  };

  if (loading) return null;
  if (error) return null;
  if (creators.length === 0) return null;

  return (
    <div className="px-4 py-6 border-t bg-muted/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Discover Creators</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          See All
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {creators.map((creator) => (
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
              {formatCount(creator.totalOutfits)} outfits
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

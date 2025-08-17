"use client";

import { Card } from "@/app/_components/ui/card";
import { Heart, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type RelatedOutfit = {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  tips: number;
  collections: number;
};

interface RelatedOutfitsProps {
  currentOutfitId: string;
}

export function RelatedOutfits({ currentOutfitId }: RelatedOutfitsProps) {
  const [relatedOutfits, setRelatedOutfits] = useState<RelatedOutfit[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/outfits?limit=6", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Array<{
          id: string;
          caption?: string;
          imageUrls: string[];
          author: { name: string };
          tips: number;
          collections: number;
        }>;
        if (cancelled) return;
        const mapped: RelatedOutfit[] = data
          .filter((o) => o.id !== currentOutfitId)
          .slice(0, 3)
          .map((o) => ({
            id: o.id,
            title: o.caption || "",
            imageUrl: o.imageUrls?.[0] || "",
            author: o.author?.name || "",
            tips: o.tips ?? 0,
            collections: o.ions ?? 0,
          }));
        setRelatedOutfits(mapped);
      } catch {
        setRelatedOutfits([]);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [currentOutfitId]);

  if (relatedOutfits.length === 0) {
    return null;
  }

  return (
    <div className="p-4 pt-0">
      <h3 className="font-semibold text-lg mb-4">Related Outfits</h3>
      <div className="grid grid-cols-2 gap-3">
        {relatedOutfits.map((outfit) => (
          <Link key={outfit.id} href={`/outfits/${outfit.id}`}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
              <div className="relative aspect-square">
                <Image
                  src={outfit.imageUrl || "/placeholder.svg"}
                  alt={outfit.title}
                  fill
                  className="object-cover"
                />

                {/* Overlay with stats */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {outfit.tips}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {outfit.collections}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h4 className="font-medium text-sm leading-tight line-clamp-1 mb-1">
                  {outfit.title}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  by {outfit.author}
                </p>
                {/* Tags removed in simplified model */}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

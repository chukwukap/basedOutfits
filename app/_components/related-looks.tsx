"use client";

import { Card } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Heart, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock related looks data (kept minimal, no tags filtering)
const relatedLooksData = [
  {
    id: "3",
    title: "Street Style Maven",
    imageUrl: "/street-style-outfit.png",
    author: "Jordan Kim",
    tips: 18,
    collections: 22,
  },
  {
    id: "4",
    title: "Business Casual Chic",
    imageUrl: "/business-casual-outfit.png",
    author: "Taylor Swift",
    tips: 9,
    collections: 12,
  },
  {
    id: "5",
    title: "Cozy Weekend",
    imageUrl: "/summer-fashion-outfit.png",
    author: "Maya Patel",
    tips: 15,
    collections: 7,
  },
];

interface RelatedLooksProps { currentLookId: string }

export function RelatedLooks({ currentLookId }: RelatedLooksProps) {
  // Filter out current look only
  const relatedLooks = relatedLooksData
    .filter((look) => look.id !== currentLookId)
    .slice(0, 3);

  if (relatedLooks.length === 0) {
    return null;
  }

  return (
    <div className="p-4 pt-0">
      <h3 className="font-semibold text-lg mb-4">Related Looks</h3>
      <div className="grid grid-cols-2 gap-3">
        {relatedLooks.map((look) => (
          <Link key={look.id} href={`/look/${look.id}`}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
              <div className="relative aspect-square">
                <Image
                  src={look.imageUrl || "/placeholder.svg"}
                  alt={look.title}
                  fill
                  className="object-cover"
                />

                {/* Overlay with stats */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {look.tips}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {look.collections}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h4 className="font-medium text-sm leading-tight line-clamp-1 mb-1">
                  {look.title}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  by {look.author}
                </p>
                <div className="flex flex-wrap gap-1">
                  {look.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0 h-4"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

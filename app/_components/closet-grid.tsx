"use client";

import { useMemo } from "react";
import { Card } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Heart, DollarSign, Calendar, Search } from "lucide-react";
import Image from "next/image";

// Enhanced mock collected looks with more data
const collectedLooks = [
  {
    id: "1",
    title: "Summer Vibes",
    imageUrl: "/summer-fashion-outfit.png",
    author: "Sarah Chen",
    tags: ["summer", "casual", "streetwear"],
    brands: ["Zara", "Nike"],
    collectedAt: "2024-01-15",
    tips: 12,
    collections: 8,
    isFavorite: true,
    category: "casual",
  },
  {
    id: "2",
    title: "Evening Elegance",
    imageUrl: "/elegant-evening-dress.png",
    author: "Alex Rivera",
    tags: ["evening", "elegant", "formal"],
    brands: ["H&M", "Mango"],
    collectedAt: "2024-01-14",
    tips: 24,
    collections: 15,
    isFavorite: true,
    category: "formal",
  },
  {
    id: "3",
    title: "Street Style",
    imageUrl: "/street-style-outfit.png",
    author: "Jordan Kim",
    tags: ["streetwear", "bold", "urban"],
    brands: ["Supreme", "Off-White"],
    collectedAt: "2024-01-12",
    tips: 18,
    collections: 22,
    isFavorite: false,
    category: "casual",
  },
  {
    id: "4",
    title: "Business Casual Chic",
    imageUrl: "/business-casual-outfit.png",
    author: "Taylor Swift",
    tags: ["business", "casual", "professional"],
    brands: ["Uniqlo", "Everlane"],
    collectedAt: "2024-01-10",
    tips: 9,
    collections: 12,
    isFavorite: false,
    category: "formal",
  },
  {
    id: "5",
    title: "Cozy Weekend",
    imageUrl: "/fashionable-summer-outfit.png",
    author: "Maya Patel",
    tags: ["weekend", "cozy", "comfort"],
    brands: ["Lululemon", "Patagonia"],
    collectedAt: "2024-01-08",
    tips: 15,
    collections: 7,
    isFavorite: true,
    category: "casual",
  },
  {
    id: "6",
    title: "Summer Breeze",
    imageUrl: "/summer-fashion-outfit.png",
    author: "Emma Wilson",
    tags: ["summer", "light", "airy"],
    brands: ["COS", "Mango"],
    collectedAt: "2024-01-05",
    tips: 20,
    collections: 11,
    isFavorite: false,
    category: "summer",
  },
];

interface ClosetGridProps {
  searchQuery: string;
  selectedFilter: string;
  sortBy: string;
  onLookClick: (look: any) => void;
}

export function ClosetGrid({
  searchQuery,
  selectedFilter,
  sortBy,
  onLookClick,
}: ClosetGridProps) {
  const filteredAndSortedLooks = useMemo(() => {
    let filtered = collectedLooks;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (look) =>
          look.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          look.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          look.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ) ||
          look.brands.some((brand) =>
            brand.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply category filter
    if (selectedFilter !== "all") {
      if (selectedFilter === "recent") {
        filtered = filtered.filter((look) => {
          const collectedDate = new Date(look.collectedAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return collectedDate >= weekAgo;
        });
      } else if (selectedFilter === "favorites") {
        filtered = filtered.filter((look) => look.isFavorite);
      } else {
        filtered = filtered.filter(
          (look) =>
            look.category === selectedFilter ||
            look.tags.includes(selectedFilter),
        );
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.collectedAt).getTime() -
            new Date(a.collectedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.collectedAt).getTime() -
            new Date(b.collectedAt).getTime()
          );
        case "popular":
          return b.tips + b.collections - (a.tips + a.collections);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedFilter, sortBy]);

  if (filteredAndSortedLooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          {searchQuery ? (
            <Search className="w-6 h-6 text-muted-foreground" />
          ) : (
            <Heart className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2">
          {searchQuery ? "No looks found" : "Your closet is empty"}
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          {searchQuery
            ? `No looks match "${searchQuery}". Try a different search term.`
            : "Start collecting looks you love from the feed to build your personal style collection."}
        </p>
        {!searchQuery && (
          <Button className="mt-4" onClick={() => (window.location.href = "/")}>
            Browse Looks
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredAndSortedLooks.length} look
          {filteredAndSortedLooks.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredAndSortedLooks.map((look) => (
          <Card
            key={look.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group"
            onClick={() => onLookClick(look)}
          >
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
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {look.tips}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {look.collections}
                      </span>
                    </div>
                    {look.isFavorite && (
                      <Heart className="w-3 h-3 fill-current text-pink-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Collection date badge */}
              <div className="absolute top-2 right-2">
                <Badge
                  variant="secondary"
                  className="bg-black/50 text-white border-0 text-xs backdrop-blur-sm"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(look.collectedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Badge>
              </div>
            </div>

            <div className="p-3 space-y-2">
              <div>
                <h4 className="font-medium text-sm leading-tight line-clamp-1">
                  {look.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  by {look.author}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {look.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-2 py-0 h-5"
                  >
                    #{tag}
                  </Badge>
                ))}
                {look.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                    +{look.tags.length - 2}
                  </Badge>
                )}
              </div>

              {/* Brands */}
              {look.brands.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {look.brands.slice(0, 2).map((brand) => (
                    <Badge
                      key={brand}
                      variant="outline"
                      className="text-xs px-2 py-0 h-5"
                    >
                      {brand}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

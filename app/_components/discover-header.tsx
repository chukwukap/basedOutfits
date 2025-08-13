"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";

interface DiscoverHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function DiscoverHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: DiscoverHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  const categories = [
    { value: "all", label: "All" },
    { value: "trending", label: "Trending" },
    { value: "new", label: "New" },
    { value: "fashion", label: "Fashion" },
    { value: "streetwear", label: "Streetwear" },
    { value: "formal", label: "Formal" },
  ];

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="p-4 space-y-3">
        {/* Title and Search Toggle */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Discover</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="p-2"
          >
            {showSearch ? (
              <X className="w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search lookbooks and creators..."
              className="pl-10"
              autoFocus
            />
          </div>
        )}

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={
                selectedCategory === category.value ? "default" : "outline"
              }
              size="sm"
              onClick={() => onCategoryChange(category.value)}
              className="whitespace-nowrap text-xs bg-transparent"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}

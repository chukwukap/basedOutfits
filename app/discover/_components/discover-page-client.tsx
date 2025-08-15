"use client";

import { useState } from "react";
import { BottomNav } from "@/app/_components/bottom-nav";
import { DiscoverHeader } from "@/app/discover/_components/discover-header";
import { TrendingLookbooks } from "@/app/_components/trending-lookbooks";
import { FeaturedCreators } from "@/app/_components/featured-creators";

export default function DiscoverPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <DiscoverHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Trending Lookbooks */}
        <TrendingLookbooks
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />

        {/* Featured Creators */}
        <FeaturedCreators />
      </main>

      <BottomNav />
    </div>
  );
}

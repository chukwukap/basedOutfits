"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/app/_components/bottom-nav";
import { DiscoverHeader } from "@/app/discover/_components/discover-header";
import { TrendingWardrobes } from "@/app/_components/trending-wardrobes";
import { FeaturedCreators } from "@/app/_components/featured-creators";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export default function DiscoverPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { isFrameReady, setFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

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
        {/* Trending Wardrobes */}
        <TrendingWardrobes
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

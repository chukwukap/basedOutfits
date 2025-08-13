"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { DiscoverHeader } from "@/components/discover-header"
import { TrendingLookbooks } from "@/components/trending-lookbooks"
import { FeaturedCreators } from "@/components/featured-creators"

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

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
        <TrendingLookbooks searchQuery={searchQuery} selectedCategory={selectedCategory} />

        {/* Featured Creators */}
        <FeaturedCreators />
      </main>

      <BottomNav />
    </div>
  )
}

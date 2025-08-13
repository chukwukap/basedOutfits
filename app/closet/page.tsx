"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { ClosetGrid } from "@/components/closet-grid"
import { ClosetHeader } from "@/components/closet-header"
import { ClosetStats } from "@/components/closet-stats"
import { LookDetailModal } from "@/components/look-detail-modal"

export default function ClosetPage() {
  const [selectedLook, setSelectedLook] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const handleLookClick = (look: any) => {
    setSelectedLook(look)
    setShowDetailModal(true)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <ClosetHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Stats */}
      <ClosetStats />

      {/* Grid */}
      <main className="p-4">
        <ClosetGrid
          searchQuery={searchQuery}
          selectedFilter={selectedFilter}
          sortBy={sortBy}
          onLookClick={handleLookClick}
        />
      </main>

      {/* Look Detail Modal */}
      {selectedLook && <LookDetailModal open={showDetailModal} onOpenChange={setShowDetailModal} look={selectedLook} />}

      <BottomNav />
    </div>
  )
}

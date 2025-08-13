"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { LookbooksHeader } from "@/components/lookbooks-header"
import { LookbookCard } from "@/components/lookbook-card"
import { CreateLookbookFab } from "@/components/create-lookbook-fab"
import { CreateLookbookModal } from "@/components/create-lookbook-modal"
import { EditLookbookModal } from "@/components/edit-lookbook-modal"
import { DeleteLookbookDialog } from "@/components/delete-lookbook-dialog"

// Mock lookbooks data
const mockLookbooks = [
  {
    id: "1",
    name: "Summer Vibes",
    description: "Light and breezy outfits for hot days",
    coverImage: "/summer-fashion-outfit.png",
    lookCount: 12,
    isPublic: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    name: "Work Wardrobe",
    description: "Professional looks for the office",
    coverImage: "/business-casual-outfit.png",
    lookCount: 8,
    isPublic: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: "3",
    name: "Date Night",
    description: "Elegant outfits for special occasions",
    coverImage: "/elegant-evening-dress.png",
    lookCount: 5,
    isPublic: true,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
  },
  {
    id: "4",
    name: "Street Style",
    description: "Urban and edgy fashion inspiration",
    coverImage: "/street-style-outfit.png",
    lookCount: 15,
    isPublic: true,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-14",
  },
  {
    id: "5",
    name: "Weekend Casual",
    description: "Comfortable looks for relaxing days",
    coverImage: "/fashionable-summer-outfit.png",
    lookCount: 7,
    isPublic: false,
    createdAt: "2024-01-03",
    updatedAt: "2024-01-12",
  },
]

export default function LookbooksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedLookbook, setSelectedLookbook] = useState<any>(null)
  const [lookbooks, setLookbooks] = useState(mockLookbooks)

  const handleLookbookClick = (lookbook: any) => {
    // Navigate to lookbook details page
    window.location.href = `/lookbooks/${lookbook.id}`
  }

  const handleCreateLookbook = (newLookbook: any) => {
    const lookbook = {
      ...newLookbook,
      id: Date.now().toString(),
      lookCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setLookbooks([lookbook, ...lookbooks])
    setShowCreateModal(false)
  }

  const handleEditLookbook = (lookbook: any) => {
    setSelectedLookbook(lookbook)
    setShowEditModal(true)
  }

  const handleSaveEdit = (updatedLookbook: any) => {
    setLookbooks(
      lookbooks.map((lb) =>
        lb.id === updatedLookbook.id ? { ...updatedLookbook, updatedAt: new Date().toISOString().split("T")[0] } : lb,
      ),
    )
    setShowEditModal(false)
    setSelectedLookbook(null)
  }

  const handleDeleteLookbook = (lookbook: any) => {
    setSelectedLookbook(lookbook)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = (lookbookId: string) => {
    setLookbooks(lookbooks.filter((lb) => lb.id !== lookbookId))
    setSelectedLookbook(null)
  }

  const handleTogglePrivacy = (lookbook: any) => {
    setLookbooks(
      lookbooks.map((lb) =>
        lb.id === lookbook.id
          ? { ...lb, isPublic: !lb.isPublic, updatedAt: new Date().toISOString().split("T")[0] }
          : lb,
      ),
    )
  }

  const handleShareLookbook = async (lookbook: any) => {
    const shareUrl = `${window.location.origin}/lookbooks/${lookbook.id}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: lookbook.name,
          text: lookbook.description,
          url: shareUrl,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      // Could show a toast here
    }
  }

  const handleDuplicateLookbook = (lookbook: any) => {
    const duplicated = {
      ...lookbook,
      id: Date.now().toString(),
      name: `${lookbook.name} (Copy)`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setLookbooks([duplicated, ...lookbooks])
  }

  // Filter and sort lookbooks
  const filteredLookbooks = lookbooks
    .filter((lookbook) => {
      if (searchQuery) {
        return (
          lookbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lookbook.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      if (selectedFilter === "public") return lookbook.isPublic
      if (selectedFilter === "private") return !lookbook.isPublic
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        case "size":
          return b.lookCount - a.lookCount
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <LookbooksHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalLookbooks={lookbooks.length}
      />

      {/* Main Content */}
      <main className="p-4">
        {filteredLookbooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{searchQuery ? "No lookbooks found" : "No lookbooks yet"}</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-4">
              {searchQuery
                ? `No lookbooks match "${searchQuery}". Try a different search term.`
                : "Create your first lookbook to start organizing your favorite looks by theme, occasion, or style."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Create Your First Lookbook
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredLookbooks.map((lookbook) => (
              <LookbookCard
                key={lookbook.id}
                lookbook={lookbook}
                onClick={() => handleLookbookClick(lookbook)}
                onEdit={() => handleEditLookbook(lookbook)}
                onDelete={() => handleDeleteLookbook(lookbook)}
                onTogglePrivacy={() => handleTogglePrivacy(lookbook)}
                onShare={() => handleShareLookbook(lookbook)}
                onDuplicate={() => handleDuplicateLookbook(lookbook)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <CreateLookbookFab onClick={() => setShowCreateModal(true)} />

      {/* Modals */}
      <CreateLookbookModal open={showCreateModal} onOpenChange={setShowCreateModal} onSave={handleCreateLookbook} />

      <EditLookbookModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        lookbook={selectedLookbook}
        onSave={handleSaveEdit}
      />

      <DeleteLookbookDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        lookbook={selectedLookbook}
        onConfirm={handleConfirmDelete}
      />

      <BottomNav />
    </div>
  )
}

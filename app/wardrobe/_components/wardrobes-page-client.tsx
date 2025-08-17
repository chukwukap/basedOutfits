"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/app/_components/bottom-nav";

import { CreateWardrobeFab } from "@/app/wardrobe/_components/create-wardrobe-fab";
import { CreateWardrobeModal } from "@/app/wardrobe/_components/create-wardrobe-modal";
import {
  EditWardrobeModal,
  type EditableWardrobe,
} from "@/app/wardrobe/_components/edit-wardrobe-modal";
import { DeleteWardrobeDialog } from "@/app/wardrobe/_components/delete-wardrobe-dialog";
import { WardrobeResponse } from "@/lib/types";
import { WardrobeHeader } from "../[id]/_components/wardrobe-header";
import { WardrobeCard } from "../[id]/_components/wardrobe-card";

type NewWardrobePayload = {
  name: string;
  description: string;
  isPublic: boolean;
  coverImage: string;
};

async function fetchAllWardrobes(): Promise<WardrobeResponse[]> {
  const res = await fetch(`/api/wardrobes?public=0`, { cache: "no-store" });
  if (!res.ok) return [];
  return await res.json();
}

export default function WardrobePageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedWardrobe, setSelectedWardrobe] =
    useState<WardrobeResponse | null>(null);
  const [wardrobes, setWardrobes] = useState<WardrobeResponse[]>([]);

  useEffect(() => {
    fetchAllWardrobes()
      .then(setWardrobes)
      .catch(() => setWardrobes([]));
  }, []);

  const handleWardrobeClick = (wardrobe: WardrobeResponse) => {
    // Navigate to wardrobe details page
    window.location.href = `/wardrobes/${wardrobe.id}`;
  };

  const handleCreateWardrobe = async (newWardrobe: NewWardrobePayload) => {
    const currentUserId = "demo"; // TODO: replace with real auth context id
    const res = await fetch("/api/wardrobes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerId: currentUserId, ...newWardrobe }),
    });
    if (res.ok) {
      const created = (await res.json()) as WardrobeResponse;
      setWardrobes([created, ...wardrobes]);
    }
    setShowCreateModal(false);
  };

  const handleEditWardrobe = (wardrobe: WardrobeResponse) => {
    setSelectedWardrobe(wardrobe);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedWardrobe: WardrobeResponse) => {
    const res = await fetch(`/api/wardrobes/${updatedWardrobe.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedWardrobe),
    });
    if (res.ok) {
      const saved = (await res.json()) as WardrobeResponse;
      setWardrobes(
        wardrobes.map((wb) => (wb.id === saved.id ? { ...wb, ...saved } : wb)),
      );
    }
    setShowEditModal(false);
    setSelectedWardrobe(null);
  };

  const handleDeleteWardrobe = (wardrobe: WardrobeResponse) => {
    setSelectedWardrobe(wardrobe);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async (wardrobeId: string) => {
    await fetch(`/api/wardrobes/${wardrobeId}`, { method: "DELETE" });
    setWardrobes(wardrobes.filter((wb) => wb.id !== wardrobeId));
    setSelectedWardrobe(null);
  };

  const handleTogglePrivacy = (wardrobe: WardrobeResponse) => {
    setWardrobes(
      wardrobes.map((wb) =>
        wb.id === wardrobe.id
          ? {
              ...wb,
              isPublic: !wb.isPublic,
              updatedAt: new Date(),
            }
          : wb,
      ),
    );
  };

  const handleShareWardrobe = async (wardrobe: WardrobeResponse) => {
    const shareUrl = `${window.location.origin}/wardrobes/${wardrobe.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: wardrobe.name,
          text: wardrobe.description ?? undefined,
          url: shareUrl,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const handleDuplicateWardrobe = (wardrobe: WardrobeResponse) => {
    const duplicated = {
      ...wardrobe,
      id: Date.now().toString(),
      name: `${wardrobe.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWardrobes([duplicated, ...wardrobes]);
  };

  // Filter and sort wardrobes
  const filteredWardrobes = wardrobes
    .filter((wardrobe) => {
      if (searchQuery) {
        return (
          wardrobe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          wardrobe.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }
      if (selectedFilter === "public") return wardrobe.isPublic;
      if (selectedFilter === "private") return !wardrobe.isPublic;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.outfitCount - a.outfitCount;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <WardrobeHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalWardrobes={wardrobes.length}
      />

      {/* Main Content */}
      <main className="p-4">
        {filteredWardrobes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {searchQuery ? "No wardrobes found" : "No wardrobes yet"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-4">
              {searchQuery
                ? `No wardrobes match "${searchQuery}". Try a different search term.`
                : "Create your first wardrobe to start organizing your favorite outfits by theme, occasion, or style."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Create Your First Wardrobe
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredWardrobes.map((wardrobe) => (
              <WardrobeCard
                key={wardrobe.id}
                wardrobe={wardrobe}
                onClick={() => handleWardrobeClick(wardrobe)}
                onEdit={() => handleEditWardrobe(wardrobe)}
                onDelete={() => handleDeleteWardrobe(wardrobe)}
                onTogglePrivacy={() => handleTogglePrivacy(wardrobe)}
                onShare={() => handleShareWardrobe(wardrobe)}
                onDuplicate={() => handleDuplicateWardrobe(wardrobe)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <CreateWardrobeFab onClick={() => setShowCreateModal(true)} />

      {/* Modals */}
      <CreateWardrobeModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSave={handleCreateWardrobe}
      />

      <EditWardrobeModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        wardrobe={
          selectedWardrobe
            ? {
                id: selectedWardrobe.id,
                name: selectedWardrobe.name,
                description: selectedWardrobe.description,
                isPublic: selectedWardrobe.isPublic,
                coverImage: selectedWardrobe.coverImage,
              }
            : null
        }
        onSave={(updated: EditableWardrobe) =>
          handleSaveEdit({
            ...selectedWardrobe!,
            name: updated.name,
            description: updated.description ?? null,
            isPublic: updated.isPublic,
            coverImage: updated.coverImage ?? null,
            updatedAt: new Date(),
          })
        }
      />

      <DeleteWardrobeDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        wardrobe={selectedWardrobe}
        onConfirm={handleConfirmDelete}
      />

      <BottomNav />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/app/_components/bottom-nav";
import { LookbooksHeader } from "./[id]/_components/lookbooks-header";
import { LookbookCard } from "./[id]/_components/lookbook-card";
import { CreateLookbookFab } from "./_components/create-lookbook-fab";
import { CreateLookbookModal } from "./_components/create-lookbook-modal";
import {
  EditLookbookModal,
  type EditableLookbook,
} from "./_components/edit-lookbook-modal";
import { DeleteLookbookDialog } from "./_components/delete-lookbook-dialog";
import { LookbookResponse } from "@/lib/types";

type NewLookbookPayload = {
  name: string;
  description: string;
  isPublic: boolean;
  coverImage: string;
};

async function fetchAllLookbooks(): Promise<LookbookResponse[]> {
  const res = await fetch(`/api/lookbooks?public=0`, { cache: "no-store" });
  if (!res.ok) return [];
  return await res.json();
}

export default function LookbooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLookbook, setSelectedLookbook] =
    useState<LookbookResponse | null>(null);
  const [lookbooks, setLookbooks] = useState<LookbookResponse[]>([]);

  useEffect(() => {
    fetchAllLookbooks().then(setLookbooks).catch(() => setLookbooks([]));
  }, []);

  const handleLookbookClick = (lookbook: LookbookResponse) => {
    // Navigate to lookbook details page
    window.location.href = `/lookbooks/${lookbook.id}`;
  };

  const handleCreateLookbook = async (newLookbook: NewLookbookPayload) => {
    const currentUserId = "demo"; // TODO: replace with real auth context id
    const res = await fetch("/api/lookbooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerId: currentUserId, ...newLookbook }),
    });
    if (res.ok) {
      const created = (await res.json()) as LookbookResponse;
      setLookbooks([created, ...lookbooks]);
    }
    setShowCreateModal(false);
  };

  const handleEditLookbook = (lookbook: LookbookResponse) => {
    setSelectedLookbook(lookbook);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedLookbook: LookbookResponse) => {
    const res = await fetch(`/api/lookbooks/${updatedLookbook.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedLookbook),
    });
    if (res.ok) {
      const saved = (await res.json()) as LookbookResponse;
      setLookbooks(
        lookbooks.map((lb) => (lb.id === saved.id ? { ...lb, ...saved } : lb)),
      );
    }
    setShowEditModal(false);
    setSelectedLookbook(null);
  };

  const handleDeleteLookbook = (lookbook: LookbookResponse) => {
    setSelectedLookbook(lookbook);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async (lookbookId: string) => {
    await fetch(`/api/lookbooks/${lookbookId}`, { method: "DELETE" });
    setLookbooks(lookbooks.filter((lb) => lb.id !== lookbookId));
    setSelectedLookbook(null);
  };

  const handleTogglePrivacy = (lookbook: LookbookResponse) => {
    setLookbooks(
      lookbooks.map((lb) =>
        lb.id === lookbook.id
          ? {
              ...lb,
              isPublic: !lb.isPublic,
              updatedAt: new Date(),
            }
          : lb,
      ),
    );
  };

  const handleShareLookbook = async (lookbook: LookbookResponse) => {
    const shareUrl = `${window.location.origin}/lookbooks/${lookbook.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: lookbook.name,
          text: lookbook.description ?? undefined,
          url: shareUrl,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const handleDuplicateLookbook = (lookbook: LookbookResponse) => {
    const duplicated = {
      ...lookbook,
      id: Date.now().toString(),
      name: `${lookbook.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setLookbooks([duplicated, ...lookbooks]);
  };

  // Filter and sort lookbooks
  const filteredLookbooks = lookbooks
    .filter((lookbook) => {
      if (searchQuery) {
        return (
          lookbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lookbook.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }
      if (selectedFilter === "public") return lookbook.isPublic;
      if (selectedFilter === "private") return !lookbook.isPublic;
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
          return b.lookCount - a.lookCount;
        default:
          return 0;
      }
    });

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
            <h3 className="font-semibold text-lg mb-2">
              {searchQuery ? "No lookbooks found" : "No lookbooks yet"}
            </h3>
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
      <CreateLookbookModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSave={handleCreateLookbook}
      />

      <EditLookbookModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        lookbook={
          selectedLookbook
            ? {
                id: selectedLookbook.id,
                name: selectedLookbook.name,
                description: selectedLookbook.description,
                isPublic: selectedLookbook.isPublic,
                coverImage: selectedLookbook.coverImage,
              }
            : null
        }
        onSave={(updated: EditableLookbook) =>
          handleSaveEdit({
            ...selectedLookbook!,
            name: updated.name,
            description: updated.description ?? null,
            isPublic: updated.isPublic,
            coverImage: updated.coverImage ?? null,
            updatedAt: new Date(),
          })
        }
      />

      <DeleteLookbookDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        lookbook={selectedLookbook}
        onConfirm={handleConfirmDelete}
      />

      <BottomNav />
    </div>
  );
}

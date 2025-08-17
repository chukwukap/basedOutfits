"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BottomNav } from "@/app/_components/bottom-nav";
import { WardrobeDetailsHeader } from "@/app/wardrobes/[id]/_components/wardrobe-details-header";
import {
  WardrobeOutfitsGrid,
  type Outfit as GridOutfit,
} from "@/app/wardrobes/[id]/_components/wardrobe-outfits-grid";
import { TipModal } from "@/app/_components/tip-modal";
import { CollectModal } from "@/app/_components/collect-modal";
import type { OutfitFetchPayload } from "@/lib/types";
import { EditWardrobeModal } from "../../_components/edit-wardrobe-modal";
import { DeleteWardrobeDialog } from "../../_components/delete-wardrobe-dialog";
import { ComposeCastButton } from "@/app/_components/compose-cast-button";
// Remove mocks: fetch real wardrobe + items from API

export default function WardrobeDetailsPageClient() {
  const params = useParams();
  const wardrobeId = params.id as string;

  type Wardrobe = {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    outfitCount: number;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    author: {
      name: string;
      avatar: string;
    };
    outfits: Array<{
      id: string;
      title: string;
      description: string;
      imageUrl: string;
      author: { name: string; avatar: string; fid: string };
      tips: number;
      collections: number;
      createdAt: string;
      addedAt: string;
    }>;
  };
  type OutfitItem = GridOutfit;
  const [wardrobe, setWardrobe] = useState<Wardrobe | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/wardrobes/${encodeURIComponent(wardrobeId)}`,
          {
            cache: "no-store",
          },
        );
        if (!res.ok) throw new Error("Failed to load wardrobe");
        const raw = await res.json();
        if (cancelled) return;
        // Map API shape to UI shape
        type RawWardrobeItem = {
          createdAt: string | Date;
          outfit: {
            id: string;
            caption?: string | null;
            description?: string | null;
            imageUrls: string[];
            createdAt: string | Date;
            author?: {
              name?: string | null;
              username?: string | null;
              avatarUrl?: string | null;
              fid?: string | null;
            } | null;
            tips?: unknown[] | null;
            saves?: unknown[] | null;
          };
        };
        const mapped: Wardrobe = {
          id: raw.id,
          name: raw.name,
          description: raw.description ?? "",
          coverImage: raw.coverImage ?? "",
          outfitCount: Array.isArray(raw.items) ? raw.items.length : 0,
          isPublic: Boolean(raw.isPublic),
          createdAt: new Date(raw.createdAt).toISOString(),
          updatedAt: new Date(raw.updatedAt).toISOString(),
          author: {
            name: raw.owner?.name ?? raw.owner?.username ?? "Unknown",
            avatar: raw.owner?.avatarUrl ?? "",
          },
          outfits: ((raw.items as RawWardrobeItem[] | undefined) || []).map(
            (it) => ({
              id: it.outfit.id,
              title: it.outfit.caption ?? "",
              description: it.outfit.description ?? "",
              imageUrl: (it.outfit.imageUrls && it.outfit.imageUrls[0]) || "",
              author: {
                name:
                  it.outfit.author?.name ?? it.outfit.author?.username ?? "",
                avatar: it.outfit.author?.avatarUrl ?? "",
                fid: it.outfit.author?.fid ?? it.outfit.author?.username ?? "",
              },
              tips: (it.outfit.tips || []).length,
              collections: (it.outfit.saves || []).length,
              createdAt: new Date(it.outfit.createdAt).toISOString(),
              addedAt: new Date(it.createdAt).toISOString(),
            }),
          ),
        };
        setWardrobe(mapped);
      } catch {
        setWardrobe(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [wardrobeId]);

  const handleEditWardrobe = () => {
    setShowEditModal(true);
  };

  const handleDeleteWardrobe = () => {
    setShowDeleteDialog(true);
  };

  const handleSaveEdit = (updatedWardrobe: Partial<Wardrobe>) => {
    setWardrobe((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updatedWardrobe,
        updatedAt: new Date().toISOString().split("T")[0],
      };
    });
    setShowEditModal(false);
  };

  const handleConfirmDelete = () => {
    // Navigate back to wardrobes page
    window.location.href = "/wardrobe";
  };

  const handleOutfitClick = (outfit: OutfitItem) => {
    // Navigate to outfit details
    window.location.href = `/outfits/${outfit.id}`;
  };

  const handleTipOutfit = (outfit: OutfitItem) => {
    setSelectedOutfit(outfit);
    setShowTipModal(true);
  };

  const handleCollectOutfit = (outfit: OutfitItem) => {
    setSelectedOutfit(outfit);
    setShowCollectModal(true);
  };

  const handleRemoveOutfit = (outfitId: string) => {
    if (wardrobe) {
      const updatedOutfits = wardrobe.outfits.filter(
        (outfit) => outfit.id !== outfitId,
      );
      setWardrobe({
        ...wardrobe,
        outfits: updatedOutfits,
        outfitCount: updatedOutfits.length,
        updatedAt: new Date().toISOString().split("T")[0],
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="animate-pulse">
          <div className="h-64 bg-muted" />
          <div className="p-4 space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!wardrobe) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Outfitly Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This wardrobe doesn&apos;t exist or has been deleted.
          </p>
          <button
            onClick={() => (window.location.href = "/wardrobe")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Back to Wardrobe
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <WardrobeDetailsHeader
        wardrobe={wardrobe}
        onEdit={handleEditWardrobe}
        onDelete={handleDeleteWardrobe}
      />

      {/* Outfits Grid */}
      <main className="p-4">
        <WardrobeOutfitsGrid
          outfits={wardrobe.outfits as GridOutfit[]}
          onOutfitClick={handleOutfitClick}
          onTipOutfit={handleTipOutfit}
          onCollectOutfit={handleCollectOutfit}
          onRemoveOutfit={handleRemoveOutfit}
        />
      </main>

      {/* Share */}
      <div className="px-4 py-2">
        <ComposeCastButton
          text={`Browsing the wardrobe: ${wardrobe.name}`}
          label="Share Wardrobe"
          variant="outline"
          size="sm"
        />
      </div>

      {/* Modals */}
      <EditWardrobeModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        wardrobe={{
          id: wardrobe.id,
          name: wardrobe.name,
          description: wardrobe.description,
          isPublic: wardrobe.isPublic,
          coverImage: wardrobe.coverImage,
        }}
        onSave={(updated) =>
          handleSaveEdit({
            id: updated.id,
            name: updated.name,
            description: updated.description ?? "",
            isPublic: updated.isPublic,
            coverImage: updated.coverImage ?? "",
          })
        }
      />

      <DeleteWardrobeDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        wardrobe={wardrobe}
        onConfirm={handleConfirmDelete}
      />

      {selectedOutfit && (
        <>
          <TipModal
            open={showTipModal}
            onOpenChange={setShowTipModal}
            outfit={
              selectedOutfit
                ? (function mapOutfit(): OutfitFetchPayload {
                    return {
                      id: selectedOutfit.id,
                      caption: selectedOutfit.title,
                      description: selectedOutfit.description,
                      imageUrls: [selectedOutfit.imageUrl],
                      author: {
                        isFollowing: false,
                        avatarUrl: selectedOutfit.author.avatar,
                        fid: selectedOutfit.author.fid,
                        name: selectedOutfit.author.name,
                      },

                      tips: selectedOutfit.tips,
                      collections: selectedOutfit.collections,

                      createdAt: new Date(),
                      isPublic: true,
                      authorId: `author-${selectedOutfit.author.fid}`,
                      updatedAt: new Date(),
                    } as OutfitFetchPayload;
                  })()
                : ({} as OutfitFetchPayload)
            }
            onComplete={() => setShowTipModal(false)}
          />
          <CollectModal
            open={showCollectModal}
            onOpenChange={setShowCollectModal}
            outfit={
              selectedOutfit
                ? (function mapOutfit(): OutfitFetchPayload {
                    return {
                      id: selectedOutfit.id,
                      caption: selectedOutfit.title,
                      description: selectedOutfit.description,
                      imageUrls: [selectedOutfit.imageUrl],
                      author: {
                        isFollowing: false,
                        avatarUrl: selectedOutfit.author.avatar,
                        fid: selectedOutfit.author.fid,
                        name: selectedOutfit.author.name,
                      },

                      tips: selectedOutfit.tips,
                      collections: selectedOutfit.collections,

                      createdAt: new Date(),
                      isPublic: true,
                      authorId: `author-${selectedOutfit.author.fid}`,
                      updatedAt: new Date(),
                    } as OutfitFetchPayload;
                  })()
                : ({} as OutfitFetchPayload)
            }
            onComplete={() => setShowCollectModal(false)}
          />
        </>
      )}

      <BottomNav />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BottomNav } from "@/app/_components/bottom-nav";
import { WardrobeDetailsHeader } from "@/app/wardrobe/[id]/_components/wardrobe-details-header";
import {
  WardrobeOutfitsGrid,
  type Outfit as GridOutfit,
} from "@/app/wardrobe/[id]/_components/wardrobe-outfits-grid";
import { TipModal } from "@/app/_components/tip-modal";
import { CollectModal } from "@/app/_components/collect-modal";
import type { OutfitFetchPayload } from "@/lib/types";
import { EditWardrobeModal } from "../../_components/edit-wardrobe-modal";
import { DeleteWardrobeDialog } from "../../_components/delete-wardrobe-dialog";

// Mock wardrobe data
const mockWardrobes = {
  "1": {
    id: "1",
    name: "Summer Vibes",
    description:
      "Light and breezy outfits for hot days. Perfect for beach trips, casual outings, and sunny adventures.",
    coverImage: "/summer-fashion-outfit.png",
    outfitCount: 12,
    isPublic: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    author: {
      name: "You",
      avatar: "/diverse-group-profile.png",
    },
    outfits: [
      {
        id: "outfit-1",
        title: "Beach Day Casual",
        description: "Perfect for a day by the ocean",
        imageUrl: "/summer-fashion-outfit.png",
        author: {
          name: "Sarah Chen",
          avatar: "/diverse-group-profile.png",
          fid: "sarahc",
        },
        // simplified: no tags/brands
        tips: 15,
        collections: 8,
        // simplified: no location
        createdAt: "2 days ago",
        addedAt: "2024-01-20",
      },
      {
        id: "outfit-2",
        title: "Sunny Brunch Outfit",
        description: "Bright and cheerful for weekend brunches",
        imageUrl: "/fashionable-summer-outfit.png",
        author: {
          name: "Alex Rivera",
          avatar: "/diverse-group-profile.png",
          fid: "alexr",
        },
        // simplified: no tags/brands
        tips: 22,
        collections: 12,
        // simplified: no location
        createdAt: "3 days ago",
        addedAt: "2024-01-19",
      },
      {
        id: "outfit-3",
        title: "Festival Ready",
        description: "Boho vibes for music festivals",
        imageUrl: "/street-style-outfit.png",
        author: {
          name: "Jordan Kim",
          avatar: "/diverse-group-profile.png",
          fid: "jordank",
        },
        // simplified: no tags/brands
        tips: 18,
        collections: 15,
        // simplified: no location
        createdAt: "1 week ago",
        addedAt: "2024-01-18",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Work Wardrobe",
    description: "Professional outfits for the office and business meetings.",
    coverImage: "/business-casual-outfit.png",
    outfitCount: 8,
    isPublic: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    author: {
      name: "You",
      avatar: "/diverse-group-profile.png",
    },
    outfits: [
      {
        id: "outfit-4",
        title: "Monday Meeting",
        description: "Sharp and professional for important meetings",
        imageUrl: "/business-casual-outfit.png",
        author: {
          name: "Taylor Swift",
          avatar: "/diverse-group-profile.png",
          fid: "tswift",
        },
        // simplified: no tags/brands
        tips: 9,
        collections: 12,
        // simplified: no location
        createdAt: "5 days ago",
        addedAt: "2024-01-16",
      },
      {
        id: "outfit-5",
        title: "Casual Friday",
        description: "Relaxed but still office-appropriate",
        imageUrl: "/elegant-evening-dress.png",
        author: {
          name: "Maya Patel",
          avatar: "/diverse-group-profile.png",
          fid: "mayap",
        },
        // simplified: no tags/brands
        tips: 14,
        collections: 7,
        // simplified: no location
        createdAt: "1 week ago",
        addedAt: "2024-01-15",
      },
    ],
  },
};

export default function WardrobeDetailsPageClient() {
  const params = useParams();
  const wardrobeId = params.id as string;

  type Wardrobe = (typeof mockWardrobes)[keyof typeof mockWardrobes];
  type OutfitItem = GridOutfit;
  const [wardrobe, setWardrobe] = useState<Wardrobe | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const foundWardrobe =
        mockWardrobes[wardrobeId as keyof typeof mockWardrobes];
      setWardrobe(foundWardrobe || null);
      setLoading(false);
    }, 500);
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
    window.location.href = `/outfit/${outfit.id}`;
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

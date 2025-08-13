"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BottomNav } from "@/app/_components/bottom-nav";
import { LookbookDetailsHeader } from "@/app/lookbooks/[id]/_components/lookbook-details-header";
import { LookbookLooksGrid } from "@/app/lookbooks/[id]/_components/lookbook-looks-grid";
import { EditLookbookModal } from "@/app/lookbooks/_components/edit-lookbook-modal";
import { DeleteLookbookDialog } from "@/app/lookbooks/_components/delete-lookbook-dialog";
import { TipModal } from "@/app/_components/tip-modal";
import { CollectModal } from "@/app/_components/collect-modal";

// Mock lookbook data
const mockLookbooks = {
  "1": {
    id: "1",
    name: "Summer Vibes",
    description:
      "Light and breezy outfits for hot days. Perfect for beach trips, casual outings, and sunny adventures.",
    coverImage: "/summer-fashion-outfit.png",
    lookCount: 12,
    isPublic: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    author: {
      name: "You",
      avatar: "/diverse-group-profile.png",
    },
    looks: [
      {
        id: "look-1",
        title: "Beach Day Casual",
        description: "Perfect for a day by the ocean",
        imageUrl: "/summer-fashion-outfit.png",
        author: {
          name: "Sarah Chen",
          avatar: "/diverse-group-profile.png",
          fid: "sarahc",
        },
        tags: ["summer", "beach", "casual"],
        brands: ["Zara", "H&M"],
        tips: 15,
        collections: 8,
        location: "Malibu",
        createdAt: "2 days ago",
        addedAt: "2024-01-20",
      },
      {
        id: "look-2",
        title: "Sunny Brunch Look",
        description: "Bright and cheerful for weekend brunches",
        imageUrl: "/fashionable-summer-outfit.png",
        author: {
          name: "Alex Rivera",
          avatar: "/diverse-group-profile.png",
          fid: "alexr",
        },
        tags: ["brunch", "weekend", "bright"],
        brands: ["Mango", "COS"],
        tips: 22,
        collections: 12,
        location: "LA",
        createdAt: "3 days ago",
        addedAt: "2024-01-19",
      },
      {
        id: "look-3",
        title: "Festival Ready",
        description: "Boho vibes for music festivals",
        imageUrl: "/street-style-outfit.png",
        author: {
          name: "Jordan Kim",
          avatar: "/diverse-group-profile.png",
          fid: "jordank",
        },
        tags: ["festival", "boho", "music"],
        brands: ["Free People", "Urban Outfitters"],
        tips: 18,
        collections: 15,
        location: "Coachella",
        createdAt: "1 week ago",
        addedAt: "2024-01-18",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Work Wardrobe",
    description: "Professional looks for the office and business meetings.",
    coverImage: "/business-casual-outfit.png",
    lookCount: 8,
    isPublic: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    author: {
      name: "You",
      avatar: "/diverse-group-profile.png",
    },
    looks: [
      {
        id: "look-4",
        title: "Monday Meeting",
        description: "Sharp and professional for important meetings",
        imageUrl: "/business-casual-outfit.png",
        author: {
          name: "Taylor Swift",
          avatar: "/diverse-group-profile.png",
          fid: "tswift",
        },
        tags: ["business", "professional", "meeting"],
        brands: ["Uniqlo", "Everlane"],
        tips: 9,
        collections: 12,
        location: "NYC",
        createdAt: "5 days ago",
        addedAt: "2024-01-16",
      },
      {
        id: "look-5",
        title: "Casual Friday",
        description: "Relaxed but still office-appropriate",
        imageUrl: "/elegant-evening-dress.png",
        author: {
          name: "Maya Patel",
          avatar: "/diverse-group-profile.png",
          fid: "mayap",
        },
        tags: ["casual", "friday", "office"],
        brands: ["Loft", "Banana Republic"],
        tips: 14,
        collections: 7,
        location: "SF",
        createdAt: "1 week ago",
        addedAt: "2024-01-15",
      },
    ],
  },
};

export default function LookbookDetailsPage() {
  const params = useParams();
  const lookbookId = params.id as string;

  const [lookbook, setLookbook] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedLook, setSelectedLook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const foundLookbook =
        mockLookbooks[lookbookId as keyof typeof mockLookbooks];
      setLookbook(foundLookbook || null);
      setLoading(false);
    }, 500);
  }, [lookbookId]);

  const handleEditLookbook = () => {
    setShowEditModal(true);
  };

  const handleDeleteLookbook = () => {
    setShowDeleteDialog(true);
  };

  const handleSaveEdit = (updatedLookbook: any) => {
    setLookbook({
      ...lookbook,
      ...updatedLookbook,
      updatedAt: new Date().toISOString().split("T")[0],
    });
    setShowEditModal(false);
  };

  const handleConfirmDelete = () => {
    // Navigate back to lookbooks page
    window.location.href = "/lookbooks";
  };

  const handleLookClick = (look: any) => {
    // Navigate to look details
    window.location.href = `/look/${look.id}`;
  };

  const handleTipLook = (look: any) => {
    setSelectedLook(look);
    setShowTipModal(true);
  };

  const handleCollectLook = (look: any) => {
    setSelectedLook(look);
    setShowCollectModal(true);
  };

  const handleRemoveLook = (lookId: string) => {
    if (lookbook) {
      const updatedLooks = lookbook.looks.filter(
        (look: any) => look.id !== lookId,
      );
      setLookbook({
        ...lookbook,
        looks: updatedLooks,
        lookCount: updatedLooks.length,
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

  if (!lookbook) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Lookbook Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This lookbook doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => (window.location.href = "/lookbooks")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Back to Lookbooks
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <LookbookDetailsHeader
        lookbook={lookbook}
        onEdit={handleEditLookbook}
        onDelete={handleDeleteLookbook}
      />

      {/* Looks Grid */}
      <main className="p-4">
        <LookbookLooksGrid
          looks={lookbook.looks}
          onLookClick={handleLookClick}
          onTipLook={handleTipLook}
          onCollectLook={handleCollectLook}
          onRemoveLook={handleRemoveLook}
        />
      </main>

      {/* Modals */}
      <EditLookbookModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        lookbook={lookbook}
        onSave={handleSaveEdit}
      />

      <DeleteLookbookDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        lookbook={lookbook}
        onConfirm={handleConfirmDelete}
      />

      {selectedLook && (
        <>
          <TipModal
            open={showTipModal}
            onOpenChange={setShowTipModal}
            look={selectedLook}
            onComplete={() => setShowTipModal(false)}
          />
          <CollectModal
            open={showCollectModal}
            onOpenChange={setShowCollectModal}
            look={selectedLook}
            onComplete={() => setShowCollectModal(false)}
          />
        </>
      )}

      <BottomNav />
    </div>
  );
}

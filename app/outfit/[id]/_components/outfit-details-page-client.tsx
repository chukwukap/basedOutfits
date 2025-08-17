"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { TipModal } from "@/app/_components/tip-modal";
import { CollectModal } from "@/app/_components/collect-modal";
import { CommentsSection } from "./comments-section";
import { ArrowLeft, Share2, DollarSign, Heart } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { ComposeCastButton } from "@/app/_components/compose-cast-button";
import type { OutfitFetchPayload } from "@/lib/types";
import { OutfitDetailView } from "./outfit-detail-view";
// Local type matching the UI detail view's expected shape
type DetailedOutfit = {
  id: string;
  title: string;
  description: string;
  images: string[];
  author: {
    name: string;
    avatar: string;
    fid: string;
    bio: string;
    followers: number;
    following: number;
  };
  // simplified: no tags/brands
  tips: number;
  collections: number;
  // simplified: no location
  createdAt: string;
  // simplified: no extras
};

function toOutfitFetchPayload(outfit: DetailedOutfit): OutfitFetchPayload {
  return {
    id: outfit.id,
    caption: outfit.title,
    description: outfit.description,
    imageUrls: outfit.images,
    author: {
      isFollowing: true,
      avatarUrl: outfit.author.avatar,
      fid: outfit.author.fid,
      name: outfit.author.name,
    },
    tips: outfit.tips,
    collections: outfit.collections,
    createdAt: new Date(),
    isPublic: true,
    authorId: `author-${outfit.author.fid}`,
    updatedAt: new Date(),
  } as OutfitFetchPayload;
}

type OutfitApiResponse = {
  id: string;
  caption: string;
  description: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  authorId: string;
  tips: number;
  collections: number;
  author: {
    isFollowing: boolean;
    avatarUrl: string;
    fid: string;
    name: string;
  };
};

async function fetchOutfitById(id: string): Promise<OutfitApiResponse | null> {
  const res = await fetch(`/api/outfits/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as OutfitApiResponse;
}

export default function OutfitDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const [outfit, setOutfit] = useState<DetailedOutfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOutfit, setSelectedOutfit] = useState<DetailedOutfit | null>(
    null,
  );
  const [showTipModal, setShowTipModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);

  useEffect(() => {
    const loadOutfit = async () => {
      setLoading(true);
      const outfitId = params.id as string;
      const data = await fetchOutfitById(outfitId);
      if (data) {
        const detailed: DetailedOutfit = {
          id: data.id,
          title: data.caption,
          description: data.description,
          images: data.imageUrls,
          author: {
            name: data.author.name,
            avatar: data.author.avatarUrl,
            fid: data.author.fid,
            bio: "",
            followers: 0,
            following: 0,
          },
          tips: data.tips,
          collections: data.collections,
          createdAt: "",
        };
        setOutfit(detailed);
      } else {
        setOutfit(null);
      }
      setLoading(false);
    };

    loadOutfit();
  }, [params.id]);

  const handleTip = (outfitData: DetailedOutfit) => {
    setSelectedOutfit(outfitData);
    setShowTipModal(true);
  };

  const handleCollect = (outfitData: DetailedOutfit) => {
    setSelectedOutfit(outfitData);
    setShowCollectModal(true);
  };

  const handleTipComplete = (amount: number) => {
    console.log("handleTipComplete", amount);
    if (outfit) {
      setOutfit({ ...outfit, tips: (outfit.tips || 0) + 1 });
    }
    setShowTipModal(false);
    setSelectedOutfit(null);
  };

  const handleCollectComplete = () => {
    if (outfit) {
      setOutfit({ ...outfit, collections: (outfit.collections || 0) + 1 });
    }
    setShowCollectModal(false);
    setSelectedOutfit(null);
  };

  const handleShare = async () => {
    if (!outfit) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: outfit.title,
          text: outfit.description,
          url: window.location.href,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-muted" />
          <div className="aspect-square bg-muted" />
          <div className="p-4 space-y-4">
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!outfit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Outfit not found</h1>
          <p className="text-muted-foreground mb-4">
            This outfit might have been removed or doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/")}>Back to Feed</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate flex-1 mx-4">
            {outfit.title}
          </h1>
          <ComposeCastButton
            text={outfit.title ? `Check out this outfit: ${outfit.title}` : "Check out this outfit"}
            size="sm"
            variant="ghost"
            className="p-2"
            label="Share"
          />
        </div>
      </header>

      {/* Outfit Detail - No embedded actions */}
      <OutfitDetailView outfit={outfit} />

      {/* Comments Section */}
      <CommentsSection outfitId={outfit.id} />

      {/* Other Outfits by This Poster */}
      <div className="px-4 py-6">
        <h3 className="text-lg font-semibold mb-4">
          Other Outfits by {outfit.author.name}
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-32 cursor-pointer"
              onClick={() => router.push(`/outfit/${i + 10}`)}
            >
              <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                <picture>
                  <img
                    src={`/stylish-streetwear-outfit.png?key=xshoq&height=128&width=128&query=fashion outfit ${i}`}
                    alt={`Outfit ${i}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </picture>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Outfit Title {i}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={() => handleTip(outfit)}
            className="flex-1 bg-transparent hover:bg-primary/5"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Tip
          </Button>
          <Button onClick={() => handleCollect(outfit)} className="flex-1">
            <Heart className="w-4 h-4 mr-2" />
            Collect
          </Button>
          <ComposeCastButton
            text={outfit.title ? `I found this outfit: ${outfit.title}` : "I found this outfit"}
            size="sm"
            variant="outline"
            className="px-4 bg-transparent"
            label="Share"
          />
        </div>
      </div>

      {/* Modals */}
      {selectedOutfit && (
        <>
          <TipModal
            open={showTipModal}
            onOpenChange={setShowTipModal}
            outfit={toOutfitFetchPayload(selectedOutfit)}
            onComplete={handleTipComplete}
          />
          <CollectModal
            open={showCollectModal}
            onOpenChange={setShowCollectModal}
            outfit={toOutfitFetchPayload(selectedOutfit)}
            onComplete={handleCollectComplete}
          />
        </>
      )}
    </div>
  );
}

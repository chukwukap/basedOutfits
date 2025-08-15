"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LookDetailView } from "../_components/look-detail-view";
import { TipModal } from "@/app/_components/tip-modal";
import { CollectModal } from "@/app/_components/collect-modal";
import { CommentsSection } from "./_components/comments-section";
import { ArrowLeft, Share2, DollarSign, Heart } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import type { LookFetchPayload } from "@/lib/types";
// Local type matching the UI detail view's expected shape
type DetailedLook = {
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

function toLookFetchPayload(look: DetailedLook): LookFetchPayload {
  return {
    id: look.id,
    caption: look.title,
    description: look.description,
    imageUrls: look.images,
    author: {
      isFollowing: true,
      avatarUrl: look.author.avatar,
      fid: look.author.fid,
      name: look.author.name,
    },
    tips: look.tips,
    collections: look.collections,
    createdAt: new Date(),
    isPublic: true,
    authorId: `author-${look.author.fid}`,
    updatedAt: new Date(),
  } as LookFetchPayload;
}

type LookApiResponse = {
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

async function fetchLookById(id: string): Promise<LookApiResponse | null> {
  const res = await fetch(`/api/looks/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as LookApiResponse;
}

export default function LookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [look, setLook] = useState<DetailedLook | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLook, setSelectedLook] = useState<DetailedLook | null>(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);

  useEffect(() => {
    const loadLook = async () => {
      setLoading(true);
      const lookId = params.id as string;
      const data = await fetchLookById(lookId);
      if (data) {
        const detailed: DetailedLook = {
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
        setLook(detailed);
      } else {
        setLook(null);
      }
      setLoading(false);
    };

    loadLook();
  }, [params.id]);

  const handleTip = (lookData: DetailedLook) => {
    setSelectedLook(lookData);
    setShowTipModal(true);
  };

  const handleCollect = (lookData: DetailedLook) => {
    setSelectedLook(lookData);
    setShowCollectModal(true);
  };

  const handleTipComplete = (amount: number) => {
    console.log("handleTipComplete", amount);
    if (look) {
      setLook({ ...look, tips: (look.tips || 0) + 1 });
    }
    setShowTipModal(false);
    setSelectedLook(null);
  };

  const handleCollectComplete = () => {
    if (look) {
      setLook({ ...look, collections: (look.collections || 0) + 1 });
    }
    setShowCollectModal(false);
    setSelectedLook(null);
  };

  const handleShare = async () => {
    if (!look) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: look.title,
          text: look.description,
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

  if (!look) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Look not found</h1>
          <p className="text-muted-foreground mb-4">
            This look might have been removed or doesn&apos;t exist.
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
            {look.title}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="p-2"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Look Detail - No embedded actions */}
      <LookDetailView look={look} />

      {/* Comments Section */}
      <CommentsSection lookId={look.id} />

      {/* Other Looks by This Poster */}
      <div className="px-4 py-6">
        <h3 className="text-lg font-semibold mb-4">
          Other Looks by {look.author.name}
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-32 cursor-pointer"
              onClick={() => router.push(`/look/${i + 10}`)}
            >
              <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                <picture>
                  <img
                    src={`/stylish-streetwear-look.png?key=xshoq&height=128&width=128&query=fashion look ${i}`}
                    alt={`Look ${i}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </picture>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Look Title {i}
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
            onClick={() => handleTip(look)}
            className="flex-1 bg-transparent hover:bg-primary/5"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Tip
          </Button>
          <Button onClick={() => handleCollect(look)} className="flex-1">
            <Heart className="w-4 h-4 mr-2" />
            Collect
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="px-4 bg-transparent"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      {selectedLook && (
        <>
          <TipModal
            open={showTipModal}
            onOpenChange={setShowTipModal}
            look={toLookFetchPayload(selectedLook)}
            onComplete={handleTipComplete}
          />
          <CollectModal
            open={showCollectModal}
            onOpenChange={setShowCollectModal}
            look={toLookFetchPayload(selectedLook)}
            onComplete={handleCollectComplete}
          />
        </>
      )}
    </div>
  );
}

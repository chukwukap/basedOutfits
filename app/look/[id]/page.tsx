"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LookDetailView } from "@/app/_components/look-detail-view";
import { TipModal } from "@/app/_components/tip-modal";
import { CollectModal } from "@/app/_components/collect-modal";
import { ArrowLeft, Share2, DollarSign, Heart } from "lucide-react";
import { Button } from "@/app/_components/ui/button";

// Mock look data - in real app this would come from API
const mockLookData = {
  "1": {
    id: "1",
    title: "Summer Vibes",
    description:
      "Perfect outfit for a sunny day in the city. Love mixing casual pieces with statement accessories! This look is all about comfort meets style - the key is in the layering and choosing pieces that work together harmoniously.",
    images: [
      "/fashionable-summer-outfit.png",
      "/summer-fashion-outfit.png",
      "/stylish-person-streetwear.png",
    ],
    author: {
      name: "Sarah Chen",
      avatar: "/diverse-group-profile.png",
      fid: "12345",
      bio: "Fashion enthusiast from NYC. Love mixing high and low pieces!",
      followers: 1240,
      following: 890,
    },
    tags: ["summer", "casual", "streetwear", "accessories", "layering"],
    brands: ["Zara", "Nike", "Vintage"],
    tips: 12,
    collections: 8,
    location: "New York",
    createdAt: "2h ago",
    season: "Summer",
    occasion: "Casual day out",
    colors: ["Blue", "White", "Beige"],
  },
  "2": {
    id: "2",
    title: "Evening Elegance",
    description:
      "Sophisticated look for dinner dates. This dress makes me feel confident and beautiful. Perfect for those special occasions when you want to make an impression.",
    images: ["/elegant-evening-dress.png"],
    author: {
      name: "Alex Rivera",
      avatar: "/diverse-group-profile.png",
      fid: "67890",
      bio: "Style blogger and fashion consultant. Helping others find their style!",
      followers: 2100,
      following: 450,
    },
    tags: ["evening", "elegant", "formal", "date", "sophisticated"],
    brands: ["H&M", "Mango"],
    tips: 24,
    collections: 15,
    location: "Paris",
    createdAt: "4h ago",
    season: "All seasons",
    occasion: "Evening dinner",
    colors: ["Black", "Gold"],
  },
};

export default function LookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [look, setLook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLook, setSelectedLook] = useState<any>(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);

  useEffect(() => {
    const loadLook = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const lookId = params.id as string;
      const lookData = mockLookData[lookId as keyof typeof mockLookData];

      if (lookData) {
        setLook(lookData);
      }
      setLoading(false);
    };

    loadLook();
  }, [params.id]);

  const handleTip = (lookData: any) => {
    setSelectedLook(lookData);
    setShowTipModal(true);
  };

  const handleCollect = (lookData: any) => {
    setSelectedLook(lookData);
    setShowCollectModal(true);
  };

  const handleTipComplete = (amount: number) => {
    if (look) {
      setLook({ ...look, tips: look.tips + 1 });
    }
    setShowTipModal(false);
    setSelectedLook(null);
  };

  const handleCollectComplete = () => {
    if (look) {
      setLook({ ...look, collections: look.collections + 1 });
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
      } catch (err) {
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
            This look might have been removed or doesn't exist.
          </p>
          <Button onClick={() => router.push("/")}>Back to Feed</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
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

      {/* Other Looks by This Poster */}
      <div className="px-4 py-6">
        <h3 className="text-lg font-semibold mb-4">
          Other Looks by {look.author.name}
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* Mock other looks by same author */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-32 cursor-pointer"
              onClick={() => router.push(`/look/${i + 10}`)}
            >
              <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                <img
                  src={`/stylish-streetwear-look.png?key=xshoq&height=128&width=128&query=fashion look ${i}`}
                  alt={`Look ${i}`}
                  className="w-full h-full object-cover"
                />
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
            look={selectedLook}
            onComplete={handleTipComplete}
          />
          <CollectModal
            open={showCollectModal}
            onOpenChange={setShowCollectModal}
            look={selectedLook}
            onComplete={handleCollectComplete}
          />
        </>
      )}
    </div>
  );
}

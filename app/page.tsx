"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BottomNav } from "./_components/bottom-nav";
import { LookCard } from "./look/_components/look-card";
import { LookCardSkeleton } from "./look/_components/look-card-skeleton";
import { TipModal } from "./_components/tip-modal";
import { CollectModal } from "./_components/collect-modal";
import { OnboardingTutorial } from "./_components/onboarding-tutorial";
import { TrendingTags } from "./_components/trending-tags";
import { DiscoverCreators } from "./discover/_components/discover-creators";
import { RefreshCw, Users, Globe } from "lucide-react";
import { Button } from "./_components/ui/button";
import { LookFetchPayload } from "@/lib/types";

const mockLooks: LookFetchPayload[] = [
  {
    id: "1",
    caption: "Summer Vibes",
    description:
      "Perfect outfit for a sunny day in the city. Love mixing casual pieces with statement accessories!",
    imageUrls: ["/fashionable-summer-outfit.png"],
    author: {
      name: "Sarah Chen",
      avatarUrl: "/diverse-group-profile.png",
      fid: "12345",
      isFollowing: true,
    },
    tags: ["SummerFits", "Streetwear", "Accessories"],
    brands: ["Zara", "Nike"],
    tips: 12,
    collections: 8,
    location: "New York",
    createdAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours ago
    isPublic: true,
    authorId: "1",
    updatedAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    caption: "Evening Elegance",
    description:
      "Sophisticated look for dinner dates. This dress makes me feel confident and beautiful.",
    imageUrls: ["/elegant-evening-dress.png"],
    author: {
      name: "Alex Rivera",
      avatarUrl: "/diverse-group-profile.png",
      fid: "67890",
      isFollowing: false,
    },
    tags: ["OfficeChic", "Minimalist", "DateNight"],
    brands: ["H&M", "Mango"],
    tips: 24,
    collections: 15,
    location: "Paris",
    createdAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours ago
    isPublic: true,
    authorId: "2",
    updatedAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
  },
  {
    id: "3",
    caption: "Street Style Maven",
    description:
      "Channeling my inner street style photographer today. Bold colors and patterns are my thing!",
    imageUrls: ["/street-style-outfit.png"],
    author: {
      name: "Jordan Kim",
      avatarUrl: "/diverse-group-profile.png",
      fid: "11111",
      isFollowing: true,
    },
    tags: ["Streetwear", "Bold", "Urban"],
    brands: ["Supreme", "Off-White", "Converse"],
    tips: 18,
    collections: 22,
    location: "Tokyo",
    createdAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours ago
    isPublic: true,
    authorId: "3",
    updatedAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
  },
  {
    id: "4",
    caption: "Business Casual Chic",
    description:
      "Work from home but make it fashion. Comfortable yet professional for video calls.",
    imageUrls: ["/business-casual-outfit.png"],
    author: {
      name: "Taylor Swift",
      avatarUrl: "/diverse-group-profile.png",
      fid: "22222",
      isFollowing: true,
    },
    tags: ["OfficeChic", "Professional", "WFH"],
    brands: ["Uniqlo", "Everlane"],
    tips: 9,
    collections: 12,
    location: "San Francisco",
    createdAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours ago
    isPublic: true,
    authorId: "4",
    updatedAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
  },
  {
    id: "5",
    caption: "Cozy Weekend Vibes",
    description:
      "Perfect lazy Sunday outfit. Comfort is key but still want to look put together.",
    imageUrls: ["/summer-fashion-outfit.png"],
    author: {
      name: "Maya Patel",
      avatarUrl: "/diverse-group-profile.png",
      fid: "33333",
      isFollowing: false,
    },
    tags: ["Weekend", "Minimalist", "Comfort"],
    brands: ["Lululemon", "Patagonia"],
    tips: 15,
    collections: 7,
    location: "Los Angeles",
    createdAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours ago
    isPublic: true,
    authorId: "5",
    updatedAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
  },
];

export default function HomePage() {
  const [looks, setLooks] = useState<typeof mockLooks>([]);
  const [filteredLooks, setFilteredLooks] = useState<typeof mockLooks>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLook, setSelectedLook] = useState<
    (typeof mockLooks)[0] | null
  >(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<"all" | "following">("all");

  const [, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const checkFirstTimeUser = () => {
    const hasSeenOnboarding = localStorage.getItem(
      "looks_onboarding_completed",
    );
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    setOnboardingChecked(true);
  };

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  // Simulate loading feed
  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLooks(mockLooks);
      setLoading(false);
    };

    // Only load feed after onboarding check is complete
    if (onboardingChecked) {
      loadFeed();
    }
  }, [onboardingChecked]);

  useEffect(() => {
    let filtered = looks;

    // Filter by feed type (following vs all)
    if (feedType === "following") {
      filtered = filtered.filter((look) => look.author.isFollowing);
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter((look) =>
        look.tags.some(
          (tag) => tag.toLowerCase() === selectedTag.toLowerCase(),
        ),
      );
    }

    setFilteredLooks(filtered);
  }, [looks, selectedTag, feedType]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In real app, this would fetch new looks
    setLooks([...mockLooks]);
    setRefreshing(false);
  };

  const handleTip = (look: (typeof mockLooks)[0]) => {
    setSelectedLook(look);
    setShowTipModal(true);
  };

  const handleCollect = (look: (typeof mockLooks)[0]) => {
    setSelectedLook(look);
    setShowCollectModal(true);
  };

  const handleTipComplete = (amount: number) => {
    console.log("handleTipComplete", amount);
    if (selectedLook) {
      // Update tip count optimistically
      setLooks((prev) =>
        prev.map((look) =>
          look.id === selectedLook.id ? { ...look, tips: look.tips + 1 } : look,
        ),
      );
    }
    setShowTipModal(false);
    setSelectedLook(null);
  };

  const handleCollectComplete = () => {
    if (selectedLook) {
      // Update collection count optimistically
      setLooks((prev) =>
        prev.map((look) =>
          look.id === selectedLook.id
            ? { ...look, collections: look.collections + 1 }
            : look,
        ),
      );
    }
    setShowCollectModal(false);
    setSelectedLook(null);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("looks_onboarding_completed", "true");
    setShowOnboarding(false);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleFeedToggle = () => {
    setFeedType(feedType === "all" ? "following" : "all");
  };

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.scrollY;
    const direction = scrollY > lastScrollY.current ? "down" : "up";

    if (
      direction !== scrollDirection &&
      Math.abs(scrollY - lastScrollY.current) > 10
    ) {
      setScrollDirection(direction);
    }

    setScrollY(scrollY);
    setIsScrolled(scrollY > 50);
    lastScrollY.current = scrollY > 0 ? scrollY : 0;
    ticking.current = false;
  }, [scrollDirection]);

  const requestTick = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateScrollDirection);
      ticking.current = true;
    }
  }, [updateScrollDirection]);

  useEffect(() => {
    const onScroll = () => requestTick();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [requestTick]);

  if (showOnboarding) {
    return <OnboardingTutorial onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header
        className="fixed top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${scrollDirection === "down" && isScrolled ? "-85%" : "0%"})`,
        }}
      >
        <div className="flex items-center justify-between p-4 gap-3">
          {/* Left: App Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block">Looks</span>
          </div>

          {/* Middle: Trending Tags */}
          <div className="flex-1 min-w-0">
            <TrendingTags
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
            />
          </div>

          {/* Right: Feed Toggle & Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant={feedType === "following" ? "default" : "ghost"}
              size="sm"
              onClick={handleFeedToggle}
              className="p-2"
            >
              {feedType === "following" ? (
                <Users className="w-4 h-4" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-[73px]">
        {(selectedTag || feedType === "following") && (
          <div className="px-4 py-2 bg-muted/50 border-b">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {feedType === "following" && <span>Following</span>}
              {selectedTag && (
                <>
                  {feedType === "following" && <span>•</span>}
                  <span>#{selectedTag}</span>
                </>
              )}
              <span>• {filteredLooks.length} looks</span>
            </div>
          </div>
        )}

        {/* Feed */}
        <main className="px-4 py-6 space-y-6">
          {loading
            ? // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <LookCardSkeleton key={i} />
              ))
            : filteredLooks.map((look) => (
                <LookCard
                  key={look.id}
                  look={look}
                  onTip={() => handleTip(look)}
                  onCollect={() => handleCollect(look)}
                />
              ))}

          {!loading && filteredLooks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👗</span>
              </div>
              <h3 className="font-semibold mb-2">No looks found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {selectedTag
                  ? `No looks found for #${selectedTag}`
                  : "No looks from people you follow"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTag(null);
                  setFeedType("all");
                }}
              >
                View All Looks
              </Button>
            </div>
          )}
        </main>

        {!loading && filteredLooks.length > 0 && (
          <DiscoverCreators selectedTag={selectedTag} />
        )}
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

      <BottomNav scrollDirection={scrollDirection} isScrolled={isScrolled} />
    </div>
  );
}

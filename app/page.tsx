"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
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
import { useSearchParams } from "next/navigation";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import Image from "next/image";

async function fetchLooks(params: {
  tag?: string | null;
  following?: boolean;
}) {
  const qs = new URLSearchParams();
  if (params.tag) qs.set("tag", params.tag);
  if (params.following) qs.set("following", "1");
  const res = await fetch(`/api/looks?${qs.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load looks");
  return (await res.json()) as LookFetchPayload[];
}

function HomePageInner() {
  const searchParams = useSearchParams();
  const { context } = useMiniKit();
  const { address: walletAddress } = useAccount();
  const [looks, setLooks] = useState<LookFetchPayload[]>([]);
  const [filteredLooks, setFilteredLooks] = useState<LookFetchPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLook, setSelectedLook] = useState<LookFetchPayload | null>(
    null,
  );
  const [showTipModal, setShowTipModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<"foryou" | "following">("foryou");

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

  // Load feed
  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      const tagFromUrl = searchParams.get("tag");
      try {
        const data = await fetchLooks({
          tag: tagFromUrl,
          following: feedType === "following",
        });
        setLooks(data);
      } catch {
        setLooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (onboardingChecked) loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingChecked, feedType, searchParams]);

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
    try {
      const data = await fetchLooks({
        tag: selectedTag,
        following: feedType === "following",
      });
      setLooks(data);
    } finally {
      setRefreshing(false);
    }
  };

  const handleTip = (look: LookFetchPayload) => {
    setSelectedLook(look);
    setShowTipModal(true);
  };

  const handleCollect = (look: LookFetchPayload) => {
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
    // On first-time completion, if context exists, ensure user exists in DB
    try {
      const c = context || null;
      const fid = c?.user?.fid?.toString();
      const username = c?.user?.username;
      const name = c?.user?.displayName;
      const avatarUrl = c?.user?.pfpUrl;
      if (fid && username) {
        fetch("/api/users/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fid,
            username,
            name,
            avatarUrl,
            walletAddress,
          }),
        });
      }
    } catch {}
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleFeedToggle = () => {
    setFeedType(feedType === "foryou" ? "following" : "foryou");
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
            <Image
              src="/logo.png"
              alt="Looks"
              width={32}
              height={32}
              className="rounded-lg"
            />
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
                  setFeedType("foryou");
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

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomePageInner />
    </Suspense>
  );
}

// Ensure the home route is never statically cached
export const dynamic = "force-dynamic";

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useSWR from "swr";
import { BottomNav } from "@/app/_components/bottom-nav";
import { TipModal } from "@/app/_components/tip-modal";
import { CollectModal } from "@/app/_components/collect-modal";
import { OnboardingTutorial } from "@/app/_components/onboarding-tutorial";
import { DiscoverCreators } from "@/app/discover/_components/discover-creators";
import { OutfitFetchPayload } from "@/lib/types";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useTheme } from "@/contexts/theme-context";
import { OutfitCardSkeleton } from "@/app/outfits/[id]/_components/outfit-card-skeleton";
import { OutfitCard } from "@/app/outfits/[id]/_components/outfit-card";

/**
 * Fetches outfits from the API securely.
 * @returns Array of OutfitFetchPayload.
 */
const fetcher = async (url: string): Promise<OutfitFetchPayload[]> => {
  // Security: Always use no-store to avoid leaking sensitive data in cache
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load outfits");
  return (await res.json()) as OutfitFetchPayload[];
};

function HomePageInner() {
  useUser();
  const [selectedOutfit, setSelectedOutfit] =
    useState<OutfitFetchPayload | null>(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const { setModalOpen } = useTheme();
  // Scroll state
  const [, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  /**
   * Checks if the user is a first-time visitor and shows onboarding if needed.
   */
  const checkFirstTimeUser = () => {
    const hasSeenOnboarding = localStorage.getItem(
      "outfitly_onboarding_complete",
    );
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    setOnboardingChecked(true);
  };

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  // Use SWR for fetching outfits with auto-refresh every 30 seconds
  const {
    data: outfits = [],
    isLoading,
    mutate: mutateOutfits,
  } = useSWR(onboardingChecked ? "/api/outfits" : null, fetcher, {
    refreshInterval: 30000, // 30 seconds
    revalidateOnFocus: true, // Security: always revalidate on focus
    shouldRetryOnError: true,
  });

  /**
   * Handles tipping a outfit.
   * @param outfit - The outfit to tip.
   */
  const handleTip = (outfit: OutfitFetchPayload) => {
    setSelectedOutfit(outfit);
    setShowTipModal(true);
  };

  /**
   * Handles collecting a outfit.
   * @param outfit - The outfit to collect.
   */
  const handleCollect = (outfit: OutfitFetchPayload) => {
    setSelectedOutfit(outfit);
    setShowCollectModal(true);
  };

  /**
   * Handles completion of a tip.
   */
  const handleTipComplete = () => {
    // Optimistically update tip count in SWR cache
    if (selectedOutfit) {
      mutateOutfits(
        (prev: OutfitFetchPayload[] = []) =>
          prev.map((outfit) =>
            outfit.id === selectedOutfit.id
              ? { ...outfit, tips: outfit.tips + 1 }
              : outfit,
          ),
        false, // Do not revalidate immediately
      );
    }
    setShowTipModal(false);
    setSelectedOutfit(null);
  };

  /**
   * Handles completion of a collect.
   */
  const handleCollectComplete = () => {
    // Optimistically update collection count in SWR cache
    if (selectedOutfit) {
      mutateOutfits(
        (prev: OutfitFetchPayload[] = []) =>
          prev.map((outfit) =>
            outfit.id === selectedOutfit.id
              ? { ...outfit, collections: outfit.collections + 1 }
              : outfit,
          ),
        false, // Do not revalidate immediately
      );
    }
    setShowCollectModal(false);
    setSelectedOutfit(null);
  };

  /**
   * Handles completion of onboarding.
   */
  const handleOnboardingComplete = () => {
    localStorage.setItem("outfitly_onboarding_complete", "true");
    setShowOnboarding(false);
    // On first-time completion, if context exists, ensure user exists in DB
    // no-op here: user sync handled globally by useUser()
  };

  // Scroll direction logic
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

          {/* Middle cleared in simplified model */}
          <div className="flex-1 min-w-0 " />
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Themes
          </button>
        </div>
      </header>

      <div className="pt-[73px]">
        {/* Feed */}
        <main className="px-4 py-6 space-y-6">
          {isLoading
            ? // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <OutfitCardSkeleton key={i} />
              ))
            : outfits.map((outfit) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  onTip={() => handleTip(outfit)}
                  onCollect={() => handleCollect(outfit)}
                />
              ))}

          {!isLoading && outfits.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👕</span>
              </div>
              <h3 className="font-semibold mb-2">No outfits yet!</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Be the first to inspire the community—share your style or check
                back soon for fresh looks!
              </p>
            </div>
          )}
        </main>

        {!isLoading && outfits.length > 0 && <DiscoverCreators />}
      </div>

      {/* Modals */}
      {selectedOutfit && (
        <>
          <TipModal
            open={showTipModal}
            onOpenChange={setShowTipModal}
            outfit={selectedOutfit}
            onComplete={handleTipComplete}
          />
          <CollectModal
            open={showCollectModal}
            onOpenChange={setShowCollectModal}
            outfit={selectedOutfit}
            onComplete={handleCollectComplete}
          />
        </>
      )}

      <BottomNav scrollDirection={scrollDirection} isScrolled={isScrolled} />
    </div>
  );
}

export default function HomePageClient() {
  return <HomePageInner />;
}

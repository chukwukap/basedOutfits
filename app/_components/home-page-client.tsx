"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import useSWR from "swr";
import { BottomNav } from "@/app/_components/bottom-nav";
import { LookCard } from "@/app/look/[id]/_components/look-card";
import { LookCardSkeleton } from "@/app/look/[id]/_components/look-card-skeleton";
import { TipModal } from "@/app/_components/tip-modal";
import { CollectModal } from "@/app/_components/collect-modal";
import { OnboardingTutorial } from "@/app/_components/onboarding-tutorial";
import { DiscoverCreators } from "@/app/discover/_components/discover-creators";
import { LookFetchPayload } from "@/lib/types";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useTheme } from "@/contexts/theme-context";

/**
 * Fetches looks from the API securely.
 * @returns Array of LookFetchPayload.
 */
const fetcher = async (url: string): Promise<LookFetchPayload[]> => {
  // Security: Always use no-store to avoid leaking sensitive data in cache
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load looks");
  return (await res.json()) as LookFetchPayload[];
};

function HomePageInner() {
  useUser();
  const [selectedLook, setSelectedLook] = useState<LookFetchPayload | null>(
    null,
  );
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

  // Use SWR for fetching looks with auto-refresh every 30 seconds
  const {
    data: looks = [],

    isLoading,
    mutate: mutateLooks,
  } = useSWR(onboardingChecked ? "/api/looks" : null, fetcher, {
    refreshInterval: 30000, // 30 seconds
    revalidateOnFocus: true, // Security: always revalidate on focus
    shouldRetryOnError: true,
  });

  /**
   * Handles tipping a look.
   * @param look - The look to tip.
   */
  const handleTip = (look: LookFetchPayload) => {
    setSelectedLook(look);
    setShowTipModal(true);
  };

  /**
   * Handles collecting a look.
   * @param look - The look to collect.
   */
  const handleCollect = (look: LookFetchPayload) => {
    setSelectedLook(look);
    setShowCollectModal(true);
  };

  /**
   * Handles completion of a tip.
   */
  const handleTipComplete = () => {
    // Optimistically update tip count in SWR cache
    if (selectedLook) {
      mutateLooks(
        (prev: LookFetchPayload[] = []) =>
          prev.map((look) =>
            look.id === selectedLook.id
              ? { ...look, tips: look.tips + 1 }
              : look,
          ),
        false, // Do not revalidate immediately
      );
    }
    setShowTipModal(false);
    setSelectedLook(null);
  };

  /**
   * Handles completion of a collect.
   */
  const handleCollectComplete = () => {
    // Optimistically update collection count in SWR cache
    if (selectedLook) {
      mutateLooks(
        (prev: LookFetchPayload[] = []) =>
          prev.map((look) =>
            look.id === selectedLook.id
              ? { ...look, collections: look.collections + 1 }
              : look,
          ),
        false, // Do not revalidate immediately
      );
    }
    setShowCollectModal(false);
    setSelectedLook(null);
  };

  /**
   * Handles completion of onboarding.
   */
  const handleOnboardingComplete = () => {
    localStorage.setItem("looks_onboarding_completed", "true");
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
                <LookCardSkeleton key={i} />
              ))
            : looks.map((look) => (
                <LookCard
                  key={look.id}
                  look={look}
                  onTip={() => handleTip(look)}
                  onCollect={() => handleCollect(look)}
                />
              ))}

          {!isLoading && looks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👗</span>
              </div>
              <h3 className="font-semibold mb-2">No looks found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                No looks available at the moment.
              </p>
            </div>
          )}
        </main>

        {!isLoading && looks.length > 0 && <DiscoverCreators />}
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

export default function HomePageClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomePageInner />
    </Suspense>
  );
}

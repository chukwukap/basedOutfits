"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAddFrame } from "@coinbase/onchainkit/minikit";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface OnboardingTutorialProps {
  onComplete: () => void;
  onCreateFirstOutfit?: () => void;
}

const tutorialSteps = [
  {
    id: 1,
    title: "Discover Outfits",
    description:
      "Scroll through an endless feed of outfits from creators around the world. Find inspiration for every occasion, season, and style.",
    color: "bg-blue-500",
    features: [
      "Browse curated fashion content",
      "Filter by tags and styles",
      "Discover new creators",
      "Get inspired daily",
    ],
    image: "/outfits/stylish-streetwear-look.png",
  },
  {
    id: 2,
    title: "Tip Creators",
    subtitle: "Support Fashion Creators",
    description:
      "Show appreciation for outfits you love by sending small tips directly to creators. Support the fashion community with just a few taps.",
    color: "bg-green-500",
    features: [
      "Send tips starting from $0.50",
      "Fast payments with Basepay",
      "Support your favorite creators",
      "Build community connections",
    ],
    image: "/outfits/business-casual-outfit.png",
  },
  {
    id: 3,
    title: "Collect Outfits",
    subtitle: "Build Your Style Collection",
    description:
      "Save your favorite outfits to your personal closet for a small fee. Build a curated collection of fashion inspiration you can reference anytime.",
    color: "bg-pink-500",
    features: [
      "Save outfits for $1 each",
      "Organize in your closet",
      "Access anytime, anywhere",
      "Create your style library",
    ],
    image: "/outfits/fashionable-summer-outfit.png",
  },
  {
    id: 4,
    title: "Share Your Outfits",
    subtitle: "Express Your Style",
    description:
      "Post your outfits directly to Outfitly. Inspire others, get tipped, and grow your digital fashion presence inside the BaseApp.",
    color: "bg-purple-500",
    features: [
      "Easily upload outfit photos",
      "Tag styles and occasions",
      "Reach fashion-focused audiences",
      "Earn tips from your outfits",
    ],
    image: "/outfits/kitenge-elegance.jpg",
  },
];

export function OnboardingTutorial({
  onComplete,
  onCreateFirstOutfit,
}: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const addFrame = useAddFrame();

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    if (isRightSwipe && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const lastStepId = tutorialSteps[tutorialSteps.length - 1]?.id;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Outfitly Logo" width={32} height={32} />
          <span className="font-semibold">Welcome to Outfitly</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {currentStep + 1} of {tutorialSteps.length}
        </Badge>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {tutorialSteps.map((step) => {
            return (
              <div key={step.id} className="w-full flex-shrink-0 flex flex-col">
                {/* Hero (full-bleed) */}
                <div className="relative h-72 md:h-[420px] bg-gradient-to-br from-muted to-muted/50">
                  <picture>
                    <img
                      src={step.image || "/outfits/placeholder.png"}
                      alt={step.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/outfits/stylish-streetwear-outfit.png";
                      }}
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full shadow-md animate-in fade-in zoom-in-90" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      {step.title}
                    </h2>
                    {/* <p className="text-base md:text-lg text-primary font-medium mb-3">
                      {step.subtitle}
                    </p> */}
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    {step.id === 2 && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Your wardrobe lives onchain, owned by you.
                      </p>
                    )}
                  </div>

                  {step.id === lastStepId ? (
                    <div className="mt-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button
                          onClick={onComplete}
                          className="h-12 text-base font-semibold"
                        >
                          Start Browsing Outfits
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            onCreateFirstOutfit
                              ? onCreateFirstOutfit()
                              : router.push("/post")
                          }
                          className="h-12 text-base font-semibold"
                        >
                          Share Your First Outfit
                        </Button>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            try {
                              addFrame();
                            } catch {
                              // no-op
                            }
                          }}
                          className="w-full h-12 text-base font-semibold"
                        >
                          Add to MiniApp
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto">
                      <div className="flex justify-center gap-2 mb-6">
                        {tutorialSteps.map((_, stepIndex) => (
                          <button
                            key={stepIndex}
                            onClick={() => goToStep(stepIndex)}
                            aria-label={`Go to step ${stepIndex + 1}`}
                            className={cn(
                              "h-1.5 rounded-full transition-all",
                              stepIndex === currentStep
                                ? "bg-primary w-6"
                                : "bg-muted-foreground/30 w-2",
                            )}
                          />
                        ))}
                      </div>
                      <div className="flex gap-3">
                        {currentStep > 0 && (
                          <Button
                            variant="outline"
                            onClick={goToPrevious}
                            className="flex-1 bg-transparent"
                          >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back
                          </Button>
                        )}
                        <Button onClick={goToNext} className="flex-1">
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skip Option */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={onComplete}
          className="w-full text-muted-foreground hover:text-foreground"
          size="sm"
        >
          Skip Tutorial
        </Button>
      </div>
    </div>
  );
}

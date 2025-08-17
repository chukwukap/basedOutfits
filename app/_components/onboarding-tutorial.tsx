"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { ChevronLeft, ChevronRight, Eye, Heart, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingTutorialProps {
  onComplete: () => void;
  onCreateFirstLook?: () => void;
}

const tutorialSteps = [
  {
    id: 1,
    title: "See the Vibe",
    subtitle: "Inside Farcaster, instantly",
    description:
      "Swipe through global outfits. Tap to like, tip, or collect. You’re home.",
    icon: Eye,
    color: "bg-blue-500",
    mockImage: "/looks/stylish-streetwear-look.png",
  },
  {
    id: 2,
    title: "Own Your Wardrobe",
    subtitle: "Onchain. Yours.",
    description:
      "Your wardrobe lives on Base—owned by you. No popups until you act.",
    icon: Heart,
    color: "bg-pink-500",
    mockImage: "/looks/elegant-evening-dress.png",
  },
  {
    id: 3,
    title: "You’re In",
    subtitle: "Starter pack loaded",
    description:
      "We preloaded your feed so it’s never empty. Start browsing or share your first look.",
    icon: Unlock,
    color: "bg-green-500",
    mockImage: "/looks/street-style-outfit.png",
  },
];

export function OnboardingTutorial({ onComplete, onCreateFirstLook }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const currentStepData = tutorialSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              currentStepData.color,
            )}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">Welcome to BasedOutfits</span>
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
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="w-full flex-shrink-0 flex flex-col">
                {/* Hero (full-bleed) */}
                <div className="relative h-72 md:h-[420px] bg-gradient-to-br from-muted to-muted/50">
                  <img
                    src={step.mockImage || "/looks/placeholder.png"}
                    alt={step.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/looks/stylish-streetwear-outfit.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md animate-in fade-in zoom-in-90"
                    style={{ backdropFilter: "blur(6px)" }}
                  >
                    <StepIcon className="w-5 h-5 text-white drop-shadow" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{step.title}</h2>
                    <p className="text-base md:text-lg text-primary font-medium mb-3">{step.subtitle}</p>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    {step.id === 2 && (
                      <p className="mt-3 text-xs text-muted-foreground">Your wardrobe lives onchain, owned by you.</p>
                    )}
                  </div>

                  {step.id === 3 ? (
                    <div className="mt-auto">
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full animate-ping bg-green-500/20" />
                          <Unlock className="w-6 h-6 text-green-600 animate-in zoom-in-95" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button onClick={onComplete} className="h-12 text-base font-semibold">Start Browsing Outfits</Button>
                        <Button
                          variant="outline"
                          onClick={() => (onCreateFirstLook ? onCreateFirstLook() : router.push("/post"))}
                          className="h-12 text-base font-semibold"
                        >
                          Share Your First Look
                        </Button>
                      </div>
                      <p className="mt-4 text-center text-xs text-muted-foreground">One tap to post. No setup screens. You can tweak settings later.</p>
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
                              stepIndex === currentStep ? "bg-primary w-6" : "bg-muted-foreground/30 w-2",
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

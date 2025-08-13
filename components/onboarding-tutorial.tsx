"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Eye, DollarSign, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingTutorialProps {
  onComplete: () => void
}

const tutorialSteps = [
  {
    id: 1,
    title: "Discover Looks",
    subtitle: "Global Fashion Inspiration",
    description:
      "Scroll through an endless feed of fashion looks from creators around the world. Find inspiration for every occasion, season, and style.",
    icon: Eye,
    color: "bg-blue-500",
    features: [
      "Browse curated fashion content",
      "Filter by tags and styles",
      "Discover new creators",
      "Get inspired daily",
    ],
    mockImage: "/fashionable-summer-outfit.png",
  },
  {
    id: 2,
    title: "Tip Creators",
    subtitle: "Support Fashion Creators",
    description:
      "Show appreciation for looks you love by sending small tips directly to creators. Support the fashion community with just a few taps.",
    icon: DollarSign,
    color: "bg-green-500",
    features: [
      "Send tips starting from $0.50",
      "Fast payments with Basepay",
      "Support your favorite creators",
      "Build community connections",
    ],
    mockImage: "/elegant-evening-dress.png",
  },
  {
    id: 3,
    title: "Collect Looks",
    subtitle: "Build Your Style Collection",
    description:
      "Save your favorite looks to your personal closet for a small fee. Build a curated collection of fashion inspiration you can reference anytime.",
    icon: Heart,
    color: "bg-pink-500",
    features: [
      "Save looks for $1 each",
      "Organize in your closet",
      "Access anytime, anywhere",
      "Create your style library",
    ],
    mockImage: "/street-style-outfit.png",
  },
]

export function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
    if (isRightSwipe && currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  const currentStepData = tutorialSteps[currentStep]
  const Icon = currentStepData.icon

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", currentStepData.color)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">Welcome to Looks</span>
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
          {tutorialSteps.map((step, index) => {
            const StepIcon = step.icon
            return (
              <div key={step.id} className="w-full flex-shrink-0 flex flex-col">
                {/* Hero Image */}
                <div className="relative h-64 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={step.mockImage || "/placeholder.svg"}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/stylish-streetwear-outfit.png"
                      }}
                    />
                    {/* Overlay icon */}
                    <div
                      className={cn(
                        "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center",
                        step.color,
                      )}
                    >
                      <StepIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
                    <p className="text-lg text-primary font-medium mb-3">{step.subtitle}</p>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {step.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                            step.color,
                          )}
                        >
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="mt-auto">
                    {/* Step Indicators */}
                    <div className="flex justify-center gap-2 mb-6">
                      {tutorialSteps.map((_, stepIndex) => (
                        <button
                          key={stepIndex}
                          onClick={() => goToStep(stepIndex)}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            stepIndex === currentStep ? "bg-primary w-6" : "bg-muted-foreground/30",
                          )}
                        />
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {currentStep > 0 && (
                        <Button variant="outline" onClick={goToPrevious} className="flex-1 bg-transparent">
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Button>
                      )}

                      {currentStep < tutorialSteps.length - 1 ? (
                        <Button onClick={goToNext} className="flex-1">
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button onClick={onComplete} className="flex-1" size="lg">
                          Start Browsing
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
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
  )
}

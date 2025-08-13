"use client";

import { Button } from "@/app/_components/ui/button";
import { RotateCcw } from "lucide-react";

export function OnboardingReset() {
  const resetOnboarding = () => {
    localStorage.removeItem("looks_onboarding_completed");
    window.location.reload();
  };

  // Only show in development or for testing
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={resetOnboarding}
      className="fixed bottom-24 right-4 z-50 bg-background border-2"
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Reset Onboarding
    </Button>
  );
}

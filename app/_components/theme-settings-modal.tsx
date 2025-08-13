"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { ThemeSelector } from "@/app/_components/theme-selector";

export function ThemeSettingsModal() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Settings className="w-4 h-4" />
        Themes
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </Button>
        </div>

        <ThemeSelector />

        <div className="mt-6 pt-4 border-t">
          <Button onClick={() => setIsOpen(false)} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

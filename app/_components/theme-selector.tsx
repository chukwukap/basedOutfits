"use client";

import { useRef } from "react";
import { useTheme } from "@/contexts/theme-context";
import { Check } from "lucide-react";
import { useClickAway } from "@/hooks/useClickAway";

export function ThemeSelector() {
  const { currentTheme, setTheme, themes, modalOpen, setModalOpen } =
    useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  useClickAway(modalRef, () => setModalOpen(false));

  return (
    modalOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        aria-modal="true"
        role="dialog"
      >
        <div
          ref={modalRef}
          className="space-y-4 bg-card rounded-lg p-6 w-full max-w-md shadow-lg border"
        >
          <h3 className="text-lg font-semibold text-center">Choose Theme</h3>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                  setModalOpen(false);
                }}
                className="relative p-3 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary"
                style={{
                  borderColor:
                    currentTheme.id === theme.id
                      ? `hsl(${theme.colors.primary})`
                      : `hsl(${theme.colors.border})`,
                  backgroundColor: `hsl(${theme.colors.card})`,
                }}
                aria-label={`Select ${theme.name} theme`}
              >
                {/* Theme Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: `hsl(${theme.colors.primary})`,
                      }}
                    />
                    {currentTheme.id === theme.id && (
                      <Check
                        className="w-4 h-4"
                        style={{ color: `hsl(${theme.colors.primary})` }}
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div
                      className="h-2 rounded"
                      style={{ backgroundColor: `hsl(${theme.colors.muted})` }}
                    />
                    <div
                      className="h-2 w-3/4 rounded"
                      style={{ backgroundColor: `hsl(${theme.colors.muted})` }}
                    />
                  </div>

                  <div className="flex gap-1">
                    <div
                      className="w-6 h-2 rounded"
                      style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                    />
                    <div
                      className="w-4 h-2 rounded"
                      style={{
                        backgroundColor: `hsl(${theme.colors.secondary})`,
                      }}
                    />
                  </div>
                </div>

                <p
                  className="text-sm font-medium mt-2"
                  style={{ color: `hsl(${theme.colors.foreground})` }}
                >
                  {theme.name}
                </p>
              </button>
            ))}
          </div>
          {/* Close button for accessibility and UX */}
          <button
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl font-bold focus:outline-none"
            aria-label="Close theme selector"
            tabIndex={0}
            type="button"
          >
            ✕
          </button>
        </div>
      </div>
    )
  );
}

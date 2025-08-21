"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { type Theme, themes, defaultTheme } from "@/lib/themes";

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [modalOpen, setModalOpen] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem("theme-preference");
    if (savedThemeId) {
      const savedTheme = themes.find((theme) => theme.id === savedThemeId);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
    }
  }, []);

  // Apply theme CSS variables whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    // Sync a simple data attribute for CSS selectors and analytics.
    // Also toggle Tailwind's `.dark` class so dark-specific tokens in globals.css apply.
    root.setAttribute("data-theme", currentTheme.id);
    if (currentTheme.id === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply CSS variables using kebab-case so Tailwind tokens like
    // `text-muted-foreground` resolve to `--muted-foreground` correctly.
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      const kebabKey = key
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase();
      root.style.setProperty(`--${kebabKey}`, value);
    });
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem("theme-preference", themeId);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ currentTheme, setTheme, themes, modalOpen, setModalOpen }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

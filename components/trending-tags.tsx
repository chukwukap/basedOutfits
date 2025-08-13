"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const trendingTags = [
  "Streetwear",
  "SummerFits",
  "Minimalist",
  "OfficeChic",
  "DateNight",
  "Weekend",
  "Bold",
  "Urban",
  "Professional",
  "Comfort",
  "Accessories",
  "WFH",
]

interface TrendingTagsProps {
  selectedTag: string | null
  onTagSelect: (tag: string) => void
}

export function TrendingTags({ selectedTag, onTagSelect }: TrendingTagsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-scroll effect like TikTok trending topics
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, trendingTags.length - 2))
    }, 3000) // Scroll every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex gap-2 transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 80}px)`,
          width: `${trendingTags.length * 80}px`,
        }}
      >
        {trendingTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTag === tag ? "default" : "secondary"}
            size="sm"
            onClick={() => onTagSelect(tag)}
            className={`
              whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full
              transition-all duration-200 hover:scale-105 active:scale-95
              ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary/80 hover:bg-secondary text-secondary-foreground"
              }
            `}
          >
            #{tag}
          </Button>
        ))}
      </div>

      {/* Gradient fade edges for smooth scrolling effect */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  )
}

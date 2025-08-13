"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setImageLoading(true)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setImageLoading(true)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setImageLoading(true)
  }

  const handleImageClick = () => {
    setIsZoomed(true)
  }

  const closeZoom = () => {
    setIsZoomed(false)
  }

  if (images.length === 0) {
    return (
      <div className="h-full bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }

  return (
    <>
      <div className="relative h-full">
        {/* Main Image */}
        <div className="relative h-full bg-muted cursor-pointer" onClick={handleImageClick}>
          {imageLoading && <div className="absolute inset-0 bg-muted animate-pulse z-10" />}
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            onLoad={() => setImageLoading(false)}
            priority={currentIndex === 0}
          />

          {/* Zoom Indicator */}
          <div className="absolute top-3 left-3 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
            <ZoomIn className="w-4 h-4" />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <Badge className="absolute top-3 right-3 bg-black/50 text-white border-0 backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </Badge>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <div className="flex gap-2 justify-center overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    goToSlide(index)
                  }}
                  className={cn(
                    "relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                    currentIndex === index
                      ? "border-white ring-2 ring-white/20"
                      : "border-transparent opacity-60 hover:opacity-80",
                  )}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={closeZoom}
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="relative max-w-full max-h-full">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${title} - Zoomed`}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}

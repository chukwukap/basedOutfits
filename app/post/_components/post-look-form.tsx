"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Label } from "@/app/_components/ui/label";
import { Card } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Upload, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { LookFetchPayload } from "@/lib/types";
import Image from "next/image";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

interface PostLookFormProps {
  onSuccess: (lookData: LookFetchPayload) => void;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploading?: boolean;
}

export function PostLookForm({ onSuccess }: PostLookFormProps) {
  const { context } = useMiniKit();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posting, setPosting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect coarse pointer devices to optimize the UI for mobile-first capture
  useEffect(() => {
    try {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    } catch {
      setIsMobile(true);
    }
  }, []);

  // simplified: no tags/brands/location

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = (await res.json()) as { url: string };
    return data.url;
  };

  const handleFiles = useCallback(
    (files: File[]) => {
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      // Enforce up to 5 images total
      const availableSlots = Math.max(0, 5 - images.length);
      const filesToAdd = imageFiles.slice(0, availableSlots);

      filesToAdd.forEach((file) => {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);

        setImages((prev) => [
          ...prev,
          {
            id,
            file,
            preview,
            uploading: true,
          },
        ]);

        // Upload to backend
        (async () => {
          try {
            const url = await uploadFile(file);
            setImages((prev) =>
              prev.map((img) =>
                img.id === id
                  ? { ...img, uploading: false, preview: url }
                  : img,
              ),
            );
          } catch {
            setImages((prev) => prev.filter((img) => img.id !== id));
          }
        })();
      });
    },
    [images],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    },
    [handleFiles],
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const openCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const openLibraryPicker = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  // simplified: no tags/brands handlers

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0 || !title.trim()) {
      return;
    }

    setPosting(true);

    try {
      setPosting(true);
      const c =
        (context as unknown as {
          user?: { username?: string; fid?: number | string };
        } | null) || null;
      const currentUserId =
        (c?.user?.username || c?.user?.fid?.toString()) ?? "";
      const res = await fetch("/api/looks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: currentUserId,
          caption: title.trim(),
          description: description.trim(),
          imageUrls: images.map((img) => img.preview),
          isPublic: true,
        }),
      });
      if (res.ok) {
        const created = (await res.json()) as {
          id: string;
          caption?: string;
          description?: string;
          imageUrls: string[];
          createdAt: string;
          updatedAt: string;
          isPublic: boolean;
          authorId: string;
        };
        const lookData: LookFetchPayload = {
          id: created.id,
          caption: created.caption ?? "",
          description: created.description ?? "",
          imageUrls: created.imageUrls,
          isPublic: created.isPublic,
          author: {
            name: "You",
            avatarUrl: "/diverse-group-profile.png",
            fid: "demo",
            isFollowing: false,
          },
          tips: 0,
          collections: 0,
          createdAt: new Date(created.createdAt),
          updatedAt: new Date(created.updatedAt),
          authorId: created.authorId,
        };
        onSuccess(lookData);
      }
    } finally {
      setPosting(false);
    }

    // simplified reset
    setImages([]);
    setTitle("");
    setDescription("");
  };

  const isFormValid =
    images.length > 0 &&
    title.trim().length > 0 &&
    !images.some((img) => img.uploading);

  return (
    <Card className="p-6 pb-28 md:pb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Photos
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Add up to 5 photos of your look
          </p>

          <div className="mt-3">
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative aspect-square group">
                    <Image
                      src={image.preview || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-9 h-9 p-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity rounded-full"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2 text-xs bg-primary">
                        Main
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}

            {images.length < 5 && (
              <>
                {/* Mobile-first: explicit camera/library buttons */}
                {isMobile ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      onClick={openCameraCapture}
                      className="h-12"
                      variant="default"
                    >
                      <Camera className="w-4 h-4 mr-2" /> Take Photo
                    </Button>
                    <Button
                      type="button"
                      onClick={openLibraryPicker}
                      className="h-12"
                      variant="outline"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Library
                    </Button>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/25",
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                      <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                      <p className="text-sm font-medium text-center">
                        {dragActive ? "Drop photos here" : "Upload photos or drag & drop"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB each
                      </p>
                    </div>
                  </div>
                )}

                {/* Hidden inputs for both capture modes */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={images.length >= 5}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={images.length >= 5}
                />
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-base font-semibold">
            Look Title *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your look a catchy title..."
            className="mt-2 h-12"
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {title.length}/100 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-base font-semibold">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your look, occasion, styling tips, or inspiration..."
            className="mt-2 min-h-[120px]"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {description.length}/500 characters
          </p>
        </div>

        {/* Tags/Brands/Location removed to match simplified schema */}

        {/* Submit (desktop) */}
        <div className="pt-4 hidden md:block">
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={!isFormValid || posting}
          >
            {posting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Posting Look...
              </div>
            ) : (
              "Post Look"
            )}
          </Button>
        </div>
      </form>

      {/* Sticky action bar (mobile) */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur border-t p-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {!isFormValid
                ? images.length === 0
                  ? "Add at least one photo"
                  : !title.trim()
                    ? "Add a title"
                    : "Uploading images..."
                : "Ready to post"}
            </p>
          </div>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              void handleSubmit(e as unknown as React.FormEvent);
            }}
            className="h-12 px-6"
            disabled={!isFormValid || posting}
          >
            {posting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

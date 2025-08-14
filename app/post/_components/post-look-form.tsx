"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Label } from "@/app/_components/ui/label";
import { Card } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Upload, X, Camera, MapPin, Tag, Sparkles } from "lucide-react";
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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [brandInput, setBrandInput] = useState("");
  const [location, setLocation] = useState("");
  const [posting, setPosting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Popular tags for suggestions
  const popularTags = [
    "summer",
    "winter",
    "casual",
    "formal",
    "streetwear",
    "vintage",
    "minimalist",
    "colorful",
    "evening",
    "work",
    "weekend",
    "date",
    "party",
    "travel",
    "cozy",
    "chic",
  ];

  // Popular brands for suggestions
  const popularBrands = [
    "Zara",
    "H&M",
    "Nike",
    "Adidas",
    "Uniqlo",
    "Mango",
    "COS",
    "Everlane",
    "Levi's",
    "Converse",
    "Vans",
    "Supreme",
    "Off-White",
    "Patagonia",
    "Lululemon",
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
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

  const handleFiles = (files: File[]) => {
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
              img.id === id ? { ...img, uploading: false, preview: url } : img,
            ),
          );
        } catch {
          setImages((prev) => prev.filter((img) => img.id !== id));
        }
      })();
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
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

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 8) {
      setTags((prev) => [...prev, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const addBrand = (brand: string) => {
    const trimmedBrand = brand.trim();
    if (trimmedBrand && !brands.includes(trimmedBrand) && brands.length < 5) {
      setBrands((prev) => [...prev, trimmedBrand]);
      setBrandInput("");
    }
  };

  const removeBrand = (brandToRemove: string) => {
    setBrands((prev) => prev.filter((brand) => brand !== brandToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleBrandKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addBrand(brandInput);
    }
  };

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
          tags,
          brands,
          location: location.trim(),
          isPublic: true,
        }),
      });
      if (res.ok) {
        const created = (await res.json()) as {
          id: string;
          caption?: string;
          description?: string;
          imageUrls: string[];
          tags: string[];
          brands: string[];
          location?: string;
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
          tags: created.tags,
          brands: created.brands,
          location: created.location ?? "",
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
          isPublic: created.isPublic,
          authorId: created.authorId,
        };
        onSuccess(lookData);
      }
    } finally {
      setPosting(false);
    }

    // Reset form
    setImages([]);
    setTitle("");
    setDescription("");
    setTags([]);
    setBrands([]);
    setLocation("");
  };

  const isFormValid =
    images.length > 0 &&
    title.trim().length > 0 &&
    !images.some((img) => img.uploading);

  return (
    <Card className="p-6">
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
                      className="absolute top-2 right-2 w-7 h-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                <div className="flex flex-col items-center justify-center py-8 px-4">
                  <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-center">
                    {dragActive
                      ? "Drop photos here"
                      : "Upload photos or drag & drop"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB each
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={images.length >= 5}
                />
              </div>
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
            className="mt-2"
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
            className="mt-2"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {description.length}/500 characters
          </p>
        </div>

        {/* Tags */}
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tags
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Add up to 8 tags to help others discover your look
          </p>

          {/* Current tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-sm px-3 py-1"
                >
                  #{tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Tag input */}
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyPress}
            placeholder="Type a tag and press Enter..."
            className="mt-3"
            disabled={tags.length >= 8}
          />

          {/* Popular tags */}
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-2">Popular tags:</p>
            <div className="flex flex-wrap gap-2">
              {popularTags
                .filter((tag) => !tags.includes(tag))
                .slice(0, 8)
                .map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 bg-transparent"
                    onClick={() => addTag(tag)}
                    disabled={tags.length >= 8}
                  >
                    #{tag}
                  </Button>
                ))}
            </div>
          </div>
        </div>

        {/* Brands */}
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Brands (Optional)
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Tag up to 5 brands featured in your look
          </p>

          {/* Current brands */}
          {brands.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {brands.map((brand) => (
                <Badge
                  key={brand}
                  variant="outline"
                  className="text-sm px-3 py-1"
                >
                  {brand}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0 hover:bg-transparent"
                    onClick={() => removeBrand(brand)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Brand input */}
          <Input
            value={brandInput}
            onChange={(e) => setBrandInput(e.target.value)}
            onKeyDown={handleBrandKeyPress}
            placeholder="Type a brand and press Enter..."
            className="mt-3"
            disabled={brands.length >= 5}
          />

          {/* Popular brands */}
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-2">
              Popular brands:
            </p>
            <div className="flex flex-wrap gap-2">
              {popularBrands
                .filter((brand) => !brands.includes(brand))
                .slice(0, 8)
                .map((brand) => (
                  <Button
                    key={brand}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 bg-transparent"
                    onClick={() => addBrand(brand)}
                    disabled={brands.length >= 5}
                  >
                    {brand}
                  </Button>
                ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <Label
            htmlFor="location"
            className="text-base font-semibold flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Location (Optional)
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where was this look worn? (e.g., New York, Paris, Tokyo)"
            className="mt-2"
            maxLength={50}
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
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
          {!isFormValid && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {images.length === 0
                ? "Add at least one photo"
                : !title.trim()
                  ? "Add a title"
                  : "Uploading images..."}
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}

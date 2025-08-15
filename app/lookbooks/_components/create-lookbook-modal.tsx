"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Label } from "@/app/_components/ui/label";
import { Switch } from "@/app/_components/ui/switch";
import { Upload, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
// Passing a minimal lookbook payload upward; parent composes full object
type NewLookbookPayload = {
  name: string;
  description: string;
  isPublic: boolean;
  coverImage: string;
  owner: {
    walletAddress: string;
  };
};

interface CreateLookbookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (lookbook: NewLookbookPayload) => void;
}

export function CreateLookbookModal({
  open,
  onOpenChange,
  onSave,
}: CreateLookbookModalProps) {
  const { mini, db } = useUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleChooseImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = (await res.json()) as { url: string };
      setCoverImage(data.url);
    } catch {
      // keep silent; could show toast
    } finally {
      setUploading(false);
      // reset input value so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const handleSave = async () => {
    if (!name.trim()) return;

    // Owner is required by schema; prefer DB id or username/fid, fallback to local storage
    const ownerId =
      db?.id || mini.username || mini.fid || localStorage.getItem("current_user_id") || "demo";

    try {
      // Persist server-side
      const res = await fetch("/api/lookbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId,
          name: name.trim(),
          description: description.trim(),
          isPublic,
          coverImage: coverImage || "/placeholder.svg",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create lookbook");
      }

      const created = await res.json();
      onSave({
        name: created.name,
        description: created.description ?? "",
        isPublic: created.isPublic,
        coverImage: created.coverImage ?? "/placeholder.svg",
        owner: {
          walletAddress: db?.walletAddress || mini.walletAddress || "",
        },
      });

      // Reset form and close
      setName("");
      setDescription("");
      setIsPublic(false);
      setCoverImage("");
      onOpenChange(false);
    } catch {
      // No-op UI error surface (could add toast)
    }
  };

  const handleClose = () => {
    // Reset form
    setName("");
    setDescription("");
    setIsPublic(false);
    setCoverImage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Lookbook</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image (Optional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Upload a cover image or leave blank to use the first look
                  added
                </p>
                {coverImage && (
                  <Image
                    src={coverImage}
                    alt="Cover preview"
                    className="mt-2 h-24 w-24 object-cover rounded"
                    width={96}
                    height={96}
                  />
                )}
                {uploading && (
                  <div className="text-xs text-muted-foreground">
                    Uploading…
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChooseImage}
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Lookbook Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Vibes, Work Wardrobe"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              {name.length}/50 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the theme or style of this lookbook..."
              maxLength={200}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/200 characters
            </p>
          </div>

          {/* Privacy */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="public">Make Public</Label>
              <p className="text-xs text-muted-foreground">
                Others can discover and follow this lookbook
              </p>
            </div>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1"
            >
              Create Lookbook
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

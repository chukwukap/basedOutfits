"use client";

import { useState, useEffect } from "react";

export type EditableWardrobe = {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  coverImage?: string | null;
};
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

interface EditWardrobeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wardrobe: EditableWardrobe | null;
  onSave: (wardrobe: EditableWardrobe) => void;
}

export function EditWardrobeModal({
  open,
  onOpenChange,
  wardrobe,
  onSave,
}: EditWardrobeModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [coverImage, setCoverImage] = useState("");

  // Populate form when lookbook changes
  useEffect(() => {
    if (wardrobe) {
      setName(wardrobe.name);
      setDescription(wardrobe.description ?? "");
      setIsPublic(wardrobe.isPublic);
      setCoverImage(wardrobe.coverImage ?? "");
    }
  }, [wardrobe]);

  const handleSave = () => {
    if (!name.trim() || !wardrobe) return;

    onSave({
      ...wardrobe,
      name: name.trim(),
      description: description.trim(),
      isPublic,
      coverImage: coverImage || "/placeholder.svg",
    });

    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!wardrobe) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Wardrobe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Upload a new cover image or keep current
                </p>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Change Image
                </Button>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Wardrobe Name *</Label>
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
            <Label htmlFor="description">Description</Label>
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
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

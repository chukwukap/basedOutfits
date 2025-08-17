"use client";

import type React from "react";

import {
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

interface Wardrobe {
  id: string;
  name: string;
  isPublic: boolean;
  outfitCount: number;
}

interface WardrobeOptionsMenuProps {
  wardrobe: Wardrobe;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePrivacy: () => void;
  onShare: () => void;
  onDuplicate: () => void;
}

export function WardrobeOptionsMenu({
  wardrobe,
  onEdit,
  onDelete,
  onTogglePrivacy,
  onShare,
  onDuplicate,
}: WardrobeOptionsMenuProps) {
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking menu
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-black/10"
          onClick={handleMenuClick}
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Wardrobe
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onTogglePrivacy}>
          {wardrobe.isPublic ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Make Private
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Make Public
            </>
          )}
        </DropdownMenuItem>

        {wardrobe.isPublic && (
          <DropdownMenuItem onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Wardrobe
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Wardrobe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";

interface Wardrobe {
  id: string;
  name: string;
  outfitCount: number;
}

interface DeleteWardrobeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wardrobe: Wardrobe | null;
  onConfirm: (wardrobeId: string) => void;
}

export function DeleteWardrobeDialog({
  open,
  onOpenChange,
  wardrobe,
  onConfirm,
}: DeleteWardrobeDialogProps) {
  const handleConfirm = () => {
    if (wardrobe) {
      onConfirm(wardrobe.id);
      onOpenChange(false);
    }
  };

  if (!wardrobe) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Wardrobe</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{wardrobe.name}&quot;? This
            wardrobe contains {wardrobe.outfitCount}{" "}
            {wardrobe.outfitCount === 1 ? "outfit" : "outfits"}.
            <br />
            <br />
            <strong>This action cannot be undone.</strong> The outfits will not
            be deleted from your account, but this organization will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Wardrobe
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

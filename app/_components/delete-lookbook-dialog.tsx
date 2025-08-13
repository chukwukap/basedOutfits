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

interface Lookbook {
  id: string;
  name: string;
  lookCount: number;
}

interface DeleteLookbookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lookbook: Lookbook | null;
  onConfirm: (lookbookId: string) => void;
}

export function DeleteLookbookDialog({
  open,
  onOpenChange,
  lookbook,
  onConfirm,
}: DeleteLookbookDialogProps) {
  const handleConfirm = () => {
    if (lookbook) {
      onConfirm(lookbook.id);
      onOpenChange(false);
    }
  };

  if (!lookbook) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Lookbook</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{lookbook.name}"? This lookbook
            contains {lookbook.lookCount}{" "}
            {lookbook.lookCount === 1 ? "look" : "looks"}.
            <br />
            <br />
            <strong>This action cannot be undone.</strong> The looks will not be
            deleted from your account, but this organization will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Lookbook
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

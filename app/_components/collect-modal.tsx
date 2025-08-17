"use client";

import { useState } from "react";
import { AddToWardrobeSheet } from "@/app/_components/add-to-wardrobe-sheet";
import { SuccessToast } from "@/app/_components/success-toast";
import { OutfitFetchPayload } from "@/lib/types";

interface CollectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outfit: OutfitFetchPayload;
  onComplete: () => void;
}

export function CollectModal({
  open,
  onOpenChange,
  outfit,
  onComplete,
}: CollectModalProps) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleComplete = (wardrobeName: string) => {
    setSuccessMessage(`Added to "${wardrobeName}"!`);
    setShowSuccessToast(true);
    onComplete();
  };

  return (
    <>
      <AddToWardrobeSheet
        open={open}
        onOpenChange={onOpenChange}
        outfit={outfit}
        onComplete={handleComplete}
      />

      <SuccessToast
        show={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { AddToLookbookSheet } from "@/app/_components/add-to-lookbook-sheet";
import { SuccessToast } from "@/app/_components/success-toast";
import { LookFetchPayload } from "@/lib/types";

interface CollectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  look: LookFetchPayload;
  onComplete: () => void;
}

export function CollectModal({
  open,
  onOpenChange,
  look,
  onComplete,
}: CollectModalProps) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleComplete = (lookbookName: string) => {
    setSuccessMessage(`Added to "${lookbookName}"!`);
    setShowSuccessToast(true);
    onComplete();
  };

  return (
    <>
      <AddToLookbookSheet
        open={open}
        onOpenChange={onOpenChange}
        look={look}
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

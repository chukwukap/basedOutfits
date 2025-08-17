"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/app/_components/bottom-nav";
import { PostOutfitForm } from "@/app/post/_components/post-outfit-form";
import { PostSuccessModal } from "@/app/post/_components/post-success-modal";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useRouter } from "next/navigation";
import { OutfitFetchPayload } from "@/lib/types";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export default function PostPageClient() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [postedOutfit, setPostedOutfit] = useState<OutfitFetchPayload | null>(
    null,
  );
  const router = useRouter();

  const { isFrameReady, setFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  const handlePostSuccess = (outfitData: OutfitFetchPayload) => {
    setPostedOutfit(outfitData);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push("/"); // Navigate back to home feed
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Post Outfit</h1>
        </div>
      </header>

      {/* Form */}
      <main className="p-4">
        <PostOutfitForm onSuccess={handlePostSuccess} />
      </main>

      {/* Success Modal */}
      <PostSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        outfit={postedOutfit}
        onClose={handleSuccessClose}
      />

      <BottomNav />
    </div>
  );
}

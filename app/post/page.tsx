"use client";

import { useState } from "react";
import { BottomNav } from "@/app/_components/bottom-nav";
import { PostLookForm } from "./_components/post-look-form";
import { PostSuccessModal } from "./_components/post-success-modal";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useRouter } from "next/navigation";
import { LookFetchPayload } from "@/lib/types";

export default function PostPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [postedLook, setPostedLook] = useState<LookFetchPayload | null>(null);
  const router = useRouter();

  const handlePostSuccess = (lookData: LookFetchPayload) => {
    setPostedLook(lookData);
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
          <h1 className="text-xl font-semibold">Post Look</h1>
        </div>
      </header>

      {/* Form */}
      <main className="p-4">
        <PostLookForm onSuccess={handlePostSuccess} />
      </main>

      {/* Success Modal */}
      <PostSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        look={postedLook}
        onClose={handleSuccessClose}
      />

      <BottomNav />
    </div>
  );
}

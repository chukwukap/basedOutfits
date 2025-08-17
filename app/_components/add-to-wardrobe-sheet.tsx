"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import { Button } from "@/app/_components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Badge } from "@/app/_components/ui/badge";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { Plus, Lock, Globe, ArrowLeft, Share2 } from "lucide-react";
import { CreateWardrobeModal } from "@/app/wardrobes/_components/create-wardrobe-modal";
import Image from "next/image";
import { OutfitFetchPayload } from "@/lib/types";
import { BasePayButton } from "@base-org/account-ui/react";
import { pay } from "@base-org/account";
import { useUser } from "@/hooks/useUser";
import { useComposeCast } from "@coinbase/onchainkit/minikit";

interface Wardrobe {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  wardrobeCount: number;
  isPublic: boolean;
  owner: {
    walletAddress: string;
  };
}

interface AddToWardrobeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outfit: OutfitFetchPayload;
  onComplete: (wardrobeName: string) => void;
}

type PaymentState =
  | "selecting"
  | "payment"
  | "processing"
  | "success"
  | "error";

async function fetchUserWardrobes(ownerId: string): Promise<Wardrobe[]> {
  const res = await fetch(
    `/api/wardrobes?ownerId=${encodeURIComponent(ownerId)}&public=0`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) return [];
  return await res.json();
}

export function AddToWardrobeSheet({
  open,
  onOpenChange,
  outfit,
  onComplete,
}: AddToWardrobeSheetProps) {
  const { mini } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [wardrobes, setWardrobes] = useState<Wardrobe[]>([]);
  const [paymentState, setPaymentState] = useState<PaymentState>("selecting");
  const [selectedWardrobe, setSelectedWardrobe] = useState<Wardrobe | null>(
    null,
  );
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { composeCast } = useComposeCast();

  useEffect(() => {
    const currentUserId = mini.username || mini.fid || "";
    if (!currentUserId) return;
    fetchUserWardrobes(currentUserId)
      .then(setWardrobes)
      .catch(() => setWardrobes([]));
  }, [mini.username, mini.fid]);

  const handleWardrobeSelect = (wardrobe: Wardrobe) => {
    setSelectedWardrobe(wardrobe);
    setPaymentState("payment");
    setPaymentError(null);
  };

  const handleBasePay = async () => {
    if (!selectedWardrobe) {
      setPaymentError("No wardrobe selected.");
      return;
    }
    setPaymentState("processing");
    setPaymentError(null);

    try {
      // You may want to make this dynamic in the future
      const amount = "1";
      // The recipient should be the app's treasury or a configured address
      // For demo, we'll use a placeholder address (replace with your real one)
      const recipient =
        selectedWardrobe.owner.walletAddress ||
        "0x50cCe62142Aa864EE13c9a2b0eEeDb38221CB5E7";
      const { success } = await pay({
        amount,
        to: recipient,
        testnet:
          process.env.NEXT_PUBLIC_BASEPAY_TESTNET === "true" ? true : false,
      });
      if (success) {
        // After payment, add the outfit to the wardrobe
        const currentUserId = mini.username || mini.fid || "";
        const res = await fetch(`/api/wardrobes/${selectedWardrobe.id}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wardrobeId: selectedWardrobe.id,
            outfitId: outfit.id,
            addedById: currentUserId,
          }),
        });
        if (!res.ok) throw new Error("Failed to add to wardrobe");

        setPaymentState("success");
        setWardrobes(
          wardrobes.map((wb) =>
            wb.id === selectedWardrobe.id
              ? { ...wb, wardrobeCount: wb.wardrobeCount + 1 }
              : wb,
          ),
        );
        setTimeout(() => {
          if (selectedWardrobe) {
            onComplete(selectedWardrobe.name);
          }
          handleClose();
        }, 1200);
      } else {
        setPaymentState("error");
        setPaymentError("Payment failed: No transaction ID returned.");
      }
    } catch (error: unknown) {
      setPaymentState("error");
      if (error instanceof Error) {
        setPaymentError(error.message);
      } else {
        setPaymentError("An unknown error occurred");
      }
    }
  };

  const handleClose = () => {
    setPaymentState("selecting");
    setSelectedWardrobe(null);
    setPaymentError(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    if (paymentState === "payment") {
      setPaymentState("selecting");
      setSelectedWardrobe(null);
      setPaymentError(null);
    } else if (paymentState === "error") {
      setPaymentState("payment");
      setPaymentError(null);
    }
  };

  const handleCreateWardrobe = (
    newWardrobe: Omit<Wardrobe, "id" | "wardrobeCount">,
  ) => {
    const wardrobe = {
      ...newWardrobe,
      id: Date.now().toString(),
      wardrobeCount: 0, // Will be incremented after payment
    };
    setWardrobes([wardrobe, ...wardrobes]);
    setShowCreateModal(false);
    setSelectedWardrobe(wardrobe);
    setPaymentState("payment");
    setPaymentError(null);
  };

  const getTitle = () => {
    switch (paymentState) {
      case "selecting":
        return "Add to Wardrobe";
      case "payment":
        return `Add to ${selectedWardrobe?.name}`;
      case "processing":
        return "Processing Payment";
      case "success":
        return "Payment Successful";
      case "error":
        return "Payment Failed";
      default:
        return "Add to Wardrobe";
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              {(paymentState === "payment" || paymentState === "error") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="p-1 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <Plus className="w-5 h-5" />
              {getTitle()}
            </SheetTitle>
          </SheetHeader>

          {/* Wardrobe Selection */}
          {paymentState === "selecting" && (
            <div className="space-y-4">
              {/* Outfit Preview */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={outfit.author.avatarUrl || "/placeholder.svg"}
                  />
                  <AvatarFallback>{outfit.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{outfit.author.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {outfit.caption}
                  </p>
                </div>
              </div>

              {/* Create New Wardrobe */}
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 bg-primary/5 border-primary/20 hover:bg-primary/10"
                onClick={() => setShowCreateModal(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Create New Wardrobe</p>
                    <p className="text-xs text-muted-foreground">
                      Start a new collection
                    </p>
                  </div>
                </div>
              </Button>

              {/* Existing Wardrobes */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Your Wardrobes
                </p>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {wardrobes.map((wardrobe) => (
                      <Button
                        key={wardrobe.id}
                        variant="outline"
                        className="w-full justify-start h-auto p-3 bg-transparent hover:bg-muted/50"
                        onClick={() => handleWardrobeSelect(wardrobe)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={wardrobe.coverImage || "/placeholder.svg"}
                              alt={wardrobe.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">
                                {wardrobe.name}
                              </p>
                              {wardrobe.isPublic ? (
                                <Globe className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground truncate">
                                {wardrobe.description}
                              </p>
                              <Badge
                                variant="secondary"
                                className="text-xs flex-shrink-0"
                              >
                                {wardrobe.wardrobeCount}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Payment Flow */}
          {(paymentState === "payment" ||
            paymentState === "processing" ||
            paymentState === "success" ||
            paymentState === "error") && (
            <div className="space-y-4">
              {/* Selected Wardrobe Preview */}
              {selectedWardrobe && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={selectedWardrobe.coverImage || "/placeholder.svg"}
                      alt={selectedWardrobe.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {selectedWardrobe.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedWardrobe.wardrobeCount} outfits
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Form: Only BasePay is supported */}
              {paymentState === "payment" && (
                <div className="py-4 space-y-4">
                  {/* Payment Summary */}
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-semibold">1 USDC</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      <span>Secured by BasePay</span>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="text-destructive text-xs flex items-center gap-2">
                      {paymentError}
                    </div>
                  )}

                  {/* Sticky action bar for payment */}
                  <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur border-t p-4 -mx-4 sm:mx-0">
                    <div className="w-full">
                      <BasePayButton colorScheme="light" onClick={handleBasePay} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground text-center">
                      You will pay 1 USDC to add this outfit to your wardrobe.
                    </p>
                  </div>
                </div>
              )}

              {/* Processing State */}
              {paymentState === "processing" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="text-center">
                    <p className="font-medium">Processing Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Processing with BasePay...
                    </p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {paymentState === "success" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <p className="font-medium text-green-600">
                      Payment Successful
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Outfit added to your wardrobe!
                    </p>
                  </div>
                  {/* Encourage sharing after success */}
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Best-effort share
                      try {
                        // Lazy import to avoid SSR issues
                        composeCast({
                          text: `I just added a new outfit to my Wardrobe on Wardrobes! #Wardrobes`,
                          embeds: [
                            `${typeof window !== "undefined" ? window.location.origin : ""}/outfit/${outfit.id}`,
                          ],
                        });
                      } catch {}
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>
              )}

              {/* Error State */}
              {paymentState === "error" && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">❌</span>
                  </div>
                  <div>
                    <p className="font-medium text-red-600">Payment Failed</p>
                    <p className="text-sm text-muted-foreground">
                      {paymentError || "Please try again."}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      pay({
                        amount: "1.00",
                        to:
                          selectedWardrobe?.owner.walletAddress ||
                          "0x50cCe62142Aa864EE13c9a2b0eEeDb38221CB5E7",
                        testnet:
                          process.env.NEXT_PUBLIC_BASEPAY_TESTNET === "true"
                            ? true
                            : false,
                      });
                      setPaymentError(null);
                    }}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Wardrobe Modal */}
      <CreateWardrobeModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSave={handleCreateWardrobe}
      />
    </>
  );
}

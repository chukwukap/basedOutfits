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
import { Plus, Lock, Globe, ArrowLeft } from "lucide-react";
import { CreateLookbookModal } from "@/app/lookbooks/_components/create-lookbook-modal";
import Image from "next/image";
import { LookFetchPayload } from "@/lib/types";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { BasePayButton } from "@base-org/account-ui/react";
import { pay } from "@base-org/account";
import { useUser } from "@/hooks/useUser";

interface Lookbook {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  lookCount: number;
  isPublic: boolean;
  owner: {
    walletAddress: string;
  };
}

interface AddToLookbookSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  look: LookFetchPayload;
  onComplete: (lookbookName: string) => void;
}

type PaymentState =
  | "selecting"
  | "payment"
  | "processing"
  | "success"
  | "error";

async function fetchUserLookbooks(ownerId: string): Promise<Lookbook[]> {
  const res = await fetch(
    `/api/lookbooks?ownerId=${encodeURIComponent(ownerId)}&public=0`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) return [];
  return await res.json();
}

export function AddToLookbookSheet({
  open,
  onOpenChange,
  look,
  onComplete,
}: AddToLookbookSheetProps) {
  const { mini } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
  const [paymentState, setPaymentState] = useState<PaymentState>("selecting");
  const [selectedLookbook, setSelectedLookbook] = useState<Lookbook | null>(
    null,
  );
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const currentUserId = mini.username || mini.fid || "";
    if (!currentUserId) return;
    fetchUserLookbooks(currentUserId)
      .then(setLookbooks)
      .catch(() => setLookbooks([]));
  }, [mini.username, mini.fid]);

  const handleLookbookSelect = (lookbook: Lookbook) => {
    setSelectedLookbook(lookbook);
    setPaymentState("payment");
    setPaymentError(null);
  };

  const handleBasePay = async () => {
    if (!selectedLookbook) {
      setPaymentError("No lookbook selected.");
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
        selectedLookbook.owner.walletAddress ||
        "0x50cCe62142Aa864EE13c9a2b0eEeDb38221CB5E7";
      const { success } = await pay({
        amount,
        to: recipient,
        testnet:
          process.env.NEXT_PUBLIC_BASEPAY_TESTNET === "true" ? true : false,
      });
      if (success) {
        // After payment, add the look to the lookbook
        const currentUserId = mini.username || mini.fid || "";
        const res = await fetch(`/api/lookbooks/${selectedLookbook.id}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lookId: look.id, addedById: currentUserId }),
        });
        if (!res.ok) throw new Error("Failed to add to lookbook");

        setPaymentState("success");
        setLookbooks(
          lookbooks.map((lb) =>
            lb.id === selectedLookbook.id
              ? { ...lb, lookCount: lb.lookCount + 1 }
              : lb,
          ),
        );
        setTimeout(() => {
          if (selectedLookbook) {
            onComplete(selectedLookbook.name);
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
    setSelectedLookbook(null);
    setPaymentError(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    if (paymentState === "payment") {
      setPaymentState("selecting");
      setSelectedLookbook(null);
      setPaymentError(null);
    } else if (paymentState === "error") {
      setPaymentState("payment");
      setPaymentError(null);
    }
  };

  const handleCreateLookbook = (
    newLookbook: Omit<Lookbook, "id" | "lookCount">,
  ) => {
    const lookbook = {
      ...newLookbook,
      id: Date.now().toString(),
      lookCount: 0, // Will be incremented after payment
    };
    setLookbooks([lookbook, ...lookbooks]);
    setShowCreateModal(false);
    setSelectedLookbook(lookbook);
    setPaymentState("payment");
    setPaymentError(null);
  };

  const getTitle = () => {
    switch (paymentState) {
      case "selecting":
        return "Add to Lookbook";
      case "payment":
        return `Add to ${selectedLookbook?.name}`;
      case "processing":
        return "Processing Payment";
      case "success":
        return "Payment Successful";
      case "error":
        return "Payment Failed";
      default:
        return "Add to Lookbook";
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

          {/* Lookbook Selection */}
          {paymentState === "selecting" && (
            <div className="space-y-4">
              {/* Look Preview */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={look.author.avatarUrl || "/placeholder.svg"}
                  />
                  <AvatarFallback>{look.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{look.author.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {look.caption}
                  </p>
                </div>
              </div>

              {/* Create New Lookbook */}
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
                    <p className="font-medium text-sm">Create New Lookbook</p>
                    <p className="text-xs text-muted-foreground">
                      Start a new collection
                    </p>
                  </div>
                </div>
              </Button>

              {/* Existing Lookbooks */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Your Lookbooks
                </p>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {lookbooks.map((lookbook) => (
                      <Button
                        key={lookbook.id}
                        variant="outline"
                        className="w-full justify-start h-auto p-3 bg-transparent hover:bg-muted/50"
                        onClick={() => handleLookbookSelect(lookbook)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={lookbook.coverImage || "/placeholder.svg"}
                              alt={lookbook.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">
                                {lookbook.name}
                              </p>
                              {lookbook.isPublic ? (
                                <Globe className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground truncate">
                                {lookbook.description}
                              </p>
                              <Badge
                                variant="secondary"
                                className="text-xs flex-shrink-0"
                              >
                                {lookbook.lookCount}
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
              {/* Selected Lookbook Preview */}
              {selectedLookbook && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={selectedLookbook.coverImage || "/placeholder.svg"}
                      alt={selectedLookbook.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {selectedLookbook.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedLookbook.lookCount} looks
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Form: Only BasePay is supported */}
              {paymentState === "payment" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="w-full">
                    <BasePayButton
                      colorScheme="light"
                      onClick={handleBasePay}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    You will pay 1 USDC to add this look to your lookbook.
                  </p>
                  {paymentError && (
                    <div className="text-destructive text-xs flex items-center gap-2 mt-2">
                      {paymentError}
                    </div>
                  )}
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
                      Look added to your lookbook!
                    </p>
                  </div>
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
                          selectedLookbook?.owner.walletAddress ||
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

      {/* Create Lookbook Modal */}
      <CreateLookbookModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSave={handleCreateLookbook}
      />
    </>
  );
}

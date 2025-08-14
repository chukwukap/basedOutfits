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
import { PaymentMethodSelector } from "@/app/_components/payment-method-selector";
import { PaymentReceipt } from "@/app/_components/payment-receipt";
import Image from "next/image";
import { LookFetchPayload } from "@/lib/types";

interface Lookbook {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  lookCount: number;
  isPublic: boolean;
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
  const res = await fetch(`/api/lookbooks?ownerId=${encodeURIComponent(ownerId)}&public=0`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}

export function AddToLookbookSheet({
  open,
  onOpenChange,
  look,
  onComplete,
}: AddToLookbookSheetProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
  const [paymentState, setPaymentState] = useState<PaymentState>("selecting");
  const [selectedLookbook, setSelectedLookbook] = useState<Lookbook | null>(
    null,
  );
  useEffect(() => {
    const currentUserId = "demo"; // TODO: replace with real auth context id
    fetchUserLookbooks(currentUserId)
      .then(setLookbooks)
      .catch(() => setLookbooks([]));
  }, []);

  const [paymentMethod, setPaymentMethod] = useState<
    "basepay" | "wallet" | null
  >(null);
  const [transactionHash, setTransactionHash] = useState<string>("");

  const handleLookbookSelect = (lookbook: Lookbook) => {
    setSelectedLookbook(lookbook);
    setPaymentState("payment");
  };

  const handlePaymentMethodSelect = (method: "basepay" | "wallet") => {
    setPaymentMethod(method);
    setPaymentState("processing");

    // Process: add to lookbook via API
    (async () => {
      try {
        const currentUserId = "demo"; // TODO: replace with real auth context id
        const res = await fetch(`/api/lookbooks/${selectedLookbook?.id}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lookId: look.id, addedById: currentUserId }),
        });
        if (!res.ok) throw new Error("Failed to add to lookbook");
        setTransactionHash(`added:${Date.now()}`);
        setPaymentState("success");
        if (selectedLookbook) {
          setLookbooks(
            lookbooks.map((lb) =>
              lb.id === selectedLookbook.id
                ? { ...lb, lookCount: lb.lookCount + 1 }
                : lb,
            ),
          );
        }
      } catch {
        setPaymentState("error");
      }
    })();
  };

  const handlePaymentSuccess = () => {
    if (selectedLookbook) {
      onComplete(selectedLookbook.name);
    }
    handleClose();
  };

  const handleClose = () => {
    setPaymentState("selecting");
    setSelectedLookbook(null);
    setPaymentMethod(null);
    setTransactionHash("");
    onOpenChange(false);
  };

  const handleBack = () => {
    if (paymentState === "payment") {
      setPaymentState("selecting");
      setSelectedLookbook(null);
    } else if (paymentState === "error") {
      setPaymentState("payment");
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

              {/* Payment Component */}
              {paymentState === "payment" && (
                <div className="space-y-4">
                  <PaymentMethodSelector
                    amount={0.001}
                    selectedMethod={paymentMethod || "basepay"}
                    onMethodChange={(method) => setPaymentMethod(method)}
                  />

                  <Button
                    onClick={() =>
                      handlePaymentMethodSelect(paymentMethod || "basepay")
                    }
                    className="w-full"
                    disabled={!paymentMethod}
                  >
                    Pay 0.001 ETH
                  </Button>
                </div>
              )}

              {paymentState === "processing" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="text-center">
                    <p className="font-medium">Processing Payment</p>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethod === "basepay"
                        ? "Processing with Basepay..."
                        : "Waiting for wallet signature..."}
                    </p>
                  </div>
                </div>
              )}

              {paymentState === "success" && (
                <>
                  <PaymentReceipt
                    type="collect"
                    amount={0.001}
                    recipient={look.author.name}
                    transactionHash={transactionHash}
                    paymentMethod={paymentMethod || "basepay"}
                  />
                  <Button
                    onClick={handlePaymentSuccess}
                    className="w-full mt-2"
                  >
                    Done
                  </Button>
                </>
              )}

              {paymentState === "error" && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">❌</span>
                  </div>
                  <div>
                    <p className="font-medium text-red-600">Payment Failed</p>
                    <p className="text-sm text-muted-foreground">
                      Please try again or use a different payment method
                    </p>
                  </div>
                  <Button onClick={handleBack} className="w-full">
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

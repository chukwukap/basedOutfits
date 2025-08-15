"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Alert, AlertDescription } from "@/app/_components/ui/alert";
import { DollarSign, AlertCircle, Loader2 } from "lucide-react";
import { LookFetchPayload } from "@/lib/types";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { BasePayButton } from "@base-org/account-ui/react";
interface TipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  look: LookFetchPayload;
  onComplete: (amount: number) => void;
}

type PaymentState = "input" | "processing";

export function TipModal({
  open,
  onOpenChange,
  look,
  onComplete,
}: TipModalProps) {
  const { context } = useMiniKit();
  const [amount, setAmount] = useState("1.00");
  const [paymentState, setPaymentState] = useState<PaymentState>("input");
  const [error, setError] = useState("");

  const quickAmounts = ["0.50", "1.00", "2.00", "5.00"];

  const handlePayment = async () => {
    setPaymentState("processing");
    setError("");

    try {
      await processBasepayPayment();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.",
      );
      // setPaymentState("error");
    }
  };

  const processBasepayPayment = async () => {
    // For now, instantly create a Tip record
    const c =
      (context as unknown as {
        user?: { username?: string; fid?: number | string };
      } | null) || null;
    const currentUserId = (c?.user?.username || c?.user?.fid?.toString()) ?? "";
    const receiverId = look.authorId;
    const res = await fetch("/api/tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: currentUserId,
        receiverId,
        lookId: look.id,
        amount: Number.parseFloat(amount),
        currency: "USDC",
      }),
    });
    if (!res.ok) throw new Error("Payment failed");
  };

  const handleClose = () => {
    onComplete(Number.parseFloat(amount));

    // Reset state
    setPaymentState("input");
    setAmount("1.00");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {"Tip Sent!"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Look info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={look.author.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback>{look.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{look.author.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {look.caption}
              </p>
            </div>
          </div>

          {/* Payment States */}
          {paymentState === "input" && (
            <>
              {/* Quick amounts */}
              <div>
                <Label className="text-sm font-medium">Quick amounts</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant={amount === quickAmount ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAmount(quickAmount)}
                      className="text-xs"
                    >
                      ${quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div>
                <Label htmlFor="tip-amount" className="text-sm font-medium">
                  Custom amount (min $0.50)
                </Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="tip-amount"
                    type="number"
                    min="0.50"
                    step="0.50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9"
                    placeholder="1.00"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <BasePayButton colorScheme="light" onClick={handlePayment} />
              </div>
            </>
          )}

          {paymentState === "processing" && (
            <div className="text-center py-6">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Processing Payment</h3>
              <p className="text-sm text-muted-foreground">
                {"Confirming transaction with Basepay..."}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

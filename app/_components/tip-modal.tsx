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
import { pay } from "@base-org/account";

/**
 * TipModalProps defines the props for the TipModal component.
 */
interface TipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  look: LookFetchPayload;
  onComplete: (amount: number) => void;
}

/**
 * PaymentState defines the possible states of the payment flow.
 */
type PaymentState = "input" | "processing" | "success" | "error";

/**
 * TipModal component allows users to tip a look author using BasePay.
 * Closely follows the payment flow and state management of AddToLookbookSheet.
 */
export function TipModal({
  open,
  onOpenChange,
  look,
  onComplete,
}: TipModalProps) {
  const { context } = useMiniKit();
  const [amount, setAmount] = useState("1.00");
  const [paymentState, setPaymentState] = useState<PaymentState>("input");
  const [error, setError] = useState<string | null>(null);

  // Quick amount options for tipping
  const quickAmounts = ["0.50", "1.00", "2.00", "5.00"];

  /**
   * Handles the BasePay payment process.
   * Follows the same pattern as AddToLookbookSheet for security and consistency.
   */
  const handleBasePay = async () => {
    setPaymentState("processing");
    setError(null);

    try {
      // Validate amount
      const parsedAmount = Number.parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount < 0.5) {
        setError("Minimum tip amount is $0.50.");
        setPaymentState("input");
        return;
      }

      // The recipient should be the look author's wallet address or a configured address
      // For demo, we'll use a placeholder address (replace with your real one)
      const recipient =
        process.env.NEXT_PUBLIC_BASEPAY_TIP_RECIPIENT_ADDRESS ||
        "0x0000000000000000000000000000000000000000";

      // Call BasePay to process the payment
      const { success } = await pay({
        amount: parsedAmount.toString(),
        to: recipient,
        testnet:
          process.env.NEXT_PUBLIC_BASEPAY_TESTNET === "true" ? true : false,
      });

      if (success) {
        // Record the tip in the backend for audit and security
        const c =
          (context as unknown as {
            user?: { username?: string; fid?: number | string };
          } | null) || null;
        const currentUserId =
          (c?.user?.username || c?.user?.fid?.toString()) ?? "";
        const receiverId = look.authorId;

        const res = await fetch("/api/tips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: currentUserId,
            receiverId,
            lookId: look.id,
            amount: parsedAmount,
            currency: "USDC",
          }),
        });

        if (!res.ok) {
          setError("Failed to record tip. Please contact support.");
          setPaymentState("error");
          return;
        }

        setPaymentState("success");
      } else {
        setError("Payment failed. Please try again.");
        setPaymentState("error");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.",
      );
      setPaymentState("error");
    }
  };

  /**
   * Handles closing the modal and resets state.
   * Calls onComplete if payment was successful.
   */
  const handleClose = () => {
    if (paymentState === "success") {
      onComplete(Number.parseFloat(amount));
    }
    // Reset state for next open
    setPaymentState("input");
    setAmount("1.00");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {paymentState === "success" ? "Tip Sent!" : "Send a Tip"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Look info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={look.author.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback>
                {look.author.name ? look.author.name[0] : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{look.author.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {look.caption}
              </p>
            </div>
          </div>

          {/* Payment Flow */}
          {(paymentState === "input" ||
            paymentState === "processing" ||
            paymentState === "success" ||
            paymentState === "error") && (
            <div className="space-y-4">
              {/* Input State */}
              {paymentState === "input" && (
                <>
                  {/* Quick amounts */}
                  <div>
                    <Label className="text-sm font-medium">Quick amounts</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {quickAmounts.map((quickAmount) => (
                        <Button
                          key={quickAmount}
                          variant={
                            amount === quickAmount ? "default" : "outline"
                          }
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
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-9"
                        placeholder="1.00"
                        inputMode="decimal"
                        aria-label="Tip amount"
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
                    <BasePayButton
                      colorScheme="light"
                      onClick={handleBasePay}
                    />
                  </div>
                </>
              )}

              {/* Processing State */}
              {paymentState === "processing" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
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
                      Tip sent to {look.author.name}!
                    </p>
                  </div>
                  <Button onClick={handleClose} className="w-full">
                    Close
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
                      {error || "Please try again."}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      pay({
                        amount: "1.00",
                        to: "0x0000000000000000000000000000000000000000",
                        testnet:
                          process.env.NEXT_PUBLIC_BASEPAY_TESTNET === "true"
                            ? true
                            : false,
                      });
                      setError(null);
                    }}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

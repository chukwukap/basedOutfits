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
import { Badge } from "@/app/_components/ui/badge";
import { Alert, AlertDescription } from "@/app/_components/ui/alert";
import { DollarSign, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { PaymentMethodSelector } from "@/app/_components/payment-method-selector";
import { PaymentReceipt } from "@/app/_components/payment-receipt";

interface Look {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface TipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  look: Look;
  onComplete: (amount: number) => void;
}

type PaymentState = "input" | "method" | "processing" | "success" | "error";
type PaymentMethod = "basepay" | "wallet";

export function TipModal({
  open,
  onOpenChange,
  look,
  onComplete,
}: TipModalProps) {
  const [amount, setAmount] = useState("1.00");
  const [paymentState, setPaymentState] = useState<PaymentState>("input");
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>("basepay");
  const [error, setError] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const quickAmounts = ["0.50", "1.00", "2.00", "5.00"];

  const handleContinue = () => {
    const tipAmount = Number.parseFloat(amount);
    if (tipAmount < 0.5) {
      setError("Minimum tip amount is $0.50");
      return;
    }
    setError("");
    setPaymentState("method");
  };

  const handlePayment = async () => {
    setPaymentState("processing");
    setError("");

    try {
      if (selectedMethod === "basepay") {
        await processBasepayPayment();
      } else {
        await processWalletPayment();
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

  const processBasepayPayment = async () => {
    // Simulate Basepay integration
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          setTransactionHash("0x" + Math.random().toString(16).substr(2, 8));
          resolve(true);
        } else {
          reject(new Error("Basepay transaction failed"));
        }
      }, 2500);
    });

    setPaymentState("success");
  };

  const processWalletPayment = async () => {
    // Simulate wallet connection and signature
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 85% success rate
        if (Math.random() > 0.15) {
          setTransactionHash("0x" + Math.random().toString(16).substr(2, 8));
          resolve(true);
        } else {
          reject(new Error("Wallet signature rejected"));
        }
      }, 3000);
    });

    setPaymentState("success");
  };

  const handleClose = () => {
    if (paymentState === "success") {
      onComplete(Number.parseFloat(amount));
    }

    // Reset state
    setPaymentState("input");
    setAmount("1.00");
    setError("");
    setTransactionHash("");
    onOpenChange(false);
  };

  const handleRetry = () => {
    setPaymentState("method");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {paymentState === "success" ? "Tip Sent!" : "Tip Creator"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Look info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={look.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{look.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{look.author.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {look.title}
              </p>
            </div>
            {paymentState === "success" && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Sent
              </Badge>
            )}
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
                <Button
                  onClick={handleContinue}
                  disabled={Number.parseFloat(amount) < 0.5}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {paymentState === "method" && (
            <>
              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
                amount={Number.parseFloat(amount)}
              />

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setPaymentState("input")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={handlePayment} className="flex-1">
                  Pay ${amount}
                </Button>
              </div>
            </>
          )}

          {paymentState === "processing" && (
            <div className="text-center py-6">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Processing Payment</h3>
              <p className="text-sm text-muted-foreground">
                {selectedMethod === "basepay"
                  ? "Confirming transaction with Basepay..."
                  : "Waiting for wallet confirmation..."}
              </p>
            </div>
          )}

          {paymentState === "success" && (
            <>
              <PaymentReceipt
                type="tip"
                amount={Number.parseFloat(amount)}
                recipient={look.author.name}
                transactionHash={transactionHash}
                paymentMethod={selectedMethod}
              />

              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </>
          )}

          {paymentState === "error" && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button onClick={handleRetry} className="flex-1">
                  Try Again
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

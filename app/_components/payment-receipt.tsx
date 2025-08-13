"use client";

import { Card } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Separator } from "@/app/_components/ui/separator";
import {
  CheckCircle,
  ExternalLink,
  Copy,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

interface PaymentReceiptProps {
  type: "tip" | "collect";
  amount: number;
  recipient: string;
  transactionHash: string;
  paymentMethod: "basepay" | "wallet";
}

export function PaymentReceipt({
  type,
  amount,
  recipient,
  transactionHash,
  paymentMethod,
}: PaymentReceiptProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = async () => {
    await navigator.clipboard.writeText(transactionHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewTransaction = () => {
    // Open transaction in block explorer
    window.open(`https://basescan.org/tx/${transactionHash}`, "_blank");
  };

  return (
    <Card className="p-4 bg-green-50 border-green-200">
      <div className="space-y-4">
        {/* Success Header */}
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">
            {type === "tip"
              ? "Tip Sent Successfully!"
              : "Look Collected Successfully!"}
          </span>
        </div>

        <Separator className="bg-green-200" />

        {/* Transaction Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {type === "tip" ? "Recipient" : "Creator"}
            </span>
            <span className="font-medium">{recipient}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Payment Method</span>
            <Badge variant="outline" className="text-xs">
              <CreditCard className="w-3 h-3 mr-1" />
              {paymentMethod === "basepay" ? "Basepay" : "Wallet"}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between items-start gap-2">
            <span className="text-muted-foreground">Transaction</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                {transactionHash.slice(0, 8)}...{transactionHash.slice(-6)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleCopyHash}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-green-200" />

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewTransaction}
            className="flex-1 bg-transparent text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View on Explorer
          </Button>
          {copied && (
            <Badge
              variant="secondary"
              className="text-xs bg-green-100 text-green-800"
            >
              Copied!
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

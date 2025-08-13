"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, DollarSign, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { PaymentMethodSelector } from "@/components/payment-method-selector"
import { PaymentReceipt } from "@/components/payment-receipt"

interface Look {
  id: string
  title: string
  author: {
    name: string
    avatar: string
  }
}

interface CollectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  look: Look
  onComplete: () => void
}

type PaymentState = "confirm" | "method" | "processing" | "success" | "error"
type PaymentMethod = "basepay" | "wallet"

export function CollectModal({ open, onOpenChange, look, onComplete }: CollectModalProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>("confirm")
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("basepay")
  const [error, setError] = useState("")
  const [transactionHash, setTransactionHash] = useState("")

  const collectFee = 1.0

  const handleContinue = () => {
    setPaymentState("method")
  }

  const handlePayment = async () => {
    setPaymentState("processing")
    setError("")

    try {
      if (selectedMethod === "basepay") {
        await processBasepayPayment()
      } else {
        await processWalletPayment()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.")
      setPaymentState("error")
    }
  }

  const processBasepayPayment = async () => {
    // Simulate Basepay integration
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          setTransactionHash("0x" + Math.random().toString(16).substr(2, 8))
          resolve(true)
        } else {
          reject(new Error("Basepay transaction failed"))
        }
      }, 2500)
    })

    setPaymentState("success")
  }

  const processWalletPayment = async () => {
    // Simulate wallet connection and signature
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 85% success rate
        if (Math.random() > 0.15) {
          setTransactionHash("0x" + Math.random().toString(16).substr(2, 8))
          resolve(true)
        } else {
          reject(new Error("Wallet signature rejected"))
        }
      }, 3000)
    })

    setPaymentState("success")
  }

  const handleClose = () => {
    if (paymentState === "success") {
      onComplete()
    }

    // Reset state
    setPaymentState("confirm")
    setError("")
    setTransactionHash("")
    onOpenChange(false)
  }

  const handleRetry = () => {
    setPaymentState("method")
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {paymentState === "success" ? "Look Collected!" : "Collect Look"}
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
              <p className="text-xs text-muted-foreground truncate">{look.title}</p>
            </div>
            {paymentState === "success" && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Collected
              </Badge>
            )}
          </div>

          {/* Payment States */}
          {paymentState === "confirm" && (
            <>
              {/* Collection info */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Collection Fee</span>
                  <span className="text-lg font-semibold flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {collectFee.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This look will be saved to your closet and you'll support the creator.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleContinue} className="flex-1">
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
                amount={collectFee}
              />

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setPaymentState("confirm")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handlePayment} className="flex-1">
                  Collect for ${collectFee.toFixed(2)}
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
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Look Added to Your Closet!</h3>
                <p className="text-sm text-muted-foreground">You can now view this look anytime in your closet.</p>
              </div>

              <PaymentReceipt
                type="collect"
                amount={collectFee}
                recipient={look.author.name}
                transactionHash={transactionHash}
                paymentMethod={selectedMethod}
              />

              <Button onClick={handleClose} className="w-full">
                View in Closet
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
                <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
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
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Wallet, Zap, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

type PaymentMethod = "basepay" | "wallet"

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
  amount: number
}

export function PaymentMethodSelector({ selectedMethod, onMethodChange, amount }: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: "basepay" as PaymentMethod,
      name: "Basepay",
      description: "Fast & secure payments on Base",
      icon: CreditCard,
      features: ["Instant", "Low fees", "Farcaster native"],
      recommended: true,
      estimatedTime: "~5 seconds",
    },
    {
      id: "wallet" as PaymentMethod,
      name: "Wallet Signature",
      description: "Connect your crypto wallet",
      icon: Wallet,
      features: ["Self-custody", "Any wallet", "Signature required"],
      recommended: false,
      estimatedTime: "~30 seconds",
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Choose payment method</h4>
        <span className="text-sm text-muted-foreground">${amount.toFixed(2)}</span>
      </div>

      {methods.map((method) => {
        const Icon = method.icon
        const isSelected = selectedMethod === method.id

        return (
          <Card
            key={method.id}
            className={cn(
              "p-4 cursor-pointer transition-all hover:shadow-md",
              isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50",
            )}
            onClick={() => onMethodChange(method.id)}
          >
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-lg", isSelected ? "bg-primary text-primary-foreground" : "bg-muted")}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-sm">{method.name}</h5>
                  {method.recommended && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      <Zap className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mb-2">{method.description}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {method.estimatedTime}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {method.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs px-2 py-0 h-5">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-colors",
                  isSelected ? "bg-primary border-primary" : "border-muted-foreground/30",
                )}
              />
            </div>
          </Card>
        )
      })}
    </div>
  )
}

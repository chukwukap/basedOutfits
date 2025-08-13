"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Wallet, CheckCircle, AlertCircle } from "lucide-react"

interface WalletConnectionProps {
  onConnectionChange: (connected: boolean, address?: string) => void
}

export function WalletConnection({ onConnectionChange }: WalletConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      // Simulate checking existing wallet connection
      const savedAddress = localStorage.getItem("wallet_address")
      if (savedAddress) {
        setAddress(savedAddress)
        setIsConnected(true)
        onConnectionChange(true, savedAddress)
      }
    } catch (err) {
      console.log("No existing wallet connection")
    }
  }

  const connectWallet = async () => {
    setConnecting(true)
    setError("")

    try {
      // Simulate wallet connection
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            const mockAddress = "0x" + Math.random().toString(16).substr(2, 8)
            setAddress(mockAddress)
            setIsConnected(true)
            localStorage.setItem("wallet_address", mockAddress)
            onConnectionChange(true, mockAddress)
            resolve(true)
          } else {
            reject(new Error("User rejected connection"))
          }
        }, 2000)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
    localStorage.removeItem("wallet_address")
    onConnectionChange(false)
  }

  if (isConnected) {
    return (
      <Card className="p-3 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Wallet Connected</span>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={disconnectWallet} className="w-full mt-2 text-xs">
          Disconnect
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="text-center space-y-3">
        <Wallet className="w-8 h-8 mx-auto text-muted-foreground" />
        <div>
          <h4 className="font-medium text-sm mb-1">Connect Wallet</h4>
          <p className="text-xs text-muted-foreground">Connect your crypto wallet to complete the payment</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}

        <Button onClick={connectWallet} disabled={connecting} className="w-full" size="sm">
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>
    </Card>
  )
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { Card } from "@/app/_components/ui/card";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { useUser } from "@/hooks/useUser";

interface WalletConnectionProps {
  onConnectionChange: (connected: boolean, address?: string) => void;
}

export function WalletConnection({
  onConnectionChange,
}: WalletConnectionProps) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const { mini, db, loading } = useUser();

  useEffect(() => {
    if (mini.walletAddress) {
      onConnectionChange(true, mini.walletAddress);
    }
  }, [mini.walletAddress, onConnectionChange]);

  const connectWallet = async () => {
    setConnecting(true);
    setError("");

    try {
      // Try EIP-1193 provider if available
      const eth = (globalThis as any).ethereum;
      if (!eth || typeof eth.request !== "function") {
        throw new Error("No EVM wallet detected in this browser");
      }
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      const account = accounts?.[0];
      if (!account) throw new Error("Wallet connection failed");
      onConnectionChange(true, account);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    onConnectionChange(false);
  };

  if (!loading && mini.walletAddress) {
    return (
      <Card className="p-3 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Wallet Connected</span>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {mini.walletAddress.slice(0, 6)}...{mini.walletAddress.slice(-4)}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
          className="w-full mt-2 text-xs"
        >
          Disconnect
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="text-center space-y-3">
        <Wallet className="w-8 h-8 mx-auto text-muted-foreground" />
        <div>
          <h4 className="font-medium text-sm mb-1">Connect Wallet</h4>
          <p className="text-xs text-muted-foreground">
            Connect your crypto wallet to complete the payment
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}

        <Button
          onClick={connectWallet}
          disabled={connecting}
          className="w-full"
          size="sm"
        >
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>
    </Card>
  );
}

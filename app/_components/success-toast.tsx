"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/app/_components/ui/button";

interface SuccessToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function SuccessToast({
  show,
  message,
  onClose,
  duration = 3000,
}: SuccessToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm font-medium text-green-800 flex-1">{message}</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-green-600"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

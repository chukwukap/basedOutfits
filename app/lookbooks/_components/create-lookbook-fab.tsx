"use client";

import { Plus } from "lucide-react";
import { Button } from "@/app/_components/ui/button";

interface CreateLookbookFabProps {
  onClick: () => void;
}

export function CreateLookbookFab({ onClick }: CreateLookbookFabProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-20"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}

"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";

interface CommentInputProps {
  onSubmit: (content: string) => void;
}

export function CommentInput({ onSubmit }: CommentInputProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    onSubmit(comment.trim());
    setComment("");
    setIsSubmitting(false);

    // Blur input to hide keyboard on mobile
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    // Scroll to input when focused to ensure it's visible above keyboard
    setTimeout(() => {
      inputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  return (
    <div className="sticky bottom-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t pt-4 -mx-4 px-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onFocus={handleInputFocus}
          placeholder="Write a comment..."
          className="flex-1 rounded-full bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          disabled={isSubmitting}
          maxLength={500}
        />
        <Button
          type="submit"
          size="sm"
          disabled={!comment.trim() || isSubmitting}
          className="rounded-full px-3 min-w-[44px] h-10"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {comment.length > 400 && (
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {500 - comment.length} characters remaining
        </p>
      )}
    </div>
  );
}

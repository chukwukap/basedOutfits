"use client";

import { useState, useEffect, useRef } from "react";
import { CommentCard } from "./comment-card";
import { CommentInput } from "./comment-input";
import { Button } from "@/app/_components/ui/button";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  outfitId: string;
  author: {
    name: string;
    avatar: string;
    fid: string;
  };
  content: string;
  createdAt: string;
}

interface CommentsSectionProps {
  outfitId: string;
}

async function fetchComments(outfitId: string): Promise<Comment[]> {
  const res = await fetch(
    `/api/comments?outfitId=${encodeURIComponent(outfitId)}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) return [];
  return await res.json();
}

export function CommentsSection({ outfitId }: CommentsSectionProps) {
  const { context } = useMiniKit();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchComments(outfitId);
      // Normalize createdAt to string
      const normalized = data.map((c) => ({
        ...c,
        createdAt:
          typeof c.createdAt === "string"
            ? c.createdAt
            : new Date(c.createdAt).toISOString(),
      }));
      setComments(normalized);
      setLoading(false);
    };
    load();
  }, [outfitId]);

  const handleAddComment = async (content: string) => {
    const c =
      (context as unknown as {
        user?: { username?: string; fid?: number | string };
      } | null) || null;
    const currentUserId = (c?.user?.username || c?.user?.fid?.toString()) ?? "";
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outfitId, authorId: currentUserId, content }),
    });
    if (res.ok) {
      const created = (await res.json()) as Comment;
      setComments((prev) => [created, ...prev]);
    }
  };

  const displayedComments = showAll ? comments : comments.slice(0, 3);

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Comments</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 bg-muted rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6" ref={commentsRef}>
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Comments</h3>
        <span className="text-sm text-muted-foreground">
          ({comments.length})
        </span>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground mb-4">No comments yet</p>
          <p className="text-sm text-muted-foreground">
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {displayedComments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>

          {comments.length > 3 && !showAll && (
            <Button
              variant="ghost"
              onClick={() => setShowAll(true)}
              className="w-full mb-6"
            >
              Show {comments.length - 3} more comments
            </Button>
          )}
        </>
      )}

      <CommentInput onSubmit={handleAddComment} />
    </div>
  );
}

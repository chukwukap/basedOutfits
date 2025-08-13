"use client";

import { useState, useEffect, useRef } from "react";
import { CommentCard } from "./comment-card";
import { CommentInput } from "./comment-input";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  lookId: string;
  author: {
    name: string;
    avatar: string;
    fid: string;
  };
  content: string;
  createdAt: string;
}

interface CommentsSectionProps {
  lookId: string;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: "1",
    lookId: "1",
    author: {
      name: "Emma Wilson",
      avatar: "/diverse-group-profile.png",
      fid: "11111",
    },
    content: "Love this outfit! Where did you get that jacket? 😍",
    createdAt: "1h ago",
  },
  {
    id: "2",
    lookId: "1",
    author: {
      name: "Marcus Johnson",
      avatar: "/diverse-group-profile.png",
      fid: "22222",
    },
    content: "The color coordination is perfect! Great styling tips.",
    createdAt: "3h ago",
  },
  {
    id: "3",
    lookId: "1",
    author: {
      name: "Sofia Rodriguez",
      avatar: "/diverse-group-profile.png",
      fid: "33333",
    },
    content:
      "This is giving me major summer vibes! Need to recreate this look 🌞",
    createdAt: "5h ago",
  },
];

export function CommentsSection({ lookId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate API call to fetch comments
    const loadComments = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const lookComments = mockComments.filter(
        (comment) => comment.lookId === lookId,
      );
      setComments(lookComments);
      setLoading(false);
    };

    loadComments();
  }, [lookId]);

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      lookId,
      author: {
        name: "You", // In real app, this would come from Farcaster context
        avatar: "/diverse-group-profile.png",
        fid: "current-user",
      },
      content,
      createdAt: "now",
    };

    // Optimistic UI - add comment immediately
    setComments((prev) => [newComment, ...prev]);
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

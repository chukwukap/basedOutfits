"use client";

import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";

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

interface CommentCardProps {
  comment: Comment;
}

export function CommentCard({ comment }: CommentCardProps) {
  const router = useRouter();

  const handleProfileClick = () => {
    // Navigate to user's profile/lookbook
    router.push(
      `/profile/${comment.author.name.toLowerCase().replace(" ", "")}`,
    );
  };

  return (
    <div className="flex gap-3">
      <Avatar
        className="w-8 h-8 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
        onClick={handleProfileClick}
      >
        <AvatarImage
          src={comment.author.avatar || "/placeholder.svg"}
          alt={comment.author.name}
        />
        <AvatarFallback className="text-xs">
          {comment.author.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={handleProfileClick}
            className="font-medium text-sm hover:underline cursor-pointer"
          >
            {comment.author.name}
          </button>
          <span className="text-xs text-muted-foreground">
            {comment.createdAt}
          </span>
        </div>

        <p className="text-sm text-foreground leading-relaxed break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
}

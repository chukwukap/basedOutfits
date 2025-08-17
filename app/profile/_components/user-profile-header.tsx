"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
// import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { Calendar } from "lucide-react";
import { UserProfile } from "@/lib/types";

interface UserProfileHeaderProps {
  user: UserProfile;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Avatar and Basic Info */}
      <div className="flex items-start gap-4">
        <Avatar className="w-20 h-20 ring-2 ring-background shadow-lg">
          <AvatarImage src={user.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-lg">
            {user.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>

          {/* Follow control removed */}
        </div>
      </div>

      {/* Bio */}
      {user.bio && <p className="text-sm leading-relaxed">{user.bio}</p>}

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-semibold">{user.totalOutfits}</p>
          <p className="text-muted-foreground">Wardrobes</p>
        </div>
        {/* Followers/Following removed */}
      </div>

      {/* Join Date */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" />
        <span>
          Joined{" "}
          {new Date(user.joinedDate).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Public Wardrobes Section Header */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Public Wardrobes</h3>
          <Badge variant="secondary" className="text-xs">
            {user.publicWardrobes?.length || 0}
          </Badge>
        </div>
      </div>
    </div>
  );
}

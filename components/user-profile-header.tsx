"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus, UserCheck, Calendar } from "lucide-react"

interface User {
  username: string
  name: string
  avatar: string
  bio: string
  followers: number
  following: number
  totalLooks: number
  joinedDate: string
  isFollowing: boolean
}

interface UserProfileHeaderProps {
  user: User
  onFollowUser: () => void
}

export function UserProfileHeader({ user, onFollowUser }: UserProfileHeaderProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Avatar and Basic Info */}
      <div className="flex items-start gap-4">
        <Avatar className="w-20 h-20 ring-2 ring-background shadow-lg">
          <AvatarImage src={user.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-lg">{user.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>

          <Button
            onClick={onFollowUser}
            variant={user.isFollowing ? "outline" : "default"}
            size="sm"
            className="w-full sm:w-auto"
          >
            {user.isFollowing ? (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Bio */}
      {user.bio && <p className="text-sm leading-relaxed">{user.bio}</p>}

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-semibold">{user.totalLooks}</p>
          <p className="text-muted-foreground">Looks</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{user.followers.toLocaleString()}</p>
          <p className="text-muted-foreground">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{user.following.toLocaleString()}</p>
          <p className="text-muted-foreground">Following</p>
        </div>
      </div>

      {/* Join Date */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" />
        <span>Joined {new Date(user.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
      </div>

      {/* Public Lookbooks Section Header */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Public Lookbooks</h3>
          <Badge variant="secondary" className="text-xs">
            {user.publicLookbooks?.length || 0}
          </Badge>
        </div>
      </div>
    </div>
  )
}

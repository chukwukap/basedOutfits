"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, UserCheck, Star } from "lucide-react"
import { useState } from "react"

// Mock featured creators data
const mockFeaturedCreators = [
  {
    username: "sarahc",
    name: "Sarah Chen",
    avatar: "/diverse-group-profile.png",
    bio: "Fashion enthusiast & style curator",
    followers: 1240,
    lookbooksCount: 3,
    totalLooks: 45,
    isFollowing: false,
    isFeatured: true,
    tags: ["minimalist", "chic", "sustainable"],
  },
  {
    username: "alexr",
    name: "Alex Rivera",
    avatar: "/diverse-group-profile.png",
    bio: "Sustainable fashion advocate",
    followers: 2100,
    lookbooksCount: 2,
    totalLooks: 67,
    isFollowing: true,
    isFeatured: true,
    tags: ["sustainable", "vintage", "ethical"],
  },
  {
    username: "jordank",
    name: "Jordan Kim",
    avatar: "/diverse-group-profile.png",
    bio: "Street style photographer & curator",
    followers: 890,
    lookbooksCount: 4,
    totalLooks: 32,
    isFollowing: false,
    isFeatured: true,
    tags: ["streetwear", "urban", "photography"],
  },
  {
    username: "mayap",
    name: "Maya Patel",
    avatar: "/diverse-group-profile.png",
    bio: "Color enthusiast & pattern mixer",
    followers: 1560,
    lookbooksCount: 5,
    totalLooks: 58,
    isFollowing: false,
    isFeatured: true,
    tags: ["colorful", "patterns", "bold"],
  },
]

export function FeaturedCreators() {
  const [creators, setCreators] = useState(mockFeaturedCreators)

  const handleFollowCreator = (username: string) => {
    setCreators(
      creators.map((creator) =>
        creator.username === username
          ? {
              ...creator,
              isFollowing: !creator.isFollowing,
              followers: creator.isFollowing ? creator.followers - 1 : creator.followers + 1,
            }
          : creator,
      ),
    )
  }

  const handleCreatorClick = (username: string) => {
    window.location.href = `/profile/${username}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Featured Creators</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {creators.map((creator) => (
          <Card
            key={creator.username}
            className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 group"
            onClick={() => handleCreatorClick(creator.username)}
          >
            <div className="space-y-3">
              {/* Header with Avatar and Follow Button */}
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12 ring-2 ring-background">
                  <AvatarImage src={creator.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{creator.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">{creator.name}</h3>
                    {creator.isFeatured && (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">@{creator.username}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{creator.bio}</p>
                </div>

                <Button
                  variant={creator.isFollowing ? "outline" : "default"}
                  size="sm"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFollowCreator(creator.username)
                  }}
                >
                  {creator.isFollowing ? (
                    <>
                      <UserCheck className="w-3 h-3 mr-1" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="text-center">
                  <p className="font-semibold text-foreground">{creator.totalLooks}</p>
                  <p>Looks</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">{creator.lookbooksCount}</p>
                  <p>Lookbooks</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">{creator.followers.toLocaleString()}</p>
                  <p>Followers</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {creator.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-2 py-0 h-5">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

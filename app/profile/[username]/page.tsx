"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { UserProfileHeader } from "@/components/user-profile-header"
import { UserLookbooksGrid } from "@/components/user-lookbooks-grid"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock user profiles data
const mockUserProfiles = {
  sarahc: {
    username: "sarahc",
    name: "Sarah Chen",
    avatar: "/diverse-group-profile.png",
    bio: "Fashion enthusiast & style curator. Sharing my favorite looks and discoveries.",
    followers: 1240,
    following: 890,
    totalLooks: 45,
    joinedDate: "2023-08-15",
    isFollowing: false,
    publicLookbooks: [
      {
        id: "sarah-1",
        name: "Minimalist Chic",
        description: "Clean lines and neutral tones",
        coverImage: "/business-casual-outfit.png",
        lookCount: 18,
        isPublic: true,
        followers: 234,
        isFollowing: false,
        updatedAt: "2024-01-20",
      },
      {
        id: "sarah-2",
        name: "Boho Dreams",
        description: "Free-spirited and flowing styles",
        coverImage: "/summer-fashion-outfit.png",
        lookCount: 12,
        isPublic: true,
        followers: 156,
        isFollowing: true,
        updatedAt: "2024-01-18",
      },
      {
        id: "sarah-3",
        name: "City Explorer",
        description: "Urban adventures in style",
        coverImage: "/street-style-outfit.png",
        lookCount: 15,
        isPublic: true,
        followers: 89,
        isFollowing: false,
        updatedAt: "2024-01-15",
      },
    ],
  },
  alexr: {
    username: "alexr",
    name: "Alex Rivera",
    avatar: "/diverse-group-profile.png",
    bio: "Sustainable fashion advocate. Curating timeless pieces and ethical brands.",
    followers: 2100,
    following: 450,
    totalLooks: 67,
    joinedDate: "2023-06-10",
    isFollowing: true,
    publicLookbooks: [
      {
        id: "alex-1",
        name: "Sustainable Style",
        description: "Ethical fashion choices",
        coverImage: "/elegant-evening-dress.png",
        lookCount: 22,
        isPublic: true,
        followers: 445,
        isFollowing: false,
        updatedAt: "2024-01-19",
      },
      {
        id: "alex-2",
        name: "Vintage Finds",
        description: "Timeless pieces with history",
        coverImage: "/fashionable-summer-outfit.png",
        lookCount: 28,
        isPublic: true,
        followers: 312,
        isFollowing: true,
        updatedAt: "2024-01-17",
      },
    ],
  },
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const foundUser = mockUserProfiles[username as keyof typeof mockUserProfiles]
      setUser(foundUser || null)
      setLoading(false)
    }, 500)
  }, [username])

  const handleBack = () => {
    window.history.back()
  }

  const handleFollowUser = () => {
    if (user) {
      setUser({
        ...user,
        isFollowing: !user.isFollowing,
        followers: user.isFollowing ? user.followers - 1 : user.followers + 1,
      })
    }
  }

  const handleFollowLookbook = (lookbookId: string) => {
    if (user) {
      setUser({
        ...user,
        publicLookbooks: user.publicLookbooks.map((lb: any) =>
          lb.id === lookbookId
            ? {
                ...lb,
                isFollowing: !lb.isFollowing,
                followers: lb.isFollowing ? lb.followers - 1 : lb.followers + 1,
              }
            : lb,
        ),
      })
    }
  }

  const handleLookbookClick = (lookbook: any) => {
    window.location.href = `/lookbooks/${lookbook.id}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="animate-pulse">
          <div className="h-48 bg-muted" />
          <div className="p-4 space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">This user doesn't exist or their profile is private.</p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      </div>

      {/* User Profile Header */}
      <UserProfileHeader user={user} onFollowUser={handleFollowUser} />

      {/* Public Lookbooks */}
      <main className="p-4">
        <UserLookbooksGrid
          lookbooks={user.publicLookbooks}
          onLookbookClick={handleLookbookClick}
          onFollowLookbook={handleFollowLookbook}
        />
      </main>

      <BottomNav />
    </div>
  )
}

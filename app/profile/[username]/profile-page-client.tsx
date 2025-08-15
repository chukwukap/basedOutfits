"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BottomNav } from "@/app/_components/bottom-nav";
import { UserProfileHeader } from "@/app/profile/_components/user-profile-header";
import { UserLookbooksGrid } from "@/app/profile/_components/user-lookbooks-grid";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { UserProfile, UserLookbook } from "@/lib/types";

async function fetchUserProfile(username: string) {
  const res = await fetch(`/api/users/${encodeURIComponent(username)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return await res.json();
}

export default function UserProfilePageClient() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchUserProfile(username);
      setUser(data);
      setLoading(false);
    })();
  }, [username]);

  const handleBack = () => {
    window.history.back();
  };

  const handleFollowUser = () => {
    if (user) {
      setUser({
        ...user,
        isFollowing: !user.isFollowing,
        followers: user.isFollowing ? user.followers - 1 : user.followers + 1,
      });
    }
  };

  const handleFollowLookbook = () => {};

  const handleLookbookClick = (lookbook: UserLookbook) => {
    window.location.href = `/lookbooks/${lookbook.id}`;
  };

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
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This user doesn&apos;t exist or their profile is private.
          </p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2"
          >
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
  );
}

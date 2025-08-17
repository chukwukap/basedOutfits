import { Wardrobe } from "./generated/prisma";

// Keep frontend payload simple and decoupled from Prisma model
export type OutfitFetchPayload = {
  id: string;
  caption: string;
  description: string;
  imageUrls: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  tips: number;
  collections: number;
  author: {
    isFollowing: boolean;
    avatarUrl: string;
    fid: string;
    name: string;
  };
};

/**
 * Type representing a user profile as used in the profile page mock data.
 * This is based on the mock data in app/profile/[username]/page.tsx,
 * and aligned with the User model in schema.prisma.
 */
export type UserProfile = {
  username: string;
  name?: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  totalOutfits: number;
  joinedDate: string; // ISO date string
  isFollowing: boolean;
  updatedAt: string;
  publicWardrobes: (Wardrobe & {
    outfitCount: number;
    isFollowing: boolean;
    followers: number;
  })[];
};

export type WardrobeResponse = Wardrobe & {
  outfitCount: number;
  isFollowing: boolean;
  followers: number;
};

// A user-facing outfit structure used in profile pages
export type UserWardrobe = Wardrobe & {
  outfitCount: number;
  isFollowing: boolean;
  followers: number;
};

import { Look, Lookbook } from "./generated/prisma";

export type LookFetchPayload = Look & {
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
  totalLooks: number;
  joinedDate: string; // ISO date string
  isFollowing: boolean;
  updatedAt: string;
  publicLookbooks: (Lookbook & {
    lookCount: number;
    isFollowing: boolean;
    followers: number;
  })[];
};

export type LookbookResponse = Lookbook & {
  lookCount: number;
  isFollowing: boolean;
  followers: number;
};

// A user-facing lookbook structure used in profile pages
export type UserLookbook = Lookbook & {
  lookCount: number;
  isFollowing: boolean;
  followers: number;
};

export interface PostWithRelations {
  id: string;
  content: string;
  mediaUrl: string | null;
  mediaType: string | null;
  mood: string;
  expiresAt: string;
  isEternal: boolean;
  lifespan: number;
  isWhisper: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  };
  _count: {
    comments: number;
    resonances: number;
  };
  resonances: { userId: string; type: string }[];
  bookmarks: { userId: string }[];
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  createdAt: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
  isFollowing?: boolean;
}

export interface NotificationData {
  id: string;
  type: string;
  read: boolean;
  postId: string | null;
  metadata: string | null;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  } | null;
}

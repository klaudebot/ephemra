"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Calendar, Users, Sparkles, Loader2 } from "lucide-react";
import PostCard from "@/components/posts/PostCard";
import type { PostWithRelations, UserProfile } from "@/types";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data: session } = useSession();
  const userId = (session?.user as Record<string, unknown>)?.id as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [filter, setFilter] = useState<"active" | "eternal">("active");
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/users/${username}`).then((r) => r.json()),
      fetch(`/api/users/${username}/posts?filter=${filter}`).then((r) => r.json()),
    ]).then(([userData, postsData]) => {
      setUser(userData);
      setPosts(postsData.posts || []);
      setLoading(false);
    });
  }, [username, filter]);

  const isOwnProfile = user?.id === userId;

  const handleFollow = async () => {
    if (!user || followLoading) return;
    setFollowLoading(true);

    try {
      const res = await fetch(`/api/users/${user.id}/follow`, { method: "POST" });
      const data = await res.json();
      setUser({
        ...user,
        isFollowing: data.following,
        _count: {
          ...user._count,
          followers: user._count.followers + (data.following ? 1 : -1),
        },
      });
    } catch {
      toast.error("Failed to follow");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-surface-300">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Cover & Avatar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative mb-16"
      >
        <div className="h-40 rounded-2xl gradient-brand opacity-50" />
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-2xl gradient-brand flex items-center justify-center text-white text-3xl font-bold border-4 border-surface-900">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </motion.div>

      {/* Info */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.displayName}</h1>
          <p className="text-surface-300 text-sm">@{user.username}</p>
          {user.bio && <p className="text-surface-200 mt-2 text-sm">{user.bio}</p>}
          <div className="flex items-center gap-4 mt-3 text-sm text-surface-300">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <strong className="text-white">{user._count.followers}</strong> followers
            </span>
            <span>
              <strong className="text-white">{user._count.following}</strong> following
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        {!isOwnProfile && (
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className={cn(
              "rounded-xl px-5 py-2 text-sm font-medium transition-all",
              user.isFollowing
                ? "glass text-surface-300 hover:text-red-400 hover:border-red-500/50"
                : "btn-primary"
            )}
          >
            {user.isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-3">
        {(["active", "eternal"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "text-sm px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5",
              filter === f
                ? "gradient-brand text-white"
                : "text-surface-300 hover:text-white"
            )}
          >
            {f === "eternal" && <Sparkles className="w-3.5 h-3.5" />}
            {f === "active" ? "Active" : "Eternal"}
          </button>
        ))}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-surface-300">
            {filter === "eternal" ? "No eternal posts yet" : "No active moments"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpdate={(updated) =>
                setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
              }
              onDelete={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MOODS } from "@/lib/constants";
import { cn, getMoodBg } from "@/lib/utils";
import ComposePost from "@/components/posts/ComposePost";
import PostCard from "@/components/posts/PostCard";
import type { PostWithRelations } from "@/types";
import { Loader2 } from "lucide-react";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "following", label: "Following" },
  { value: "eternal", label: "Eternal" },
  { value: "whispers", label: "Whispers" },
];

export default function FeedPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") || "all";

  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState(initialFilter);
  const [mood, setMood] = useState("all");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (reset = false) => {
    const isInitial = reset;
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams();
      params.set("filter", filter);
      if (mood !== "all") params.set("mood", mood);
      if (!reset && cursor) params.set("cursor", cursor);

      const res = await fetch(`/api/posts?${params}`);
      const data = await res.json();

      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch {
      console.error("Failed to fetch posts");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filter, mood, cursor]);

  useEffect(() => {
    setCursor(null);
    fetchPosts(true);
  }, [filter, mood]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNewPost = (post: PostWithRelations) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handleUpdatePost = (updated: PostWithRelations) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Feed</h1>
        <p className="text-surface-300 text-sm">Living moments from your world</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "text-sm px-4 py-1.5 rounded-full whitespace-nowrap transition-all",
              filter === f.value
                ? "gradient-brand text-white"
                : "glass text-surface-300 hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Mood filter */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setMood("all")}
          className={cn(
            "text-xs px-2.5 py-1 rounded-full border transition-all whitespace-nowrap",
            mood === "all"
              ? "gradient-brand text-white border-transparent"
              : "border-surface-700 text-surface-300 hover:border-surface-300"
          )}
        >
          All vibes
        </button>
        {MOODS.map((m) => (
          <button
            key={m.value}
            onClick={() => setMood(m.value)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full border transition-all whitespace-nowrap",
              mood === m.value
                ? getMoodBg(m.value) + " text-white"
                : "border-surface-700 text-surface-300 hover:border-surface-300"
            )}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      {/* Compose */}
      <div className="mb-6">
        <ComposePost onPost={handleNewPost} />
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-surface-300 text-lg mb-2">No moments yet</p>
          <p className="text-surface-300/50 text-sm">Be the first to share something</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onUpdate={handleUpdatePost}
                onDelete={handleDeletePost}
              />
            ))}
          </AnimatePresence>

          {hasMore && (
            <button
              onClick={() => fetchPosts(false)}
              disabled={loadingMore}
              className="w-full py-3 text-center text-sm text-surface-300 hover:text-white transition"
            >
              {loadingMore ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                "Load more moments"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

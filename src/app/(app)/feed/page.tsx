"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { MOODS } from "@/lib/constants";
import { cn, getMoodEmoji } from "@/lib/utils";
import ComposePost from "@/components/posts/ComposePost";
import PostCard from "@/components/posts/PostCard";
import type { PostWithRelations } from "@/types";
import { Loader2 } from "lucide-react";

const FILTERS = [
  { value: "all", label: "For you" },
  { value: "following", label: "Following" },
  { value: "eternal", label: "Eternal" },
  { value: "whispers", label: "Whispers" },
];

export default function FeedPage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState(searchParams.get("filter") || "all");
  const [mood, setMood] = useState("all");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (reset = false) => {
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const p = new URLSearchParams();
      p.set("filter", filter);
      if (mood !== "all") p.set("mood", mood);
      if (!reset && cursor) p.set("cursor", cursor);
      const res = await fetch(`/api/posts?${p}`);
      const data = await res.json();
      if (reset) setPosts(data.posts); else setPosts(prev => [...prev, ...data.posts]);
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch {} finally { setLoading(false); setLoadingMore(false); }
  }, [filter, mood, cursor]);

  useEffect(() => { setCursor(null); fetchPosts(true); }, [filter, mood]); // eslint-disable-line

  return (
    <div className="max-w-[600px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-bg-primary/80 backdrop-blur-sm border-b border-border-primary">
        <div className="flex overflow-x-auto scrollbar-hide">
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={cn("flex-1 min-w-0 py-3 text-sm font-medium text-center border-b-2 transition-colors whitespace-nowrap px-4",
                filter === f.value ? "border-text-primary text-text-primary" : "border-transparent text-text-tertiary hover:text-text-secondary"
              )}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Mood filter */}
        <div className="flex gap-1 px-4 py-2 overflow-x-auto scrollbar-hide border-b border-border-primary">
          <button onClick={() => setMood("all")}
            className={cn("text-xs px-3 py-1 rounded-md whitespace-nowrap transition-colors", mood === "all" ? "bg-text-primary text-bg-primary font-semibold" : "text-text-tertiary hover:text-text-secondary")}>
            All
          </button>
          {MOODS.map(m => (
            <button key={m.value} onClick={() => setMood(m.value)}
              className={cn("text-xs px-3 py-1 rounded-md whitespace-nowrap transition-colors", mood === m.value ? "bg-text-primary text-bg-primary font-semibold" : "text-text-tertiary hover:text-text-secondary")}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compose */}
      <ComposePost onPost={post => setPosts(prev => [post, ...prev])} />

      <div className="divider" />

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-text-tertiary" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16"><p className="text-text-tertiary text-sm">Nothing here yet</p></div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard key={post.id} post={post}
              onUpdate={u => setPosts(prev => prev.map(p => p.id === u.id ? u : p))}
              onDelete={id => setPosts(prev => prev.filter(p => p.id !== id))} />
          ))}
          {hasMore && (
            <button onClick={() => fetchPosts(false)} disabled={loadingMore} className="w-full py-4 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
              {loadingMore ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Load more"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

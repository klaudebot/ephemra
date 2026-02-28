"use client";

import { useEffect, useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import PostCard from "@/components/posts/PostCard";
import type { PostWithRelations } from "@/types";

export default function BookmarksPage() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Bookmark className="w-6 h-6 text-brand-400" />
        <h1 className="text-2xl font-bold">Bookmarks</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="w-12 h-12 text-surface-700 mx-auto mb-3" />
          <p className="text-surface-300">No bookmarks yet</p>
          <p className="text-surface-300/50 text-sm mt-1">
            Save moments you want to revisit
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

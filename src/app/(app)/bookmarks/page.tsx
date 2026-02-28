"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PostCard from "@/components/posts/PostCard";
import type { PostWithRelations } from "@/types";

export default function BookmarksPage() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/bookmarks").then(r => r.json()).then(d => { setPosts(d.posts || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-text-tertiary" /></div>;

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="px-4 py-4 border-b border-border-primary">
        <h1 className="text-lg font-bold">Saved</h1>
      </div>
      {posts.length === 0 ? (
        <p className="text-center py-16 text-text-tertiary text-sm">No saved posts</p>
      ) : (
        posts.map(p => (
          <PostCard key={p.id} post={p}
            onUpdate={u => setPosts(prev => prev.map(x => x.id === u.id ? u : x))}
            onDelete={id => setPosts(prev => prev.filter(x => x.id !== id))} />
        ))
      )}
    </div>
  );
}

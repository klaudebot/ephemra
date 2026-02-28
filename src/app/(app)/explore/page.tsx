"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, TrendingUp, Loader2 } from "lucide-react";
import PostCard from "@/components/posts/PostCard";
import type { PostWithRelations } from "@/types";
import { getMoodEmoji } from "@/lib/utils";
import Link from "next/link";

interface TrendingData {
  posts: PostWithRelations[];
  moodDistribution: { mood: string; _count: number }[];
  suggestedUsers: { id: string; username: string; displayName: string; avatar: string | null; bio: string | null; _count: { followers: number } }[];
}

interface SearchResults {
  users: { id: string; username: string; displayName: string; avatar: string | null; bio: string | null; _count: { followers: number } }[];
  posts: PostWithRelations[];
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"trending" | "search">("trending");
  const [trending, setTrending] = useState<TrendingData | null>(null);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => { fetch("/api/trending").then(r => r.json()).then(d => { setTrending(d); setLoading(false); }); }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); setMode("trending"); return; }
    setSearching(true); setMode("search");
    try { const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`); setResults(await r.json()); } catch {} finally { setSearching(false); }
  }, []);

  useEffect(() => { const t = setTimeout(() => search(query), 300); return () => clearTimeout(t); }, [query, search]);

  return (
    <div className="max-w-[600px] mx-auto border-x border-border-primary min-h-screen">
      <div className="sticky top-0 z-20 bg-bg-primary px-4 py-3 border-b border-border-primary">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" className="input-field w-full !pl-10 !rounded-lg !bg-bg-elevated !border-0" />
        </div>
      </div>

      {mode === "search" && results && (
        <div>
          {results.users.length > 0 && (
            <div className="border-b border-border-primary">
              {results.users.map(u => (
                <Link key={u.id} href={`/profile/${u.username}`} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-secondary transition-colors">
                  <div className="w-10 h-10 avatar text-sm">{u.displayName.charAt(0).toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{u.username}</p>
                    <p className="text-xs text-text-tertiary">{u.displayName}{u.bio ? ` · ${u.bio}` : ""}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {results.posts.map(p => <PostCard key={p.id} post={p} />)}
          {searching && <div className="flex justify-center py-8"><Loader2 className="w-4 h-4 animate-spin text-text-tertiary" /></div>}
          {!searching && !results.users.length && !results.posts.length && (
            <p className="text-center py-16 text-text-tertiary text-sm">No results</p>
          )}
        </div>
      )}

      {mode === "trending" && (
        loading ? <div className="flex justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-text-tertiary" /></div> :
        trending && (
          <div>
            {/* Suggested */}
            {trending.suggestedUsers.length > 0 && (
              <div className="border-b border-border-primary py-4">
                <p className="text-sm font-semibold px-4 mb-3">Suggested for you</p>
                <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
                  {trending.suggestedUsers.map(u => (
                    <Link key={u.id} href={`/profile/${u.username}`} className="flex flex-col items-center gap-1.5 min-w-[80px]">
                      <div className="w-14 h-14 avatar text-lg">{u.displayName.charAt(0).toUpperCase()}</div>
                      <span className="text-xs font-medium truncate max-w-[80px]">{u.username}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Moods */}
            {trending.moodDistribution.length > 0 && (
              <div className="px-4 py-3 border-b border-border-primary flex items-center gap-3 overflow-x-auto scrollbar-hide">
                <TrendingUp className="w-4 h-4 text-text-tertiary shrink-0" />
                {trending.moodDistribution.map(m => (
                  <span key={m.mood} className="text-xs text-text-secondary whitespace-nowrap">
                    {getMoodEmoji(m.mood)} {m.mood} <span className="text-text-tertiary">({m._count})</span>
                  </span>
                ))}
              </div>
            )}

            {trending.posts.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        )
      )}
    </div>
  );
}

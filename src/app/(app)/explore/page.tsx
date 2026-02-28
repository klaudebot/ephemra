"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Users, Sparkles, Loader2, Hash } from "lucide-react";
import PostCard from "@/components/posts/PostCard";
import type { PostWithRelations } from "@/types";
import { cn, getMoodEmoji } from "@/lib/utils";
import Link from "next/link";

interface TrendingData {
  posts: PostWithRelations[];
  moodDistribution: { mood: string; _count: number }[];
  suggestedUsers: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    bio: string | null;
    _count: { followers: number };
  }[];
}

interface SearchResults {
  users: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    bio: string | null;
    _count: { followers: number };
  }[];
  posts: PostWithRelations[];
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"trending" | "search">("trending");
  const [trending, setTrending] = useState<TrendingData | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch("/api/trending")
      .then((r) => r.json())
      .then((data) => {
        setTrending(data);
        setLoading(false);
      });
  }, []);

  const handleSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSearchResults(null);
      setActiveTab("trending");
      return;
    }

    setSearching(true);
    setActiveTab("search");

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch {
      console.error("Search failed");
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Explore</h1>
        <p className="text-surface-300 text-sm">Discover trending moments and new people</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people and posts..."
          className="input-dark w-full !pl-12"
        />
      </div>

      {/* Search Results */}
      {activeTab === "search" && searchResults && (
        <div className="space-y-6">
          {/* Users */}
          {searchResults.users.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-surface-300 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> People
              </h2>
              <div className="space-y-2">
                {searchResults.users.map((user) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.username}`}
                    className="glass rounded-xl p-4 flex items-center gap-3 hover-lift block"
                  >
                    <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{user.displayName}</p>
                      <p className="text-xs text-surface-300">@{user.username}</p>
                    </div>
                    <span className="text-xs text-surface-300">
                      {user._count.followers} followers
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {searchResults.posts.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-surface-300 mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" /> Posts
              </h2>
              <div className="space-y-4">
                {searchResults.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {searching && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-brand-400" />
            </div>
          )}

          {!searching && searchResults.users.length === 0 && searchResults.posts.length === 0 && (
            <div className="text-center py-12 text-surface-300">
              <p>No results found for &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      )}

      {/* Trending */}
      {activeTab === "trending" && (
        <>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
            </div>
          ) : trending && (
            <div className="space-y-8">
              {/* Mood Distribution */}
              {trending.moodDistribution.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-surface-300 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Trending Moods
                  </h2>
                  <div className="glass rounded-xl p-4">
                    <div className="flex flex-wrap gap-3">
                      {trending.moodDistribution.map((item) => (
                        <div
                          key={item.mood}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="text-lg">{getMoodEmoji(item.mood)}</span>
                          <span className="capitalize">{item.mood}</span>
                          <span className="text-xs text-surface-300 bg-surface-800 px-2 py-0.5 rounded-full">
                            {item._count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Users */}
              {trending.suggestedUsers.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-surface-300 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" /> People to Follow
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {trending.suggestedUsers.map((user, i) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={`/profile/${user.username}`}
                          className="glass rounded-xl p-4 block hover-lift"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
                              {user.displayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{user.displayName}</p>
                              <p className="text-xs text-surface-300">@{user.username}</p>
                            </div>
                          </div>
                          {user.bio && (
                            <p className="text-xs text-surface-300 line-clamp-2">{user.bio}</p>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Posts */}
              {trending.posts.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-surface-300 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Trending Moments
                  </h2>
                  <div className="space-y-4">
                    {trending.posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

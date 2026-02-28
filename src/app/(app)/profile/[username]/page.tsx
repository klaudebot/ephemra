"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Calendar, Star, Loader2, MessageSquare, Grid3X3 } from "lucide-react";
import PostCard from "@/components/posts/PostCard";
import type { PostWithRelations, UserProfile } from "@/types";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data: session } = useSession();
  const userId = (session?.user as Record<string, unknown>)?.id as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [tab, setTab] = useState<"active" | "eternal">("active");
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/users/${username}`).then(r => r.json()),
      fetch(`/api/users/${username}/posts?filter=${tab}`).then(r => r.json()),
    ]).then(([u, p]) => { setUser(u); setPosts(p.posts || []); setLoading(false); });
  }, [username, tab]);

  const isOwn = user?.id === userId;

  const handleFollow = async () => {
    if (!user || followLoading) return;
    setFollowLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}/follow`, { method: "POST" });
      const d = await res.json();
      setUser({ ...user, isFollowing: d.following, _count: { ...user._count, followers: user._count.followers + (d.following ? 1 : -1) } });
    } catch { toast.error("Failed"); }
    finally { setFollowLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-text-tertiary" /></div>;
  if (!user) return <div className="text-center py-20 text-text-tertiary">User not found</div>;

  return (
    <div className="max-w-[600px] mx-auto">
      {/* Profile header */}
      <div className="px-6 py-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 avatar text-2xl shrink-0">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-lg font-semibold">{user.username}</h1>
              {!isOwn && (
                <div className="flex items-center gap-2">
                  <button onClick={handleFollow} disabled={followLoading}
                    className={cn("text-sm font-semibold rounded-lg px-5 py-1.5 transition-colors",
                      user.isFollowing ? "bg-bg-elevated text-text-primary hover:bg-border-hover" : "bg-accent text-white hover:bg-accent-hover"
                    )}>
                    {user.isFollowing ? "Following" : "Follow"}
                  </button>
                  <Link href={`/messages/${user.id}`} className="bg-bg-elevated rounded-lg p-1.5 hover:bg-border-hover transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-5 text-sm mt-2">
              <span><strong>{user._count.posts}</strong> <span className="text-text-secondary">posts</span></span>
              <span><strong>{user._count.followers}</strong> <span className="text-text-secondary">followers</span></span>
              <span><strong>{user._count.following}</strong> <span className="text-text-secondary">following</span></span>
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold">{user.displayName}</p>
              {user.bio && <p className="text-sm text-text-secondary mt-0.5">{user.bio}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-border-primary">
        <button onClick={() => setTab("active")}
          className={cn("flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b transition-colors",
            tab === "active" ? "border-text-primary text-text-primary" : "border-transparent text-text-tertiary")}>
          <Grid3X3 className="w-3.5 h-3.5" /> Posts
        </button>
        <button onClick={() => setTab("eternal")}
          className={cn("flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b transition-colors",
            tab === "eternal" ? "border-text-primary text-text-primary" : "border-transparent text-text-tertiary")}>
          <Star className="w-3.5 h-3.5" /> Eternal
        </button>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-16 text-text-tertiary text-sm">
          {tab === "eternal" ? "No eternal posts" : "No posts yet"}
        </div>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} post={post}
            onUpdate={u => setPosts(prev => prev.map(p => p.id === u.id ? u : p))}
            onDelete={id => setPosts(prev => prev.filter(p => p.id !== id))} />
        ))
      )}
    </div>
  );
}

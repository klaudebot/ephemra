"use client";

import { useState } from "react";
import {
  Heart, MessageCircle, Bookmark, MoreHorizontal,
  Trash2, Clock, Star, Eye,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatTimeRemaining, getLifePercentage, getLifeColor, getMoodEmoji, timeAgo } from "@/lib/utils";
import { ETERNAL_THRESHOLD } from "@/lib/constants";
import type { PostWithRelations } from "@/types";
import toast from "react-hot-toast";
import CommentSection from "./CommentSection";

interface Props {
  post: PostWithRelations;
  onUpdate?: (post: PostWithRelations) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onUpdate, onDelete }: Props) {
  const { data: session } = useSession();
  const userId = (session?.user as Record<string, unknown>)?.id as string;
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [busy, setBusy] = useState(false);

  const liked = post.resonances?.some((r) => r.userId === userId);
  const saved = post.bookmarks?.some((b) => b.userId === userId);
  const isOwner = post.authorId === userId;
  const lifePct = post.isEternal ? 100 : getLifePercentage(post.createdAt, post.expiresAt);
  const lifeColor = post.isEternal ? "#0095f6" : getLifeColor(lifePct);
  const timeLeft = post.isEternal ? "Eternal" : formatTimeRemaining(post.expiresAt);
  const isAnon = post.isWhisper && post.author.id === "anonymous";

  const handleResonate = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/resonate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "resonate" }),
      });
      const data = await res.json();
      if (data.isEternal) toast.success("This post is now Eternal!");
      if (onUpdate) {
        onUpdate({
          ...post,
          resonances: data.resonated
            ? [...(post.resonances || []), { userId, type: "resonate" }]
            : (post.resonances || []).filter((r) => r.userId !== userId),
          isEternal: data.isEternal || post.isEternal,
          _count: { ...post._count, resonances: post._count.resonances + (data.resonated ? 1 : -1) },
        });
      }
    } catch { toast.error("Failed"); }
    finally { setBusy(false); }
  };

  const handleBookmark = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}/bookmark`, { method: "POST" });
      const data = await res.json();
      onUpdate?.({ ...post, bookmarks: data.bookmarked ? [{ userId }] : [] });
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      onDelete?.(post.id);
    } catch { toast.error("Failed"); }
  };

  return (
    <article className="border-b border-border-primary">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-1">
        <Link href={isAnon ? "#" : `/profile/${post.author.username}`} className="shrink-0">
          <div className="w-8 h-8 avatar text-xs">
            {isAnon ? <Eye className="w-4 h-4 text-text-tertiary" /> :
              post.author.avatar ? <Image src={post.author.avatar} alt="" fill className="object-cover" /> :
              post.author.displayName.charAt(0).toUpperCase()}
          </div>
        </Link>

        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <Link href={isAnon ? "#" : `/profile/${post.author.username}`} className="text-[13px] font-semibold hover:underline truncate">
            {isAnon ? "Anonymous" : post.author.username}
          </Link>
          {post.isEternal && <Star className="w-3.5 h-3.5 text-accent fill-accent" />}
          <span className="text-text-tertiary text-xs">· {timeAgo(post.createdAt)}</span>
        </div>

        <span className="text-[11px] text-text-tertiary flex items-center gap-1">
          <Clock className="w-3 h-3" />{timeLeft}
        </span>

        {isOwner && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="text-text-tertiary hover:text-text-primary p-1">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-bg-elevated border border-border-secondary rounded-lg py-1 w-32 z-10 shadow-lg">
                <button onClick={handleDelete} className="flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-bg-tertiary w-full">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        <Link href={`/post/${post.id}`}>
          <p className="text-[14px] leading-[1.5] whitespace-pre-wrap">{post.content}</p>
        </Link>
      </div>

      {/* Media */}
      {post.mediaUrl && (
        <div className="relative aspect-video bg-bg-tertiary">
          {post.mediaType === "video" ? (
            <video src={post.mediaUrl} controls className="w-full h-full object-cover" />
          ) : (
            <Image src={post.mediaUrl} alt="" fill className="object-cover" sizes="600px" />
          )}
        </div>
      )}

      {/* Mood + Life bar */}
      <div className="px-4 py-1.5 flex items-center gap-2">
        <span className="text-[11px] text-text-tertiary">{getMoodEmoji(post.mood)} {post.mood}</span>
        {!post.isEternal && (
          <div className="flex-1 h-[2px] bg-border-primary rounded-full overflow-hidden">
            <div className="life-bar h-full" style={{ backgroundColor: lifeColor, width: `${lifePct}%` }} />
          </div>
        )}
        {post.isEternal && <div className="flex-1 h-[2px] bg-accent/30 rounded-full" />}
      </div>

      {/* Actions */}
      <div className="flex items-center px-4 py-2">
        <div className="flex items-center gap-5">
          <button onClick={handleResonate} className="flex items-center gap-1.5 group">
            <Heart className={cn("w-[22px] h-[22px] transition-colors", liked ? "text-danger fill-danger" : "text-text-secondary group-hover:text-text-primary")} />
            {post._count.resonances > 0 && <span className="text-xs text-text-secondary">{post._count.resonances}</span>}
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 group">
            <MessageCircle className="w-[22px] h-[22px] text-text-secondary group-hover:text-text-primary transition-colors" />
            {post._count.comments > 0 && <span className="text-xs text-text-secondary">{post._count.comments}</span>}
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {!post.isEternal && post._count.resonances > 0 && post._count.resonances < ETERNAL_THRESHOLD && (
            <span className="text-[10px] text-text-tertiary">{ETERNAL_THRESHOLD - post._count.resonances} to eternal</span>
          )}
          <button onClick={handleBookmark}>
            <Bookmark className={cn("w-[22px] h-[22px] transition-colors", saved ? "text-text-primary fill-text-primary" : "text-text-secondary hover:text-text-primary")} />
          </button>
        </div>
      </div>

      {showComments && <CommentSection postId={post.id} />}
    </article>
  );
}

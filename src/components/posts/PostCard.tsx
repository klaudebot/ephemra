"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Sparkles,
  Clock,
  Trash2,
  Ghost,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatTimeRemaining, getLifePercentage, getMoodEmoji, getMoodBg, timeAgo } from "@/lib/utils";
import type { PostWithRelations } from "@/types";
import { ETERNAL_THRESHOLD } from "@/lib/constants";
import toast from "react-hot-toast";
import CommentSection from "./CommentSection";

interface PostCardProps {
  post: PostWithRelations;
  onUpdate?: (post: PostWithRelations) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onUpdate, onDelete }: PostCardProps) {
  const { data: session } = useSession();
  const userId = (session?.user as Record<string, unknown>)?.id as string;
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isResonating, setIsResonating] = useState(false);

  const hasResonated = post.resonances?.some((r) => r.userId === userId);
  const isBookmarked = post.bookmarks?.some((b) => b.userId === userId);
  const isOwner = post.authorId === userId;
  const lifePercent = post.isEternal ? 100 : getLifePercentage(post.createdAt, post.expiresAt);
  const timeLeft = post.isEternal ? "Eternal" : formatTimeRemaining(post.expiresAt);

  const getLifeColor = () => {
    if (post.isEternal) return "#a78bfa";
    if (lifePercent > 60) return "#7c3aed";
    if (lifePercent > 30) return "#f59e0b";
    return "#ef4444";
  };

  const handleResonate = async () => {
    if (isResonating) return;
    setIsResonating(true);

    try {
      const res = await fetch(`/api/posts/${post.id}/resonate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "resonate" }),
      });
      const data = await res.json();

      if (data.isEternal) {
        toast.success("This post has become Eternal! ✨");
      }

      // Optimistic update
      if (onUpdate) {
        const newResonances = data.resonated
          ? [...(post.resonances || []), { userId, type: "resonate" }]
          : (post.resonances || []).filter((r) => r.userId !== userId);
        onUpdate({
          ...post,
          resonances: newResonances,
          isEternal: data.isEternal || post.isEternal,
          _count: {
            ...post._count,
            resonances: post._count.resonances + (data.resonated ? 1 : -1),
          },
        });
      }
    } catch {
      toast.error("Failed to resonate");
    } finally {
      setIsResonating(false);
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}/bookmark`, { method: "POST" });
      const data = await res.json();

      if (onUpdate) {
        onUpdate({
          ...post,
          bookmarks: data.bookmarked ? [{ userId }] : [],
        });
      }
    } catch {
      toast.error("Failed to bookmark");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      onDelete?.(post.id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass rounded-2xl p-5 hover-lift"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Life ring avatar */}
        <Link href={post.isWhisper && post.author.id === "anonymous" ? "#" : `/profile/${post.author.username}`}>
          <div className="relative w-11 h-11">
            <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22" cy="22" r="20"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
              />
              <circle
                cx="22" cy="22" r="20"
                fill="none"
                stroke={getLifeColor()}
                strokeWidth="2"
                strokeDasharray={`${(lifePercent / 100) * 125.6} 125.6`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-1 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-xs overflow-hidden">
              {post.isWhisper && post.author.id === "anonymous" ? (
                <Ghost className="w-4 h-4" />
              ) : post.author.avatar ? (
                <Image src={post.author.avatar} alt="" fill className="object-cover" />
              ) : (
                post.author.displayName.charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={post.isWhisper && post.author.id === "anonymous" ? "#" : `/profile/${post.author.username}`}
              className="font-medium text-sm hover:underline"
            >
              {post.author.displayName}
            </Link>
            {post.isWhisper && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-surface-700 text-surface-300">
                whisper
              </span>
            )}
            {post.isEternal && (
              <Sparkles className="w-4 h-4 text-brand-400" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-300">
            <span>{timeAgo(post.createdAt)}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Mood tag */}
        <span className={cn("text-xs px-2 py-1 rounded-full border", getMoodBg(post.mood))}>
          {getMoodEmoji(post.mood)} {post.mood}
        </span>

        {/* Menu */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-surface-300 hover:text-white p-1"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 glass-strong rounded-xl py-2 w-36 z-10">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 w-full"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={`/post/${post.id}`} className="block">
        <p className="text-surface-200 leading-relaxed mb-3 whitespace-pre-wrap hover:text-white transition-colors">{post.content}</p>
      </Link>

      {/* Media */}
      {post.mediaUrl && (
        <div className="rounded-xl overflow-hidden mb-3 relative aspect-video bg-surface-800">
          {post.mediaType === "video" ? (
            <video src={post.mediaUrl} controls className="w-full h-full object-cover" />
          ) : (
            <Image
              src={post.mediaUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          )}
        </div>
      )}

      {/* Life bar */}
      {!post.isEternal && (
        <div className="h-1 bg-surface-700 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full transition-colors duration-500"
            style={{ backgroundColor: getLifeColor(), width: `${lifePercent}%` }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleResonate}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
            hasResonated
              ? "text-brand-400 bg-brand-500/10"
              : "text-surface-300 hover:text-brand-400 hover:bg-brand-500/5"
          )}
        >
          <Heart className={cn("w-4 h-4", hasResonated && "fill-current")} />
          <span>{post._count.resonances}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post._count.comments}</span>
        </button>

        <button
          onClick={handleBookmark}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ml-auto",
            isBookmarked
              ? "text-yellow-400 bg-yellow-500/10"
              : "text-surface-300 hover:text-yellow-400 hover:bg-yellow-500/5"
          )}
        >
          <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
        </button>
      </div>

      {/* Eternal progress hint */}
      {!post.isEternal && post._count.resonances > 0 && post._count.resonances < ETERNAL_THRESHOLD && (
        <div className="text-xs text-surface-300/50 mt-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {ETERNAL_THRESHOLD - post._count.resonances} more resonances to become Eternal
        </div>
      )}

      {/* Comments */}
      {showComments && (
        <CommentSection postId={post.id} />
      )}
    </motion.div>
  );
}

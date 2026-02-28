"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  };
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then((r) => r.json())
      .then((data) => {
        setComments(data.comments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error();
      const comment = await res.json();
      setComments([comment, ...comments]);
      setContent("");
      toast.success("Comment added! +15 min life");
    } catch {
      toast.error("Failed to comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/5">
      {/* Comment input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="input-dark flex-1 !py-2 text-sm"
          maxLength={280}
        />
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="btn-primary !p-2 !rounded-xl"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-4 text-surface-300 text-sm">Loading...</div>
      ) : comments.length === 0 ? (
        <p className="text-center py-4 text-surface-300 text-sm">
          No comments yet. Be the first to engage!
        </p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                {comment.author.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/profile/${comment.author.username}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {comment.author.displayName}
                  </Link>
                  <span className="text-xs text-surface-300">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-surface-200">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

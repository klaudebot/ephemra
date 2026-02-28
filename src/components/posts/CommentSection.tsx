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
  author: { id: string; username: string; displayName: string; avatar: string | null };
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${postId}`).then(r => r.json()).then(d => { setComments(d.comments || []); setLoading(false); }).catch(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
      if (!res.ok) throw new Error();
      const comment = await res.json();
      setComments([comment, ...comments]);
      setContent("");
    } catch { toast.error("Failed"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="px-4 pb-3 border-t border-border-primary">
      <form onSubmit={handleSubmit} className="flex gap-2 py-2">
        <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none" maxLength={280} />
        <button type="submit" disabled={!content.trim() || submitting} className="text-accent text-sm font-semibold disabled:opacity-40">
          Post
        </button>
      </form>

      {loading ? <p className="text-xs text-text-tertiary py-2">Loading...</p> :
        comments.length === 0 ? <p className="text-xs text-text-tertiary py-2">No comments yet</p> :
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
          {comments.map(c => (
            <div key={c.id} className="flex gap-2">
              <div className="w-6 h-6 avatar text-[10px] shrink-0">{c.author.displayName.charAt(0).toUpperCase()}</div>
              <div className="min-w-0">
                <p className="text-sm">
                  <Link href={`/profile/${c.author.username}`} className="font-semibold hover:underline">{c.author.username}</Link>{" "}
                  <span className="text-text-secondary">{c.content}</span>
                </p>
                <span className="text-[11px] text-text-tertiary">{timeAgo(c.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}

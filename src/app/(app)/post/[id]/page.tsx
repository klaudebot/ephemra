"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Clock } from "lucide-react";
import Link from "next/link";
import PostCard from "@/components/posts/PostCard";
import type { PostWithRelations } from "@/types";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`).then(r => {
      if (r.status === 410) { setError("This post has faded"); setLoading(false); return null; }
      if (!r.ok) throw new Error();
      return r.json();
    }).then(d => { if (d) setPost(d); setLoading(false); }).catch(() => { setError("Not found"); setLoading(false); });
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-text-tertiary" /></div>;

  if (error) return (
    <div className="max-w-[600px] mx-auto border-x border-border-primary min-h-screen text-center py-20">
      <Clock className="w-8 h-8 text-text-tertiary mx-auto mb-3" />
      <p className="text-sm text-text-secondary mb-4">{error}</p>
      <Link href="/feed" className="text-accent text-sm font-semibold">Back to feed</Link>
    </div>
  );

  return (
    <div className="max-w-[600px] mx-auto border-x border-border-primary min-h-screen">
      <div className="px-4 py-3 border-b border-border-primary flex items-center gap-3">
        <Link href="/feed" className="text-text-secondary hover:text-text-primary"><ArrowLeft className="w-5 h-5" /></Link>
        <span className="text-[16px] font-bold">Post</span>
      </div>
      {post && <PostCard post={post} onUpdate={setPost} onDelete={() => window.history.back()} />}
    </div>
  );
}

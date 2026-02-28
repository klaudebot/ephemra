"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import PostCard from "@/components/posts/PostCard";
import type { PostWithRelations } from "@/types";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => {
        if (r.status === 410) {
          setError("This moment has faded away");
          setLoading(false);
          return null;
        }
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (data) setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Post not found");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="glass rounded-2xl p-12">
          <Clock className="w-12 h-12 text-surface-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{error}</h2>
          <p className="text-surface-300 text-sm mb-6">
            Posts on Ephemra have a lifespan. This one has expired.
          </p>
          <Link href="/feed" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-surface-300 hover:text-white transition mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to feed
      </Link>

      {post && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PostCard
            post={post}
            onUpdate={setPost}
            onDelete={() => window.history.back()}
          />

          {/* Post stats */}
          <div className="glass rounded-xl p-4 mt-4">
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-lg font-bold">{post._count.resonances}</p>
                <p className="text-xs text-surface-300">Resonances</p>
              </div>
              <div className="w-px h-8 bg-surface-700" />
              <div>
                <p className="text-lg font-bold">{post._count.comments}</p>
                <p className="text-xs text-surface-300">Comments</p>
              </div>
              <div className="w-px h-8 bg-surface-700" />
              <div className="flex items-center gap-1">
                {post.isEternal ? (
                  <>
                    <Sparkles className="w-4 h-4 text-brand-400" />
                    <p className="text-sm font-medium text-brand-400">Eternal</p>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-surface-300" />
                    <p className="text-sm text-surface-300">Ticking</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, X, Eye } from "lucide-react";
import { MOODS, MAX_POST_LENGTH } from "@/lib/constants";
import { cn, getMoodEmoji } from "@/lib/utils";
import toast from "react-hot-toast";
import type { PostWithRelations } from "@/types";

export default function ComposePost({ onPost }: { onPost: (post: PostWithRelations) => void }) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [isWhisper, setIsWhisper] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Max 10MB"); return; }
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      let mediaUrl = null, mediaType = null;
      if (mediaFile) {
        const fd = new FormData();
        fd.append("file", mediaFile);
        const up = await fetch("/api/upload", { method: "POST", body: fd });
        if (!up.ok) { toast.error("Upload failed"); setLoading(false); return; }
        const d = await up.json();
        mediaUrl = d.url; mediaType = d.mediaType;
      }
      const res = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, mood, isWhisper, mediaUrl, mediaType }) });
      if (!res.ok) throw new Error();
      const post = await res.json();
      onPost(post);
      setContent(""); setMood("neutral"); setIsWhisper(false); setMediaFile(null); setMediaPreview(null); setExpanded(false);
      toast.success("Posted — 6h of life");
    } catch { toast.error("Failed to post"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="px-4 py-3">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="What's on your mind?"
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary resize-none outline-none leading-relaxed"
          maxLength={MAX_POST_LENGTH}
          rows={expanded ? 3 : 1}
        />

        {mediaPreview && (
          <div className="relative mt-2 inline-block">
            <img src={mediaPreview} alt="" className="rounded-lg max-h-40 object-cover" />
            <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        )}

        {expanded && (
          <>
            <div className="flex flex-wrap gap-1 mt-3">
              {MOODS.map(m => (
                <button key={m.value} onClick={() => setMood(m.value)}
                  className={cn("text-xs px-2.5 py-1 rounded-md transition-colors", mood === m.value ? "bg-bg-elevated text-text-primary" : "text-text-tertiary hover:text-text-secondary")}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-primary">
              <div className="flex items-center gap-1">
                <input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm" onChange={handleFile} className="hidden" />
                <button onClick={() => fileRef.current?.click()} className="p-2 text-text-secondary hover:text-text-primary rounded-md transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button onClick={() => setIsWhisper(!isWhisper)} className={cn("p-2 rounded-md transition-colors", isWhisper ? "text-accent" : "text-text-secondary hover:text-text-primary")}>
                  <Eye className="w-5 h-5" />
                </button>
                <span className="text-xs text-text-tertiary ml-2">{content.length}/{MAX_POST_LENGTH}</span>
                {isWhisper && <span className="text-xs text-accent ml-2">Anonymous</span>}
              </div>
              <button onClick={submit} disabled={!content.trim() || loading} className="btn-primary !py-2 !px-4 text-xs">
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

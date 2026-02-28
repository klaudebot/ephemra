"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, X, Ghost, Send } from "lucide-react";
import { MOODS, MAX_POST_LENGTH } from "@/lib/constants";
import { cn, getMoodBg } from "@/lib/utils";
import toast from "react-hot-toast";
import type { PostWithRelations } from "@/types";

interface ComposePostProps {
  onPost: (post: PostWithRelations) => void;
}

export default function ComposePost({ onPost }: ComposePostProps) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [isWhisper, setIsWhisper] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large (max 10MB)");
      return;
    }

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);

    try {
      let mediaUrl = null;
      let mediaType = null;

      if (mediaFile) {
        const formData = new FormData();
        formData.append("file", mediaFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });

        if (!uploadRes.ok) {
          toast.error("Failed to upload media");
          setLoading(false);
          return;
        }

        const uploadData = await uploadRes.json();
        mediaUrl = uploadData.url;
        mediaType = uploadData.mediaType;
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mood, isWhisper, mediaUrl, mediaType }),
      });

      if (!res.ok) throw new Error();

      const post = await res.json();
      onPost(post);
      setContent("");
      setMood("neutral");
      setIsWhisper(false);
      setMediaFile(null);
      setMediaPreview(null);
      setFocused(false);
      toast.success("Moment shared! 6 hours of life.");
    } catch {
      toast.error("Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm shrink-0">
          {isWhisper ? <Ghost className="w-5 h-5" /> : "Y"}
        </div>

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Share a moment..."
            className="w-full bg-transparent text-white placeholder:text-surface-300/50 resize-none outline-none text-sm leading-relaxed min-h-[60px]"
            maxLength={MAX_POST_LENGTH}
            rows={focused ? 3 : 2}
          />

          {/* Media preview */}
          <AnimatePresence>
            {mediaPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative mt-2"
              >
                <img src={mediaPreview} alt="" className="rounded-xl max-h-48 object-cover" />
                <button
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreview(null);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded options */}
          <AnimatePresence>
            {focused && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Mood selector */}
                <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                  {MOODS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-full border transition-all",
                        mood === m.value
                          ? getMoodBg(m.value) + " text-white"
                          : "border-surface-700 text-surface-300 hover:border-surface-300"
                      )}
                    >
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>

                {/* Actions bar */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,video/mp4,video/webm"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="btn-ghost !p-2 !rounded-lg"
                      title="Add media"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsWhisper(!isWhisper)}
                      className={cn(
                        "btn-ghost !p-2 !rounded-lg",
                        isWhisper && "text-brand-400 bg-brand-500/10"
                      )}
                      title="Whisper mode (anonymous)"
                    >
                      <Ghost className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-surface-300">
                      {content.length}/{MAX_POST_LENGTH}
                    </span>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!content.trim() || loading}
                    className="btn-primary !py-2 !px-4 flex items-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? "Posting..." : "Share Moment"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

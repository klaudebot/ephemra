"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn, timeAgo } from "@/lib/utils";
import toast from "react-hot-toast";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  };
}

interface Partner {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

export default function ChatPage() {
  const { userId: partnerId } = useParams<{ userId: string }>();
  const { data: session } = useSession();
  const currentUserId = (session?.user as Record<string, unknown>)?.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/messages/${partnerId}`).then((r) => r.json()),
      fetch(`/api/users/${partnerId}`).then((r) => r.json()),
    ]).then(([msgData, userData]) => {
      setMessages(msgData.messages || []);
      setPartner(userData);
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
  }, [partnerId]);

  // Poll for new messages
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages/${partnerId}`);
        const data = await res.json();
        setMessages(data.messages || []);
      } catch {}
    }, 5000);

    return () => clearInterval(interval);
  }, [partnerId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);

    try {
      const res = await fetch(`/api/messages/${partnerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error();
      const message = await res.json();
      setMessages((prev) => [...prev, message]);
      setContent("");
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen">
      {/* Header */}
      <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 shrink-0">
        <Link href="/messages" className="text-surface-300 hover:text-white lg:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
          {partner?.displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-sm">{partner?.displayName}</p>
          <p className="text-xs text-surface-300">@{partner?.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-12 text-surface-300 text-sm">
            Start a conversation with {partner?.displayName}
          </div>
        )}

        {messages.map((msg, i) => {
          const isOwn = msg.senderId === currentUserId;
          const showAvatar = !isOwn && (i === 0 || messages[i - 1].senderId !== msg.senderId);

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}
            >
              {!isOwn && (
                <div className="w-7 h-7 shrink-0">
                  {showAvatar && (
                    <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                      {msg.sender.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                  isOwn
                    ? "gradient-brand text-white rounded-br-sm"
                    : "glass rounded-bl-sm"
                )}
              >
                <p>{msg.content}</p>
                <p className={cn("text-[10px] mt-1", isOwn ? "text-white/60" : "text-surface-300")}>
                  {timeAgo(msg.createdAt)}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 p-4 border-t border-white/5">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="input-dark flex-1"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!content.trim() || sending}
            className="btn-primary !p-3 !rounded-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

interface Conversation {
  partner: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        setConversations(data.conversations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-surface-300 text-sm">Private conversations</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-surface-700 mx-auto mb-3" />
          <p className="text-surface-300 mb-1">No messages yet</p>
          <p className="text-surface-300/50 text-sm">
            Visit someone&apos;s profile and start a conversation
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv, i) => (
            <motion.div
              key={conv.partner.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/messages/${conv.partner.id}`}
                className="glass rounded-xl p-4 flex items-center gap-3 hover-lift block"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center text-white font-bold">
                    {conv.partner.displayName.charAt(0).toUpperCase()}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-[10px] font-bold flex items-center justify-center text-white">
                      {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{conv.partner.displayName}</p>
                    {conv.lastMessage && (
                      <span className="text-xs text-surface-300">
                        {timeAgo(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-sm text-surface-300 truncate">
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

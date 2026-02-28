"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

interface Conversation {
  partner: { id: string; username: string; displayName: string; avatar: string | null };
  lastMessage: { content: string; createdAt: string; senderId: string } | null;
  unreadCount: number;
}

export default function MessagesPage() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/messages").then(r => r.json()).then(d => { setConvos(d.conversations || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-text-tertiary" /></div>;

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="px-4 py-4 border-b border-border-primary">
        <h1 className="text-lg font-bold">Messages</h1>
      </div>

      {convos.length === 0 ? (
        <p className="text-center py-16 text-text-tertiary text-sm">No messages yet</p>
      ) : (
        convos.map(c => (
          <Link key={c.partner.id} href={`/messages/${c.partner.id}`} className="flex items-center gap-3 px-4 py-3 border-b border-border-primary hover:bg-bg-secondary transition-colors">
            <div className="relative shrink-0">
              <div className="w-12 h-12 avatar text-base">{c.partner.displayName.charAt(0).toUpperCase()}</div>
              {c.unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 badge">{c.unreadCount}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{c.partner.displayName}</span>
                {c.lastMessage && <span className="text-xs text-text-tertiary">{timeAgo(c.lastMessage.createdAt)}</span>}
              </div>
              {c.lastMessage && <p className="text-sm text-text-tertiary truncate">{c.lastMessage.content}</p>}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

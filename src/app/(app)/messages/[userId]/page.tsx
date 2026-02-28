"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn, timeAgo } from "@/lib/utils";
import toast from "react-hot-toast";

interface Message { id: string; content: string; senderId: string; createdAt: string; sender: { id: string; username: string; displayName: string; avatar: string | null } }
interface Partner { id: string; username: string; displayName: string; avatar: string | null }

export default function ChatPage() {
  const { userId: partnerId } = useParams<{ userId: string }>();
  const { data: session } = useSession();
  const myId = (session?.user as Record<string, unknown>)?.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/messages/${partnerId}`).then(r => r.json()),
      fetch(`/api/users/${partnerId}`).then(r => r.json()),
    ]).then(([m, u]) => { setMessages(m.messages || []); setPartner(u); setLoading(false); setTimeout(() => endRef.current?.scrollIntoView(), 100); });
  }, [partnerId]);

  useEffect(() => {
    const i = setInterval(() => { fetch(`/api/messages/${partnerId}`).then(r => r.json()).then(d => setMessages(d.messages || [])).catch(() => {}); }, 5000);
    return () => clearInterval(i);
  }, [partnerId]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${partnerId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: text }) });
      if (!res.ok) throw new Error();
      const msg = await res.json();
      setMessages(prev => [...prev, msg]);
      setText("");
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { toast.error("Failed"); }
    finally { setSending(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-text-tertiary" /></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen max-w-[600px] mx-auto">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-primary shrink-0">
        <Link href="/messages" className="text-text-secondary hover:text-text-primary lg:hidden"><ArrowLeft className="w-5 h-5" /></Link>
        <div className="w-8 h-8 avatar text-xs">{partner?.displayName.charAt(0).toUpperCase()}</div>
        <div>
          <p className="text-sm font-semibold">{partner?.displayName}</p>
          <p className="text-xs text-text-tertiary">@{partner?.username}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {messages.length === 0 && <p className="text-center py-8 text-text-tertiary text-sm">Start a conversation</p>}
        {messages.map(m => {
          const own = m.senderId === myId;
          return (
            <div key={m.id} className={cn("flex", own ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[70%] rounded-2xl px-3.5 py-2 text-sm", own ? "bg-accent text-white rounded-br-sm" : "bg-bg-elevated rounded-bl-sm")}>
                <p>{m.content}</p>
                <p className={cn("text-[10px] mt-0.5", own ? "text-white/50" : "text-text-tertiary")}>{timeAgo(m.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="shrink-0 p-3 border-t border-border-primary">
        <form onSubmit={send} className="flex gap-2">
          <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Message..." className="input-field flex-1" maxLength={1000} />
          <button type="submit" disabled={!text.trim() || sending} className="btn-primary !p-2.5 !rounded-lg"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
}

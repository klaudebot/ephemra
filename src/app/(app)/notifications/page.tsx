"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, UserPlus, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { timeAgo, cn } from "@/lib/utils";
import type { NotificationData } from "@/types";

const ICONS: Record<string, typeof Heart> = { resonance: Heart, comment: MessageCircle, follow: UserPlus, eternal: Star };
const MSGS: Record<string, string> = { resonance: "resonated with your post", comment: "commented on your post", follow: "started following you", eternal: "Your post became Eternal" };

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications").then(r => r.json()).then(d => { setNotifs(d.notifications || []); setLoading(false); fetch("/api/notifications", { method: "PATCH" }); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-text-tertiary" /></div>;

  return (
    <div className="max-w-[600px] mx-auto border-x border-border-primary min-h-screen">
      <div className="px-4 py-3 border-b border-border-primary">
        <h1 className="text-[16px] font-bold">Notifications</h1>
      </div>

      {notifs.length === 0 ? (
        <p className="text-center py-20 text-text-tertiary text-sm">No notifications</p>
      ) : (
        notifs.map(n => {
          const Icon = ICONS[n.type] || Heart;
          return (
            <div key={n.id} className={cn("flex items-center gap-3 px-4 py-3 border-b border-border-primary", !n.read && "bg-bg-secondary")}>
              <div className="w-9 h-9 avatar text-xs shrink-0">
                {n.sender ? n.sender.displayName.charAt(0).toUpperCase() : <Icon className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0 text-[13px]">
                {n.sender && <Link href={`/profile/${n.sender.username}`} className="font-semibold hover:underline">{n.sender.username}</Link>}{" "}
                <span className="text-text-secondary">{MSGS[n.type]}</span>
                <span className="text-text-tertiary text-xs ml-2">{timeAgo(n.createdAt)}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

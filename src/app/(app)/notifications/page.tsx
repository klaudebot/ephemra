"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, UserPlus, Sparkles, Bell, Loader2 } from "lucide-react";
import Link from "next/link";
import { timeAgo, cn } from "@/lib/utils";
import type { NotificationData } from "@/types";

const ICON_MAP: Record<string, typeof Heart> = {
  resonance: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  eternal: Sparkles,
};

const MESSAGE_MAP: Record<string, string> = {
  resonance: "resonated with your post",
  comment: "commented on your post",
  follow: "started following you",
  eternal: "Your post became Eternal!",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        setNotifications(data.notifications || []);
        setLoading(false);
        // Mark as read
        fetch("/api/notifications", { method: "PATCH" });
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-brand-400" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-surface-700 mx-auto mb-3" />
          <p className="text-surface-300">No notifications yet</p>
          <p className="text-surface-300/50 text-sm mt-1">
            When people interact with your moments, you&apos;ll see it here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const Icon = ICON_MAP[notif.type] || Bell;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "glass rounded-xl p-4 flex items-start gap-3",
                  !notif.read && "border-brand-500/20 bg-brand-500/5"
                )}
              >
                <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    {notif.sender && (
                      <Link
                        href={`/profile/${notif.sender.username}`}
                        className="font-medium hover:underline"
                      >
                        {notif.sender.displayName}
                      </Link>
                    )}{" "}
                    <span className="text-surface-300">{MESSAGE_MAP[notif.type]}</span>
                  </p>
                  <p className="text-xs text-surface-300 mt-1">{timeAgo(notif.createdAt)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

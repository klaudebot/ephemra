"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Home,
  Compass,
  Bell,
  Bookmark,
  User,
  Settings,
  Sparkles,
  Ghost,
  MessageSquare,
  LogOut,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Feed", href: "/feed", icon: Home },
  { name: "Explore", href: "/explore", icon: Search },
  { name: "Eternal", href: "/feed?filter=eternal", icon: Sparkles },
  { name: "Whispers", href: "/feed?filter=whispers", icon: Ghost },
  { name: "Messages", href: "/messages", icon: MessageSquare, badge: "messages" },
  { name: "Notifications", href: "/notifications", icon: Bell, badge: "notifications" },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [badges, setBadges] = useState<Record<string, number>>({});

  // Poll for notification/message counts
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [notifRes] = await Promise.all([
          fetch("/api/notifications"),
        ]);
        const notifData = await notifRes.json();
        setBadges((prev) => ({
          ...prev,
          notifications: notifData.unreadCount || 0,
        }));
      } catch {}
    };

    fetchBadges();
    const interval = setInterval(fetchBadges, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-white/5 p-6 hidden lg:flex flex-col z-40">
      <Link href="/feed" className="text-xl font-bold gradient-text mb-8 block">
        ephemra
      </Link>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href.startsWith("/feed") && pathname === "/feed" && item.href === "/feed");
          const badgeCount = item.badge ? badges[item.badge] || 0 : 0;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-brand-500/20 text-brand-300"
                  : "text-surface-300 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
              {badgeCount > 0 && (
                <span className="ml-auto bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {session?.user && (
        <div className="space-y-2">
          <div className="glass-strong rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
              {session.user.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-surface-300 truncate">{session.user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-xs text-surface-300 hover:text-red-400 transition px-4 py-2 w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}

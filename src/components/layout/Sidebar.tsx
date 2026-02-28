"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Home, Search, Bell, Bookmark, User, Settings,
  MessageSquare, PlusSquare, LogOut, Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { name: "Home", href: "/feed", icon: Home },
  { name: "Explore", href: "/explore", icon: Search },
  { name: "Messages", href: "/messages", icon: MessageSquare, badge: true },
  { name: "Notifications", href: "/notifications", icon: Bell, badge: true },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch("/api/notifications").then(r => r.json()).then(d => setUnread(d.unreadCount || 0)).catch(() => {});
    const i = setInterval(() => {
      fetch("/api/notifications").then(r => r.json()).then(d => setUnread(d.unreadCount || 0)).catch(() => {});
    }, 30000);
    return () => clearInterval(i);
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] border-r border-border-primary bg-bg-primary p-4 pt-6 hidden lg:flex flex-col z-40">
      <Link href="/feed" className="flex items-center gap-2 px-3 mb-8">
        <Flame className="w-6 h-6 text-accent" />
        <span className="text-lg font-bold tracking-tight">ephemra</span>
      </Link>

      <nav className="flex-1 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 relative",
                active ? "font-semibold text-text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              <item.icon className={cn("w-[22px] h-[22px]", active && "stroke-[2.5px]")} />
              {item.name}
              {item.badge && item.name === "Notifications" && unread > 0 && (
                <span className="badge ml-auto">{unread > 9 ? "9+" : unread}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 pt-4 border-t border-border-primary">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors">
          <Settings className="w-[22px] h-[22px]" />
          Settings
        </Link>
        {session?.user && (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-danger transition-colors w-full"
          >
            <LogOut className="w-[22px] h-[22px]" />
            Log out
          </button>
        )}
      </div>
    </aside>
  );
}

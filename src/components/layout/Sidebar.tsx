"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Home,
  Compass,
  Bell,
  Bookmark,
  User,
  Settings,
  Sparkles,
  Ghost,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Feed", href: "/feed", icon: Home },
  { name: "Explore", href: "/feed?filter=all", icon: Compass },
  { name: "Eternal", href: "/feed?filter=eternal", icon: Sparkles },
  { name: "Whispers", href: "/feed?filter=whispers", icon: Ghost },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-white/5 p-6 hidden lg:flex flex-col z-40">
      <Link href="/feed" className="text-xl font-bold gradient-text mb-8">
        ephemra
      </Link>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/feed" && pathname === "/feed" && !item.href.includes("?"));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-500/20 text-brand-300"
                  : "text-surface-300 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {session?.user && (
        <div className="glass-strong rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
            {session.user.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session.user.name}</p>
            <p className="text-xs text-surface-300 truncate">{session.user.email}</p>
          </div>
        </div>
      )}
    </aside>
  );
}

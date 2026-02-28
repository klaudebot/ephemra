"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageSquare, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Feed", href: "/feed", icon: Home },
  { name: "Explore", href: "/explore", icon: Search },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Alerts", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 lg:hidden z-50">
      <div className="flex items-center justify-around h-16 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive ? "text-brand-400" : "text-surface-300"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

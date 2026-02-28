"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Bell, User, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Feed", href: "/feed", icon: Home },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Create", href: "#compose", icon: PlusCircle },
  { name: "Alerts", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 lg:hidden z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive ? "text-brand-400" : "text-surface-300"
              )}
            >
              <item.icon className={cn("w-5 h-5", item.name === "Create" && "w-7 h-7")} />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

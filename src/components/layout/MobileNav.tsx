"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/feed", icon: Home },
  { href: "/explore", icon: Search },
  { href: "/compose", icon: PlusSquare },
  { href: "/notifications", icon: Bell },
  { href: "/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-primary border-t border-border-primary lg:hidden z-50">
      <div className="flex items-center justify-around h-12">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("p-2", active ? "text-text-primary" : "text-text-tertiary")}
            >
              <item.icon className="w-6 h-6" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

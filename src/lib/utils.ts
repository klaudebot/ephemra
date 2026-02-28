import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeRemaining(expiresAt: Date | string): string {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;

  const seconds = Math.floor(diff / 1000);
  return `${seconds}s`;
}

export function getLifePercentage(createdAt: Date | string, expiresAt: Date | string): number {
  const now = new Date();
  const created = new Date(createdAt);
  const expiry = new Date(expiresAt);

  const total = expiry.getTime() - created.getTime();
  const remaining = expiry.getTime() - now.getTime();

  if (remaining <= 0) return 0;
  return Math.min(100, Math.max(0, (remaining / total) * 100));
}

export function getMoodEmoji(mood: string): string {
  const moods: Record<string, string> = {
    energetic: "⚡",
    chill: "🌊",
    thoughtful: "💭",
    creative: "🎨",
    funny: "😄",
    vulnerable: "🤍",
    neutral: "✨",
  };
  return moods[mood] || "✨";
}

export function getMoodColor(mood: string): string {
  const colors: Record<string, string> = {
    energetic: "from-orange-500 to-red-500",
    chill: "from-blue-400 to-cyan-400",
    thoughtful: "from-purple-500 to-indigo-500",
    creative: "from-pink-500 to-rose-500",
    funny: "from-yellow-400 to-amber-400",
    vulnerable: "from-gray-300 to-gray-400",
    neutral: "from-brand-400 to-brand-600",
  };
  return colors[mood] || "from-brand-400 to-brand-600";
}

export function getMoodBg(mood: string): string {
  const colors: Record<string, string> = {
    energetic: "bg-orange-500/10 border-orange-500/20",
    chill: "bg-blue-400/10 border-blue-400/20",
    thoughtful: "bg-purple-500/10 border-purple-500/20",
    creative: "bg-pink-500/10 border-pink-500/20",
    funny: "bg-yellow-400/10 border-yellow-400/20",
    vulnerable: "bg-gray-300/10 border-gray-300/20",
    neutral: "bg-brand-400/10 border-brand-400/20",
  };
  return colors[mood] || "bg-brand-400/10 border-brand-400/20";
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

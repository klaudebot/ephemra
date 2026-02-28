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
  if (hours > 24) return `${Math.floor(hours / 24)}d`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${Math.floor(diff / 1000)}s`;
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

export function getLifeColor(percent: number): string {
  if (percent > 60) return "#00c853";
  if (percent > 30) return "#ffab00";
  return "#ed4956";
}

export function getMoodEmoji(mood: string): string {
  const moods: Record<string, string> = {
    energetic: "⚡", chill: "🌊", thoughtful: "💭",
    creative: "🎨", funny: "😄", vulnerable: "🤍", neutral: "✦",
  };
  return moods[mood] || "✦";
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

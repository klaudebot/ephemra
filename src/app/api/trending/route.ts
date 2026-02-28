import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  // Get posts trending in the last 24 hours (most resonances)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const trendingPosts = await prisma.post.findMany({
    where: {
      createdAt: { gte: oneDayAgo },
      isWhisper: false,
      OR: [
        { expiresAt: { gt: new Date() } },
        { isEternal: true },
      ],
    },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, avatar: true },
      },
      _count: { select: { comments: true, resonances: true } },
      resonances: {
        where: { userId },
        select: { userId: true, type: true },
      },
      bookmarks: {
        where: { userId },
        select: { userId: true },
      },
    },
    orderBy: { resonances: { _count: "desc" } },
    take: 10,
  });

  // Get mood distribution
  const moodCounts = await prisma.post.groupBy({
    by: ["mood"],
    where: {
      createdAt: { gte: oneDayAgo },
      OR: [
        { expiresAt: { gt: new Date() } },
        { isEternal: true },
      ],
    },
    _count: true,
    orderBy: { _count: { mood: "desc" } },
  });

  // Suggested users to follow
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  const suggestedUsers = await prisma.user.findMany({
    where: {
      id: { notIn: [userId, ...followingIds] },
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      _count: { select: { followers: true } },
    },
    orderBy: { followers: { _count: "desc" } },
    take: 5,
  });

  return NextResponse.json({
    posts: trendingPosts,
    moodDistribution: moodCounts,
    suggestedUsers,
  });
}

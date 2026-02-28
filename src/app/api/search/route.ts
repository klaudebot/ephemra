import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const type = searchParams.get("type") || "all"; // "all" | "users" | "posts"

  if (!q || q.length < 2) {
    return NextResponse.json({ users: [], posts: [] });
  }

  const results: { users: unknown[]; posts: unknown[] } = { users: [], posts: [] };

  if (type === "all" || type === "users") {
    results.users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q } },
          { displayName: { contains: q } },
        ],
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        _count: { select: { followers: true } },
      },
      take: 10,
    });
  }

  if (type === "all" || type === "posts") {
    results.posts = await prisma.post.findMany({
      where: {
        content: { contains: q },
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
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  return NextResponse.json(results);
}

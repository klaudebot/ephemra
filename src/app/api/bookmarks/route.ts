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

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      post: {
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
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const posts = bookmarks
    .map((b) => b.post)
    .filter((p) => p.isEternal || new Date(p.expiresAt) > new Date());

  return NextResponse.json({ posts });
}

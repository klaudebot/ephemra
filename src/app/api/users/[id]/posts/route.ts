import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "active"; // "active" | "eternal"
  const cursor = searchParams.get("cursor");

  // Find user by id or username
  const user = await prisma.user.findFirst({
    where: { OR: [{ id: params.id }, { username: params.id }] },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const where: Record<string, unknown> = { authorId: user.id };

  if (filter === "eternal") {
    where.isEternal = true;
  } else {
    where.OR = [
      { expiresAt: { gt: new Date() } },
      { isEternal: true },
    ];
  }

  if (cursor) {
    where.createdAt = { lt: new Date(cursor) };
  }

  const posts = await prisma.post.findMany({
    where,
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
    take: 21,
  });

  const hasMore = posts.length > 20;
  const items = hasMore ? posts.slice(0, -1) : posts;

  return NextResponse.json({
    posts: items,
    nextCursor: hasMore ? items[items.length - 1].createdAt.toISOString() : null,
  });
}

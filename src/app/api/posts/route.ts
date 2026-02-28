import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { DEFAULT_LIFESPAN, MAX_POST_LENGTH } from "@/lib/constants";

// GET /api/posts - Fetch feed
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { searchParams } = new URL(req.url);
  const mood = searchParams.get("mood");
  const cursor = searchParams.get("cursor");
  const filter = searchParams.get("filter") || "all"; // "all" | "following" | "eternal" | "whispers"
  const limit = 20;

  const where: Record<string, unknown> = {};

  // Only show non-expired posts (or eternal ones)
  where.OR = [
    { expiresAt: { gt: new Date() } },
    { isEternal: true },
  ];

  if (mood && mood !== "all") {
    where.mood = mood;
  }

  if (filter === "following") {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    where.authorId = { in: [userId, ...following.map((f) => f.followingId)] };
  } else if (filter === "eternal") {
    where.isEternal = true;
  } else if (filter === "whispers") {
    where.isWhisper = true;
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
    take: limit + 1,
  });

  const hasMore = posts.length > limit;
  const items = hasMore ? posts.slice(0, -1) : posts;

  // Hide author info for whisper posts
  const processed = items.map((post) => {
    if (post.isWhisper && post.authorId !== userId) {
      return {
        ...post,
        author: {
          id: "anonymous",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: null,
        },
      };
    }
    return post;
  });

  return NextResponse.json({
    posts: processed,
    nextCursor: hasMore ? items[items.length - 1].createdAt.toISOString() : null,
  });
}

// POST /api/posts - Create a post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const body = await req.json();

    const { content, mood = "neutral", isWhisper = false, mediaUrl, mediaType } = body;

    if (!content || content.length > MAX_POST_LENGTH) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + DEFAULT_LIFESPAN * 1000);

    const post = await prisma.post.create({
      data: {
        content,
        mood,
        isWhisper,
        mediaUrl,
        mediaType,
        expiresAt,
        lifespan: DEFAULT_LIFESPAN,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
        _count: { select: { comments: true, resonances: true } },
        resonances: { select: { userId: true, type: true } },
        bookmarks: { select: { userId: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

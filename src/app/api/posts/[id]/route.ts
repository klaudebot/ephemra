import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/posts/:id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, avatar: true },
      },
      comments: {
        include: {
          author: {
            select: { id: true, username: true, displayName: true, avatar: true },
          },
        },
        orderBy: { createdAt: "desc" },
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
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Check if expired and not eternal
  if (!post.isEternal && new Date(post.expiresAt) < new Date()) {
    return NextResponse.json({ error: "This moment has faded" }, { status: 410 });
  }

  return NextResponse.json(post);
}

// DELETE /api/posts/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const post = await prisma.post.findUnique({ where: { id: params.id } });

  if (!post || post.authorId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

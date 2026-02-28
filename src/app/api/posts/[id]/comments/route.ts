import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { COMMENT_TIME_BONUS, MAX_COMMENT_LENGTH } from "@/lib/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;
    const { content } = await req.json();

    if (!content || content.length > MAX_COMMENT_LENGTH) {
      return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: params.id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: params.id,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    // Extend post life
    const newExpiry = new Date(post.expiresAt.getTime() + COMMENT_TIME_BONUS * 1000);
    await prisma.post.update({
      where: { id: params.id },
      data: { expiresAt: newExpiry },
    });

    // Notify author
    if (post.authorId !== userId) {
      await prisma.notification.create({
        data: {
          type: "comment",
          recipientId: post.authorId,
          senderId: userId,
          postId: params.id,
        },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/messages/:userId - Get messages with a specific user
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = (session.user as Record<string, unknown>).id as string;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");

  const where: Record<string, unknown> = {
    OR: [
      { senderId: currentUserId, receiverId: params.userId },
      { senderId: params.userId, receiverId: currentUserId },
    ],
  };

  if (cursor) {
    where.createdAt = { lt: new Date(cursor) };
  }

  const messages = await prisma.directMessage.findMany({
    where,
    include: {
      sender: {
        select: { id: true, username: true, displayName: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 51,
  });

  // Mark unread messages as read
  await prisma.directMessage.updateMany({
    where: {
      senderId: params.userId,
      receiverId: currentUserId,
      read: false,
    },
    data: { read: true },
  });

  const hasMore = messages.length > 50;
  const items = hasMore ? messages.slice(0, -1) : messages;

  return NextResponse.json({
    messages: items.reverse(),
    hasMore,
  });
}

// POST /api/messages/:userId - Send a message
export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = (session.user as Record<string, unknown>).id as string;
  const { content } = await req.json();

  if (!content || content.length > 1000) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  // Verify receiver exists
  const receiver = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!receiver) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const message = await prisma.directMessage.create({
    data: {
      content,
      senderId: currentUserId,
      receiverId: params.userId,
    },
    include: {
      sender: {
        select: { id: true, username: true, displayName: true, avatar: true },
      },
    },
  });

  return NextResponse.json(message, { status: 201 });
}

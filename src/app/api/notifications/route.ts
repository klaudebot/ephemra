import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  const notifications = await prisma.notification.findMany({
    where: { recipientId: userId },
    include: {
      sender: {
        select: { id: true, username: true, displayName: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = await prisma.notification.count({
    where: { recipientId: userId, read: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

// Mark all as read
export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  await prisma.notification.updateMany({
    where: { recipientId: userId, read: false },
    data: { read: true },
  });

  return NextResponse.json({ success: true });
}

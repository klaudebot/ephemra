import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/messages - Get conversations list
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;

  // Get all conversations (unique pairs of users who have exchanged messages)
  const sentMessages = await prisma.directMessage.findMany({
    where: { senderId: userId },
    select: { receiverId: true },
    distinct: ["receiverId"],
  });

  const receivedMessages = await prisma.directMessage.findMany({
    where: { receiverId: userId },
    select: { senderId: true },
    distinct: ["senderId"],
  });

  // Get unique conversation partner IDs
  const partnerIdSet = new Set([
    ...sentMessages.map((m) => m.receiverId),
    ...receivedMessages.map((m) => m.senderId),
  ]);
  const partnerIds = Array.from(partnerIdSet);

  // Get latest message for each conversation
  const conversations = await Promise.all(
    partnerIds.map(async (partnerId) => {
      const partner = await prisma.user.findUnique({
        where: { id: partnerId },
        select: { id: true, username: true, displayName: true, avatar: true },
      });

      const lastMessage = await prisma.directMessage.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: partnerId },
            { senderId: partnerId, receiverId: userId },
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      const unreadCount = await prisma.directMessage.count({
        where: {
          senderId: partnerId,
          receiverId: userId,
          read: false,
        },
      });

      return {
        partner,
        lastMessage,
        unreadCount,
      };
    })
  );

  // Sort by last message time
  conversations.sort((a, b) => {
    const aTime = a.lastMessage?.createdAt?.getTime() || 0;
    const bTime = b.lastMessage?.createdAt?.getTime() || 0;
    return bTime - aTime;
  });

  return NextResponse.json({ conversations });
}

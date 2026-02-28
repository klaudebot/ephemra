import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { RESONANCE_TIME_BONUS, ETERNAL_THRESHOLD } from "@/lib/constants";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const { type = "resonate" } = await req.json();

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Check if already resonated
  const existing = await prisma.resonance.findUnique({
    where: { postId_userId: { postId: params.id, userId } },
  });

  if (existing) {
    // Un-resonate
    await prisma.resonance.delete({ where: { id: existing.id } });
    return NextResponse.json({ resonated: false });
  }

  // Create resonance
  await prisma.resonance.create({
    data: { postId: params.id, userId, type },
  });

  // Extend post life
  const newExpiry = new Date(post.expiresAt.getTime() + RESONANCE_TIME_BONUS * 1000);
  const updates: Record<string, unknown> = { expiresAt: newExpiry };

  // Check for eternal threshold
  const resonanceCount = await prisma.resonance.count({ where: { postId: params.id } });
  if (resonanceCount >= ETERNAL_THRESHOLD && !post.isEternal) {
    updates.isEternal = true;

    // Create notification for the author
    if (post.authorId !== userId) {
      await prisma.notification.create({
        data: {
          type: "eternal",
          recipientId: post.authorId,
          senderId: userId,
          postId: params.id,
        },
      });
    }
  }

  await prisma.post.update({ where: { id: params.id }, data: updates });

  // Notify author
  if (post.authorId !== userId) {
    await prisma.notification.create({
      data: {
        type: "resonance",
        recipientId: post.authorId,
        senderId: userId,
        postId: params.id,
      },
    });
  }

  return NextResponse.json({ resonated: true, isEternal: !!updates.isEternal });
}

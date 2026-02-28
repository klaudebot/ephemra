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

  const currentUserId = (session.user as Record<string, unknown>).id as string;

  // Support lookup by username or id
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: params.id }, { username: params.id }],
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      bio: true,
      avatar: true,
      coverImage: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isFollowing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: user.id,
      },
    },
  });

  return NextResponse.json({ ...user, isFollowing: !!isFollowing });
}

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

  const user = await prisma.user.findUnique({
    where: { id: userId },
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
        select: { posts: true, followers: true, following: true },
      },
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as Record<string, unknown>).id as string;
  const body = await req.json();
  const { displayName, bio, avatar, coverImage } = body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(displayName !== undefined && { displayName }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
      ...(coverImage !== undefined && { coverImage }),
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      bio: true,
      avatar: true,
      coverImage: true,
    },
  });

  return NextResponse.json(user);
}

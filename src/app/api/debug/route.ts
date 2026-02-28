import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import prisma from "@/lib/db";

export async function GET() {
  const cwd = process.cwd();
  const sourceDb = path.join(cwd, "prisma", "dev.db");
  const tmpDb = "/tmp/ephemra.db";

  const info: Record<string, unknown> = {
    cwd,
    sourceDbExists: fs.existsSync(sourceDb),
    sourceDbSize: fs.existsSync(sourceDb) ? fs.statSync(sourceDb).size : 0,
    tmpDbExists: fs.existsSync(tmpDb),
    tmpDbSize: fs.existsSync(tmpDb) ? fs.statSync(tmpDb).size : 0,
    isVercel: !!process.env.VERCEL,
    databaseUrlRaw: process.env.DATABASE_URL,
    databaseUrlTrimmed: process.env.DATABASE_URL?.trim(),
  };

  // Test if prisma can query
  try {
    const userCount = await prisma.user.count();
    info.userCount = userCount;
    info.prismaOk = true;
  } catch (e) {
    info.prismaOk = false;
    info.prismaError = String(e);
  }

  // Test if prisma can write
  try {
    const testPost = await prisma.post.create({
      data: {
        content: "debug test",
        mood: "neutral",
        expiresAt: new Date(Date.now() + 60000),
        lifespan: 60,
        authorId: "nonexistent",
      },
    });
    info.writeOk = true;
    await prisma.post.delete({ where: { id: testPost.id } });
  } catch (e) {
    info.writeError = String(e).substring(0, 200);
  }

  return NextResponse.json(info);
}

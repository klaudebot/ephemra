import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const cwd = process.cwd();
  const sourceDb = path.join(cwd, "prisma", "dev.db");
  const tmpDb = "/tmp/ephemra.db";

  const info: Record<string, unknown> = {
    cwd,
    sourceDbPath: sourceDb,
    sourceDbExists: fs.existsSync(sourceDb),
    tmpDbPath: tmpDb,
    tmpDbExists: fs.existsSync(tmpDb),
    isVercel: !!process.env.VERCEL,
    databaseUrl: process.env.DATABASE_URL?.substring(0, 30),
    prismaDir: fs.existsSync(path.join(cwd, "prisma")),
    prismaFiles: fs.existsSync(path.join(cwd, "prisma")) ? fs.readdirSync(path.join(cwd, "prisma")) : [],
  };

  try {
    info.cwdFiles = fs.readdirSync(cwd).slice(0, 20);
  } catch { /* empty */ }

  return NextResponse.json(info);
}

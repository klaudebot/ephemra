import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("Password123@", 12);

  await prisma.user.upsert({
    where: { email: "michael@apexrush.com" },
    update: {},
    create: {
      email: "michael@apexrush.com",
      username: "michael",
      displayName: "Michael",
      password,
      bio: "Building the future, one moment at a time.",
    },
  });

  console.log("Seed complete!");
  console.log("Demo login: michael@apexrush.com / Password123@");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

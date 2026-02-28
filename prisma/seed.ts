import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create sample user
  const password = await bcrypt.hash("Password123@", 12);

  const michael = await prisma.user.upsert({
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

  // Create some additional sample users
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      username: "alice",
      displayName: "Alice Chen",
      password: await bcrypt.hash("password123", 12),
      bio: "Designer & creative thinker",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      username: "bob",
      displayName: "Bob Rivers",
      password: await bcrypt.hash("password123", 12),
      bio: "Code is poetry",
    },
  });

  const sara = await prisma.user.upsert({
    where: { email: "sara@example.com" },
    update: {},
    create: {
      email: "sara@example.com",
      username: "sara",
      displayName: "Sara Kim",
      password: await bcrypt.hash("password123", 12),
      bio: "Photographer | Explorer",
    },
  });

  // Create follows
  const follows = [
    { followerId: michael.id, followingId: alice.id },
    { followerId: michael.id, followingId: bob.id },
    { followerId: alice.id, followingId: michael.id },
    { followerId: bob.id, followingId: michael.id },
    { followerId: sara.id, followingId: michael.id },
    { followerId: alice.id, followingId: sara.id },
  ];

  for (const f of follows) {
    await prisma.follow.upsert({
      where: { followerId_followingId: f },
      update: {},
      create: f,
    });
  }

  // Create sample posts with various moods and lifespans
  const now = Date.now();
  const hour = 60 * 60 * 1000;

  const posts = [
    {
      content: "Just discovered this incredible platform where posts actually have a lifespan. The idea that engagement keeps content alive is brilliant. No more algorithmic noise — just real, human connection. 🌟",
      mood: "energetic",
      authorId: michael.id,
      expiresAt: new Date(now + 5 * hour),
      lifespan: 21600,
    },
    {
      content: "There's something beautifully poetic about ephemeral content. Like sand mandalas — the impermanence makes each moment more precious.",
      mood: "thoughtful",
      authorId: alice.id,
      expiresAt: new Date(now + 4 * hour),
      lifespan: 21600,
    },
    {
      content: "Hot take: social media peaked when it was about connecting with people, not performing for algorithms. Ephemra gets this right.",
      mood: "energetic",
      authorId: bob.id,
      expiresAt: new Date(now + 3 * hour),
      lifespan: 21600,
    },
    {
      content: "Morning light through my window. Coffee steam rising. Sometimes the quiet moments are the ones worth sharing.",
      mood: "chill",
      authorId: sara.id,
      expiresAt: new Date(now + 6 * hour),
      lifespan: 21600,
    },
    {
      content: "Working on something special with the team today. Can't share details yet, but it's going to change how we think about digital communities. Stay tuned.",
      mood: "creative",
      authorId: michael.id,
      expiresAt: new Date(now + 5.5 * hour),
      lifespan: 21600,
    },
    {
      content: "The best code is the code you don't have to write. Simplicity is the ultimate sophistication.",
      mood: "thoughtful",
      authorId: bob.id,
      expiresAt: new Date(now + 2 * hour),
      lifespan: 21600,
    },
    {
      content: "Sometimes I wonder if we're too connected. Then I read something that genuinely moves me and I remember why we share. 🤍",
      mood: "vulnerable",
      authorId: alice.id,
      expiresAt: new Date(now + 4.5 * hour),
      lifespan: 21600,
      isWhisper: true,
    },
    {
      content: "Just hit 50 resonances on my photography post. It became Eternal! This gamification actually feels meaningful — the community decides what lasts. ✨",
      mood: "energetic",
      authorId: sara.id,
      expiresAt: new Date(now + 99999 * hour),
      lifespan: 21600,
      isEternal: true,
    },
  ];

  for (const postData of posts) {
    const post = await prisma.post.create({
      data: postData,
    });

    // Add some resonances
    const users = [michael, alice, bob, sara];
    const resonanceCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < resonanceCount; i++) {
      const user = users[i % users.length];
      if (user.id !== postData.authorId) {
        await prisma.resonance.upsert({
          where: { postId_userId: { postId: post.id, userId: user.id } },
          update: {},
          create: { postId: post.id, userId: user.id, type: "resonate" },
        });
      }
    }

    // Add some comments
    if (Math.random() > 0.4) {
      const commenter = users.find((u) => u.id !== postData.authorId)!;
      await prisma.comment.create({
        data: {
          content: "This resonates with me. Great perspective!",
          postId: post.id,
          authorId: commenter.id,
        },
      });
    }
  }

  // Create notifications for michael
  await prisma.notification.create({
    data: { type: "follow", recipientId: michael.id, senderId: sara.id },
  });
  await prisma.notification.create({
    data: { type: "resonance", recipientId: michael.id, senderId: alice.id },
  });
  await prisma.notification.create({
    data: { type: "comment", recipientId: michael.id, senderId: bob.id },
  });

  // Create sample DMs
  const dmData = [
    { senderId: alice.id, receiverId: michael.id, content: "Hey Michael! Love what you're building with Ephemra. The ephemeral post concept is brilliant." },
    { senderId: michael.id, receiverId: alice.id, content: "Thanks Alice! Means a lot. The design is what really brings it to life." },
    { senderId: alice.id, receiverId: michael.id, content: "Have you thought about adding collaborative posts? Could be interesting!" },
    { senderId: bob.id, receiverId: michael.id, content: "The codebase is super clean. Mind if I contribute to the S3 integration?" },
    { senderId: michael.id, receiverId: bob.id, content: "Would love that! Check out the .env.example for the S3 config options." },
    { senderId: sara.id, receiverId: michael.id, content: "My photography post just went Eternal! This platform is amazing ✨" },
  ];

  for (const dm of dmData) {
    await prisma.directMessage.create({ data: dm });
  }

  console.log("Seed complete!");
  console.log("Sample login: michael@apexrush.com / Password123@");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

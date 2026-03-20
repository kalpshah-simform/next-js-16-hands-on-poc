import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const demoEmail = "demo@example.com";
  const demoPasswordHash = await bcrypt.hash("Password123!", 12);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: "Demo User",
      passwordHash: demoPasswordHash,
    },
    create: {
      name: "Demo User",
      email: demoEmail,
      passwordHash: demoPasswordHash,
    },
  });

  await prisma.post.deleteMany({
    where: { authorId: user.id },
  });

  await prisma.post.createMany({
    data: [
      {
        title: "Welcome to Next.js 16 POC",
        content:
          "This seeded post confirms Prisma writes are working end-to-end.",
        authorId: user.id,
      },
      {
        title: "Server Actions + Auth.js",
        content:
          "Login, create, update, and delete posts from protected routes.",
        authorId: user.id,
      },
    ],
  });

  console.log("Seed complete for user:", demoEmail);
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

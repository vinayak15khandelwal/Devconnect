import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Populates the DB with a handful of realistic developers, skills,
// projects, posts, and one accepted connection with an endorsement —
// enough to exercise every model relationship while testing later days.
async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const asha = await prisma.user.upsert({
    where: { email: "asha@example.com" },
    update: {},
    create: {
      name: "Asha Verma", username: "asha-dev", email: "asha@example.com", passwordHash,
      bio: "Full-stack dev. React + Node.", location: "Delhi, India",
    },
  });

  const rahul = await prisma.user.upsert({
    where: { email: "rahul@example.com" },
    update: {},
    create: {
      name: "Rahul Mehta", username: "rahul-codes", email: "rahul@example.com", passwordHash,
      bio: "Backend engineer, into distributed systems.", location: "Bengaluru, India",
    },
  });

  const skillNames = ["React", "Node.js", "TypeScript", "PostgreSQL", "System Design"];
  const skills = await Promise.all(
    skillNames.map((name) => prisma.skill.upsert({ where: { name }, update: {}, create: { name } }))
  );

  for (const [i, user] of [asha, rahul].entries()) {
    for (const skill of skills.slice(i, i + 3)) {
      await prisma.userSkill.upsert({
        where: { userId_skillId: { userId: user.id, skillId: skill.id } },
        update: {}, create: { userId: user.id, skillId: skill.id },
      });
    }
  }

  await prisma.project.upsert({
    where: { id: "seed-project-1" },
    update: {},
    create: {
      id: "seed-project-1", userId: asha.id, title: "DevConnect",
      description: "Developer networking & portfolio platform.",
      techStack: ["React", "Express", "PostgreSQL"],
      repoUrl: "https://github.com/example/devconnect",
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "why-i-love-typescript" },
    update: {},
    create: {
      authorId: rahul.id, title: "Why I Love TypeScript", slug: "why-i-love-typescript",
      contentMd: "# TypeScript\n\nCatching bugs at compile time instead of 3am on-call.",
      excerpt: "Catching bugs at compile time instead of 3am on-call.",
    },
  });

  const connection = await prisma.connection.upsert({
    where: { requesterId_addresseeId: { requesterId: asha.id, addresseeId: rahul.id } },
    update: { status: "ACCEPTED" },
    create: { requesterId: asha.id, addresseeId: rahul.id, status: "ACCEPTED" },
  });

  const rahulSkill = await prisma.userSkill.findFirst({ where: { userId: rahul.id } });
  if (rahulSkill) {
    await prisma.endorsement.upsert({
      where: { userSkillId_endorserId: { userSkillId: rahulSkill.id, endorserId: asha.id } },
      update: {}, create: { userSkillId: rahulSkill.id, endorserId: asha.id },
    });
  }

  console.log("Seed complete:", { asha: asha.username, rahul: rahul.username, connection: connection.status });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => prisma.$disconnect());

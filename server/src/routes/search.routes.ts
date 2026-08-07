import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// Developer discovery: filter by skill name and/or location, paginated.
router.get("/", async (req, res) => {
  const { skill, location, page = "1" } = req.query as Record<string, string>;
  const pageSize = 12;
  const pageNum = Number(page) || 1;

  const where: Record<string, unknown> = {};
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (skill) {
    where.userSkills = { some: { skill: { name: { contains: skill, mode: "insensitive" } } } };
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      include: { userSkills: { include: { skill: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  res.success({
    developers: users.map((u: { id: string; name: string; username: string; avatarUrl: string | null; bio: string | null; location: string | null; userSkills: { skill: { name: string } }[] }) => ({
      id: u.id, name: u.name, username: u.username, avatarUrl: u.avatarUrl,
      bio: u.bio, location: u.location,
      skills: u.userSkills.map((us: { skill: { name: string } }) => us.skill.name),
    })),
    page: pageNum, pageSize, total,
  });
});

export default router;

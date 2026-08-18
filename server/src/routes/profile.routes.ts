import { Router } from "express";
import { imageUpload as upload } from "../lib/upload";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, attachUserIfPresent, AuthedRequest } from "../middleware/auth";
import { uploadImageBuffer } from "../lib/cloudinary";
import { toPublicUser } from "./auth.routes";

const router = Router();

router.get("/:username", attachUserIfPresent, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username },
    include: {
      userSkills: { include: { skill: true, endorsements: true } },
      projects: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!user) return res.fail("Developer not found", 404);

  res.success({
    ...toPublicUser(user),
    skills: user.userSkills
      .map((us: { skill: { id: string; name: string }; endorsements: { endorserId: string }[] }) => ({
        id: us.skill.id,
        name: us.skill.name,
        endorsementCount: us.endorsements.length,
        endorsedByMe: req.userId ? us.endorsements.some((e) => e.endorserId === req.userId) : false,
      }))
      // Most-endorsed first, so a profile's strongest/most-vouched-for skills lead the grid.
      .sort((a: { endorsementCount: number }, b: { endorsementCount: number }) => b.endorsementCount - a.endorsementCount),
    projects: user.projects,
  });
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(280).optional(),
  location: z.string().max(100).optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  skills: z.array(z.string()).optional(),
});

router.patch("/", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.fail(parsed.error.errors[0].message, 422);
  const { skills, ...rest } = parsed.data;

  const user = await prisma.user.update({ where: { id: req.userId }, data: rest });

  if (skills) {
    for (const name of skills) {
      const skill = await prisma.skill.upsert({
        where: { name }, update: {}, create: { name },
      });
      await prisma.userSkill.upsert({
        where: { userId_skillId: { userId: req.userId!, skillId: skill.id } },
        update: {}, create: { userId: req.userId!, skillId: skill.id },
      });
    }
  }

  res.success(toPublicUser(user), "Profile updated");
});

router.post("/avatar", requireAuth, upload.single("avatar"), async (req: AuthedRequest, res) => {
  if (!req.file) return res.fail("No image uploaded", 422);
  const url = await uploadImageBuffer(req.file.buffer, "devconnect/avatars");
  const user = await prisma.user.update({ where: { id: req.userId }, data: { avatarUrl: url } });
  res.success(toPublicUser(user), "Avatar updated");
});

export default router;

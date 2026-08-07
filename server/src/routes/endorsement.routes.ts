import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { notifyUser } from "../socket";

const router = Router();

// Endorse a connected developer's skill. Requires an ACCEPTED connection
// between the two users, matching the brief's "endorse connected devs" flow.
router.post("/:username/:skillName", requireAuth, async (req: AuthedRequest, res) => {
  const target = await prisma.user.findUnique({ where: { username: req.params.username } });
  if (!target) return res.fail("Developer not found", 404);
  if (target.id === req.userId) return res.fail("You can't endorse yourself", 400);

  const connection = await prisma.connection.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: req.userId, addresseeId: target.id },
        { requesterId: target.id, addresseeId: req.userId },
      ],
    },
  });
  if (!connection) return res.fail("You must be connected to endorse this developer", 403);

  const skill = await prisma.skill.upsert({
    where: { name: req.params.skillName }, update: {}, create: { name: req.params.skillName },
  });
  const userSkill = await prisma.userSkill.upsert({
    where: { userId_skillId: { userId: target.id, skillId: skill.id } },
    update: {}, create: { userId: target.id, skillId: skill.id },
  });

  const existing = await prisma.endorsement.findUnique({
    where: { userSkillId_endorserId: { userSkillId: userSkill.id, endorserId: req.userId! } },
  });
  if (existing) return res.fail("You already endorsed this skill", 409);

  await prisma.endorsement.create({ data: { userSkillId: userSkill.id, endorserId: req.userId! } });

  notifyUser(target.id, {
    type: "ENDORSEMENT",
    message: `endorsed your ${skill.name} skill`,
    fromUserId: req.userId!,
  });

  const count = await prisma.endorsement.count({ where: { userSkillId: userSkill.id } });
  res.success({ skill: skill.name, endorsementCount: count }, "Endorsement added");
});

export default router;

import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const notifications = await prisma.notification.findMany({
    where: { recipientId: req.userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  // fromUserId is stored as a plain string, not a relation (see
  // docs/database-schema.md), so resolve the actor's display info in one
  // batched lookup rather than a relation the schema deliberately avoids.
  const actorIds = [...new Set(notifications.map((n: { fromUserId: string }) => n.fromUserId))];
  const actors = await prisma.user.findMany({
    where: { id: { in: actorIds } },
    select: { id: true, name: true, username: true, avatarUrl: true },
  });
  const actorById = new Map(actors.map((a: { id: string }) => [a.id, a]));

  res.success(
    notifications.map((n: { fromUserId: string }) => ({ ...n, fromUser: actorById.get(n.fromUserId) || null }))
  );
});

router.patch("/:id/read", requireAuth, async (req: AuthedRequest, res) => {
  const notif = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!notif || notif.recipientId !== req.userId) return res.fail("Not authorized", 403);
  const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
  res.success(updated);
});

export default router;

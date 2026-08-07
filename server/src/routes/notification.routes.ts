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
  res.success(notifications);
});

router.patch("/:id/read", requireAuth, async (req: AuthedRequest, res) => {
  const notif = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!notif || notif.recipientId !== req.userId) return res.fail("Not authorized", 403);
  const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
  res.success(updated);
});

export default router;

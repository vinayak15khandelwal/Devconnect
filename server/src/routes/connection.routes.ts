import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { notifyUser } from "../socket";

const router = Router();

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const connections = await prisma.connection.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: req.userId }, { addresseeId: req.userId }],
    },
    include: { requester: true, addressee: true },
  });
  res.success(connections);
});

router.get("/pending", requireAuth, async (req: AuthedRequest, res) => {
  const pending = await prisma.connection.findMany({
    where: { addresseeId: req.userId, status: "PENDING" },
    include: { requester: true },
  });
  res.success(pending);
});

// Tells the frontend what button state to show on a profile: whether
// there's no relationship yet, a request pending in either direction,
// or an accepted connection. Avoids the client having to reconcile
// multiple list endpoints itself.
router.get("/status/:username", requireAuth, async (req: AuthedRequest, res) => {
  const target = await prisma.user.findUnique({ where: { username: req.params.username } });
  if (!target) return res.fail("Developer not found", 404);
  if (target.id === req.userId) return res.success({ status: "SELF" });

  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId: req.userId, addresseeId: target.id },
        { requesterId: target.id, addresseeId: req.userId },
      ],
    },
  });

  if (!connection || connection.status === "REJECTED") return res.success({ status: "NONE" });
  if (connection.status === "ACCEPTED") return res.success({ status: "ACCEPTED", connectionId: connection.id });

  const status = connection.requesterId === req.userId ? "PENDING_SENT" : "PENDING_RECEIVED";
  res.success({ status, connectionId: connection.id });
});

// Developers connected to both the current user and :username — shown on
// a profile as "N mutual connections" the way most networking sites do.
router.get("/mutual/:username", requireAuth, async (req: AuthedRequest, res) => {
  const target = await prisma.user.findUnique({ where: { username: req.params.username } });
  if (!target) return res.fail("Developer not found", 404);

  const [mine, theirs] = await Promise.all([
    prisma.connection.findMany({
      where: { status: "ACCEPTED", OR: [{ requesterId: req.userId }, { addresseeId: req.userId }] },
    }),
    prisma.connection.findMany({
      where: { status: "ACCEPTED", OR: [{ requesterId: target.id }, { addresseeId: target.id }] },
    }),
  ]);

  const myIds = new Set(mine.map((c: { requesterId: string; addresseeId: string }) => (c.requesterId === req.userId ? c.addresseeId : c.requesterId)));
  const theirIds = new Set(theirs.map((c: { requesterId: string; addresseeId: string }) => (c.requesterId === target.id ? c.addresseeId : c.requesterId)));
  const mutualIds = [...myIds].filter((id) => theirIds.has(id));

  const mutualUsers = await prisma.user.findMany({
    where: { id: { in: mutualIds } },
    select: { id: true, name: true, username: true, avatarUrl: true },
  });
  res.success(mutualUsers);
});

router.post("/request/:username", requireAuth, async (req: AuthedRequest, res) => {
  const target = await prisma.user.findUnique({ where: { username: req.params.username } });
  if (!target) return res.fail("Developer not found", 404);
  if (target.id === req.userId) return res.fail("You can't connect with yourself", 400);

  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId: req.userId, addresseeId: target.id },
        { requesterId: target.id, addresseeId: req.userId },
      ],
    },
  });
  if (existing) return res.fail("Connection already requested", 409);

  const connection = await prisma.connection.create({
    data: { requesterId: req.userId!, addresseeId: target.id, status: "PENDING" },
  });

  notifyUser(target.id, {
    type: "CONNECTION_REQUEST",
    message: "sent you a connection request",
    fromUserId: req.userId!,
  });

  res.success(connection, "Connection request sent");
});

router.patch("/:id/respond", requireAuth, async (req: AuthedRequest, res) => {
  const { action } = req.body as { action: "ACCEPT" | "REJECT" };
  const connection = await prisma.connection.findUnique({ where: { id: req.params.id } });
  if (!connection || connection.addresseeId !== req.userId) return res.fail("Not authorized", 403);

  const status = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";
  const updated = await prisma.connection.update({ where: { id: req.params.id }, data: { status } });

  if (status === "ACCEPTED") {
    notifyUser(connection.requesterId, {
      type: "CONNECTION_ACCEPTED",
      message: "accepted your connection request",
      fromUserId: req.userId!,
    });
  }

  res.success(updated, `Connection ${status.toLowerCase()}`);
});

router.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const connection = await prisma.connection.findUnique({ where: { id: req.params.id } });
  if (!connection || (connection.requesterId !== req.userId && connection.addresseeId !== req.userId)) {
    return res.fail("Not authorized", 403);
  }
  await prisma.connection.delete({ where: { id: req.params.id } });
  res.success(null, "Connection removed");
});

export default router;

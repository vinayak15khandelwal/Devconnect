import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();

// Aggregates the small pieces of data the brief's "Dashboard" screen needs:
// activity feed (recent posts from connections), suggestions, and stats.
router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;

  const connections = await prisma.connection.findMany({
    where: { status: "ACCEPTED", OR: [{ requesterId: userId }, { addresseeId: userId }] },
  });
  const connectionIds = connections.map((c: { requesterId: string; addresseeId: string }) => (c.requesterId === userId ? c.addresseeId : c.requesterId));

  const [feed, trending, suggestions, stats] = await Promise.all([
    prisma.blogPost.findMany({
      where: { authorId: { in: connectionIds }, published: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { author: true },
    }),
    // "Trending" without a schema for views/likes (out of scope for the Day 7
    // blog feature) is approximated as the most recent site-wide posts,
    // excluding your own network's feed above — i.e. what's happening
    // beyond who you're already connected to.
    prisma.blogPost.findMany({
      where: { published: true, authorId: { notIn: [...connectionIds, userId] } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { author: true },
    }),
    prisma.user.findMany({
      where: { id: { notIn: [...connectionIds, userId] } },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    Promise.all([
      prisma.project.count({ where: { userId } }),
      prisma.blogPost.count({ where: { authorId: userId } }),
      connectionIds.length,
    ]),
  ]);

  res.success({
    feed,
    trending,
    suggestions: suggestions.map((s: { id: string; name: string; username: string; avatarUrl: string | null }) => ({ id: s.id, name: s.name, username: s.username, avatarUrl: s.avatarUrl })),
    stats: { projects: stats[0], posts: stats[1], connections: stats[2] },
  });
});

export default router;

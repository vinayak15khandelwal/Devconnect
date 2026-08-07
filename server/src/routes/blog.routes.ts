import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();

function slugify(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
}

router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = 10;
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: { author: true },
  });
  const total = await prisma.blogPost.count({ where: { published: true } });
  res.success({ posts, page, pageSize, total });
});

router.get("/:slug", async (req, res) => {
  const post = await prisma.blogPost.findUnique({
    where: { slug: req.params.slug }, include: { author: true },
  });
  if (!post) return res.fail("Post not found", 404);
  res.success(post);
});

const postSchema = z.object({
  title: z.string().min(3),
  contentMd: z.string().min(20),
  excerpt: z.string().max(280).optional(),
  published: z.boolean().optional(),
});

router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) return res.fail(parsed.error.errors[0].message, 422);
  const { title, contentMd, published } = parsed.data;
  const excerpt = parsed.data.excerpt || contentMd.slice(0, 160);

  const post = await prisma.blogPost.create({
    data: { title, contentMd, excerpt, published: published ?? true, slug: slugify(title), authorId: req.userId! },
  });
  res.success(post, "Post published");
});

router.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post || post.authorId !== req.userId) return res.fail("Not authorized", 403);

  const parsed = postSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.fail(parsed.error.errors[0].message, 422);

  const updated = await prisma.blogPost.update({ where: { id: req.params.id }, data: parsed.data });
  res.success(updated, "Post updated");
});

router.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post || post.authorId !== req.userId) return res.fail("Not authorized", 403);
  await prisma.blogPost.delete({ where: { id: req.params.id } });
  res.success(null, "Post deleted");
});

export default router;

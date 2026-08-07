import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { uploadImageBuffer } from "../lib/cloudinary";

const router = Router();
const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } });

const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  techStack: z.array(z.string()).min(1),
  repoUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
});

router.get("/user/:username", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { username: req.params.username } });
  if (!user) return res.fail("Developer not found", 404);
  const projects = await prisma.project.findMany({
    where: { userId: user.id }, orderBy: { createdAt: "desc" },
  });
  res.success(projects);
});

router.post("/", requireAuth, upload.single("image"), async (req: AuthedRequest, res) => {
  const parsed = projectSchema.safeParse({
    ...req.body,
    techStack: typeof req.body.techStack === "string" ? JSON.parse(req.body.techStack) : req.body.techStack,
  });
  if (!parsed.success) return res.fail(parsed.error.errors[0].message, 422);

  let imageUrl: string | undefined;
  if (req.file) imageUrl = await uploadImageBuffer(req.file.buffer, "devconnect/projects");

  const project = await prisma.project.create({
    data: { ...parsed.data, userId: req.userId!, imageUrl },
  });
  res.success(project, "Project created");
});

router.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project || project.userId !== req.userId) return res.fail("Not authorized", 403);

  const parsed = projectSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.fail(parsed.error.errors[0].message, 422);

  const updated = await prisma.project.update({ where: { id: req.params.id }, data: parsed.data });
  res.success(updated, "Project updated");
});

router.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project || project.userId !== req.userId) return res.fail("Not authorized", 403);
  await prisma.project.delete({ where: { id: req.params.id } });
  res.success(null, "Project deleted");
});

export default router;

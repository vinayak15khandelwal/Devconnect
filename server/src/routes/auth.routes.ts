import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.fail(parsed.error.errors[0].message, 422);
  const { name, username, email, password } = parsed.data;

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) return res.fail("Email or username already in use", 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, username, email, passwordHash },
  });

  const token = signToken({ userId: user.id });
  setAuthCookie(res, token);
  res.success({ accessToken: token, user: toPublicUser(user) }, "Registered successfully");
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.fail("Invalid email or password", 422);
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return res.fail("Invalid credentials", 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.fail("Invalid credentials", 401);

  const token = signToken({ userId: user.id });
  setAuthCookie(res, token);
  res.success({ accessToken: token, user: toPublicUser(user) }, "Logged in");
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.success(null, "Logged out");
});

router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.fail("User not found", 404);
  res.success(toPublicUser(user));
});

// --- GitHub OAuth ---
// 1) Frontend redirects here, which redirects to GitHub's consent screen.
router.get("/github", (_req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID || "",
    redirect_uri: process.env.GITHUB_CALLBACK_URL || "",
    scope: "read:user user:email",
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

// 2) GitHub redirects back here with a `code`; we exchange it for an
// access token, fetch the profile, upsert the user, and issue our own JWT.
router.get("/github/callback", async (req, res) => {
  const code = req.query.code as string | undefined;
  if (!code) return res.redirect(`${process.env.CLIENT_URL}/login?error=github`);

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const tokenData = (await tokenRes.json()) as { access_token?: string };
    if (!tokenData.access_token) throw new Error("No GitHub access token returned");

    const profileRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = (await profileRes.json()) as {
      id: number;
      login: string;
      name: string | null;
      avatar_url: string;
      html_url: string;
      email: string | null;
    };

    let emailToUse = profile.email;
    if (!emailToUse) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const emails = (await emailsRes.json()) as { email: string; primary: boolean }[];
      emailToUse = emails.find((e) => e.primary)?.email || emails[0]?.email || `${profile.login}@users.noreply.github.com`;
    }

    const githubId = String(profile.id);
    let user = await prisma.user.findUnique({ where: { githubId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId,
          name: profile.name || profile.login,
          username: profile.login,
          email: emailToUse,
          avatarUrl: profile.avatar_url,
          githubUrl: profile.html_url,
        },
      });
    }

    const token = signToken({ userId: user.id });
    setAuthCookie(res, token);
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=github`);
  }
});

function setAuthCookie(res: import("express").Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function toPublicUser(user: {
  id: string; name: string; username: string; email: string;
  avatarUrl: string | null; bio: string | null; location: string | null;
  githubUrl: string | null; createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    location: user.location,
    githubUrl: user.githubUrl,
    createdAt: user.createdAt.toISOString(),
  };
}

export default router;

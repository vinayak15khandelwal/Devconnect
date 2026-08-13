import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma";
import { responseFormatter } from "./middleware/response";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import projectRoutes from "./routes/project.routes";
import blogRoutes from "./routes/blog.routes";
import searchRoutes from "./routes/search.routes";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(responseFormatter);

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.success({ status: "ok" }, "Server up, database reachable");
  } catch (err) {
    res.fail(`Database not reachable: ${String(err)}`, 500);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/search", searchRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`DevConnect API listening on http://localhost:${PORT}`);
});

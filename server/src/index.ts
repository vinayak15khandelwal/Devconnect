import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { createServer } from "http";
import { prisma } from "./lib/prisma";
import { responseFormatter } from "./middleware/response";
import { errorHandler } from "./middleware/errorHandler";
import { initSocket } from "./socket";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import projectRoutes from "./routes/project.routes";
import blogRoutes from "./routes/blog.routes";
import searchRoutes from "./routes/search.routes";
import connectionRoutes from "./routes/connection.routes";
import endorsementRoutes from "./routes/endorsement.routes";
import notificationRoutes from "./routes/notification.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();
const httpServer = createServer(app);

app.use(helmet());
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
app.use("/api/connections", connectionRoutes);
app.use("/api/endorsements", endorsementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

initSocket(httpServer);

const PORT = process.env.PORT || 4000;

// Not a hard failure — the app still needs to run in local dev without a
// .env file — but a real deployment silently using the fallback secret
// would mean anyone could forge a valid JWT. Surface it loudly.
if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.warn("⚠️  JWT_SECRET is not set. Using an insecure default — set it before deploying.");
}

httpServer.listen(PORT, () => {
  console.log(`DevConnect API listening on http://localhost:${PORT}`);
});

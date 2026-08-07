import "dotenv/config";
import express from "express";
import { prisma } from "./lib/prisma";

const app = express();
app.use(express.json());

// Day 1 goal: confirm the server boots and can reach the database.
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, message: "Server up, database reachable" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Database not reachable", error: String(err) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`DevConnect API listening on http://localhost:${PORT}`);
});

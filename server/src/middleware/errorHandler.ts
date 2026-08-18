import { Request, Response, NextFunction } from "express";
import multer from "multer";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  // Multer errors (file too large, wrong type from our fileFilter) are
  // client mistakes, not server failures — 400, not 500.
  if (err instanceof multer.MulterError || (err instanceof Error && err.message.includes("images are allowed"))) {
    return res.status(400).json({ success: false, message: err.message });
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ success: false, message });
}

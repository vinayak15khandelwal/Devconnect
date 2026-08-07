import { Request, Response, NextFunction } from "express";

// Attaches res.success() and res.fail() helpers so every endpoint
// returns the consistent { success, data, message } shape required
// by the project brief.
declare global {
  namespace Express {
    interface Response {
      success: (data?: unknown, message?: string) => void;
      fail: (message: string, statusCode?: number) => void;
    }
  }
}

export function responseFormatter(_req: Request, res: Response, next: NextFunction) {
  res.success = (data?: unknown, message = "OK") => {
    res.json({ success: true, data, message });
  };
  res.fail = (message = "Something went wrong", statusCode = 400) => {
    res.status(statusCode).json({ success: false, message });
  };
  next();
}

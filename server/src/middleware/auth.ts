import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export interface AuthedRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;
  const token = req.cookies?.token || bearer;

  if (!token) return res.fail("Not authenticated", 401);

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res.fail("Invalid or expired session", 401);
  }
}

// Attaches req.userId if a valid token is present, but does not block
// the request otherwise — useful for endpoints with optional personalization.
export function attachUserIfPresent(req: AuthedRequest, _res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;
  const token = req.cookies?.token || bearer;
  if (token) {
    try {
      req.userId = verifyToken(token).userId;
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
}

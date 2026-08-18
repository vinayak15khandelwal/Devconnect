import rateLimit from "express-rate-limit";

// Applied to register/login only — the endpoints where an attacker would
// actually gain from brute-forcing (credential stuffing, password guessing).
// Not applied globally: that would just degrade normal usage without
// addressing the actual risk.
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

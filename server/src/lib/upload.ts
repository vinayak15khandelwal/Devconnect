import multer from "multer";

// Shared multer config for every image upload endpoint (avatar, project
// image). Two things the 2MB-limit-only config was missing:
// 1. A fileFilter — without one, multer accepts ANY file as an "image"
//    upload up to the size cap (a renamed .exe, an HTML file, etc.).
// 2. Rejecting on the field itself, not just relying on Cloudinary to
//    reject it later — fail fast, server-side, before any upload attempt.
export const imageUpload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max per brief
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
    }
    cb(null, true);
  },
});

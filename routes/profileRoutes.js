import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getProfile,
  updateProfile,
  updatePassword,
  updateProfileImage,
} from "../controllers/profileController.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, `profile-${req.user._id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.get("/", ensureAuth, getProfile);
router.post("/update", ensureAuth, updateProfile);
router.post("/update-password", ensureAuth, updatePassword);

router.post(
  "/update-image",
  ensureAuth,
  (req, res, next) => {
    upload.single("profileImage")(req, res, function (err) {
      if (err) {
        req.flash("error", err.message || "Error uploading file");
        return res.redirect("/profile");
      }
      next();
    });
  },
  updateProfileImage,
);

export default router;

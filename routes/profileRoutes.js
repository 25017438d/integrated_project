import express from "express";
import { getProfile, updateProfile, updatePassword, updateProfileImage } from "../controllers/profileController.js";
import { ensureAuth } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer configuration for profile images
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});
 
// Accept only image files and limit to 2MB
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

// Profile routes
router.get("/", ensureAuth, getProfile);
router.post("/update", ensureAuth, updateProfile);
router.post("/update-password", ensureAuth, updatePassword);
// Wrap multer so we can handle upload errors and show flash messages
router.post("/update-image", ensureAuth, (req, res, next) => {
  upload.single('profileImage')(req, res, function (err) {
    if (err) {
      // Multer error (file too large / invalid type)
      req.flash('error', err.message || 'Error uploading file');
      return res.redirect('/profile');
    }
    next();
  });
}, updateProfileImage);

export default router;

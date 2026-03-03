import express from "express";
import { getProfile, updateProfile, updatePassword, updateProfileImage } from "../controllers/profileController.js";
import { ensureAuth } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer configuration for profile images
// use memory storage so we can either save to Mongo or forward to a cloud store
const upload = multer({
  storage: multer.memoryStorage(),
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
  // log headers to file for debugging
  try {
    fs.appendFileSync('upload-debug.log', JSON.stringify(req.headers) + '\n');
  } catch (e) {
    console.error('Failed to write debug log', e);
  }
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

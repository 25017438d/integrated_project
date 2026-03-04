import express from "express";
import multer from "multer";
import {
  getAllNotices,
  getMyNotices,
  renderNoticeForm,
  createNotice,
  deleteNotice,
  replyToNotice,
} from "../controllers/noticeController.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure Multer for image uploads
// save files to disk; only allow image types and limit size to 2MB
const upload = multer({
  dest: "public/uploads/",
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.get("/", getAllNotices);
router.get("/my", ensureAuth, getMyNotices);
router.get("/new", ensureAuth, renderNoticeForm);
// Wrap multer so file-upload errors can be captured and flashed (same approach as profileRoutes)
router.post("/new", ensureAuth, (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      // Multer error or file handling issue
      req.flash("error", err.message || "Error uploading image");
      return res.redirect("/notices/new");
    }
    createNotice(req, res);
  });
});
router.delete("/:id", ensureAuth, deleteNotice);
router.post("/:id/reply", ensureAuth, replyToNotice);

export default router;

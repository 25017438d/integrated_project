import express from "express";
import multer from "multer";
import {
  getAllNotices,
  renderNoticeForm,
  createNotice,
  deleteNotice,
  replyToNotice,
} from "../controllers/noticeController.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure Multer for image uploads
const upload = multer({ dest: "public/uploads/" });

router.get("/", getAllNotices);
router.get("/new", ensureAuth, renderNoticeForm);
router.post("/new", ensureAuth, upload.single("image"), createNotice);
router.delete("/:id", ensureAuth, deleteNotice);
router.post("/:id/reply", ensureAuth, replyToNotice);

export default router;
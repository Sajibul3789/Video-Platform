import { Router } from "express";
import multer from "multer";
import {
  uploadVideo,
  getAllVideos,
  getVideo,
  deleteVideo,
} from "../controllers/videoController";
import { authenticate, isAdmin } from "../middleware/auth";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getAllVideos);
router.get("/:id", getVideo);
router.post(
  "/upload",
  authenticate,
  isAdmin,
  upload.single("video"),
  uploadVideo,
);
router.delete("/:id", authenticate, isAdmin, deleteVideo);

export default router;

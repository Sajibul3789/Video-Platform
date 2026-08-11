import { Router } from "express";
import multer from "multer";
import {
  uploadVideo,
  getAllVideos,
  getVideo,
  deleteVideo,
} from "../controllers/videoController";
import { authenticate, isAdmin } from "../middleware/auth";
import path from "path";
import fs from "fs";

const router = Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only MP4, WebM, and OGG are allowed."));
    }
  },
});

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

import { Router } from "express";
import multer from "multer";
import {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
} from "../controllers/postController";
import { authenticate, isAdmin } from "../middleware/auth";
import path from "path";
import fs from "fs";

const router = Router();

// Configure multer for image uploads
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
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        ),
      );
    }
  },
});

router.get("/", getAllPosts);
router.get("/:id", getPost);
router.post(
  "/create",
  authenticate,
  isAdmin,
  upload.single("image"),
  createPost,
);
router.delete("/:id", authenticate, isAdmin, deletePost);

export default router;

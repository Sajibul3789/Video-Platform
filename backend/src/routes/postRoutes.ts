import { Router } from "express";
import multer from "multer";
import {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
} from "../controllers/postController";
import { authenticate, isAdmin } from "../middleware/auth";

const router = Router();
const upload = multer({ dest: "uploads/" });

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

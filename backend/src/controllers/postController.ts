import { Response } from "express";
import cloudinary from "../config/cloudinary";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";
import fs from "fs";

// Get all posts
export const getAllPosts = async (req: any, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// Get single post
export const getPost = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    // Ensure id is a string
    const postId = Array.isArray(id) ? id[0] : id;

    if (!postId) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching post" });
  }
};

// Create post
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    let imageUrl = "";

    // Handle image upload
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "posts",
          transformation: [
            { width: 1200, height: 630, crop: "fill" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        });
        imageUrl = result.secure_url;

        // Clean up temp file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating post" });
  }
};

// Delete post
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Ensure id is a string
    const postId = Array.isArray(id) ? id[0] : id;

    if (!postId) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post or is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (post.userId !== userId && !user?.isAdmin) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this post" });
    }

    // Delete image from Cloudinary if exists
    if (post.imageUrl) {
      try {
        const publicId = post.imageUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`posts/${publicId}`);
        }
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
      }
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting post" });
  }
};

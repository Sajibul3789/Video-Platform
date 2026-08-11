import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";
import fs from "fs";
import path from "path";

// Get all videos
export const getAllVideos = async (req: any, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
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
    });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching videos" });
  }
};

// Get single video
export const getVideo = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    // Ensure id is a string
    const videoId = Array.isArray(id) ? id[0] : id;

    if (!videoId) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
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

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Increment views
    await prisma.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } },
    });

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching video" });
  }
};

// Upload video
export const uploadVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.isAdmin) {
      return res.status(403).json({ message: "Only admins can upload videos" });
    }

    let videoUrl = "";
    let thumbnailUrl = "";

    // Handle video upload
    if (req.file) {
      try {
        // Upload video to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "video",
          folder: "videos",
          chunk_size: 6000000,
        });
        videoUrl = result.secure_url;

        // Generate thumbnail from video
        const thumbnailResult = await cloudinary.uploader.upload(
          req.file.path,
          {
            resource_type: "video",
            folder: "thumbnails",
            transformation: [
              { width: 1280, height: 720, crop: "fill" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
            eager: [{ width: 1280, height: 720, crop: "fill", format: "jpg" }],
          },
        );

        if (thumbnailResult.eager && thumbnailResult.eager[0]) {
          thumbnailUrl = thumbnailResult.eager[0].secure_url;
        } else {
          thumbnailUrl = thumbnailResult.secure_url;
        }

        // Clean up temp file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        // Clean up temp file
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(500)
          .json({ message: "Failed to upload video to Cloudinary" });
      }
    } else {
      return res.status(400).json({ message: "No video file provided" });
    }

    // Create video record in database
    const video = await prisma.video.create({
      data: {
        title,
        description: description || "",
        videoUrl,
        thumbnailUrl,
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
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading video" });
  }
};

// Delete video
export const deleteVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Ensure id is a string
    const videoId = Array.isArray(id) ? id[0] : id;

    if (!videoId) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Check if user owns the video or is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (video.userId !== userId && !user?.isAdmin) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this video" });
    }

    // Delete from Cloudinary
    try {
      const publicId = video.videoUrl.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`videos/${publicId}`, {
          resource_type: "video",
        });
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary delete error:", cloudinaryError);
    }

    // Delete from database
    await prisma.video.delete({
      where: { id: videoId },
    });

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting video" });
  }
};

import { Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";

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

export const getVideo = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id },
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
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching video" });
  }
};

export const uploadVideo = async (req: AuthRequest, res: Response) => {
  res.json({ message: "Upload endpoint - needs Cloudinary setup" });
};

export const deleteVideo = async (req: AuthRequest, res: Response) => {
  res.json({ message: "Delete endpoint" });
};

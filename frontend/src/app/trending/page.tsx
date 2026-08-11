"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaFire,
  FaEye,
  FaThumbsUp,
  FaComment,
  FaPlay,
  FaTrophy,
} from "react-icons/fa";
import api from "@/lib/api";
import { formatViews, formatDate } from "@/lib/utils";

export default function TrendingPage() {
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [videosRes, postsRes] = await Promise.all([
        api.get("/videos"),
        api.get("/posts"),
      ]);
      setVideos(videosRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const allContent = [
    ...videos.map((v: any) => ({ ...v, type: "video" as const })),
    ...posts.map((p: any) => ({ ...p, type: "post" as const })),
  ].sort((a: any, b: any) => (b.views || 0) - (a.views || 0));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/60"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl">
          <FaFire className="text-white text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Trending</h1>
          <p className="text-gray-400 text-sm">
            Most popular content right now
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {allContent.map((item: any, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.5) }}
          >
            <div className="glass-modern p-4 flex items-center gap-4 hover:bg-white/10 transition">
              <div className="flex items-center justify-center min-w-[60px]">
                {index < 3 ? (
                  <div
                    className={`text-3xl font-bold ${
                      index === 0
                        ? "text-yellow-400"
                        : index === 1
                          ? "text-gray-300"
                          : "text-orange-400"
                    }`}
                  >
                    #{index + 1}
                  </div>
                ) : (
                  <span className="text-xl font-bold text-gray-500">
                    #{index + 1}
                  </span>
                )}
              </div>
              {item.type === "video" ? (
                <TrendingVideoCard video={item} />
              ) : (
                <TrendingPostCard post={item} />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TrendingVideoCard({ video }: { video: any }) {
  return (
    <Link
      href={`/video/${video.id}`}
      className="flex-1 flex items-center gap-4"
    >
      <div className="w-32 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
        {video.thumbnailUrl && (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-white line-clamp-2">
          {video.title}
        </h3>
        <p className="text-sm text-gray-400 mt-1">{video.user?.name}</p>
        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
          <span>{formatViews(video.views)} views</span>
          <span>•</span>
          <span>{formatDate(video.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

function TrendingPostCard({ post }: { post: any }) {
  return (
    <div className="flex-1">
      <h3 className="text-base font-medium text-white">{post.title}</h3>
      <p className="text-sm text-gray-400 mt-1">{post.user?.name}</p>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
        <span>{formatDate(post.createdAt)}</span>
      </div>
    </div>
  );
}

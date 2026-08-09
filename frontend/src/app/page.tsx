"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlay, FaEye, FaUpload } from "react-icons/fa";
import { HeroSection } from "@/components/layout/HeroSection";
import { formatViews } from "@/lib/utils";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setError(null);
      const response = await api.get("/videos");
      setVideos(response.data);
    } catch (err: any) {
      console.error("Error fetching videos:", err);
      if (err.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to server. Please make sure the backend is running.",
        );
      } else {
        setError(err.response?.data?.message || "Failed to load videos");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-lg w-full text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchVideos}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Videos
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {videos.length} videos
          </span>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No Videos Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Be the first to upload a video!
            </p>
            {isAuthenticated && user?.isAdmin && (
              <Link href="/upload">
                <button className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
                  <FaUpload className="mr-2" />
                  Upload First Video
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Link key={video.id} href={`/video/${video.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaPlay className="text-4xl text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <FaPlay className="text-white text-2xl" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2 line-clamp-2">
                      {video.title || "Untitled"}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        {video.user?.name || "Unknown"}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <FaEye className="w-3 h-3" />
                        <span>{formatViews(video.views || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

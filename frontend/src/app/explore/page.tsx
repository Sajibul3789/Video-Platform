"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaFire,
  FaEye,
  FaThumbsUp,
  FaComment,
  FaPlay,
  FaFilter,
} from "react-icons/fa";
import { IoGrid, IoList } from "react-icons/io5";
import api from "@/lib/api";
import { formatViews, formatDate } from "@/lib/utils";

export default function ExplorePage() {
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "videos" | "posts">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">(
    "recent",
  );

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
  ];

  const filteredContent = allContent
    .filter((item: any) => {
      if (filter === "videos") return item.type === "video";
      if (filter === "posts") return item.type === "post";
      return true;
    })
    .filter((item: any) => {
      if (!searchQuery) return true;
      return (
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a: any, b: any) => {
      if (sortBy === "popular") return (b.views || 0) - (a.views || 0);
      if (sortBy === "trending") return (b.views || 0) - (a.views || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/60"></div>
      </div>
    );
  }

  return (
    <div className="full-width py-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Explore</h1>
            <p className="text-gray-400 text-sm mt-1">
              Discover amazing content from creators
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-none relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search..."
                className="input-modern pl-10 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <IoGrid className="text-xl" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <IoList className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="tab-nav-facebook flex-1 md:flex-none">
            {[
              { id: "all", label: "All" },
              { id: "videos", label: "Videos" },
              { id: "posts", label: "Posts" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`tab-item-facebook ${filter === tab.id ? "active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <select
            className="input-modern px-4 py-2 text-sm min-h-[40px] w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        {/* Results Count */}
        <p className="text-gray-400 text-sm mb-4">
          Showing {filteredContent.length} results
        </p>

        {/* Content Grid */}
        <div
          className={`grid gap-4 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredContent.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              <FaSearch className="text-5xl mx-auto mb-4 opacity-20" />
              <p>No content found</p>
            </div>
          ) : (
            filteredContent.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
              >
                {item.type === "video" ? (
                  <ExploreVideoCard video={item} viewMode={viewMode} />
                ) : (
                  <ExplorePostCard post={item} viewMode={viewMode} />
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ExploreVideoCard({
  video,
  viewMode,
}: {
  video: any;
  viewMode: "grid" | "list";
}) {
  return (
    <Link href={`/video/${video.id}`}>
      <div
        className={`video-card-youtube ${viewMode === "list" ? "flex gap-4" : ""}`}
      >
        <div className={viewMode === "list" ? "w-48 flex-shrink-0" : "w-full"}>
          <div className="video-thumbnail-youtube">
            {video.thumbnailUrl ? (
              <img src={video.thumbnailUrl} alt={video.title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <FaPlay className="text-3xl text-white/20" />
              </div>
            )}
            <div className="video-duration-badge">12:34</div>
          </div>
        </div>
        <div
          className={`video-info-youtube ${viewMode === "list" ? "flex-1" : ""}`}
        >
          <h3 className="video-title-youtube">{video.title}</h3>
          <p className="video-channel-youtube">{video.user?.name}</p>
          <div className="video-meta-youtube">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ExplorePostCard({
  post,
  viewMode,
}: {
  post: any;
  viewMode: "grid" | "list";
}) {
  return (
    <div
      className={`post-card-facebook ${viewMode === "list" ? "flex gap-4" : ""}`}
    >
      <div className="post-header-facebook">
        <div className="post-avatar-facebook">
          {post.user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <p className="post-user-name-facebook">{post.user?.name}</p>
          <span className="post-time-facebook">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>
      <div className="post-content-facebook">
        <h3 className="post-title-facebook">{post.title}</h3>
        <p className="post-text-facebook line-clamp-3">{post.content}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="post-image-facebook max-h-48"
          />
        )}
      </div>
    </div>
  );
}

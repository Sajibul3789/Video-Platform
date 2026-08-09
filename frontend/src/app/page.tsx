"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaEye,
  FaUpload,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaBookmark,
  FaUser,
  FaClock,
  FaEllipsisH,
  FaUsers,
  FaFire,
  FaVideo,
  FaNewspaper,
  FaRocket,
  FaPlus,
  FaSearch,
  FaBell,
  FaYoutube,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { formatViews, formatDate } from "@/lib/utils";
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
  _count?: {
    comments: number;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    comments: number;
  };
}

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "posts">("all");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

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

  const handleLike = (id: string) => {
    const newLiked = new Set(likedItems);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedItems(newLiked);
  };

  const handleSave = (id: string) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedItems(newSaved);
  };

  const allContent = [
    ...videos.map((v) => ({ ...v, type: "video" as const })),
    ...posts.map((p) => ({ ...p, type: "post" as const })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const filteredContent =
    activeTab === "all"
      ? allContent
      : activeTab === "videos"
        ? allContent.filter((item) => item.type === "video")
        : allContent.filter((item) => item.type === "post");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a]">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* User Card */}
            <div className="bg-white dark:bg-[#181818] rounded-xl p-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {user?.isAdmin && (
                      <span className="text-xs bg-[#1877f2] text-white px-2 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-3 text-sm">
                    Join the community
                  </p>
                  <Link href="/register">
                    <button className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-6 py-2 rounded-full text-sm font-medium transition">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Trending */}
            <div className="bg-white dark:bg-[#181818] rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <FaFire className="text-[#ff4500]" />
                Trending
              </h3>
              {[
                "#VideoHub",
                "#CreatorCommunity",
                "#ViralVideos",
                "#ContentCreators",
              ].map((tag, i) => (
                <div
                  key={tag}
                  className="flex items-center gap-3 text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] p-2 rounded-lg cursor-pointer transition"
                >
                  <span className="text-gray-400 font-medium">{i + 1}</span>
                  <span>{tag}</span>
                </div>
              ))}
            </div>

            {/* Suggested */}
            <div className="bg-white dark:bg-[#181818] rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <FaUsers className="text-[#1877f2]" />
                Suggested
              </h3>
              {["Creator 1", "Creator 2", "Creator 3"].map((name) => (
                <div key={name} className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#e4e6eb] dark:bg-[#2a2a2a] flex items-center justify-center text-xs font-bold">
                    {name.charAt(0)}
                  </div>
                  <span className="text-sm flex-1">{name}</span>
                  <button className="text-xs bg-[#1877f2] text-white px-3 py-1 rounded-full hover:bg-[#166fe5] transition">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6">
            {/* Stories */}
            <div className="bg-white dark:bg-[#181818] rounded-xl p-4 mb-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-6">
                {isAuthenticated && (
                  <div className="flex flex-col items-center cursor-pointer">
                    <div className="story-circle">
                      <div className="story-circle-inner bg-[#1877f2]">
                        <FaPlus className="text-white" />
                      </div>
                    </div>
                    <span className="story-name">Create</span>
                  </div>
                )}
                {["Story 1", "Story 2", "Story 3", "Story 4"].map((story) => (
                  <div
                    key={story}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="story-circle">
                      <div className="story-circle-inner bg-gray-300 dark:bg-[#2a2a2a]">
                        {story.charAt(0)}
                      </div>
                    </div>
                    <span className="story-name">{story}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Post */}
            {isAuthenticated && (
              <div className="create-bar mb-4">
                <div className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div
                  className="create-input"
                  onClick={() => (window.location.href = "/upload")}
                >
                  What's on your mind?
                </div>
                {user?.isAdmin && (
                  <button
                    onClick={() => (window.location.href = "/upload")}
                    className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-4 py-1.5 rounded-full text-sm font-medium transition"
                  >
                    <FaUpload className="inline mr-1" /> Upload
                  </button>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white dark:bg-[#181818] rounded-xl p-1 mb-4">
              <div className="flex rounded-lg overflow-hidden">
                {[
                  { id: "all", label: "All", icon: FaRocket },
                  { id: "videos", label: "Videos", icon: FaVideo },
                  { id: "posts", label: "Posts", icon: FaNewspaper },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                        isActive
                          ? "bg-[#1877f2] text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                      }`}
                    >
                      <Icon className={isActive ? "text-white" : ""} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feed */}
            <AnimatePresence>
              <div className="space-y-4">
                {filteredContent.length === 0 ? (
                  <div className="bg-white dark:bg-[#181818] rounded-xl p-12 text-center">
                    <div className="text-5xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Content Yet
                    </h3>
                    <p className="text-gray-500 text-sm">Check back later</p>
                  </div>
                ) : (
                  filteredContent.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {item.type === "video" ? (
                        <VideoCard
                          video={item as Video}
                          likedItems={likedItems}
                          savedItems={savedItems}
                          onLike={handleLike}
                          onSave={handleSave}
                          isAuthenticated={isAuthenticated}
                        />
                      ) : (
                        <PostCard
                          post={item as Post}
                          likedItems={likedItems}
                          savedItems={savedItems}
                          onLike={handleLike}
                          onSave={handleSave}
                          isAuthenticated={isAuthenticated}
                        />
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Social Links */}
            <div className="bg-white dark:bg-[#181818] rounded-xl p-4">
              <div className="flex items-center justify-around">
                <FaYoutube className="text-2xl text-red-600 cursor-pointer hover:scale-110 transition" />
                <FaFacebook className="text-2xl text-[#1877f2] cursor-pointer hover:scale-110 transition" />
                <FaInstagram className="text-2xl text-[#e4405f] cursor-pointer hover:scale-110 transition" />
              </div>
            </div>

            {/* Recommended */}
            <div className="bg-white dark:bg-[#181818] rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">Recommended</h3>
              {videos.slice(0, 3).map((video) => (
                <Link key={video.id} href={`/video/${video.id}`}>
                  <div className="flex gap-3 mb-3 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] p-2 rounded-lg transition cursor-pointer">
                    <div className="w-20 h-12 bg-gray-200 dark:bg-[#2a2a2a] rounded-lg overflow-hidden flex-shrink-0">
                      {video.thumbnailUrl && (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">
                        {video.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {video.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatViews(video.views)} views
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-[#181818] rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">Community</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Videos</span>
                  <span className="font-medium">{videos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Posts</span>
                  <span className="font-medium">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Views</span>
                  <span className="font-medium">
                    {videos
                      .reduce((acc, v) => acc + v.views, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Video Card Component
function VideoCard({
  video,
  likedItems,
  savedItems,
  onLike,
  onSave,
  isAuthenticated,
}: {
  video: Video;
  likedItems: Set<string>;
  savedItems: Set<string>;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  isAuthenticated: boolean;
}) {
  const isLiked = likedItems.has(video.id);
  const isSaved = savedItems.has(video.id);

  return (
    <div className="video-card">
      <Link href={`/video/${video.id}`}>
        <div className="video-thumbnail">
          {video.thumbnailUrl ? (
            <img src={video.thumbnailUrl} alt={video.title} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaPlay className="text-3xl text-gray-400" />
            </div>
          )}
          <div className="video-duration">12:34</div>
        </div>
      </Link>

      <div className="video-info">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-xs">
              {video.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/video/${video.id}`}>
              <h3 className="video-title">{video.title}</h3>
            </Link>
            <p className="video-channel">{video.user?.name}</p>
            <div className="video-meta flex items-center gap-1 mt-1">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>
          <button className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-full transition">
            <FaEllipsisH className="text-gray-500 text-sm" />
          </button>
        </div>

        {video.description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 ml-11">
            {video.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-[#2a2a2a]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => isAuthenticated && onLike(video.id)}
              className={`action-btn ${isLiked ? "active" : ""} ${!isAuthenticated && "cursor-not-allowed opacity-50"}`}
              disabled={!isAuthenticated}
            >
              <FaThumbsUp />
              <span>{isLiked ? "Liked" : "Like"}</span>
            </button>
            <Link href={`/video/${video.id}#comments`}>
              <button className="action-btn">
                <FaComment />
                <span>{video._count?.comments || 0}</span>
              </button>
            </Link>
            <button className="action-btn">
              <FaShare />
            </button>
          </div>
          <button
            onClick={() => isAuthenticated && onSave(video.id)}
            className={`action-btn ${isSaved ? "active" : ""} ${!isAuthenticated && "cursor-not-allowed opacity-50"}`}
            disabled={!isAuthenticated}
          >
            <FaBookmark />
          </button>
        </div>
      </div>
    </div>
  );
}

// Post Card Component
function PostCard({
  post,
  likedItems,
  savedItems,
  onLike,
  onSave,
  isAuthenticated,
}: {
  post: Post;
  likedItems: Set<string>;
  savedItems: Set<string>;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  isAuthenticated: boolean;
}) {
  const isLiked = likedItems.has(post.id);
  const isSaved = savedItems.has(post.id);

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">
          {post.user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <p className="post-user-name">{post.user?.name}</p>
          <div className="flex items-center gap-2">
            <span className="post-time">{formatDate(post.createdAt)}</span>
            <span className="text-gray-400">•</span>
            <span className="text-xs bg-gray-200 dark:bg-[#2a2a2a] px-2 rounded-full text-gray-600 dark:text-gray-400">
              Post
            </span>
          </div>
        </div>
        <button className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-full transition">
          <FaEllipsisH className="text-gray-500" />
        </button>
      </div>

      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-text">{post.content}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="post-image" />
        )}
      </div>

      <div className="post-actions">
        <button
          onClick={() => isAuthenticated && onLike(post.id)}
          className={`action-btn ${isLiked ? "active" : ""} ${!isAuthenticated && "cursor-not-allowed opacity-50"}`}
          disabled={!isAuthenticated}
        >
          <FaThumbsUp />
          <span>{isLiked ? "Liked" : "Like"}</span>
        </button>
        <button className="action-btn">
          <FaComment />
          <span>{post._count?.comments || 0}</span>
        </button>
        <button className="action-btn">
          <FaShare />
          <span>Share</span>
        </button>
        <button
          onClick={() => isAuthenticated && onSave(post.id)}
          className={`action-btn ${isSaved ? "active" : ""} ${!isAuthenticated && "cursor-not-allowed opacity-50"}`}
          disabled={!isAuthenticated}
        >
          <FaBookmark />
        </button>
      </div>
    </div>
  );
}

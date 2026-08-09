"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaUpload,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaBookmark,
  FaEllipsisH,
  FaUsers,
  FaFire,
  FaVideo,
  FaNewspaper,
  FaRocket,
  FaPlus,
  FaBell,
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
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white/30 mx-auto"></div>
          <p className="mt-4 text-white/30 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-full">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-4 w-full">
          {/* User Card */}
          <div className="sidebar-card w-full">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white font-semibold text-lg border border-white/10">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-white/40">{user?.email}</p>
                  {user?.isAdmin && (
                    <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full inline-block mt-1">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-white/50 mb-4">Join the community</p>
                <Link href="/register">
                  <button className="btn-glass btn-glass-primary px-8 py-2.5">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Trending */}
          <div className="sidebar-card w-full">
            <h3 className="sidebar-title flex items-center gap-2">
              <FaFire className="text-white/40" />
              Trending
            </h3>
            {[
              "#VideoHub",
              "#CreatorCommunity",
              "#ViralVideos",
              "#ContentCreators",
            ].map((tag, i) => (
              <div key={tag} className="list-item">
                <span className="list-item-number">{i + 1}</span>
                <span className="list-item-text">{tag}</span>
              </div>
            ))}
          </div>

          {/* Suggested */}
          <div className="sidebar-card w-full">
            <h3 className="sidebar-title flex items-center gap-2">
              <FaUsers className="text-white/40" />
              Suggested
            </h3>
            {["Creator 1", "Creator 2", "Creator 3"].map((name) => (
              <div key={name} className="flex items-center gap-3 mb-3 w-full">
                <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-white/60 text-sm font-medium">
                  {name.charAt(0)}
                </div>
                <span className="text-sm text-white/60 flex-1">{name}</span>
                <button className="btn-glass text-xs py-1.5 px-4">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-4 w-full">
          {/* Stories */}
          <div className="sidebar-card w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-6">
              {isAuthenticated && (
                <div className="flex flex-col items-center cursor-pointer">
                  <div className="story-circle">
                    <div className="story-circle-inner bg-white/8">
                      <FaPlus className="text-white/40" />
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
                    <div className="story-circle-inner bg-white/8 text-white/60">
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
            <div className="create-bar w-full">
              <div className="w-10 h-10 rounded-full bg-white/12 flex items-center justify-center text-white font-semibold text-sm">
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
                  className="btn-glass btn-glass-primary"
                >
                  <FaUpload className="mr-1.5" /> Upload
                </button>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="tab-glass w-full">
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
                  className={`tab-item ${isActive ? "active" : ""}`}
                >
                  <Icon className={isActive ? "text-white" : "text-white/30"} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Feed */}
          <AnimatePresence>
            <div className="space-y-4 w-full">
              {filteredContent.length === 0 ? (
                <div className="glass p-12 text-center w-full">
                  <div className="text-5xl mb-4 opacity-20">📝</div>
                  <h3 className="text-xl font-semibold text-white/50 mb-2">
                    No Content
                  </h3>
                  <p className="text-white/20">Check back later</p>
                </div>
              ) : (
                filteredContent.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full"
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
        <div className="lg:col-span-3 space-y-4 w-full">
          {/* Recommended */}
          <div className="sidebar-card w-full">
            <h3 className="sidebar-title">Recommended</h3>
            {videos.slice(0, 3).map((video) => (
              <Link key={video.id} href={`/video/${video.id}`}>
                <div className="flex gap-3 mb-4 hover:bg-white/5 p-2 rounded-lg transition cursor-pointer w-full">
                  <div className="w-24 h-14 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                    {video.thumbnailUrl && (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 font-medium line-clamp-2">
                      {video.title}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      {video.user?.name}
                    </p>
                    <p className="text-xs text-white/30">
                      {formatViews(video.views)} views
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="sidebar-card w-full">
            <h3 className="sidebar-title">Community Stats</h3>
            <div className="space-y-2">
              <div className="stat-item">
                <span className="stat-label">Total Videos</span>
                <span className="stat-value">{videos.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Posts</span>
                <span className="stat-value">{posts.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Views</span>
                <span className="stat-value">
                  {videos.reduce((acc, v) => acc + v.views, 0).toLocaleString()}
                </span>
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
    <div className="video-card w-full">
      <Link href={`/video/${video.id}`}>
        <div className="video-thumbnail">
          {video.thumbnailUrl ? (
            <img src={video.thumbnailUrl} alt={video.title} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaPlay className="text-3xl text-white/10" />
            </div>
          )}
          <div className="video-duration">12:34</div>
        </div>
      </Link>

      <div className="video-info">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-9 h-9 rounded-full bg-white/12 flex items-center justify-center text-white/70 font-semibold text-sm">
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
          <button className="flex-shrink-0 p-1.5 hover:bg-white/5 rounded-full transition">
            <FaEllipsisH className="text-white/30 text-sm" />
          </button>
        </div>

        {video.description && (
          <p className="mt-2 text-sm text-white/50 line-clamp-2 ml-12">
            {video.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
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
    <div className="post-card w-full">
      <div className="post-header">
        <div className="post-avatar">
          {post.user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <p className="post-user-name">{post.user?.name}</p>
          <div className="flex items-center gap-2">
            <span className="post-time">{formatDate(post.createdAt)}</span>
            <span className="text-white/10">•</span>
            <span className="badge-glass">Post</span>
          </div>
        </div>
        <button className="ml-auto p-1.5 hover:bg-white/5 rounded-full transition">
          <FaEllipsisH className="text-white/30" />
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

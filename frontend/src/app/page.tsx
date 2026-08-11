"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaBookmark,
  FaEllipsisH,
  FaFire,
  FaVideo,
  FaNewspaper,
  FaRocket,
  FaPlus,
  FaWifi,
  FaHome,
  FaCompass,
  FaUpload,
  FaUserPlus,
  FaHeart,
  FaEye,
} from "react-icons/fa";
import { formatViews, formatDate } from "@/lib/utils";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-hot-toast";

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  createdAt: string;
  user: { id: string; name: string; email: string };
  _count?: { comments: number };
}

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
  _count: { comments: number };
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/60 mx-auto"></div>
        <p className="mt-4 text-white/30 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔌</div>
        <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="btn-primary px-8 py-3 flex items-center gap-2 mx-auto"
        >
          <FaWifi className="text-sm" />
          Retry Connection
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "posts">("all");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [followedCreators, setFollowedCreators] = useState<Set<string>>(
    new Set(),
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchContent();

    const cleanup = () => {
      document.querySelectorAll("[bis_skin_checked]").forEach((el) => {
        el.removeAttribute("bis_skin_checked");
      });
    };

    cleanup();
    const interval = setInterval(cleanup, 500);
    const observer = new MutationObserver(() => cleanup());
    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["bis_skin_checked"],
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const [videosRes, postsRes] = await Promise.all([
        api.get("/videos"),
        api.get("/posts"),
      ]);
      setVideos(videosRes.data);
      setPosts(postsRes.data);
    } catch (error: any) {
      console.error("Error fetching content:", error);
      if (error.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to the backend server. Please make sure the backend is running.",
        );
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load content",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string, type: "video" | "post") => {
    if (!isAuthenticated) {
      toast.error("Please login to like content");
      return;
    }
    const newLiked = new Set(likedItems);
    if (newLiked.has(id)) {
      newLiked.delete(id);
      toast.success("Unliked");
    } else {
      newLiked.add(id);
      toast.success("Liked!");
    }
    setLikedItems(newLiked);
  };

  const handleSave = async (id: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to save content");
      return;
    }
    const newSaved = new Set(savedItems);
    if (newSaved.has(id)) {
      newSaved.delete(id);
      toast.success("Removed from saved");
    } else {
      newSaved.add(id);
      toast.success("Saved!");
    }
    setSavedItems(newSaved);
  };

  const handleFollow = async (creatorId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to follow creators");
      return;
    }
    const newFollowed = new Set(followedCreators);
    if (newFollowed.has(creatorId)) {
      newFollowed.delete(creatorId);
      toast.success("Unfollowed");
    } else {
      newFollowed.add(creatorId);
      toast.success("Following!");
    }
    setFollowedCreators(newFollowed);
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

  if (!mounted) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchContent} />;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="full-width py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
          <div className="sidebar-youtube sticky top-20">
            <div className="flex items-center gap-3 mb-6 p-2 rounded-lg bg-white/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-white">
                  {user?.name || "Guest"}
                </p>
                <p className="text-sm text-gray-400">
                  {user?.email || "Sign in"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              {[
                { icon: FaHome, label: "Home", href: "/", active: true },
                { icon: FaFire, label: "Trending", href: "/trending" },
                { icon: FaCompass, label: "Explore", href: "/explore" },
                { icon: FaVideo, label: "Videos", href: "/explore?tab=videos" },
                { icon: FaNewspaper, label: "Posts", href: "/posts" },
              ].map((item) => (
                <Link key={item.label} href={item.href}>
                  <div
                    className={`sidebar-item-youtube ${item.active ? "active" : ""}`}
                  >
                    <item.icon className="text-xl" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="col-span-1 lg:col-span-7 xl:col-span-7 space-y-4">
          {/* Stories */}
          <div className="glass-modern p-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 min-w-max">
              {isAuthenticated && (
                <div className="flex flex-col items-center cursor-pointer">
                  <div className="story-circle-instagram">
                    <div className="story-circle-inner-instagram bg-white/10">
                      <FaPlus className="text-white/60 text-xl" />
                    </div>
                  </div>
                  <span className="story-name-instagram">Create</span>
                </div>
              )}
              {["Alice", "Bob", "Charlie", "Diana", "Eva"].map((name) => (
                <div
                  key={name}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="story-circle-instagram">
                    <div className="story-circle-inner-instagram bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold">
                      {name.charAt(0)}
                    </div>
                  </div>
                  <span className="story-name-instagram">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Create Post Bar */}
          {isAuthenticated && (
            <div className="glass-modern p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div
                className="flex-1 bg-white/5 rounded-full px-4 py-2 text-gray-400 cursor-pointer hover:bg-white/10 transition"
                onClick={() => (window.location.href = "/upload")}
              >
                What's on your mind?
              </div>
              {user?.isAdmin && (
                <Link href="/upload">
                  <button className="btn-primary text-sm px-6 py-2">
                    <FaUpload className="inline mr-2" />
                    Upload
                  </button>
                </Link>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="tab-nav-facebook">
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
                  className={`tab-item-facebook ${isActive ? "active" : ""}`}
                >
                  <Icon className={isActive ? "text-white" : "text-gray-500"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Feed */}
          <div className="space-y-4">
            {filteredContent.length === 0 ? (
              <div className="glass-modern p-12 text-center">
                <div className="text-5xl mb-4 opacity-30">📝</div>
                <h3 className="text-xl font-semibold text-white/50">
                  No Content Yet
                </h3>
                <p className="text-gray-500 mt-2">
                  Check back later for new content
                </p>
              </div>
            ) : (
              filteredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
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
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
          <div className="sticky top-20 space-y-4">
            {/* Trending */}
            <div className="sidebar-youtube">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FaFire className="text-red-500" />
                Trending Now
              </h3>
              {videos.slice(0, 3).map((video, index) => (
                <Link key={video.id} href={`/video/${video.id}`}>
                  <div className="flex gap-3 mb-4 hover:bg-white/5 p-2 rounded-lg transition cursor-pointer">
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
                      <p className="text-sm text-white font-medium line-clamp-2">
                        {video.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
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

            {/* Suggested Creators */}
            <div className="sidebar-youtube">
              <h3 className="text-white font-semibold mb-4">
                Suggested Creators
              </h3>
              {["Alex Chen", "Sarah Johnson", "Mike Wilson"].map((name, i) => (
                <div key={name} className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                    {name.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-400 flex-1">{name}</span>
                  <button
                    onClick={() => handleFollow(`creator-${i}`)}
                    className="btn-primary text-xs px-4 py-1.5"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="sidebar-youtube">
              <h3 className="text-white font-semibold mb-4">Community Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Videos</span>
                  <span className="text-white font-medium">
                    {videos.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Posts</span>
                  <span className="text-white font-medium">{posts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Views</span>
                  <span className="text-white font-medium">
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
  onLike: (id: string, type: "video" | "post") => void;
  onSave: (id: string) => void;
  isAuthenticated: boolean;
}) {
  const isLiked = likedItems.has(video.id);
  const isSaved = savedItems.has(video.id);

  return (
    <div className="video-card-youtube">
      <Link href={`/video/${video.id}`}>
        <div className="video-thumbnail-youtube">
          {video.thumbnailUrl ? (
            <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <FaPlay className="text-4xl text-white/20" />
            </div>
          )}
          <div className="video-duration-badge">12:34</div>
        </div>
      </Link>

      <div className="video-info-youtube">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
              {video.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/video/${video.id}`}>
              <h3 className="video-title-youtube">{video.title}</h3>
            </Link>
            <div className="flex items-center gap-2">
              <p className="video-channel-youtube">{video.user?.name}</p>
              <span className="text-xs text-gray-600">•</span>
              <span className="text-xs text-gray-600">2 days ago</span>
            </div>
            <div className="video-meta-youtube">
              <span>
                <FaEye className="inline mr-1" /> {formatViews(video.views)}{" "}
                views
              </span>
            </div>
          </div>
          <button className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition">
            <FaEllipsisH className="text-gray-400 text-sm" />
          </button>
        </div>

        {video.description && (
          <p className="mt-2 text-sm text-gray-400 line-clamp-2 ml-12">
            {video.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onLike(video.id, "video")}
              className={`action-btn-facebook ${isLiked ? "active" : ""} ${!isAuthenticated && "opacity-40 cursor-not-allowed"}`}
              disabled={!isAuthenticated}
            >
              <FaThumbsUp className="text-sm" />
              <span>{isLiked ? "Liked" : "Like"}</span>
            </button>
            <Link href={`/video/${video.id}#comments`}>
              <button className="action-btn-facebook">
                <FaComment className="text-sm" />
                <span>{video._count?.comments || 0}</span>
              </button>
            </Link>
            <button className="action-btn-facebook hidden sm:flex">
              <FaShare className="text-sm" />
              <span>Share</span>
            </button>
          </div>
          <button
            onClick={() => onSave(video.id)}
            className={`action-btn-facebook ${isSaved ? "active" : ""} ${!isAuthenticated && "opacity-40 cursor-not-allowed"}`}
            disabled={!isAuthenticated}
          >
            <FaBookmark className="text-sm" />
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
  onLike: (id: string, type: "video" | "post") => void;
  onSave: (id: string) => void;
  isAuthenticated: boolean;
}) {
  const isLiked = likedItems.has(post.id);
  const isSaved = savedItems.has(post.id);

  return (
    <div className="post-card-facebook">
      <div className="post-header-facebook">
        <div className="post-avatar-facebook">
          {post.user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <p className="post-user-name-facebook">{post.user?.name}</p>
          <div className="flex items-center gap-2">
            <span className="post-time-facebook">
              {formatDate(post.createdAt)}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
              Post
            </span>
          </div>
        </div>
        <button className="ml-auto p-1 hover:bg-white/10 rounded-full transition">
          <FaEllipsisH className="text-gray-400" />
        </button>
      </div>

      <div className="post-content-facebook">
        <h3 className="post-title-facebook">{post.title}</h3>
        <p className="post-text-facebook">{post.content}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="post-image-facebook"
            loading="lazy"
          />
        )}
      </div>

      <div className="post-actions-facebook">
        <button
          onClick={() => onLike(post.id, "post")}
          className={`action-btn-facebook ${isLiked ? "active" : ""} ${!isAuthenticated && "opacity-40 cursor-not-allowed"}`}
          disabled={!isAuthenticated}
        >
          <FaThumbsUp className="text-sm" />
          <span>{isLiked ? "Liked" : "Like"}</span>
        </button>
        <button className="action-btn-facebook">
          <FaComment className="text-sm" />
          <span>{post._count?.comments || 0}</span>
        </button>
        <button className="action-btn-facebook hidden sm:flex">
          <FaShare className="text-sm" />
          <span>Share</span>
        </button>
        <button
          onClick={() => onSave(post.id)}
          className={`action-btn-facebook ${isSaved ? "active" : ""} ${!isAuthenticated && "opacity-40 cursor-not-allowed"}`}
          disabled={!isAuthenticated}
        >
          <FaBookmark className="text-sm" />
        </button>
      </div>
    </div>
  );
}

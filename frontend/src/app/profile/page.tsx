"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaUser,
  FaVideo,
  FaNewspaper,
  FaHeart,
  FaBookmark,
  FaCog,
  FaSignOutAlt,
  FaEdit,
  FaCamera,
  FaUsers,
  FaFire,
  FaClock,
  FaEye,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaEllipsisH,
  FaPlay,
  FaUpload,
  FaCalendar,
} from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { formatViews, formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"videos" | "posts" | "liked">(
    "videos",
  );
  const [userVideos, setUserVideos] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    videos: 0,
    posts: 0,
    followers: 0,
    following: 0,
    totalViews: 0,
    totalLikes: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchUserContent();
  }, [isAuthenticated]);

  const fetchUserContent = async () => {
    try {
      const [videosRes, postsRes] = await Promise.all([
        api.get("/videos"),
        api.get("/posts"),
      ]);
      const userVideos = videosRes.data.filter(
        (v: any) => v.userId === user?.id,
      );
      const userPosts = postsRes.data.filter((p: any) => p.userId === user?.id);
      setUserVideos(userVideos);
      setUserPosts(userPosts);
      setStats({
        videos: userVideos.length,
        posts: userPosts.length,
        followers: 127,
        following: 89,
        totalViews: userVideos.reduce(
          (acc: number, v: any) => acc + v.views,
          0,
        ),
        totalLikes: 342,
      });
    } catch (error) {
      console.error("Error fetching user content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/60"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="glass-modern p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-5xl text-white border-4 border-white/20">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <button className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-sm p-2 rounded-full border border-white/20 hover:bg-white/30 transition">
              <FaCamera className="text-white text-sm" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
              <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
              {user?.isAdmin && (
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                  Admin
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm md:text-base mt-1">
              {user?.email}
            </p>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Content creator sharing amazing videos and posts with the
              community.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
              <div className="text-center">
                <div className="text-white font-bold text-xl">
                  {stats.videos}
                </div>
                <div className="text-gray-400 text-xs">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-xl">
                  {stats.posts}
                </div>
                <div className="text-gray-400 text-xs">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-xl">
                  {stats.followers}
                </div>
                <div className="text-gray-400 text-xs">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-xl">
                  {stats.following}
                </div>
                <div className="text-gray-400 text-xs">Following</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-xl">
                  {stats.totalViews.toLocaleString()}
                </div>
                <div className="text-gray-400 text-xs">Total Views</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button className="btn-primary w-full md:w-auto px-8 py-2.5 text-sm">
              <FaEdit className="inline mr-2" />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary w-full md:w-auto px-8 py-2.5 text-sm text-red-400 hover:text-red-300"
            >
              <FaSignOutAlt className="inline mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-nav-facebook mb-6">
        {[
          { id: "videos", label: "Videos", icon: FaVideo, count: stats.videos },
          {
            id: "posts",
            label: "Posts",
            icon: FaNewspaper,
            count: stats.posts,
          },
          { id: "liked", label: "Liked", icon: FaHeart, count: 0 },
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
              {tab.count > 0 && (
                <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === "videos" &&
          userVideos.map((video: any) => (
            <ProfileVideoCard key={video.id} video={video} />
          ))}
        {activeTab === "posts" &&
          userPosts.map((post: any) => (
            <ProfilePostCard key={post.id} post={post} />
          ))}
        {activeTab === "liked" && (
          <div className="col-span-full text-center py-12 text-gray-400">
            <FaHeart className="text-5xl mx-auto mb-4 opacity-20" />
            <p>No liked content yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileVideoCard({ video }: { video: any }) {
  return (
    <Link href={`/video/${video.id}`}>
      <div className="video-card-youtube">
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
        <div className="video-info-youtube">
          <h3 className="video-title-youtube text-sm">{video.title}</h3>
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

function ProfilePostCard({ post }: { post: any }) {
  return (
    <div className="post-card-facebook">
      <div className="post-header-facebook">
        <div className="post-avatar-facebook">
          {post.user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <p className="post-user-name-facebook text-sm">{post.user?.name}</p>
          <span className="post-time-facebook text-xs">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>
      <div className="post-content-facebook">
        <h3 className="post-title-facebook text-sm">{post.title}</h3>
        <p className="post-text-facebook text-xs line-clamp-3">
          {post.content}
        </p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="post-image-facebook max-h-40"
          />
        )}
      </div>
    </div>
  );
}

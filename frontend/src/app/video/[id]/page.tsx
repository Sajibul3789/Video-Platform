"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaThumbsUp,
  FaComment,
  FaShare,
  FaBookmark,
  FaEllipsisH,
  FaUser,
  FaCalendar,
  FaEye,
  FaThumbsDown,
  FaFlag,
  FaPlay,
  FaDownload,
  FaHeart,
  FaUsers,
  FaClock,
} from "react-icons/fa";
import ReactPlayer from "react-player";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { formatViews, formatDate } from "@/lib/utils";
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

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetchVideo();
    // Load mock comments
    setComments([
      {
        id: "1",
        content:
          "Great video! Really enjoyed this content. Keep up the amazing work! 🔥",
        createdAt: new Date().toISOString(),
        user: { id: "1", name: "John Doe", email: "john@example.com" },
      },
      {
        id: "2",
        content:
          "Amazing work, keep it up! This is exactly what I was looking for.",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        user: { id: "2", name: "Jane Smith", email: "jane@example.com" },
      },
      {
        id: "3",
        content: "Best video I've seen all week! 🎉",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        user: { id: "3", name: "Mike Johnson", email: "mike@example.com" },
      },
    ]);
  }, [params.id]);

  const fetchVideo = async () => {
    try {
      const response = await api.get(`/videos/${params.id}`);
      setVideo(response.data);
      // Increment view count (mock)
      if (response.data) {
        response.data.views = (response.data.views || 0) + 1;
      }
    } catch (error) {
      console.error("Error fetching video:", error);
      toast.error("Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }
    setSubmitting(true);
    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        content: commentText,
        createdAt: new Date().toISOString(),
        user: {
          id: user?.id || "0",
          name: user?.name || "User",
          email: user?.email || "",
        },
      };
      setComments([newComment, ...comments]);
      setCommentText("");
      toast.success("Comment posted!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("Please login to like");
      return;
    }
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Unliked" : "Liked!");
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("Please login to save");
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Saved!");
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      return;
    }
    setIsSubscribed(!isSubscribed);
    toast.success(isSubscribed ? "Unsubscribed" : "Subscribed!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/60"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="full-width py-16 text-center">
        <h2 className="text-2xl font-bold text-white">Video not found</h2>
        <p className="text-gray-400 mt-2">
          The video you're looking for doesn't exist.
        </p>
        <Link href="/" className="btn-primary inline-block mt-4">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="full-width py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <ReactPlayer
              url={
                video.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              }
              width="100%"
              height="100%"
              controls
              playing
              config={{
                youtube: {
                  playerVars: { showinfo: 0, modestbranding: 1, rel: 0 },
                },
              }}
            />
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-white">{video.title}</h1>
            <div className="flex flex-wrap items-center justify-between mt-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {video.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {video.user?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatDate(video.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSubscribe}
                  className={`btn-primary text-sm px-6 py-2 ${isSubscribed ? "bg-gray-600 hover:bg-gray-700" : ""}`}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                    isLiked
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-white/5 hover:bg-white/10 text-white"
                  }`}
                >
                  <FaThumbsUp className="text-sm" />
                  <span>{isLiked ? "Liked" : "Like"}</span>
                  <span className="text-xs opacity-50">• 1.2K</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition text-white">
                  <FaThumbsDown className="text-sm" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition text-white">
                  <FaShare className="text-sm" />
                  <span>Share</span>
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                    isSaved
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-white/5 hover:bg-white/10 text-white"
                  }`}
                >
                  <FaBookmark className="text-sm" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition text-white">
                  <FaDownload className="text-sm" />
                </button>
              </div>
            </div>

            {/* Views and Date */}
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
              <span>
                <FaEye className="inline mr-1" /> {formatViews(video.views)}{" "}
                views
              </span>
              <span>•</span>
              <span>
                <FaClock className="inline mr-1" />{" "}
                {formatDate(video.createdAt)}
              </span>
            </div>

            {/* Description */}
            <div className="mt-4 p-4 rounded-xl bg-white/5">
              <p className="text-white/80">
                {video.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="input-modern"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="btn-primary px-6 py-2 disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post"}
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-white/5 text-center mb-6">
                <p className="text-gray-400">
                  <Link
                    href="/login"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Sign in
                  </Link>{" "}
                  to leave a comment
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white text-sm">
                        {comment.user?.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mt-1">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <button className="text-xs text-gray-400 hover:text-white transition">
                        <FaThumbsUp className="inline mr-1" /> Like
                      </button>
                      <button className="text-xs text-gray-400 hover:text-white transition">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Videos Sidebar */}
        <div className="lg:col-span-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Related Videos
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition"
              >
                <div className="w-40 h-24 bg-white/5 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <FaPlay className="text-white/20 text-2xl" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white line-clamp-2">
                    Amazing Video {i} - Must Watch Content
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Channel Name</p>
                  <p className="text-xs text-gray-500">
                    1.2K views • 2 days ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

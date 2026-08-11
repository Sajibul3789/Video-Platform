"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUser, FaClock, FaComments, FaNewspaper } from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
  _count: { comments: number };
}

export default function PostsPage() {
  const { isAuthenticated } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/60"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl">
          <FaNewspaper className="text-white text-3xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Community Posts</h1>
          <p className="text-gray-400">
            Read and engage with posts from creators
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="glass-modern p-16 text-center">
          <div className="text-6xl mb-4 opacity-30">📝</div>
          <h3 className="text-2xl font-semibold text-white/50">No Posts Yet</h3>
          <p className="text-gray-500 mt-2">Check back later for new posts</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="post-card-facebook"
            >
              <div className="post-header-facebook">
                <div className="post-avatar-facebook">
                  {post.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="post-user-name-facebook">{post.user.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FaClock className="w-3 h-3" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="post-content-facebook">
                <h2 className="post-title-facebook">{post.title}</h2>
                <p className="post-text-facebook">{post.content}</p>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="post-image-facebook"
                  />
                )}
              </div>
              <div className="post-actions-facebook">
                <button className="action-btn-facebook">
                  <FaComments className="text-sm" />
                  <span>{post._count.comments} comments</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

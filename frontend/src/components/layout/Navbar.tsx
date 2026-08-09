"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FaVideo,
  FaUpload,
  FaSignOutAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaHome,
} from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <FaVideo className="text-white text-xl" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VideoHub
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/">
              <button
                className={`px-4 py-2 rounded-lg transition text-sm font-medium flex items-center gap-2 ${
                  pathname === "/"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <FaHome className="text-sm" />
                Home
              </button>
            </Link>
            <Link href="/posts">
              <button
                className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                  pathname === "/posts"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                Posts
              </button>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full px-4 py-2 pl-10 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {user?.isAdmin && (
                  <Link href="/upload">
                    <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition text-sm font-medium shadow-lg hover:shadow-xl">
                      <FaUpload />
                      <span>Upload</span>
                    </button>
                  </Link>
                )}

                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FaSignOutAlt />
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <button className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-lg transition text-sm font-medium">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition text-sm font-medium shadow-lg hover:shadow-xl">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaHome />
                Home
              </Link>
              <Link
                href="/posts"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Posts
              </Link>
              {user?.isAdmin && (
                <Link
                  href="/upload"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUpload />
                  Upload Video
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 w-full"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

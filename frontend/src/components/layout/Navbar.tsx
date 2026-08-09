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
  FaBell,
  FaNewspaper,
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
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#2a2a2a]">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-red-600 p-1.5 rounded-md">
              <FaVideo className="text-white text-lg" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Video<span className="text-red-600">Hub</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-1.5 pl-10 rounded-full border border-gray-300 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-full transition relative">
              <FaBell className="text-gray-600 dark:text-gray-300 text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>

            {isAuthenticated ? (
              <>
                {user?.isAdmin && (
                  <Link href="/upload">
                    <button className="hidden sm:flex items-center gap-1.5 bg-[#1877f2] hover:bg-[#166fe5] text-white px-3 py-1.5 rounded-full text-sm font-medium transition">
                      <FaUpload className="text-xs" />
                      <span>Upload</span>
                    </button>
                  </Link>
                )}

                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-semibold text-xs">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden md:flex text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                >
                  <FaSignOutAlt />
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition"
                >
                  {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <button className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] px-3 py-1.5 rounded-lg transition text-sm font-medium">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-3 py-1.5 rounded-lg transition text-sm font-medium">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-[#2a2a2a]">
            <div className="space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaHome /> Home
              </Link>
              <Link
                href="/posts"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaNewspaper /> Posts
              </Link>
              {user?.isAdmin && (
                <Link
                  href="/upload"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUpload /> Upload Video
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
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-lg bg-[#1877f2] text-white hover:bg-[#166fe5] transition text-center"
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

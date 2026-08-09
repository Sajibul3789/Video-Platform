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
    <nav className="sticky top-0 z-50 navbar-glass w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-white/15 p-2 rounded-lg">
              <FaVideo className="text-white text-xl" />
            </div>
            <span className="font-bold text-xl text-white">
              Video<span className="text-white/50">Hub</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 text-sm" />
              <input
                type="text"
                placeholder="Search videos..."
                className="glass-input w-full pl-12"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button className="p-2.5 hover:bg-white/10 rounded-full transition relative">
              <FaBell className="text-white/50 text-xl" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-white/50 rounded-full"></span>
            </button>

            {isAuthenticated ? (
              <>
                {user?.isAdmin && (
                  <Link href="/upload">
                    <button className="hidden sm:flex btn-glass btn-glass-primary">
                      <FaUpload className="mr-2" /> Upload
                    </button>
                  </Link>
                )}

                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden md:flex text-white/30 hover:text-white/70 transition px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                >
                  <FaSignOutAlt />
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2.5 hover:bg-white/10 rounded-lg transition"
                >
                  {isMobileMenuOpen ? (
                    <FaTimes className="text-white/70" />
                  ) : (
                    <FaBars className="text-white/70" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <button className="text-white/50 hover:text-white/80 px-4 py-2 rounded-lg transition text-sm font-medium">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="btn-glass btn-glass-primary px-6 py-2">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <div className="space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition text-white/70"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaHome className="text-lg" /> Home
              </Link>
              <Link
                href="/posts"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition text-white/70"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaNewspaper className="text-lg" /> Posts
              </Link>
              {user?.isAdmin && (
                <Link
                  href="/upload"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition text-white/70"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUpload className="text-lg" /> Upload Video
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/40 w-full"
                >
                  <FaSignOutAlt className="text-lg" /> Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-3 rounded-lg hover:bg-white/5 transition text-white/70"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/15 transition text-center"
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

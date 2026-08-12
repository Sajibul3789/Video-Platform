"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FaSearch,
  FaUpload,
  FaBell,
  FaHome,
  FaFire,
  FaCompass,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaVideo,
  FaUserPlus,
} from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";

function NavbarPlaceholder() {
  return (
    <nav className="navbar-youtube">
      <div className="full-width h-full flex items-center justify-between">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <FaVideo className="text-white text-xl" />
          </div>
          <span className="font-bold text-xl text-white hidden sm:block">
            Video<span className="text-gray-400">Hub</span>
          </span>
        </div>
      </div>
    </nav>
  );
}

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!mounted) {
    return <NavbarPlaceholder />;
  }

  const navItems = [
    { href: "/", icon: FaHome, label: "Home" },
    { href: "/explore", icon: FaCompass, label: "Explore" },
    { href: "/trending", icon: FaFire, label: "Trending" },
  ];

  return (
    <nav className="navbar-youtube" suppressHydrationWarning>
      <div
        className="full-width h-full flex items-center justify-between"
        suppressHydrationWarning
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <FaVideo className="text-white text-xl" />
          </div>
          <span className="font-bold text-xl text-white hidden sm:block">
            Video<span className="text-gray-400">Hub</span>
          </span>
        </Link>

        {/* Search - Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-2xl mx-6"
        >
          <div className="search-bar-youtube w-full">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FaSearch className="text-gray-400" />
            </button>
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-2" suppressHydrationWarning>
          <Link
            href="/explore"
            className="md:hidden p-2 hover:bg-white/10 rounded-full transition"
          >
            <FaSearch className="text-white/70 text-lg" />
          </Link>

          {isAuthenticated && user?.isAdmin && (
            <Link href="/upload">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 btn-secondary text-sm">
                <FaUpload className="text-sm" />
                <span>Upload</span>
              </button>
            </Link>
          )}

          <button className="p-2 hover:bg-white/10 rounded-full transition relative">
            <FaBell className="text-white/70 text-xl" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {isAuthenticated ? (
            <>
              <Link href="/profile" className="hidden md:block">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:flex p-2 hover:bg-white/10 rounded-full transition text-white/50"
              >
                <FaSignOutAlt className="text-lg" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="text-white/70 text-xl" />
                ) : (
                  <FaBars className="text-white/70 text-xl" />
                )}
              </button>
            </>
          ) : (
            <p></p>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/5 py-2">
          <div className="px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
            {user?.isAdmin && (
              <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 transition">
                  <FaUpload className="text-lg" />
                  <span className="font-medium">Upload Video</span>
                </div>
              </Link>
            )}
            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 transition">
                <FaUser className="text-lg" />
                <span className="font-medium">Profile</span>
              </div>
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400/70 hover:bg-white/5 transition w-full"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

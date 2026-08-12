"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaFire,
  FaCompass,
  FaVideo,
  FaUser,
  FaUpload,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Don't hide if at the top of the page
      if (currentScrollY < 50) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle the scroll event for better performance
    let timeoutId: NodeJS.Timeout | null = null;
    const throttledHandleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastScrollY]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === path;
    if (path.includes("?")) return pathname === path.split("?")[0];
    return pathname.startsWith(path);
  };

  const navItems = [
    { icon: FaHome, label: "Home", href: "/" },
    { icon: FaFire, label: "Trending", href: "/trending" },
    { icon: FaCompass, label: "Explore", href: "/explore" },
    { icon: FaVideo, label: "Videos", href: "/explore?tab=videos" },
  ];

  return (
    <nav
      className={`
        lg:hidden fixed bottom-0 left-0 right-0 z-50 
        bg-black/95 backdrop-blur-xl border-t border-white/5 
        safe-area-bottom transition-transform duration-300 ease-in-out
        ${isVisible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 relative"
            >
              <div
                className={`relative ${active ? "text-white" : "text-gray-500"}`}
              >
                <Icon className="text-xl" />
                {active && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${active ? "text-white" : "text-gray-500"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Upload Button - Only for admins */}
        {isAuthenticated && user?.isAdmin && (
          <Link
            href="/upload"
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1"
          >
            <div
              className={`relative ${isActive("/upload") ? "text-white" : "text-gray-500"}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <FaPlus className="text-white text-lg" />
              </div>
            </div>
            <span
              className={`text-[10px] font-medium ${isActive("/upload") ? "text-white" : "text-gray-500"}`}
            >
              Create
            </span>
          </Link>
        )}

        {/* Profile */}
        {isAuthenticated ? (
          <Link
            href="/profile"
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1"
          >
            <div
              className={`relative ${isActive("/profile") ? "text-white" : "text-gray-500"}`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            <span
              className={`text-[10px] font-medium ${isActive("/profile") ? "text-white" : "text-gray-500"}`}
            >
              Profile
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1"
          >
            <div
              className={`relative ${isActive("/login") ? "text-white" : "text-gray-500"}`}
            >
              <FaUser className="text-xl" />
            </div>
            <span
              className={`text-[10px] font-medium ${isActive("/login") ? "text-white" : "text-gray-500"}`}
            >
              Login
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
};

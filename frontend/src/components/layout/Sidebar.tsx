"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaFire,
  FaCompass,
  FaVideo,
  FaNewspaper,
  FaUser,
  FaUpload,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  adminOnly?: boolean;
}

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  const mainItems: SidebarItem[] = [
    { icon: FaHome, label: "Home", href: "/" },
    { icon: FaFire, label: "Trending", href: "/trending" },
    { icon: FaCompass, label: "Explore", href: "/explore" },
  ];

  const contentItems: SidebarItem[] = [
    { icon: FaVideo, label: "Videos", href: "/explore?tab=videos" },
    { icon: FaNewspaper, label: "Posts", href: "/posts" },
  ];

  const userItems: SidebarItem[] = [
    { icon: FaUser, label: "Profile", href: "/profile" },
  ];

  const adminItems: SidebarItem[] = [
    { icon: FaUpload, label: "Upload Video", href: "/upload", adminOnly: true },
  ];

  const moreItems: SidebarItem[] = [
    { icon: FaCog, label: "Settings", href: "/settings" },
    { icon: FaQuestionCircle, label: "Help", href: "/help" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    if (href.includes("?")) return pathname === href.split("?")[0];
    return pathname.startsWith(href);
  };

  const renderSidebarItem = (item: SidebarItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link key={item.href} href={item.href}>
        <div
          className={`sidebar-item-youtube ${active ? "active" : ""}`}
          suppressHydrationWarning
        >
          <Icon className="text-xl" />
          <span className="text-sm">{item.label}</span>
        </div>
      </Link>
    );
  };

  return (
    <div
      className="sidebar-youtube sticky top-20 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide"
      suppressHydrationWarning
    >
      {/* User Profile */}
      <div
        className="flex items-center gap-3 mb-6 p-2 rounded-lg bg-white/5"
        suppressHydrationWarning
      >
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg"
          suppressHydrationWarning
        >
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div suppressHydrationWarning>
          <p className="font-semibold text-white">{user?.name || "Guest"}</p>
          <p className="text-sm text-gray-400">{user?.email || "Sign in"}</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="mb-4" suppressHydrationWarning>
        {mainItems.map(renderSidebarItem)}
      </div>

      {/* Divider */}
      <div
        className="border-t border-white/5 my-4"
        suppressHydrationWarning
      ></div>

      {/* Content Section */}
      <div className="mb-4" suppressHydrationWarning>
        {contentItems.map(renderSidebarItem)}
      </div>

      {/* User Section - Only show when authenticated */}
      {isAuthenticated && (
        <>
          <div
            className="border-t border-white/5 my-4"
            suppressHydrationWarning
          ></div>
          <div className="mb-4" suppressHydrationWarning>
            {userItems.map(renderSidebarItem)}
          </div>
        </>
      )}

      {/* Admin Section */}
      {isAuthenticated && user?.isAdmin && (
        <>
          <div
            className="border-t border-white/5 my-4"
            suppressHydrationWarning
          ></div>
          <div className="mb-4" suppressHydrationWarning>
            {adminItems.map(renderSidebarItem)}
          </div>
        </>
      )}

      {/* More Section */}
      <div
        className="border-t border-white/5 my-4"
        suppressHydrationWarning
      ></div>
      <div suppressHydrationWarning>{moreItems.map(renderSidebarItem)}</div>

      {/* Footer */}
      <div
        className="mt-6 pt-4 border-t border-white/5"
        suppressHydrationWarning
      >
        <p className="text-xs text-gray-500 px-3">VideoHub v1.0</p>
        <p className="text-xs text-gray-500 px-3 mt-1">© 2024 VideoHub</p>
      </div>
    </div>
  );
};

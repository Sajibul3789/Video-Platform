"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  FaHistory,
  FaClock,
  FaThumbsUp,
  FaBookmark,
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
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPage, setIsVideoPage] = useState(false);

  useEffect(() => {
    setIsVideoPage(pathname?.startsWith("/video/") || false);
  }, [pathname]);

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
    { icon: FaHistory, label: "History", href: "/history" },
    { icon: FaClock, label: "Watch Later", href: "/watch-later" },
    { icon: FaThumbsUp, label: "Liked Videos", href: "/liked" },
    { icon: FaBookmark, label: "Saved", href: "/saved" },
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

  // Render a section with divider
  const renderSection = (
    items: SidebarItem[],
    showLabel: boolean,
    showDivider: boolean = true,
  ) => {
    if (items.length === 0) return null;

    return (
      <>
        {showDivider && <div className="sidebar-divider"></div>}
        <div className="sidebar-items">
          {items.map((item) => {
            if (item.adminOnly && !user?.isAdmin) return null;
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`sidebar-item-youtube ${active ? "active" : ""}`}
                  title={!showLabel ? item.label : ""}
                  suppressHydrationWarning
                >
                  <Icon className="sidebar-icon" />
                  <span
                    className={`sidebar-label ${!showLabel ? "hidden" : ""}`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </>
    );
  };

  // Render the sidebar content
  const renderSidebarContent = (showLabels: boolean) => {
    return (
      <>
        <div className="sidebar-user-profile">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className={`sidebar-user-info ${!showLabels ? "hidden" : ""}`}>
            <p className="sidebar-username">{user?.name || "Guest"}</p>
            <p className="sidebar-useremail">{user?.email || "Sign in"}</p>
          </div>
        </div>

        {renderSection(mainItems, showLabels, false)}
        {renderSection(contentItems, showLabels, true)}
        {isAuthenticated && renderSection(userItems, showLabels, true)}
        {isAuthenticated &&
          user?.isAdmin &&
          renderSection(adminItems, showLabels, true)}
        {renderSection(moreItems, showLabels, true)}

        <div className={`sidebar-footer ${!showLabels ? "hidden" : ""}`}>
          <p className="sidebar-footer-text">VideoHub v1.0</p>
          <p className="sidebar-footer-text">© 2024 VideoHub</p>
        </div>
      </>
    );
  };

  // For video pages - ALWAYS fixed, content has padding
  if (isVideoPage) {
    return (
      <div
        className={`video-page-sidebar ${isHovered ? "expanded" : "collapsed"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        suppressHydrationWarning
      >
        {renderSidebarContent(isHovered)}
      </div>
    );
  }

  // Regular sidebar for non-video pages
  return <div className="sidebar-youtube">{renderSidebarContent(true)}</div>;
};

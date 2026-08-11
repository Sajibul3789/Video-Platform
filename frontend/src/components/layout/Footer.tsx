"use client";

import Link from "next/link";
import {
  FaYoutube,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaVideo,
} from "react-icons/fa";

export const Footer = () => {
  return (
    <footer
      className="border-t border-white/5 mt-12 py-8"
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-4" suppressHydrationWarning>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
          suppressHydrationWarning
        >
          <div suppressHydrationWarning>
            <div
              className="flex items-center gap-2 mb-4"
              suppressHydrationWarning
            >
              <div className="bg-red-600 p-1.5 rounded-lg">
                <FaVideo className="text-white text-lg" />
              </div>
              <span className="font-bold text-lg text-white">VideoHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Share and discover amazing videos from creators around the world.
            </p>
          </div>

          <div suppressHydrationWarning>
            <h3 className="text-white font-semibold mb-3 text-sm">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  href="/upload"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Upload
                </Link>
              </li>
            </ul>
          </div>

          <div suppressHydrationWarning>
            <h3 className="text-white font-semibold mb-3 text-sm">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/posts"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div suppressHydrationWarning>
            <h3 className="text-white font-semibold mb-3 text-sm">Follow Us</h3>
            <div className="flex gap-4 mb-4" suppressHydrationWarning>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-xl"
              >
                <FaYoutube />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-xl"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-xl"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition text-xl"
              >
                <FaGithub />
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} VideoHub
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

"use client";

import Link from "next/link";
import { FaPlay, FaUpload } from "react-icons/fa";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 py-20 md:py-28">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          Discover Amazing
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Videos Every Day
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Watch, share, and connect with creators from around the world.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition shadow-lg hover:shadow-xl inline-flex items-center">
              <FaPlay className="mr-2" />
              Start Watching
            </button>
          </Link>
          <Link href="/upload">
            <button className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition inline-flex items-center">
              <FaUpload className="mr-2" />
              Upload Your Video
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

import Link from "next/link";
import {
  FaVideo,
  FaUsers,
  FaHeart,
  FaGlobe,
  FaShield,
  FaRocket,
} from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass-modern p-8 md:p-10 rounded-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 p-4 rounded-2xl">
              <FaVideo className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">About VideoHub</h1>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            A modern video sharing platform where creators share amazing content
            with the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center glass-modern p-6">
            <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <FaVideo className="text-white text-2xl" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">
              Video Sharing
            </h3>
            <p className="text-gray-400 text-sm">
              Upload and share videos with the community
            </p>
          </div>

          <div className="text-center glass-modern p-6">
            <div className="w-14 h-14 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <FaUsers className="text-white text-2xl" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">Community</h3>
            <p className="text-gray-400 text-sm">
              Connect with creators and viewers worldwide
            </p>
          </div>

          <div className="text-center glass-modern p-6">
            <div className="w-14 h-14 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4">
              <FaHeart className="text-white text-2xl" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">
              Engagement
            </h3>
            <p className="text-gray-400 text-sm">
              Like, comment, and share your favorite content
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="glass-modern p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <FaGlobe className="text-gray-400" />
              Our Mission
            </h3>
            <p className="text-gray-400 text-sm">
              To create a platform where creators can share their content and
              connect with audiences worldwide.
            </p>
          </div>
          <div className="glass-modern p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <FaRocket className="text-gray-400" />
              Our Vision
            </h3>
            <p className="text-gray-400 text-sm">
              To become the leading platform for video content creation and
              community engagement.
            </p>
          </div>
          <div className="glass-modern p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <FaShield className="text-gray-400" />
              Our Values
            </h3>
            <p className="text-gray-400 text-sm">
              We believe in creativity, community, and providing a safe space
              for content sharing.
            </p>
          </div>
          <div className="glass-modern p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <FaHeart className="text-gray-400" />
              Get Involved
            </h3>
            <p className="text-gray-400 text-sm">
              Join our community, share your content, and help us grow together.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/register">
            <button className="btn-primary px-10 py-3 text-lg">
              Join Our Community
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

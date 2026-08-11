"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaBell,
  FaLock,
  FaPalette,
  FaGlobe,
  FaLanguage,
  FaMoon,
  FaSun,
  FaSave,
  FaArrowLeft,
  FaVideo,
  FaHeart,
} from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [language, setLanguage] = useState("en");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          <FaArrowLeft className="text-white/60" />
        </button>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <div className="space-y-4">
        {/* Profile Settings */}
        <div className="glass-modern p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaUser className="text-gray-400" />
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                Display Name
              </label>
              <input
                type="text"
                defaultValue={user?.name || ""}
                className="input-modern"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Email</label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="input-modern"
                disabled
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Bio</label>
              <textarea
                className="input-modern min-h-[80px] resize-none"
                placeholder="Tell us about yourself..."
                defaultValue="Content creator sharing amazing videos with the community."
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-modern p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaPalette className="text-gray-400" />
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg transition ${
                darkMode ? "bg-white/20 text-white" : "bg-white/5 text-gray-400"
              }`}
            >
              {darkMode ? (
                <FaMoon className="inline mr-2" />
              ) : (
                <FaSun className="inline mr-2" />
              )}
              {darkMode ? "Dark" : "Light"}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-modern p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaBell className="text-gray-400" />
            Notifications
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Push Notifications</span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`px-4 py-2 rounded-lg transition ${
                  notifications
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-gray-400"
                }`}
              >
                {notifications ? "On" : "Off"}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email Notifications</span>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`px-4 py-2 rounded-lg transition ${
                  emailNotifications
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-gray-400"
                }`}
              >
                {emailNotifications ? "On" : "Off"}
              </button>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="glass-modern p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaLanguage className="text-gray-400" />
            Language
          </h2>
          <select
            className="input-modern"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        {/* Privacy */}
        <div className="glass-modern p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaLock className="text-gray-400" />
            Privacy
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Profile Visibility</span>
            <select className="input-modern w-32 text-sm">
              <option>Public</option>
              <option>Private</option>
              <option>Friends</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full btn-primary py-3 text-center disabled:opacity-50"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
              Saving...
            </span>
          ) : (
            <>
              <FaSave className="inline mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}

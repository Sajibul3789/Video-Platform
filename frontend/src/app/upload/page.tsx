"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  FaUpload,
  FaVideo,
  FaFileVideo,
  FaCloudUploadAlt,
  FaTimes,
} from "react-icons/fa";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(5000, "Description is too long").optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export default function Upload() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (!user?.isAdmin) {
    router.push("/");
    return null;
  }

  const onSubmit = async (data: UploadFormData) => {
    if (!file) {
      toast.error("Please select a video file");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    formData.append("video", file);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      await api.post("/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(interval);
      setUploadProgress(100);
      toast.success("Video uploaded successfully!");
      setTimeout(() => router.push("/"), 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="full-width py-8 max-w-3xl mx-auto">
      <div className="glass-modern p-8 rounded-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl">
            <FaCloudUploadAlt className="text-white text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Upload Video</h1>
            <p className="text-gray-400">
              Share your content with the community
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              {...register("title")}
              className="input-modern"
              placeholder="Enter video title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="input-modern resize-none"
              placeholder="Enter video description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video File *
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition ${
                dragOver
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/10 hover:border-white/20"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.[0]) {
                  setFile(e.dataTransfer.files[0]);
                }
              }}
            >
              {!file ? (
                <>
                  <input
                    type="file"
                    accept="video/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className="flex flex-col items-center">
                    <FaFileVideo className="text-5xl text-gray-500 mb-4" />
                    <p className="text-gray-400">
                      <span className="font-semibold text-white">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      MP4, WebM, or OGG (Max 500MB)
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between w-full max-w-md mx-auto">
                  <div className="flex items-center gap-3">
                    <FaVideo className="text-blue-400 text-2xl" />
                    <div className="text-left">
                      <p className="text-white text-sm font-medium truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 hover:bg-white/10 rounded-full transition"
                  >
                    <FaTimes className="text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Uploading...</span>
                <span className="text-white">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                Uploading...
              </span>
            ) : (
              <span>
                <FaUpload className="inline mr-2" />
                Upload Video
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

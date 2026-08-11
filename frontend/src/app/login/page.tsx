"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { FaGoogle, FaGithub, FaApple, FaVideo } from "react-icons/fa";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data;
      setAuth(user, token);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass-modern p-8 rounded-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-red-600 p-3 rounded-2xl">
                <FaVideo className="text-white text-3xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-2">
              Sign in to continue to VideoHub
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                className="input-modern"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="input-modern pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1a1a1a] text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-white">
                <FaGoogle className="text-red-400" />
              </button>
              <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-white">
                <FaGithub className="text-white" />
              </button>
              <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-white">
                <FaApple className="text-white" />
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

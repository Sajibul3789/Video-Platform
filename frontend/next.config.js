/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "192.168.0.200",
      },
    ],
  },
  allowedDevOrigins: ["192.168.0.200", "localhost", "10.0.0.*", "192.168.*"],
  // Add this to help with hydration issues
  experimental: {
    // This can help with extension-related hydration mismatches
    optimizeCss: false,
  },
  // Suppress hydration warnings for third-party extensions
  onError: (err, req, res) => {
    // Ignore hydration errors from browser extensions
    if (err.message && err.message.includes("bis_skin_checked")) {
      return;
    }
  },
};

export default nextConfig;

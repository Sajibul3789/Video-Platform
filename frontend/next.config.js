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
        hostname: "192.168.0.200", // Replace with your IP
      },
      {
        protocol: "http",
        hostname: "10.0.0.*", // Allow all 10.x.x.x IPs
      },
      {
        protocol: "http",
        hostname: "192.168.*", // Allow all 192.168.x.x IPs
      },
    ],
  },
  // Allow all network origins for development
  allowedDevOrigins: [
    "192.168.0.200", // Replace with your IP
    "localhost",
    "10.0.0.*",
    "192.168.*",
  ],
};

export default nextConfig;

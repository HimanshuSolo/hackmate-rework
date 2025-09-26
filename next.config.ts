import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'randomuser.me']
  },
  allowedDevOrigins: [
    //for testing responsiveness
    "192.168.29.206"
  ]
};

export default nextConfig;

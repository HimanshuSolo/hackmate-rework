import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com', 
      'randomuser.me',
      'dqy38fnwh4fqs.cloudfront.net', // Peerlist avatars
      'ph-avatars.imgix.net',         // Product Hunt avatars
      'pbs.twimg.com',                // Twitter avatars (if added later)
      'abs.twimg.com',                // Twitter media (if added later)
    ]
  },
  allowedDevOrigins: [
    //for testing responsiveness
    "192.168.29.206"
  ]
};

export default nextConfig;

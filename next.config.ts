import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker deployment

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'dqy38fnwh4fqs.cloudfront.net', // Peerlist avatars
      },
      {
        protocol: 'https',
        hostname: 'ph-avatars.imgix.net', // Product Hunt avatars
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com', // Twitter avatars (if added later)
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com', // Twitter media (if added later)
      },
    ],
  },
  allowedDevOrigins: [
    //for testing responsiveness
    "192.168.29.206"
  ]
};

export default nextConfig;
"use client";

import React from 'react';
import Image from 'next/image';

export interface PeerlistTestimonialProps {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    title?: string;
  };
  content: string;
  projectName?: string;
  projectUrl?: string;
  className?: string;
}

export const PeerlistTestimonial: React.FC<PeerlistTestimonialProps> = ({
  author,
  content,
  className = '',
}) => {
  return (
    <div className={`
      bg-black/20 backdrop-blur-sm border border-gray-800/50 
      rounded-2xl p-4 sm:p-6 w-full max-w-sm mx-auto hover:border-gray-700/50 
      transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 will-change-transform
      ${className}
    `} style={{transform: "translate3d(0, 0, 0)"}}>
      {/* Peerlist Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dlv779rl7/image/upload/v1758908440/peerlist_yrcaxz.png"
            alt="Peerlist"
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-emerald-400 font-semibold text-sm">Peerlist</span>
        </div>
      </div>

      {/* Author Info */}
      <div className="flex items-start gap-3 mb-4">
        <Image
          src={author.avatar}
          alt={author.name}
          width={44}
          height={44}
          className="w-11 h-11 rounded-full border border-gray-700"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-white font-semibold text-sm sm:text-base truncate">
              {author.name}
            </h4>
            <span className="text-emerald-400 text-xs sm:text-sm">@{author.username}</span>
          </div>
          {author.title && (
            <p className="text-gray-400 text-xs sm:text-sm mt-1 truncate">{author.title}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-200 text-sm sm:text-base leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default PeerlistTestimonial;
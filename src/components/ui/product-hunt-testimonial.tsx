"use client";

import React from 'react';
import Image from 'next/image';
import { MessageSquare, Award } from 'lucide-react';

export interface ProductHuntTestimonialProps {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    title?: string;
    isMaker?: boolean;
    isHunter?: boolean;
  };
  content: string;
  productName?: string;
  productUrl?: string;
  badge?: 'daily_winner' | 'weekly_winner' | 'featured' | 'top_comment';
  className?: string;
}

export const ProductHuntTestimonial: React.FC<ProductHuntTestimonialProps> = ({
  author,
  content,
  badge,
  className = '',
}) => {
  const getBadgeConfig = (badgeType?: string) => {
    switch (badgeType) {
      case 'daily_winner':
        return { icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-400/20', text: 'Daily Winner' };
      case 'weekly_winner':
        return { icon: Award, color: 'text-purple-400', bg: 'bg-purple-400/20', text: 'Weekly Winner' };
      case 'featured':
        return { icon: Award, color: 'text-orange-400', bg: 'bg-orange-400/20', text: 'Featured' };
      case 'top_comment':
        return { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/20', text: 'Top Comment' };
      default:
        return null;
    }
  };

  const badgeConfig = getBadgeConfig(badge);

  return (
    <div className={`
      bg-black/20 backdrop-blur-sm border border-gray-800/50 
      rounded-2xl p-4 sm:p-6 w-full max-w-sm mx-auto hover:border-gray-700/50 
      transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 will-change-transform
      ${className}
    `} style={{transform: "translate3d(0, 0, 0)"}}>
      {/* Product Hunt Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dlv779rl7/image/upload/v1758908440/product_hunt_zsq8kj.png"
            alt="Product Hunt"
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <span className="text-orange-400 font-semibold text-sm">Product Hunt</span>
            {badgeConfig && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${badgeConfig.bg} flex-shrink-0`}>
                <badgeConfig.icon className={`w-3 h-3 ${badgeConfig.color}`} />
                <span className={`text-xs font-medium ${badgeConfig.color} hidden sm:inline`}>
                  {badgeConfig.text}
                </span>
              </div>
            )}
          </div>
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
            <span className="text-orange-400 text-xs sm:text-sm">@{author.username}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {author.title && (
              <p className="text-gray-400 text-xs sm:text-sm truncate">{author.title}</p>
            )}
            {author.isMaker && (
              <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                Maker
              </span>
            )}
            {author.isHunter && (
              <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                Hunter
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-200 text-sm sm:text-base leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default ProductHuntTestimonial;
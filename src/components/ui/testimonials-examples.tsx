// Example usage of the new testimonial system
// This file shows how to implement the testimonials with mixed content types

import { TestimonialItem } from '@/lib/testimonial-utils';

// Example testimonials data structure - replace with your real testimonials
export const sampleTestimonials: TestimonialItem[] = [
  // Add your real testimonials here following these patterns:
  
  // Custom testimonial example:
  // {
  //   type: "custom",
  //   id: "custom-1",
  //   text: "Your testimonial text...",
  //   image: "path/to/user/avatar.jpg",
  //   name: "User Name",
  //   role: "User Role",
  // },
  
  // Twitter/X testimonial example:
  // {
  //   type: "twitter",
  //   id: "twitter-1", 
  //   tweetId: "actual_tweet_id_from_x", // Get this from the tweet URL
  // },
  
  // Peerlist testimonial example:
  // {
  //   type: "peerlist",
  //   id: "peerlist-1",
  //   author: {
  //     name: "Author Name",
  //     username: "username",
  //     avatar: "path/to/avatar.jpg",
  //     title: "Job Title",
  //   },
  //   content: "Testimonial content...",
  //   likes: 24,
  //   comments: 5,
  //   projectName: "Your Project",
  //   projectUrl: "https://yourproject.com",
  // },
  
  // Product Hunt testimonial example:
  // {
  //   type: "producthunt",
  //   id: "ph-1",
  //   author: {
  //     name: "Author Name",
  //     username: "username",
  //     avatar: "path/to/avatar.jpg", 
  //     title: "Job Title",
  //     isMaker: false,
  //   },
  //   content: "Testimonial content...",
  //   upvotes: 47,
  //   comments: 12,
  //   productName: "Your Product Name",
  //   productUrl: "https://www.producthunt.com/posts/your-product",
  //   badge: "daily_winner", // Options: 'daily_winner' | 'weekly_winner' | 'featured' | 'top_comment'
  // },
];

// Instructions for real implementation:

/*
  To use this testimonial system in your application:

  1. Replace sample tweet IDs with real ones from your X/Twitter testimonials
  2. Update Peerlist testimonials with actual user data and content
  3. Update Product Hunt testimonials with real user reviews and data
  4. Add more testimonials as needed
  5. The randomization system will automatically distribute them across columns
  
  Example in your component:
  
  import { Testimonials } from '@/components/ui/testimonials';
  
  function MyPage() {
    return (
      <div>
        <Testimonials />
      </div>
    );
  }
  
  All testimonials will be automatically:
  - Randomized in order
  - Distributed across 3 columns on desktop
  - Styled consistently in dark mode
  - Responsive for different screen sizes
*/
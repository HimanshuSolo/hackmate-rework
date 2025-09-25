'use client'

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Sparkles} from "lucide-react"
import { Navbar } from "@/components/ui/navbar"
import Spline from '@splinetool/react-spline'
import { M_PLUS_1p } from "next/font/google"
import FixedBadges from "@/components/ui/fixed-badges"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import HowItWorks from "@/components/ui/how-it-works"

const mPlus1p = M_PLUS_1p({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700']
})

export default function LandingPage() {
  const { isSignedIn } = useUser()
  const router = useRouter()
  
  // Handle CTA button click
  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/explore')
    } else {
      router.push('/sign-in')
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col pt-11 md:pt-2">
      <Navbar />
      
      {/* Fixed badges for landing page only */}
      <FixedBadges />
      
      {/* Hero Section */}
      <main>
        <div className="container mx-auto px-6 pt-10 pb-6 md:py-2 relative">
          {/* Background Spline Component for Small Screens */}
          <div className="md:hidden absolute inset-0 z-0 opacity-45 mt-2">
            <Spline
              style={{
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
              scene="https://prod.spline.design/4IbP1LKZzqcXufXQ/scene.splinecode"
            />
            {/* Hide Spline watermark on mobile - positioned to match watermark location */}
            <div 
              className="absolute pointer-events-none z-10"
              style={{
                backgroundColor: 'hsl(0, 0%, 4%)',
                bottom: '20px',
                right: '20px',
                width: '137px',
                height: '36px',
                borderRadius: '10px'
              }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl md:text-6xl text-white/80 tracking-tight" style={{ ...mPlus1p.style, fontWeight: 600 }}>
                  <span className="text-primary block">Find Your Perfect</span>
                  <span className="block">Co-Founder</span>
                </h1>
                <p className="mt-4 text-neutral-600 dark:text-neutral-300/80" style={{ ...mPlus1p.style, fontWeight: 400 }}>
                  A swipe-based platform connecting founders and builders with their ideal collaborators. 
                  No social profiles, no fluff. Just raw experience, aligned intent, and mutual interest.
                </p>
              </div>
              <InteractiveHoverButton onClick={handleGetStarted}>
                Get Started
              </InteractiveHoverButton>
            </div>
            
            <div className="hidden md:block relative">
              <Spline
                style={{
                  width: "100%",
                  height: "100vh",
                  pointerEvents: "auto",
                }}
                
                scene="https://prod.spline.design/4IbP1LKZzqcXufXQ/scene.splinecode"
              />
              <div 
                className="absolute pointer-events-none z-50"
                style={{
                  backgroundColor: 'hsl(0, 0%, 4%)',
                  bottom: '15px',
                  right: '15px',
                  width: '200px',
                  height: '60px'
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* How it works */}
      <HowItWorks />

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold">Hackmate</span>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Hackmate. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

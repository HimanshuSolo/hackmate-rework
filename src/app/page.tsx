'use client'

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles} from "lucide-react"
import { Navbar } from "@/components/ui/navbar"
import Spline from '@splinetool/react-spline';


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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <main>
        <div className="container mx-auto px-6   py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight">
                  <span className="text-primary block">Find Your Perfect</span>
                  <span className="block">Co-Founder</span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                  A swipe-based platform connecting founders and builders with their ideal collaborators. 
                  No social profiles, no fluff. Just raw experience, aligned intent, and mutual interest.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="px-8 py-6 text-lg flex items-center gap-2 hover:cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Profile Card - Hidden on Mobile */}
            <div className="hidden md:block">
              <Spline
                style={{
                  width: "100%",
                  height: "100vh",
                  pointerEvents: "auto",
                }}
                scene="https://prod.spline.design/z7hD8uCHC55lTHtO/scene.splinecode"
              />
            </div>



          </div>
        </div>

      </main>
      
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
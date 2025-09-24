'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import {Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export const AuthNavbar = () => {
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={cn(
        "flex items-center fixed top-0 z-50 w-full h-18 transition-all duration-200",
        scrolled 
          ? "fixed top-0 w-full border-b z-50  bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" 
          : "fixed top-0 w-full border-b z-50  bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center ">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
            </Link>
          </div>         
        </div>
      </div>
    </nav>
  )
}

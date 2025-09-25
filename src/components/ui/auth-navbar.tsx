'use client'

import Link from 'next/link'
import {Zap } from 'lucide-react'

export const AuthNavbar = () => {
  return (
    <nav 
      className="flex items-center fixed top-0 z-50 w-full h-18 transition-all duration-200 bg-neutral-900/20 backdrop-blur-md border-b border-neutral-800/30 shadow-lg"
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

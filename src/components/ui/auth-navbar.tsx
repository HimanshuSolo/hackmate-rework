'use client'

import { UserButton } from '@clerk/nextjs'
import { ModeToggle } from './toggle-button'

export const AuthNavbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full h-16 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border-b border-gray-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0 text-xl font-bold">
            HackMate
          </div>
          
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  )
}
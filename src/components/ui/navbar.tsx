'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ModeToggle } from './toggle-button'
import { Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

const navigation = [
  { name: 'Explore', href: '/explore' },
  { name: 'Profile', href: '/profile' },
  { name: 'Admin', href: '/admin', requiresAdmin: true },
]

export const Navbar = () => {
  const pathname = usePathname()
  const isAdmin = false // Replace with your actual admin check

  return (
    <nav className="fixed top-0 z-50 w-full h-16 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border-b border-gray-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">
              HackMate
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <div className="flex space-x-8">
              {navigation.map((item) => {
                if (item.requiresAdmin && !isAdmin) return null;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200',
                      pathname === item.href 
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
            
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden flex items-center space-x-4">
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {navigation.map((item) => {
                  if (item.requiresAdmin && !isAdmin) return null;
                  
                  return (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'w-full',
                          pathname === item.href && 'text-primary'
                        )}
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
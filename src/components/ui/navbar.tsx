'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ModeToggle } from './toggle-button'
import { Menu, Sparkles } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Button } from './button'
import { Badge } from './badge'
import { useEffect, useState } from 'react'

const navigation = [
  { name: 'Explore', href: '/explore' },
  { name: 'Profile', href: '/profile' },
]

export const Navbar = () => {
  const pathname = usePathname()
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
        "fixed top-0 z-50 w-full h-16 transition-all duration-200",
        scrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" 
          : "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                HackMate
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <div className="flex space-x-6">
              {navigation.map((item) => {
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'px-2 py-1 rounded-md text-sm font-medium transition-colors duration-200',
                      pathname === item.href 
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-700 hover:text-primary hover:bg-primary/5 dark:text-gray-200 dark:hover:text-primary'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
            
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                  }
                }}
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden flex items-center space-x-4">
            <ModeToggle />
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8"
                }
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] mt-2">
                {navigation.map((item) => {
                  
                  return (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'w-full flex items-center py-1.5',
                          pathname === item.href && 'bg-primary/10 text-primary font-medium'
                        )}
                      >
                        {item.name}
                        {pathname === item.href && (
                          <Badge variant="secondary" className="ml-auto py-0 px-1.5 text-xs">Active</Badge>
                        )}
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
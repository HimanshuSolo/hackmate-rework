'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Chakra_Petch } from 'next/font/google'

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const AuthNavbar = () => {
  return (
    <nav 
      className="flex items-center fixed top-0 z-50 w-full h-16 transition-all duration-200 bg-neutral-900/20 backdrop-blur-md border-b border-neutral-800/30 shadow-lg"
    >
      <div className="container mx-auto px-3">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-500/40 mr-1" />
                <div className={`${chakraPetch.className} text-lg md:text-xl text-white/85 select-none whitespace-nowrap`}>
                  HackMate
                </div>
              </div>
            </Link>
          </div>         
        </div>
      </div>
    </nav>
  )
}

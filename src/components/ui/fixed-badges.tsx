'use client'

import React from 'react'
import ProductHuntBadge from './product-hunt'
import PeerlistBadge from './peerlist-badge'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

const FixedBadges = () => {
    const { shouldMoveUp } = useScrollAnimation()
    
    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {/* Container for both badges with responsive sizing */}
        {/* Hide on mobile (below sm), show on tablet and desktop */}
        <div className="hidden sm:flex flex-col items-end gap-2 pointer-events-auto">
            <ProductHuntBadge />
            <PeerlistBadge />
        </div>
        
        {/* Mobile version - smaller and stacked with scroll animation */}
        <div 
            className={`sm:hidden flex flex-col items-end gap-2 pointer-events-auto scale-75 origin-bottom-right transition-transform duration-300 ease-in-out ${
                shouldMoveUp ? 'transform -translate-y-25' : 'transform translate-y-0'
            }`}
        >
            <ProductHuntBadge />
            <PeerlistBadge />
        </div>
        </div>
    )
}

export default FixedBadges

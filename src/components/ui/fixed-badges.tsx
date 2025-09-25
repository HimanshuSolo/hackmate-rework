'use client'

import React from 'react'
import ProductHuntBadge from './productHunt'
import PeerlistBadge from './peerlistBadge'

const FixedBadges = () => {
    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {/* Container for both badges with responsive sizing */}
        {/* Hide on mobile (below sm), show on tablet and desktop */}
        <div className="hidden sm:flex flex-col gap-2 pointer-events-auto">
            <ProductHuntBadge />
            <PeerlistBadge />
        </div>
        
        {/* Mobile version - smaller and stacked */}
        <div className="sm:hidden flex flex-col gap-2 pointer-events-auto scale-75 origin-bottom-right">
            <ProductHuntBadge />
            <PeerlistBadge />
        </div>
        </div>
    )
}

export default FixedBadges

import React from 'react'

const PeerlistBadge = () => {
    return (
        <div className="transition-transform hover:scale-104 drop-shadow-lg">
            <a 
                href="https://peerlist.io/dfordp/project/hackmate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
            >
                <img
                    src="https://peerlist.io/api/v1/projects/embed/PRJHJKNR7KLEGQGOG1AQJJMBRREMRN?showUpvote=true&theme=light"
                    alt="HackMate"
                    className="w-auto h-14 md:h-14 lg:h-15 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-200/20"
                />
            </a>
        </div>
    )
}

export default PeerlistBadge

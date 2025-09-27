import React from 'react'

const ProductHuntBadge = () => {
    return (
        <div className="transition-transform hover:scale-104 drop-shadow-lg">
            <a 
                href="https://www.producthunt.com/products/hackmate?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-hackmate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
            >
                <img 
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1018821&theme=light&t=1758782374197" 
                    alt="Hackmate - No social profiles, no fluff. Just raw experience | Product Hunt" 
                    className="w-48 h-auto md:w-48 lg:w-52 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-200/20"
                    width="250" 
                    height="54" 
                />
            </a>
        </div>
    )
}

export default ProductHuntBadge

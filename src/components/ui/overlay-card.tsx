"use client";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { DM_Serif_Display } from "next/font/google";

const dmSerifDisplay = DM_Serif_Display({
    subsets: ['latin'],
    weight: ['400']
});

export function OverlayCard({title, content, imgUrl, gifUrl}: {title: string, content: string, imgUrl: string, gifUrl: string}) {
    // Preload the GIF to avoid loading delay on hover
    useEffect(() => {
        const img = new Image();
        img.src = gifUrl;
    }, [gifUrl]);

    return (
        <div className="w-full h-full">
            <div
                className={cn(
                "group w-full cursor-pointer overflow-hidden relative card h-80 sm:h-96 lg:h-96 xl:h-[420px] rounded-4xl shadow-xl hover:shadow-2xl mx-auto flex flex-col justify-end p-6 border border-transparent dark:border-neutral-800",
                "bg-cover bg-center",
                "transition-all duration-500 hover:scale-102 transform"
                )}
                style={{
                    backgroundImage: `url(${imgUrl})`,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundImage = `url(${gifUrl})`;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundImage = `url(${imgUrl})`;
                }}
            >
                <div className="text relative">
                    <h1 className={`${dmSerifDisplay.className} font-semibold text-xl sm:text-2xl lg:text-3xl text-gray-50 group-hover:text-white/60 relative mb-3 transition-colors duration-300`}>
                        {title}
                    </h1>
                    <p className="font-normal text-sm sm:text-base lg:text-sm xl:text-base text-gray-50 group-hover:text-white/60 relative leading-relaxed transition-colors duration-300">
                        {content}
                    </p>
                </div>
            </div>
        </div>
    );
}

import React from 'react';

interface RibbonFrameProps {
  children: React.ReactNode;
  className?: string;
}

export default function RibbonFrame({ children, className = '' }: RibbonFrameProps) {
  return (
    <div 
      className={`relative p-8 md:p-10 bg-[#FCFAF6] rounded-[2rem] shadow-[0_8px_24px_rgba(123,82,68,0.07)] border-[3px] border-[#CE3A74] hover:shadow-[0_12px_32px_rgba(206,58,116,0.15)] transition-all duration-300 ${className}`}
    >
      {/* Hand-stitched styled scrapbooking inner line */}
      <div className="absolute inset-2 rounded-[1.6rem] border border-dashed border-[#CE3A74]/50 pointer-events-none" />

      {/* Cute Bow centered on the top boundary */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-3 bg-[#FCFAF6] flex items-center justify-center">
        <svg 
          width="42" 
          height="28" 
          viewBox="0 0 42 28" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#CE3A74] drop-shadow-[0_2px_4px_rgba(206,58,116,0.15)]"
        >
          {/* Left loop of the bow */}
          <path 
            d="M21 11 C15 3, 5 5, 8 13 C10 17, 17 14, 21 11 Z" 
            fill="#CE3A74" 
            stroke="#CE3A74" 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
          />
          {/* Right loop of the bow */}
          <path 
            d="M21 11 C27 3, 37 5, 34 13 C32 17, 25 14, 21 11 Z" 
            fill="#CE3A74" 
            stroke="#CE3A74" 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
          />
          {/* Left hanging tail ribbon */}
          <path 
            d="M19 13 C15 19, 12 24, 7 25 C11 23, 16 19, 19 13 Z" 
            fill="#CE3A74" 
          />
          {/* Right hanging tail ribbon */}
          <path 
            d="M23 13 C27 19, 30 24, 35 25 C31 23, 26 19, 23 13 Z" 
            fill="#CE3A74" 
          />
          {/* Center rounded knot */}
          <rect 
            x="18.5" 
            y="9" 
            width="5" 
            height="5" 
            rx="2.5" 
            fill="#CE3A74" 
            stroke="#FCFAF6" 
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Card Content Holder */}
      <div className="relative z-10 w-full h-auto">
        {children}
      </div>
    </div>
  );
}




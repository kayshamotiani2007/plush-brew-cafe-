import React from 'react';

interface HangingStringProps {
  children: React.ReactNode;
}

export default function HangingString({ children }: HangingStringProps) {
    return (
        <div className="flex flex-col items-center">
            {/* The String */}
            <div className="w-0.5 h-16 bg-[#DED6CB]"></div>
            
            {/* The Item */}
            <div>
                {children}
            </div>
        </div>
    );
}

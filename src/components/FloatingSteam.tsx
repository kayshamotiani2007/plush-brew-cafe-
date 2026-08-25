import React from 'react';

const FloatingSteam = () => {
    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path
                className="steam-element"
                stroke="#7B5244"
                strokeWidth="1"
                fill="none"
                d="M50 80 Q60 50, 40 20 T50 -10"
                style={{ opacity: 0.3 }}
            />
             <path
                className="steam-element"
                stroke="#7B5244"
                strokeWidth="1"
                fill="none"
                d="M60 80 Q70 50, 50 20 T60 -10"
                style={{ opacity: 0.2 }}
            />
        </svg>
      );
};

export default FloatingSteam;

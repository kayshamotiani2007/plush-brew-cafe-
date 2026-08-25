import React from 'react';

const FloatingSparkles = () => {
    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
             <circle className="sparkle-element" cx="20" cy="20" r="1" fill="#E6D6FF" />
             <circle className="sparkle-element" cx="80" cy="50" r="1.5" fill="#E6D6FF" />
             <circle className="sparkle-element" cx="50" cy="80" r="1" fill="#E6D6FF" />
        </svg>
      );
};

export default FloatingSparkles;

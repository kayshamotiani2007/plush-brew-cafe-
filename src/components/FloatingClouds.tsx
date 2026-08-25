import React from 'react';

const FloatingClouds = () => {
    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path
                className="cloud-element"
                fill="#FFF8F0"
                d="M10 20 C5 20, 0 30, 0 40 C0 50, 10 55, 20 55 C25 65, 40 65, 45 55 C50 65, 65 65, 70 55 C85 55, 95 50, 95 40 C95 30, 85 20, 75 25 C70 15, 55 15, 50 25 C45 15, 30 15, 25 25 C20 15, 10 15, 10 20 Z"
                style={{ opacity: 0.7 }}
            />
        </svg>
      );
};

export default FloatingClouds;

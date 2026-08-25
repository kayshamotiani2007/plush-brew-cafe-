import React from 'react';

const FloatingHearts = () => {
  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {Array.from({ length: 5 }).map((_, i) => (
            <path
                key={i}
                className="heart-element"
                fill="#FADADD"
                d="M50 20 C50 10, 60 5, 75 5 C85 5, 95 15, 95 30 C95 45, 80 60, 50 90 C20 60, 5 45, 5 30 C5 15, 15 5, 25 5 C40 5, 50 10, 50 20"
                style={{ opacity: 0.6, transformOrigin: 'center' }}
            />
        ))}
    </svg>
  );
};

export default FloatingHearts;

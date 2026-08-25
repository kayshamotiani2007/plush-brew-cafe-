import React from 'react';

const FloatingMarshmallows = () => {
    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
             <rect className="marshmallow-element" x="30" y="30" width="15" height="15" rx="5" fill="#FFF8F0" stroke="#FADADD" strokeWidth="0.5" />
             <rect className="marshmallow-element" x="70" y="70" width="10" height="10" rx="3" fill="#FFF8F0" stroke="#FADADD" strokeWidth="0.5" />
        </svg>
      );
};

export default FloatingMarshmallows;

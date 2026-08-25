/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FloatingHearts from './FloatingHearts';
import FloatingSteam from './FloatingSteam';
import FloatingClouds from './FloatingClouds';
import FloatingSparkles from './FloatingSparkles';
import FloatingMarshmallows from './FloatingMarshmallows';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedPlushieBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax & Scroll animations
    const ctx = gsap.context(() => {
        // Layered Parallax
        const layers = [
            { selector: '.cloud-element', speed: 0.2 },
            { selector: '.heart-element', speed: 0.4 },
            { selector: '.marshmallow-element', speed: 0.6 },
            { selector: '.sparkle-element', speed: 0.8 },
        ];

        layers.forEach((layer) => {
            gsap.to(layer.selector, {
                y: () => 100 * layer.speed,
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                },
            });
        });

        // Other animations (floating)
        gsap.to('.marshmallow-element', {
            rotation: 10,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            duration: 3
        });

        // Bottom Message Animation
        gsap.to('#footer-message', {
            opacity: 1,
            scrollTrigger: {
                trigger: document.body,
                start: 'bottom 90%',
                end: 'bottom bottom',
                scrub: true,
            }
        });
        
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-30 pointer-events-none">
      <FloatingClouds />
      <FloatingHearts />
      <FloatingMarshmallows />
      <FloatingSparkles />
      <FloatingSteam />
      
      <div id="footer-message" className="fixed bottom-10 left-0 w-full text-center opacity-0 pointer-events-none">
          <p className="font-serif text-2xl text-[#7A6054]">Collect moments ✨</p>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import RibbonFrame from './RibbonFrame';
// @ts-expect-error - image asset loaded by Vite
import cinnamonLatteImg from '../assets/images/cinnamon_latte_1781559166317.jpg';
// @ts-expect-error - image asset loaded by Vite
import macAndCheeseImg from '../assets/images/baked_mac_cheese_1781561058250.jpg';
// @ts-expect-error - image asset loaded by Vite
import avocadoToastImg from '../assets/images/pesto_avocado_toast_1781560742244.jpg';
// @ts-expect-error - image asset loaded by Vite
import hotChocolateImg from '../assets/images/spiced_hot_chocolate_1781561020201.jpg';
// @ts-expect-error - image asset loaded by Vite
import strawberryMatchaImg from '../assets/images/strawberry_matcha_latte_1781774581384.jpg';

interface WelcomePageProps {
  onEnter: () => void;
}

export default function WelcomePage({ onEnter }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3A2D27] p-8 md:p-16 flex flex-col items-center justify-center relative overflow-hidden" id="welcome-page">
      {/* Decorative ambient elements */}
      <div className="absolute top-10 left-10 text-pink-200/50 pointer-events-none animate-pulse">
        <Sparkles size={40} />
      </div>
      <div className="absolute bottom-10 right-10 text-pink-200/50 pointer-events-none animate-pulse delay-1000">
        <Sparkles size={50} />
      </div>

      <div className="text-center max-w-5xl md:max-w-6xl w-full mb-20 mt-8 flex flex-col items-center">
         <h1 className="font-serif text-7xl md:text-8xl font-black tracking-tighter text-[#3A2D27] mb-24 md:mb-32">Plush Brew</h1>
          <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl md:max-w-6xl mx-auto px-4 w-full">
           <RibbonFrame className="plush-card hover-float duration-300 h-full flex flex-col">
             <h3 className="font-serif text-2xl font-black mb-3 text-[#CE3A74]">Our Sanctuary</h3>
             <p className="text-[#60493F] font-sans text-sm leading-relaxed">Your historic Jaipur sanctuary, where time slows down. Plush Brew is a haven tailored for comfort and connection.</p>
           </RibbonFrame>

           <RibbonFrame className="plush-card hover-float duration-300 h-full flex flex-col">
             <h3 className="font-serif text-2xl font-black mb-3 text-[#CE3A74]">Cozy Interior</h3>
             <p className="text-[#60493F] font-sans text-sm leading-relaxed">Drift into relaxation as you settle onto our plush cushion seats or gently sway in our signature hanging swing chairs, designed to make every moment feel like a gentle embrace.</p>
           </RibbonFrame>

           <RibbonFrame className="plush-card hover-float duration-300 h-full flex flex-col">
             <h3 className="font-serif text-2xl font-black mb-3 text-[#CE3A74]">Artisanal Menu</h3>
             <p className="text-[#60493F] font-sans text-sm leading-relaxed">Our menu is a curated celebration of flavors, brought to life by our highly trained chefs who approach each dish with passion, precision, and unwavering commitment to quality.</p>
           </RibbonFrame>
         </div>
      </div>

      {/* Proceed to Passport button centered and above the photo */}
      <div className="flex justify-center mb-12 z-10">
        <button
          onClick={onEnter}
          className="plush-btn text-lg hover-float-button group"
        >
          Proceed to Register / Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="w-full max-w-5xl md:max-w-6xl flex flex-col z-10 mb-8 px-4">
        {/* Centered Plush Specials heading */}
        <h2 className="font-serif text-6xl md:text-8xl font-black text-[#CE3A74] tracking-tight mb-10 uppercase text-center w-full mt-4 drop-shadow-sm">
          Plush Specials
        </h2>
        
        {/* Collage list of plush specials */}
        <div className="flex flex-col items-center justify-center mt-12 mb-20 w-full">
          {[
            { src: cinnamonLatteImg, alt: "Cinnamon Latte", rotate: -5, translate: "-translate-x-8 md:-translate-x-32", zIndex: "z-10" },
            { src: avocadoToastImg, alt: "Avocado Toast", rotate: 7, translate: "translate-x-12 md:translate-x-24", marginTop: "-mt-16 md:-mt-24", zIndex: "z-20" },
            { src: hotChocolateImg, alt: "Hot Chocolate", rotate: -4, translate: "-translate-x-10 md:-translate-x-20", marginTop: "-mt-20 md:-mt-28", zIndex: "z-30" },
            { src: macAndCheeseImg, alt: "Mac and Cheese", rotate: 9, translate: "translate-x-8 md:translate-x-32", marginTop: "-mt-16 md:-mt-24", zIndex: "z-40" },
            { src: strawberryMatchaImg, alt: "Strawberry Matcha", rotate: -6, translate: "-translate-x-2 md:-translate-x-12", marginTop: "-mt-20 md:-mt-32", zIndex: "z-50" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ rotate: item.rotate }}
              animate={{
                y: [-6, 6, -6],
              }}
              transition={{
                duration: 4,
                delay: index * 0.2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                zIndex: 100,
                cursor: 'grab',
              }}
              className={`relative select-none flex flex-col items-center bg-white p-3 pb-12 md:p-4 md:pb-16 shadow-[0_15px_35px_rgba(0,0,0,0.15)] rounded border border-gray-100 w-56 md:w-72 ${item.translate} ${item.marginTop || ''} ${item.zIndex}`}
            >
              {/* Cute tape piece */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-red-300/40 rotate-[-3deg] backdrop-blur-sm shadow-sm" />
              
              {/* Optional bow emoji to mimic the provided image */}
              <div className="absolute -top-5 -right-4 text-3xl md:text-5xl drop-shadow-md rotate-12">
                🎀
              </div>

              <div className="relative w-full aspect-square overflow-hidden bg-gray-50 border border-gray-100">
                <img
                  src={item.src}
                  alt={item.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-serif italic text-gray-700 mt-4 md:mt-6 text-sm md:text-base text-center w-full">
                {item.alt}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

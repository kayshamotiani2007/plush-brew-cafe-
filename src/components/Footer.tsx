/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GlassWater, Terminal, MapPin, Compass, Landmark } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: 'lobby' | 'menu' | 'booking' | 'loyalty' | 'reviews' | 'admin' | 'story' | 'location') => void;
  isAuthorized: boolean;
}

export default function Footer({ setCurrentView, isAuthorized }: FooterProps) {
  
  if (isAuthorized) {
    return (
      <footer className="bg-[#422026] text-pink-100/90 border-t border-[#CE3A74]/25 py-8" id="global-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="font-serif text-sm font-extrabold tracking-wider text-pink-100">
            🎀 PLUSH BREW COASYSTEMS • MANAGEMENT DESK ☕
          </p>
          <p className="font-mono text-[9px] tracking-widest text-[#FFCAD6]/70 uppercase font-bold">
            Amrapali Circle Floor 4, Navajyoti Tower, Vaishali Nagar, Jaipur
          </p>
          <p className="font-mono text-[9px] text-[#FFCAD6]/50">
            © 2026 Plush Brew. All rights reserved. Secure Administrative Desk Session.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#422026] text-pink-100/90 border-t border-[#CE3A74]/25 py-12" id="global-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* COLUMN 1: BRAND EMBLEM & MANIFESTO */}
          <div className="lg:col-span-5 space-y-4">
            <button
              onClick={() => setCurrentView('lobby')}
              className="flex items-center gap-2 group focus:outline-none"
              id="footer-logo-btn"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF5F6] text-[#CE3A74] shadow-md">
                <GlassWater className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <h4 className="font-serif text-sm font-extrabold tracking-wider text-pink-100">
                  PLUSH BREW CORPORATION
                </h4>
                <p className="font-mono text-[8px] tracking-widest text-[#FFCAD6]/70 uppercase font-bold">
                  Est. 2026 • Jaipur
                </p>
              </div>
            </button>
            <p className="font-sans text-xs text-pink-100/80 leading-relaxed max-w-sm">
              Crafting premium molasses-simmered tapioca bubbles, slow sun-cured loose leaf tea blends, and cold-fermented toasted sourdough brioche bagels. Elevating slow Jaipur golden hours, one cup at a time.
            </p>
          </div>

          {/* COLUMN 2: QUICK COORDINATES */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="font-serif text-xs font-bold tracking-wider text-pink-200 uppercase">
              Lobby Coordinates
            </h5>
            <ul className="space-y-2.5 font-sans text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('story')}
                  className="hover:text-pink-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  id="footer-link-story"
                >
                  <Landmark className="h-3.5 w-3.5 opacity-60" /> Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('lobby')}
                  className="hover:text-pink-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  id="footer-link-lobby"
                >
                  <Landmark className="h-3.5 w-3.5 opacity-60" /> Lobby Entrance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('menu')}
                  className="hover:text-pink-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  id="footer-link-menu"
                >
                  <GlassWater className="h-3.5 w-3.5 opacity-60" /> Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('location')}
                  className="hover:text-pink-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  id="footer-link-location"
                >
                  <MapPin className="h-3.5 w-3.5 opacity-60" /> Location
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: OPERATIONAL CORPORATE ADDRESS */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="font-serif text-xs font-bold tracking-wider text-pink-200 uppercase flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Jaipur HQ
            </h5>
            <p className="font-sans text-xs text-pink-100/80 leading-relaxed">
              Amrapali Circle Floor 4,<br />
              Navajyoti Tower, Vaishali Nagar,<br />
              Jaipur, Rajasthan - 302021
            </p>
            <div className="font-mono text-[9px] text-[#FFCAD6]/60 block font-semibold">
              Contact: concierge@plushbrew.com
            </div>
          </div>

        </div>

        {/* BOTTOM RULER */}
        <div className="border-t border-[#CE3A74]/20 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-pink-200/40 text-center sm:text-left">
            © 2026 Plush Brew Corporation. All rights reserved.{' '}
            <button
              onClick={() => setCurrentView('admin')}
              className="text-pink-200/20 hover:text-pink-100/60 transition-colors cursor-pointer ml-1.5 underline underline-offset-2"
              id="footer-manager-portal-trigger"
            >
              Staff Portal
            </button>
          </p>
          <p className="font-mono text-[10px] text-pink-200/30 text-center sm:text-right">
            Crafted for historic Jaipur golden hours.
          </p>
        </div>

      </div>
    </footer>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GlassWater, Landmark, Calendar, ShoppingBag, Terminal, Award, MessageSquare } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  cartCount: number;
  openCart: () => void;
  isAuthorized: boolean;
  currentUser: { email: string; name: string } | null;
  onLogout: () => void;
}

export default function Header({
  currentView,
  setCurrentView,
  cartCount,
  openCart,
  isAuthorized,
  currentUser,
  onLogout
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#CE3A74]/15 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo / Brand Emblem */}
        <button
          onClick={() => setCurrentView('lobby')}
          className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity focus:outline-none"
          id="brand-logo-btn"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#CE3A74] text-white shadow-md shadow-[#CE3A74]/10">
            <GlassWater className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-extrabold tracking-tight text-pink-700">
              PLUSH BREW
            </h1>
            <p className="font-mono text-[9px] tracking-widest text-[#CE3A74] font-bold uppercase">
              Vaishali Nagar, Jaipur
            </p>
          </div>
        </button>

        {/* Navigation - Desk */}
        <nav className="hidden md:flex items-center gap-8">
          {!isAuthorized ? (
            <>
              <button
                onClick={() => setCurrentView('lobby')}
                className={`font-sans text-sm font-medium transition-colors hover:text-[#CE3A74] ${
                  currentView === 'lobby' ? 'text-[#CE3A74] font-bold border-b-2 border-[#CE3A74] pb-1' : 'text-[#5B3E31]/70'
                }`}
                id="nav-lobby"
              >
                Lobby
              </button>
              
              <button
                onClick={() => setCurrentView('story')}
                className={`font-sans text-sm font-medium transition-colors hover:text-[#CE3A74] ${
                  currentView === 'story' ? 'text-[#CE3A74] font-bold border-b-2 border-[#CE3A74] pb-1' : 'text-[#5B3E31]/70'
                }`}
                id="nav-story"
              >
                Our Story
              </button>
              
              <button
                onClick={() => setCurrentView('location')}
                className={`font-sans text-sm font-medium transition-colors hover:text-[#CE3A74] ${
                  currentView === 'location' ? 'text-[#CE3A74] font-bold border-b-2 border-[#CE3A74] pb-1' : 'text-[#5B3E31]/70'
                }`}
                id="nav-location"
              >
                Location
              </button>
              
              <button
                onClick={() => setCurrentView('menu')}
                className={`font-sans text-sm font-medium transition-colors hover:text-[#CE3A74] flex items-center gap-1.5 ${
                  currentView === 'menu' ? 'text-[#CE3A74] font-bold border-b-2 border-[#CE3A74] pb-1' : 'text-[#5B3E31]/70'
                }`}
                id="nav-menu"
              >
                <GlassWater className="h-4 w-4" />
                Menu
              </button>

              <button
                onClick={() => setCurrentView('booking')}
                className={`font-sans text-sm font-medium transition-colors hover:text-[#CE3A74] flex items-center gap-1.5 ${
                  currentView === 'booking' ? 'text-[#CE3A74] font-bold border-b-2 border-[#CE3A74] pb-1' : 'text-[#5B3E31]/70'
                }`}
                id="nav-booking"
              >
                <Calendar className="h-4 w-4" />
                Reserve Table
              </button>

              <button
                onClick={() => setCurrentView('loyalty')}
                className={`font-sans text-sm font-medium transition-colors hover:text-[#CE3A74] flex items-center gap-1.5 ${
                  currentView === 'loyalty' ? 'text-[#CE3A74] font-bold border-b-2 border-[#CE3A74] pb-1' : 'text-[#5B3E31]/70'
                }`}
                id="nav-loyalty"
              >
                <Award className="h-4 w-4" />
                Stamp Loyalty
              </button>

<button
                 onClick={() => setCurrentView('reviews')}
                 className={`font-sans text-sm font-medium transition-colors hover:text-[#CE3A74] flex items-center gap-1.5 ${
                   currentView === 'reviews' ? 'text-[#CE3A74] font-bold border-b-2 border-[#CE3A74] pb-1' : 'text-[#5B3E31]/70'
                 }`}
                 id="nav-reviews"
               >
                 <MessageSquare className="h-4 w-4" />
                 Reviews
               </button>
             </>
           ) : null}
        </nav>

        {/* Auxiliary Controls */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2 bg-[#FDFBF7] border border-pink-100 px-3 py-1.5 rounded-xl text-xs font-sans text-slate-700" id="header-user-badge">
              <span className="h-2 w-2 rounded-full bg-green-500 inline-block animate-pulse shrink-0" />
              <span className="font-serif font-black text-[#5B3E31] leading-none truncate max-w-[100px]" title={currentUser.email}>{currentUser.name}</span>
              <button 
                onClick={onLogout}
                className="font-mono text-[9px] text-[#CE3A74] hover:underline uppercase pl-1.5 font-bold border-l border-slate-200 cursor-pointer"
                id="header-logout-btn"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Order / Cart Trigger */}
          <button
            onClick={openCart}
            className="hover-float-button relative flex h-10 w-10 items-center justify-center rounded-full border border-[#CE3A74]/15 bg-white text-[#CE3A74] shadow-sm hover:bg-[#CE3A74]/5 hover:text-[#CE3A74] transition-all"
            aria-label="Toggle Shopping Cart"
            id="cart-trigger-btn"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#CE3A74] text-[10px] font-bold text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Sticky Subbar navigation for small screens */}
      {!isAuthorized ? (
        <div className="flex justify-around items-center border-t border-[#CE3A74]/5 bg-white md:hidden py-2 text-xs">
          <button
            onClick={() => setCurrentView('lobby')}
            className={`flex flex-col items-center gap-0.5 ${currentView === 'lobby' ? 'text-[#CE3A74] font-bold' : 'text-[#5B3E31]/70'}`}
          >
            <Landmark className="h-4 w-4" />
            <span>Lobby</span>
          </button>
          <button
            onClick={() => setCurrentView('menu')}
            className={`flex flex-col items-center gap-0.5 ${currentView === 'menu' ? 'text-[#CE3A74] font-bold' : 'text-[#5B3E31]/70'}`}
          >
            <GlassWater className="h-4 w-4" />
            <span>Menu</span>
          </button>
          <button
            onClick={() => setCurrentView('booking')}
            className={`flex flex-col items-center gap-0.5 ${currentView === 'booking' ? 'text-[#CE3A74] font-bold' : 'text-[#5B3E31]/70'}`}
          >
            <Calendar className="h-4 w-4" />
            <span>Reserve</span>
          </button>
          <button
            onClick={() => setCurrentView('loyalty')}
            className={`flex flex-col items-center gap-0.5 ${currentView === 'loyalty' ? 'text-[#CE3A74] font-bold' : 'text-[#5B3E31]/70'}`}
          >
            <Award className="h-4 w-4" />
            <span>Loyalty</span>
          </button>
<button
             onClick={() => setCurrentView('reviews')}
             className={`flex flex-col items-center gap-0.5 ${currentView === 'reviews' ? 'text-[#CE3A74] font-bold' : 'text-[#5B3E31]/70'}`}
             id="mobile-nav-reviews"
           >
             <MessageSquare className="h-4 w-4" />
             <span>Reviews</span>
           </button>
         </div>
       ) : null}
     </header>
   );
}

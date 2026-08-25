/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GlassWater, ArrowUpRight, ShieldCheck, Heart, Sparkles, MapPin, Sun, Snowflake, X, Check, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, CartItemCustomization, WallNote } from '../types';
import VirtualWall from './VirtualWall';

interface LobbyProps {
  setCurrentView: (view: 'lobby' | 'menu' | 'booking' | 'loyalty' | 'reviews' | 'admin') => void;
  addToCart: (item: MenuItem, customization?: CartItemCustomization) => void;
  wallNotes: WallNote[];
  addWallNote: (note: Omit<WallNote, 'id' | 'createdAt'>) => void;
}

interface SpotlightItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'boba' | 'bagel';
  image: string;
  badge?: string;
  season: 'Summer' | 'Winter';
}

const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  {
    id: 'spot-strawberry-matcha',
    name: 'Strawberry Cloud Matcha Latte',
    price: 360,
    description: 'Three gorgeous layers of premium shaded Kyoto Uji Matcha, creamy milk, and thick whipped sweet strawberry cold foam, garnished with an elegant edible flower.',
    category: 'boba',
    image: '/src/assets/images/strawberry_matcha_latte_1781774581384.jpg',
    badge: 'Summer Best-seller 🍓',
    season: 'Summer'
  },
  {
    id: 'spot-mango-latte',
    name: 'Mango Iced Latte',
    price: 340,
    description: 'Our signature espresso layered perfectly with cold milk and sweet, muddled organic mango puree. An absolute tropical delight.',
    category: 'boba',
    image: '/src/assets/images/mango_iced_latte_1781560724806.jpg',
    badge: 'Muddled Mango • Espresso',
    season: 'Summer'
  },
  {
    id: 'spot-avocado-toast',
    name: 'Hummus-Avocado Sourdough Toast',
    price: 350,
    description: 'Toasted wild sourdough yeast bagel spread with rich whipped hummus, muddled fresh avocados, cucumber, cherry tomatoes, and microgreens with flavor-bursting chili flakes.',
    category: 'bagel',
    image: '/src/assets/images/pesto_avocado_toast_1781560742244.jpg',
    badge: 'Fresh Baked 🥖',
    season: 'Summer'
  },
  {
    id: 'spot-hot-chocolate',
    name: 'Warm Spiced Hot Chocolate',
    price: 290,
    description: 'Creamy, rich dark hot chocolate topped with a cloud of velvety whipped cream and premium cocoa powder dusting, paired on a wooden board with classic winter spices.',
    category: 'boba',
    image: '/src/assets/images/spiced_hot_chocolate_1781561020201.jpg',
    badge: 'Winter Hug ☕',
    season: 'Winter'
  },
  {
    id: 'spot-apple-cider',
    name: 'Warm Spiced Apple Cider',
    price: 280,
    description: 'Freshly stewed sweet red apples infused with organic cinnamon bark, star anise, and fragrant winter spices, served steaming hot.',
    category: 'boba',
    image: '/src/assets/images/hot_apple_cider_1781561038527.jpg',
    badge: 'Cozy Brew 🍎',
    season: 'Winter'
  },
  {
    id: 'spot-mac-cheese',
    name: 'Gourmet Baked Mac & Cheese',
    price: 380,
    description: 'Premium elbow pasta baked in an ultra-creamy, bubbling multi-cheese fondue with a crispy golden-brown savory crust and fresh chopped parsley.',
    category: 'bagel',
    image: '/src/assets/images/baked_mac_cheese_1781561058250.jpg',
    badge: 'Comfort Food 🧀',
    season: 'Winter'
  }
];

const bobaToppingOptions = [
  { name: 'None', price: 0 },
  { name: 'Honey Tapioca Boba 🍡', price: 40 },
  { name: 'Mango Popping Boba 🥭', price: 50 },
  { name: 'Vanilla Egg Pudding 🍮', price: 50 }
];

const foodSpreadOptions = [
  { name: 'None', price: 0 },
  { name: 'Whipped Dill Cream Cheese 🥯', price: 50 },
  { name: 'Warm Nutella Slather 🍫', price: 40 },
  { name: 'Extra Whipped Hummus 🧆', price: 40 }
];

const foodSideOptions = [
  { name: 'None', price: 0 },
  { name: 'Muddled Strawberries 🍓', price: 60 },
  { name: 'Roasted Almond Flakes 🥜', price: 40 }
];

export default function Lobby({ setCurrentView, addToCart, wallNotes, addWallNote }: LobbyProps) {
  // Option state for preview/customization modal
  const [selectedItem, setSelectedItem] = useState<SpotlightItem | null>(null);
  
  // Customization selection values
  const [sweetness, setSweetness] = useState('Regular Sweet');
  const [ice, setIce] = useState('Regular Ice');
  const [selectedTopping, setSelectedTopping] = useState('None');

  const [toasted, setToasted] = useState('Golden Crust');
  const [selectedSpread, setSelectedSpread] = useState('None');
  const [selectedSide, setSelectedSide] = useState('None');

  const [quantity, setQuantity] = useState(1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleOpenCustomize = (item: SpotlightItem) => {
    setSelectedItem(item);
    setSweetness('Regular Sweet');
    setIce('Regular Ice');
    setSelectedTopping('None');
    setToasted('Golden Crust');
    setSelectedSpread('None');
    setSelectedSide('None');
    setQuantity(1);
    setShowSuccessToast(false);
  };

  const handleCloseCustomize = () => {
    setSelectedItem(null);
  };

  const getCalculatedUnitPrice = () => {
    if (!selectedItem) return 0;
    let base = selectedItem.price;
    if (selectedItem.category === 'boba') {
      const toppingVal = bobaToppingOptions.find(t => t.name === selectedTopping);
      if (toppingVal) base += toppingVal.price;
    } else {
      const spreadVal = foodSpreadOptions.find(s => s.name === selectedSpread);
      if (spreadVal) base += spreadVal.price;
      const sideVal = foodSideOptions.find(o => o.name === selectedSide);
      if (sideVal) base += sideVal.price;
    }
    return base;
  };

  const handleAddWithCustomization = () => {
    if (!selectedItem) return;

    // Build MenuItem object compatible with Cart state
    const itemCatalog: MenuItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      description: selectedItem.description,
      category: selectedItem.category,
      image: selectedItem.image,
      season: selectedItem.season === 'Summer' ? 'Summer Only' : 'Winter Only'
    };

    // Build Customization object values
    const customizationDetails: CartItemCustomization = {};
    if (selectedItem.category === 'boba') {
      customizationDetails.sweetness = sweetness;
      customizationDetails.ice = ice;
      if (selectedTopping !== 'None') {
        customizationDetails.topping = selectedTopping;
        customizationDetails.toppingPrice = bobaToppingOptions.find(t => t.name === selectedTopping)?.price || 0;
      }
    } else {
      customizationDetails.toasted = toasted;
      if (selectedSpread !== 'None') {
        customizationDetails.spread = selectedSpread;
        customizationDetails.spreadPrice = foodSpreadOptions.find(s => s.name === selectedSpread)?.price || 0;
      }
      if (selectedSide !== 'None') {
        customizationDetails.side = selectedSide;
        customizationDetails.sidePrice = foodSideOptions.find(s => s.name === selectedSide)?.price || 0;
      }
    }

    // Add multiple quantities by calling addToCart loop in sequence
    for (let i = 0; i < quantity; i++) {
      addToCart(itemCatalog, customizationDetails);
    }

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setSelectedItem(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col bg-[#FFF5F6]" id="lobby-root">
      
      {/* 1. HERO SHOT */}
      <section className="relative overflow-hidden min-h-[620px] lg:min-h-[720px] flex items-center justify-center py-16 lg:py-24 border-b border-[#CE3A74]/15 bg-gradient-to-r from-[#CE3A74] via-[#FF8EA2] to-[#FFD2DF]" id="hero-section">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/cute_hero_bg_1781558764649.jpg"
            alt="Cute Cafe Cover with Boba and Teddy Bear"
            className="w-full h-full object-cover object-center filter brightness-95 opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#CE3A74]/95 via-[#FF6289]/80 to-[#FFD5E2]/85 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#CE3A74]/15 to-[#FFF5F6]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center flex flex-col items-center justify-center space-y-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-pink-100 font-bold border border-white/15">
              <MapPin className="h-3.5 w-3.5 text-pink-200" /> Amrapali Circle, Jaipur
            </span>

            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black tracking-widest text-[#FFFDFD] uppercase drop-shadow-[0_4px_15px_rgba(206,58,116,0.6)]">
              PLUSH BREW
            </h1>
            
            <p className="font-serif italic text-lg sm:text-2xl text-pink-100 font-medium">
              Jaipur’s Sweetest Boba & Baker Sanctuary
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl font-sans text-xs sm:text-sm md:text-base text-white/95 leading-relaxed bg-black/20 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/20 shadow-inner"
          >
            Welcome to Plush Brew, Jaipur’s ultra-luxurious, super cozy boba and bagel sanctuary! 
            Experience premium molasses-simmered tape bubbles paired with freshly baked open-faced toasted supreme bagels. Crafted for delightful, warm Jaipur golden hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => setCurrentView('menu')}
              className="hover-float-button inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-sans text-sm font-bold text-[#CE3A74] shadow-xl hover:bg-pink-100 transition-all duration-300 cursor-pointer"
              id="hero-view-menu-btn"
            >
              Explore Curated Menu
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentView('booking')}
              className="hover-float-button inline-flex items-center gap-2 rounded-full border border-white bg-[#CE3A74]/35 backdrop-blur-xs px-8 py-4 font-sans text-sm font-bold text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
              id="hero-book-btn"
            >
              Reserve Lounge Table
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. BENTO ACCENT GRID */}
      <section className="py-16 bg-[#FFF9FA] border-b border-[#CE3A74]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="font-serif text-3xl font-bold text-[#5B3E31] tracking-tight">The Lounge Manifest</h3>
            <p className="font-sans text-[#CE3A74] mt-2 font-medium">Every detail curated to elevate your cute sensory luxury</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Bento 1: Sourcing */}
            <div className="hover-float flex flex-col justify-between rounded-3xl bg-white border border-[#FFCAD6] p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CE3A74] text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="font-serif text-xl font-extrabold text-[#5B3E31]">Artisanal Sourcing</h4>
                <p className="font-sans text-sm text-[#5B3E31]/90 leading-relaxed">
                  Our Uji Matcha is shade-grown in Kyoto. Our Thai Assam leaves are sun-cured. We slow cook molasses sugar hourly to guarantee soft, bouncy, extra cute tapioca chewiness.
                </p>
              </div>
              <button 
                onClick={() => setCurrentView('menu')}
                className="inline-flex items-center gap-1.5 mt-6 font-sans text-xs font-bold text-[#CE3A74] hover:underline cursor-pointer group"
              >
                View Boba Menu <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Bento 2: Sourdough Baking */}
            <div className="hover-float flex flex-col justify-between rounded-3xl bg-white border border-[#FFCAD6] p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CE3A74] text-white">
                  <Heart className="h-5 w-5" />
                </div>
                <h4 className="font-serif text-xl font-extrabold text-[#5B3E31]">Hand-Rolled Sourdough</h4>
                <p className="font-sans text-sm text-[#5B3E31]/90 leading-relaxed">
                  Baked fresh with wild Jaipurean sourdough yeast cultures. A long cold-fermented dough roll is boiled then toasted to a dual crispy and cellur sweet fluffy chew.
                </p>
              </div>
              <button 
                onClick={() => setCurrentView('menu')}
                className="inline-flex items-center gap-1.5 mt-6 font-sans text-xs font-bold text-[#CE3A74] hover:underline cursor-pointer group"
              >
                View Toast Bagels <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Bento 3: Loyalty Program */}
            <div className="hover-float flex flex-col justify-between rounded-3xl bg-white border border-[#FFCAD6] p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CE3A74] text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-serif text-xl font-extrabold text-[#5B3E31]">Virtual Stamping Card</h4>
                <p className="font-sans text-sm text-[#5B3E31]/90 leading-relaxed">
                  Collect stamps for every signature drink you sip or sourdough bagel you crunch. Your 8th item is on us, tracked digitally on our interactive stamping card board.
                </p>
              </div>
              <button 
                onClick={() => setCurrentView('loyalty')}
                className="inline-flex items-center gap-1.5 mt-6 font-sans text-xs font-bold text-[#CE3A74] hover:underline cursor-pointer group"
              >
                Build Stamp Ledger <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PLUSH SIGNATURES SECTION */}
      <section className="py-20 bg-[#FFF3F5] text-[#5B3E31] border-b border-[#CE3A74]/15" id="best-serves-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-105 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#CE3A74] font-bold bg-[#FFCAD6]/30 border border-pink-200">
              🌸 Curated Menu Spotlights • Click Photos to Customize!
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#5B3E31] tracking-tight">
              Plush Signatures
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#CE3A74] mt-2 font-medium">
              Prepared with high culinary craft. Click any photo below to customize sweetness, ice, spreads, toppings, and add directly to your plate!
            </p>
          </div>

          {/* TWO SEASONAL COLUMNS */}
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
            
            {/* COLUMN 1: SUMMER BESTS */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 border-b border-orange-200 pb-3">
                <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center text-[#CE3A74]">
                  <Sun className="h-5 w-5 text-[#CE3A74]" />
                </div>
                <div>
                  <h4 className="font-serif text-xl sm:text-2xl font-extrabold text-[#5B3E31]">Summer Serves</h4>
                  <p className="font-sans text-[10px] text-orange-600/90 tracking-wide font-semibold uppercase font-mono">Breezy & Refreshing sips & crunch</p>
                </div>
              </div>

              <div className="space-y-5">
                {SPOTLIGHT_ITEMS.filter(it => it.season === 'Summer').map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleOpenCustomize(item)}
                    className="hover-float flex gap-4 sm:gap-5 bg-white/75 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#FFCAD6]/40 shadow-sm cursor-pointer hover:border-[#CE3A74]/35 transition-all group"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 shadow-sm border border-pink-100 relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-[#CE3A74] text-white text-[9px] font-mono font-bold px-2 py-1 rounded-full uppercase tracking-wider scale-95 duration-200">
                          Customize
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-1 sm:space-y-2">
                      <h5 className="font-serif text-sm sm:text-base font-extrabold text-[#5B3E31] group-hover:text-[#CE3A74] transition-colors">{item.name}</h5>
                      <span className="inline-flex max-w-max items-center rounded-full bg-pink-100 px-2 py-0.5 text-[9px] font-mono font-bold text-[#CE3A74]">
                        {item.badge}
                      </span>
                      <p className="font-sans text-xs text-[#5B3E31]/80 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="font-mono text-[10px] text-[#CE3A74]/80 font-bold uppercase tracking-wider pt-1 flex items-center gap-1">
                        <span>₹{item.price} base price</span>
                        <span>•</span>
                        <span className="underline">Customize & Add</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: WINTER BESTS */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 border-b border-blue-200 pb-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-[#CE3A74]">
                  <Snowflake className="h-5 w-5 text-[#CE3A74]" />
                </div>
                <div>
                  <h4 className="font-serif text-xl sm:text-2xl font-extrabold text-[#5B3E31]">Winter Serves</h4>
                  <p className="font-sans text-[10px] text-blue-600/90 tracking-wide font-semibold uppercase font-mono">Warm, comforting, & fragrant sips & bites</p>
                </div>
              </div>

              <div className="space-y-5">
                {SPOTLIGHT_ITEMS.filter(it => it.season === 'Winter').map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleOpenCustomize(item)}
                    className="hover-float flex gap-4 sm:gap-5 bg-white/75 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#FFCAD6]/40 shadow-sm cursor-pointer hover:border-[#CE3A74]/35 transition-all group"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 shadow-sm border border-pink-100 relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-[#CE3A74] text-white text-[9px] font-mono font-bold px-2 py-1 rounded-full uppercase tracking-wider scale-95 duration-200">
                          Customize
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-1 sm:space-y-2">
                      <h5 className="font-serif text-sm sm:text-base font-extrabold text-[#5B3E31] group-hover:text-[#CE3A74] transition-colors">{item.name}</h5>
                      <span className="inline-flex max-w-max items-center rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-mono font-bold text-blue-700">
                        {item.badge}
                      </span>
                      <p className="font-sans text-xs text-[#5B3E31]/80 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="font-mono text-[10px] text-[#CE3A74]/80 font-bold uppercase tracking-wider pt-1 flex items-center gap-1">
                        <span>₹{item.price} base price</span>
                        <span>•</span>
                        <span className="underline">Customize & Add</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. VIRTUAL WALL */}
      <section className="py-16 bg-[#FFFDFB]" id="virtual-wall-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VirtualWall />
        </div>
      </section>

      {/* 5. INTERACTIVE SELECTION POPUP MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="customizer-modal-portal">
            {/* Backdrop filter overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseCustomize}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Body placement */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-[#FFFDFB] rounded-[2.5rem] border border-pink-100 max-w-4xl w-full shadow-2xl overflow-hidden grid md:grid-cols-12 gap-0"
              >
                {/* Success Indicator notification */}
                {showSuccessToast && (
                  <div className="absolute inset-x-0 top-0 z-55 bg-emerald-500 text-white px-6 py-4 flex items-center justify-center gap-2 shadow font-serif text-sm font-bold text-center">
                    <Check className="h-5 w-5 animate-bounce" /> Added {quantity} x {selectedItem.name} Custom Pack to Basket! 🌸
                  </div>
                )}

                {/* Left side Image Spot (Desktop) */}
                <div className="md:col-span-5 bg-[#FAF1F3] relative min-h-[250px] md:min-h-[480px]">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name} 
                    className="w-full h-full object-cover absolute inset-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  {/* Floating Specs */}
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left space-y-2">
                    <span className="inline-flex items-center rounded-full bg-pink-600 px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
                      Spotlight Selection
                    </span>
                    <h4 className="font-serif text-2xl font-black leading-tight drop-shadow-md">
                      {selectedItem.name}
                    </h4>
                    <p className="font-sans text-xs text-white/90 leading-relaxed font-medium">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Close trigger upper-right */}
                  <button 
                    onClick={handleCloseCustomize}
                    className="absolute top-4 left-4 bg-white/80 hover:bg-white text-[#CE3A74] h-9 w-9 rounded-full flex items-center justify-center shadow transition-colors cursor-pointer"
                    id="close-customize-modal-btn"
                  >
                    <X className="h-4 w-4 font-bold" />
                  </button>
                </div>

                {/* Right side Detail Customizer options (Desktop) */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left max-h-[90vh] overflow-y-auto">
                  <div className="space-y-6">
                    {/* Caption Header */}
                    <div className="border-b border-pink-100 pb-4 flex justify-between items-start">
                      <div>
                        <h2 className="font-serif text-xl font-bold text-[#5B3E31]">
                          Customize Your Sip & Bite
                        </h2>
                        <p className="text-[11px] text-[#CE3A74] font-sans font-semibold uppercase tracking-wider mt-0.5">
                          Plush Premium Customization Ledgers
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs text-[#7A6054]">Base Unit Cost</span>
                        <div className="font-serif text-xl font-black text-[#CE3A74]">₹{selectedItem.price}</div>
                      </div>
                    </div>

                    {/* LIQUID BOBA DRINK SPECIAL OPTIONS */}
                    {selectedItem.category === 'boba' ? (
                      <div className="space-y-4">
                        {/* 1. Sweetness selector */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-pink-700 font-bold">
                            🍯 Sweetness Ratio / Sugar Coords:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {['30% Less Sweet', 'Regular Sweet', '120% Extra Honey'].map((sOption) => (
                              <button
                                key={sOption}
                                type="button"
                                onClick={() => setSweetness(sOption)}
                                className={`py-2 px-3 text-[11px] font-medium rounded-xl border transition-all cursor-pointer text-center ${
                                  sweetness === sOption
                                    ? 'bg-[#CE3A74] text-white border-[#CE3A74] shadow-sm'
                                    : 'bg-white text-[#5B3E31] border-pink-100 hover:bg-pink-50/50'
                                }`}
                              >
                                {sOption}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Ice Intensity level */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-pink-700 font-bold">
                            ❄️ Ice Intensity controls:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {['No Ice', 'Less Ice', 'Regular Ice'].map((iOption) => (
                              <button
                                key={iOption}
                                type="button"
                                onClick={() => setIce(iOption)}
                                className={`py-2 px-3 text-[11px] font-medium rounded-xl border transition-all cursor-pointer text-center ${
                                  ice === iOption
                                    ? 'bg-[#CE3A74] text-white border-[#CE3A74] shadow-sm'
                                    : 'bg-white text-[#5B3E31] border-pink-100 hover:bg-pink-50/50'
                                }`}
                              >
                                {iOption}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 3. Accent toppings selections */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-pink-700 font-bold">
                            ✨ Select House Accent Toppings:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {bobaToppingOptions.map((o) => (
                              <button
                                key={o.name}
                                type="button"
                                onClick={() => setSelectedTopping(o.name)}
                                className={`relative p-3 rounded-xl border transition-all text-left flex justify-between items-center cursor-pointer ${
                                  selectedTopping === o.name
                                    ? 'bg-[#CE3A74]/5 text-[#CE3A74] border-[#CE3A74] shadow-sm'
                                    : 'bg-white text-[#5B3E31] border-pink-100 hover:bg-pink-50/50'
                                }`}
                              >
                                <div className="text-[11px] font-semibold">{o.name}</div>
                                <div className="font-mono text-[10px] text-pink-700 font-bold">
                                  {o.price > 0 ? `+ ₹${o.price}` : 'Free'}
                                </div>
                                {selectedTopping === o.name && (
                                  <div className="absolute -top-1 -right-1 bg-[#CE3A74] text-white h-4 w-4 rounded-full flex items-center justify-center">
                                    <Check className="h-2.5 w-2.5" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* SOLID SOURDOUGH FOOD OPTIONS */
                      <div className="space-y-4">
                        {/* 1. Toasted crisp level */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-pink-700 font-bold">
                            🔥 Crisp Bake Charm / Toasted Level:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Soft Warm', 'Golden Crust', 'Double Crispy'].map((tOption) => (
                              <button
                                key={tOption}
                                type="button"
                                onClick={() => setToasted(tOption)}
                                className={`py-2 px-3 text-[11px] font-medium rounded-xl border transition-all cursor-pointer text-center ${
                                  toasted === tOption
                                    ? 'bg-[#CE3A74] text-white border-[#CE3A74] shadow-sm'
                                    : 'bg-white text-[#5B3E31] border-pink-100 hover:bg-pink-50/50'
                                }`}
                              >
                                {tOption}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Spread selections */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-pink-700 font-bold">
                            🍯 Select Luxury Spread Infusion:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {foodSpreadOptions.map((o) => (
                              <button
                                key={o.name}
                                type="button"
                                onClick={() => setSelectedSpread(o.name)}
                                className={`relative p-3 rounded-xl border transition-all text-left flex justify-between items-center cursor-pointer ${
                                  selectedSpread === o.name
                                    ? 'bg-[#CE3A74]/5 text-[#CE3A74] border-[#CE3A74] shadow-sm'
                                    : 'bg-white text-[#5B3E31] border-pink-100 hover:bg-pink-50/50'
                                }`}
                              >
                                <div className="text-[11px] font-semibold">{o.name}</div>
                                <div className="font-mono text-[10px] text-pink-700 font-bold">
                                  {o.price > 0 ? `+ ₹${o.price}` : 'Free'}
                                </div>
                                {selectedSpread === o.name && (
                                  <div className="absolute -top-1 -right-1 bg-[#CE3A74] text-white h-4 w-4 rounded-full flex items-center justify-center">
                                    <Check className="h-2.5 w-2.5" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 3. Accent Side additions */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono tracking-widest uppercase text-pink-700 font-bold">
                            🍓 Select Garnish Sides:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {foodSideOptions.map((o) => (
                              <button
                                key={o.name}
                                type="button"
                                onClick={() => setSelectedSide(o.name)}
                                className={`relative p-3 rounded-xl border transition-all text-left flex justify-between items-center cursor-pointer ${
                                  selectedSide === o.name
                                    ? 'bg-[#CE3A74]/5 text-[#CE3A74] border-[#CE3A74] shadow-sm'
                                    : 'bg-white text-[#5B3E31] border-pink-100 hover:bg-pink-50/50'
                                }`}
                              >
                                <div className="text-[11px] font-semibold">{o.name}</div>
                                <div className="font-mono text-[10px] text-pink-700 font-bold">
                                  {o.price > 0 ? `+ ₹${o.price}` : 'Free'}
                                </div>
                                {selectedSide === o.name && (
                                  <div className="absolute -top-1 -right-1 bg-[#CE3A74] text-white h-4 w-4 rounded-full flex items-center justify-center">
                                    <Check className="h-2.5 w-2.5" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Operational add controls & summaries */}
                  <div className="border-t border-pink-100 pt-5 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    
                    {/* Price & Quantity Controls */}
                    <div className="flex items-center gap-4">
                      {/* Quantity Toggles */}
                      <div className="flex items-center rounded-xl border border-pink-200 bg-[#FFF9FA] p-1 text-sm">
                        <button
                          type="button"
                          disabled={quantity <= 1}
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-pink-100/50 text-[#CE3A74] disabled:opacity-40 cursor-pointer font-bold transition-all"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center font-mono font-bold text-[#CE3A74]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(prev => prev + 1)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-pink-100/50 text-[#CE3A74] cursor-pointer font-bold transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Dyn Pricing total display */}
                      <div>
                        <span className="font-mono text-[9px] text-[#7A6054] tracking-widest uppercase font-bold block">
                          Calculated Total Price
                        </span>
                        <span className="font-serif text-2xl font-black text-[#5B3E31] leading-none">
                          ₹{(getCalculatedUnitPrice() * quantity).toFixed(0)}
                        </span>
                        <span className="font-mono text-[9px] text-[#A37B69] block">
                          (₹{getCalculatedUnitPrice()} x {quantity})
                        </span>
                      </div>
                    </div>

                    {/* Master Action Trigger */}
                    <button
                      type="button"
                      onClick={handleAddWithCustomization}
                      className="hover-float-button flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#CE3A74] text-white px-6 py-4 font-serif text-sm font-bold hover:bg-pink-700 transition-all cursor-pointer shadow-lg shadow-[#CE3A74]/15"
                      id="modal-add-to-basket-btn"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Basket Basket
                    </button>

                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

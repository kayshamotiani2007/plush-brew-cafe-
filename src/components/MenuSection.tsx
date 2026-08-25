/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { curatedMenuItems } from '../data/menu';
import { MenuItem, CartItem, CartItemCustomization } from '../types';
import { 
  ShoppingBag, 
  ArrowRight, 
  Trash2, 
  CheckCircle2, 
  GlassWater, 
  Coffee, 
  Sparkles, 
  Flame, 
  Eye, 
  X, 
  Check, 
  Plus, 
  Minus,
  Heart,
  Bean,
  CupSoda
} from 'lucide-react';
import { getCartItemUnitPrice } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { createOrder } from '../services/scrapbookService';

// Helper component to resolve specific drink item Lucide icons
export function ItemIcon({ item, className = "h-4 w-4 text-[#CE3A74]" }: { item: MenuItem; className?: string }) {
  const icon = item.iconName;
  switch (icon) {
    case 'Bean':
      return <Bean className={className} />;
    case 'CupSoda':
      return <CupSoda className={className} />;
    case 'GlassWater':
      return <GlassWater className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Coffee':
    default:
      if (item.category === 'boba') return <CupSoda className={className} />;
      if (item.category === 'special') return <GlassWater className={className} />;
      return <Coffee className={className} />;
  }
}

interface MenuSectionProps {
  addToCart: (item: MenuItem, customization?: CartItemCustomization) => void;
  cart: CartItem[];
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  currentSeason: 'Summer' | 'Winter';
  setCurrentSeason: (season: 'Summer' | 'Winter') => void;
  submitSimulatedOrder: (customerName: string, orderType: 'Online' | 'Walk-in') => void;
}

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

const SECTIONS = [
  { id: 'coffee', name: 'Coffee & Espresso Bar', emoji: '☕', category: 'coffee' },
  { id: 'boba', name: 'Plush Bubble Tea Collection', emoji: '🧋', category: 'boba' },
  { id: 'signature', name: 'Signature Plush Drinks', emoji: '🍓', category: 'signature' },
  { id: 'special', name: 'Refreshers & Coolers', emoji: '🍹', category: 'special' },
  { id: 'pancake', name: 'Pancakes & Waffles', emoji: '🥞', category: 'pancake' },
  { id: 'bakery', name: 'Bakery & Pastries', emoji: '🥐', category: 'bakery' },
  { id: 'sandwich', name: 'Sandwiches & Bagels', emoji: '🥪', category: 'sandwich' },
  { id: 'savory', name: 'Pasta & Savory Meals', emoji: '🍝', category: 'savory' },
  { id: 'pizza', name: 'Mini Café Pizzas', emoji: '🍕', category: 'pizza' },
  { id: 'dessert', name: 'Desserts', emoji: '🍰', category: 'dessert' }
];

export default function MenuSection({
  addToCart,
  cart,
  removeFromCart,
  updateQuantity,
  clearCart,
  currentSeason,
  setCurrentSeason,
  submitSimulatedOrder
}: MenuSectionProps) {
  // Tabs: all, or individual sections
  const [activeTab, setActiveTab] = useState<string>('all');
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<'Online' | 'Walk-in'>('Online');
  const [checkedOut, setCheckedOut] = useState(false);
  const [orderStatusMessage, setOrderStatusMessage] = useState('');

  // Customizer popup modal states
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCupboardHovered, setIsCupboardHovered] = useState(false);

  useEffect(() => {
    if (selectedItem || isCupboardHovered) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [selectedItem, isCupboardHovered]);
  const [sweetness, setSweetness] = useState('Regular Sweet');
  const [ice, setIce] = useState('Regular Ice');
  const [selectedTopping, setSelectedTopping] = useState('None');

  const [toasted, setToasted] = useState('Golden Crust');
  const [selectedSpread, setSelectedSpread] = useState('None');
  const [selectedSide, setSelectedSide] = useState('None');

  const [quantity, setQuantity] = useState(1);
  const [showModalSuccess, setShowModalSuccess] = useState(false);

  // Settle pricing formulas
  const subtotal = cart.reduce((acc, curr) => acc + (getCartItemUnitPrice(curr) * curr.quantity), 0);
  const gst = parseFloat((subtotal * 0.18).toFixed(2)); // Luxury cafe dining GST 18%
  const total = parseFloat((subtotal + gst).toFixed(2));

  // Filter out seasonal availability
  const isAvailableItem = (item: MenuItem) => {
    if (!item.season || item.season === 'All Season') return true;
    if (item.season === 'Summer Only' && currentSeason === 'Summer') return true;
    if (item.season === 'Winter Only' && currentSeason === 'Winter') return true;
    return false;
  };

  // Filtered list based on tab
  const filteredItems = curatedMenuItems.filter(item => {
    if (activeTab !== 'all' && item.category !== activeTab) return false;
    return true;
  });

  const handleOpenCustomize = (item: MenuItem) => {
    setSelectedItem(item);
    setSweetness('Regular Sweet');
    setIce('Regular Ice');
    setSelectedTopping('None');
    setToasted('Golden Crust');
    setSelectedSpread('None');
    setSelectedSide('None');
    setQuantity(1);
    setShowModalSuccess(false);
  };

  const isDrinkCategory = (category: string) => {
    return ['coffee', 'signature', 'boba', 'special'].includes(category);
  };

  const getCalculatedPrice = () => {
    if (!selectedItem) return 0;
    let base = selectedItem.price;
    if (isDrinkCategory(selectedItem.category)) {
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

    const customizationDetails: CartItemCustomization = {};
    if (isDrinkCategory(selectedItem.category)) {
      customizationDetails.sweetness = sweetness;
      const isHotOrSignature = selectedItem.category === 'signature' || selectedItem.season === 'Winter Only' || selectedItem.name.includes('Hot') || ['Espresso Shot', 'Double Espresso', 'Americano', 'Cappuccino', 'Café Latte', 'Vanilla Latte', 'Hazelnut Latte', 'Caramel Latte', 'Marshmallow Latte', 'Strawberry Latte', 'White Chocolate Mocha', 'Café Mocha'].includes(selectedItem.name);
      if (!isHotOrSignature) {
        customizationDetails.ice = ice;
      }
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

    // Call addToCart sequence
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedItem, customizationDetails);
    }

    setShowModalSuccess(true);
    setTimeout(() => {
      setShowModalSuccess(false);
      setSelectedItem(null);
    }, 1200);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Kindly key-in a Customer Name to submit order ticket.');
      return;
    }
    
    const orderData = {
      customerName,
      customerEmail: '',
      orderType,
      items: cart.map(ci => ({
        item: {
          id: ci.item.id,
          name: ci.item.name,
          price: ci.item.price
        },
        quantity: ci.quantity,
        unitPrice: getCartItemUnitPrice(ci),
        customization: ci.customization
      })),
      subtotal,
      gst,
      total
    };
    
    submitSimulatedOrder(customerName, orderType);
    
    try {
      const savedOrder = await createOrder(orderData);
      console.log('Order saved to database:', savedOrder);
    } catch (error) {
      console.error('Failed to save order to database:', error);
    }
    
    setCheckedOut(true);
    setOrderStatusMessage(`Your ${orderType} order ticket has been printed in the kitchen queue! Check System Terminals to manage.`);
    setCustomerName('');
    clearCart();
    setTimeout(() => {
      setCheckedOut(false);
      setOrderStatusMessage('');
    }, 5000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FFF8F9]" id="menu-root">
      
      {/* SECTION HEADER & SEASON SWITCHER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 border-b border-[#CE3A74]/15 pb-6 gap-4">
        <div>
          <span className="font-mono text-xs text-[#CE3A74] uppercase tracking-widest block mb-1 font-bold">
            Café Plush Brew, Jaipur - Interactive Signature Menu
          </span>
          <h3 className="font-serif text-3xl font-extrabold text-pink-800 tracking-tight">
            Plush Signature Menu
          </h3>
          <p className="font-sans text-sm text-[#7A6054] mt-1 max-w-xl">
            Sip premium coffees, bubble teas, slushes or crunch warm stacks, savory melts and croissants. Click any item's photo or card to customize sweetness, toppings, and spreads!
          </p>
        </div>

        {/* Season Controller */}
        <div className="flex items-center gap-2 p-1 bg-[#CE3A74]/5 rounded-xl self-start md:self-auto border border-[#CE3A74]/15">
          <button
            onClick={() => setCurrentSeason('Summer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              currentSeason === 'Summer'
                ? 'bg-[#CE3A74] text-white shadow-sm'
                : 'text-[#CE3A74] hover:bg-[#CE3A74]/5'
            }`}
          >
            ☀️ Jaipur Summer (Mangoes On)
          </button>
          <button
            onClick={() => setCurrentSeason('Winter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              currentSeason === 'Winter'
                ? 'bg-[#CE3A74] text-white shadow-sm'
                : 'text-[#CE3A74] hover:bg-[#CE3A74]/5'
            }`}
          >
            ❄️ Jaipur Winter (Strawberries On)
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS & MAIN GRID */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPONENT: PRODUCTS SELECTION */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Category Tabs (Horizontal scrolling list of the 8 signature tabs plus All) */}
          <div className="flex gap-2 overflow-x-auto pb-3 pt-2 sticky top-[65px] bg-[#FFF8F9] z-10 border-b border-[#CE3A74]/10 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-sans font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#CE3A74] text-white shadow-md'
                  : 'bg-[#CE3A74]/5 text-[#CE3A74] hover:bg-[#CE3A74]/10'
              }`}
            >
              All Signatures ✨
            </button>
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.category)}
                className={`px-4 py-2 rounded-full text-xs font-sans font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === sec.category
                    ? 'bg-[#CE3A74] text-white shadow-md'
                    : 'bg-[#CE3A74]/5 text-[#CE3A74] hover:bg-[#CE3A74]/10'
                }`}
              >
                <span>{sec.emoji}</span>
                <span>{sec.name}</span>
              </button>
            ))}
          </div>

          {/* DYNAMIC SECTIONS LOOP */}
          <div className="space-y-12 pl-1">
            {SECTIONS.filter(sec => activeTab === 'all' || activeTab === sec.category).map((sec, idx) => {
              const secItems = filteredItems.filter(item => item.category === sec.category);
              if (secItems.length === 0) return null;

              return (
                <div key={sec.id} className="space-y-6">
                  {/* Category Title Header */}
                  <div className="flex items-center gap-3 border-b border-pink-100 pb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CE3A74] text-white font-mono text-sm font-bold shadow">
                      {idx + 1}
                    </span>
                    <h4 className="font-serif text-xl font-black text-pink-900 tracking-tight flex items-center gap-1.5">
                      <span>{sec.emoji}</span>
                      <span>{sec.name}</span>
                    </h4>
                  </div>

                  {/* Grievous Product Cards Grid */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {secItems.map(item => {
                      const isAvailable = isAvailableItem(item);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (isAvailable) {
                              handleOpenCustomize(item);
                            }
                          }}
                          className={`hover-float group flex flex-col justify-between plush-card plush-shadow p-6 relative cursor-pointer active:scale-[0.99] duration-200 ${
                            !isAvailable ? 'opacity-45 select-none !cursor-not-allowed' : ''
                          }`}
                        >
                          {/* Seasonal Unavailability Layer */}
                          {!isAvailable && (
                            <div className="absolute inset-0 bg-[#FFF5F6]/90 flex flex-col items-center justify-center z-10 text-center px-4 rounded-[28px]">
                              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#CE3A74] bg-[#FFD5CD] px-3 py-1.5 rounded-[50px]">
                                {item.season} Unlock
                              </span>
                              <span className="font-mono text-[10px] text-[#5B3E31]/80 mt-2 font-bold">
                                (Required: {item.season === 'Summer Only' ? '☀️ Summer' : '❄️ Winter'})
                              </span>
                            </div>
                          )}

                          {/* Image + Info Column */}
                          <div className="flex gap-4">
                            {/* Photo */}
                            <div 
                              className="h-24 w-24 shrink-0 overflow-hidden rounded-[24px] bg-[#FAF4F2] relative shadow-[0_5px_15px_rgba(186,151,144,0.1)]"
                              title="Click to expand & customize!"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="h-4 w-4 text-white" />
                              </div>
                            </div>

                            {/* Item Specs */}
                            <div className="flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-serif text-[16px] font-bold text-[#5B3E31] group-hover:text-[#CE3A74] transition-colors flex items-center gap-1.5">
                                  <ItemIcon item={item} className="h-4.5 w-4.5 text-[#CE3A74] shrink-0" />
                                  <span>{item.name}</span>
                                </span>
                                {item.isBestseller && (
                                  <span className="bg-[#FFD5CD] text-[#7A6054] text-[8px] font-bold uppercase rounded-[50px] px-2 py-0.5 tracking-wider font-mono shadow-sm">
                                    Bestseller 🌟
                                  </span>
                                )}
                              </div>
                              <p className="font-sans text-[12px] text-[#7A6054]/85 leading-normal max-w-sm mt-1">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Price and Customize actions */}
                          <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#CE3A74]/10">
                            <span className="font-mono text-xs font-bold text-[#CE3A74]/80 tracking-wide uppercase">
                               <span className="font-extrabold text-sm text-[#CE3A74]">₹{item.price}</span>
                            </span>
                            <button
                              disabled={!isAvailable}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isAvailable) {
                                  handleOpenCustomize(item);
                                }
                              }}
                              className="plush-btn !py-2 !px-4 !text-xs !bg-[#FAF4F2] !text-[#CE3A74] group-hover:!bg-[#FFD5CD] group-hover:!text-[#5B3E31] hover-float-button disabled:opacity-50"
                              id={`add-btn-${item.id}`}
                            >
                              Customize & Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
 
        {/* RIGHT COMPONENT: ACTIVE CART PANORAMA */}
        <div 
          className="lg:col-span-4" 
          id="cart-workspace"
          onMouseEnter={() => setIsCupboardHovered(true)}
          onMouseLeave={() => setIsCupboardHovered(false)}
        >
          <div className="plush-card sticky top-24 space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#CE3A74]/15 pb-4">
              <h4 className="font-serif text-lg font-bold text-[#5B3E31] flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#CE3A74]" /> 
                Active Cupboard
              </h4>
              <span className="bg-[#CE3A74] text-white font-mono text-[10px] uppercase font-bold py-1 px-3 rounded-[50px]">
                {cart.length} unique
              </span>
            </div>

            {/* Notification Center */}
            {orderStatusMessage && (
              <div className="p-4 bg-[#FAF4F2] border-[#CE3A74]/20 border text-[#5B3E31] font-bold rounded-[28px] text-xs flex items-start gap-2 animate-pulse font-sans">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#CE3A74]" />
                <p>{orderStatusMessage}</p>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="h-12 w-12 mx-auto rounded-full bg-[#FAF4F2] flex items-center justify-center text-[#CE3A74]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <p className="font-serif text-sm font-bold text-[#5B3E31]">Your cup is empty</p>
                <p className="font-sans text-xs text-[#7A6054]/70 max-w-[200px] mx-auto">
                  Click 'Customize & Add' on the delicious signatures to load up.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Cart list items */}
                <div className="max-h-60 overflow-y-auto overscroll-contain space-y-3.5 pr-1">
                  {cart.map(cartItem => (
                    <div key={cartItem.id} className="flex flex-col gap-2 text-xs border-b border-pink-50 pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-serif font-bold text-pink-900 truncate flex items-center gap-1.5">
                            <ItemIcon item={cartItem.item} className="h-3.5 w-3.5 text-[#CE3A74] shrink-0" />
                            <span>{cartItem.item.name}</span>
                          </p>
                          <p className="font-mono text-[10px] text-[#CE3A74]">₹{getCartItemUnitPrice(cartItem)} each</p>
                          
                          {/* Rich customization parameters display inside MenuSection basket view */}
                          {cartItem.customization && (
                            <div className="flex flex-wrap gap-1 mt-1 font-sans">
                              {cartItem.customization.sweetness && (
                                <span className="bg-pink-50 text-[#CE3A74] border border-pink-100/50 px-1 py-0.2 rounded text-[8px] font-mono leading-none">
                                  🍬 Sugar: {cartItem.customization.sweetness}
                                </span>
                              )}
                              {cartItem.customization.ice && (
                                <span className="bg-sky-50/70 text-sky-700 border border-sky-100/40 px-1 py-0.2 rounded text-[8px] font-mono leading-none">
                                  ❄️ Ice: {cartItem.customization.ice}
                                </span>
                              )}
                              {cartItem.customization.topping && (
                                <span className="bg-pink-100/60 text-[#CE3A74] border border-[#CE3A74]/15 px-1 py-0.2 rounded text-[8px] font-sans leading-none">
                                  ✨ {cartItem.customization.topping}
                                </span>
                              )}
                              {cartItem.customization.toasted && (
                                <span className="bg-amber-50 text-amber-800 border border-amber-100 px-1 py-0.2 rounded text-[8px] font-mono leading-none">
                                  🔥 {cartItem.customization.toasted}
                                </span>
                              )}
                              {cartItem.customization.spread && (
                                <span className="bg-amber-100/40 text-amber-950 border border-amber-200/50 px-1 py-0.2 rounded text-[8px] font-sans leading-none">
                                  🍯 {cartItem.customization.spread}
                                </span>
                              )}
                              {cartItem.customization.side && (
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-1 py-0.2 rounded text-[8px] font-sans leading-none">
                                  🍓 {cartItem.customization.side}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-lg border border-[#CE3A74]/15 bg-white">
                            <button
                              onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                              className="px-2 py-0.5 text-pink-700 font-bold hover:bg-[#CE3A74]/5 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-1.5 font-mono text-xs">{cartItem.quantity}</span>
                            <button
                              onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                              className="px-2 py-0.5 text-pink-700 font-bold hover:bg-[#CE3A74]/5 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(cartItem.id)}
                            className="text-red-500 hover:text-red-700 focus:outline-none cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & GST panel */}
                <div className="rounded-[24px] bg-[#FAF4F2] p-5 space-y-3 font-sans text-xs text-[#7A6054]">
                  <div className="flex justify-between">
                    <span>Menu Price Subtotal:</span>
                    <span className="font-mono font-bold text-[#5B3E31]">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Luxury Cess / Central GST (18.00%):</span>
                    <span className="font-mono font-bold text-[#5B3E31]">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-serif text-base font-black text-[#CE3A74] pt-3 border-t border-[#CE3A74]/10">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Form */}
                <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#CE3A74] mb-2 font-bold px-2">
                      Customer Guest Name:
                    </label>
                    <input
                      required
                      type="text"
                      id="guest-name-input"
                      className="plush-input !py-2.5 !px-4 !text-sm"
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#CE3A74] mb-2 font-bold px-2">
                      Fulfillment Channel:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderType('Online')}
                        className={`plush-btn !py-2 !text-xs !bg-[#FAF4F2] !text-[#5B3E31] ${
                          orderType === 'Online'
                            ? '!bg-[#CE3A74] !text-white'
                            : 'hover:!bg-[#FFD5CD]'
                        }`}
                      >
                        📱 Online Order
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('Walk-in')}
                        className={`plush-btn !py-2 !text-xs !bg-[#FAF4F2] !text-[#5B3E31] ${
                          orderType === 'Walk-in'
                            ? '!bg-[#CE3A74] !text-white'
                            : 'hover:!bg-[#FFD5CD]'
                        }`}
                      >
                        ☕ Walk-in Lounge
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="plush-btn w-full mt-4 group hover-float-button justify-center"
                    id="submit-order-ticket-btn"
                  >
                    Print Kitchen Order
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* DETAILED INTERACTIVE CUSTOMIZER SELECTION POPUP MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain" id="menu-customizer-modal-portal">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Body container */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-[#FFFDFB] rounded-[2.5rem] border border-pink-100 max-w-4xl w-full shadow-2xl overflow-hidden grid md:grid-cols-12 gap-0"
              >
                {/* Success Banner notification */}
                {showModalSuccess && (
                  <div className="absolute inset-x-0 top-0 z-55 bg-emerald-500 text-white px-6 py-4 flex items-center justify-center gap-2 shadow font-serif text-sm font-bold text-center">
                    <Check className="h-5 w-5 animate-bounce" /> Added {quantity} x {selectedItem.name} Custom Pack to Basket! 🌸
                  </div>
                )}

                {/* Left side: Large visual (popped-up photo representation) */}
                <div className="md:col-span-5 bg-[#FAF1F3] relative min-h-[250px] md:min-h-[480px]">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name} 
                    className="w-full h-full object-cover absolute inset-0 animate-fade-in"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  {/* Item Description below expanded photo */}
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left space-y-2">
                    <span className="inline-flex items-center rounded-full bg-pink-600 px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
                      Signature Selection
                    </span>
                    <h4 className="font-serif text-2xl font-black leading-tight drop-shadow-md flex items-center gap-2">
                      <ItemIcon item={selectedItem} className="h-6 w-6 text-pink-300 shrink-0" />
                      <span>{selectedItem.name}</span>
                    </h4>
                    <p className="font-sans text-xs text-white/90 leading-relaxed font-medium">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Close trigger upper-right */}
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 left-4 bg-white/85 hover:bg-white text-[#CE3A74] h-9 w-9 rounded-full flex items-center justify-center shadow transition-colors cursor-pointer"
                    id="close-customize-modal-btn"
                  >
                    <X className="h-4 w-4 font-bold" />
                  </button>
                </div>

                {/* Right side: Detailed Options */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left max-h-[90vh] overflow-y-auto overscroll-contain">
                  
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

                    {/* DRINK CUSTOMIZERS: (coffee, signature, boba, special) */}
                    {isDrinkCategory(selectedItem.category) ? (
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
                        {!(selectedItem && (selectedItem.category === 'signature' || selectedItem.season === 'Winter Only' || selectedItem.name.includes('Hot') || ['Espresso Shot', 'Double Espresso', 'Americano', 'Cappuccino', 'Café Latte', 'Vanilla Latte', 'Hazelnut Latte', 'Caramel Latte', 'Marshmallow Latte', 'Strawberry Latte', 'White Chocolate Mocha', 'Café Mocha'].includes(selectedItem.name))) && (
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
                        )}

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
                      /* FOOD CUSTOMIZERS: (pancake, bakery, savory, dessert, bagel) */
                      <div className="space-y-4">
                        {/* 1. Toasted level */}
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

                  {/* Operation pricing & quantity sliders */}
                  <div className="border-t border-pink-100 pt-5 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    
                    {/* Calculated dynamic cost */}
                    <div className="flex items-center gap-4">
                      {/* Quantity select */}
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

                      {/* Cumulative pricing ticker */}
                      <div className="text-left">
                        <span className="font-mono text-[9px] text-[#7A6054] tracking-widest uppercase font-bold block">
                          Calculated Total Price:
                        </span>
                        <span className="font-serif text-2xl font-black text-[#5B3E31] leading-none">
                          ₹{(getCalculatedPrice() * quantity).toFixed(0)}
                        </span>
                        <span className="font-mono text-[9px] text-[#A37B69] block">
                          (₹{getCalculatedPrice()} x {quantity})
                        </span>
                      </div>
                    </div>

                    {/* Master Action Add to Cup */}
                    <button
                      type="button"
                      onClick={handleAddWithCustomization}
                      className="plush-btn hover-float-button flex-grow justify-center py-4"
                      id="modal-add-to-basket-btn"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Active Cupboard
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

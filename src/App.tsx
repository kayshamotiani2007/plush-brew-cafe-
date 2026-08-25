/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Lobby from './components/Lobby';
import MenuSection from './components/MenuSection';
import BookingsSection from './components/BookingsSection';
import LoyaltyCard from './components/LoyaltyCard';
import ReviewsSection from './components/ReviewsSection';
import AdminPanel from './components/AdminPanel';
import StoryPage from './components/StoryPage';
import LocationPage from './components/LocationPage';
import AdminWallNotes from './components/AdminWallNotes';
import Footer from './components/Footer';
import AuthGate from './components/AuthGate';
import WelcomePage from './components/WelcomePage';
import SmoothScroll from './components/SmoothScroll';
import AnimatedPlushieBackground from './components/AnimatedPlushieBackground';
import Bot from './components/Bot';
import { useAuth } from './context/AuthContext.jsx';
import { MediaProvider } from './context/MediaContext';

import { MenuItem, Booking, Review, CartItem, Order, LoyaltyTrack, TrafficForecastHour, CartItemCustomization, WallNote, ScrapbookItem } from './types';
import { hourlyTrafficForecast } from './data/mockData';
import { ShoppingBag, Trash2, ArrowRight, X, Award, Sparkles, CheckCircle, Receipt, Printer, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchAdminData, fetchAdminScrapbookItems, deleteAdminScrapbookItem, moderateContent, updateOrderStatus } from './services/scrapbookService';

export function getCartItemUnitPrice(ci: CartItem): number {
  let p = ci.item.price;
  if (ci.customization) {
    if (ci.customization.toppingPrice) p += ci.customization.toppingPrice;
    if (ci.customization.spreadPrice) p += ci.customization.spreadPrice;
    if (ci.customization.sidePrice) p += ci.customization.sidePrice;
  }
  return p;
}

export default function App() {
  // Global referrer policy override for YouTube iframe compatibility
  useEffect(() => {
    let meta = document.querySelector('meta[name="referrer"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'referrer');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'strict-origin-when-cross-origin');
  }, []);

const { user: currentUser, loading: authLoading, isAuthenticated, logout } = useAuth();
   
   // Navigation View Coordinator
   const [currentView, setCurrentView] = useState<'lobby' | 'menu' | 'booking' | 'loyalty' | 'reviews' | 'admin' | 'story' | 'location'>('lobby');
  
  // Landing State
  const [showLanding, setShowLanding] = useState(true);

  // Seasonal Modifier
  const [currentSeason, setCurrentSeason] = useState<'Summer' | 'Winter'>('Summer');

  // Admin Authorization State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminDataReady, setAdminDataReady] = useState(false);

  // Multi-State Databases
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyTracks, setLoyaltyTracks] = useState<LoyaltyTrack[]>(() => {
    try {
      const saved = localStorage.getItem('plush_brew_loyalty_v2');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [wallNotes, setWallNotes] = useState<WallNote[]>([
    { id: 'n1', name: 'Riya', message: 'Good coffee, good mood!', type: 'Gratitude', createdAt: new Date().toISOString() },
    { id: 'n2', name: 'Mehak', message: 'Chasing dreams & sipping coffee', type: 'Dreams', createdAt: new Date().toISOString() }
  ]);

  const [scrapbookItems, setScrapbookItems] = useState<ScrapbookItem[]>([]);

  const hasAdminRole = currentUser?.role === 'admin' || currentUser?.role?.includes('admin');
  const isAdminEmail = currentUser?.email?.toLowerCase() === 'owner@plushbrew.com' ||
    currentUser?.email?.toLowerCase() === 'kayshamotiani2007@gmail.com';

  // Sync authorization status based on safe admin role/email checks
  useEffect(() => {
    if (hasAdminRole || isAdminEmail) {
      setIsAuthorized(true);
    } else if (currentUser) {
      setIsAuthorized(false);
    }
  }, [currentUser, hasAdminRole, isAdminEmail]);

   // Fetch admin content database logs
   useEffect(() => {
    if (!isAuthorized) {
      setAdminDataReady(false);
      return;
    }

    let isActive = true;
    setAdminDataReady(false);

    fetchAdminData().then(data => {
      if (!isActive) return;

      if (data && data.reservations) {
        setBookings(data.reservations.map((r: any) => ({
          id: r.id,
          name: r.customer_name || r.name,
          email: r.customer_email || r.email,
          phone: r.phone || '',
          date: r.reservation_date || r.date,
          time: r.reservation_time || r.time,
          guests: r.guests || 2,
          notes: r.special_requests || r.notes || '',
          status: r.status || 'Pending',
          createdAt: r.created_at || new Date().toISOString()
        })));
      }
      if (data && data.orders) {
        setOrders(data.orders.map((o: any) => ({
          id: o.id,
          items: Array.isArray(o.items) 
            ? o.items.map((item: any) => ({
                id: item.id || item.item_id || `${item.name}_${item.quantity}`,
                item: {
                  id: item.id || item.item_id || 'unknown',
                  name: item.name || item.item_name || 'Unknown Item',
                  price: Number(item.unitPrice || item.price || 0),
                  description: '',
                  category: 'bakery',
                  image: ''
                },
                quantity: Number(item.quantity || 1),
                customization: item.customization || {}
              }))
            : [],
          subtotal: Number(o.subtotal || 0),
          gst: Number(o.gst || 0),
          total: Number(o.total || 0),
          type: o.order_type === 'Online' ? 'Online' : 'Walk-in',
          status: ['Received', 'In Progress', 'Served'].includes(o.status) ? o.status : 'Received',
          customerName: o.customer_name || o.customerName || 'Guest',
          createdAt: o.created_at || o.createdAt || new Date().toISOString()
        })));
      }
      if (data && data.cloudMessages) {
        const wallFromDb = data.cloudMessages.map((m: any) => ({
          id: m.id.toString(),
          name: m.author_name,
          message: m.message,
          type: m.message_type,
          createdAt: m.created_at
        }));
        setWallNotes(prev => [...wallFromDb, ...prev]);
      }

      const unifiedScrapbook: ScrapbookItem[] = [];

      if (data && Array.isArray(data.cloudMessages)) {
        data.cloudMessages.forEach((m: any) => {
          let cardType: ScrapbookItem['cardType'] = 'note';
          if (m.message_type === 'Dreams' || m.message_type === 'Gratitude') cardType = 'dream';
          else if (m.message_type === 'Wish' || m.message_type === 'Message') cardType = 'letter';
          unifiedScrapbook.push({
            id: `cm-${m.id}`,
            title: m.message,
            description: `${m.message_type} • ${m.author_name}`,
            imageUrl: '',
            createdAt: m.created_at,
            type: 'cloud_message',
            cardType,
            metadata: { author_name: m.author_name, author_email: m.author_email, message_type: m.message_type, message: m.message }
          });
        });
      }

      if (data && Array.isArray(data.photos)) {
        data.photos.forEach((p: any) => {
          unifiedScrapbook.push({
            id: `photo-${p.id}`,
            title: p.caption || `Polaroid by ${p.uploader_name}`,
            description: `Polaroid Photo • ${p.uploader_name}`,
            imageUrl: p.image_url || '',
            createdAt: p.created_at,
            type: 'photo',
            cardType: 'photo',
            metadata: { uploader_name: p.uploader_name, caption: p.caption, status: p.status }
          });
        });
      }

      if (data && Array.isArray(data.scrapbookEntries)) {
        data.scrapbookEntries.forEach((se: any) => {
          const hasSong = se.song_id && se.song_name;
          const hasImage = se.image_url;
          unifiedScrapbook.push({
            id: `entry-${se.id}`,
            title: se.memory || se.caption || 'Shared Memory',
            description: hasSong ? `🎵 ${se.song_name}${se.artist ? ` — ${se.artist}` : ''}` : (se.author_name || 'Guest'),
            imageUrl: hasImage ? se.image_url : (hasSong ? se.thumbnail || '' : ''),
            createdAt: se.created_at,
            type: 'scrapbook_entry',
            cardType: hasImage ? 'photo' : (hasSong ? 'song' : 'note'),
            metadata: {
              author_name: se.author_name,
              author_email: se.author_email,
              memory: se.memory,
              caption: se.caption,
              song_id: se.song_id,
              song_name: se.song_name,
              artist: se.artist,
              youtube_link: se.youtube_link,
              spotify_link: se.spotify_link,
              thumbnail: se.thumbnail,
              status: se.status
            }
          });
        });
      }

      if (data && Array.isArray(data.scrapbookItems)) {
        data.scrapbookItems.forEach((si: any) => {
          unifiedScrapbook.push({
            id: `item-${si.id}`,
            title: si.title,
            description: si.description || 'Gallery item',
            imageUrl: si.image_url || '',
            createdAt: si.created_at,
            type: 'admin_item',
            cardType: 'gallery',
            metadata: { source: 'admin_gallery' }
          });
        });
      }

      if (data && Array.isArray(data.songs)) {
        const linkedSongIds = new Set(
          (data.scrapbookEntries || [])
            .filter((se: any) => se.song_id)
            .map((se: any) => String(se.song_id))
        );
        data.songs.forEach((s: any) => {
          if (!linkedSongIds.has(String(s.id))) {
            unifiedScrapbook.push({
              id: `song-${s.id}`,
              title: s.song_name || 'Comfort Song',
              description: s.artist ? `— ${s.artist}` : 'Shared melody',
              imageUrl: s.thumbnail || '',
              createdAt: s.created_at,
              type: 'song',
              cardType: 'song',
              metadata: {
                song_id: s.id,
                song_name: s.song_name,
                artist: s.artist,
                youtube_link: s.youtube_link,
                spotify_link: s.spotify_link,
                author_name: s.shared_by_name,
                author_email: s.shared_by_email
              }
            });
          }
        });
      }

      unifiedScrapbook.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setScrapbookItems(unifiedScrapbook);
      setAdminDataReady(true);
    }).catch(err => {
      if (!isActive) return;
      console.error('Failed to fetch admin data:', err);
      setAdminDataReady(true);
    });

    return () => {
      isActive = false;
    };
  }, [isAuthorized, currentUser?.email]);

  // Restrict view tracking navigation immediately if authorized
  useEffect(() => {
    if (isAuthorized) {
      if (showLanding) {
        setShowLanding(false);
      }
      if (currentView !== 'admin') {
        setCurrentView('admin');
      }
    }
  }, [isAuthorized, showLanding, currentView]);

  // Redirect unauthorized users away from admin view to prevent blank render tree
  useEffect(() => {
    if (currentView === 'admin' && !isAuthorized && !authLoading) {
      setCurrentView('lobby');
    }
  }, [currentView, isAuthorized, authLoading]);

  const updateTracksAndPersist = (updater: (prev: LoyaltyTrack[]) => LoyaltyTrack[]) => {
    setLoyaltyTracks((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('plush_brew_loyalty_v2', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Custom interactive stamp notification popup overlay when order subtotal exceeds ₹299
  const [stampNotification, setStampNotification] = useState<{
    show: boolean;
    customerName: string;
    subtotal: number;
    stampsCount: number;
    hasDailyLimit: boolean;
    isGuest: boolean;
    total: number;
  } | null>(null);

  // Interactive Tax Invoice / Bill popup overlay
  const [invoiceNotification, setInvoiceNotification] = useState<Order | null>(null);

  useEffect(() => {
    if (isCartOpen || (stampNotification && stampNotification.show) || invoiceNotification) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, stampNotification, invoiceNotification]);
  
  const addWallNote = (note: Omit<WallNote, 'id' | 'createdAt'>) => {
    const newNote: WallNote = {
      ...note,
      id: `N-${Math.floor(Math.random() * 900) + 100}`,
      createdAt: new Date().toISOString()
    };
    setWallNotes(prev => [newNote, ...prev]);
  };
  
  const deleteWallNote = (id: string) => {
    setWallNotes(prev => prev.filter(n => n.id !== id));
  };

  const deleteScrapbookItem = async (id: string) => {
    if (id.startsWith('cm-')) {
      const actualId = id.replace('cm-', '');
      await moderateContent('cloud_message', actualId, 'hidden');
    } else if (id.startsWith('photo-')) {
      const actualId = id.replace('photo-', '');
      await moderateContent('photo', actualId, 'hidden');
    } else if (id.startsWith('entry-')) {
      const actualId = id.replace('entry-', '');
      await moderateContent('scrapbook_entry', actualId, 'deleted');
    } else if (id.startsWith('item-')) {
      const actualId = id.replace('item-', '');
      await deleteAdminScrapbookItem(actualId);
    }
    setScrapbookItems(prev => prev.filter(s => s.id !== id));
  };

  // CART DRIVER OPERATIONS
  const addToCart = (item: MenuItem, customization?: CartItemCustomization) => {
    const custKey = customization 
      ? Math.abs(JSON.stringify(customization).split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)).toString(36) 
      : 'default';
    const uniqueId = `${item.id}_${custKey}`;

    setCart((prevCart) => {
      const exists = prevCart.find((ci) => ci.id === uniqueId);
      if (exists) {
        return prevCart.map((ci) =>
          ci.id === uniqueId ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevCart, { id: uniqueId, item, quantity: 1, customization }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((ci) => ci.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((ci) => (ci.id === cartItemId ? { ...ci, quantity: qty } : ci))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // SIMULATED BOOKING DISPATCH
  const addBooking = (rawBooking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const freshBooking: Booking = {
      ...rawBooking,
      id: `B-${Math.floor(Math.random() * 900) + 100}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setBookings((prevBookings) => [freshBooking, ...prevBookings]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  // SIMULATED REVIEWS DISPATCH
  const addReview = (rawReview: Omit<Review, 'id' | 'createdAt'>) => {
    const freshReview: Review = {
      ...rawReview,
      id: `R-${Math.floor(Math.random() * 900) + 100}`,
      createdAt: new Date().toISOString()
    };
    setReviews((prevReviews) => [freshReview, ...prevReviews]);
  };

  const deleteReview = (id: string) => {
    setReviews((prevReviews) => prevReviews.filter((r) => r.id !== id));
  };

  // KITCHEN ORDER SYSTEM SYNERGY
  const submitSimulatedOrder = (customerName: string, orderType: 'Online' | 'Walk-in') => {
    const subtotal = cart.reduce((acc, curr) => acc + getCartItemUnitPrice(curr) * curr.quantity, 0);
    const gst = parseFloat((subtotal * 0.18).toFixed(2));
    const total = parseFloat((subtotal + gst).toFixed(2));

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 800) + 200}`,
      items: [...cart],
      subtotal,
      gst,
      total,
      type: orderType,
      status: 'Received',
      customerName,
      createdAt: new Date().toISOString()
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);

    // AUTO-AWARD LOYALTY STAMP SEQUENCE
    let emailLookup = currentUser?.email?.toLowerCase();
    
    if (!emailLookup && customerName) {
      const matchTrack = loyaltyTracks.find(
        (t) => t.name.toLowerCase() === customerName.toLowerCase() || t.phone === customerName
      );
      if (matchTrack) {
        emailLookup = matchTrack.email.toLowerCase();
      }
    }

    if (subtotal > 299) {
      if (emailLookup) {
        const todayString = new Date().toLocaleDateString('en-CA');
        const account = loyaltyTracks.find((t) => t.email.toLowerCase() === emailLookup);
        
        if (account) {
          if (account.lastStampDate === todayString) {
            setStampNotification({
              show: true,
              customerName: account.name || customerName,
              subtotal,
              stampsCount: account.stampsCount,
              hasDailyLimit: true,
              isGuest: false,
              total
            });
          } else {
            const freshStamps = Math.min(account.stampsCount + 1, 10);
            updateTracksAndPersist((prevTracks) => {
              return prevTracks.map((track) => {
                if (track.email.toLowerCase() === emailLookup) {
                  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                  const newHistory = [`Earned Order Stamp (> ₹299 Order #${newOrder.id}) (${dateStr})`, ...track.history];
                  return {
                    ...track,
                    stampsCount: freshStamps,
                    lastStampDate: todayString,
                    history: newHistory
                  };
                }
                return track;
              });
            });
            setStampNotification({
              show: true,
              customerName: account.name || customerName,
              subtotal,
              stampsCount: freshStamps,
              hasDailyLimit: false,
              isGuest: false,
              total
            });
          }
        } else {
          setStampNotification({
            show: true,
            customerName,
            subtotal,
            stampsCount: 1,
            hasDailyLimit: false,
            isGuest: true,
            total
          });
        }
      } else {
        setStampNotification({
          show: true,
          customerName,
          subtotal,
          stampsCount: 1,
          hasDailyLimit: false,
          isGuest: true,
          total
        });
      }
    }

    setInvoiceNotification(newOrder);
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  // LOYALTY CARD ENGAGEMENT STAMPS
  const lookupLoyalty = (email: string) => {
    return loyaltyTracks.find((track) => track.email.toLowerCase() === email.toLowerCase());
  };

  const earnStampSimulated = (email: string, phone: string) => {
    const todayString = new Date().toLocaleDateString('en-CA');
    updateTracksAndPersist((prevTracks) => {
      return prevTracks.map((track) => {
        if (track.email.toLowerCase() === email.toLowerCase()) {
          const freshStamps = Math.min(track.stampsCount + 1, 10);
          const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          const newHistory = [`Simulated Sip (+1 Stamp) (${dateStr})`, ...track.history];
          return {
            ...track,
            stampsCount: freshStamps,
            lastStampDate: todayString,
            history: newHistory
          };
        }
        return track;
      });
    });
  };

  const claimRewardSimulated = (email: string, freeItem: MenuItem) => {
    updateTracksAndPersist((prevTracks) => {
      return prevTracks.map((track) => {
        if (track.email.toLowerCase() === email.toLowerCase()) {
          const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          const newHistory = [`Claimed 10-Stamp reward! Free: ${freeItem.name} (${dateStr})`, ...track.history];
          return {
            ...track,
            stampsCount: 0,
            history: newHistory
          };
        }
        return track;
      });
    });

    const freeOrder: Order = {
      id: `REWARD-${Math.floor(Math.random() * 800) + 200}`,
      items: [
        {
          id: `free_${freeItem.id}_${Math.floor(Math.random() * 1000)}`,
          item: freeItem,
          quantity: 1,
          customization: {
            sweetness: 'Normal',
            ice: 'Normal'
          }
        }
      ],
      subtotal: 0,
      gst: 0,
      total: 0,
      type: 'Walk-in',
      status: 'Received',
      customerName: `Reward: ${email}`,
      createdAt: new Date().toISOString()
    };
    setOrders((prevOrders) => [freeOrder, ...prevOrders]);
    alert(`🎁 Fabulous Choice! Your free ${freeItem.name} (Value: ₹${freeItem.price}) has been added to our kitchen queue (₹0)!`);
  };

  const addLoyaltyAccount = (
    email: string,
    phone: string,
    isBirthday?: boolean,
    birthdayDate?: string,
    idProofName?: string,
    idProofUrl?: string
  ) => {
    const exists = lookupLoyalty(email);
    if (exists) {
      alert('This email address is already logged in our stamping registers.');
      return;
    }
    const welcomeDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    let startingStamps = 2;
    const historyEntries = [`Passport initiated (+2 Welcome Stamps) (${welcomeDate})`];

    if (isBirthday && birthdayDate) {
      startingStamps += 1;
      const proofStr = idProofName ? `Proven via: ${idProofName}` : 'ID document attached';
      historyEntries.unshift(`🎁 Free Birthday Registration Stamp Added! (${proofStr}) (${welcomeDate})`);
    }

    const newTrack: LoyaltyTrack = {
      email,
      phone,
      stampsCount: startingStamps,
      birthday: birthdayDate,
      birthdayBonusApplied: isBirthday,
      idProofName: idProofName,
      idProofUrl: idProofUrl,
      history: historyEntries
    };

    updateTracksAndPersist((prevTracks) => [newTrack, ...prevTracks]);
  };

  const handleAuthSuccess = (email: string, name: string, makeAdmin: boolean) => {
    if (makeAdmin) {
      setIsAuthorized(true);
      setCurrentView('admin');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthorized(false);
    setCurrentView('lobby');
  };

  return (
    <SmoothScroll>
      <AnimatedPlushieBackground />
      <div className="flex min-h-screen flex-col bg-[#FDFBF7] text-[#3A2D27] relative z-10" id="plush-brew-container">
        {authLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-[#CE3A74] font-serif font-black">
            Opening your Plush Brew passport...
          </div>
        ) : showLanding ? (
          <div className="flex flex-col min-h-screen">
            <div className="flex-1">
              <WelcomePage onEnter={() => setShowLanding(false)} />
            </div>
            <Footer 
              setCurrentView={(view) => {
                setShowLanding(false);
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              isAuthorized={isAuthorized}
            />
          </div>
        ) : !isAuthenticated ? (
          <AuthGate onSuccess={handleAuthSuccess} />
        ) : (
          <>
            {/* PERSISTENT HEADER */}
            <Header
              currentView={currentView}
              setCurrentView={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              cartCount={cartCount}
              openCart={() => setIsCartOpen(true)}
              isAuthorized={isAuthorized}
              currentUser={currentUser}
              onLogout={handleLogout}
            />

            <MediaProvider>
              <main className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentView}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex-1 flex flex-col"
                  >
                    {currentView === 'lobby' && (
                      <Lobby 
                        setCurrentView={(view) => {
                          setCurrentView(view);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        addToCart={addToCart}
                        wallNotes={wallNotes}
                        addWallNote={addWallNote}
                      />
                    )}
                    
                    {currentView === 'menu' && (
                      <MenuSection
                        cart={cart}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                        updateQuantity={updateQuantity}
                        clearCart={clearCart}
                        currentSeason={currentSeason}
                        setCurrentSeason={setCurrentSeason}
                        submitSimulatedOrder={submitSimulatedOrder}
                      />
                    )}

                    {currentView === 'booking' && (
                      <BookingsSection
                        bookings={bookings}
                        addBooking={addBooking}
                      />
                    )}

                    {currentView === 'loyalty' && (
                      <LoyaltyCard
                        loyaltyTracks={loyaltyTracks}
                        lookupLoyalty={lookupLoyalty}
                        earnStampSimulated={earnStampSimulated}
                        claimRewardSimulated={claimRewardSimulated}
                        addLoyaltyAccount={addLoyaltyAccount}
                        currentUser={currentUser}
                      />
                    )}

{currentView === 'reviews' && (
                       <ReviewsSection
                         reviews={reviews}
                         addReview={addReview}
                       />
                     )}

                     {currentView === 'story' && <StoryPage />}
                     {currentView === 'location' && <LocationPage />}

                      {currentView === 'admin' && (
                        <AdminPanel
                          bookings={bookings}
                          reviews={reviews}
                          orders={orders}
                          loyaltyTracks={loyaltyTracks}
                          trafficForecast={hourlyTrafficForecast}
                          isAuthorized={isAuthorized}
                          adminDataReady={adminDataReady}
                          setIsAuthorized={setIsAuthorized}
                          updateBookingStatus={updateBookingStatus}
                          updateOrderStatus={updateOrderStatus}
                          deleteReview={deleteReview}
                          earnStampSimulated={earnStampSimulated}
                          currentUser={currentUser}
                          scrapbookItems={scrapbookItems}
                          deleteScrapbookItem={deleteScrapbookItem}
                        />
                      )}
                  </motion.div>
                </AnimatePresence>
              </main>
            </MediaProvider>

            {/* FLOATING QUICK BASKET SIDE DRAWER */}
            {isCartOpen && (
              <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end" id="cart-drawer-overlay">
                <div className="w-full max-w-md bg-white text-[#3A2D27] p-6 shadow-2xl flex flex-col justify-between h-full border-l border-[#3A2D27]/10 animate-slide-in font-sans">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#3A2D27]/10 pb-4 mb-4">
                      <h4 className="font-serif text-lg font-bold text-[#3A2D27] flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" /> Active Order Bag
                      </h4>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="rounded-full p-1.5 text-[#3A2D27]/60 hover:bg-[#3A2D27]/5 hover:text-[#3A2D27]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {cart.length === 0 ? (
                      <div className="py-20 text-center space-y-2">
                        <div className="h-10 w-10 mx-auto rounded-full bg-[#3A2D27]/5 flex items-center justify-center text-[#7A6054]/50">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <p className="font-serif text-sm font-bold text-[#3A2D27]">Your cup is empty</p>
                        <p className="text-xs text-[#7A6054]/70">Explore our signature menu to fill up your cart!</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                        {cart.map((cartItem) => (
                          <div key={cartItem.id} className="flex flex-col gap-2 pb-3 border-b border-[#3A2D27]/5 text-xs">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0 pr-2">
                                <p className="font-serif font-bold text-[#3A2D27] truncate">{cartItem.item.name}</p>
                                <p className="font-mono text-[10px] text-[#7A6054]">₹{getCartItemUnitPrice(cartItem)} each</p>
                                
                                {cartItem.customization && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {cartItem.customization.sweetness && (
                                      <span className="bg-pink-50 text-pink-700 border border-pink-100/40 px-1 py-0.2 rounded text-[8px] font-mono leading-none">
                                        🍬 Sugar: {cartItem.customization.sweetness}
                                      </span>
                                    )}
                                    {cartItem.customization.ice && (
                                      <span className="bg-sky-50 text-sky-700 border border-sky-100/40 px-1 py-0.2 rounded text-[8px] font-mono leading-none">
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
                                      <span className="bg-amber-100/40 text-amber-900/80 border border-amber-200/50 px-1 py-0.2 rounded text-[8px] font-sans leading-none">
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

                              <div className="flex items-center gap-2 shrink-0">
                                <div className="flex items-center rounded border border-[#3A2D27]/10 bg-white text-[11px]">
                                  <button
                                    onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                                    className="px-1.5 py-0.5 cursor-pointer font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="px-1 font-mono">{cartItem.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                                    className="px-1.5 py-0.5 cursor-pointer font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(cartItem.id)}
                                  className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-[#3A2D27]/10 pt-4 space-y-3">
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-[#7A6054]">
                          <span>Items price:</span>
                          <span className="font-mono">₹{cart.reduce((s, c) => s + getCartItemUnitPrice(c) * c.quantity, 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-serif text-sm font-bold text-[#3A2D27] pt-2">
                          <span>Aggregate Total (Excl. GST):</span>
                          <span className="font-mono">₹{cart.reduce((s, c) => s + getCartItemUnitPrice(c) * c.quantity, 0).toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          setCurrentView('menu');
                          setTimeout(() => {
                            const inputEl = document.getElementById('guest-name-input');
                            if (inputEl) {
                              inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              inputEl.focus();
                            } else {
                              const el = document.getElementById('cart-workspace');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 350);
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#3A2D27] px-4 py-2.5 font-serif text-sm font-bold text-[#FFFDF9] shadow hover:bg-[#3A2D27]/90 transition-all cursor-pointer"
                      >
                        Proceed to GST Invoice checkout <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DYNAMIC PERSISTENT FOOTER */}
            <Footer 
              setCurrentView={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              isAuthorized={isAuthorized}
            />
            
            {/* DYNAMIC TAX INVOICE RECEIPT MODAL */}
            <AnimatePresence>
              {invoiceNotification && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#2C191C]/85 backdrop-blur-md overflow-y-auto" id="order-invoice-modalOverlay">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 40 }}
                    transition={{ type: 'spring', duration: 0.6, bounce: 0.2 }}
                    className="relative w-full max-w-lg bg-[#FCF8F6] border border-pink-200 rounded-3xl shadow-2xl p-6 md:p-8 text-left text-pink-950 overflow-hidden"
                    id="order-invoice-card"
                  >
                    <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-pink-400 via-[#CE3A74] to-pink-500" />
                    
                    <button 
                      onClick={() => setInvoiceNotification(null)}
                      className="absolute top-4 right-4 text-pink-900/60 hover:text-pink-900 cursor-pointer p-1 rounded-full hover:bg-pink-100/50 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="text-center pb-4 border-b-2 border-dashed border-[#5B3E31]/15">
                      <div className="mx-auto w-12 h-12 bg-[#CE3A74]/10 rounded-full flex items-center justify-center mb-2">
                        <Receipt className="h-6 w-6 text-[#CE3A74]" />
                      </div>
                      <h4 className="font-serif text-xl font-black uppercase tracking-wider text-pink-950">
                        PLUSH BREW SANCTUARY
                      </h4>
                      <p className="text-xs text-pink-900/70 font-mono mt-0.5">EST. 2026 • JAIPUR, INDIA</p>
                    </div>

                    <div className="py-4 space-y-1.5 text-xs font-mono border-b border-[#5B3E31]/10">
                      <div className="flex justify-between">
                        <span className="text-pink-900/60">INVOICE NO:</span>
                        <span className="font-bold text-pink-950">{invoiceNotification.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-pink-900/60">DATE & TIME:</span>
                        <span>{new Date(invoiceNotification.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-pink-900/60">CUSTOMER:</span>
                        <span className="font-sans font-bold">{invoiceNotification.customerName || 'Valued Guest'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-pink-900/60">ORDER TYPE:</span>
                        <span className="bg-pink-100 px-1.5 py-0.2 rounded text-[10px] uppercase font-sans font-semibold text-[#CE3A74]">
                          {invoiceNotification.type}
                        </span>
                      </div>
                    </div>

                    {/* Invoice Item Breakdown */}
                    <div className="py-4 border-b-2 border-dashed border-[#5B3E31]/15 max-h-[25vh] overflow-y-auto space-y-3">
                      {invoiceNotification.items.map((ci) => (
                        <div key={ci.id} className="flex justify-between items-start text-xs">
                          <div className="flex-1 pr-4">
                            <p className="font-serif font-bold text-pink-950">
                              {ci.item.name}
                            </p>
                            <p className="font-mono text-pink-700">₹{getCartItemUnitPrice(ci)} × {ci.quantity}</p>
                          </div>
                          <span className="font-mono font-bold text-pink-950">₹{(getCartItemUnitPrice(ci) * ci.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="pt-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-pink-900/60">SUBTOTAL:</span>
                        <span className="font-mono">₹{invoiceNotification.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-pink-900/60">GST (18%):</span>
                        <span className="font-mono">₹{invoiceNotification.gst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t border-[#5B3E31]/20 pt-2">
                        <span className="text-pink-950">TOTAL:</span>
                        <span className="font-mono text-[#CE3A74]">₹{invoiceNotification.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setInvoiceNotification(null)}
                        className="flex-1 plush-btn !py-2 !text-xs"
                      >
                        Close Receipt
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* STAMP NOTIFICATION MODAL */}
            <AnimatePresence>
              {stampNotification?.show && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#2C191C]/85 backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                  >
                    <button
                      onClick={() => setStampNotification(null)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="text-center">
                      <Award className="h-10 w-10 mx-auto text-[#CE3A74] mb-3" />
                      <h4 className="font-serif text-lg font-bold text-pink-950 mb-2">
                        Stamps Earned! 🎫
                      </h4>
                      <p className="text-sm text-[#7A6054] mb-3">
                        {stampNotification.customerName} earned {stampNotification.stampsCount} stamp{stampNotification.stampsCount > 1 ? 's' : ''}!
                      </p>
                      {stampNotification.hasDailyLimit && (
                        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                          Daily stamp limit reached. Come back tomorrow!
                        </p>
                      )}
                      <div className="mt-4">
                        <button
                          onClick={() => setStampNotification(null)}
                          className="plush-btn !py-2 !text-xs"
                        >
                          Awesome!
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
</AnimatePresence>
            {isAuthenticated && <Bot />}
          </>
        )}
      </div>
    </SmoothScroll>
  );
}
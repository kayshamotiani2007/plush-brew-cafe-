/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'coffee' | 'signature' | 'boba' | 'pancake' | 'bakery' | 'savory' | 'dessert' | 'special' | 'bagel' | string;
  isBestseller?: boolean;
  image: string;
  season?: 'Summer Only' | 'Winter Only' | 'All Season';
  iconName?: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItemCustomization {
  sweetness?: string;
  ice?: string;
  topping?: string;
  toppingPrice?: number;
  toasted?: string;
  spread?: string;
  spreadPrice?: number;
  side?: string;
  sidePrice?: number;
}

export interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  customization?: CartItemCustomization;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  gst: number;
  total: number;
  type: 'Online' | 'Walk-in';
  status: 'Received' | 'In Progress' | 'Served';
  customerName: string;
  createdAt: string;
}

export interface WallNote {
  id: string;
  name: string;
  message: string;
  type: 'Message' | 'Quote' | 'Dreams' | 'Gratitude';
  createdAt: string;
}

export interface DreamCloud {
  id: string;
  goal: string;
}

export interface FutureLetter {
  id: string;
  message: string;
}

export interface Polaroid {
  id: string;
  caption: string;
  image: string;
}

export interface ComfortSong {
  id: string;
  title: string;
  artist: string;
  note: string;
  mediaUrl?: string;
}

export interface LoyaltyTrack {
  email: string;
  phone: string;
  stampsCount: number; // 0 to 10 stamps
  history: string[];
  lastStampDate?: string; // Format: YYYY-MM-DD
  birthday?: string; // Format: YYYY-MM-DD
  birthdayBonusApplied?: boolean;
  idProofName?: string;
  idProofUrl?: string;
}

export interface TrafficForecastHour {
  hour: string;
  rushLevel: 'Quiet' | 'Steady' | 'Rushing' | 'Peak';
  intensity: number; // 0 to 100 for graph plotting
}

export interface ScrapbookItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  type?: 'cloud_message' | 'photo' | 'scrapbook_entry' | 'song' | 'admin_item' | 'polaroid' | 'letter' | 'dream';
  cardType?: 'note' | 'photo' | 'song' | 'letter' | 'dream' | 'gallery';
  metadata?: Record<string, any>;
}
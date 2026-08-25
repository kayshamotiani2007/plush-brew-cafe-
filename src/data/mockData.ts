/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Booking, Review, Order, LoyaltyTrack, TrafficForecastHour } from '../types.ts';
import { curatedMenuItems } from './menu';

export const initialBookings: Booking[] = [
  {
    id: 'B-001',
    name: 'Aishwarya Sen',
    email: 'aishwarya@gmail.com',
    phone: '+91 98290 12345',
    date: '2026-06-16',
    time: '18:30',
    guests: 4,
    notes: 'Window seat if available, celebrating high-school graduation!',
    status: 'Confirmed',
    createdAt: '2026-06-15T10:00:00Z'
  },
  {
    id: 'B-002',
    name: 'Kabir Malhotra',
    email: 'kabir.m@outlook.com',
    phone: '+91 80033 98765',
    date: '2026-06-16',
    time: '15:00',
    guests: 2,
    notes: 'Gluten-free menu inquiry.',
    status: 'Pending',
    createdAt: '2026-06-15T11:15:00Z'
  },
  {
    id: 'B-003',
    name: 'Riddhi Kothari',
    email: 'riddhi@yahoo.com',
    phone: '+91 94140 55443',
    date: '2026-06-17',
    time: '20:00',
    guests: 6,
    notes: 'No ice in boba drinks requested.',
    status: 'Confirmed',
    createdAt: '2026-06-14T21:45:00Z'
  },
  {
    id: 'B-004',
    name: 'Ananya Sharma',
    email: 'ananya@sharma.in',
    phone: '+91 93140 77112',
    date: '2026-06-15',
    time: '19:30',
    guests: 3,
    notes: 'Require electric socket near table for digital work.',
    status: 'Completed',
    createdAt: '2026-06-15T08:30:00Z'
  }
];

export const initialReviews: Review[] = [
  {
    id: 'R-001',
    name: 'Prishi Mehta',
    rating: 5,
    comment: 'The Thai Milk Tea is exceptionally rich, and those brown sugar boba pearls are simmered to chewy perfection! Absolute masterpiece.',
    createdAt: '2026-06-14T14:32:00Z'
  },
  {
    id: 'R-002',
    name: 'Devansh Jaipuria',
    rating: 5,
    comment: 'Plush Brew is exactly what Vaishali Nagar needed. The Open-Faced Bagel with Beetroot Hummus & Avocado was outstandingly fresh and perfectly seasoned!',
    createdAt: '2026-06-13T18:10:00Z'
  },
  {
    id: 'R-003',
    name: 'Simran Baid',
    rating: 4,
    comment: 'Awesome cozy vibes! The Taro Milk tea is so creamy. Long lines during weekend evenings but the service is extremely professional.',
    createdAt: '2026-06-12T16:45:00Z'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-101',
    items: [
      { id: 'boba-thai_init', item: curatedMenuItems[0], quantity: 2 }, // Thai Milk Tea - 330 * 2 = 660
      { id: 'bagel-beetroot_init', item: curatedMenuItems[6], quantity: 1 }  // Beetroot Hummus Bagel - 340
    ],
    subtotal: 1000,
    gst: 180, // 18% GST (or let's specify custom GST like 5% for food, 18% for service/etc). Let's use 18% GST for luxurious dining
    total: 1180,
    type: 'Walk-in',
    status: 'In Progress',
    customerName: 'Rohit Khandelwal',
    createdAt: '2026-06-15T12:10:00Z'
  },
  {
    id: 'ORD-102',
    items: [
      { id: 'boba-taro_init', item: curatedMenuItems[1], quantity: 1 }, // Taro Milk Tea - 350
      { id: 'bagel-mango_init', item: curatedMenuItems[8], quantity: 2 }  // Nutella with Mangoes - 330 * 2 = 660
    ],
    subtotal: 1010,
    gst: 181.8,
    total: 1191.8,
    type: 'Online',
    status: 'Received',
    customerName: 'Shreya Bordia',
    createdAt: '2026-06-15T13:05:00Z'
  },
  {
    id: 'ORD-103',
    items: [
      { id: 'boba-matcha_init', item: curatedMenuItems[2], quantity: 1 }, // Matcha - 330
      { id: 'bagel-cucumber_init', item: curatedMenuItems[7], quantity: 1 }  // Cucumber Bagel - 280
    ],
    subtotal: 610,
    gst: 109.8,
    total: 719.8,
    type: 'Walk-in',
    status: 'Served',
    customerName: 'Vikram Aditya',
    createdAt: '2026-06-15T11:40:00Z'
  }
];

export const initialLoyaltyTracks: LoyaltyTrack[] = [
  {
    email: 'kayshamotiani2007@gmail.com',
    phone: '+91 91192 33445',
    stampsCount: 5,
    history: ['Thai Milk Tea (15 Jun)', 'Taro Milk Tea (14 Jun)', 'Beetroot Bagel (13 Jun)', 'Matcha Milk Tea (11 Jun)', 'Thai Milk Tea (10 Jun)']
  },
  {
    email: 'owner@plushbrew.com',
    phone: '+91 99999 88888',
    stampsCount: 8,
    history: ['Matcha Tea (14 Jun)', 'Nutella Bagel (12 Jun)', 'Taro Tea (10 Jun)', 'Thai Tea (09 Jun)', 'Taro Tea (07 Jun)', 'Matcha Tea (05 Jun)', 'Thai Tea (04 Jun)', 'Cucumber Bagel (02 Jun)']
  },
  {
    email: 'neha.j@gmail.com',
    phone: '+91 98282 55667',
    stampsCount: 2,
    history: ['Caramel Macchiato (12 Jun)', 'Cucumber Bagel (10 Jun)']
  }
];

export const hourlyTrafficForecast: TrafficForecastHour[] = [
  { hour: '10:00 AM', rushLevel: 'Quiet', intensity: 20 },
  { hour: '11:00 AM', rushLevel: 'Steady', intensity: 45 },
  { hour: '12:00 PM', rushLevel: 'Peak', intensity: 85 },
  { hour: '01:00 PM', rushLevel: 'Peak', intensity: 90 },
  { hour: '02:00 PM', rushLevel: 'Steady', intensity: 50 },
  { hour: '03:00 PM', rushLevel: 'Steady', intensity: 40 },
  { hour: '04:00 PM', rushLevel: 'Quiet', intensity: 30 },
  { hour: '05:00 PM', rushLevel: 'Rushing', intensity: 75 },
  { hour: '06:00 PM', rushLevel: 'Peak', intensity: 95 },
  { hour: '07:00 PM', rushLevel: 'Peak', intensity: 100 },
  { hour: '08:00 PM', rushLevel: 'Peak', intensity: 85 },
  { hour: '09:00 PM', rushLevel: 'Rushing', intensity: 60 },
  { hour: '10:00 PM', rushLevel: 'Quiet', intensity: 25 },
];

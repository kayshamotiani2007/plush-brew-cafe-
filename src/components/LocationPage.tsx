/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin } from 'lucide-react';

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-[#FFFDFB] py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4 text-center">
            <h1 className="font-serif text-4xl font-black text-[#5B3E31]">Find Us</h1>
            <p className="text-lg text-[#7A6054]">Located at the heart of Jaipur. Come visit and say hello!</p>
        </header>

        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-pink-100 p-3 rounded-full">
                    <MapPin className="h-8 w-8 text-pink-700" />
                </div>
                <div>
                   <h3 className="font-serif text-xl font-bold text-[#5B3E31]">Plush Brew Headquarters</h3>
                   <p className="text-sm text-[#7A6054]">S7 and S8 VS Tower, Plot No S6, Tonk Rd near Gopalpura Bypass Road, Mahaveer Nagar, Gopalpura Mode, Jaipur, Rajasthan, 302017</p>
                </div>
            </div>
            
{/* Map Placeholder */}
            <div className="h-96 w-full rounded-2xl overflow-hidden border border-pink-100 shadow-inner">
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.565547218334!2d75.7873679!3d26.8759931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4b5a7a7b7b7b%3A0x7b7b7b7b7b7b7b7b!2sPlush%20Brew%20VS%20Tower!5e0!3m2!1sen!2sin!4v1718969325!5m2!1sen!2sin"
                    title="Plush Brew Location Map"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <h4 className="font-bold text-[#5B3E31] mb-1">Opening Hours</h4>
                    <p className="text-xs text-[#7A6054]">Daily: 11:00 AM - 10:00 PM</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-[#5B3E31] mb-1">Contact</h4>
                    <p className="text-xs text-[#7A6054]">hello@plushbrew.com | +91 99999 99999</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

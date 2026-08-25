/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Coffee, Heart, Users, MapPin, Sparkles } from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[#FFFDFB] py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="space-y-6 text-center">
            <h1 className="font-serif text-5xl font-black text-[#5B3E31]">Our Plush Story</h1>
            <p className="text-lg text-[#7A6054] max-w-2xl mx-auto">From a small kitchen experiment to a sanctuary of comfort and taste in the heart of Jaipur.</p>
        </header>
        
        <div className="prose prose-pink max-w-none text-[#5B3E31]/90 leading-relaxed font-sans space-y-8">
            <p className="text-xl font-medium">It started with a simple craving for the perfect bubble tea—one that didn't just taste sugary but embodied comfort, quality, and an aesthetic that matched the soothing pace of a good day.</p>
            
            <p>Plush Brew was born out of a desire to create a "Third Place" in Jaipur—a space between home and work, where the bustle of the city fades into the background of a comfortable, plush environment. Our founders, driven by a mutual love for artisanal teas and slow-baked pastries, set out to change how Jaipur experiences "cafe culture."</p>

            <div className="grid md:grid-cols-2 gap-8 py-8">
                <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100">
                    <Coffee className="h-8 w-8 text-pink-700 mb-4" />
                    <h3 className="font-serif text-xl font-bold text-[#5B3E31] mb-2">Culinary Engineering</h3>
                    <p className="text-sm">We believe in meticulous craftsmanship. Our journey took us from local markets seeking the finest tea leaves to professional kitchens perfecting our 48-hour sourdough yeast fermentation. Every ingredient is tested for the perfect balance of flavor and feel.</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                    <Heart className="h-8 w-8 text-amber-700 mb-4" />
                    <h3 className="font-serif text-xl font-bold text-[#5B3E31] mb-2">The Plush Promise</h3>
                    <p className="text-sm">Our commitment is simple: Comfort, Aesthetic, Good Vibrations. Every visitor who walks into our studio is invited to slow down, disconnect from digital noise, and reconnect with their own golden hour.</p>
                </div>
            </div>

            <p>Our cafe is not just a place to grab a coffee; it is a community hub. We host workshops, book readings, and casual meet-ups, all in the spirit of fostering a close-knit community that appreciates the finer things in life. Our staff is trained not just in customer service, but in hospitality, ensuring that every guest feels like an old friend returning home.</p>

            <div className="border-l-4 border-[#CE3A74] bg-white p-6 italic font-serif text-[#5B3E31] text-lg shadow-sm rounded-r-xl">
                "We don't sell snacks; we design brief minutes of peaceful isolation."
            </div>
            
            <p>We are constantly evolving, listening to your feedback, and bringing new flavors to our menu. Whether you choose our rich, velvety purple lavender Taro Boba, or the crisp session of summer mango brioche bagels, you are partaking in our dream. Thank you for being a part of our story.</p>
        </div>
      </div>
    </div>
  );
}

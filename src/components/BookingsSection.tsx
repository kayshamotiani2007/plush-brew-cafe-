/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Booking } from '../types';
import { Calendar, User, Phone, Mail, Clock, MessageSquare, CheckCircle, Sparkles } from 'lucide-react';
import { createReservation } from '../services/scrapbookService';

interface BookingsSectionProps {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
}

export default function BookingsSection({ bookings, addBooking }: BookingsSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time) {
      alert('Please fill out all mandatory reservation fields.');
      return;
    }
    
    const optimisticBooking = {
      name,
      email,
      phone,
      date,
      time,
      guests,
      notes
    };
    addBooking(optimisticBooking);
    
    try {
      await createReservation({
        name,
        email,
        phone,
        date,
        time,
        guests,
        notes
      });
      console.log('Reservation saved successfully');
    } catch (error) {
      console.error('Failed to save reservation:', error);
    }
    
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setDate('');
    setTime('');
    setGuests(2);
    setNotes('');
    setTimeout(() => {
      setIsSubmitted(false);
    }, 6000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FFF8F9]" id="bookings-root">
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT METADATA CARD */}
        <div className="lg:col-span-5 space-y-6">
          <span className="font-mono text-xs text-[#CE3A74] uppercase tracking-widest block mb-1 font-bold">
            Plush Brew Lounge, Amrapali Circle
          </span>
          <h3 className="font-serif text-5xl md:text-6xl font-extrabold text-[#5B3E31] tracking-tight mb-4">
            Reserve a Table
          </h3>
          <p className="font-sans text-sm text-[#7A6054] leading-relaxed">
            Plush Brew’s lobby seats are highly coveted. Pre-book your lounge time slot to assure immediate entry to our plush velvet couches. Perfect for client rendezvous, reading escapes, or dynamic social group meets.
          </p>

          <div className="space-y-4 rounded-3xl border border-[#CE3A74]/15 p-5 bg-pink-50/50">
            <h4 className="font-serif font-bold text-sm text-pink-850">Jaipur Booking Matrix</h4>
            <ul className="space-y-2.5 font-sans text-xs text-[#7A6054]/90 list-disc list-inside">
              <li>Lounge Hours: <span className="font-mono font-bold text-pink-700">10:00 AM – 11:00 PM</span> daily</li>
              <li>Peak Hours: <span className="font-mono font-bold text-pink-700">12:00 PM – 2:00 PM</span> &amp; <span className="font-mono font-bold text-pink-700">6:00 PM – 8:00 PM</span></li>
              <li>Standard slots allocated for <span className="font-mono font-bold text-pink-705">90 minutes</span>. For extensions, note in requirements.</li>
              <li>All tables include individual low-noise charging sockets &amp; complimentary high-speed fiber wi-fi.</li>
            </ul>
          </div>

          <div className="hover-float rounded-3xl border border-pink-100 p-5 bg-white flex gap-4 items-center shadow-sm">
            <div className="h-10 w-10 shrink-0 bg-pink-100/60 rounded-full flex items-center justify-center text-[#CE3A74]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-xs font-bold text-pink-900">Free Stamping for Table Guests</p>
              <p className="font-sans text-[11px] text-[#7A6054]/80">Register your booking email on our loyalty panel to get 2 complimentary quick stamps!</p>
            </div>
          </div>
        </div>

        {/* RIGHT SUBMISSION FORM OR RECEIPT */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-pink-100 bg-white p-6 sm:p-8 shadow-sm">
            
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4 animate-fade-in">
                <div className="h-14 w-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#3A2D27]">Reservation Printed!</h4>
                <p className="font-sans text-sm text-[#7A6054] max-w-md mx-auto leading-relaxed">
                  Excellent! Your table reservation is saved under our system terminal ledgers. An associate will confirm table layout shortly. Show your digital booking ticket on arrival.
                </p>
                <div className="bg-[#CE3A74]/5 border border-[#CE3A74]/15 rounded-2xl p-4 max-w-sm mx-auto font-mono text-xs text-left space-y-1">
                  <p className="font-sans font-bold text-center text-pink-850 pb-1.5 mb-1.5 border-b border-[#CE3A74]/10 uppercase tracking-widest text-[10px]">digital gate pass</p>
                  <p><span className="text-[#CE3A74]">Pass Holder:</span> Name filed in system</p>
                  <p><span className="text-[#CE3A74]">Location:</span> Vaishali Nagar Jaipur</p>
                  <p><span className="text-[#CE3A74]">Support:</span> concierge@plushbrew.com</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs" id="booking-reservation-form">
                <h4 className="font-serif text-lg font-bold text-pink-800 mb-4">Lounge Allocation Form</h4>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-pink-800 font-bold">
                      Full Name *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#CE3A74]">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        required
                        type="text"
                        placeholder="Prateek Jain"
                        className="w-full bg-white rounded-xl border border-[#CE3A74]/20 pl-9 pr-3 py-2.5 text-xs focus:ring-1 focus:ring-[#CE3A74] focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Operational Telephone */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-pink-800 font-bold">
                      Operational Phone *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#CE3A74]">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        required
                        type="tel"
                        placeholder="+91 98290 XXXXX"
                        className="w-full bg-white rounded-xl border border-[#CE3A74]/20 pl-9 pr-3 py-2.5 text-xs focus:ring-1 focus:ring-[#CE3A74] focus:outline-none"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Digital Mailbox Address */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-pink-800 font-bold">
                      Digital Email *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#CE3A74]">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        required
                        type="email"
                        placeholder="prateek@outlook.com"
                        className="w-full bg-white rounded-xl border border-[#CE3A74]/20 pl-9 pr-3 py-2.5 text-xs focus:ring-1 focus:ring-[#CE3A74] focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Attendance Count */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-pink-800 font-bold">
                      Co-Guests (including self)
                    </label>
                    <select
                      className="w-full bg-white rounded-xl border border-[#CE3A74]/20 px-3 py-2.5 text-xs focus:ring-1 focus:ring-[#CE3A74] focus:outline-none"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                    >
                      <option value={1}>1 Guest (Solitary Study)</option>
                      <option value={2}>2 Guests (Cosy Rendezvous)</option>
                      <option value={3}>3 Guests (Creative Duo + 1)</option>
                      <option value={4}>4 Guests (Standard Lounge)</option>
                      <option value={6}>6 Guests (Royal Sofa Suite)</option>
                      <option value={8}>8 Guests (Executive Hub)</option>
                      <option value={10}>10+ Guests (Micro Conference)</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Reservation Target Date */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-pink-800 font-bold">
                      Target Date *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#CE3A74]">
                        <Calendar className="h-4 w-4" />
                      </span>
                      <input
                        required
                        type="date"
                        className="w-full bg-white rounded-xl border border-[#CE3A74]/20 pl-9 pr-3 py-2.5 text-xs focus:ring-1 focus:ring-[#CE3A74] focus:outline-none"
                        min="2026-06-15"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Seat allocation timing */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-pink-800 font-bold">
                      Arrival Hour *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#CE3A74]">
                        <Clock className="h-4 w-4" />
                      </span>
                      <select
                        required
                        className="w-full bg-white rounded-xl border border-[#CE3A74]/20 pl-9 pr-3 py-2.5 text-xs focus:ring-1 focus:ring-[#CE3A74] focus:outline-none"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      >
                        <option value="">Choose arrival...</option>
                        <option value="10:00">10:00 AM (Serene Open)</option>
                        <option value="11:30">11:30 AM (Baking Turn)</option>
                        <option value="13:00">01:00 PM (Lunch session)</option>
                        <option value="15:00">03:00 PM (Slow hour)</option>
                        <option value="17:00">05:00 PM (Jaipur golden sun)</option>
                        <option value="18:30">06:30 PM (Rush hour start)</option>
                        <option value="20:00">08:00 PM (Vibrant dinner)</option>
                        <option value="21:30">09:30 PM (Late-night sweet custom)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Specific Food / Sitting instructions */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-pink-800 font-bold">
                    Special Hospitality Preferences (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-[#CE3A74]">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <textarea
                      placeholder="e.g. Need gluten-free bagels, eggless pudding boba, window seat or handicap accessibility..."
                      className="w-full bg-white rounded-xl border border-[#CE3A74]/20 pl-9 pr-3 py-2.5 text-xs min-h-[85px] focus:ring-1 focus:ring-[#CE3A74] focus:outline-none"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="hover-float-button w-full mt-4 inline-flex items-center justify-center rounded-2xl bg-[#CE3A74] px-4 py-3 font-serif text-sm font-bold text-white shadow hover:bg-pink-700 active:scale-95 transition-all cursor-pointer"
                  id="book-lounge-submit-btn"
                >
                  Print Digital Table Pass
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

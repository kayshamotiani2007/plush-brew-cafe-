/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Review } from '../types';
import { Star, MessageSquareCode, Quote, PenLine, Sparkles } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

export default function ReviewsSection({ reviews, addReview }: ReviewsSectionProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('Fill in both Name and Review comment field to submit.');
      return;
    }
    addReview({
      name,
      rating,
      comment
    });
    setAddedSuccessfully(true);
    setName('');
    setRating(5);
    setComment('');
    setTimeout(() => {
      setAddedSuccessfully(false);
    }, 4500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FFF8F9]" id="reviews-root">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
        <span className="font-mono text-xs text-[#CE3A74] uppercase tracking-widest block font-bold">
          Client Testimonials & Opinions
        </span>
        <h3 className="font-serif text-3xl font-extrabold text-pink-800 tracking-tight">
          Voices of the Lounge
        </h3>
        <p className="font-sans text-sm text-[#7A6054]/90 leading-relaxed">
          Read raw feedback submitted by Jaipur’s fine dining community. We log every review instantly to our kitchen team ledgers for review under system administrative auditing.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE WRITE COMPONENT */}
        <div className="lg:col-span-5 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 bg-pink-50 rounded-full flex items-center justify-center text-[#CE3A74]">
              <PenLine className="h-4 w-4" />
            </div>
            <h4 className="font-serif text-lg font-bold text-pink-900">Draft Review Log</h4>
          </div>

          {addedSuccessfully && (
            <div className="mb-4 p-3.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-2xl flex items-center gap-2 animate-pulse">
              <Sparkles className="h-4 w-4 text-green-600 shrink-0" />
              <span>Review captured successfully! Live update printed on Admin Panel.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            {/* Guest Name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-pink-800 font-bold">
                Your Nickname / Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Ishita Rawat"
                className="w-full bg-white rounded-xl border border-pink-200 px-3 py-2 text-xs focus:ring-1 focus:ring-[#CE3A74] focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Micro Rating Indicator */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-pink-800 font-bold">
                Sipping Rating Score *
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <button
                    key={starIdx}
                    type="button"
                    onClick={() => setRating(starIdx)}
                    onMouseEnter={() => setHoveredStar(starIdx)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className="p-1 focus:outline-none transition-transform active:scale-125 cursor-pointer"
                    aria-label={`Rate ${starIdx} stars`}
                  >
                    <Star
                      className={`h-6 w-6 stroke-1.5 transition-all ${
                        starIdx <= (hoveredStar ?? rating)
                          ? 'fill-pink-400 text-pink-500'
                          : 'text-pink-200 fill-transparent'
                      }`}
                    />
                  </button>
                ))}
                <span className="font-mono text-xs font-bold text-pink-700 ml-2">
                  ({rating} / 5 Stars)
                </span>
              </div>
            </div>

            {/* Critique Comment */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-pink-800 font-bold">
                Critique Commentary *
              </label>
              <textarea
                required
                placeholder="Write transparently about your boba consistency, bagel toppings, seating, or lounge environment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white rounded-xl border border-pink-205 px-3 py-2.5 text-xs min-h-[95px] focus:ring-1 focus:ring-[#CE3A74] focus:outline-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="hover-float-button w-full mt-2 inline-flex items-center justify-center rounded-2xl bg-[#CE3A74] px-4 py-3 font-serif text-sm font-bold text-white shadow hover:bg-pink-700 active:scale-95 transition-all cursor-pointer"
              id="submit-review-log-btn"
            >
              Sign & Pin Review Block
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: READ TESTIMONIES MASONRY GRID */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <h4 className="font-serif text-lg font-bold text-pink-900 flex items-center gap-2">
              <MessageSquareCode className="h-4 w-4 text-[#CE3A74]" /> Guest Testimonials ({reviews.length})
            </h4>
            <span className="font-mono text-[10px] text-[#CE3A74] uppercase bg-pink-100/50 px-2.5 py-1 rounded-full font-bold">Latest Live Feed</span>
          </div>

          <div className="grid gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="hover-float rounded-3xl border border-pink-100 bg-white p-5 relative overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all"
              >
                {/* Quote Icon watermark */}
                <div className="absolute right-4 top-4 text-pink-100/20">
                  <Quote className="h-10 w-10 transform scale-x-[-1]" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= rev.rating
                            ? 'text-pink-400 fill-pink-300'
                            : 'text-pink-105'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="font-sans text-xs text-[#7A6054] leading-relaxed relative z-10 italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-pink-50 pt-3.5 mt-3.5">
                  <span className="font-serif text-xs font-bold text-pink-850">
                    — {rev.name}
                  </span>
                  <span className="font-mono text-[9px] text-[#7A6054]/60">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

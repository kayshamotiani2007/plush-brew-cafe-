/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext.jsx';
// @ts-expect-error - image asset loaded by Vite
import plushBrewLogo from '../assets/images/plush_brew_logo.png';

interface AuthGateProps {
  onSuccess: (email: string, name: string, makeAdmin: boolean) => void;
}

export default function AuthGate({ onSuccess }: AuthGateProps) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const getApiErrorMessage = (error: any) => {
    return error?.response?.data?.message || 'The passport desk is taking a tiny tea break. Please try again.';
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const makeAdmin = cleanEmail === 'kayshamotiani2007@gmail.com';

    if (isLogin) {
      try {
        const user = await login({ email: cleanEmail, password });
        setSuccessMessage('Access verified! Opening our cozy world...');
        onSuccess(user.email, user.name, makeAdmin);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      setIsSubmitting(false);
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('A phone number is required to link stamps.');
      setIsSubmitting(false);
      return;
    }

    try {
      const user = await register({ name: name.trim(), email: cleanEmail, password });
      setSuccessMessage('Passport created successfully! Logging you in...');
      onSuccess(user.email, user.name, makeAdmin);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex overflow-hidden" id="auth-gate-root">
      <div className="hidden lg:flex w-1/2 bg-[#5B3E31] p-12 flex-col justify-between text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541167760496-162115e61e05?q=80&w=2670&auto=format&fit=crop')] bg-cover opacity-20" />

        <div className="relative z-10">
          <h2 className="font-serif text-5xl font-black mb-4">Plush Brew</h2>
          <p className="font-sans text-lg text-pink-100/80 max-w-sm">
            Your historic Jaipur sanctuary, where time slows down and every moment is brewed to perfection.
          </p>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center py-6">
          <motion.div
            animate={{
              y: [-6, 6, -6],
              rotate: [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            whileHover={{
              scale: 1.05,
              filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.45))',
              cursor: 'grab',
            }}
            className="relative select-none"
          >
            <img
              src={plushBrewLogo}
              alt="Plush Brew Coffee & Matcha Sticker"
              referrerPolicy="no-referrer"
              className="w-[28rem] xl:w-[36rem] h-auto object-contain filter drop-shadow-[0_12px_20px_rgba(20,10,5,0.35)]"
            />
          </motion.div>
        </div>

        <div className="relative z-10 font-mono text-xs uppercase tracking-widest text-pink-200/50">
          Vaishali Nagar, Jaipur - Digital Passport Ledger
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-white relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl font-black text-pink-700 uppercase tracking-tight">
              Plush Brew
            </h2>
            <p className="font-sans text-sm text-[#5B3E31]/70">
              Connect your digital Lounge Passport
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2 font-sans animate-shake">
              <span className="shrink-0 mt-0.5 font-bold">!</span>
              <span className="text-left font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs rounded-2xl flex items-start gap-2 font-sans animate-fade-in">
              <span className="shrink-0 mt-0.5 font-bold">*</span>
              <span className="text-left font-semibold">{successMessage}</span>
            </div>
          )}

          <div className="flex rounded-3xl bg-[#FAF4F2] p-2 border border-pink-100/40 font-serif">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
                isLogin
                  ? 'bg-[#FFD5CD] text-[#5B3E31] shadow-sm'
                  : 'text-[#5B3E31]/70 hover:bg-white hover:text-[#5B3E31]'
              }`}
            >
              Access ID
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
                !isLogin
                  ? 'bg-[#FFD5CD] text-[#5B3E31] shadow-sm'
                  : 'text-[#5B3E31]/70 hover:bg-white hover:text-[#5B3E31]'
              }`}
            >
              Register Pass
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4" id="auth-form">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase text-[#5B3E31]/80 mb-2 font-bold px-4">
                    Full Name:
                  </label>
                  <div className="relative">
                    <User className="absolute left-6 top-3.5 h-5 w-5 text-[#CE3A74]/50 z-10" />
                    <input
                      required
                      type="text"
                      placeholder="E.g. Kaysha Motiani"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="plush-input !pl-16"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase text-[#5B3E31]/80 mb-2 font-bold px-4">
                    Telephone String:
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-3.5 h-5 w-5 text-[#CE3A74]/50 z-10" />
                    <input
                      required
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="plush-input !pl-16"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-[#5B3E31]/80 mb-2 font-bold px-4">
                Email:
              </label>
              <div className="relative">
                <Mail className="absolute left-6 top-3.5 h-5 w-5 text-[#CE3A74]/50 z-10" />
                <input
                  required
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="plush-input !pl-16"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-[#5B3E31]/80 mb-2 font-bold px-4">
                Password:
              </label>
              <div className="relative">
                <Lock className="absolute left-6 top-3.5 h-5 w-5 text-[#CE3A74]/50 z-10" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="............"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="plush-input !pl-16 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-3.5 text-[#CE3A74]/50 hover:text-[#CE3A74] z-10"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="plush-btn w-full mt-8 group text-base disabled:cursor-not-allowed disabled:opacity-70"
              id="submit-auth-btn"
            >
              {isSubmitting ? 'Checking Passport...' : isLogin ? 'Verify Passport' : 'Link Coords & Log In'}{' '}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

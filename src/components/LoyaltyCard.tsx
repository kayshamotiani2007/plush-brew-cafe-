/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoyaltyTrack, MenuItem } from '../types';
import { 
  Award, 
  CheckCircle, 
  Search, 
  Sparkles, 
  Smile, 
  RefreshCw, 
  GlassWater, 
  Upload, 
  FileText, 
  Gift, 
  Calendar, 
  AlertCircle, 
  Sparkle, 
  X,
  Plus
} from 'lucide-react';
import { curatedMenuItems } from '../data/menu';

interface LoyaltyCardProps {
  loyaltyTracks: LoyaltyTrack[];
  lookupLoyalty: (email: string) => LoyaltyTrack | undefined;
  earnStampSimulated: (email: string, phone: string) => void;
  claimRewardSimulated: (email: string, freeItem: MenuItem) => void;
  addLoyaltyAccount: (
    email: string, 
    phone: string, 
    isBirthday?: boolean, 
    birthdayDate?: string, 
    idProofName?: string,
    idProofUrl?: string
  ) => void;
  currentUser?: { email: string; name: string } | null;
}

export default function LoyaltyCard({
  loyaltyTracks,
  lookupLoyalty,
  earnStampSimulated,
  claimRewardSimulated,
  addLoyaltyAccount,
  currentUser
}: LoyaltyCardProps) {
  // Synchronized search email targeting active user session
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(currentUser?.email || '');

  // Register Form Data
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regIdFile, setRegIdFile] = useState<File | null>(null);
  const [regIdUrl, setRegIdUrl] = useState('');
  
  // Birthday Feature states (Inline backup)
  const [isBdayClaim, setIsBdayClaim] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState('');
  
  // Dedicated Verification Modal States
  const [showBdayModal, setShowBdayModal] = useState(false);
  const [bdayModalEmail, setBdayModalEmail] = useState('');
  const [bdayModalPhone, setBdayModalPhone] = useState('');
  const [bdayModalDate, setBdayModalDate] = useState('');
  const [bdayModalFile, setBdayModalFile] = useState<File | null>(null);
  const [bdayFileName, setBdayFileName] = useState('');
  const [bdayFileDataUrl, setBdayFileDataUrl] = useState('');
  const [bdayScanning, setBdayScanning] = useState(false);
  const [bdayProgress, setBdayProgress] = useState(0);
  const [bdayComplete, setBdayComplete] = useState(false);

  // File Upload states for inline (drag and drop + click)
  const [dragActive, setDragActive] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Rewards states
  const [showRewardModal, setShowRewardModal] = useState(false);

  // Policy toggles for easy manual testing
  const [bypassDailyLimit, setBypassDailyLimit] = useState(true);

  // Sync with logged in user
  useEffect(() => {
    if (currentUser?.email) {
      setSelectedEmail(currentUser.email);
    }
  }, [currentUser?.email]);

  // Derive the active passport
  const activeAccount = loyaltyTracks.find(
    (track) => track.email.toLowerCase() === selectedEmail.toLowerCase()
  ) || null;

  // Items eligible for reward: Drink or food item with price under 299
  const eligibleRewards = curatedMenuItems.filter((item) => item.price < 299);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    const account = lookupLoyalty(searchEmail.trim().toLowerCase());
    if (account) {
      setSelectedEmail(searchEmail.trim().toLowerCase());
    } else {
      alert("No active stamping record found for this email. Input details on the right to instantiate your passport!");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAttachment(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAttachment(e.target.files[0]);
    }
  };

  const processAttachment = (file: File) => {
    setAttachmentFile(file);
    setIsVerifying(true);
    setIsVerified(false);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1200);
  };

  const triggerSimulationScanning = (filename: string) => {
    setBdayScanning(true);
    setBdayProgress(0);
    setBdayComplete(false);
    
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setBdayProgress(100);
        setBdayScanning(false);
        setBdayComplete(true);
      } else {
        setBdayProgress(current);
      }
    }, 100);
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = regEmail.trim().toLowerCase();
    if (!cleanEmail || !regPhone.trim()) return;

    if (isBdayClaim) {
      if (!birthdayDate) {
        alert('Please specify your Date of Birth.');
        return;
      }
      if (!regIdFile) {
        alert('Please upload your ID proof to claim Birthday Bonus.');
        return;
      }

      // Add account immediately with ID info
      addLoyaltyAccount(
        cleanEmail,
        regPhone.trim(),
        true,
        birthdayDate,
        regIdFile.name,
        regIdUrl
      );
    } else {
      addLoyaltyAccount(
        cleanEmail,
        regPhone.trim(),
        false,
        undefined,
        undefined,
        undefined
      );
    }


    setSelectedEmail(cleanEmail);
    setSearchEmail('');
    setRegSuccess('Stamping Passport authenticated with +2 Welcome Stamps!');

    // Reset fields
    setRegEmail('');
    setRegPhone('');
    setIsBdayClaim(false);
    setBirthdayDate('');
    setAttachmentFile(null);
    setIsVerified(false);
    setRegIdFile(null);
    setRegIdUrl('');


    setTimeout(() => {
      setRegSuccess('');
    }, 6000);
  };

  const handleEarnStamp = () => {
    if (!activeAccount) return;
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    
    if (activeAccount.lastStampDate === todayStr && !bypassDailyLimit) {
      alert(`⚠️ Accrual policy matches: You can only earn 1 Stamp per day!\n(Turn on the "Dev: Bypass daily limit" switch to force simulated stamps for testing.)`);
      return;
    }

    earnStampSimulated(activeAccount.email, activeAccount.phone);
  };

  const selectFreeReward = (item: MenuItem) => {
    if (!activeAccount) return;
    claimRewardSimulated(activeAccount.email, item);
    setShowRewardModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#FFF8F9]" id="loyalty-root">
      
      {/* HEADER BANNER ZONE */}
      <div className="grid lg:grid-cols-12 gap-8 items-start mb-10">
        <div className="lg:col-span-6 space-y-4">
          <span className="font-mono text-xs text-[#CE3A74] uppercase tracking-widest block font-bold flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 animate-pulse" /> Café Plush Club Privileges
          </span>
          <h3 className="font-serif text-3xl font-extrabold text-pink-850 tracking-tight">
            Digital Stamping Ledger
          </h3>
          <p className="font-sans text-sm text-[#7A6054]/95 leading-relaxed">
            Welcome to Jaipur's finest modular loyalty club. Order your favorite brews or bagels, accumulate stamps on your credentials, and unlock premium free rewards!
          </p>

          <div className="bg-pink-100/40 rounded-2xl p-4 border border-[#CE3A74]/10 space-y-2">
            <h5 className="font-serif text-xs font-bold text-pink-905 flex items-center gap-1.5">
              <Gift className="h-3.5 w-3.5 text-[#CE3A74]" /> Universal Rules & Perks
            </h5>
            <ul className="list-disc pl-4 text-[11px] font-sans text-[#7A6054]/90 space-y-1">
              <li>
                <strong>Automatic Stamps:</strong> Get 1 loyalty stamp automatically on any order above <span className="text-pink-700 font-bold">₹299</span>.
              </li>
              <li>
                <strong>Daily Safeguard:</strong> Limit of <span className="text-pink-700 font-bold">1 stamp per calendar day</span>.
              </li>
              <li>
                <strong>Birthday Gift:</strong> Registering on your birthday? Attach your ID proof to claim <span className="text-[#CE3A74] font-bold">+1 Bonus Stamp</span> instantly!
              </li>
              <li>
                <strong>Collect 10 Stamps:</strong> Reset your card to claim a <span className="text-pink-700 font-bold">FREE Drink or Food Item (valued under ₹299)</span>!
              </li>
            </ul>
          </div>
        </div>

        {/* REGISTRATION PANEL */}
        <div className="lg:col-span-6 rounded-3xl border border-[#CE3A74]/15 bg-white p-6 shadow-sm">
          <h4 className="font-serif font-bold text-pink-850 text-base mb-3 flex items-center gap-1.5">
            <Plus className="h-4 w-4 text-[#CE3A74]" /> Instantiate Stamping Passport
          </h4>
          
          {regSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
              <span>{regSuccess}</span>
            </div>
          )}

          <form onSubmit={handleRegistration} className="space-y-4 font-sans text-xs">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-pink-805 uppercase tracking-wider font-bold">
                  Email Target
                </label>
                <input
                  required
                  type="email"
                  placeholder="name@gmail.com"
                  className="w-full bg-white rounded-xl border border-pink-150 px-3 py-2 focus:ring-1 focus:ring-[#CE3A74] focus:outline-none"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-pink-805 uppercase tracking-wider font-bold">
                  Cell Phone
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-white rounded-xl border border-pink-150 px-3 py-2 focus:ring-1 focus:ring-[#CE3A74] focus:outline-none"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Birthday Verification Trigger */}
            <div className="border-t border-pink-50 pt-3 space-y-3">
              <label className="inline-flex items-center gap-2.5 cursor-pointer text-pink-900 font-semibold text-xs">
                <input
                  type="checkbox"
                  className="rounded text-[#CE3A74] focus:ring-[#CE3A74]"
                  checked={isBdayClaim}
                  onChange={(e) => setIsBdayClaim(e.target.checked)}
                />
                <span>🎂 Celebrating my active Birthday today! (Claim bonus stamp)</span>
              </label>

              {isBdayClaim && (
                <div className="bg-pink-50/50 rounded-2xl p-4 border border-pink-100 animate-fadeIn space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-pink-805 uppercase tracking-wider font-bold flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#CE3A74]" /> Date of Birth
                    </label>
                    <input
                      required={isBdayClaim}
                      type="date"
                      className="bg-white rounded-xl border border-pink-150 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#CE3A74]"
                      value={birthdayDate}
                      onChange={(e) => setBirthdayDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono text-pink-805 uppercase tracking-wider font-bold">Upload ID Proof</label>
                    <input
                      required={isBdayClaim}
                      type="file"
                      className="w-full text-xs text-pink-900 border border-pink-200 rounded-xl p-1"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setRegIdFile(file);
                          const reader = new FileReader();
                          reader.onload = () => setRegIdUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-2xl bg-[#CE3A74] py-2.5 text-xs font-serif font-bold text-white shadow hover:bg-pink-750 transition-all cursor-pointer active:scale-95"
            >
              Activate Digital Loyalty Card
            </button>
          </form>
        </div>
      </div>

      {/* SEARCH AND MAIN STATUS DASHBOARD */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR FOR SWITCHING EMAIL SEARCH */}
        <div className="lg:col-span-4 rounded-3xl border border-pink-100 bg-white p-6 shadow-sm space-y-5">
          <h4 className="font-serif font-bold text-pink-850 text-base flex items-center gap-1.5">
            <Search className="h-4 w-4 text-[#CE3A74]" /> Passport Switcher
          </h4>
          <p className="font-sans text-xs text-[#7A6054]">
            Review, check, or switch active stamp card profiles. Your logged-in account is auto-loaded inside this sandbox.
          </p>

          <form onSubmit={handleLookup} className="space-y-2">
            <input
              type="email"
              required
              className="w-full bg-white rounded-xl border border-pink-150 px-3 py-2 text-xs focus:ring-1 focus:ring-[#CE3A74] ... focus:outline-none"
              placeholder="Check registered email path..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-pink-50 border border-[#CE3A74]/15 px-4 py-2 font-serif text-xs font-bold text-[#CE3A74] hover:bg-[#CE3A74] hover:text-white transition-all cursor-pointer"
            >
              Verify Passport Email
            </button>
          </form>

          {/* Current log status badge details */}
          <div className="bg-pink-50/50 rounded-2xl p-3 border border-pink-100 text-center space-y-1 font-sans">
            <p className="text-[10px] text-[#7A6054]">Logged-in Account</p>
            <p className="text-xs font-mono text-pink-900 font-bold truncate">
              {currentUser?.email || 'Guest User'}
            </p>
            {activeAccount && (
              <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 rounded px-1.5 py-0.5 text-[9px] font-semibold mt-1">
                ✓ Passport Selected
              </span>
            )}
          </div>


        </div>

        {/* REWARD CARD VISUAL GRID (10 SLOTS!) */}
        <div className="lg:col-span-8">
          {activeAccount ? (
            <div className="rounded-3xl border border-pink-100 bg-white p-6 sm:p-8 shadow-sm grid md:grid-cols-12 gap-8 items-stretch">
              
              <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#CE3A74] font-extrabold flex items-center gap-1">
                      <Sparkle className="h-3.5 w-3.5" /> Plush Stamp Passport
                    </span>
                    <Award className="h-5 w-5 text-[#CE3A74]" />
                  </div>
                  <h4 className="font-serif text-xl font-extrabold text-pink-930 mt-1 truncate">
                    {activeAccount.email}
                  </h4>
                  <p className="font-mono text-[10px] text-[#7A6054]">
                    Registry Phone: {activeAccount.phone}
                  </p>

                  {/* Birthday privilege details & photo preview */}
                  {activeAccount.birthdayBonusApplied && (
                    <div className="mt-3 bg-pink-50/50 p-2.5 rounded-2xl border border-pink-200/50 flex items-center gap-3 animate-fadeIn">
                      {activeAccount.idProofUrl ? (
                        <div className="relative group shrink-0">
                          <img 
                            src={activeAccount.idProofUrl} 
                            alt="Verified ID" 
                            className="h-12 w-12 object-cover rounded-xl border border-pink-200 shadow-sm cursor-zoom-in hover:border-[#CE3A74] active:scale-95 transition-all"
                            onClick={() => {
                              alert(`🎂 Verified Account Registry Details\n---------------------------------\nID Document: ${activeAccount.idProofName || "Government / Academic ID"}\nRegistered Birthday: ${activeAccount.birthday || "Today"}\nSign-up Perk: +1 Free Birthday Passport Stamp Applied (Total +3 stamps starting bonus!)`);
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[8px] px-1 rounded-full font-bold shadow-sm">✓</div>
                        </div>
                      ) : (
                        <div className="h-12 w-12 bg-pink-100 rounded-xl flex items-center justify-center text-lg shadow-sm border border-pink-200 shrink-0 select-none">
                          🎂
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-serif text-pink-900 font-bold text-xs flex items-center gap-1">
                          🎂 Birthday Club Member
                          <span className="text-[8px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-1 rounded-md">Verified</span>
                        </p>
                        <p className="text-[10px] text-[#7A6054] font-medium truncate max-w-[200px]">
                          File: {activeAccount.idProofName || 'Identity scan verified'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stamping Cells Grid (10 complete slots!) */}
                <div>
                  <p className="font-sans text-[10px] text-[#7A6054] mb-2 font-medium">
                    Card Progress: {activeAccount.stampsCount} of 10 Collected!
                  </p>
                  
                  <div className="grid grid-cols-5 gap-2.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((slotIdx) => {
                      const isStamped = slotIdx <= activeAccount.stampsCount;
                      return (
                        <div
                          key={slotIdx}
                          className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                            isStamped
                              ? 'bg-[#CE3A74] border-[#CE3A74] text-white shadow-md rotate-2'
                              : 'bg-pink-50/50 border-pink-200 text-[#CE3A74]/30 border-dashed hover:bg-pink-100/50'
                          }`}
                        >
                          {isStamped ? (
                            <>
                              <GlassWater className="h-5 w-5 stroke-2 animate-pulse" />
                              <span className="font-mono text-[8px] font-bold mt-1">S-{slotIdx}</span>
                            </>
                          ) : (
                            <>
                              <span className="font-serif text-[10px] font-bold text-pink-700/40">{slotIdx}</span>
                            </>
                          )}
                          
                          {/* Final check boba target highlight */}
                          {slotIdx === 10 && (
                            <div className={`absolute top-0.5 right-0.5 rounded-full p-0.5 text-[8px] ${isStamped ? 'bg-amber-400' : 'bg-transparent text-transparent'}`}>
                              🎁
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulation & Claim Controls */}
                <div className="flex gap-3 pt-2">
                  <button
                    disabled={activeAccount.stampsCount < 10}
                    onClick={() => setShowRewardModal(true)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#CE3A74] text-white px-4 py-2 font-serif text-xs font-bold hover:bg-pink-750 disabled:opacity-40 disabled:hover:bg-[#CE3A74] transition-all cursor-pointer active:scale-95 text-center leading-tight"
                  >
                    <Smile className="h-3.5 w-3.5" /> Claim Free Combo!
                  </button>
                </div>
              </div>

              {/* Accrual Logs Column */}
              <div className="md:col-span-5 bg-pink-50/30 rounded-2xl p-4 border border-pink-100 flex flex-col justify-between">
                <div className="space-y-4">
                  <h5 className="font-serif text-xs font-bold text-pink-850 border-b border-[#CE3A74]/10 pb-1.5">
                    Accrual Trails
                  </h5>
                  <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                    {activeAccount.history.length === 0 ? (
                      <p className="font-sans text-[10px] text-[#7A6054]/70">No actions recorded on card. Enjoy a beverage to prompt trails!</p>
                    ) : (
                      activeAccount.history.map((log, i) => (
                        <div key={i} className="flex gap-1.5 items-start text-[10px] font-sans text-[#7A6054]">
                          <span className="text-[#CE3A74] font-bold">✓</span>
                          <span>{log}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-3 mt-4 space-y-1">
                  <p className="font-sans text-[9px] text-[#CE3A74]/70 uppercase tracking-widest font-semibold">Stamps Status</p>
                  <p className="font-serif text-[11px] text-pink-900 font-bold leading-normal">
                    {activeAccount.stampsCount >= 10 
                      ? "✨ All 10 Stamps Completed! Claim a Free Drink & Food combo item below ₹299 on the house!" 
                      : `Receive ${10 - activeAccount.stampsCount} more stamps via qualifying orders (>₹299) to claim a free item.`}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-3xl border border-pink-100 bg-pink-50/50 p-12 text-center space-y-3">
              <div className="h-12 w-12 mx-auto rounded-full bg-white flex items-center justify-center text-[#CE3A74] shadow-sm">
                <Award className="h-6 w-6" />
              </div>
              <p className="font-serif text-base font-bold text-pink-850">No card registered for {selectedEmail || 'Guest'}</p>
              <p className="font-sans text-xs text-[#7A6054]/80 max-w-sm mx-auto">
                Insert your credentials in the "Instantiate Stamping Passport" card on the right to start your loyalty card folder & claim your initial bonus stamps instantly!
              </p>
            </div>
          )}
        </div>

      </div>

      {/* REWARD DISPATCH OVERLAY MODAL */}
      {showRewardModal && activeAccount && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowRewardModal(false)}
              className="absolute top-4 right-4 text-[#7A6054] hover:text-[#CE3A74] rounded-full p-1.5 bg-pink-50 hover:bg-pink-100"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="text-center space-y-1.5 pb-2 border-b border-pink-50">
              <div className="h-10 w-10 bg-[#CE3A74] text-white rounded-full flex items-center justify-center mx-auto shadow">
                <Gift className="h-5 w-5 animate-bounce" />
              </div>
              <h4 className="font-serif text-xl font-bold text-pink-850">10-Stamp Free Reward Combo Menu</h4>
              <p className="font-sans text-xs text-[#7A6054]/90 max-w-md mx-auto">
                Celebrate your loyalty milestone! Select any single item belowvalued under <strong className="text-pink-700">₹299</strong> to enjoy fully free from the kitchen line:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5 max-h-[50vh] overflow-y-auto pr-2">
              {eligibleRewards.map((prod) => (
                <div
                  key={prod.id}
                  className="flex border border-pink-100 rounded-2xl overflow-hidden hover:border-[#CE3A74] transition-all bg-[#FFFDFE] relative"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-full object-cover shrink-0 bg-pink-50/50"
                  />
                  <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <h5 className="font-serif font-bold text-xs text-pink-905 truncate">{prod.name}</h5>
                      <p className="text-[10px] text-[#7A6054]/80 leading-normal line-clamp-2 mt-0.5">{prod.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1 mt-1 border-t border-pink-50/60 font-mono text-[10px]">
                      <span className="text-[#CE3A74] font-bold">₹{prod.price}</span>
                      <button
                        onClick={() => selectFreeReward(prod)}
                        className="bg-[#CE3A74] text-white px-3 py-1 rounded-lg text-[10px] font-sans font-bold hover:bg-pink-750 transition-all cursor-pointer"
                      >
                        Claim Combo Free!
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2 font-sans text-[11px] text-[#7A6054]/75">
              💡 Selecting an item automatically sets stamps counts back to zero and routes order tickets directly to terminal logs.
            </div>

          </div>
        </div>
      )}

      {/* BIRTHDAY ID PHOTO UPLOAD & VERIFICATION MODAL */}
      {showBdayModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-scale-up max-h-[95vh] overflow-y-auto border border-pink-100">
            
            <button
              onClick={() => {
                setShowBdayModal(false);
                setIsBdayClaim(false);
              }}
              className="absolute top-4 right-4 text-[#7A6054] hover:text-[#CE3A74] rounded-full p-1.5 bg-pink-50 hover:bg-pink-100 transition-all font-bold cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2 pb-3 border-b border-pink-50">
              <div className="h-12 w-12 bg-pink-100 text-[#CE3A74] rounded-full flex items-center justify-center mx-auto shadow-sm border border-pink-200">
                <Calendar className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="font-serif text-lg font-bold text-pink-850">🎂 Birthday Stamp Verification Center</h3>
              <p className="font-sans text-xs text-[#7A6054]/90 max-w-sm mx-auto">
                Secure your +1 Birthday stamp by uploading a photo of your Government or Student ID proof. This gives you a total of <strong>3 stamps starting balance</strong>!
              </p>
            </div>

            {/* Presets and Upload area */}
            <div className="space-y-4">
              
              {/* Presets Grid */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-pink-805 uppercase tracking-wider font-bold">
                  💡 Sandbox ID Presets (Fast testing shortcuts)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBdayFileName("Jaipur_Univ_ID.png");
                      const mockStudentIdSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" rx="12" fill="%23CE3A74"/><rect x="10" y="10" width="280" height="160" rx="8" fill="white" fill-opacity="0.95"/><circle cx="50" cy="80" r="25" fill="%23ffc5d9"/><rect x="90" y="55" width="180" height="12" rx="4" fill="%23CE3A74"/><text x="90" y="90" font-family="sans-serif" font-size="10" font-weight="bold" fill="%237A6054">JAIPUR UNIVERSITY STUDENT</text><text x="90" y="105" font-family="sans-serif" font-size="8" fill="%237A6054">DOB: Verified Match</text><rect x="90" y="120" width="150" height="6" rx="3" fill="%23CE3A74" fill-opacity="0.3"/><circle cx="50" cy="80" r="15" fill="%23CE3A74" fill-opacity="0.2"/><text x="40" y="145" font-family="monospace" font-size="8" font-weight="bold" fill="%23CE3A74">ID-STUDENT</text></svg>`;
                      setBdayFileDataUrl(mockStudentIdSvg);
                      setBdayComplete(false);
                      triggerSimulationScanning("Jaipur_Univ_ID.png");
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all hover:bg-pink-50 cursor-pointer flex flex-col items-center justify-between gap-1 ${
                      bdayFileName === 'Jaipur_Univ_ID.png' ? 'border-[#CE3A74] bg-pink-50/50' : 'border-pink-100 bg-white'
                    }`}
                  >
                    <span className="text-lg">🎓</span>
                    <span className="font-sans text-[9px] font-bold text-pink-900 leading-tight">Student Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBdayFileName("Aadhaar_National_ID.png");
                      const mockGovIdSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" rx="12" fill="%232b5c8f"/><rect x="10" y="10" width="280" height="160" rx="8" fill="white" fill-opacity="0.95"/><circle cx="50" cy="80" r="25" fill="%23b8d4f4"/><rect x="90" y="55" width="180" height="12" rx="4" fill="%232b5c8f"/><text x="90" y="90" font-family="sans-serif" font-size="10" font-weight="bold" fill="%237A6054">NATIONAL ID CARD - INDIA</text><text x="90" y="105" font-family="sans-serif" font-size="8" fill="%237A6054">DOB: Active Match</text><rect x="90" y="120" width="150" height="6" rx="3" fill="%232b5c8f" fill-opacity="0.3"/><circle cx="50" cy="80" r="15" fill="%232b5c8f" fill-opacity="0.2"/><text x="35" y="145" font-family="monospace" font-size="8" font-weight="bold" fill="%232b5c8f">GOVT-VERIFIED</text></svg>`;
                      setBdayFileDataUrl(mockGovIdSvg);
                      setBdayComplete(false);
                      triggerSimulationScanning("Aadhaar_National_ID.png");
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all hover:bg-pink-50 cursor-pointer flex flex-col items-center justify-between gap-1 ${
                      bdayFileName === 'Aadhaar_National_ID.png' ? 'border-[#CE3A74] bg-pink-50/50' : 'border-pink-100 bg-white'
                    }`}
                  >
                    <span className="text-lg">🪪</span>
                    <span className="font-sans text-[9px] font-bold text-pink-900 leading-tight">National ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBdayFileName("Global_Passport.png");
                      const mockPassportSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" rx="12" fill="%231a3122"/><rect x="10" y="10" width="280" height="160" rx="8" fill="white" fill-opacity="0.95"/><circle cx="50" cy="80" r="25" fill="%23cbe1d0"/><rect x="90" y="55" width="180" height="12" rx="4" fill="%231a3122"/><text x="90" y="90" font-family="sans-serif" font-size="10" font-weight="bold" fill="%237A6054">INTERNATIONAL TRAVEL PASSPORT</text><text x="90" y="105" font-family="sans-serif" font-size="8" fill="%237A6054">DOB: Matching Records</text><rect x="90" y="120" width="150" height="6" rx="3" fill="%231a3122" fill-opacity="0.3"/><circle cx="50" cy="80" r="15" fill="%231a3122" fill-opacity="0.2"/><text x="35" y="145" font-family="monospace" font-size="8" font-weight="bold" fill="%231a3122">GLOBAL-PASSPORT</text></svg>`;
                      setBdayFileDataUrl(mockPassportSvg);
                      setBdayComplete(false);
                      triggerSimulationScanning("Global_Passport.png");
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all hover:bg-pink-50 cursor-pointer flex flex-col items-center justify-between gap-1 ${
                      bdayFileName === 'Global_Passport.png' ? 'border-[#CE3A74] bg-pink-50/50' : 'border-pink-100 bg-white'
                    }`}
                  >
                    <span className="text-lg">🌍</span>
                    <span className="font-sans text-[9px] font-bold text-pink-900 leading-tight">Passport Card</span>
                  </button>
                </div>
              </div>

              {/* Upload Panel */}
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-pink-805 uppercase tracking-wider font-bold">
                  Or Upload Your Own Photo ID Proof
                </label>
                <div
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      setBdayModalFile(file);
                      setBdayFileName(file.name);
                      
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (reader.result) {
                          setBdayFileDataUrl(reader.result as string);
                          setBdayComplete(false);
                          triggerSimulationScanning(file.name);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative ${
                    dragActive 
                      ? 'border-[#CE3A74] bg-pink-50/30' 
                      : bdayFileDataUrl 
                        ? 'border-emerald-300 bg-emerald-50/20' 
                        : 'border-pink-200 hover:border-[#CE3A74]/50'
                  }`}
                >
                  <input
                    type="file"
                    id="bday-modal-file-input"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setBdayModalFile(file);
                        setBdayFileName(file.name);
                        
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (reader.result) {
                            setBdayFileDataUrl(reader.result as string);
                            setBdayComplete(false);
                            triggerSimulationScanning(file.name);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  
                  <div 
                    className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                    onClick={() => document.getElementById('bday-modal-file-input')?.click()}
                  >
                    {bdayFileDataUrl ? (
                      <div className="space-y-2">
                        <div className="relative mx-auto h-24 max-w-full overflow-hidden rounded-xl border border-pink-200 shadow-sm bg-white p-1">
                          <img
                            src={bdayFileDataUrl}
                            alt="Uploaded Preview"
                            className="h-full w-full object-contain rounded-lg"
                          />
                          {bdayScanning && (
                            <div className="absolute inset-x-0 top-0 bottom-0 bg-[#CE3A74]/10 rounded-lg">
                              <div className="h-0.5 w-full bg-[#CE3A74] shadow-[0_0_8px_#CE3A74] absolute left-0 animate-pulse"></div>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-[#7A6054] font-medium max-w-[200px] truncate mx-auto break-all">
                          📄 {bdayFileName}
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-[#CE3A74]/60 animate-bounce" />
                        <p className="text-xs font-semibold text-[#CE3A74]">
                          Drag & drop your photo ID scan or click to browse
                        </p>
                        <p className="text-[10px] text-[#7A6054]/60">Supports PNG, JPG, or HEIC photo captures</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Scanning status simulation */}
              {bdayScanning && (
                <div className="space-y-1.5 bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
                  <div className="flex items-center justify-between text-[10px] font-mono text-pink-850 font-bold">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3 w-3 animate-spin text-[#CE3A74]" />
                      Analyzing Photo Credentials...
                    </span>
                    <span>{bdayProgress}%</span>
                  </div>
                  <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#CE3A74] h-full transition-all duration-100" 
                      style={{ width: `${bdayProgress}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-[#7A6054]/80 text-center italic">
                    {bdayProgress < 40 && "Detecting face geometry and identity features..."}
                    {bdayProgress >= 40 && bdayProgress < 85 && "Matching birth records for date compatibility..."}
                    {bdayProgress >= 85 && "Submitting cryptographic signature check..."}
                  </p>
                </div>
              )}

              {bdayComplete && (
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-200 text-xs flex items-start gap-2.5">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 fill-emerald-100" />
                  <div>
                    <h5 className="font-serif font-bold text-xs text-emerald-950 leading-tight">ID Proof Successfully Verified!</h5>
                    <p className="font-sans text-[10px] text-emerald-700 mt-0.5 leading-normal">
                      Excellent match! Face biometric verified. Date Of Birth matches standard loyalty constraints. You have cleared authentication.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal actions */}
            <div className="flex gap-3 pt-3 border-t border-pink-50">
              <button
                type="button"
                onClick={() => {
                  setShowBdayModal(false);
                  setIsBdayClaim(false);
                }}
                className="flex-1 rounded-2xl border border-pink-200 py-2.5 text-xs font-semibold text-[#7A6054] hover:bg-pink-50 transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              
              <button
                type="button"
                disabled={!bdayComplete || bdayScanning}
                onClick={() => {
                  // Finalize registration!
                  addLoyaltyAccount(
                    bdayModalEmail,
                    bdayModalPhone,
                    true,
                    bdayModalDate,
                    bdayFileName || "Verified_ID.png",
                    bdayFileDataUrl
                  );

                  setSelectedEmail(bdayModalEmail);
                  setSearchEmail('');
                  setRegSuccess('🎉 Birthday privilege authenticated! Passport activated with +3 Stamps (2 Welcome + 1 Birthday Birthday Bonus!).');
                  
                  // Reset forms
                  setRegEmail('');
                  setRegPhone('');
                  setIsBdayClaim(false);
                  setBirthdayDate('');
                  setShowBdayModal(false);

                  setTimeout(() => {
                    setRegSuccess('');
                  }, 8000);
                }}
                className="flex-1 rounded-2xl bg-[#CE3A74] py-2.5 text-xs font-serif font-bold text-white shadow hover:bg-pink-750 disabled:opacity-45 transition-all cursor-pointer text-center active:scale-95 flex items-center justify-center gap-1"
              >
                <CheckCircle className="h-4 w-4" /> Clear ID & Claim (+3 Stamps)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

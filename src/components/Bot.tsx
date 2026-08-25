import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, Coffee, Smile, Heart, Sunset, Compass } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const generateSessionId = () => {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const MOOD_SUGGESTIONS = [
  { label: "🌸 Sweet & Dreamy", prompt: "I'm in a sweet, dreamy mood! What drink and treat can you recommend me?" },
  { label: "☀️ Energized & Tropical", prompt: "I'm feeling positive and energized! Suggest something tropical or refreshing." },
  { label: "☁️ Cozy & Rain-loving", prompt: "I'm looking for maximum comfort and cozy vibes, like a Jaipur golden hour rain." },
  { label: "🧀 Warm & Comfort food", prompt: "I'm very hungry and want rich, savory comfort food!" },
  { label: "🎟️ How do loyalty stamps work?", prompt: "Can you explain how the Plush Brew interactive stamping card works?" },
];

export default function Bot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello there, lovely soul! ☁️✨ I'm **Marshmallow**, your official AI café concierge at Plush Brew. Settling into your cozy spot? Tell me how you are feeling right now, and I'll find the perfect, dreamy boba or warm bagel just for you! 🌸🍹 Bagels? Sweets? Let me know! 💕",
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    const historyContext = messagesRef.current.map(m => ({
      role: m.role,
      content: m.content
    }));

    const nextMessagesAfterUser = [...messagesRef.current, userMsg];
    messagesRef.current = nextMessagesAfterUser;
    setMessages(nextMessagesAfterUser);
    setInputValue('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          message: text,
          history: historyContext
        }),
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || "Something went wrong in my marshmallow brain! Let's sip some tea soon. 🧋✨",
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      
      const nextMessages = [...messagesRef.current, botMsg];
      messagesRef.current = nextMessages;
      setMessages(nextMessages);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: "Oops! Marshmallow drifted into a fluffy strawberry fog cloud! ☁️🍓 Let's try sending that again, or maybe visit the menu section directly! ✨",
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      const nextMessages = [...messagesRef.current, errorMsg];
      messagesRef.current = nextMessages;
      setMessages(nextMessages);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]" id="marshmallow-ai-bot">
      {/* Floating Sparkly Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#CE3A74] to-[#E87EA1] text-white shadow-lg cursor-pointer hover:shadow-xl focus:outline-none"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="h-6 w-6" />
              {/* Cute heart badge indicating concierge is live */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFF8F0] border-2 border-[#CE3A74]"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Expanded Chatbot Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute bottom-16 right-0 w-[360px] sm:w-[400px] h-[520px] max-h-[80vh] flex flex-col rounded-3xl border border-pink-100 bg-[#FDFBF7] shadow-2xl overflow-hidden"
          >
            {/* Header decor */}
            <div className="relative bg-gradient-to-r from-pink-50 to-orange-50 px-5 py-4 border-b border-pink-150">
              <div className="flex items-center gap-3">
                {/* Micro Marshmallow Avatar Icon */}
                <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-2xl bg-[#FFF8F0] border border-[#CE3A74]/20 shadow-sm relative overflow-hidden">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="4" y="6" width="24" height="20" rx="7" fill="#FFF8F0" stroke="#FCE7F3" strokeWidth="2" />
                    <circle cx="11" cy="13" r="1.5" fill="#5B3E31" />
                    <circle cx="21" cy="13" r="1.5" fill="#5B3E31" />
                    <path d="M13 17 Q16 19 19 17" stroke="#5B3E31" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    <circle cx="9" cy="16" r="1.8" fill="#FBCFE8" opacity="0.8" />
                    <circle cx="23" cy="16" r="1.8" fill="#FBCFE8" opacity="0.8" />
                  </svg>
                  {/* Glowing online status */}
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-white"></span>
                </div>
                <div>
                  <h4 className="font-serif font-black text-sm text-[#CE3A74] tracking-normal flex items-center gap-1">
                    Marshmallow ✨
                  </h4>
                  <p className="text-[10px] font-mono tracking-wide text-gray-500 uppercase flex items-center gap-1">
                    ☕ Cozy Café Concierge • Live 💌
                  </p>
                </div>
              </div>
              <BookmarkRibbon className="absolute top-0 right-10" />
            </div>

            {/* Chat Messages Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100%-110px)] flex flex-col bg-[#FAF6F0]/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs font-serif leading-relaxed shadow-sm md:text-[13px] ${
                      msg.role === 'user'
                        ? 'bg-[#CE3A74] text-white rounded-tr-none'
                        : 'bg-white text-[#4A3B32] border border-pink-100/50 rounded-tl-none'
                    }`}
                  >
                    {/* Render helper functions, markdown replacement or cute formats */}
                    {msg.content.split('\n').map((para, idx) => (
                      <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                        {para}
                      </p>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Bouncing Marshmallow typing loader */}
              {isLoading && (
                <div className="flex flex-col max-w-[80%] self-start items-start">
                  <div className="bg-white text-[#4A3B32] border border-pink-100 hover:border-pink-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2 shadow-sm">
                    <span className="text-[#CE3A74] font-medium tracking-wide font-serif text-[11px] animate-pulse">
                      Marshmallow is whipping top sweet cold-foam recommendations...
                    </span>
                    <div className="flex gap-1.5 items-end h-2">
                      <div className="bg-[#CE3A74] h-1.5 w-1.5 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="bg-[#CE3A74] h-1.5 w-1.5 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="bg-[#CE3A74] h-1.5 w-1.5 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Box / Mood Picker */}
            <div className="bg-gradient-to-b from-transparent to-[#FDFBF7] p-3 border-t border-pink-100/30 flex flex-col gap-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#CE3A74] font-bold px-1 flex items-center gap-1">
                <Compass className="h-3 w-3" /> Select a mood recommendation:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-pink-100">
                {MOOD_SUGGESTIONS.map((mood, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(mood.prompt)}
                    disabled={isLoading}
                    className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-white border border-pink-150 text-[#CE3A74] px-3 py-1.5 text-[10px] font-bold hover:bg-pink-100 hover:border-[#CE3A74] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-sm"
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Action Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 bg-white border-t border-pink-150 flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about sweets, bagels, stamp card, or songs..."
                className="flex-1 bg-[#FAF6F0] border border-pink-100 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-[#CE3A74] focus:outline-none text-[#4A3B32] placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#CE3A74] hover:bg-pink-700 text-white disabled:opacity-40 transition-colors cursor-pointer active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Decorative component to look like a cute scrapbook bookmark hanging flag
function BookmarkRibbon({ className }: { className?: string }) {
  return (
    <div className={`w-6 h-8 bg-[#CE3A74] relative ${className}`}>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-transparent border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[8px] border-b-[#FAF6F0]" />
    </div>
  );
}

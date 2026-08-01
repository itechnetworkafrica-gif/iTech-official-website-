import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';

const WA_NUMBER = '231776836689';

const CTA_OPTIONS = [
  { label: 'Request a Quote', msg: "Hello iTech Network Africa! I'd like to request a quote for your services." },
  { label: 'Get Technical Support', msg: 'Hi! I need technical support from iTech Network Africa.' },
  { label: 'Partner With Us', msg: 'Hello! I\'m interested in partnering with iTech Network Africa.' },
  { label: 'Learn About Services', msg: "Hi iTech! I'd like to learn more about your services and solutions." },
];

export const WhatsAppWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const openWA = (msg: string) => {
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed) {
      openWA(trimmed);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-8 left-6 z-50 flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl shadow-[0_12px_56px_rgba(0,0,0,0.18)] w-[320px] overflow-hidden border border-[#E5E7EB]"
          >
            {/* ── Header ── */}
            <div className="bg-[#25D366] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <FaWhatsapp size={28} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm leading-tight">iTech Network Africa</div>
                  <div className="text-white/80 text-xs flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Typically replies instantly
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            {/* ── Chat body ── */}
            <div className="p-4 bg-[#ECE5DD] space-y-2">
              {/* Greeting bubble */}
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[88%]">
                <p className="text-[#111] text-sm leading-relaxed">
                  Hi there! How can we help you today? Pick an option or type your message below.
                </p>
              </div>

              {/* CTA quick-reply buttons */}
              <div className="pt-1 space-y-2">
                {CTA_OPTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => openWA(q.msg)}
                    className="w-full text-left bg-white hover:bg-[#f0fef4] border border-[#E5E7EB] hover:border-[#25D366] rounded-xl px-4 py-2.5 text-sm text-[#111] font-medium transition-all duration-150"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Text input ── */}
            <div className="px-3 py-3 bg-[#F0F0F0] flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message…"
                className="flex-1 bg-white rounded-full px-4 py-2 text-sm outline-none border border-[#E5E7EB] focus:border-[#25D366] transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                aria-label="Send"
                className="w-9 h-9 rounded-full bg-[#25D366] disabled:opacity-40 flex items-center justify-center text-white shrink-0 hover:bg-[#1da851] transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger — neon spinning ring ── */}
      <div className="relative">
        <div
          className="neon-border"
          style={{ borderRadius: '50%', padding: '3px', boxShadow: '0 0 28px rgba(0,229,255,0.22)' }}
        >
          <motion.button
            onClick={() => setOpen(o => !o)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            className="relative z-[1] w-14 h-14 rounded-full bg-[#25D366] shadow-[0_6px_28px_rgba(37,211,102,0.45)] flex items-center justify-center"
            aria-label="Chat on WhatsApp"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span key="close" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.18 }}>
                  <X size={24} className="text-white" />
                </motion.span>
              ) : (
                <motion.span key="wa" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.18 }}>
                  <FaWhatsapp size={28} className="text-white" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3B30] rounded-full text-white text-[9px] font-bold flex items-center justify-center select-none z-20 pointer-events-none">
            1
          </span>
        )}
      </div>
    </div>
  );
};

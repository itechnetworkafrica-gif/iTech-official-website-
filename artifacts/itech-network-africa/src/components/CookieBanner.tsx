import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronDown, ChevronUp, Shield, BarChart2, Settings2, Megaphone, Check } from 'lucide-react';
import { Link } from 'wouter';
import { useCookieConsent, CookiePreferences } from '@/hooks/useCookieConsent';

/* ─── Toggle ────────────────────────────────────────────────────────────── */
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${checked ? 'bg-[#3CB52A]' : 'bg-white/20'}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 mt-0.5
        ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

/* ─── Category row ──────────────────────────────────────────────────────── */
type Category = {
  key: keyof CookiePreferences | 'necessary';
  icon: React.ElementType;
  title: string;
  description: string;
  required?: boolean;
};

const CATEGORIES: Category[] = [
  {
    key: 'necessary',
    icon: Shield,
    title: 'Strictly Necessary',
    description: 'Essential for the site to function — login sessions, security, and load balancing. Cannot be disabled.',
    required: true,
  },
  {
    key: 'analytics',
    icon: BarChart2,
    title: 'Performance & Analytics',
    description: 'Help us understand how visitors use the site (e.g. Google Analytics). Data is anonymised and aggregated.',
  },
  {
    key: 'functionality',
    icon: Settings2,
    title: 'Functionality',
    description: 'Remember your preferences such as language, region, and display settings between visits.',
  },
  {
    key: 'marketing',
    icon: Megaphone,
    title: 'Targeting & Marketing',
    description: 'Used to measure ad effectiveness and deliver relevant content (e.g. LinkedIn Insight Tag, Google Ads).',
  },
];

/* ─── Main banner ───────────────────────────────────────────────────────── */
export const CookieBanner: React.FC = () => {
  const { consent, acceptAll, rejectAll, savePreferences } = useCookieConsent();
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    analytics: false,
    functionality: false,
    marketing: false,
  });

  if (consent.decided) return null;

  const toggle = (key: keyof CookiePreferences) =>
    setPrefs(p => ({ ...p, [key]: !p[key] }));

  return (
    <AnimatePresence>
      <motion.div
        key="cookie-banner"
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 pointer-events-none"
      >
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-[0_-4px_40px_rgba(0,0,0,0.5)] overflow-hidden">

            {/* ── Header ── */}
            <div className="flex items-start gap-3 px-5 pt-5 pb-4">
              <div className="w-9 h-9 rounded-xl bg-[#3CB52A]/15 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie size={18} className="text-[#3CB52A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-snug">We use cookies</p>
                <p className="text-white/55 text-xs leading-relaxed mt-0.5">
                  We use cookies to improve your experience, analyse traffic, and personalise content.
                  Read our{' '}
                  <Link href="/cookies" className="text-[#3CB52A] hover:underline">
                    Cookies Policy
                  </Link>{' '}
                  to learn more.
                </p>
              </div>
            </div>

            {/* ── Preferences panel ── */}
            <AnimatePresence>
              {showPrefs && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/10 px-5 py-3 space-y-3">
                    {CATEGORIES.map(({ key, icon: Icon, title, description, required }) => (
                      <div key={key} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/6 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={14} className={required ? 'text-[#3CB52A]' : 'text-white/50'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-semibold leading-tight">{title}</p>
                          <p className="text-white/45 text-[11px] leading-relaxed mt-0.5">{description}</p>
                        </div>
                        <div className="shrink-0 mt-0.5">
                          {required ? (
                            <div className="flex items-center gap-1 text-[#3CB52A] text-[10px] font-semibold">
                              <Check size={11} />
                              Always on
                            </div>
                          ) : (
                            <Toggle
                              checked={prefs[key as keyof CookiePreferences]}
                              onChange={() => toggle(key as keyof CookiePreferences)}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Actions ── */}
            <div className="flex flex-wrap items-center gap-2 px-5 pb-5 pt-1">
              {/* Manage preferences toggle */}
              <button
                onClick={() => setShowPrefs(v => !v)}
                className="flex items-center gap-1 text-white/55 hover:text-white text-xs font-medium transition-colors mr-auto"
              >
                Manage preferences
                {showPrefs ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              <button
                onClick={rejectAll}
                className="px-4 py-2 rounded-lg border border-white/15 hover:border-white/30 text-white/70 hover:text-white text-xs font-semibold transition-colors"
              >
                Reject non-essential
              </button>

              {showPrefs && (
                <button
                  onClick={() => savePreferences(prefs)}
                  className="px-4 py-2 rounded-lg border border-[#3CB52A]/40 hover:border-[#3CB52A] text-[#3CB52A] text-xs font-semibold transition-colors"
                >
                  Save preferences
                </button>
              )}

              <button
                onClick={acceptAll}
                className="px-4 py-2 rounded-lg bg-[#3CB52A] hover:bg-[#2e911f] text-white text-xs font-bold transition-colors"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

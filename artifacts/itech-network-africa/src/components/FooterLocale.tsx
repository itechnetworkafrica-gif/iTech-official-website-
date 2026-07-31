import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronUp, Check } from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────────────────── */

const COUNTRIES = [
  { code: 'LR', name: 'Liberia',          lang: 'English',    flag: '🇱🇷' },
  { code: 'NG', name: 'Nigeria',          lang: 'English',    flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana',            lang: 'English',    flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya',            lang: 'English',    flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa',     lang: 'English',    flag: '🇿🇦' },
  { code: 'SL', name: 'Sierra Leone',     lang: 'English',    flag: '🇸🇱' },
  { code: 'GM', name: 'Gambia',           lang: 'English',    flag: '🇬🇲' },
  { code: 'SN', name: 'Senegal',          lang: 'Français',   flag: '🇸🇳' },
  { code: 'CI', name: "Côte d'Ivoire",   lang: 'Français',   flag: '🇨🇮' },
  { code: 'CM', name: 'Cameroon',         lang: 'English',    flag: '🇨🇲' },
  { code: 'RW', name: 'Rwanda',           lang: 'English',    flag: '🇷🇼' },
  { code: 'TZ', name: 'Tanzania',         lang: 'English',    flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda',           lang: 'English',    flag: '🇺🇬' },
  { code: 'ET', name: 'Ethiopia',         lang: 'Amharic',    flag: '🇪🇹' },
  { code: 'US', name: 'United States',    lang: 'English',    flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom',   lang: 'English',    flag: '🇬🇧' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$',    name: 'US Dollar'              },
  { code: 'LRD', symbol: 'L$',  name: 'Liberian Dollar'        },
  { code: 'EUR', symbol: '€',   name: 'Euro'                   },
  { code: 'GBP', symbol: '£',   name: 'British Pound'          },
  { code: 'NGN', symbol: '₦',   name: 'Nigerian Naira'         },
  { code: 'GHS', symbol: '₵',   name: 'Ghanaian Cedi'          },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling'        },
  { code: 'ZAR', symbol: 'R',   name: 'South African Rand'     },
  { code: 'SLE', symbol: 'Le',  name: 'Sierra Leonean Leone'   },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
  { code: 'GMD', symbol: 'D',   name: 'Gambian Dalasi'         },
  { code: 'RWF', symbol: 'RF',  name: 'Rwandan Franc'          },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling'     },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling'       },
  { code: 'ETB', symbol: 'Br',  name: 'Ethiopian Birr'         },
];

const LS_COUNTRY  = 'itech_locale_country';
const LS_CURRENCY = 'itech_locale_currency';

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

/* ─── Country Picker ────────────────────────────────────────────────────── */

function CountryPicker() {
  const saved   = COUNTRIES.find(c => c.code === localStorage.getItem(LS_COUNTRY)) ?? COUNTRIES[0];
  const [selected, setSelected] = useState(saved);
  const [open,     setOpen]     = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  const pick = (c: typeof COUNTRIES[number]) => {
    setSelected(c);
    localStorage.setItem(LS_COUNTRY, c.code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-white hover:opacity-80 transition-opacity text-sm"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe size={15} className="shrink-0" />
        <span>{selected.flag} {selected.name} &ndash; {selected.lang}</span>
        <ChevronUp
          size={14}
          className={`ml-0.5 transition-transform duration-200 ${open ? 'rotate-0' : 'rotate-180'}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute bottom-full mb-2 left-0 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          <div className="max-h-64 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
            {COUNTRIES.map(c => (
              <button
                key={c.code}
                role="option"
                aria-selected={c.code === selected.code}
                onClick={() => pick(c)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-white/8 transition-colors"
              >
                <span className="text-lg leading-none shrink-0">{c.flag}</span>
                <span className="flex-1 text-white/90">{c.name} &ndash; {c.lang}</span>
                {c.code === selected.code && <Check size={13} className="text-[#3CB52A] shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Currency Picker ───────────────────────────────────────────────────── */

function CurrencyPicker() {
  const saved    = CURRENCIES.find(c => c.code === localStorage.getItem(LS_CURRENCY)) ?? CURRENCIES[0];
  const [selected, setSelected] = useState(saved);
  const [open,     setOpen]     = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  const pick = (c: typeof CURRENCIES[number]) => {
    setSelected(c);
    localStorage.setItem(LS_CURRENCY, c.code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-white hover:opacity-80 transition-opacity text-sm"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{selected.code} {selected.symbol}</span>
        <ChevronUp
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-0' : 'rotate-180'}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute bottom-full mb-2 right-0 w-60 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
            {CURRENCIES.map(c => (
              <button
                key={c.code}
                role="option"
                aria-selected={c.code === selected.code}
                onClick={() => pick(c)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-white/8 transition-colors"
              >
                <span className="w-8 font-mono text-white/60 shrink-0">{c.symbol}</span>
                <span className="flex-1 text-white/90">{c.name}</span>
                <span className="text-white/40 text-xs shrink-0">{c.code}</span>
                {c.code === selected.code && <Check size={13} className="text-[#3CB52A] shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Export ────────────────────────────────────────────────────────────── */

export const FooterLocale: React.FC = () => (
  <div className="flex items-center justify-between py-5">
    <CountryPicker />
    <CurrencyPicker />
  </div>
);

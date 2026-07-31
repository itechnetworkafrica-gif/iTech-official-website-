import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Facebook, Instagram, Youtube,
  MapPin, Phone, Mail, ArrowRight, ArrowUp,
  Globe, ChevronDown, ChevronUp,
} from 'lucide-react';
import { ScrollingMarquee } from './ScrollingMarquee';
import { FooterAccordion } from './FooterAccordion';
import logoNew from '@/assets/logo-new.png';

/* ─── Icon helpers ─────────────────────────────────────────────── */
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.02a8.27 8.27 0 0 0 4.83 1.55V7.12a4.85 4.85 0 0 1-1.06-.43z" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ─── Data ──────────────────────────────────────────────────────── */
const LINKS = [
  {
    title: 'Services',
    items: [
      { label: 'Web Development',    href: '/services/web-development' },
      { label: 'Mobile Apps',        href: '/services/mobile-app-development' },
      { label: 'Cloud & IT',         href: '/services/cloud-services' },
      { label: 'Cybersecurity',      href: '/services/cybersecurity' },
      { label: 'Digital Marketing',  href: '/services/digital-marketing' },
      { label: 'IT Consulting',      href: '/services/it-consulting' },
      { label: 'All Services →',     href: '/services' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About Us',      href: '/about' },
      { label: 'Our Team',      href: '/about#our-team' },
      { label: 'Portfolio',     href: '/portfolio' },
      { label: 'Blog',          href: '/blog' },
      { label: 'Partners',      href: '/partners' },
      { label: 'Careers',       href: '/careers' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help Center',       href: '/support' },
      { label: 'Client Portal',     href: '/portal' },
      { label: 'Contact Us',        href: '/contact' },
      { label: 'Pricing',           href: '/pricing' },
      { label: 'Report an Issue',   href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy',     href: '/privacy-policy' },
      { label: 'Cookies Policy',     href: '/cookies' },
      { label: 'Refund Policy',      href: '/refund-policy' },
    ],
  },
];

const SOCIALS = [
  { icon: <Facebook size={18} />,  label: 'Facebook',   href: '#' },
  { icon: <Instagram size={18} />, label: 'Instagram',   href: '#' },
  { icon: <TikTokIcon />,          label: 'TikTok',      href: '#' },
  { icon: <XIcon />,               label: 'X (Twitter)', href: '#' },
  { icon: <Youtube size={18} />,   label: 'YouTube',     href: '#' },
];

// Accordion data for mobile (kept separate from the desktop layout)
const ACCORDION_SECTIONS = LINKS.map((col) => ({
  title: col.title,
  links: col.items.map((i) => ({ label: i.label, href: i.href })),
}));

/* ─── Component ─────────────────────────────────────────────────── */
export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [locale, setLocale] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  }

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  return (
    <footer className="w-full bg-[#060E18] overflow-hidden flex flex-col">

      {/* Scrolling marquee strip */}
      <ScrollingMarquee />

      {/* Green accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#3CB52A] to-transparent opacity-60" />

      {/* ── MAIN BODY ──────────────────────────────────────────────── */}
      <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-12 pt-16 pb-12">

        {/* Desktop 5-column grid */}
        <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-12 xl:gap-16">

          {/* ── Brand column ── */}
          <div className="flex flex-col gap-6">
            <Link href="/">
              <img src={logoNew} alt="iTech Network Africa" className="h-14 object-contain object-left" />
            </Link>

            <p className="text-white/50 text-sm leading-relaxed max-w-[260px]">
              Africa's trusted technology partner — delivering web, cloud, mobile, and IT solutions that power modern organisations across the continent.
            </p>

            {/* Contact details */}
            <div className="flex flex-col gap-3">
              <a href="tel:+231770014799"
                className="flex items-center gap-2.5 text-white/55 hover:text-[#3CB52A] transition-colors text-sm group">
                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#3CB52A]/15 flex items-center justify-center shrink-0 transition-colors">
                  <Phone size={13} className="text-[#3CB52A]" />
                </div>
                +231 770 014 799
              </a>
              <a href="mailto:itechnetworkafrica@gmail.com"
                className="flex items-center gap-2.5 text-white/55 hover:text-[#3CB52A] transition-colors text-sm group">
                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#3CB52A]/15 flex items-center justify-center shrink-0 transition-colors">
                  <Mail size={13} className="text-[#3CB52A]" />
                </div>
                itechnetworkafrica@gmail.com
              </a>
              <div className="flex items-start gap-2.5 text-white/55 text-sm">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={13} className="text-[#3CB52A]" />
                </div>
                Monrovia, Liberia • West Africa
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 flex-wrap">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-[#3CB52A] text-white/60 hover:text-white flex items-center justify-center transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ── */}
          {LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="text-white text-xs font-bold tracking-[0.14em] uppercase mb-5 pb-2 border-b border-white/10">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href}
                      className="text-white/50 hover:text-[#3CB52A] transition-colors text-sm leading-snug">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile: brand + accordion */}
        <div className="lg:hidden flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <Link href="/">
              <img src={logoNew} alt="iTech Network Africa" className="h-12 object-contain object-left" />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Africa's trusted technology partner — delivering web, cloud, mobile, and IT solutions.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-[#3CB52A] text-white/60 hover:text-white flex items-center justify-center transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <FooterAccordion sections={ACCORDION_SECTIONS} />
        </div>
      </div>

      {/* ── NEWSLETTER STRIP ───────────────────────────────────────── */}
      <div className="border-t border-white/[0.07]">
        <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-12 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

            <div className="flex-1 max-w-sm">
              <p className="text-white font-bold text-sm mb-0.5">Stay ahead of the curve</p>
              <p className="text-white/45 text-xs">Get the latest insights on technology & digital transformation in Africa.</p>
            </div>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-[#3CB52A] text-sm font-semibold"
              >
                <div className="w-5 h-5 rounded-full bg-[#3CB52A]/20 flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#3CB52A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                You're subscribed — thank you!
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full lg:w-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 lg:w-64 px-4 py-2.5 rounded-xl bg-white/8 border border-white/12 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#3CB52A]/50 focus:bg-white/10 transition-all"
                />
                <button type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#3CB52A] hover:bg-[#2ea827] text-white text-sm font-bold transition-all shrink-0 shadow-[0_4px_20px_rgba(60,181,42,0.30)]">
                  Subscribe <ArrowRight size={13} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ─────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.07]">
        <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-12 py-5">

          {/* Desktop bottom bar */}
          <div className="hidden lg:flex items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-white/35 text-xs">
              &copy; {new Date().getFullYear()} iTech Network Africa. All rights reserved. Powered by Gotecx.
            </p>

            {/* Legal links */}
            <div className="flex items-center gap-5">
              {[
                { label: 'Terms', href: '/terms' },
                { label: 'Privacy', href: '/privacy-policy' },
                { label: 'Cookies', href: '/cookies' },
                { label: 'Refund Policy', href: '/refund-policy' },
              ].map((link, i, arr) => (
                <React.Fragment key={link.label}>
                  <Link href={link.href}
                    className="text-white/40 hover:text-white/75 transition-colors text-xs">
                    {link.label}
                  </Link>
                  {i < arr.length - 1 && <span className="text-white/15 text-xs">·</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Right cluster: locale + back-to-top */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocale(v => !v)}
                className="flex items-center gap-1.5 text-white/40 hover:text-white/75 transition-colors text-xs"
              >
                <Globe size={12} />
                Liberia – English
                {locale ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>

              <button
                onClick={scrollTop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 hover:border-[#3CB52A]/40 hover:bg-[#3CB52A]/10 text-white/50 hover:text-[#3CB52A] transition-all text-xs font-medium group"
              >
                Back to top
                <ArrowUp size={11} className="group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Mobile bottom bar */}
          <div className="flex lg:hidden flex-col items-center gap-3 text-center">
            <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-1.5">
              {[
                { label: 'Terms', href: '/terms' },
                { label: 'Privacy', href: '/privacy-policy' },
                { label: 'Cookies', href: '/cookies' },
              ].map((link) => (
                <Link key={link.label} href={link.href}
                  className="text-white/40 hover:text-white/75 transition-colors text-xs">
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-white/30 text-[11px]">
              &copy; {new Date().getFullYear()} iTech Network Africa. All rights reserved.
            </p>
            <button onClick={scrollTop}
              className="flex items-center gap-1 text-white/35 hover:text-white/65 transition-colors text-xs mt-1">
              Back to top <ArrowUp size={11} />
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};

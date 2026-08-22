import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeft, MessageSquare, Search, Wifi, WifiOff } from 'lucide-react';
import { SITE_URL } from '@/hooks/useSEO';
import iconLogoWhite from '@/assets/logo-icon-white.webp';

/* ─── Animation presets ─── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const HELPFUL_LINKS = [
  { label: 'Home',          href: '/'             },
  { label: 'About Us',      href: '/about'        },
  { label: 'Services',      href: '/services'     },
  { label: 'AI Solutions',  href: '/ai-solutions' },
  { label: 'Portfolio',     href: '/portfolio'    },
  { label: 'Client Portal', href: '/portal'       },
  { label: 'Blog',          href: '/blog'         },
  { label: 'Contact',       href: '/contact'      },
];

export default function NotFound() {
  const [showLinks, setShowLinks] = useState(false);

  /* ── Full SEO meta management ── */
  useEffect(() => {
    const prevTitle = document.title;

    // Page title
    document.title = '404 – Page Not Found | iTech Network Africa';

    const setMeta = (selector: string, nameAttr: string, nameVal: string, contentVal: string): HTMLMetaElement => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        document.head.appendChild(el);
      }
      el.setAttribute(nameAttr, nameVal);
      el.setAttribute('content', contentVal);
      return el;
    };

    // Standard SEO
    const robots = setMeta('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    const desc   = setMeta(
      'meta[name="description"]', 'name', 'description',
      'The page you were looking for could not be found. Return to iTech Network Africa and explore our enterprise software, AI solutions, and digital transformation services across Africa.'
    );

    // Open Graph
    const ogType  = setMeta('meta[property="og:type"]',        'property', 'og:type',        'website');
    const ogTitle = setMeta('meta[property="og:title"]',       'property', 'og:title',       '404 – Page Not Found | iTech Network Africa');
    const ogDesc  = setMeta('meta[property="og:description"]', 'property', 'og:description', 'Page not found. Visit iTech Network Africa for enterprise software, AI solutions and digital transformation services across Africa.');
     const ogImg   = setMeta('meta[property="og:image"]',       'property', 'og:image',       '/og-image.png');
    const ogUrl   = setMeta('meta[property="og:url"]',         'property', 'og:url',         `${SITE_URL}/`);

    // Twitter Card
    const twCard  = setMeta('meta[name="twitter:card"]',        'name', 'twitter:card',        'summary_large_image');
    const twTitle = setMeta('meta[name="twitter:title"]',       'name', 'twitter:title',       '404 – Page Not Found | iTech Network Africa');
    const twDesc  = setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', 'Page not found. Explore iTech Network Africa\'s enterprise technology solutions for Africa.');
     const twImg   = setMeta('meta[name="twitter:image"]',       'name', 'twitter:image',       '/og-image.png');

    // Canonical link — point to home since this URL doesn't exist
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement('link');
      canon.rel = 'canonical';
      document.head.appendChild(canon);
    }
    const prevCanon = canon.href;
    canon.href = `${SITE_URL}/`;

    return () => {
      document.title = prevTitle;
      robots.setAttribute('content', 'index, follow');
      canon!.href = prevCanon;
    };
  }, []);

  /* ── Show helpful links after 4 s ── */
  useEffect(() => {
    const id = setTimeout(() => setShowLinks(true), 4000);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex-1 flex flex-col items-center justify-center bg-[#060E18] px-6 py-16 relative overflow-hidden"
      role="main"
      aria-label="404 – Page not found"
    >

      {/* ── Background: subtle grid ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* ── Background: green radial glow ── */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.07) 0%, transparent 65%)' }}
      />

      {/* ── Floating particles ── */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute w-1.5 h-1.5 rounded-full bg-[#3CB52A]/30 pointer-events-none"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 20}%` }}
          animate={{ y: [-12, 12, -12], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}

      {/* ═══════════════════════════════
          HERO: 4 · LOGO CIRCLE · 4
      ═══════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE }}
        className="flex items-center justify-center mb-10 select-none"
        aria-hidden="true"
      >

        {/* Left "4" */}
        <motion.span
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="font-black text-white leading-none"
          style={{ fontSize: 'clamp(5.5rem, 16vw, 13rem)' }}
        >
          4
        </motion.span>

        {/* ── Round logo circle (the "0") ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="relative flex items-center justify-center mx-2 sm:mx-4 md:mx-6"
          style={{
            width:  'clamp(5.5rem, 16vw, 13rem)',
            height: 'clamp(5.5rem, 16vw, 13rem)',
          }}
        >
          {/* Outer pulse ring */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-[2px] border-[#3CB52A]/20"
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Second pulse ring */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-[2px] border-[#3CB52A]/15"
            animate={{ scale: [1, 1.22, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />

          {/* Main white border circle */}
          <div
            className="absolute inset-0 rounded-full border-[5px] sm:border-[7px] md:border-[9px] border-white"
            style={{
              boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 60px 8px rgba(255,255,255,0.06), 0 0 90px 20px rgba(60,181,42,0.08)',
            }}
          />

          {/* Dark fill background */}
          <div className="absolute inset-[8%] rounded-full bg-[#0A1929]" />

          {/* Green subtle inner glow */}
          <div
            className="absolute inset-[8%] rounded-full"
            style={{ background: 'radial-gradient(circle at 40% 35%, rgba(60,181,42,0.12) 0%, transparent 65%)' }}
          />

          {/* ── White header logo — gently floating inside the "0" ── */}
          <motion.img
            src={iconLogoWhite}
            alt="iTech Network Africa"
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 object-contain"
            style={{ width: '52%', height: '52%' }}
            loading="eager"
          />
        </motion.div>

        {/* Right "4" */}
        <motion.span
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="font-black text-white leading-none"
          style={{ fontSize: 'clamp(5.5rem, 16vw, 13rem)' }}
        >
          4
        </motion.span>
      </motion.div>

      {/* ── Heading + description ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
        className="text-center max-w-lg w-full"
      >
        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-white/45 text-base md:text-lg leading-relaxed mb-3 max-w-md mx-auto">
          The page you're looking for may have been moved, renamed, or may never have existed.
        </p>
        <p className="text-white/25 text-sm mb-10">
          Error 404 — <span className="text-[#3CB52A]/70">itechnetworkafrica.com</span>
        </p>

        {/* ── Action buttons ── */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
          role="navigation"
          aria-label="Recovery options"
        >
          {/* Return Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.4)] focus:outline-none focus:ring-2 focus:ring-[#3CB52A] focus:ring-offset-2 focus:ring-offset-[#060E18] cursor-pointer"
            aria-label="Return to iTech Network Africa home page"
          >
            <motion.span
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-2.5"
            >
              <Home size={17} aria-hidden="true" />
              Return Home
            </motion.span>
          </Link>

          {/* Go Back */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2.5 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#060E18]"
            aria-label="Go back to previous page"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Go Back
          </motion.button>

          {/* Contact Support */}
          <Link
            href="/support"
            className="inline-flex items-center gap-1.5 text-white/35 hover:text-[#3CB52A] text-sm font-medium transition-colors focus:outline-none focus:underline"
            aria-label="Contact iTech support"
          >
            <MessageSquare size={14} aria-hidden="true" />
            Contact Support
          </Link>
        </div>
      </motion.div>

      {/* ── Helpful links (appears after 4 s) ── */}
      <AnimatePresence>
        {showLinks && (
          <motion.nav
            key="helpful-links"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-16 text-center"
            aria-label="You might be looking for"
          >
            <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">
              You might be looking for
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 max-w-xl">
              {HELPFUL_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className="text-white/35 hover:text-[#3CB52A] text-sm font-medium transition-colors focus:outline-none focus:text-[#3CB52A]"
                    aria-label={`Go to ${link.label}`}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ── Bottom brand mark ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-15"
      >
        <div className="w-1 h-1 rounded-full bg-[#3CB52A]" />
        <span className="text-white/50 text-[10px] tracking-[0.2em] uppercase font-semibold whitespace-nowrap">iTech Network Africa</span>
        <div className="w-1 h-1 rounded-full bg-[#3CB52A]" />
      </div>
    </motion.div>
  );
}

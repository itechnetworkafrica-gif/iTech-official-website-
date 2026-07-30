import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeft, MessageSquare } from 'lucide-react';
import logoWhite from '@/assets/logo-icon-white.png';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const HELPFUL_LINKS = [
  { label: 'Home',          href: '/'        },
  { label: 'About Us',      href: '/about'   },
  { label: 'Services',      href: '/services'},
  { label: 'Portfolio',     href: '/portfolio'},
  { label: 'Client Portal', href: '/portal'  },
  { label: 'Blog',          href: '/blog'    },
  { label: 'Contact',       href: '/contact' },
];

export default function NotFound() {
  const [showLinks, setShowLinks] = useState(false);

  /* ── SEO meta management ── */
  useEffect(() => {
    const prevTitle = document.title;
    document.title = '404 | Page Not Found | iTech Network Africa';

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
      return el;
    };

    const robots    = setMeta('meta[name="robots"]',       'name',    'robots');
    robots.setAttribute('content', 'noindex, nofollow');

    const desc      = setMeta('meta[name="description"]',  'name',    'description');
    desc.setAttribute('content', 'The page you were looking for could not be found. Return to iTech Network Africa and explore our digital transformation services across Africa.');

    const ogTitle   = setMeta('meta[property="og:title"]', 'property','og:title');
    ogTitle.setAttribute('content', '404 – Page Not Found | iTech Network Africa');

    const ogDesc    = setMeta('meta[property="og:description"]', 'property','og:description');
    ogDesc.setAttribute('content', 'Page not found. Visit iTech Network Africa for enterprise software, AI solutions and digital transformation services.');

    const twCard    = setMeta('meta[name="twitter:card"]', 'name',    'twitter:card');
    twCard.setAttribute('content', 'summary');

    return () => {
      document.title = prevTitle;
      robots.setAttribute('content', 'index, follow');
    };
  }, []);

  /* ── Show helpful links after 5 s ── */
  useEffect(() => {
    const id = setTimeout(() => setShowLinks(true), 5000);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex-1 flex flex-col items-center justify-center bg-[#060E18] px-6 py-20 relative overflow-hidden"
      role="main"
      aria-label="404 – Page not found"
    >
      {/* ── Background texture ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      {/* Radial glow behind the 404 */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.06) 0%, transparent 70%)' }}
      />

      {/* ── 404 display ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: EASE }}
        className="flex items-center justify-center mb-12 select-none"
        aria-hidden="true"
      >
        {/* Left "4" */}
        <span
          className="font-black text-white leading-none"
          style={{ fontSize: 'clamp(7rem, 18vw, 16rem)' }}
        >
          4
        </span>

        {/* Centre "O" — white ring containing the logo */}
        <div
          className="relative flex items-center justify-center mx-1 sm:mx-2 md:mx-4"
          style={{
            width:  'clamp(7rem, 18vw, 16rem)',
            height: 'clamp(7rem, 18vw, 16rem)',
          }}
        >
          {/* Outer soft glow ring */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: '0 0 60px 12px rgba(255,255,255,0.08), 0 0 110px 30px rgba(60,181,42,0.07)',
            }}
          />
          {/* White circle border */}
          <div
            className="absolute inset-0 rounded-full border-[5px] sm:border-[7px] md:border-[9px] border-white"
            style={{ boxShadow: 'inset 0 0 24px rgba(255,255,255,0.06)' }}
          />
          {/* White fill inside circle (very subtle) */}
          <div className="absolute inset-[10%] rounded-full bg-white/[0.04]" />

          {/* Logo — gently floating */}
          <motion.img
            src={logoWhite}
            alt="iTech Network Africa logo"
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 object-contain"
            style={{ width: '46%', height: '46%' }}
            loading="eager"
          />
        </div>

        {/* Right "4" */}
        <span
          className="font-black text-white leading-none"
          style={{ fontSize: 'clamp(7rem, 18vw, 16rem)' }}
        >
          4
        </span>
      </motion.div>

      {/* ── Text + buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
        className="text-center max-w-lg w-full"
      >
        <h1 className="text-3xl md:text-[2.6rem] font-black text-white leading-tight mb-4 tracking-tight">
          Oops! Page Not Found
        </h1>
        <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto">
          The page you're looking for may have been moved, deleted, or never existed.
        </p>

        {/* Action buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-4"
          role="navigation"
          aria-label="Recovery options"
        >
          {/* Primary — Return Home */}
          <Link href="/">
            <motion.a
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2.5 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-[0_6px_24px_rgba(60,181,42,0.38)] focus:outline-none focus:ring-2 focus:ring-[#3CB52A] focus:ring-offset-2 focus:ring-offset-[#060E18] cursor-pointer"
              aria-label="Return to iTech Network Africa home page"
            >
              <Home size={17} aria-hidden="true" />
              Return Home
            </motion.a>
          </Link>

          {/* Secondary — Go Back */}
          <motion.button
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2.5 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#060E18]"
            aria-label="Go back to previous page"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Go Back
          </motion.button>

          {/* Tertiary — Contact Support */}
          <Link href="/support">
            <a
              className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/75 text-sm font-medium transition-colors focus:outline-none focus:underline"
              aria-label="Contact iTech support team"
            >
              <MessageSquare size={14} aria-hidden="true" />
              Contact Support
            </a>
          </Link>
        </div>
      </motion.div>

      {/* ── Helpful links (appears after 5 s) ── */}
      <AnimatePresence>
        {showLinks && (
          <motion.nav
            key="helpful-links"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mt-20 text-center"
            aria-label="You might be looking for"
          >
            <p className="text-white/25 text-[11px] uppercase tracking-[0.18em] font-semibold mb-5">
              You might be looking for
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {HELPFUL_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className="text-white/40 hover:text-[#3CB52A] text-sm font-medium transition-colors focus:outline-none focus:text-[#3CB52A]"
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

      {/* ── Subtle bottom brand mark ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20"
      >
        <div className="w-1 h-1 rounded-full bg-[#3CB52A]" />
        <span className="text-white/40 text-[10px] tracking-widest uppercase font-semibold">iTech Network Africa</span>
        <div className="w-1 h-1 rounded-full bg-[#3CB52A]" />
      </div>
    </motion.div>
  );
}

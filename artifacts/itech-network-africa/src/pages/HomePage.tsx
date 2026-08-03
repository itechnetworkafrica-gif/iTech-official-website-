import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import {
  ArrowRight, Globe, Shield, Zap, Users, Award, TrendingUp,
  Star, Monitor, Cloud, Brain, Code2, Wifi, ChevronRight,
  Quote, ChevronLeft, FolderOpen, Headphones
} from 'lucide-react';

/* ─── Animation helpers ─── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: EASE } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

/* ─── Floating ambient orbs ─── */
function FloatingOrbs({ count = 5, dark = false }: { count?: number; dark?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => {
        const size = 140 + (i * 53) % 200;
        const x = (i * 179) % 85;
        const y = (i * 131) % 75;
        const dur = 9 + (i * 1.4) % 9;
        const delay = (i * 0.8) % 5;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
              background: dark
                ? `radial-gradient(circle, rgba(60,181,42,${0.05 + (i % 3) * 0.025}) 0%, transparent 70%)`
                : `radial-gradient(circle, rgba(60,181,42,${0.08 + (i % 3) * 0.04}) 0%, transparent 70%)`,
              filter: 'blur(45px)',
            }}
            animate={{
              y: [0, -28 - (i % 3) * 14, 0],
              x: [0, (i % 2 === 0 ? 1 : -1) * (14 + (i % 3) * 9), 0],
              scale: [1, 1.08 + (i % 3) * 0.06, 1],
            }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
}

/* ─── Animated count-up number ─── */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─── Typewriter: types once when scrolled into view ─── */
function TypewriterText({
  text,
  className = '',
  speed = 42,
  delay = 0,
  cursor = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    let intervalId: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      intervalId = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(intervalId); setDone(true); }
      }, speed);
    }, delay);
    return () => { clearTimeout(start); clearInterval(intervalId); };
  }, [inView, text, speed, delay]);

  return (
    <span ref={ref} className={className}>
      {inView ? displayed : ''}
      {cursor && (
        <motion.span
          animate={done ? { opacity: [1, 0, 1] } : { opacity: 1 }}
          transition={done ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } : {}}
          className="inline-block w-[3px] h-[0.82em] bg-current ml-1 align-middle rounded-sm"
        />
      )}
    </span>
  );
}

/* ─── RotatingWords: continuously types & erases a word list ─── */
function RotatingWords({
  words,
  className = '',
  speed = 60,
  pause = 2200,
}: {
  words: string[];
  className?: string;
  speed?: number;
  pause?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'idle' | 'typing' | 'pausing' | 'erasing'>('idle');

  useEffect(() => {
    if (inView && phase === 'idle') setPhase('typing');
  }, [inView, phase]);

  useEffect((): (() => void) | void => {
    if (phase === 'idle') return;
    const word = words[wordIdx];
    if (phase === 'typing') {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), speed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('pausing'), pause);
      return () => clearTimeout(t);
    }
    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('erasing'), 80);
      return () => clearTimeout(t);
    }
    // phase === 'erasing'
    if (displayed.length > 0) {
      const t = setTimeout(() => setDisplayed((d) => d.slice(0, -1)), speed / 2);
      return () => clearTimeout(t);
    }
    setWordIdx((idx) => (idx + 1) % words.length);
    setPhase('typing');
  }, [phase, displayed, wordIdx, words, speed, pause]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        className="inline-block w-[3px] h-[0.78em] bg-current ml-1 align-middle rounded-sm"
      />
    </span>
  );
}

/* ─── Video reel data ─── */
const VIDEO_REELS = [
  {
    title: 'Digital Health Platform',
    category: 'Healthcare · Liberia',
    duration: '2:34',
    img: '/hero-group-excited.jpg',
    imgPos: 'center top',
    tag: 'Case Study',
    tagColor: '#3CB52A',
  },
  {
    title: 'AI Automation Suite',
    category: 'Enterprise Software',
    duration: '3:12',
    img: '/hero-woman-vr.jpg',
    imgPos: 'center center',
    tag: 'Product Demo',
    tagColor: '#3B82F6',
  },
  {
    title: 'Cloud Migration',
    category: 'Infrastructure · AWS',
    duration: '1:58',
    img: '/hero-man-denim.jpg',
    imgPos: 'center top',
    tag: 'Client Story',
    tagColor: '#8B5CF6',
  },
  {
    title: 'Security Audit Walkthrough',
    category: 'Cybersecurity',
    duration: '4:20',
    img: '/hero-man-laptop-chair.jpg',
    imgPos: 'center center',
    tag: 'Tutorial',
    tagColor: '#F59E0B',
  },
];


/* ─── Data ─── */
const SERVICES = [
  { icon: <Code2 size={28} />, title: 'Enterprise Software', desc: 'Custom ERP, CRM and business platforms engineered for global enterprise standards.' },
  { icon: <Brain size={28} />, title: 'AI & Automation', desc: 'Machine learning, intelligent automation and data-driven decision tools at scale.' },
  { icon: <Cloud size={28} />, title: 'Cloud Infrastructure', desc: 'Secure, scalable cloud solutions on AWS, Azure and Google Cloud — anywhere in the world.' },
  { icon: <Monitor size={28} />, title: 'Web & Mobile Apps', desc: 'Stunning, high-performance digital products serving users across every continent.' },
  { icon: <Shield size={28} />, title: 'Cybersecurity', desc: 'End-to-end security audits, global compliance frameworks and threat protection.' },
  { icon: <Wifi size={28} />, title: 'Network Solutions', desc: 'Enterprise networking, connectivity and managed IT infrastructure — built to global spec.' },
];

const STATS = [
  { value: '20+', num: 20, suffix: '+', label: 'Projects Delivered' },
  { value: '30+', num: 30, suffix: '+', label: 'Enterprise Clients' },
  { value: '10+', num: 10, suffix: '+', label: 'Countries Served' },
  { value: '99%', num: 99, suffix: '%', label: 'Client Satisfaction' },
];

const PROCESS = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'We listen deeply to understand your business goals, challenges and technical requirements before writing a single line of code.',
    detail: 'Stakeholder interviews · Requirements analysis · Technical audit',
  },
  {
    num: '02',
    title: 'Strategy',
    desc: 'Our architects design a tailored roadmap aligned with your timeline, budget and long-term growth objectives.',
    detail: 'Architecture design · Project roadmap · Resource planning',
  },
  {
    num: '03',
    title: 'Build',
    desc: 'Agile development with continuous delivery, rigorous quality assurance and regular stakeholder reviews.',
    detail: 'Sprint cycles · QA & testing · Stakeholder demos',
  },
  {
    num: '04',
    title: 'Launch & Support',
    desc: 'Smooth deployment, comprehensive user training and ongoing 24/7 managed support to keep you running.',
    detail: 'Go-live support · User training · 24/7 monitoring',
  },
];

const WHY = [
  { icon: <Globe size={22} />, title: 'Global Reach', desc: 'Serving clients across Africa, Europe and North America with world-class delivery standards.' },
  { icon: <Award size={22} />, title: 'Proven Track Record', desc: '20+ successful projects across government, NGO and enterprise sectors worldwide.' },
  { icon: <TrendingUp size={22} />, title: '99% Delivery Rate', desc: 'On time, on budget — every engagement backed by SLA guarantees.' },
  { icon: <Shield size={22} />, title: 'ISO-Aligned Security', desc: 'Enterprise-grade data protection and compliance baked in from day one.' },
  { icon: <Users size={22} />, title: '24/7 Support', desc: 'Dedicated account managers and round-the-clock technical assistance.' },
  { icon: <Zap size={22} />, title: 'Scalable Solutions', desc: 'Architecture that grows with you — from local startup to global enterprise.' },
];

const TESTIMONIALS = [
  { name: 'Health Tech Liberia', role: 'Digital Health Platform', quote: 'iTech Network Africa built our entire patient-provider platform from the ground up. The digital health records system and telemedicine integration have transformed how we deliver care across Liberia.', rating: 5 },
  { name: 'Galaxy International', role: 'International Business Group', quote: 'Our corporate website and CMS delivered by iTech is exactly what we envisioned — clean, responsive, and easy for our team to manage. Their design sense and attention to brand detail is outstanding.', rating: 5 },
  { name: 'B4P CODEFOUND', role: 'Women & Youth-Led NGO · Liberia & Diaspora', quote: 'iTech built us a platform that truly represents our mission. The donation integration works flawlessly and the programme pages have helped us reach thousands more young coders across Liberia and the diaspora.', rating: 5 },
  { name: 'DKS Incubation Center', role: 'Startup Incubation Institution', quote: 'The online application portal iTech developed has completely streamlined how we receive and review applicants. What used to take weeks now takes days. The team was professional from day one.', rating: 5 },
  { name: 'Lewanah LLC', role: 'E-commerce · US Market', quote: 'Running a digital brand across borders is complex, but iTech made it seamless. Our e-commerce platform handles orders, payments, and product management without a hitch. Highly recommended.', rating: 5 },
  { name: 'Agrolite', role: 'Agricultural Organisation', quote: 'Our website finally reflects the quality of work we do in the field. The blog, gallery, and outreach pages iTech built have helped us connect with farming communities in ways we never could before.', rating: 5 },
];

/* ─── Hero Slides data ─── */
const HERO_SLIDES = [
  {
    eyebrow: 'Global Tech Company · African Roots',
    headline: ['World-Class Tech,', 'Built Right Here', 'in Africa'],
    accentLine: 2,
    subtitle: 'We build enterprise software, AI and digital infrastructure that powers the world\'s most ambitious organisations — headquartered in Africa, trusted globally.',
    cta: 'Explore Services',
    href: '/services',
    ctaSecondary: 'View Our Work',
    hrefSecondary: '/portfolio',
    chips: ['Web & Mobile', 'AI Solutions', 'Cloud Infra', 'Cybersecurity'],
    img: '/hero-group-excited.jpg',
    imgAlt: 'iTech Network Africa team',
    imgPosition: 'center top',
    stats: [
      { value: '20+', label: 'Projects Delivered' },
      { value: '30+', label: 'Global Clients' },
      { value: '99%', label: 'Client Satisfaction' },
    ],
  },
  {
    eyebrow: 'AI & Digital Innovation',
    headline: ['Building Digital', 'Infrastructure', 'of Tomorrow'],
    accentLine: 1,
    subtitle: 'Machine learning, intelligent automation and data-driven platforms — engineered for global enterprises and deployed at scale.',
    cta: 'AI Solutions',
    href: '/ai',
    ctaSecondary: 'Learn More',
    hrefSecondary: '/services',
    chips: ['Machine Learning', 'Automation', 'Data Analytics', 'NLP'],
    img: '/hero-woman-vr.jpg',
    imgAlt: 'AI and technology innovation',
    imgPosition: 'center center',
    stats: [
      { value: '99%', label: 'Client Satisfaction' },
      { value: '60%', label: 'Avg. Efficiency Gain' },
      { value: '10+', label: 'Countries Served' },
    ],
  },
  {
    eyebrow: 'Global Reach · Local Expertise',
    headline: ['Trusted by', 'Governments &', 'Enterprises Worldwide'],
    accentLine: 0,
    subtitle: 'From Monrovia to London — governments, NGOs and enterprises across four continents rely on iTech to deliver on time, on budget, every time.',
    cta: 'View Portfolio',
    href: '/portfolio',
    ctaSecondary: 'About Us',
    hrefSecondary: '/about',
    chips: ['Government', 'Banking', 'NGO & INGO', 'Telecoms'],
    img: '/hero-man-denim.jpg',
    imgAlt: 'Global operations',
    imgPosition: 'center top',
    stats: [
      { value: '10+', label: 'Countries Served' },
      { value: '30+', label: 'Enterprise Clients' },
      { value: '2023', label: 'Founded' },
    ],
  },
  {
    eyebrow: 'Cybersecurity & Cloud',
    headline: ['Secure.', 'Scalable.', 'Future-Ready.'],
    accentLine: 2,
    subtitle: 'Enterprise-grade cloud architecture and end-to-end cybersecurity — built for the resilience that global organisations demand.',
    cta: 'Get a Quote',
    href: '/contact',
    ctaSecondary: 'Our Services',
    hrefSecondary: '/services',
    chips: ['AWS · Azure · GCP', 'Security Audits', 'Compliance', '24/7 Monitoring'],
    img: '/hero-group-phone.jpg',
    imgAlt: 'Cybersecurity and cloud solutions',
    imgPosition: 'center top',
    stats: [
      { value: '24/7', label: 'Managed Support' },
      { value: 'ISO', label: 'Aligned Security' },
      { value: '100%', label: 'Uptime SLA' },
    ],
  },
];

/* ─── Hero Slider ─── */
const INTERVAL_MS = 6000;

function HeroSlider() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const total = HERO_SLIDES.length;

  const goTo = useCallback((idx: number) => {
    setActive(idx);
    setProgress(0);
  }, []);
  const next = useCallback(() => goTo((active + 1) % total), [active, total, goTo]);
  const prev = useCallback(() => goTo((active - 1 + total) % total), [active, total, goTo]);

  /* auto-advance + progress bar */
  useEffect(() => {
    setProgress(0);
    const tick = 50; // ms per tick
    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += tick;
      setProgress(Math.min((elapsed / INTERVAL_MS) * 100, 100));
      if (elapsed >= INTERVAL_MS) {
        elapsed = 0;
        setActive((a) => (a + 1) % total);
        setProgress(0);
      }
    }, tick);
    return () => clearInterval(id);
  }, [active, total]);

  const slide = HERO_SLIDES[active];
  const slideNum = String(active + 1).padStart(2, '0');
  const totalNum = String(total).padStart(2, '0');

  return (
    <section className="relative bg-[#060E18]">
      {/* ── Background layer (overflow-hidden here only, so content is never clipped) ── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Full-bleed background photo */}
        <AnimatePresence mode="wait">
          <motion.img
            key={`img-${active}`}
            src={slide.img}
            alt={slide.imgAlt}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.75, ease: EASE }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: slide.imgPosition, filter: 'blur(3px)', transform: 'scale(1.04)' }}
          />
        </AnimatePresence>

        {/* Desktop: hard dark panel left, fade to transparent right */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background:
              'linear-gradient(105deg, #060E18 0%, #060E18 42%, rgba(6,14,24,0.94) 52%, rgba(6,14,24,0.55) 66%, rgba(6,14,24,0.12) 82%, transparent 100%)',
          }}
        />
        {/* bottom vignette on desktop */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none hidden md:block"
          style={{ background: 'linear-gradient(to top, rgba(6,14,24,0.85) 0%, transparent 100%)' }}
        />
        {/* Mobile gradient */}
        <div
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            background:
              'linear-gradient(to bottom, rgba(6,14,24,0.20) 0%, rgba(6,14,24,0.55) 45%, rgba(6,14,24,0.96) 72%, #060E18 100%)',
          }}
        />

        {/* Floating ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingOrbs count={5} dark />
        </div>
      </div>

      {/* ── Full layout wrapper ── */}
      <div className="relative z-20 flex flex-col" style={{ minHeight: 'clamp(700px, 96vh, 980px)' }}>

        {/* ── Top bar: slide counter + prev/next (desktop) ── */}
        <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto px-6 lg:px-16 pt-10 lg:pt-12">
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-white font-black text-2xl tabular-nums">{slideNum}</span>
            <div className="w-px h-5 bg-white/25 mx-1" />
            <span className="text-white/35 text-sm tabular-nums">{totalNum}</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Main content block ── */}
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-16 pb-0">
          <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-end">

            {/* ── Left column: text ── */}
            <div>
              {/* Eyebrow */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`eye-${active}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.32 }}
                  className="flex items-center gap-3 mb-5"
                >
                  <span className="w-8 h-px bg-[#3CB52A]" />
                  <span className="text-[#3CB52A] text-[11px] font-bold tracking-[0.20em] uppercase">
                    {slide.eyebrow}
                  </span>
                  <span className="flex items-center gap-1.5 ml-1 bg-[#3CB52A]/10 border border-[#3CB52A]/25 px-2.5 py-1 rounded-full">
                    <motion.span
                      animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] inline-block shrink-0"
                    />
                    <span className="text-[#3CB52A] text-[11px] font-bold tracking-widest uppercase">Live</span>
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Headline */}
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`h1-${active}`}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.52, ease: EASE }}
                  className="font-black italic leading-[1.0] tracking-tight mb-5"
                  style={{ fontSize: 'clamp(2.8rem, 5.2vw, 5.8rem)', textShadow: '0 4px 32px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)' }}
                >
                  {slide.headline.map((line, i) => (
                    <span
                      key={i}
                      className={`block ${i === slide.accentLine ? 'text-[#3CB52A]' : 'text-white'}`}
                    >
                      {line}
                    </span>
                  ))}
                </motion.h1>
              </AnimatePresence>

              {/* Subtitle */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${active}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.38, delay: 0.08 }}
                  className="text-white/65 text-base leading-relaxed mb-7"
                  style={{ maxWidth: '420px' }}
                >
                  {slide.subtitle}
                </motion.p>
              </AnimatePresence>

              {/* CTAs */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`cta-${active}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.14 }}
                  className="flex flex-wrap items-center gap-3 mb-7"
                >
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2ea827] text-white text-sm font-extrabold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all shadow-[0_6px_32px_rgba(60,181,42,0.55)] hover:-translate-y-0.5 active:scale-95"
                  >
                    {slide.cta}
                  </Link>
                  <Link
                    href={slide.hrefSecondary}
                    className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold px-6 py-3.5 rounded-full transition-all border border-white/20 hover:border-white/40 hover:bg-white/5"
                  >
                    {slide.ctaSecondary} <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Service chips */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`chips-${active}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.20 }}
                  className="flex flex-wrap gap-2 mb-8 lg:mb-10"
                >
                  {slide.chips.map((chip) => (
                    <span
                      key={chip}
                      className="text-xs font-semibold text-white/60 px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                    >
                      {chip}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Right column: floating info panel (desktop only) ── */}
            <div className="hidden lg:flex flex-col gap-3 pb-8 xl:pb-10">

              {/* Services grid card */}
              <motion.div
                key={`right-services-${active}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
                className="rounded-2xl p-5 border border-white/10"
                style={{ background: 'rgba(10,25,41,0.80)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-px bg-[#3CB52A]" />
                  <span className="text-[#3CB52A] text-xs font-bold tracking-[0.18em] uppercase">What We Deliver</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Code2,      label: 'Enterprise Software' },
                    { icon: Brain,      label: 'AI & Automation'     },
                    { icon: Cloud,      label: 'Cloud Infrastructure' },
                    { icon: Monitor,    label: 'Web & Mobile Apps'   },
                    { icon: Shield,     label: 'Cybersecurity'       },
                    { icon: Wifi,       label: 'Network Solutions'   },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 p-3 rounded-xl transition-colors hover:bg-white/5"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(60,181,42,0.15)' }}>
                        <Icon size={13} className="text-[#3CB52A]" />
                      </div>
                      <span className="text-white/75 text-xs font-medium leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Stats row */}
              <motion.div
                key={`right-stats-${active}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
                className="grid grid-cols-3 gap-3"
              >
                {[
                  { value: '20+',  label: 'Projects',  icon: FolderOpen },
                  { value: '30+',  label: 'Clients',   icon: Users      },
                  { value: '10+',  label: 'Countries', icon: Globe      },
                ].map(({ value, label, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-2xl p-4 text-center border border-white/10"
                    style={{ background: 'rgba(10,25,41,0.80)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)' }}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(60,181,42,0.12)' }}>
                      <Icon size={15} className="text-[#3CB52A]" />
                    </div>
                    <div className="text-2xl font-black text-white leading-none mb-1">{value}</div>
                    <div className="text-white/50 text-xs font-medium uppercase tracking-wide">{label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTA card */}
              <motion.div
                key={`right-cta-${active}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
                className="rounded-2xl p-4 border border-[#3CB52A]/25 flex items-center gap-4"
                style={{ background: 'rgba(60,181,42,0.08)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(60,181,42,0.18)' }}>
                  <Headphones size={17} className="text-[#3CB52A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white mb-0.5">Ready to start a project?</div>
                  <div className="text-white/45 text-xs">Free consultation · No commitment</div>
                </div>
                <Link
                  href="/contact"
                  className="shrink-0 flex items-center gap-1.5 bg-[#3CB52A] hover:bg-[#2ea827] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap"
                >
                  Talk to Us <ArrowRight size={11} />
                </Link>
              </motion.div>
            </div>

          </div>
        </div>

        {/* ── Stats strip + dots ── */}
        <div
          className="w-full"
          style={{ background: 'rgba(6,14,24,0.72)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-4 flex items-center justify-between gap-4 flex-wrap">

            {/* Stats */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`stats-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-6 lg:gap-10"
              >
                {slide.stats.map((s, i) => (
                  <React.Fragment key={s.label}>
                    {i > 0 && <div className="hidden sm:block w-px h-7 bg-white/15" />}
                    <div className="flex items-baseline gap-2">
                      <span className="text-white font-black text-xl lg:text-2xl tabular-nums leading-none">{s.value}</span>
                      <span className="text-white/45 text-xs hidden sm:block">{s.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Dot navigation */}
            <div className="flex items-center gap-2.5 ml-auto">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="relative flex items-center justify-center transition-all duration-300"
                  style={
                    i === active
                      ? { width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.60)', background: 'transparent' }
                      : { width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.30)' }
                  }
                >
                  {i === active && (
                    <>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'white', display: 'block' }} />
                      {/* progress ring */}
                      <svg
                        className="absolute inset-0 -rotate-90"
                        width="28" height="28" viewBox="0 0 28 28"
                        style={{ pointerEvents: 'none' }}
                      >
                        <circle
                          cx="14" cy="14" r="11"
                          fill="none"
                          stroke="#3CB52A"
                          strokeWidth="2"
                          strokeDasharray={`${2 * Math.PI * 11}`}
                          strokeDashoffset={`${2 * Math.PI * 11 * (1 - progress / 100)}`}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                        />
                      </svg>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Video Card (reel grid) ─── */
function VideoCard({ reel, index }: { reel: (typeof VIDEO_REELS)[number]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!hovered) { setProgress(0); return; }
    let p = 0;
    const id = setInterval(() => {
      p += 1.5;
      setProgress(Math.min(p, 100));
      if (p >= 100) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, [hovered]);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
      style={{ aspectRatio: '16/10' }}
    >
      {/* Background image */}
      <motion.img
        src={reel.img}
        alt={reel.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: reel.imgPos }}
        animate={{ scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      />
      {/* Cinematic scan-lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)',
          opacity: hovered ? 0.5 : 0.3,
          transition: 'opacity 0.4s',
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-black/10" />

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm"
          style={{
            background: reel.tagColor + '28',
            border: `1px solid ${reel.tagColor}55`,
            color: reel.tagColor,
          }}
        >
          {reel.tag}
        </span>
        <span className="text-white/70 text-xs font-mono bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
          {reel.duration}
        </span>
      </div>

      {/* Centre play button */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-10"
        animate={{ opacity: hovered ? 1 : 0.65 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          animate={{ scale: hovered ? 1.18 : 1 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.14)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '2px solid rgba(255,255,255,0.38)',
          }}
        >
          <div
            className="ml-1"
            style={{
              width: 0, height: 0,
              borderStyle: 'solid',
              borderWidth: '9px 0 9px 16px',
              borderColor: 'transparent transparent transparent white',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        {/* Progress bar */}
        <div className="w-full h-[3px] bg-white/18 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-none"
            style={{ background: reel.tagColor, width: `${progress}%` }}
          />
        </div>
        <span className="text-white/45 text-[10px] font-semibold uppercase tracking-widest block mb-1">
          {reel.category}
        </span>
        <h3 className="text-white font-bold text-sm leading-snug">{reel.title}</h3>
      </div>
    </motion.div>
  );
}

/* ─── Video Showcase Section (reel grid) ─── */
function VideoShowcaseSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#060E18] relative overflow-hidden">
      <FloatingOrbs count={4} dark />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(#3CB52A 1px,transparent 1px),linear-gradient(90deg,#3CB52A 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14"
        >
          <div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl font-black text-white leading-tight"
            >
              Real Projects.<br />Real Results.
            </motion.h2>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

const FEATURED_SCENES = [
  {
    label: 'Our Mission',
    title: 'Transforming Africa through world-class technology solutions',
    img: '/hero-group-excited.jpg',
    imgPos: 'center top',
    duration: 5800,
  },
  {
    label: 'Innovation',
    title: "Building Africa's digital future, one product at a time",
    img: '/hero-woman-vr.jpg',
    imgPos: 'center center',
    duration: 5200,
  },
  {
    label: 'Global Reach',
    title: 'Trusted by governments and enterprises across four continents',
    img: '/hero-man-denim.jpg',
    imgPos: 'center top',
    duration: 5500,
  },
  {
    label: 'Community',
    title: 'Empowering African talent to compete on the world stage',
    img: '/hero-event-audience.jpg',
    imgPos: 'center center',
    duration: 5000,
  },
];

/* ─── Featured Video / Story Showcase ─── */
function FeaturedVideoSection() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const total = FEATURED_SCENES.length;

  useEffect(() => {
    if (!playing) return;
    const scene = FEATURED_SCENES[active];
    setProgress(0);
    const tick = 50;
    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += tick;
      setProgress(Math.min((elapsed / scene.duration) * 100, 100));
      if (elapsed >= scene.duration) {
        setActive((a) => (a + 1) % total);
        elapsed = 0;
        setProgress(0);
      }
    }, tick);
    return () => clearInterval(id);
  }, [active, playing, total]);

  const scene = FEATURED_SCENES[active];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4 bg-[#f0fdf4] px-4 py-1.5 rounded-full">
            Our Story in Motion
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-[#060E18] mb-4">
            Building Africa's Digital Future
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-[#6B7280] text-lg max-w-xl mx-auto">
            A glimpse into who we are, how we work, and the impact we create across the continent.
          </motion.p>
        </motion.div>

        {/* Player + chapters */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-stretch"
        >

          {/* ── Main cinematic player ── */}
          <div
            className="flex-1 relative rounded-3xl overflow-hidden bg-[#060E18] shadow-2xl"
            style={{ minHeight: '380px' }}
          >
            {/* Scene image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={scene.img}
                alt={scene.title}
                initial={{ opacity: 0, scale: 1.07 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.65, ease: EASE }}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: scene.imgPos }}
              />
            </AnimatePresence>

            {/* Film-grain scan lines */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.07]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg,transparent,transparent 2px,black 2px,black 4px)',
              }}
            />
            {/* Cinematic gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

            {/* Top controls */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20">
              <span className="text-[#3CB52A] text-[10px] font-bold tracking-widest uppercase bg-[#3CB52A]/15 border border-[#3CB52A]/28 px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                <motion.span
                  animate={{ scale: [1, 1.7, 1], opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] inline-block"
                />
                {scene.label}
              </span>
              <button
                onClick={() => setPlaying((p) => !p)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: 'rgba(0,0,0,0.50)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.22)',
                }}
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? (
                  <div className="flex gap-[3px]">
                    <div className="w-[3px] h-3.5 rounded-full bg-white" />
                    <div className="w-[3px] h-3.5 rounded-full bg-white" />
                  </div>
                ) : (
                  <div
                    className="ml-0.5"
                    style={{
                      width: 0, height: 0,
                      borderStyle: 'solid',
                      borderWidth: '6px 0 6px 11px',
                      borderColor: 'transparent transparent transparent white',
                    }}
                  />
                )}
              </button>
            </div>

            {/* Centre big play button when paused */}
            <AnimatePresence>
              {!playing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.75 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute inset-0 flex items-center justify-center z-20"
                >
                  <button
                    onClick={() => setPlaying(true)}
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
                    style={{
                      background: 'rgba(255,255,255,0.16)',
                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(18px)',
                      border: '2px solid rgba(255,255,255,0.42)',
                    }}
                    aria-label="Play"
                  >
                    <div
                      className="ml-1.5"
                      style={{
                        width: 0, height: 0,
                        borderStyle: 'solid',
                        borderWidth: '13px 0 13px 22px',
                        borderColor: 'transparent transparent transparent white',
                      }}
                    />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom: title + scrubber + dots */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <AnimatePresence mode="wait">
                <motion.h3
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.38 }}
                  className="text-white font-bold text-xl leading-snug mb-4"
                >
                  {scene.title}
                </motion.h3>
              </AnimatePresence>
              {/* Scrubber */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-1 bg-white/22 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3CB52A] rounded-full"
                    style={{ width: `${progress}%`, transition: 'none' }}
                  />
                </div>
                <span className="text-white/50 text-xs font-mono whitespace-nowrap tabular-nums">
                  {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </div>
              {/* Chapter dots */}
              <div className="flex items-center gap-2">
                {FEATURED_SCENES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setActive(i); setProgress(0); setPlaying(true); }}
                    aria-label={`Scene ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === active ? 'w-6 h-2 bg-[#3CB52A]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Chapter list ── */}
          <div className="lg:w-72 flex flex-col gap-3">
            {FEATURED_SCENES.map((s, i) => (
              <motion.button
                key={s.label}
                onClick={() => { setActive(i); setProgress(0); setPlaying(true); }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className={`group relative rounded-2xl overflow-hidden flex items-stretch text-left transition-all duration-300 ${
                  i === active
                    ? 'ring-2 ring-[#3CB52A] shadow-lg shadow-[#3CB52A]/20'
                    : 'opacity-55 hover:opacity-85'
                }`}
                style={{ minHeight: '76px' }}
              >
                {/* Thumbnail */}
                <div className="w-24 shrink-0 relative overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.label}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: s.imgPos }}
                  />
                  <div className="absolute inset-0 bg-black/35" />
                  {i === active && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#3CB52A]/85">
                        {playing ? (
                          <div className="flex gap-[2px]">
                            <div className="w-[2px] h-2.5 rounded-full bg-white" />
                            <div className="w-[2px] h-2.5 rounded-full bg-white" />
                          </div>
                        ) : (
                          <div
                            className="ml-0.5"
                            style={{
                              width: 0, height: 0,
                              borderStyle: 'solid',
                              borderWidth: '4px 0 4px 8px',
                              borderColor: 'transparent transparent transparent white',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div
                  className={`flex-1 px-3 py-3 flex flex-col justify-center ${
                    i === active ? 'bg-[#060E18]' : 'bg-[#0D1F35]'
                  }`}
                >
                  <span className="text-[#3CB52A] text-[9px] font-bold uppercase tracking-widest mb-1">
                    {s.label}
                  </span>
                  <span className="text-white text-xs font-semibold leading-snug line-clamp-2">
                    {s.title}
                  </span>
                </div>
                {/* Active progress strip */}
                {i === active && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
                    <div
                      className="h-full bg-[#3CB52A]"
                      style={{ width: `${progress}%`, transition: 'none' }}
                    />
                  </div>
                )}
              </motion.button>
            ))}

            {/* CTA */}
            <Link
              href="/about"
              className="mt-2 inline-flex items-center justify-center gap-2 border-2 border-[#3CB52A]/30 text-[#3CB52A] font-bold px-5 py-3 rounded-xl transition-all hover:bg-[#3CB52A] hover:text-white hover:border-[#3CB52A] text-sm"
            >
              Our Full Story <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Testimonials Slider ─── */
function TestimonialsSlider() {
  const [active, setActive] = useState(0);
  const total = TESTIMONIALS.length;

  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="py-24 lg:py-32 bg-[#F8FFFE] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #3CB52A 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1 bg-gradient-to-r from-transparent via-[#3CB52A]/30 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4 bg-white border border-[#3CB52A]/20 px-4 py-1.5 rounded-full shadow-sm">
            Client Stories
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-[#060E18] mb-4">
            Trusted by Industry Leaders
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-[#6B7280] text-lg max-w-xl mx-auto">
            Real results, real organisations — hear directly from the teams we've partnered with around the world.
          </motion.p>
        </motion.div>

        {/* Slider */}
        <div className="relative">

          {/* ── Mobile: single card ── */}
          <div className="md:hidden overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="relative bg-white rounded-3xl p-7 border border-[#3CB52A]/25 shadow-xl"
              >
                <div className="absolute top-0 left-7 w-1 h-10 bg-[#3CB52A] rounded-b-full" />
                <Quote size={26} className="mb-4 text-[#3CB52A]" />
                <p className="text-[#374151] text-base leading-relaxed mb-6 italic">"{TESTIMONIALS[active].quote}"</p>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(TESTIMONIALS[active].rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-[#3CB52A] fill-[#3CB52A]" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f0fdf4] border border-[#3CB52A]/20 flex items-center justify-center text-[#3CB52A] font-black text-sm shrink-0">
                    {TESTIMONIALS[active].name[0]}
                  </div>
                  <div>
                    <div className="text-[#111827] font-bold text-sm">{TESTIMONIALS[active].name}</div>
                    <div className="text-[#9CA3AF] text-xs mt-0.5">{TESTIMONIALS[active].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Desktop: 3 cards ── */}
          <div className="hidden md:block overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="grid md:grid-cols-3 gap-6"
              >
                {[0, 1, 2].map((offset) => {
                  const idx = (active + offset) % total;
                  const t = TESTIMONIALS[idx];
                  const isMain = offset === 0;
                  return (
                    <div
                      key={idx}
                      className={`relative rounded-3xl p-8 border transition-all duration-300 ${
                        isMain
                          ? 'bg-white border-[#3CB52A]/25 shadow-xl shadow-[#3CB52A]/8 scale-[1.02]'
                          : 'bg-white border-[#E5E7EB] shadow-sm opacity-70 hover:opacity-90'
                      }`}
                    >
                      {isMain && (
                        <div className="absolute top-0 left-8 w-1 h-10 bg-[#3CB52A] rounded-b-full" />
                      )}
                      <Quote size={28} className={`mb-4 ${isMain ? 'text-[#3CB52A]' : 'text-[#D1D5DB]'}`} />
                      <p className="text-[#374151] text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                      <div className="flex gap-0.5 mb-4">
                        {[...Array(t.rating)].map((_, j) => (
                          <Star key={j} size={14} className="text-[#3CB52A] fill-[#3CB52A]" />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#f0fdf4] border border-[#3CB52A]/20 flex items-center justify-center text-[#3CB52A] font-black text-sm shrink-0">
                          {t.name[0]}
                        </div>
                        <div>
                          <div className="text-[#111827] font-bold text-sm">{t.name}</div>
                          <div className="text-[#9CA3AF] text-xs mt-0.5">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border-2 border-[#E5E7EB] hover:border-[#3CB52A] hover:bg-[#f0fdf4] text-[#6B7280] hover:text-[#3CB52A] flex items-center justify-center transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active ? 'w-7 h-2.5 bg-[#3CB52A]' : 'w-2.5 h-2.5 bg-[#D1D5DB] hover:bg-[#3CB52A]/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-full border-2 border-[#E5E7EB] hover:border-[#3CB52A] hover:bg-[#f0fdf4] text-[#6B7280] hover:text-[#3CB52A] flex items-center justify-center transition-all"
              aria-label="Next"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Component ─── */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      <HeroSlider />

      {/* ══════════════════════════════════════
          SERVICES OVERVIEW
      ══════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4 bg-[#f0fdf4] px-4 py-1.5 rounded-full">What We Do</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-[#060E18] mb-4">
              <RotatingWords
                words={['Enterprise Software', 'AI & Automation', 'Cloud Services', 'Cybersecurity', 'Mobile Apps', 'Network Solutions']}
                className="text-[#3CB52A]"
                speed={55}
                pause={2400}
              />
              <br />Built for the World
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              From AI-powered automation to cloud infrastructure — every solution engineered for resilience, global scale, and lasting impact.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.title}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.28, ease: EASE } }}
                className="group flex flex-col p-7 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm hover:shadow-xl hover:border-[#3CB52A]/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] text-[#3CB52A] flex items-center justify-center mb-5 group-hover:bg-[#3CB52A] group-hover:text-white transition-colors duration-300">
                  {svc.icon}
                </div>
                <h3 className="text-lg font-bold text-[#060E18] mb-2">{svc.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-6 flex-1">{svc.desc}</p>
                <Link
                  href="/services"
                  className="w-full py-2.5 bg-[#060E18] group-hover:bg-[#3CB52A] text-white text-sm font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  Learn More <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/services" className="inline-flex items-center gap-2 border-2 border-[#060E18] text-[#060E18] hover:bg-[#060E18] hover:text-white font-bold px-8 py-3.5 rounded-xl transition-all">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section id="why-choose-us" className="py-24 lg:py-32 bg-[#060E18]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
              <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4">Why iTech Network Africa</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Your Global<br />
                <TypewriterText
                  text="Technology Partner"
                  speed={48}
                  delay={500}
                  className="text-[#3CB52A]"
                />
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-white/55 text-lg leading-relaxed mb-10">
                A global technology company headquartered in Africa — combining world-class engineering standards with deep local market knowledge to deliver solutions that actually work, everywhere.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                {STATS.map(s => (
                  <div key={s.label}>
                    <div className="text-3xl font-black text-[#3CB52A]">
                      <CountUp target={s.num} suffix={s.suffix} />
                    </div>
                    <div className="text-white/45 text-xs mt-1 leading-snug">{s.label}</div>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} custom={4}>
                <Link href="/about" className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-8 py-4 rounded-xl transition-all">
                  About Our Company <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="grid sm:grid-cols-2 gap-4">
              {WHY.map((w, i) => (
                <motion.div key={w.title} custom={i} variants={fadeUp} whileHover={{ scale: 1.04, transition: { duration: 0.22 } }} className="p-6 rounded-2xl bg-white/4 border border-white/8 hover:border-[#3CB52A]/30 hover:bg-[#3CB52A]/5 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#3CB52A]/15 text-[#3CB52A] flex items-center justify-center mb-4 group-hover:bg-[#3CB52A] group-hover:text-white transition-colors">
                    {w.icon}
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1.5">{w.title}</h4>
                  <p className="text-white/45 text-xs leading-relaxed">{w.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BRAND STORY SPLIT — GoDaddy-style
      ══════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

          {/* Heading */}
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[#060E18] mb-10 leading-tight"
          >
            Global expertise,<br className="hidden sm:block" /> delivered from Africa.
          </motion.h2>

          {/* Split block */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl border border-[#E5E7EB]"
          >
            {/* Left — photo */}
            <motion.div variants={fadeUp} className="lg:w-[48%] min-h-[340px] lg:min-h-[520px] shrink-0">
              <img
                src="/hero-man-laptop-chair.jpg"
                alt="iTech Network Africa professional"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Right — card */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="flex-1 bg-[#F8F9FA] p-8 lg:p-12 flex flex-col justify-between gap-8"
            >
              {/* Quote */}
              <blockquote className="text-[#060E18] text-lg lg:text-xl font-semibold leading-relaxed border-l-4 border-[#3CB52A] pl-5">
                "A global technology company with African roots — we handle the technology so you can focus on what you do best. From AI solutions to cloud infrastructure, iTech Network Africa delivers world-class results on time, on budget, every time."
              </blockquote>

              {/* Features + preview image */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Feature list */}
                <ul className="flex-1 space-y-3.5">
                  {[
                    { icon: <Code2 size={16} />, label: 'Web Development' },
                    { icon: <Monitor size={16} />, label: 'Mobile Apps' },
                    { icon: <Brain size={16} />, label: 'AI Solutions' },
                    { icon: <Cloud size={16} />, label: 'Cloud Services' },
                    { icon: <Shield size={16} />, label: 'Cybersecurity' },
                    { icon: <Headphones size={16} />, label: 'IT Support & Managed Services' },
                  ].map(({ icon, label }) => (
                    <li key={label} className="flex items-center gap-3 text-[#374151] text-sm font-medium">
                      <span className="text-[#3CB52A] shrink-0">{icon}</span>
                      {label}
                    </li>
                  ))}
                </ul>

                {/* Small preview image */}
                <div className="sm:w-[180px] shrink-0 rounded-xl overflow-hidden border border-[#E5E7EB] shadow-md">
                  <img
                    src="/promo-online-training.jpg"
                    alt="iTech platform preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* CTA */}
              <div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-all text-sm"
                >
                  Explore Our Services <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED VIDEO / STORY SHOWCASE
      ══════════════════════════════════════ */}
      <FeaturedVideoSection />

      {/* ══════════════════════════════════════
          OUR PROCESS — classic & pro
      ══════════════════════════════════════ */}
      <section id="process" className="py-24 lg:py-36 bg-[#F8F9FA] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">

          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20"
          >
            <div className="max-w-xl">
              <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-[0.18em] uppercase mb-5">
                How We Work
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl lg:text-6xl font-black text-[#060E18] leading-[1.05] mb-0">
                A Process Built<br />for Results
              </motion.h2>
            </div>
            <motion.p variants={fadeUp} custom={2} className="text-[#6B7280] text-base lg:text-lg leading-relaxed max-w-sm lg:text-right">
              From first conversation to final launch — structured, transparent, and on target every time.
            </motion.p>
          </motion.div>

          {/* Steps — 2 × 2 grid */}
          <div className="grid md:grid-cols-2 gap-px bg-[#E5E7EB] rounded-2xl overflow-hidden border border-[#E5E7EB]">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
                className="group bg-white hover:bg-[#f0fdf4] transition-colors duration-300 p-10 lg:p-12 flex flex-col gap-6"
              >
                {/* Step number + indicator */}
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[80px] font-black leading-none text-[#060E18]/[0.06] group-hover:text-[#3CB52A]/20 transition-colors duration-300 select-none -mt-2">
                    {p.num}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-[#3CB52A]/40 group-hover:border-[#3CB52A] group-hover:bg-[#3CB52A]/10 flex items-center justify-center transition-all duration-300 shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#3CB52A]" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-black text-[#060E18] mb-3 tracking-tight">{p.title}</h3>
                  <p className="text-[#6B7280] text-[15px] leading-relaxed mb-5">{p.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.detail.split(' · ').map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold text-[#6B7280] bg-[#F0F2F5] border border-[#E5E7EB] group-hover:border-[#3CB52A]/40 group-hover:text-[#3CB52A] px-3 py-1.5 rounded-full transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA under process */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-14 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#060E18] hover:bg-[#3CB52A] text-white font-bold px-8 py-4 rounded-xl transition-all"
            >
              Start Your Project <ArrowRight size={16} />
            </Link>
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-[#3CB52A] font-semibold hover:gap-3 transition-all text-sm">
              See our work <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROMO BLOCKS — Domain & Training
      ══════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-6">

          {/* Block 1 — Domain Registration */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="group relative rounded-2xl overflow-hidden shadow-lg border border-[#E5E7EB] hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          >
            <img
              src="/promo-domain-names.png"
              alt="Great ideas deserve a great domain name — iTech Network Africa"
              className="w-full h-full object-cover block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Link
              href="/services"
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 inline-flex items-center gap-2 bg-[#3CB52A] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg"
            >
              Get Your Domain <ArrowRight size={13} />
            </Link>
          </motion.div>

          {/* Block 2 — Online Training */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="group relative rounded-2xl overflow-hidden shadow-lg border border-[#E5E7EB] hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-[#EEF2FF] to-[#F0F9FF]"
          >
            <div className="flex flex-col md:flex-row items-center gap-0 h-full">
              {/* Text side */}
              <div className="flex flex-col justify-center p-8 md:p-10 flex-1">
                <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3 bg-[#3CB52A]/10 border border-[#3CB52A]/20 px-3 py-1 rounded-full self-start">
                  Training & E-Learning
                </span>
                <h3 className="text-2xl font-black text-[#0A1929] leading-snug mb-3">
                  Learn from Africa's best technology engineers
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                  Live online sessions, recorded courses, and mentorship programmes — built for teams and individuals ready to level up.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 bg-[#0A1929] hover:bg-[#3CB52A] text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm self-start"
                >
                  Explore Training <ArrowRight size={14} />
                </Link>
              </div>
              {/* Image side */}
              <div className="w-full md:w-[55%] shrink-0 h-56 md:h-full min-h-[220px] overflow-hidden">
                <img
                  src="/promo-online-training.jpg"
                  alt="Online training and e-learning at iTech Network Africa"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          VIDEO SHOWCASE REEL
      ══════════════════════════════════════ */}
      <VideoShowcaseSection />

      {/* ══════════════════════════════════════
          TESTIMONIALS — Light mode slider
      ══════════════════════════════════════ */}
      <div id="testimonials"><TestimonialsSlider /></div>

      {/* ══════════════════════════════════════
          PROMO FLYERS — Campaign Highlights
      ══════════════════════════════════════ */}
      <section className="py-20 bg-[#060E18] relative overflow-hidden">
        {/* Decorative background grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#3CB52A 1px,transparent 1px),linear-gradient(90deg,#3CB52A 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* Ambient glows */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#3CB52A]/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-[#3CB52A]/8 blur-[80px] pointer-events-none" />
        {/* Rotating ring decorations */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full border border-[#3CB52A]/10 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full border border-[#3CB52A]/8 pointer-events-none"
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 text-[#3CB52A] text-xs font-bold tracking-widest uppercase bg-[#3CB52A]/10 border border-[#3CB52A]/20 px-4 py-1.5 rounded-full mb-4">
              <Zap size={12} /> Latest Campaigns
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              What We're Offering Right Now
            </h2>
            <p className="text-white/50 mt-3 text-base max-w-xl mx-auto">
              Stay ahead with our latest promotions — from Liberian domain names to cutting-edge technology solutions.
            </p>
          </motion.div>

          {/* Flyer grid */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch">

            {/* Flyer 1 — Domain promo */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
              className="group relative"
            >
              {/* Glow ring behind card */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#3CB52A]/40 via-[#3CB52A]/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#3CB52A]/50 transition-colors duration-500 shadow-2xl">
                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#3CB52A]/30 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-3 left-3 z-20 w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
                <motion.img
                  src="/promo-flyer-domain.jpg"
                  alt="Get your .LR Liberia Pro Domain — iTech Network Africa"
                  className="w-full object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
                {/* Bottom overlay on hover */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[#3CB52A] text-xs font-bold uppercase tracking-widest mb-1">Domain Registration</p>
                  <h3 className="text-white font-black text-lg leading-tight mb-3">Get Your .LR Liberia Domain Today</h3>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2ea020] text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors"
                  >
                    Register Now <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Flyer 2 — Technology That Powers Growth */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="group relative"
            >
              {/* Glow ring behind card */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#3CB52A]/30 via-blue-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#3CB52A]/50 transition-colors duration-500 shadow-2xl">
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#3CB52A]/30 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-3 right-3 z-20 w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
                <motion.img
                  src="/promo-flyer-tech-growth.jpg"
                  alt="Technology That Powers Growth — iTech Network Africa"
                  className="w-full object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
                {/* Bottom overlay on hover */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[#3CB52A] text-xs font-bold uppercase tracking-widest mb-1">Powered by Gotecx</p>
                  <h3 className="text-white font-black text-lg leading-tight mb-3">Technology That Powers Growth</h3>
                  <Link
                    href="/ai-solutions"
                    className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2ea020] text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors"
                  >
                    Explore Solutions <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Decorative hashtag / social row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {['#itechnetworkafrica', '#TechnologyThatPowersGrowth', '#GoTecX', '#LiberiaTech'].map((tag) => (
              <span key={tag} className="text-white/30 text-sm font-medium hover:text-[#3CB52A] transition-colors cursor-default select-none">
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section id="get-started" className="py-24 bg-[#3CB52A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <FloatingOrbs count={4} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-48 -left-48 w-[560px] h-[560px] rounded-full border border-white/10 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-36 -left-36 w-[420px] h-[420px] rounded-full border border-white/8 pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            <TypewriterText
              text="Ready to Transform Your Business?"
              speed={36}
              delay={300}
              className="text-white"
            />
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Join 30+ enterprises across Africa that trust iTech Network Africa to power their digital future.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/consultation" className="inline-flex items-center gap-2 bg-white text-[#3CB52A] font-black px-10 py-4 rounded-xl hover:bg-white/90 transition-colors shadow-xl">
              Book a Free Consultation <ArrowRight size={18} />
            </Link>
            <Link href="/portfolio" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              View Our Work
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

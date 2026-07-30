import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Globe, Shield, Zap, Users, Award, TrendingUp,
  Star, Monitor, Cloud, Brain, Code2, Wifi, ChevronRight,
  Quote, Phone, MapPin, CheckCircle2, ChevronLeft, ExternalLink
} from 'lucide-react';

/* ─── Animation helpers ─── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: EASE } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

/* ─── Data ─── */
const SERVICES = [
  { icon: <Code2 size={28} />, title: 'Enterprise Software', desc: 'Custom ERP, CRM and business platforms built for African enterprises.' },
  { icon: <Brain size={28} />, title: 'AI & Automation', desc: 'Machine learning, intelligent automation and data-driven decision tools.' },
  { icon: <Cloud size={28} />, title: 'Cloud Infrastructure', desc: 'Secure, scalable cloud solutions on AWS, Azure and Google Cloud.' },
  { icon: <Monitor size={28} />, title: 'Web & Mobile Apps', desc: 'Stunning, high-performance digital products for web and mobile.' },
  { icon: <Shield size={28} />, title: 'Cybersecurity', desc: 'End-to-end security audits, compliance and threat protection.' },
  { icon: <Wifi size={28} />, title: 'Network Solutions', desc: 'Enterprise networking, connectivity and managed IT infrastructure.' },
];

const STATS = [
  { value: '20+', label: 'Projects Delivered' },
  { value: '30+', label: 'Enterprise Clients' },
  { value: '5+', label: 'Countries Served' },
  { value: '99%', label: 'Client Satisfaction' },
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
  { icon: <Globe size={22} />, title: 'Pan-African Expertise', desc: 'Operating in 10+ African countries with deep local market insight.' },
  { icon: <Award size={22} />, title: 'Proven Track Record', desc: '500+ successful projects across government, banking and enterprise sectors.' },
  { icon: <TrendingUp size={22} />, title: '99% Delivery Rate', desc: 'On time, on budget — every engagement backed by SLA guarantees.' },
  { icon: <Shield size={22} />, title: 'ISO-Aligned Security', desc: 'Enterprise-grade data protection and compliance baked in from day one.' },
  { icon: <Users size={22} />, title: '24/7 Support', desc: 'Dedicated account managers and round-the-clock technical assistance.' },
  { icon: <Zap size={22} />, title: 'Scalable Solutions', desc: 'Architecture that grows with you — from startup to national scale.' },
];

const TESTIMONIALS = [
  { name: 'Emmanuel Togba', role: 'Director of IT, Central Bank of Liberia', quote: 'iTech Network Africa transformed our digital infrastructure. Their team delivered a secure, enterprise-grade platform that has improved our operational efficiency by 40%.', rating: 5 },
  { name: 'Fatima Kamara', role: 'CEO, West Africa Logistics Group', quote: 'Exceptional technical expertise combined with an understanding of the African business landscape. Our ERP went live on time, on budget — rare in this industry.', rating: 5 },
  { name: 'Samuel Kollie', role: 'CTO, Liberia Telecom Authority', quote: 'Their AI automation suite reduced our manual processing time by 60%. I would not trust our digital future to any other tech partner in the region.', rating: 5 },
];

/* ─── Hero Slides data ─── */
const HERO_SLIDES = [
  {
    eyebrow: "Innovating Africa's Future",
    headline: ['Transforming', 'Africa Through', 'Technology'],
    accentLine: 2,
    subtitle: 'We build world-class software, AI and digital infrastructure that powers Africa\'s most ambitious organisations forward.',
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
      { value: '30+', label: 'Enterprise Clients' },
      { value: '99%', label: 'Client Satisfaction' },
    ],
  },
  {
    eyebrow: 'AI & Digital Innovation',
    headline: ['Building Digital', 'Infrastructure', 'of Tomorrow'],
    accentLine: 1,
    subtitle: 'Machine learning, intelligent automation and data-driven platforms — engineered for African enterprises at scale.',
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
      { value: '5+', label: 'Countries Served' },
    ],
  },
  {
    eyebrow: 'Pan-African Reach',
    headline: ['Trusted by', 'Governments &', 'Enterprises'],
    accentLine: 0,
    subtitle: 'From central banks to NGOs — Africa\'s most respected institutions rely on iTech to deliver on time, on budget, every time.',
    cta: 'View Portfolio',
    href: '/portfolio',
    ctaSecondary: 'About Us',
    hrefSecondary: '/about',
    chips: ['Government', 'Banking', 'NGO & INGO', 'Telecoms'],
    img: '/hero-man-denim.jpg',
    imgAlt: 'Pan-African operations',
    imgPosition: 'center top',
    stats: [
      { value: '10+', label: 'Countries Served' },
      { value: '200+', label: 'Enterprise Clients' },
      { value: '2023', label: 'Founded' },
    ],
  },
  {
    eyebrow: 'Cybersecurity & Cloud',
    headline: ['Secure.', 'Scalable.', 'Future-Ready.'],
    accentLine: 2,
    subtitle: 'Enterprise-grade cloud architecture and end-to-end cybersecurity built for the resilience African organisations demand.',
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
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
    <section
      className="relative bg-[#060E18] overflow-hidden"
      style={{ minHeight: 'clamp(600px, 92vh, 860px)' }}
    >
      {/* ── Full-bleed background photo ── */}
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
          style={{ objectPosition: slide.imgPosition }}
        />
      </AnimatePresence>

      {/* ── Desktop: hard dark panel left, fade to transparent right ── */}
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
      {/* ── Mobile gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(6,14,24,0.20) 0%, rgba(6,14,24,0.55) 45%, rgba(6,14,24,0.96) 72%, #060E18 100%)',
        }}
      />

      {/* ── Full layout wrapper ── */}
      <div className="absolute inset-0 z-20 flex flex-col">

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
              className="font-black italic leading-[1.03] tracking-tight mb-5"
              style={{ fontSize: 'clamp(2.6rem, 6.2vw, 5.2rem)', maxWidth: '680px' }}
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
              style={{ maxWidth: '460px' }}
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
            Real results, real organisations — hear directly from the teams we've partnered with across Africa.
          </motion.p>
        </motion.div>

        {/* Slider */}
        <div className="relative">
          {/* Cards track */}
          <div className="overflow-hidden rounded-3xl">
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
              Enterprise-Grade Solutions<br />Built for Africa
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              From AI-powered automation to cloud infrastructure — every solution engineered for resilience, scale and local context.
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
      <section className="py-24 lg:py-32 bg-[#060E18]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
              <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4">Why iTech Network Africa</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Your Most Trusted<br />Tech Partner in Africa
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-white/55 text-lg leading-relaxed mb-10">
                We combine global best practices with deep African market knowledge to deliver solutions that actually work — on time, on budget, and built to last.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                {STATS.map(s => (
                  <div key={s.label}>
                    <div className="text-3xl font-black text-[#3CB52A]">{s.value}</div>
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
                <motion.div key={w.title} custom={i} variants={fadeUp} className="p-6 rounded-2xl bg-white/4 border border-white/8 hover:border-[#3CB52A]/30 hover:bg-[#3CB52A]/5 transition-all group">
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
          OUR PROCESS — classic & pro
      ══════════════════════════════════════ */}
      <section className="py-24 lg:py-36 bg-[#F8F9FA] relative overflow-hidden">
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
          TESTIMONIALS — Light mode slider
      ══════════════════════════════════════ */}
      <TestimonialsSlider />

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section className="py-24 bg-[#3CB52A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Join 200+ enterprises across Africa that trust iTech Network Africa to power their digital future.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-[#3CB52A] font-black px-10 py-4 rounded-xl hover:bg-white/90 transition-colors shadow-xl">
              Get a Free Consultation <ArrowRight size={18} />
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

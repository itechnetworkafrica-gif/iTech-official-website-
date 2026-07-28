import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowRight, CheckCircle2, Clock, Code2, Cloud, Shield, Smartphone,
  Zap, Users, Star, ChevronRight, Globe, Layers, Headphones,
  TrendingUp, Award, Target
} from 'lucide-react';

/* ─── Reusable animation variants ─── */
const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = (i: number, base = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay: base + i * 0.08, ease: [0.22, 1, 0.36, 1] },
});

/* ─── Data ─── */
const processSteps = [
  {
    num: '01',
    icon: <Target size={22} />,
    title: 'Discovery',
    desc: 'We listen, research, and deeply understand your business challenges, goals, and constraints before any work begins.',
  },
  {
    num: '02',
    icon: <Layers size={22} />,
    title: 'Strategy',
    desc: 'Our architects design a tailored technology roadmap aligned to your budget, timeline, and long-term vision.',
  },
  {
    num: '03',
    icon: <Code2 size={22} />,
    title: 'Build',
    desc: 'Agile sprints, weekly demos, and full transparency. You see progress and give feedback every step of the way.',
  },
  {
    num: '04',
    icon: <Zap size={22} />,
    title: 'Launch',
    desc: 'Rigorous QA, smooth deployment, training, and dedicated post-launch support to ensure your success.',
  },
];

const whyItems = [
  { icon: <Globe size={20} />, title: 'Pan-African Reach', desc: 'Operations across 10+ countries with local expertise and global standards.' },
  { icon: <Award size={20} />, title: 'Proven Track Record', desc: '500+ successful projects delivered across every major African industry.' },
  { icon: <Clock size={20} />, title: 'On-Time Delivery', desc: '97% on-time delivery rate — we respect your timeline and your trust.' },
  { icon: <Shield size={20} />, title: 'Enterprise Security', desc: 'Military-grade security practices baked into every system we build.' },
  { icon: <Headphones size={20} />, title: '24 / 7 Support', desc: 'Round-the-clock technical support so your operations never stop.' },
  { icon: <TrendingUp size={20} />, title: 'Scalable Solutions', desc: 'Built to grow with you — from startup to enterprise without re-building.' },
];

const stats = [
  { value: '500+', label: 'Projects Delivered' },
  { value: '200+', label: 'Enterprise Clients' },
  { value: '10+', label: 'Countries Served' },
  { value: '99%', label: 'Client Satisfaction' },
];

const testimonials = [
  {
    name: 'Emmanuel Togba',
    role: 'CEO, West Africa Finance Group',
    quote: 'iTech Network transformed our entire banking infrastructure. The new core system processes 10× the volume at a fraction of the cost. Simply world-class.',
    rating: 5,
    avatar: 'ET',
    color: '#3CB52A',
  },
  {
    name: 'Fatima Kamara',
    role: 'Director of IT, Ministry of Health',
    quote: 'Our hospital management system now serves 14 facilities with real-time data. The team delivered ahead of schedule and the support has been exceptional.',
    rating: 5,
    avatar: 'FK',
    color: '#0A7EBF',
  },
  {
    name: 'Samuel Kollie',
    role: 'Founder, ShopAfrica Marketplace',
    quote: 'From zero to a fully operational e-commerce platform in 8 weeks. The mobile app alone added 3,000 new customers in the first month.',
    rating: 5,
    avatar: 'SK',
    color: '#7C3AED',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">

      {/* ═══════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center bg-[#060E18] overflow-hidden">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#3CB52A]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-[#0A7EBF]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full relative z-10 pt-16 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
                <span className="text-[#3CB52A] text-xs font-semibold tracking-widest uppercase">
                  Innovating Africa's Future
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08 }}
                className="text-5xl md:text-6xl lg:text-[72px] font-bold text-white leading-[1.08] tracking-tight mb-6"
              >
                Transforming<br />
                Africa Through{' '}
                <span className="text-[#3CB52A] relative">
                  Technology
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                    <path d="M0 6 Q75 0 150 4 Q225 8 300 2" stroke="#3CB52A" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="text-lg text-white/60 leading-relaxed mb-10 max-w-xl"
              >
                Empowering businesses, governments and communities across Africa with
                world-class software, AI solutions, and end-to-end digital transformation.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.26 }}
                className="flex flex-wrap gap-4 mb-14"
              >
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#3CB52A] text-white font-semibold rounded-xl hover:bg-[#2da822] transition-all duration-200 shadow-[0_0_32px_rgba(60,181,42,0.35)] hover:shadow-[0_0_48px_rgba(60,181,42,0.5)]"
                >
                  Explore Services
                  <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/5 text-white font-semibold rounded-xl border border-white/15 hover:bg-white/10 hover:border-white/25 transition-all duration-200"
                >
                  Partner With Us
                </Link>
              </motion.div>

              {/* Trust line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center gap-4 text-white/40 text-sm"
              >
                <div className="flex -space-x-2">
                  {['#3CB52A','#0A7EBF','#7C3AED','#E85D04'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#060E18] flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                      {String.fromCharCode(65 + i * 5)}
                    </div>
                  ))}
                </div>
                <span>Trusted by <strong className="text-white/70">200+ enterprises</strong> across Africa</span>
              </motion.div>
            </div>

            {/* Right — stats card cluster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                {/* Main card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((s, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/8">
                        <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                        <div className="text-sm text-[#3CB52A] font-medium">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#3CB52A" className="text-[#3CB52A]" />)}
                    </div>
                    <span className="text-white/50 text-sm">4.9 / 5 average rating</span>
                  </div>
                </div>

                {/* Floating service badges */}
                <div className="absolute -top-6 -right-6 bg-[#3CB52A] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-[#3CB52A]/30">
                  🚀 Active in 10+ countries
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-[#111] px-4 py-2 rounded-full text-sm font-semibold shadow-xl">
                  ✓ ISO-Aligned Security
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ═══════════════════════════════════════
          2. OUR PROCESS
      ═══════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Label + heading */}
          <motion.div {...fadeUp} className="max-w-2xl mb-20">
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">
              How We Work
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight">
              Our Process
            </h2>
            <p className="mt-5 text-[#6B7280] text-lg leading-relaxed">
              A structured, transparent approach that keeps you informed and in control from first conversation to final delivery.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, i) => (
                <motion.div key={i} {...stagger(i)} className="relative group">
                  {/* Number + icon */}
                  <div className="flex flex-col items-start mb-6">
                    <div className="relative mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] group-hover:bg-[#3CB52A] transition-colors duration-300 flex items-center justify-center text-[#3CB52A] group-hover:text-white shadow-sm">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#3CB52A] text-white text-[10px] font-bold flex items-center justify-center">
                        {step.num.replace('0', '')}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-[#BDBDBD] uppercase">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">{step.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed text-sm">{step.desc}</p>
                  {/* Arrow (not last) */}
                  {i < processSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-12 -right-4 z-10 w-8 h-8 items-center justify-center bg-white rounded-full border border-[#E5E7EB]">
                      <ChevronRight size={14} className="text-[#9CA3AF]" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div {...fadeUp} className="mt-16 text-center">
            <Link href="/contact" className="inline-flex items-center gap-2 text-[#3CB52A] font-semibold hover:gap-3 transition-all duration-200">
              Start your project today <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. WHY CHOOSE US
      ═══════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Heading */}
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">
              The iTech Advantage
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight">
              Why Choose Us
            </h2>
            <p className="mt-5 text-[#6B7280] text-lg">
              We combine global technology standards with deep African market expertise to deliver solutions that truly work for you.
            </p>
          </motion.div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {whyItems.map((item, i) => (
              <motion.div
                key={i}
                {...stagger(i, 0.05)}
                className="group bg-white rounded-2xl p-7 border border-[#E5E7EB] hover:border-[#3CB52A]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] group-hover:bg-[#3CB52A] text-[#3CB52A] group-hover:text-white flex items-center justify-center mb-5 transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">{item.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <motion.div
            {...fadeUp}
            className="bg-[#0A1929] rounded-2xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{s.value}</div>
                <div className="text-[#3CB52A] text-sm font-semibold">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#060E18] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#3CB52A]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">
              Client Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Testimonials
            </h2>
            <p className="mt-5 text-white/50 text-lg">
              Don't take our word for it. Hear directly from the leaders who've transformed their organisations with iTech.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                {...stagger(i, 0.1)}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 hover:border-white/20 transition-all duration-300 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, si) => (
                    <Star key={si} size={14} fill="#3CB52A" className="text-[#3CB52A]" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-white/80 leading-relaxed text-sm flex-1 mb-8">
                  "{t.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View all */}
          <motion.div {...fadeUp} className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors"
            >
              View all case studies <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. GET STARTED
      ═══════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#3CB52A] relative overflow-hidden">
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10">
          <motion.div {...fadeUp}>
            <span className="inline-block text-white/70 text-xs font-bold tracking-widest uppercase mb-5">
              Ready When You Are
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Get Started Today
            </h2>
            <p className="text-white/80 text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
              Join hundreds of forward-thinking organisations across Africa that trust iTech Network Africa with their most critical technology infrastructure.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#0A1929] text-white font-bold rounded-xl hover:bg-[#060E18] transition-all duration-200 shadow-xl"
              >
                Request a Quote
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/20 text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                Book a Consultation
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm">
              {[
                { icon: <CheckCircle2 size={15} />, label: 'Free initial consultation' },
                { icon: <CheckCircle2 size={15} />, label: 'No long-term lock-in' },
                { icon: <CheckCircle2 size={15} />, label: '24/7 dedicated support' },
                { icon: <Users size={15} />, label: '200+ happy clients' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-white/80">{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

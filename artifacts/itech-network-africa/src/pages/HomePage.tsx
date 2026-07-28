import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Globe, Shield, Zap, Users, Award, TrendingUp,
  Star, Monitor, Cloud, Brain, Code2, Wifi, ChevronRight,
  Quote
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
  { value: '500+', label: 'Projects Delivered' },
  { value: '200+', label: 'Enterprise Clients' },
  { value: '10+', label: 'Countries Served' },
  { value: '99%', label: 'Client Satisfaction' },
];

const PROCESS = [
  { num: '01', title: 'Discovery', desc: 'We listen deeply to understand your business goals, challenges and technical requirements.' },
  { num: '02', title: 'Strategy', desc: 'Our architects design a tailored roadmap aligned with your timeline and budget.' },
  { num: '03', title: 'Build', desc: 'Agile development with continuous delivery, quality assurance and stakeholder reviews.' },
  { num: '04', title: 'Launch & Support', desc: 'Smooth deployment, user training and ongoing 24/7 managed support.' },
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


/* ─── Main Component ─── */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO — Background image
      ══════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')` }}
        />
        {/* Multi-layer dark overlay */}
        <div className="absolute inset-0 bg-[#060E18]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060E18]/40 via-transparent to-[#060E18]/90" />
        {/* Green glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#3CB52A]/10 blur-[100px] pointer-events-none" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-[#3CB52A]/15 border border-[#3CB52A]/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] animate-pulse" />
              <span className="text-[#3CB52A] text-xs font-semibold tracking-widest uppercase">Innovating Africa's Future</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-6xl lg:text-[72px] font-black text-white leading-[1.05] tracking-tight mb-6">
              Transforming<br />Africa Through<br />
              <span className="text-[#3CB52A] relative">
                Technology
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 8" fill="none">
                  <path d="M0 6 Q75 2 150 6 Q225 10 300 6" stroke="#3CB52A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-white/65 text-lg md:text-xl leading-relaxed max-w-lg mb-10">
              Empowering businesses, governments and communities across Africa with world-class software, AI solutions, and end-to-end digital transformation.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 mb-12">
              <Link href="/services" className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_8px_24px_rgba(60,181,42,0.4)] hover:shadow-[0_12px_32px_rgba(60,181,42,0.5)] hover:-translate-y-0.5">
                Explore Services <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-white/25 hover:border-white/50 text-white font-bold px-8 py-4 rounded-xl transition-all hover:bg-white/5">
                Partner With Us
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} custom={4} className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-[#3CB52A]" />
                <span className="text-white/55 text-sm">ISO-Aligned Security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-[#3CB52A]" />
                <span className="text-white/55 text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-[#3CB52A]" />
                <span className="text-white/55 text-sm">SLA Guaranteed</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Stats cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i + 3}
                variants={fadeUp}
                className="bg-white/8 backdrop-blur-sm border border-white/12 rounded-2xl p-6 hover:bg-white/12 hover:border-[#3CB52A]/30 transition-all"
              >
                <div className="text-4xl font-black text-white mb-1">{s.value}</div>
                <div className="text-white/55 text-sm">{s.label}</div>
              </motion.div>
            ))}
            {/* Rating badge */}
            <motion.div custom={7} variants={fadeUp} className="col-span-2 bg-[#3CB52A]/10 border border-[#3CB52A]/20 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-[#3CB52A] fill-[#3CB52A]" />)}
              </div>
              <span className="text-white/70 text-sm font-medium">4.9 / 5 average rating</span>
              <span className="text-[#3CB52A] text-xs font-bold px-3 py-1 bg-[#3CB52A]/15 rounded-full">Active in 10+ countries</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

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
            {/* Left — text */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4">Why iTech Network Africa</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Your Most Trusted<br />Tech Partner in Africa
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-white/55 text-lg leading-relaxed mb-10">
                We combine global best practices with deep African market knowledge to deliver solutions that actually work — on time, on budget, and built to last.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="grid grid-cols-3 gap-6 mb-10">
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

            {/* Right — feature cards */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="grid sm:grid-cols-2 gap-4"
            >
              {WHY.map((w, i) => (
                <motion.div
                  key={w.title}
                  custom={i}
                  variants={fadeUp}
                  className="p-6 rounded-2xl bg-white/4 border border-white/8 hover:border-[#3CB52A]/30 hover:bg-[#3CB52A]/5 transition-all group"
                >
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
          OUR PROCESS
      ══════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#F8FAFB]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4 bg-[#f0fdf4] px-4 py-1.5 rounded-full">How We Work</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-[#060E18] mb-4">
              A Process Built for Results
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-[#3CB52A]/25 z-0" />

            {PROCESS.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative z-10 bg-white rounded-3xl p-8 text-center shadow-[0_2px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-[#3CB52A] text-white font-black text-lg flex items-center justify-center mx-auto mb-6 shadow-[0_6px_20px_rgba(60,181,42,0.4)]">
                  {p.num}
                </div>
                <h3 className="text-xl font-black text-[#060E18] mb-3">{p.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#0A1929]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4">Client Stories</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white mb-4">
              Trusted by Industry Leaders
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                variants={fadeUp}
                className="bg-white/5 border border-white/8 rounded-3xl p-8 hover:border-[#3CB52A]/30 transition-colors"
              >
                <Quote size={32} className="text-[#3CB52A]/40 mb-4" />
                <p className="text-white/75 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="text-[#3CB52A] fill-[#3CB52A]" />)}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-white/45 text-xs mt-0.5">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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

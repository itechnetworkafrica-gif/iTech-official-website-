import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Target, Globe, Lightbulb, ShieldCheck, Heart,
  Users, Award, TrendingUp, ArrowRight, CheckCircle2,
  Building2, Handshake, Leaf, GraduationCap, Phone, Plus, ExternalLink, Clock
} from 'lucide-react';
import { FaLinkedinIn, FaXTwitter, FaInstagram, FaFacebook } from 'react-icons/fa6';
import { TEAM, type TeamMember } from '@/data/team';

/* ─── Shared animation helpers ─── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: EASE },
};

const stagger = (i: number, base = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay: base + i * 0.09, ease: EASE },
});

/* ─── Data ─── */
const values = [
  { icon: <Lightbulb size={22} />, title: 'Innovation', desc: 'Constantly pushing boundaries with AI and modern technology to solve complex global challenges.' },
  { icon: <ShieldCheck size={22} />, title: 'Integrity', desc: 'Radical transparency, data security, and honest partnerships in everything we do.' },
  { icon: <TrendingUp size={22} />, title: 'Impact', desc: 'We measure success by the tangible growth and efficiency gains we deliver to clients worldwide.' },
  { icon: <Heart size={22} />, title: 'Inclusivity', desc: 'Building technology that works for everyone — bridging gaps across regions, cultures and demographics.' },
  { icon: <Users size={22} />, title: 'Collaboration', desc: 'Deep partnership with clients throughout every project, not just at handoff.' },
  { icon: <Award size={22} />, title: 'Excellence', desc: 'Uncompromising standards in design, engineering, and support — every single time, everywhere.' },
];

const timeline = [
  { year: '2023', title: 'Foundation', desc: 'iTech Network Africa established in Monrovia, Liberia by Wilmot Kerkulah with a mission to bridge the digital divide across West Africa and beyond.' },
  { year: '2023', title: 'First Contracts', desc: 'Secured initial software development and IT consulting projects with local businesses, NGOs and international institutions.' },
  { year: '2024', title: 'Service Expansion', desc: 'Launched cybersecurity, cloud infrastructure, and AI solutions divisions — growing into a full-spectrum global technology company.' },
  { year: '2024', title: 'International Growth', desc: 'Extended delivery into North America and Europe, partnering with financial institutions, NGOs and government agencies across four continents.' },
  { year: '2025', title: 'Global Tech Company', desc: 'Operating in 10+ countries across Africa, Europe and North America — 20+ projects delivered for 30+ enterprise clients worldwide.' },
];

// Team data is imported from @/data/team (shared with individual profile pages)

const profileStats = [
  { value: '2023', label: 'Year Founded' },
  { value: '10+', label: 'Countries' },
  { value: '30+', label: 'Enterprise Clients' },
  { value: '20+', label: 'Projects Delivered' },
  { value: '5', label: 'Core Team' },
  { value: '99%', label: 'Client Satisfaction' },
];

const partnerLogos = [
  {
    name: 'Lumigrow Digital',
    abbr: 'LD',
    color: '#6366F1',
    url: 'https://lumigrowdigitalagency.online',
    domain: 'lumigrowdigitalagency.online',
    category: 'Digital Agency',
    desc: 'A creative digital agency delivering brand strategy, web design, and marketing solutions.',
  },
  {
    name: 'Capacity For Youth',
    abbr: 'C4Y',
    color: '#3CB52A',
    url: 'https://youthcapacity.org',
    domain: 'youthcapacity.org',
    category: 'NGO / Youth Dev',
    desc: 'Empowering young people across Africa through skills development, mentorship, and opportunity.',
  },
  {
    name: 'Health Tech Liberia',
    abbr: 'HTL',
    color: '#0D9488',
    url: 'https://healthtech-liberia.org',
    domain: 'healthtech-liberia.org',
    category: 'Health Technology',
    desc: 'Advancing healthcare delivery in Liberia through digital health infrastructure and telemedicine.',
  },
  {
    name: 'Softnet Africa',
    abbr: 'SNA',
    color: '#0A7EBF',
    url: 'https://softnetafrica.com',
    domain: 'softnetafrica.com',
    category: 'Software & Networks',
    desc: 'Pan-African technology company specialising in software development and network infrastructure.',
  },
  {
    name: 'B4P CODEFOUND',
    abbr: 'B4P',
    color: '#F59E0B',
    url: 'https://b4pcodefound.org',
    domain: 'b4pcodefound.org',
    category: 'Tech Education',
    desc: 'Women and youth-led NGO bridging the coding skills gap for Liberians in the diaspora and at home through bootcamps and scholarships.',
  },
];

const portfolioProjects = [
  {
    name: 'Health Tech Liberia',
    url: 'https://healthtech-liberia.org',
    domain: 'healthtech-liberia.org',
    desc: 'Health technology platform connecting patients and providers across Liberia with digital health records and telemedicine capabilities.',
    tags: ['Health Tech', 'Web Platform'],
    color: '#10B981',
  },
  {
    name: 'Galaxy International',
    url: 'https://galaxyinternational.com',
    domain: 'galaxyinternational.com',
    desc: 'Corporate website with a full CMS, responsive design, and brand identity system for an international business group.',
    tags: ['Corporate', 'CMS', 'Responsive'],
    color: '#6366F1',
  },
  {
    name: 'B4P CODEFOUND',
    url: 'https://b4pcodefound.org',
    domain: 'b4pcodefound.org',
    desc: 'Website for a women and youth-led NGO operating in Liberia and the diaspora — featuring program pages, impact reporting, and donation integration for coding education.',
    tags: ['NGO', 'Diaspora', 'Donation Integration'],
    color: '#F59E0B',
  },
  {
    name: 'DKS Incubation Center',
    url: 'https://dksincubationcenter.org',
    domain: 'dksincubationcenter.org',
    desc: 'Institution website with a fully integrated online application portal for startup founders and incubation program applicants.',
    tags: ['Institution', 'Application Portal'],
    color: '#3CB52A',
  },
  {
    name: 'Lewanah LLC',
    url: 'https://lewanahllc.com',
    domain: 'lewanahllc.com',
    desc: 'E-commerce platform for a US-based digital brand with instant delivery, product management, and payment processing.',
    tags: ['E-commerce', 'Digital Brand', 'US Market'],
    color: '#EF4444',
  },
  {
    name: 'Agrolite',
    url: 'https://www.agrolite.org',
    domain: 'agrolite.org',
    desc: 'Agricultural organisation website with an editorial blog, photo gallery, and outreach resources for farming communities.',
    tags: ['Agriculture', 'Blog & Gallery'],
    color: '#84CC16',
  },
];

const csrItems = [
  {
    icon: <GraduationCap size={24} />,
    title: 'Tech Education Initiative',
    desc: 'Free coding bootcamps and digital literacy programs reaching 2,000+ youth across rural communities each year.',
  },
  {
    icon: <Leaf size={24} />,
    title: 'Green Technology',
    desc: 'Committed to carbon-neutral operations by 2026 through cloud-first infrastructure and renewable energy adoption.',
  },
  {
    icon: <Handshake size={24} />,
    title: 'Women in Tech',
    desc: 'Scholarship programs and mentorship for women in STEM, with a goal of 50% female workforce by 2027.',
  },
  {
    icon: <Building2 size={24} />,
    title: 'SME Digital Support',
    desc: 'Subsidised technology packages helping small African businesses compete in the digital economy.',
  },
];

/* ─── Team card — clicking navigates to the member's individual profile page ─── */
const TeamCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  const [showSocial, setShowSocial] = useState(false);

  const socialEntries = Object.entries(member.socials).filter(([, url]) => !!url);
  const socialIcons: Record<string, React.ReactNode> = {
    linkedin:  <FaLinkedinIn size={17} />,
    twitter:   <FaXTwitter size={17} />,
    instagram: <FaInstagram size={17} />,
    facebook:  <FaFacebook size={17} />,
  };

  return (
    <motion.div
      {...stagger(index, 0.06)}
      className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#3CB52A]/40 hover:shadow-xl transition-all duration-300"
    >
      {/* Photo / Avatar */}
      <Link href={`/team/${member.slug}`}>
        <a className="block relative w-full aspect-[3/4] overflow-hidden bg-[#F0F2F5] cursor-pointer">
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-5xl font-bold"
              style={{ backgroundColor: member.color }}
            >
              {member.avatar}
            </div>
          )}

          {/* "View Profile" hover overlay */}
          <div className="absolute inset-0 bg-[#0A1929]/0 group-hover:bg-[#0A1929]/50 transition-colors duration-300 flex items-end justify-center pb-6">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-[#0A1929] text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5">
              View Profile <ArrowRight size={12} />
            </span>
          </div>

          {/* Social toggle — stops propagation so it doesn't navigate */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setShowSocial(s => !s); }}
            className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-[#3CB52A] flex items-center justify-center text-white shadow-lg hover:bg-[#2da822] transition-all duration-200 z-10"
            aria-label={showSocial ? 'Hide social links' : 'Show social links'}
          >
            <motion.span
              animate={{ rotate: showSocial ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Plus size={18} />
            </motion.span>
          </button>

          <AnimatePresence>
            {showSocial && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-3 right-16 flex flex-col gap-2 z-10"
              >
                {socialEntries.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    onClick={e => e.stopPropagation()}
                    className="w-11 h-11 rounded-full bg-[#060E18]/85 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#3CB52A] transition-colors duration-200 shadow-md"
                  >
                    {socialIcons[platform]}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </a>
      </Link>

      {/* Info footer — also navigates on click */}
      <Link href={`/team/${member.slug}`}>
        <a className="block p-6 hover:bg-[#FAFAFA] transition-colors cursor-pointer">
          <h3 className="font-bold text-[#0A0A0A] text-lg leading-tight">{member.name}</h3>
          <p className="text-sm font-semibold mt-0.5 mb-3" style={{ color: member.color }}>{member.role}</p>
          <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-3">{member.bio}</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold mt-4" style={{ color: member.color }}>
            View Full Profile <ArrowRight size={12} />
          </span>
        </a>
      </Link>
    </motion.div>
  );
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">

      {/* ═══════════════════════════════════════
          PAGE HERO
      ═══════════════════════════════════════ */}
      <section className="relative bg-[#060E18] pt-20 pb-28 overflow-hidden">
        <img
          src="/hero-event-audience.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.32 }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(6,14,24,0.97) 0%, rgba(6,14,24,0.88) 55%, rgba(6,14,24,0.65) 100%), linear-gradient(to bottom, rgba(6,14,24,0.10) 0%, rgba(6,14,24,0.70) 100%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-white/40 text-sm mb-10"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/70">About Us</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Our Company</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 max-w-4xl"
          >
            About iTech<br />
            Network <span className="text-[#3CB52A]">Africa</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="text-white/60 text-xl leading-relaxed max-w-2xl"
          >
            A global technology company founded in Monrovia, Liberia — dedicated to
            transforming businesses and communities worldwide through world-class digital innovation and enterprise solutions.
          </motion.p>

          {/* Quick anchor nav */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex flex-wrap gap-3"
          >
            {['Our Story', 'Mission & Vision', 'Our Team', 'Our Values', 'Partners', 'Careers'].map((label, i) => (
              <a
                key={i}
                href={`#${label.toLowerCase().replace(/[\s&]/g, '-').replace(/-+/g, '-')}`}
                className="px-4 py-2 text-sm text-white/60 border border-white/15 rounded-full hover:border-[#3CB52A]/50 hover:text-white transition-all"
              >
                {label}
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          1. OUR STORY
      ═══════════════════════════════════════ */}
      <section id="our-story" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Text */}
            <motion.div {...fadeUp}>
              <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight mb-6">
                From Monrovia<br />to the World
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-5">
                Founded in 2023 by visionary entrepreneur <strong className="text-[#0A0A0A]">Wilmot Kerkulah</strong> in Monrovia, Liberia,
                iTech Network Africa began with a singular mission: to bridge the technological divide in West Africa.
              </p>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-5">
                What started as a specialised IT consultancy rapidly evolved into a comprehensive technology
                powerhouse. We now serve over 5 countries across the continent, delivering enterprise-grade
                software, AI solutions, and digital infrastructure to governments, financial institutions, and
                growing businesses.
              </p>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-10">
                Every project we take on is driven by one belief: <em className="text-[#0A0A0A] not-italic font-semibold">African enterprises deserve world-class technology.</em>
              </p>

              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#E5E7EB]">
                <div>
                  <div className="text-4xl font-bold text-[#0A0A0A] mb-1">2023</div>
                  <div className="text-[#6B7280] text-sm font-medium">Year Founded</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#0A0A0A] mb-1">Liberia</div>
                  <div className="text-[#6B7280] text-sm font-medium">Headquarters</div>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <div className="space-y-0">
              {timeline.map((item, i) => (
                <motion.div key={i} {...stagger(i, 0.05)} className="flex gap-6 relative group">
                  {/* Line */}
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[1.875rem] top-10 bottom-0 w-px bg-[#E5E7EB]" />
                  )}

                  {/* Dot + year */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-[60px] h-[60px] rounded-full border-2 border-[#E5E7EB] group-hover:border-[#3CB52A] bg-white flex items-center justify-center transition-colors shrink-0 relative z-10">
                      <span className="text-xs font-bold text-[#6B7280] group-hover:text-[#3CB52A] transition-colors">{item.year}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pb-8 pt-3">
                    <h4 className="font-bold text-[#0A0A0A] mb-1">{item.title}</h4>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. MISSION & VISION
      ═══════════════════════════════════════ */}
      <section id="mission-vision" className="py-24 lg:py-32 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">Purpose & Direction</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight">Mission & Vision</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div {...stagger(0)} className="bg-[#060E18] rounded-2xl p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#3CB52A]/10 rounded-full blur-[60px]" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#3CB52A]/15 border border-[#3CB52A]/30 text-[#3CB52A] flex items-center justify-center mb-8">
                  <Target size={26} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-5">Our Mission</h3>
                <p className="text-white/65 text-lg leading-relaxed mb-8">
                  To empower businesses, governments, and communities across Africa through innovative
                  technology, AI solutions, enterprise software, and end-to-end digital transformation —
                  building scalable systems that solve real-world challenges.
                </p>
                <ul className="space-y-3">
                  {['Deliver world-class software at African scale', 'Bridge the digital divide across all sectors', 'Empower local talent and businesses'].map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                      <CheckCircle2 size={16} className="text-[#3CB52A] mt-0.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div {...stagger(1)} className="bg-[#3CB52A] rounded-2xl p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px]" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-8">
                  <Globe size={26} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-5">Our Vision</h3>
                <p className="text-white/80 text-lg leading-relaxed mb-8">
                  To be the catalyst for Africa's technological renaissance — creating a digitally
                  integrated continent where every enterprise, from startup to government, has
                  access to world-class infrastructure and software.
                </p>
                <ul className="space-y-3">
                  {["Africa's most trusted technology brand", '50+ countries by 2030', 'A fully digital African economy'].map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80 text-sm">
                      <CheckCircle2 size={16} className="text-white mt-0.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. OUR TEAM
      ═══════════════════════════════════════ */}
      <section id="our-team" className="py-24 lg:py-32 bg-white">
        <span id="leadership" className="sr-only" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">The People</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight">Meet Our Team</h2>
            <p className="mt-5 text-[#6B7280] text-lg">
              A dedicated team of professionals united by one purpose — transforming Africa through technology.
            </p>
          </motion.div>

          {/* First row: 3 cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {TEAM.slice(0, 3).map((member, i) => (
              <TeamCard key={member.slug} member={member} index={i} />
            ))}
          </div>

          {/* Second row: 2 cards centred */}
          <div className="grid sm:grid-cols-2 gap-6 lg:w-2/3 lg:mx-auto">
            {TEAM.slice(3).map((member, i) => (
              <TeamCard key={member.slug} member={member} index={i + 3} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. OUR VALUES
      ═══════════════════════════════════════ */}
      <section id="our-values" className="py-24 lg:py-32 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">What We Stand For</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight">Our Values</h2>
            <p className="mt-5 text-[#6B7280] text-lg">Six core principles that guide every decision, every product, and every partnership.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                {...stagger(i, 0.05)}
                className="group bg-white rounded-2xl p-8 border border-[#E5E7EB] hover:border-[#3CB52A]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] group-hover:bg-[#3CB52A] text-[#3CB52A] group-hover:text-white flex items-center justify-center mb-6 transition-colors duration-300">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">{v.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. COMPANY PROFILE
      ═══════════════════════════════════════ */}
      <section id="company-profile" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4">Company Profile</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight mb-6">By the Numbers</h2>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
                From a single office in Monrovia to a pan-African technology force — relentless growth, client trust, and measurable impact since 2023.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Industry', value: 'Information & Communication Technology (ICT)' },
                  { label: 'Headquarters', value: 'Monrovia, Liberia' },
                  { label: 'Founded', value: '2023' },
                  { label: 'Operations', value: 'Global — 20+ Countries' },
                  { label: 'Specialisation', value: 'Enterprise Software, AI, Cybersecurity, Cloud' },
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-4 py-4 border-b border-[#F3F4F6]">
                    <span className="text-[#9CA3AF] text-sm font-medium w-36 shrink-0">{row.label}</span>
                    <span className="text-[#0A0A0A] text-sm font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...stagger(1)} className="grid grid-cols-2 gap-5">
              {profileStats.map((s, i) => (
                <div key={i} className={`rounded-2xl p-7 ${i === 0 ? 'bg-[#3CB52A] text-white' : 'bg-[#F8F9FA] border border-[#E5E7EB]'}`}>
                  <div className={`text-4xl font-bold mb-2 ${i === 0 ? 'text-white' : 'text-[#0A0A0A]'}`}>{s.value}</div>
                  <div className={`text-sm font-semibold ${i === 0 ? 'text-white/80' : 'text-[#6B7280]'}`}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. PARTNERS — Horizontal Sliding Marquee
      ═══════════════════════════════════════ */}
      <section id="partners" className="py-24 lg:py-32 bg-[#060E18] relative overflow-hidden">
        <style>{`
          @keyframes itech-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .itech-marquee-track {
            animation: itech-marquee 28s linear infinite;
          }
          .itech-marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Subtle dot-grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #3CB52A 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* Top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[220px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(60,181,42,0.12) 0%, transparent 70%)' }} />
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(60,181,42,0.07) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          {/* Header */}
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto px-6 mb-14">
            <span className="inline-flex items-center gap-2 text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4 bg-[#3CB52A]/10 border border-[#3CB52A]/25 px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] animate-pulse" />
              Strategic Partners
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mt-2">Trusted Partners</h2>
            <p className="mt-5 text-white/50 text-lg leading-relaxed">
              We collaborate with respected organisations across technology, health, education and youth development to amplify global impact.
            </p>
          </motion.div>

          {/* ── Marquee track ── */}
          <div className="relative overflow-hidden py-3">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #060E18 0%, transparent 100%)' }} />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to left, #060E18 0%, transparent 100%)' }} />

            {/* Sliding row — logos duplicated for seamless loop */}
            <div className="itech-marquee-track flex items-center gap-6 w-max">
              {[
                { src: '/partner-lumigrow.jpg', name: 'Lumigrow Digital Agency', url: 'https://lumigrowdigitalagency.online' },
                { src: '/partner-c4y.jpg',      name: 'Capacity For Youth',       url: 'https://youthcapacity.org'           },
                { src: '/partner-htl.jpg',      name: 'Health Tech Liberia',      url: 'https://healthtech-liberia.org'      },
                { src: '/partner-b4p.jpg',      name: 'B4P CODEFOUND',            url: 'https://b4pcodefound.org'            },
                { src: '/partner-corex.jpg',    name: 'CoreX Digital Solutions',  url: 'https://corexdigital.com'            },
                // duplicated for seamless loop
                { src: '/partner-lumigrow.jpg', name: 'Lumigrow Digital Agency', url: 'https://lumigrowdigitalagency.online' },
                { src: '/partner-c4y.jpg',      name: 'Capacity For Youth',       url: 'https://youthcapacity.org'           },
                { src: '/partner-htl.jpg',      name: 'Health Tech Liberia',      url: 'https://healthtech-liberia.org'      },
                { src: '/partner-b4p.jpg',      name: 'B4P CODEFOUND',            url: 'https://b4pcodefound.org'            },
                { src: '/partner-corex.jpg',    name: 'CoreX Digital Solutions',  url: 'https://corexdigital.com'            },
              ].map((p, i) => (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={p.name}
                  className="group shrink-0 flex items-center justify-center bg-white rounded-2xl border border-white/10 hover:border-[#3CB52A]/60 hover:shadow-[0_0_28px_rgba(60,181,42,0.20)] transition-all duration-300"
                  style={{ width: 220, height: 110, padding: '18px 28px' }}
                >
                  <img
                    src={p.src}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    draggable={false}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Divider line */}
          <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-14">
            <div className="h-px bg-white/[0.06]" />
          </div>

          {/* CTA */}
          <motion.div {...fadeUp} className="text-center mt-12 px-6">
            <p className="text-white/40 text-sm mb-5">
              Want to grow together? We're open to strategic partnerships worldwide.
            </p>
            <Link
              href="/contact#partner"
              className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2ea827] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_4px_24px_rgba(60,181,42,0.35)] hover:-translate-y-0.5 active:scale-95"
            >
              Become a Partner <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          8. PORTFOLIO / SELECTED WORK
      ═══════════════════════════════════════ */}
      <section id="clients" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Header */}
          <motion.div {...fadeUp} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4 bg-[#f0fdf4] border border-[#bbf7d0] px-4 py-1.5 rounded-full">
                Selected Work
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight mt-2">
                Our Portfolio
              </h2>
              <p className="mt-5 text-[#6B7280] text-lg leading-relaxed">
                Live projects we've designed, built, and deployed — demonstrating our capacity in website design, development, security and maintenance.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A1929] hover:bg-[#3CB52A] text-white font-bold rounded-xl transition-all duration-200 shrink-0 self-start lg:self-auto shadow-md"
            >
              View All Projects <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Project cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {portfolioProjects.map((project, i) => (
              <motion.a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                {...stagger(i, 0.05)}
                className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#3CB52A]/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Brand green accent bar */}
                <div className="h-1 w-full bg-[#3CB52A] opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-7 flex flex-col flex-1">
                  {/* Domain + external icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono text-[#9CA3AF] group-hover:text-[#3CB52A] transition-colors truncate pr-2">
                      {project.domain}
                    </span>
                    <ExternalLink size={14} className="text-[#D1D5DB] group-hover:text-[#3CB52A] transition-colors shrink-0" />
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-[#0A1929] mb-3 group-hover:text-[#3CB52A] transition-colors leading-snug">
                    {project.name}
                  </h3>

                  {/* Description */}
                  <p className="text-[#6B7280] text-sm leading-relaxed flex-1 mb-5">
                    {project.desc}
                  </p>

                  {/* Tags — brand green */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-[#3CB52A]/10 text-[#3CB52A] border border-[#3CB52A]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* "Coming Soon" bid card */}
          <motion.div
            {...stagger(portfolioProjects.length, 0.05)}
            className="bg-[#060E18] rounded-2xl border border-white/8 p-7 flex flex-col sm:flex-row sm:items-center gap-6"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(60,181,42,0.15)', border: '1px solid rgba(60,181,42,0.30)' }}
            >
              <Clock size={22} className="text-[#3CB52A]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h3 className="text-white font-bold text-lg">Annual Diaspora Return Website</h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#3CB52A]/15 text-[#3CB52A] border border-[#3CB52A]/25">
                  In Progress
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Currently in bidding — a dedicated platform for the Annual Diaspora Return programme, connecting Liberians in the diaspora with opportunities back home.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          9. CAREERS
      ═══════════════════════════════════════ */}
      <section id="careers" className="py-24 lg:py-32 bg-[#060E18] relative overflow-hidden">
        <img src="/hero-women-phone.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 0.12 }} />
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center relative z-10">
          <motion.div {...fadeUp}>
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4">Join the Team</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Build Africa's Digital<br />Future With Us
            </h2>
            <p className="text-white/60 text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
              We're always looking for talented engineers, designers, and strategists who want their work to have a continent-scale impact.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/careers"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#3CB52A] text-white font-bold rounded-xl hover:bg-[#2da822] transition-all duration-200 shadow-[0_0_32px_rgba(60,181,42,0.35)]"
              >
                View Open Positions <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/15 hover:bg-white/10 transition-all"
              >
                <Phone size={17} /> Contact HR
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          10. CORPORATE SOCIAL RESPONSIBILITY
      ═══════════════════════════════════════ */}
      <section id="csr" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">Giving Back</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight">Corporate Social Responsibility</h2>
            <p className="mt-5 text-[#6B7280] text-lg">
              Technology has the power to transform lives. We invest a portion of every project into community-driven initiatives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {csrItems.map((item, i) => (
              <motion.div
                key={i}
                {...stagger(i, 0.08)}
                className="flex gap-6 bg-[#F8F9FA] rounded-2xl p-8 border border-[#E5E7EB] hover:border-[#3CB52A]/30 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] group-hover:bg-[#3CB52A] text-[#3CB52A] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">{item.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

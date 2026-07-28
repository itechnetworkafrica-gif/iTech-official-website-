import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  Target, Globe, Lightbulb, ShieldCheck, Heart, Briefcase,
  Zap, Users, Award, TrendingUp, ArrowRight, CheckCircle2,
  Building2, Handshake, Leaf, GraduationCap, Phone
} from 'lucide-react';

/* ─── Shared animation helpers ─── */
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
  transition: { duration: 0.55, delay: base + i * 0.09, ease: [0.22, 1, 0.36, 1] },
});

/* ─── Data ─── */
const values = [
  { icon: <Lightbulb size={22} />, title: 'Innovation', desc: 'Constantly pushing boundaries with AI and modern technology to solve complex African challenges.' },
  { icon: <ShieldCheck size={22} />, title: 'Integrity', desc: 'Radical transparency, data security, and honest partnerships in everything we do.' },
  { icon: <TrendingUp size={22} />, title: 'Impact', desc: 'We measure success by the tangible growth and efficiency gains we deliver to clients.' },
  { icon: <Heart size={22} />, title: 'Inclusivity', desc: 'Building technology that works for everyone — bridging gaps across regions and demographics.' },
  { icon: <Users size={22} />, title: 'Collaboration', desc: 'Deep partnership with clients throughout every project, not just at handoff.' },
  { icon: <Award size={22} />, title: 'Excellence', desc: 'Uncompromising standards in design, engineering, and support — every single time.' },
];

const timeline = [
  { year: '2018', title: 'Foundation', desc: 'iTech Network Africa established in Monrovia, Liberia by Wilmot Kerkulah as a boutique IT consultancy.' },
  { year: '2019', title: 'First Enterprise Contracts', desc: 'Secured major software development projects with leading financial institutions across West Africa.' },
  { year: '2020', title: 'Service Expansion', desc: 'Launched cybersecurity and cloud services divisions, growing the team to 25+ engineers.' },
  { year: '2021', title: 'Regional Presence', desc: 'Opened operations in 5 West African countries, serving governments and NGOs at scale.' },
  { year: '2022', title: 'Digital Marketing & Branding', desc: 'Added full-service digital marketing, multimedia, and branding capabilities.' },
  { year: '2023', title: 'AI Division Launch', desc: 'Introduced dedicated AI, machine learning, and intelligent automation solutions.' },
  { year: '2025', title: 'Pan-African Scale', desc: 'Operating in 10+ countries, 200+ enterprise clients, and 500+ projects delivered.' },
];

const team = [
  { name: 'Wilmot Kerkulah', role: 'CEO & Founder', avatar: 'WK', color: '#3CB52A' },
  { name: 'Sarah Johnson', role: 'Chief Technology Officer', avatar: 'SJ', color: '#0A7EBF' },
  { name: 'Michael Osei', role: 'Head of AI Solutions', avatar: 'MO', color: '#7C3AED' },
  { name: 'David Mensah', role: 'VP of Enterprise Software', avatar: 'DM', color: '#E85D04' },
  { name: 'Aisha Diallo', role: 'Director of Operations', avatar: 'AD', color: '#0D9488' },
  { name: 'James Koffi', role: 'Head of Cloud Infrastructure', avatar: 'JK', color: '#B45309' },
  { name: 'Grace Togba', role: 'Head of Digital Marketing', avatar: 'GT', color: '#BE185D' },
  { name: 'Emmanuel Toe', role: 'Lead UI/UX Designer', avatar: 'ET', color: '#1D4ED8' },
];

const profileStats = [
  { value: '2018', label: 'Year Founded' },
  { value: '10+', label: 'Countries' },
  { value: '200+', label: 'Enterprise Clients' },
  { value: '500+', label: 'Projects Delivered' },
  { value: '50+', label: 'Team Members' },
  { value: '99%', label: 'Client Satisfaction' },
];

const partnerLogos = [
  { name: 'Microsoft', abbr: 'MS', color: '#0078D4' },
  { name: 'Google', abbr: 'GG', color: '#4285F4' },
  { name: 'AWS', abbr: 'AWS', color: '#FF9900' },
  { name: 'Cisco', abbr: 'CSC', color: '#049FD9' },
  { name: 'Oracle', abbr: 'ORC', color: '#F80000' },
  { name: 'Huawei', abbr: 'HW', color: '#CF0A2C' },
  { name: 'Zoom', abbr: 'ZM', color: '#2D8CFF' },
  { name: 'Salesforce', abbr: 'SF', color: '#00A1E0' },
];

const clientLogos = [
  { name: 'Central Bank of Liberia', abbr: 'CBL' },
  { name: 'Ministry of Finance', abbr: 'MOF' },
  { name: 'University of Liberia', abbr: 'UL' },
  { name: 'MTN Liberia', abbr: 'MTN' },
  { name: 'Ecobank', abbr: 'ECO' },
  { name: 'UNICEF', abbr: 'UNI' },
  { name: 'WHO Liberia', abbr: 'WHO' },
  { name: 'Total Energies', abbr: 'TTE' },
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

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">

      {/* ═══════════════════════════════════════
          PAGE HERO
      ═══════════════════════════════════════ */}
      <section className="relative bg-[#060E18] pt-20 pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3CB52A]/12 rounded-full blur-[130px] pointer-events-none" />

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
            A pan-African technology powerhouse founded in Monrovia, Liberia — dedicated to
            transforming the continent through world-class digital innovation and enterprise solutions.
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
                Founded in 2018 by visionary entrepreneur <strong className="text-[#0A0A0A]">Wilmot Kerkulah</strong> in Monrovia, Liberia,
                iTech Network Africa began with a singular mission: to bridge the technological divide in West Africa.
              </p>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-5">
                What started as a specialised IT consultancy rapidly evolved into a comprehensive technology
                powerhouse. We now serve over 10 countries across the continent, delivering enterprise-grade
                software, AI solutions, and digital infrastructure to governments, financial institutions, and
                growing businesses.
              </p>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-10">
                Every project we take on is driven by one belief: <em className="text-[#0A0A0A] not-italic font-semibold">African enterprises deserve world-class technology.</em>
              </p>

              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#E5E7EB]">
                <div>
                  <div className="text-4xl font-bold text-[#0A0A0A] mb-1">2018</div>
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
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">The People</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight">Our Team</h2>
            <p className="mt-5 text-[#6B7280] text-lg">
              50+ passionate technologists, designers, and strategists united by one purpose — Africa's digital future.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={i} {...stagger(i, 0.04)} className="group text-center">
                <div className="relative mb-5 mx-auto w-full aspect-square max-w-[180px] rounded-2xl overflow-hidden bg-[#F8F9FA] flex items-center justify-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#3CB52A]/30 rounded-2xl transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-[#0A0A0A] text-sm mb-1">{member.name}</h3>
                <p className="text-[#3CB52A] text-xs font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. LEADERSHIP
      ═══════════════════════════════════════ */}
      <section id="leadership" className="py-24 lg:py-32 bg-[#060E18] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#3CB52A]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">Leadership</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">The Minds Behind iTech</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.slice(0, 3).map((leader, i) => (
              <motion.div
                key={i}
                {...stagger(i, 0.1)}
                className={`bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#3CB52A]/40 transition-all duration-300 ${i === 0 ? 'md:col-span-1 md:row-span-1' : ''}`}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-6"
                  style={{ backgroundColor: leader.color }}
                >
                  {leader.avatar}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{leader.name}</h3>
                <p className="text-[#3CB52A] text-sm font-semibold mb-4">{leader.role}</p>
                <p className="text-white/50 text-sm leading-relaxed">
                  {i === 0
                    ? 'Visionary entrepreneur dedicated to positioning Africa at the forefront of global technological innovation since 2018.'
                    : i === 1
                    ? 'Engineering leader with 15+ years in enterprise software, cloud architecture, and AI systems across three continents.'
                    : 'Pioneering AI solutions for African enterprises, building machine learning models that address continent-specific challenges.'}
                </p>
              </motion.div>
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
                From a single office in Monrovia to a pan-African technology force — seven years of relentless growth, client trust, and measurable impact.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Industry', value: 'Information & Communication Technology (ICT)' },
                  { label: 'Headquarters', value: 'Monrovia, Liberia' },
                  { label: 'Founded', value: '2018' },
                  { label: 'Operations', value: '10+ African Countries' },
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
          7. PARTNERS
      ═══════════════════════════════════════ */}
      <section id="partners" className="py-24 lg:py-32 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">Technology Alliances</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight">Our Partners</h2>
            <p className="mt-5 text-[#6B7280] text-lg">
              We partner with the world's leading technology companies to deliver best-in-class solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partnerLogos.map((p, i) => (
              <motion.div
                key={i}
                {...stagger(i, 0.04)}
                className="bg-white rounded-2xl p-8 border border-[#E5E7EB] hover:border-[#3CB52A]/30 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center group"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: p.color }}
                >
                  {p.abbr}
                </div>
                <span className="text-sm font-semibold text-[#0A0A0A] group-hover:text-[#3CB52A] transition-colors">{p.name}</span>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-10">
            <Link href="/contact#partner" className="inline-flex items-center gap-2 text-[#3CB52A] font-semibold hover:gap-3 transition-all">
              Become a Partner <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          8. CLIENTS
      ═══════════════════════════════════════ */}
      <section id="clients" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">Trusted By</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight">Our Clients</h2>
            <p className="mt-5 text-[#6B7280] text-lg">
              From central banks to international organisations — Africa's most respected institutions trust iTech.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {clientLogos.map((c, i) => (
              <motion.div
                key={i}
                {...stagger(i, 0.04)}
                className="bg-[#F8F9FA] rounded-2xl p-8 border border-[#E5E7EB] hover:border-[#3CB52A]/30 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#0A1929] flex items-center justify-center text-white text-xs font-bold">
                  {c.abbr}
                </div>
                <span className="text-xs font-semibold text-[#6B7280] group-hover:text-[#0A0A0A] transition-colors leading-tight">{c.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          9. CAREERS
      ═══════════════════════════════════════ */}
      <section id="careers" className="py-24 lg:py-32 bg-[#060E18] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
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

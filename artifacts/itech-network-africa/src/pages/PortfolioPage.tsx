import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowRight, ExternalLink, TrendingUp, Users, Globe, Award,
  Star, Quote, CheckCircle2, Monitor, Smartphone, Code2, Palette, BarChart3,
} from 'lucide-react';

/* ─── Animation helpers ─── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: EASE },
});

/* ─── Stats ─── */
const STATS = [
  { icon: <Globe size={20} />, value: '20+', label: 'Countries Served' },
  { icon: <Users size={20} />, value: '200+', label: 'Enterprise Clients' },
  { icon: <TrendingUp size={20} />, value: '500+', label: 'Projects Delivered' },
  { icon: <Award size={20} />, value: '99%', label: 'Client Satisfaction' },
];

/* ─── Featured projects ─── */
const FEATURED = [
  {
    client: 'Health Tech Liberia',
    title: 'National Patient-Provider Digital Platform',
    desc: 'End-to-end digital health platform covering patient records, appointment scheduling, telemedicine, pharmacy, and lab management — deployed across 14 counties in Liberia with HIPAA-compliant data architecture.',
    impact: ['2M+ patients served', 'EHR across 14 counties', 'Telemedicine integrated'],
    tag: 'Healthcare · Web Platform',
    gradient: 'from-emerald-600 to-teal-900',
  },
  {
    client: 'DKS Incubation Center',
    title: 'Online Application & Incubation Portal',
    desc: 'Full-stack web portal streamlining startup applications, review workflows, and mentorship tracking for one of Liberia’s leading business incubators. Reduced application-to-decision time from weeks to days.',
    impact: ['300% faster decisions', 'Fully paperless', 'Multi-stage review'],
    tag: 'Enterprise · Web App',
    gradient: 'from-blue-600 to-indigo-900',
  },
  {
    client: 'Lewanah LLC',
    title: 'Cross-Border E-Commerce Platform',
    desc: 'Scalable e-commerce platform serving the US market with multi-currency payments, automated shipping logistics, and a real-time product management dashboard — all built to handle international compliance requirements.',
    impact: ['US market ready', 'Multi-currency checkout', 'Zero downtime launch'],
    tag: 'E-Commerce · Web',
    gradient: 'from-violet-600 to-purple-900',
  },
];

/* ─── Websites ─── */
const WEBSITES = [
  {
    client: 'Galaxy International',
    title: 'Corporate Brand Website',
    desc: 'Premium corporate website with custom CMS, multi-language support, and brand-aligned UI. Designed to convey trust to international partners and investors.',
    impact: '60% more enquiries',
    stack: 'React · CMS · SEO',
    gradient: 'from-slate-600 to-slate-900',
  },
  {
    client: 'B4P CODEFOUND',
    title: 'NGO Impact & Donation Platform',
    desc: 'Mission-driven website with integrated donation gateway, programme pages, and an alumni community portal connecting young coders across Liberia and the diaspora.',
    impact: '3,000+ new donors',
    stack: 'React · Stripe · CMS',
    gradient: 'from-orange-500 to-red-800',
  },
  {
    client: 'Agrolite',
    title: 'Agricultural Organisation Website',
    desc: 'Content-rich website with blog, project gallery, and outreach forms helping Agrolite connect with farming communities and international funders.',
    impact: '5× organic traffic',
    stack: 'Vite · CMS · Analytics',
    gradient: 'from-green-600 to-emerald-900',
  },
  {
    client: 'Monrovia Law Chambers',
    title: 'Legal Practice Website',
    desc: 'Professional law firm website with practice area pages, attorney bios, case result highlights, and a secure client enquiry portal — optimised for local SEO.',
    impact: 'Page 1 Google ranking',
    stack: 'React · CMS · SEO',
    gradient: 'from-gray-700 to-gray-900',
  },
];

/* ─── Mobile Apps ─── */
const MOBILE_APPS = [
  {
    client: 'West Africa Telecom',
    title: 'Self-Service Subscriber App',
    desc: 'Native iOS and Android apps for 10M+ subscribers to manage data plans, pay bills, track usage, and access 24/7 AI-powered support — reducing call centre volume by 55%.',
    impact: '10M+ subscribers',
    platform: 'iOS & Android',
    gradient: 'from-cyan-500 to-blue-800',
  },
  {
    client: 'PaySwift',
    title: 'Cross-Border Payment Wallet',
    desc: 'Secure mobile wallet facilitating instant, low-fee remittances across 5 West African countries with multi-currency support, biometric authentication, and regulatory compliance.',
    impact: '$50M+ transacted',
    platform: 'iOS & Android',
    gradient: 'from-amber-500 to-orange-800',
  },
  {
    client: 'City Transit',
    title: 'Smart Ticketing & Bus Tracker',
    desc: 'QR-code mobile ticketing and live bus tracking for urban commuters, processing 200,000+ daily trips and reducing fare evasion by 40% within the first month of launch.',
    impact: '200K+ daily trips',
    platform: 'Android · PWA',
    gradient: 'from-lime-500 to-green-800',
  },
  {
    client: 'MedConnect Clinic',
    title: 'Patient Appointment App',
    desc: 'Mobile-first appointment booking and health records app for patients at MedConnect. Features push notifications, telemedicine video calls, and prescription refill requests.',
    impact: '80% no-show reduction',
    platform: 'iOS & Android',
    gradient: 'from-pink-500 to-rose-900',
  },
];

/* ─── Software ─── */
const SOFTWARE = [
  {
    client: 'Liberia Investment Bank',
    title: 'Core Banking Infrastructure Upgrade',
    desc: 'Complete overhaul of legacy banking systems to a modern microservices architecture — improving transaction speeds by 400% and enabling real-time cross-border transfers.',
    impact: '400% faster transactions',
    type: 'Enterprise · Fintech',
    gradient: 'from-blue-700 to-indigo-900',
  },
  {
    client: 'EcoLogistics',
    title: 'Fleet Management ERP',
    desc: 'Custom ERP integrating GPS tracking, predictive maintenance scheduling, and automated dispatch for a fleet of 500+ vehicles — cutting operational costs by 30%.',
    impact: '30% cost reduction',
    type: 'ERP · Logistics',
    gradient: 'from-gray-700 to-gray-900',
  },
  {
    client: 'RetailMax Supermarkets',
    title: 'Demand Forecasting & Inventory AI',
    desc: 'Machine learning system integrated across 80 store locations, reducing stockouts by 35% and cutting perishable waste by 28% within the first quarter of deployment.',
    impact: '35% fewer stockouts',
    type: 'AI · Retail',
    gradient: 'from-violet-600 to-purple-900',
  },
  {
    client: 'InsureTech Pro',
    title: 'Automated Claims Processing',
    desc: 'Computer vision and NLP system that automatically extracts and validates data from claims documents, compressing approval time from 7 days to under 4 hours.',
    impact: '7 days → 4 hours',
    type: 'AI · Insurance',
    gradient: 'from-emerald-600 to-teal-900',
  },
];

/* ─── Branding ─── */
const BRANDING = [
  {
    client: 'NovaPay Fintech',
    title: 'Complete Brand Identity System',
    desc: 'Logo, colour palette, typography system, brand guidelines, pitch deck template, and stationery suite for a Monrovia-based mobile payments startup ahead of their Series A raise.',
    deliverables: ['Logo & icon set', 'Brand guidelines', 'Pitch deck template'],
    gradient: 'from-rose-500 to-pink-900',
  },
  {
    client: 'Harvest Farms',
    title: 'Agricultural Brand & Packaging',
    desc: 'Farm-to-table brand identity for a Liberian produce exporter including product packaging design, export labels, and a refreshed logo system targeting international buyers.',
    deliverables: ['Product packaging', 'Export labels', 'Trade stand design'],
    gradient: 'from-amber-500 to-yellow-800',
  },
  {
    client: 'GovServices Portal',
    title: 'Government Portal UI/UX Design',
    desc: 'Accessibility-first UI/UX design for a national citizen services portal — covering information architecture, wireframes, component library, and responsive prototypes for 50+ digital services.',
    deliverables: ['UI/UX system', '50+ screen designs', 'Component library'],
    gradient: 'from-blue-600 to-indigo-900',
  },
  {
    client: 'Zenith Hospitality Group',
    title: 'Hotel & Restaurant Brand Refresh',
    desc: 'Full visual identity refresh for a West African hospitality group — covering print menus, room cards, lobby signage, social templates, and a new logo family across 3 properties.',
    deliverables: ['Visual identity', 'Print collateral', 'Digital templates'],
    gradient: 'from-slate-600 to-slate-900',
  },
];

/* ─── Digital Marketing ─── */
const DIGITAL_MARKETING = [
  {
    client: 'B4P CODEFOUND',
    title: 'NGO Growth Campaign',
    desc: "Integrated digital campaign — Facebook/Instagram ads, Google Grants, email sequences, and landing pages — that grew the NGO’s donor base by 3,000+ and doubled programme enquiries in 6 months.'",

    results: ['+3,000 new donors', '2× programme enquiries', '4.8× ROAS on paid ads'],
    gradient: 'from-orange-500 to-red-800',
  },
  {
    client: 'Lewanah LLC',
    title: 'US Market E-Commerce SEO',
    desc: 'Technical SEO audit, content strategy, and backlink campaign that took Lewanah from invisible to Page 1 Google rankings for 40+ target keywords in the US market within 5 months.',
    results: ['Page 1 for 40+ keywords', '220% organic traffic growth', '65% lower CPA'],
    gradient: 'from-cyan-500 to-blue-800',
  },
  {
    client: 'NovaPay Fintech',
    title: 'Fintech Social Media Launch',
    desc: 'Full social media strategy, creative production, and paid launch campaign for NovaPay’s market entry — growing to 25,000 followers across platforms and generating 2,000 app waitlist sign-ups.',
    results: ['25K+ social followers', '2,000 waitlist sign-ups', '12% engagement rate'],
    gradient: 'from-violet-600 to-purple-900',
  },
  {
    client: 'Zenith Hospitality Group',
    title: 'Hotel Direct Booking Campaign',
    desc: 'Google Ads, Meta Retargeting, and email automation campaign shifting reservations away from OTAs. Increased direct bookings by 48% and reduced OTA commission spend by $80K annually.',
    results: ['48% more direct bookings', '$80K commission saved', '3.2× Google Ads ROAS'],
    gradient: 'from-emerald-600 to-teal-900',
  },
];

/* ─── Case Studies ─── */
const CASE_STUDIES = [
  {
    client: 'Health Tech Liberia',
    sector: 'Digital Health',
    challenge: 'The health system relied entirely on paper records scattered across 14 counties, making patient tracking, referrals, and disease surveillance nearly impossible.',
    solution: 'We designed and built a centralised EHR platform with offline-sync capability for low-connectivity areas, a telemedicine module, appointment scheduling, pharmacy management, and a public health dashboard.',
    outcome: [
      '2 million+ patient records digitised',
      '40% reduction in duplicate prescriptions',
      'Real-time disease surveillance across all counties',
      'ISO 27001-aligned security architecture',
    ],
    duration: '14 months',
    team: '8 engineers',
    gradient: 'from-emerald-600 to-teal-900',
  },
  {
    client: 'West Africa Telecom',
    sector: 'Telecommunications',
    challenge: '10 million subscribers were forced to visit physical stores or call an overloaded contact centre for account queries, top-ups, and plan changes — leading to long queues and poor satisfaction scores.',
    solution: 'Native iOS and Android self-service apps with full account management, AI chatbot, real-time data usage display, bill payment via mobile money, and escalation to human agents.',
    outcome: [
      '55% reduction in call centre volume',
      '4.7★ average app store rating',
      '₦2.1B saved in operational costs Year 1',
      'Launched on time in 9 months',
    ],
    duration: '9 months',
    team: '12 engineers',
    gradient: 'from-cyan-500 to-blue-800',
  },
  {
    client: 'GovServices Portal',
    sector: 'Government & Public Sector',
    challenge: 'Citizens waited up to 14 working days and made multiple in-person visits to access 50+ government services — from business registration to birth certificates — all processed manually.',
    solution: 'Secure digital workflow platform with identity verification, document upload, real-time status tracking, payment integration, and a back-office review dashboard for civil servants.',
    outcome: [
      '50+ services fully digitised',
      'Average processing time: 48 hours (down from 14 days)',
      '300,000+ transactions processed in Year 1',
      'Zero data breaches since launch',
    ],
    duration: '18 months',
    team: '15 engineers',
    gradient: 'from-blue-700 to-indigo-900',
  },
];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  {
    name: 'Health Tech Liberia',
    role: 'Digital Health Platform',
    quote: 'iTech Network Africa built our entire patient-provider platform from the ground up. The digital health records system and telemedicine integration have transformed how we deliver care across Liberia.',
    rating: 5,
  },
  {
    name: 'Galaxy International',
    role: 'International Business Group',
    quote: 'Our corporate website and CMS delivered by iTech is exactly what we envisioned — clean, responsive, and easy for our team to manage. Their design sense and attention to brand detail is outstanding.',
    rating: 5,
  },
  {
    name: 'B4P CODEFOUND',
    role: 'Women & Youth-Led NGO · Liberia & Diaspora',
    quote: 'iTech built us a platform that truly represents our mission. The donation integration works flawlessly and the programme pages have helped us reach thousands more young coders across Liberia and the diaspora.',
    rating: 5,
  },
  {
    name: 'DKS Incubation Center',
    role: 'Startup Incubation Institution',
    quote: 'The online application portal iTech developed has completely streamlined how we receive and review applicants. What used to take weeks now takes days. The team was professional from day one.',
    rating: 5,
  },
  {
    name: 'Lewanah LLC',
    role: 'E-Commerce · US Market',
    quote: 'Running a digital brand across borders is complex, but iTech made it seamless. Our e-commerce platform handles orders, payments, and product management without a hitch. Highly recommended.',
    rating: 5,
  },
  {
    name: 'Agrolite',
    role: 'Agricultural Organisation',
    quote: 'Our website finally reflects the quality of work we do in the field. The blog, gallery, and outreach pages iTech built have helped us connect with farming communities in ways we never could before.',
    rating: 5,
  },
];

/* ─── Section header ─── */
function SectionHeader({ eyebrow, title, subtitle, light = false }: { eyebrow: string; title: React.ReactNode; subtitle?: string; light?: boolean }) {
  return (
    <motion.div {...fadeUp()} className="mb-14">
      <span className={`text-xs font-bold tracking-widest uppercase block mb-3 ${light ? 'text-[#3CB52A]' : 'text-[#3CB52A]'}`}>
        {eyebrow}
      </span>
      <h2 className={`text-4xl md:text-5xl font-black leading-tight mb-4 ${light ? 'text-white' : 'text-[#0A0A0A]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl leading-relaxed ${light ? 'text-white/55' : 'text-[#6B7280]'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* ─── Category section divider ─── */
function CategoryLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="w-10 h-10 rounded-xl bg-[#3CB52A]/10 border border-[#3CB52A]/20 text-[#3CB52A] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="text-xl font-black text-[#0A0A0A]">{label}</span>
      <div className="flex-1 h-px bg-[#E5E7EB]" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function PortfolioPage() {
  return (
    <div className="flex flex-col w-full bg-[#F8F9FA] min-h-screen">

      {/* ─── HERO ─── */}
      <section className="relative bg-[#060E18] pt-20 pb-28 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div aria-hidden="true" className="absolute right-0 top-0 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.07) 0%, transparent 65%)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-white/40 text-sm mb-12">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/70">Portfolio</span>
          </motion.div>

          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Our Work Across Africa & Beyond</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              A Portfolio<br /><span className="text-[#3CB52A]">Built on Impact</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
              className="text-white/55 text-xl leading-relaxed mb-10 max-w-2xl">
              From national health platforms to mobile payment wallets and government digitisation — every project we deliver moves Africa forward.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }}
              className="flex flex-wrap gap-4">
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.4)]">
                Start Your Project <ArrowRight size={17} />
              </Link>
              <a href="#case-studies"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5">
                View Case Studies
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-[#0A1929] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                className="py-8 px-6 flex flex-col items-center text-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#3CB52A]/15 text-[#3CB52A] flex items-center justify-center">{s.icon}</div>
                <div className="text-3xl font-black text-white">{s.value}</div>
                <div className="text-white/40 text-xs font-semibold uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUICK NAV ─── */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-[100px] z-30 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {[
              { href: '#featured', label: 'Featured' },
              { href: '#websites', label: 'Websites' },
              { href: '#mobile-apps', label: 'Mobile Apps' },
              { href: '#software', label: 'Software' },
              { href: '#branding', label: 'Branding' },
              { href: '#digital-marketing', label: 'Digital Marketing' },
              { href: '#case-studies', label: 'Case Studies' },
              { href: '#testimonials', label: 'Testimonials' },
            ].map(item => (
              <a key={item.href} href={item.href}
                className="px-4 py-2 text-sm font-semibold text-[#6B7280] hover:text-[#3CB52A] hover:bg-[#f0fdf4] rounded-lg transition-all whitespace-nowrap">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-20 space-y-24">

        {/* ─── FEATURED ─── */}
        <section id="featured">
          <SectionHeader eyebrow="Flagship Projects" title={<>Featured<br />Work</>}
            subtitle="Our most impactful engagements — complex, large-scale projects that defined industries." />
          <div className="grid lg:grid-cols-3 gap-7">
            {FEATURED.map((p, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}
                className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                <div className={`h-52 bg-gradient-to-br ${p.gradient} relative p-6 flex flex-col justify-end`}>
                  <div aria-hidden="true" className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <span className="relative z-10 text-[10px] font-bold text-white/70 uppercase tracking-widest bg-white/10 border border-white/20 px-3 py-1 rounded-full w-fit mb-3">
                    {p.tag}
                  </span>
                  <div className="relative z-10 flex flex-wrap gap-2">
                    {p.impact.map((imp, j) => (
                      <span key={j} className="text-xs font-bold text-white bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/15">
                        {imp}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[#3CB52A] font-bold text-xs uppercase tracking-wider mb-2">{p.client}</div>
                  <h3 className="text-lg font-black text-[#0A0A0A] mb-3 leading-snug">{p.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed flex-grow mb-6">{p.desc}</p>
                  <Link href="/contact"
                    className="flex items-center gap-2 text-[#0A1929] font-semibold text-sm group-hover:text-[#3CB52A] transition-colors w-fit mt-auto">
                    Discuss a Similar Project <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── WEBSITES ─── */}
        <section id="websites">
          <CategoryLabel icon={<Monitor size={18} />} label="Websites" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WEBSITES.map((p, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                <div className={`h-32 bg-gradient-to-br ${p.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-white/80 bg-white/15 border border-white/20 px-2.5 py-1 rounded-full">
                    {p.stack}
                  </span>
                  <span className="absolute bottom-3 left-3 text-xs font-black text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/15">
                    {p.impact}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-[#3CB52A] font-bold text-[10px] uppercase tracking-wider mb-1.5">{p.client}</div>
                  <h3 className="text-base font-black text-[#0A0A0A] mb-2 leading-snug">{p.title}</h3>
                  <p className="text-[#6B7280] text-xs leading-relaxed flex-grow mb-4">{p.desc}</p>
                  <Link href="/contact" className="text-[#3CB52A] text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-auto w-fit">
                    Get a Quote <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── MOBILE APPS ─── */}
        <section id="mobile-apps">
          <CategoryLabel icon={<Smartphone size={18} />} label="Mobile Apps" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOBILE_APPS.map((p, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                <div className={`h-32 bg-gradient-to-br ${p.gradient} relative flex items-end p-4`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative z-10 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{p.platform}</span>
                    <span className="text-xs font-black text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/15 w-fit">
                      {p.impact}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-[#3CB52A] font-bold text-[10px] uppercase tracking-wider mb-1.5">{p.client}</div>
                  <h3 className="text-base font-black text-[#0A0A0A] mb-2 leading-snug">{p.title}</h3>
                  <p className="text-[#6B7280] text-xs leading-relaxed flex-grow mb-4">{p.desc}</p>
                  <Link href="/contact" className="text-[#3CB52A] text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-auto w-fit">
                    Get a Quote <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── SOFTWARE ─── */}
        <section id="software">
          <CategoryLabel icon={<Code2 size={18} />} label="Software & AI" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOFTWARE.map((p, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                <div className={`h-32 bg-gradient-to-br ${p.gradient} relative flex items-end p-4`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative z-10 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{p.type}</span>
                    <span className="text-xs font-black text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/15 w-fit">
                      {p.impact}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-[#3CB52A] font-bold text-[10px] uppercase tracking-wider mb-1.5">{p.client}</div>
                  <h3 className="text-base font-black text-[#0A0A0A] mb-2 leading-snug">{p.title}</h3>
                  <p className="text-[#6B7280] text-xs leading-relaxed flex-grow mb-4">{p.desc}</p>
                  <Link href="/contact" className="text-[#3CB52A] text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-auto w-fit">
                    Get a Quote <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── BRANDING ─── */}
        <section id="branding">
          <CategoryLabel icon={<Palette size={18} />} label="Branding & Design" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRANDING.map((p, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                <div className={`h-32 bg-gradient-to-br ${p.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-[#3CB52A] font-bold text-[10px] uppercase tracking-wider mb-1.5">{p.client}</div>
                  <h3 className="text-base font-black text-[#0A0A0A] mb-2 leading-snug">{p.title}</h3>
                  <p className="text-[#6B7280] text-xs leading-relaxed flex-grow mb-3">{p.desc}</p>
                  <div className="flex flex-col gap-1.5 mb-4">
                    {p.deliverables.map((d, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-[#4B5563] text-xs">
                        <CheckCircle2 size={12} className="text-[#3CB52A] shrink-0" />{d}
                      </div>
                    ))}
                  </div>
                  <Link href="/contact" className="text-[#3CB52A] text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-auto w-fit">
                    Get a Quote <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── DIGITAL MARKETING ─── */}
        <section id="digital-marketing">
          <CategoryLabel icon={<BarChart3 size={18} />} label="Digital Marketing" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DIGITAL_MARKETING.map((p, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                <div className={`h-32 bg-gradient-to-br ${p.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-[#3CB52A] font-bold text-[10px] uppercase tracking-wider mb-1.5">{p.client}</div>
                  <h3 className="text-base font-black text-[#0A0A0A] mb-2 leading-snug">{p.title}</h3>
                  <p className="text-[#6B7280] text-xs leading-relaxed flex-grow mb-3">{p.desc}</p>
                  <div className="flex flex-col gap-1.5 mb-4">
                    {p.results.map((r, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-[#4B5563] text-xs font-semibold">
                        <TrendingUp size={11} className="text-[#3CB52A] shrink-0" />{r}
                      </div>
                    ))}
                  </div>
                  <Link href="/contact" className="text-[#3CB52A] text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-auto w-fit">
                    Get a Quote <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── CASE STUDIES ─── */}
      <section id="case-studies" className="bg-[#060E18] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp()} className="mb-16">
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-3">Deep Dives</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">Case Studies</h2>
            <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
              A closer look at three of our most complex engagements — the challenges, the approach, and the measurable outcomes.
            </p>
          </motion.div>
          <div className="space-y-10">
            {CASE_STUDIES.map((cs, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                <div className={`h-2 bg-gradient-to-r ${cs.gradient}`} />
                <div className="p-8 lg:p-10 grid lg:grid-cols-3 gap-8">
                  {/* Left */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-start gap-4">
                      <div>
                        <span className="text-[#3CB52A] text-xs font-bold uppercase tracking-widest block mb-1">{cs.sector}</span>
                        <h3 className="text-2xl font-black text-white">{cs.client}</h3>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">The Challenge</h4>
                      <p className="text-white/70 leading-relaxed">{cs.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Our Solution</h4>
                      <p className="text-white/70 leading-relaxed">{cs.solution}</p>
                    </div>
                  </div>
                  {/* Right */}
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">Outcomes</h4>
                      <ul className="space-y-3">
                        {cs.outcome.map((o, j) => (
                          <li key={j} className="flex items-start gap-3 text-white/80 text-sm">
                            <CheckCircle2 size={16} className="text-[#3CB52A] shrink-0 mt-0.5" />{o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-white/10">
                      <div className="text-center">
                        <div className="text-xl font-black text-white">{cs.duration}</div>
                        <div className="text-white/40 text-xs">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-black text-white">{cs.team}</div>
                        <div className="text-white/40 text-xs">Team size</div>
                      </div>
                    </div>
                    <Link href="/contact"
                      className="flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors w-full justify-center">
                      Discuss a Similar Project <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-3">Client Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] leading-tight mb-4">What Our Clients Say</h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto leading-relaxed">
              Real feedback from the organisations we’ve built for — across health, NGO, e-commerce, agriculture, and more.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-7 hover:shadow-xl hover:border-[#3CB52A]/30 transition-all flex flex-col">
                <Quote size={28} className="text-[#3CB52A]/30 mb-5" />
                <p className="text-[#374151] leading-relaxed flex-grow mb-6 text-sm">"{t.quote}"</p>
                <div className="flex items-center justify-between pt-5 border-t border-[#F3F4F6]">
                  <div>
                    <div className="font-black text-[#0A0A0A] text-sm">{t.name}</div>
                    <div className="text-[#6B7280] text-xs mt-0.5">{t.role}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[#060E18] py-24 relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(60,181,42,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeUp()}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Start Your Project</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Build Something<br />Extraordinary?
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Join hundreds of organisations that have trusted iTech Network Africa to transform their operations through technology.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2ea827] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_32px_rgba(60,181,42,0.35)] hover:-translate-y-0.5">
                Get a Free Consultation <ArrowRight size={16} />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 text-white border border-white/20 hover:border-white/40 hover:bg-white/5 font-semibold px-8 py-3.5 rounded-xl transition-all">
                <ExternalLink size={15} /> View More Case Studies
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowRight, CheckCircle2, Zap, Shield, Globe, BarChart3,
  GraduationCap, HeartPulse, Heart, Building2, Briefcase,
  DollarSign, ShoppingCart, UtensilsCrossed, Sprout,
  Factory, Church, Rocket, ChevronDown, ChevronUp,
  Users, TrendingUp, Award, Layers,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

/* ─── Animation ─── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: EASE },
});

/* ─── Why iTech ─── */
const WHY = [
  { icon: Zap, title: 'Fast to Deploy', desc: 'Most solutions go live in under 2 weeks with guided onboarding from our team.' },
  { icon: Globe, title: 'Built for Africa', desc: 'Offline-capable, low-bandwidth optimised, and localised for African infrastructure realities.' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Role-based access, AES-256 encryption, audit trails, and compliance-ready from day one.' },
  { icon: BarChart3, title: 'Data You Can Act On', desc: 'Real-time dashboards and custom reports so every decision is backed by clean data.' },
];

/* ─── Stats ─── */
const STATS = [
  { value: '12', label: 'Industry Verticals' },
  { value: '200+', label: 'Enterprise Clients' },
  { value: '10+', label: 'African Countries' },
  { value: '99%', label: 'Client Satisfaction' },
];

/* ─── Industries data ─── */
interface Industry {
  id: string;
  icon: React.ElementType;
  label: string;
  title: string;
  headline: string;
  desc: string;
  challenges: string[];
  solutions: { name: string; desc: string }[];
  cta: string;
  accent: string;
  bgLight: string;
}

const INDUSTRIES: Industry[] = [
  {
    id: 'education',
    icon: GraduationCap,
    label: 'Education',
    title: 'Education & Academic Institutions',
    headline: 'Smarter Schools. Better Learning Outcomes.',
    desc: 'From K-12 to universities and vocational training centres, we build the digital infrastructure that lets educators teach, administrators manage, and students thrive — all in one connected platform.',
    challenges: [
      'Manual student records and paper-based report cards',
      'Disconnected fee collection and financial reporting',
      'No parent communication channel',
      'Inefficient timetable and exam management',
    ],
    solutions: [
      { name: 'School Management System', desc: 'Fully integrated platform for student records, gradebook, attendance, timetables, and reporting.' },
      { name: 'E-Learning Platform', desc: 'HD video learning, interactive quizzes, and offline sync for areas with low connectivity.' },
      { name: 'Fee Collection & Invoicing', desc: 'Mobile money-integrated fee payment with automated receipts and financial dashboards.' },
      { name: 'Parent Communication Portal', desc: 'SMS/email notifications, grade alerts, and a parent-facing results portal.' },
    ],
    cta: 'Book a School Demo',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
  {
    id: 'healthcare',
    icon: HeartPulse,
    label: 'Healthcare',
    title: 'Hospitals, Clinics & Health Systems',
    headline: 'Digital Health Infrastructure That Saves Lives.',
    desc: 'We build HIPAA-aligned health platforms for clinics, hospitals, and national health systems — connecting patient records, scheduling, pharmacy, laboratory, and telemedicine in one secure environment.',
    challenges: [
      'Paper-based patient records scattered across departments',
      'Duplicate prescriptions and medication errors',
      'Long patient queues and no appointment booking',
      'No referral system between facilities',
    ],
    solutions: [
      { name: 'Electronic Health Records (EHR)', desc: 'Centralised, secure patient records accessible across departments and facilities.' },
      { name: 'Appointment & Queue Management', desc: 'Online booking, SMS reminders, and real-time queue display for patients.' },
      { name: 'Pharmacy & Laboratory Modules', desc: 'Integrated inventory, dispensing, and lab results linked directly to patient records.' },
      { name: 'Telemedicine Platform', desc: 'Secure video consultations enabling remote care for patients in low-access areas.' },
    ],
    cta: 'Book a Health Demo',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
  {
    id: 'ngos',
    icon: Heart,
    label: 'NGOs',
    title: 'NGOs, Foundations & Non-Profits',
    headline: 'Technology That Amplifies Your Mission.',
    desc: 'We understand that NGOs run lean and need technology that scales with grants, not headcount. We build donor management platforms, impact tracking tools, and programme portals that help you do more with less.',
    challenges: [
      'Manual donor tracking with no CRM',
      'Difficulty reporting programme impact to funders',
      'No online donation or payment gateway',
      'Volunteer and beneficiary management in spreadsheets',
    ],
    solutions: [
      { name: 'Donor & Grant Management CRM', desc: 'Track donors, pledges, grants, and communication history in one place.' },
      { name: 'Online Donation Platform', desc: 'Branded donation page with card, mobile money, and recurring giving support.' },
      { name: 'Programme Impact Tracker', desc: 'Log beneficiary data, activities, and outcomes — generate funder-ready reports instantly.' },
      { name: 'Volunteer Management Portal', desc: 'Recruitment, scheduling, hours tracking, and communication for volunteers.' },
    ],
    cta: 'Talk to Our NGO Team',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
  {
    id: 'government',
    icon: Building2,
    label: 'Government',
    title: 'Government & Public Sector',
    headline: 'Digitising Government. Empowering Citizens.',
    desc: 'We work with government ministries, agencies, and municipalities to transform manual, paper-based public services into secure, transparent, trackable digital workflows that serve citizens faster and better.',
    challenges: [
      'Citizens making multiple in-person trips for basic services',
      'Paper trails that are easy to manipulate or lose',
      'No centralised data for policy decision-making',
      'Inter-agency data sharing barriers',
    ],
    solutions: [
      { name: 'Citizen Services Portal', desc: 'Digital application, tracking, and document delivery for 50+ government services.' },
      { name: 'Identity & Document Verification', desc: 'Secure identity checks, biometric integration, and digital certificate issuance.' },
      { name: 'Government ERP', desc: 'Integrated finance, procurement, HR, and asset management for public institutions.' },
      { name: 'Public Data Dashboards', desc: 'Real-time transparency dashboards for budgets, KPIs, and service delivery metrics.' },
    ],
    cta: 'Request a Government Demo',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
  {
    id: 'small-businesses',
    icon: Briefcase,
    label: 'Small Businesses',
    title: 'Small & Medium Enterprises (SMEs)',
    headline: 'Enterprise Tools at SME-Friendly Prices.',
    desc: 'You don’t need a Fortune 500 budget to run like one. We give small and growing businesses the exact same tools used by large enterprises — scaled to your size, your budget, and your growth trajectory.',
    challenges: [
      'Running the business on WhatsApp, spreadsheets, and paper',
      'No professional website or online presence',
      'Losing sales because customers can’t find or trust you online',
      'Manual invoicing and accounting with no financial visibility',
    ],
    solutions: [
      { name: 'Business Website Package', desc: 'Professional, fast, SEO-ready website with CMS — live in 7 days.' },
      { name: 'POS & Inventory System', desc: 'Affordable point-of-sale with real-time stock tracking and sales reports.' },
      { name: 'Business Email & Cloud Setup', desc: 'Professional email (@yourbusiness.com), Google Workspace or Microsoft 365.' },
      { name: 'Social Media & Digital Marketing', desc: 'Managed social channels, paid ads, and SEO to drive real customers to your door.' },
    ],
    cta: 'Grow Your Business Online',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
  {
    id: 'financial',
    icon: DollarSign,
    label: 'Financial Services',
    title: 'Banks, MFIs & Financial Services',
    headline: 'Secure, Compliant Fintech for African Markets.',
    desc: 'We build robust, regulation-ready digital banking and microfinance platforms — from core banking system upgrades to mobile money wallets and loan management portals, engineered for African infrastructure.',
    challenges: [
      'Legacy core banking systems that can’t support digital channels',
      'Manual loan processing and approval workflows',
      'Customers with no access to branches',
      'Regulatory compliance and reporting overhead',
    ],
    solutions: [
      { name: 'Digital Banking Platform', desc: 'Mobile and web banking with account management, transfers, and statements.' },
      { name: 'Loan Management System', desc: 'End-to-end loan origination, scoring, approval, disbursement, and collections.' },
      { name: 'Mobile Money Wallet', desc: 'Cross-carrier mobile wallet with agent banking, P2P transfers, and bill payments.' },
      { name: 'Regulatory Reporting Engine', desc: 'Automated compliance reports for central bank submissions — zero manual data entry.' },
    ],
    cta: 'Request a Fintech Demo',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
  {
    id: 'retail',
    icon: ShoppingCart,
    label: 'Retail',
    title: 'Retail, Supermarkets & E-Commerce',
    headline: 'Sell More. Waste Less. Run Smarter.',
    desc: 'Whether you run a single shop or a 50-branch supermarket chain, we build the retail technology that gives you real-time stock visibility, faster checkout, and the data to make smart buying decisions every day.',
    challenges: [
      'No real-time visibility into stock across locations',
      'Slow, error-prone manual checkout processes',
      'Inability to sell online or take card/mobile payments',
      'No data on best-selling products or peak hours',
    ],
    solutions: [
      { name: 'Point of Sale (POS) System', desc: 'Fast, intuitive POS with barcode scanning, multi-tender payments, and offline mode.' },
      { name: 'Multi-Store Inventory Management', desc: 'Real-time stock sync across all locations with low-stock alerts and auto-reorder.' },
      { name: 'E-Commerce Store', desc: 'Online store with mobile money, card payment, and same-day delivery integration.' },
      { name: 'Retail Analytics Dashboard', desc: 'Sales trends, top products, staff performance, and peak hour insights.' },
    ],
    cta: 'Book a Retail Demo',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
  {
    id: 'hospitality',
    icon: UtensilsCrossed,
    label: 'Hospitality',
    title: 'Hotels, Restaurants & Hospitality',
    headline: 'Guest Experiences That Keep Them Coming Back.',
    desc: 'From boutique hotels to restaurant chains, we build the technology that streamlines bookings, delights guests, empowers staff, and gives management the visibility to run a profitable, well-reviewed operation.',
    challenges: [
      'Manual reservation management and overbooking',
      'No direct booking channel — all revenue through OTAs',
      'Paper-based table orders and kitchen tickets',
      'No loyalty programme or guest feedback system',
    ],
    solutions: [
      { name: 'Hotel Management System (HMS)', desc: 'Front desk, housekeeping, reservations, billing, and guest profiles in one platform.' },
      { name: 'Direct Booking Website', desc: 'Commission-free booking engine integrated into your hotel website.' },
      { name: 'Restaurant POS & Table Management', desc: 'Digital menu, table orders, kitchen display system, and split billing.' },
      { name: 'Guest Loyalty & Feedback Portal', desc: 'Points-based loyalty programme and automated post-stay review requests.' },
    ],
    cta: 'Book a Hospitality Demo',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
  {
    id: 'agriculture',
    icon: Sprout,
    label: 'Agriculture',
    title: 'Agriculture, Agribusiness & Farming',
    headline: 'Feeding Africa with Smarter Farm Technology.',
    desc: 'We help agribusinesses, cooperatives, and development agencies harness data to improve yields, track supply chains, connect farmers to markets, and access credit — using technology adapted to rural African realities.',
    challenges: [
      'Farmers with no access to market price information',
      'Post-harvest losses due to poor supply chain visibility',
      'No formal record of farm inputs, loans, or yields',
      'Difficulty aggregating output from smallholder networks',
    ],
    solutions: [
      { name: 'Farm Management System', desc: 'Record plots, inputs, yields, and activities digitally — accessible from a basic smartphone.' },
      { name: 'Crop Yield Prediction (AI)', desc: 'Machine learning models using satellite and weather data to forecast harvest volumes.' },
      { name: 'Farmer Registry & Cooperative Portal', desc: 'Digital membership, loan tracking, input distribution, and output aggregation.' },
      { name: 'Market Linkage Platform', desc: 'Connect farmers directly to buyers with real-time pricing, order management, and payments.' },
    ],
    cta: 'Explore AgriTech Solutions',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
  {
    id: 'manufacturing',
    icon: Factory,
    label: 'Manufacturing',
    title: 'Manufacturing & Industrial Operations',
    headline: 'Leaner Production. Zero Downtime.',
    desc: 'We build production management, quality control, and maintenance platforms that give factory managers real-time visibility into every machine, every batch, and every bottleneck — so you can act before problems escalate.',
    challenges: [
      'No real-time visibility into production floor status',
      'Reactive maintenance leading to costly downtime',
      'Manual quality control with no traceability',
      'Disconnected supply chain and procurement',
    ],
    solutions: [
      { name: 'Manufacturing ERP', desc: 'Production scheduling, BOM management, work orders, and shop floor tracking.' },
      { name: 'Predictive Maintenance System', desc: 'IoT-connected asset monitoring with ML-driven maintenance scheduling.' },
      { name: 'Quality Management System (QMS)', desc: 'Digital inspection checklists, batch traceability, and non-conformance tracking.' },
      { name: 'Procurement & Supplier Portal', desc: 'RFQ management, purchase orders, supplier performance, and delivery tracking.' },
    ],
    cta: 'Request a Manufacturing Demo',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
  {
    id: 'churches',
    icon: Church,
    label: 'Churches & Ministries',
    title: 'Churches, Mosques & Religious Organisations',
    headline: 'Strengthen Your Congregation. Grow Your Reach.',
    desc: 'We build dedicated management platforms for faith communities — covering membership, tithes, events, and communications — so leaders can focus on ministry rather than administration.',
    challenges: [
      'No centralised member directory or contact database',
      'Manual tracking of tithes, offerings, and pledges',
      'Difficulty coordinating events, volunteers, and departments',
      'Limited reach beyond Sunday services',
    ],
    solutions: [
      { name: 'Church Management System (ChMS)', desc: 'Member directory, family profiles, attendance tracking, and communication tools.' },
      { name: 'Tithe & Offering Management', desc: 'Digital giving portal with mobile money, card payments, and automated receipts.' },
      { name: 'Event & Volunteer Scheduling', desc: 'Calendar, roster management, and automated reminders for events and serving teams.' },
      { name: 'Ministry Website & Live Streaming', desc: 'Professional church website with sermon archive, events calendar, and live streaming.' },
    ],
    cta: 'Get a Church Demo',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
  {
    id: 'startups',
    icon: Rocket,
    label: 'Startups',
    title: 'Startups & Tech Ventures',
    headline: 'From Idea to MVP — Built for Speed.',
    desc: "We’ve helped dozens of African startups go from whiteboard to working product. Whether you need a co-development partner, an MVP in 6 weeks, or a scalable technical foundation for your Series A, we’ve done it before.",
    challenges: [
      'Founders without a technical co-founder',
      'Need to validate fast without burning runway',
      'Investors expecting a polished product demo',
      'Scaling challenges after product-market fit',
    ],
    solutions: [
      { name: 'MVP Development', desc: 'Focused, feature-lean product built and shipped in 6–8 weeks to validate your core hypothesis.' },
      { name: 'Technical Co-Development', desc: 'We embed as your engineering team — full-stack, product, design, and DevOps.' },
      { name: 'Pitch Deck & Brand Design', desc: 'Investor-ready pitch deck, brand identity, and demo environment for fundraising.' },
      { name: 'Scale-Up Engineering', desc: 'Architecture review, performance optimisation, and team augmentation for rapid growth.' },
    ],
    cta: 'Start Building Today',
    accent: '#3CB52A',
    bgLight: '#f0fdf4',
  },
];

/* ─── Expandable industry card ─── */
function IndustrySection({ ind, reverse }: { ind: Industry; reverse?: boolean }) {
  const [open, setOpen] = useState(false);
  const Icon = ind.icon;

  return (
    <section id={ind.id} className="scroll-mt-28">
      <motion.div {...fadeUp()}
        className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:border-[#3CB52A]/30 hover:shadow-xl transition-all duration-300">

        {/* Header bar */}
        <div className="bg-[#060E18] px-8 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#3CB52A]/20 border border-[#3CB52A]/30 flex items-center justify-center shrink-0">
            <Icon size={22} className="text-[#3CB52A]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[#3CB52A] text-[10px] font-bold uppercase tracking-widest block">{ind.label}</span>
            <h2 className="text-xl font-black text-white leading-tight">{ind.title}</h2>
          </div>
          <Link href="/contact"
            className="hidden sm:inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shrink-0">
            {ind.cta} <ArrowRight size={14} />
          </Link>
        </div>

        <div className={`grid lg:grid-cols-2 gap-0 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          {/* Left: overview */}
          <div className="p-8 border-b lg:border-b-0 lg:border-r border-[#F3F4F6]">
            <h3 className="text-2xl font-black text-[#0A0A0A] mb-3 leading-snug">{ind.headline}</h3>
            <p className="text-[#6B7280] leading-relaxed mb-7 text-sm">{ind.desc}</p>

            <div className="mb-6">
              <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 text-sm font-bold text-[#374151] hover:text-[#3CB52A] transition-colors"
              >
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {open ? 'Hide' : 'See'} common challenges we solve
              </button>
              <motion.div
                initial={false}
                animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="overflow-hidden"
              >
                <ul className="mt-4 space-y-2.5">
                  {ind.challenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#4B5563] text-sm">
                      <CheckCircle2 size={15} className="text-[#3CB52A] shrink-0 mt-0.5" />{c}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <Link href="/contact"
              className="sm:hidden mt-4 flex items-center gap-2 bg-[#0A1929] hover:bg-[#3CB52A] text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors w-full justify-center">
              {ind.cta} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right: solutions */}
          <div className="p-8">
            <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-5">Solutions We Offer</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {ind.solutions.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E7EB] hover:border-[#3CB52A]/30 hover:bg-[#f0fdf4] transition-all group"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle2 size={15} className="text-[#3CB52A] shrink-0 mt-0.5" />
                    <span className="font-bold text-[#0A0A0A] text-sm leading-snug">{s.name}</span>
                  </div>
                  <p className="text-[#6B7280] text-xs leading-relaxed pl-5">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function SolutionsPage() {
  useSEO({
    title: 'Business Solutions — Technology Solutions for African Companies',
    description: 'Tailored technology solutions for African businesses — digital transformation, enterprise software, cloud migration and cybersecurity.',
    canonical: '/solutions',
  });
  return (
    <div className="flex flex-col w-full bg-[#F8F9FA]">

      {/* ─── HERO ─── */}
      <section className="relative bg-[#060E18] pt-20 pb-28 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div aria-hidden="true" className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.08) 0%, transparent 65%)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-white/40 text-sm mb-12">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/70">Solutions</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
                <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Industry-Specific Technology</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                Solutions<br /><span className="text-[#3CB52A]">by Industry</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
                className="text-white/55 text-xl leading-relaxed mb-10 max-w-xl">
                We don’t sell generic software. Every solution is tailored to your industry’s specific workflows, regulations, and operational realities.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }}
                className="flex flex-wrap gap-4">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.4)]">
                  Request a Demo <ArrowRight size={17} />
                </Link>
                <Link href="/pricing"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5">
                  View Pricing
                </Link>
              </motion.div>
            </div>

            {/* Industry quick links */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="grid grid-cols-3 gap-3">
              {INDUSTRIES.map((ind) => {
                const Icon = ind.icon;
                return (
                  <a key={ind.id} href={`#${ind.id}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-[#3CB52A]/15 hover:border-[#3CB52A]/40 transition-all group text-center">
                    <Icon size={20} className="text-white/50 group-hover:text-[#3CB52A] transition-colors" />
                    <span className="text-white/60 group-hover:text-white text-xs font-semibold transition-colors leading-tight">{ind.label}</span>
                  </a>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-[#0A1929] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                className="py-8 px-8 text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-1">{s.value}</div>
                <div className="text-white/40 text-xs font-semibold uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY iTECH ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp()} className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-3">Why iTech</span>
            <h2 className="text-4xl font-black text-[#0A0A0A] leading-tight">Built Different. Built for Africa.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map((w, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)}
                className="bg-[#F8F9FA] rounded-2xl p-7 border border-[#E5E7EB] hover:border-[#3CB52A]/40 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center mb-5">
                  <w.icon size={22} className="text-[#3CB52A]" />
                </div>
                <h3 className="font-bold text-[#0A0A0A] mb-2">{w.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STICKY SECTION NAV ─── */}
      <div className="bg-white border-y border-[#E5E7EB] sticky top-[100px] z-30 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {INDUSTRIES.map(ind => (
              <a key={ind.id} href={`#${ind.id}`}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#3CB52A] hover:bg-[#f0fdf4] rounded-lg transition-all whitespace-nowrap">
                <ind.icon size={13} />
                {ind.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── INDUSTRY SECTIONS ─── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-20 space-y-10">
        {INDUSTRIES.map((ind, i) => (
          <IndustrySection key={ind.id} ind={ind} reverse={i % 2 !== 0} />
        ))}
      </div>

      {/* ─── BOTTOM CTA ─── */}
      <section className="bg-[#060E18] py-24 relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(60,181,42,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeUp()}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Get Started Today</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Not sure which solution<br />fits your business?
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Our team will analyse your workflow and recommend the right solution — at no cost. Most clients are live within two weeks.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/consultation"
                className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.4)]">
                Book a Free Consultation <ArrowRight size={17} />
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:bg-white/5">
                See Pricing Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import {
  CheckCircle2, ArrowRight, Globe, Server, Mail,
  ShoppingCart, GraduationCap, Package, Users, Layers
} from 'lucide-react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: EASE } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

/* ── Product definitions ── */
const PRODUCTS = [
  {
    id: 'websites',
    icon: Globe,
    title: 'Website Packages',
    subtitle: 'Professional websites for every business size',
    desc: 'From simple landing pages to full corporate portals — our website packages deliver responsive, SEO-ready sites built on modern technology, tailored for the African market.',
    tiers: [
      { name: 'Starter', price: 'From $199', note: '5-page business site' },
      { name: 'Business', price: 'From $499', note: '10-page + CMS' },
      { name: 'Enterprise', price: 'Custom', note: 'Full portal / e-commerce' },
    ],
    features: [
      'Mobile-responsive design',
      'SEO optimisation',
      'Contact & enquiry forms',
      'Google Analytics integration',
      'SSL certificate included',
      'Content management system',
    ],
    accent: '#3CB52A',
    bg: 'from-[#3CB52A]/10 to-emerald-500/5',
    cta: 'Get a Quote',
    href: '/pricing',
  },
  {
    id: 'hosting',
    icon: Server,
    title: 'Hosting Packages',
    subtitle: 'Reliable, fast hosting for Africa',
    desc: 'Managed web hosting with high-availability servers, daily backups, and 24/7 monitoring. Optimised for low-latency access across West Africa and beyond.',
    tiers: [
      { name: 'Shared', price: 'From $5/mo', note: 'Starter sites' },
      { name: 'VPS', price: 'From $25/mo', note: 'Growing businesses' },
      { name: 'Dedicated', price: 'Custom', note: 'High-traffic / enterprise' },
    ],
    features: [
      '99.9% uptime guarantee',
      'Free domain (.com, .net, .org)',
      'Daily automated backups',
      'DDoS protection',
      'cPanel / Plesk dashboard',
      'Business email hosting',
    ],
    accent: '#0EA5E9',
    bg: 'from-sky-500/10 to-blue-500/5',
    cta: 'View Hosting Plans',
    href: '/pricing',
  },
  {
    id: 'email',
    icon: Mail,
    title: 'Business Email Packages',
    subtitle: 'Professional email on your own domain',
    desc: 'Look credible with name@yourcompany.com. We set up and manage Microsoft 365 and Google Workspace plans, giving your team world-class collaboration tools from day one.',
    tiers: [
      { name: 'Basic', price: 'From $3/user/mo', note: 'Email + 15 GB storage' },
      { name: 'Business', price: 'From $6/user/mo', note: '+ Teams / Meet, 100 GB' },
      { name: 'Enterprise', price: 'Custom', note: 'Unlimited + advanced security' },
    ],
    features: [
      'Microsoft 365 or Google Workspace',
      'Custom domain email',
      'Shared calendars & contacts',
      'Teams / Meet video conferencing',
      'Spam & malware filtering',
      'Setup & migration included',
    ],
    accent: '#8B5CF6',
    bg: 'from-violet-500/10 to-purple-500/5',
    cta: 'Get Business Email',
    href: '/contact',
  },
  {
    id: 'pos',
    icon: ShoppingCart,
    title: 'POS Systems',
    subtitle: 'Point-of-sale solutions for retail & hospitality',
    desc: 'Modern, touch-screen POS systems for shops, restaurants, pharmacies, and service businesses across Africa — with offline capability so you never lose a sale.',
    tiers: [
      { name: 'Basic', price: 'From $299', note: 'Single terminal' },
      { name: 'Multi-Branch', price: 'From $699', note: 'Up to 5 terminals' },
      { name: 'Enterprise', price: 'Custom', note: 'Unlimited terminals + API' },
    ],
    features: [
      'Touch-screen & barcode support',
      'Real-time inventory tracking',
      'Daily sales & revenue reports',
      'Offline mode — no internet required',
      'Mobile money & card payments',
      'Multi-branch management',
    ],
    accent: '#F59E0B',
    bg: 'from-amber-500/10 to-orange-500/5',
    cta: 'Request a Demo',
    href: '/contact',
  },
  {
    id: 'school',
    icon: GraduationCap,
    title: 'School Management System',
    subtitle: 'All-in-one platform for educational institutions',
    desc: 'A complete school management platform covering admissions, student records, timetables, fees, attendance, and parent communication — built for schools across Liberia and West Africa.',
    tiers: [
      { name: 'Basic', price: 'From $299/yr', note: 'Up to 500 students' },
      { name: 'Standard', price: 'From $599/yr', note: 'Up to 2,000 students' },
      { name: 'Enterprise', price: 'Custom', note: 'Unlimited + custom modules' },
    ],
    features: [
      'Student enrollment & records',
      'Timetable & class scheduling',
      'Attendance tracking (digital & biometric)',
      'Fees & payment management',
      'Parent/guardian portal & SMS alerts',
      'Exam results & report cards',
    ],
    accent: '#10B981',
    bg: 'from-emerald-500/10 to-teal-500/5',
    cta: 'Request a Demo',
    href: '/contact',
  },
  {
    id: 'inventory',
    icon: Package,
    title: 'Inventory Software',
    subtitle: 'Track stock, orders, and suppliers effortlessly',
    desc: 'Cloud-based inventory management for retailers, wholesalers, and warehouses. Know exactly what you have, where it is, and when to reorder — in real time.',
    tiers: [
      { name: 'Starter', price: 'From $99/mo', note: 'Up to 500 SKUs' },
      { name: 'Growth', price: 'From $249/mo', note: 'Up to 5,000 SKUs' },
      { name: 'Enterprise', price: 'Custom', note: 'Unlimited + multi-warehouse' },
    ],
    features: [
      'Real-time stock tracking',
      'Low-stock & reorder alerts',
      'Supplier & purchase order management',
      'Barcode & QR code scanning',
      'Sales & stock movement reports',
      'Multi-location warehouse support',
    ],
    accent: '#EF4444',
    bg: 'from-red-500/10 to-rose-500/5',
    cta: 'Get Started',
    href: '/contact',
  },
  {
    id: 'crm',
    icon: Users,
    title: 'CRM Software',
    subtitle: 'Manage leads, clients, and sales pipelines',
    desc: 'A simple, powerful CRM designed for African SMEs and enterprises — helping your team track every lead, deal, and customer interaction from first contact to repeat business.',
    tiers: [
      { name: 'Starter', price: 'From $49/mo', note: 'Up to 5 users' },
      { name: 'Team', price: 'From $149/mo', note: 'Up to 25 users' },
      { name: 'Enterprise', price: 'Custom', note: 'Unlimited users + integrations' },
    ],
    features: [
      'Lead & opportunity tracking',
      'Visual sales pipeline (Kanban)',
      'Client communication history',
      'Task & follow-up reminders',
      'Email & WhatsApp integration',
      'Reports & sales forecasting',
    ],
    accent: '#6366F1',
    bg: 'from-indigo-500/10 to-blue-500/5',
    cta: 'Try Free Demo',
    href: '/contact',
  },
  {
    id: 'digital',
    icon: Layers,
    title: 'Digital Products',
    subtitle: 'Ready-made templates, themes & tools',
    desc: 'Instantly downloadable digital assets — website templates, graphic design kits, Microsoft Office templates, presentation packs, and productivity tools for businesses and freelancers.',
    tiers: [
      { name: 'Single Item', price: 'From $9', note: 'One-time download' },
      { name: 'Bundle', price: 'From $49', note: 'Category pack' },
      { name: 'All Access', price: 'From $99/yr', note: 'Full library access' },
    ],
    features: [
      'Website & landing page templates',
      'Branded PowerPoint / Google Slides',
      'Logo & brand identity kits',
      'Business document templates',
      'Social media design packs',
      'Instant download after purchase',
    ],
    accent: '#F97316',
    bg: 'from-orange-500/10 to-amber-500/5',
    cta: 'Browse Products',
    href: '/contact',
  },
];

export default function ProductsPage() {
  useSEO({
    title: 'Our Products — Software & Digital Tools',
    description: 'Browse software products and digital tools built by iTech Network Africa for businesses across Liberia and West Africa.',
    canonical: '/products',
  });
  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero
        badge="Products"
        title="Ready-Made Solutions for Your Business"
        subtitle="Practical, affordable technology products built specifically for businesses across Africa — from starter websites to enterprise software."
      />

      {/* ── Product grid ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-8"
          >
            {PRODUCTS.map((product, i) => {
              const Icon = product.icon;
              return (
                <motion.div
                  key={product.id}
                  id={product.id}
                  custom={i}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.25, ease: EASE } }}
                  className="group flex flex-col bg-white rounded-3xl border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:border-[#3CB52A]/25 transition-all duration-300 overflow-hidden"
                >
                  {/* Header strip */}
                  <div className={`bg-gradient-to-br ${product.bg} px-8 pt-8 pb-6 flex items-start gap-5`}>
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ background: `${product.accent}18`, border: `1.5px solid ${product.accent}30` }}
                    >
                      <Icon size={26} style={{ color: product.accent }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: product.accent }}>
                        {product.subtitle}
                      </p>
                      <h3 className="text-2xl font-black text-[#060E18] leading-tight">{product.title}</h3>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 px-8 pb-8 pt-5 gap-6">
                    {/* Description */}
                    <p className="text-[#6B7280] text-[15px] leading-relaxed">{product.desc}</p>

                    {/* Pricing tiers */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-3">Pricing</p>
                      <div className="grid grid-cols-3 gap-2.5">
                        {product.tiers.map((tier) => (
                          <div
                            key={tier.name}
                            className="rounded-xl p-3 text-center border border-[#E5E7EB] bg-[#F8F9FA]"
                          >
                            <div className="text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF] mb-1">{tier.name}</div>
                            <div className="text-sm font-black text-[#060E18] leading-tight">{tier.price}</div>
                            <div className="text-[10px] text-[#9CA3AF] mt-0.5">{tier.note}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-3">Key Features</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-[#374151]">
                            <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: product.accent }} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto pt-5 border-t border-[#E5E7EB] flex flex-wrap gap-3">
                      <Link
                        href={product.href}
                        className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all shadow-sm"
                        style={{ background: product.accent }}
                      >
                        {product.cta} <ArrowRight size={14} />
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-[#374151] hover:bg-[#F8F9FA] transition-colors"
                      >
                        Talk to Sales
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Custom development CTA ── */}
      <section className="py-20 bg-[#060E18]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
            className="rounded-3xl border border-[#3CB52A]/20 bg-[#3CB52A]/8 p-10 lg:p-14 flex flex-col lg:flex-row items-center gap-10"
          >
            <div className="flex-1">
              <span className="inline-block text-[#3CB52A] text-[11px] font-bold tracking-widest uppercase mb-4 bg-[#3CB52A]/10 border border-[#3CB52A]/20 px-3 py-1 rounded-full">
                Need Something Custom?
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
                Don't see exactly what you need?
              </h2>
              <p className="text-white/60 text-lg leading-relaxed max-w-xl">
                Our development team builds bespoke software, mobile apps, and enterprise platforms tailored
                exactly to your business requirements — any industry, any scale.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#3CB52A] hover:bg-[#2ea827] text-white font-bold px-8 py-4 rounded-xl transition-all whitespace-nowrap"
              >
                Discuss Your Project <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-xl transition-all whitespace-nowrap"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

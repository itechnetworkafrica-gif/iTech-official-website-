import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Check,
  ArrowRight,
  Star,
  Split,
  Shield,
  CalendarDays,
  Megaphone,
  Wallet,
  ChevronDown,
  Globe,
  Server,
  BarChart3,
  Cpu,
  Palette,
  Zap,
  BadgeCheck,
  HeartHandshake,
  Lock,
} from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { pricingCategories, paymentTerms, faqs, type PricingPackage } from '@/lib/pricing-data';

/* ─── helpers ─────────────────────────────────────────────────────────── */

const TAB_ICONS: Record<string, React.ReactNode> = {
  'website-design': <Globe size={16} />,
  'web-hosting': <Server size={16} />,
  'digital-marketing': <BarChart3 size={16} />,
  'it-consultancy': <Cpu size={16} />,
  'graphic-design': <Palette size={16} />,
};

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  split: <Split size={22} className="text-[#3CB52A]" />,
  shield: <Shield size={22} className="text-[#3CB52A]" />,
  calendar: <CalendarDays size={22} className="text-[#3CB52A]" />,
  megaphone: <Megaphone size={22} className="text-[#3CB52A]" />,
  wallet: <Wallet size={22} className="text-[#3CB52A]" />,
};

/* ─── PricingCard ──────────────────────────────────────────────────────── */

function PricingCard({ pkg, index }: { pkg: PricingPackage; index: number }) {
  const isPopular = !!pkg.popular;

  const cardInner = (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={`
        relative flex flex-col transition-all duration-300 group h-full
        ${isPopular
          ? 'rounded-[20px]'
          : 'rounded-3xl bg-white border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#3CB52A]/30'
        }
      `}
      style={isPopular ? { background: 'rgba(10,14,26,0.97)', backdropFilter: 'blur(20px)' } : {}}
    >
      <div className="p-8 flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-[#111827]'}`}>
            {pkg.name}
          </h3>
          <p className={`text-sm leading-relaxed ${isPopular ? 'text-white/60' : 'text-[#6B7280]'}`}>
            {pkg.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-8">
          <span className={`text-4xl font-black tracking-tight ${isPopular ? 'text-white' : 'text-[#111827]'}`}>
            {pkg.price}
          </span>
          {pkg.period && (
            <span className={`text-sm font-medium ml-1 ${isPopular ? 'text-white/50' : 'text-[#6B7280]'}`}>
              {pkg.period}
            </span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-grow">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#3CB52A]/15 flex items-center justify-center">
                <Check size={12} className="text-[#3CB52A]" />
              </span>
              <span className={`text-sm ${isPopular ? 'text-white/80' : 'text-[#374151]'}`}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          href={pkg.cta === 'Contact Sales' ? '/contact' : `/billing?plan=${encodeURIComponent(pkg.name)}`}
          className={`
            block text-center w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200
            ${isPopular
              ? 'bg-[#3CB52A] text-white hover:bg-[#2da822] shadow-[0_8px_24px_rgba(60,181,42,0.35)] hover:shadow-[0_12px_32px_rgba(60,181,42,0.45)] hover:-translate-y-0.5'
              : 'border-2 border-[#E5E7EB] text-[#111827] hover:border-[#3CB52A] hover:text-[#3CB52A] group-hover:border-[#3CB52A]'
            }
          `}
        >
          {pkg.cta === 'Contact Sales' ? 'Contact Sales' : 'Pay Now'}
        </Link>
      </div>
    </motion.div>
  );

  if (isPopular) {
    return (
      <div className="relative scale-[1.04] z-10">
        {/* Spinning neon border */}
        <div className="neon-border" style={{ boxShadow: '0 0 40px rgba(0,229,255,0.12)' }}>
          {cardInner}
        </div>
        {/* Badge sits outside neon-border (which has overflow:hidden) */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#3CB52A] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap z-20">
          <Star size={11} fill="white" /> Most Popular
        </div>
      </div>
    );
  }

  return cardInner;
}

/* ─── FAQItem ──────────────────────────────────────────────────────────── */

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="border border-[#E5E7EB] rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-[#F8F9FA] transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#111827] pr-4">{q}</span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-[#6B7280] transition-transform duration-300 ${open ? 'rotate-180 text-[#3CB52A]' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-[#6B7280] text-sm leading-relaxed border-t border-[#E5E7EB] pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────── */

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState(pricingCategories[0].id);

  const activeCategory = pricingCategories.find((c) => c.id === activeTab)!;

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA] min-h-screen">
      {/* ── Hero ── */}
      <PageHero
        badge="Plans & Pricing"
        title="Simple, Transparent Pricing"
        subtitle="Choose the perfect package for your business. Whether you're launching a new website, growing your brand, or looking for reliable IT services, iTech Network has a solution designed for you."
        ctaPrimary={{ label: 'Get Started', href: '/contact' }}
        ctaSecondary={{ label: 'Request Custom Quote', href: '/contact' }}
      />

      {/* ── Category Tabs ── */}
      <section className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-3">
            {pricingCategories.map((cat) => {
              const isActive = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`
                    flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap
                    ${isActive
                      ? 'bg-[#3CB52A] text-white shadow-[0_4px_16px_rgba(60,181,42,0.30)]'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA]'
                    }
                  `}
                >
                  {TAB_ICONS[cat.id]}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={`
                  grid gap-6 items-stretch
                  ${activeCategory.packages.length === 4
                    ? 'sm:grid-cols-2 xl:grid-cols-4'
                    : activeCategory.packages.length === 3
                      ? 'sm:grid-cols-2 lg:grid-cols-3'
                      : 'sm:grid-cols-2'
                  }
                `}
              >
                {activeCategory.packages.map((pkg, i) => (
                  <PricingCard key={pkg.name} pkg={pkg} index={i} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Payment Terms ── */}
      <section className="py-20 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#3CB52A]/10 border border-[#3CB52A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A]" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Billing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-3">Payment Terms</h2>
            <p className="text-[#6B7280] text-lg">Clear, fair terms so you always know what to expect.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paymentTerms.map((term, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="flex items-start gap-4 p-5 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB]"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3CB52A]/10 flex items-center justify-center">
                  {PAYMENT_ICONS[term.icon]}
                </div>
                <p className="text-sm text-[#374151] leading-relaxed pt-1">{term.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#3CB52A]/10 border border-[#3CB52A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A]" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-3">Frequently Asked Questions</h2>
            <p className="text-[#6B7280] text-lg">Everything you need to know before getting started.</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer Highlights ── */}
      <div className="bg-white border-t border-b border-[#E5E7EB] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <BadgeCheck size={24} className="text-[#3CB52A]" />, label: 'Transparent Pricing' },
              { icon: <Zap size={24} className="text-[#3CB52A]" />, label: 'No Hidden Fees' },
              { icon: <HeartHandshake size={24} className="text-[#3CB52A]" />, label: 'Professional Support' },
              { icon: <Lock size={24} className="text-[#3CB52A]" />, label: 'Secure Payments' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3CB52A]/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-sm font-semibold text-[#111827]">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-[#0A1929] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#3CB52A]/8 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] animate-pulse" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Get Started Today</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
              Ready to Start Your Project?
            </h2>
            <p className="text-white/65 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Let's build something amazing together. Contact iTech Network today for a free consultation and personalized quote.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold rounded-full transition-all shadow-[0_8px_32px_rgba(60,181,42,0.40)] hover:shadow-[0_12px_40px_rgba(60,181,42,0.55)] hover:-translate-y-0.5"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-full border border-white/25 hover:border-white/50 hover:bg-white/5 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

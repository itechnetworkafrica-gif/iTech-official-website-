import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlayCircle, ChevronRight, Clock, Star, Users, ArrowRight,
  Zap, Shield, Cloud, Brain, Database, Code2, Settings, Globe,
} from 'lucide-react';
import { Link } from 'wouter';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, delay, ease: EASE },
});

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  Advanced:     'bg-rose-50 text-rose-700 border-rose-200',
};

const CATEGORIES = ['All', 'Platform Setup', 'API & Dev', 'Security', 'Cloud', 'AI & Automation', 'Administration'];

const TUTORIALS = [
  {
    icon: Zap,
    title: 'Getting Started: iTech Platform in 30 Minutes',
    desc: 'From zero to live integration — environment setup, API key generation, first API call, and dashboard walkthrough.',
    duration: '28 min',
    level: 'Beginner',
    category: 'Platform Setup',
    views: '4.2K',
    rating: 4.9,
    thumbnail: 'from-[#1a3a1a] to-[#0D2D1A]',
    featured: true,
    instructor: 'James K. — Lead Engineer',
  },
  {
    icon: Code2,
    title: 'REST API Deep Dive: Auth, Pagination & Webhooks',
    desc: 'Build a full integration pipeline — authenticate, paginate results, and subscribe to real-time webhook events.',
    duration: '42 min',
    level: 'Intermediate',
    category: 'API & Dev',
    views: '3.1K',
    rating: 4.8,
    thumbnail: 'from-[#0D1B2A] to-[#152438]',
    featured: true,
    instructor: 'Foday M. — API Architect',
  },
  {
    icon: Shield,
    title: 'Enterprise Security Configuration',
    desc: 'Enforce MFA, configure IP whitelisting, audit logs, RBAC, and data encryption for enterprise deployments.',
    duration: '35 min',
    level: 'Advanced',
    category: 'Security',
    views: '1.8K',
    rating: 4.9,
    thumbnail: 'from-[#1a1a2e] to-[#16213e]',
    featured: true,
    instructor: 'Alvina C. — Security Lead',
  },
  {
    icon: Cloud,
    title: 'Deploying on AWS Africa (Cape Town Region)',
    desc: 'Configure VPC, RDS, S3, and ECS for an iTech deployment with African data-residency compliance.',
    duration: '55 min',
    level: 'Advanced',
    category: 'Cloud',
    views: '2.3K',
    rating: 4.7,
    thumbnail: 'from-[#1a2a1a] to-[#0f1f0f]',
    featured: false,
    instructor: 'Wilmot S. — Cloud Architect',
  },
  {
    icon: Brain,
    title: 'Configuring the iTech AI Assistant Module',
    desc: 'Train AI on your business data, set up automation triggers, and configure the chatbot for customer support.',
    duration: '48 min',
    level: 'Intermediate',
    category: 'AI & Automation',
    views: '2.9K',
    rating: 4.8,
    thumbnail: 'from-[#1a1230] to-[#0f0a20]',
    featured: false,
    instructor: 'Dorcas A. — AI Product Lead',
  },
  {
    icon: Settings,
    title: 'iTech CRM: Pipelines, Automations & Reporting',
    desc: 'Build sales pipelines, automate follow-ups, create custom fields, and generate performance reports.',
    duration: '38 min',
    level: 'Intermediate',
    category: 'Platform Setup',
    views: '3.5K',
    rating: 4.8,
    thumbnail: 'from-[#1a2a3a] to-[#0f1f2f]',
    featured: false,
    instructor: 'James K. — Lead Engineer',
  },
  {
    icon: Database,
    title: 'iTech ERP: Inventory & Financial Module Setup',
    desc: 'Configure stock management, purchase orders, invoicing, and connect your bank accounts to the ERP ledger.',
    duration: '60 min',
    level: 'Advanced',
    category: 'Platform Setup',
    views: '1.4K',
    rating: 4.6,
    thumbnail: 'from-[#2a1a0f] to-[#1a0f07]',
    featured: false,
    instructor: 'Foday M. — API Architect',
  },
  {
    icon: Globe,
    title: 'Domain Registration & DNS Management',
    desc: 'Register .com, .net, and African ccTLD domains, configure DNS records, and connect to your hosting environment.',
    duration: '22 min',
    level: 'Beginner',
    category: 'Platform Setup',
    views: '5.1K',
    rating: 4.9,
    thumbnail: 'from-[#0f2a1a] to-[#071a0f]',
    featured: false,
    instructor: 'Alvina C. — Security Lead',
  },
  {
    icon: Users,
    title: 'Multi-Tenant Administration & Branch Management',
    desc: 'Manage multiple business units, configure role hierarchies, cross-branch reporting, and tenant-level SSO.',
    duration: '44 min',
    level: 'Advanced',
    category: 'Administration',
    views: '1.2K',
    rating: 4.7,
    thumbnail: 'from-[#2a2a1a] to-[#1a1a0f]',
    featured: false,
    instructor: 'Wilmot S. — Cloud Architect',
  },
];

export default function TutorialsPage() {
  const [activeLevel, setActiveLevel] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = TUTORIALS.filter(t => {
    const matchLevel = activeLevel === 'All' || t.level === activeLevel;
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    return matchLevel && matchCat;
  });

  const featured = TUTORIALS.filter(t => t.featured);

  return (
    <div className="flex flex-col w-full bg-white">

      {/* HERO */}
      <section className="relative bg-[#060E18] pt-20 pb-24 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div aria-hidden className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(60,181,42,0.06) 0%, transparent 65%)' }} />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex items-center gap-2 text-white/40 text-sm mb-10">
            <Link href="/"><span className="hover:text-white transition-colors cursor-pointer">Home</span></Link>
            <ChevronRight size={14} />
            <Link href="/resources"><span className="hover:text-white transition-colors cursor-pointer">Resources</span></Link>
            <ChevronRight size={14} />
            <span className="text-white/70">Video Tutorials</span>
          </motion.div>

          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
              <PlayCircle size={13} className="text-[#3CB52A]" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Video Tutorials</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: EASE }} className="text-5xl md:text-6xl font-black text-white leading-tight mb-5">
              Learn by<br /><span className="text-[#3CB52A]">Watching</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16, ease: EASE }} className="text-white/50 text-lg leading-relaxed mb-8">
              Step-by-step video walkthroughs from the iTech engineering team — from first setup to advanced enterprise configuration.
            </motion.p>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }} className="flex flex-wrap gap-6">
              {[
                { value: `${TUTORIALS.length}+`, label: 'Tutorials' },
                { value: '16K+', label: 'Total Views' },
                { value: '4.8★', label: 'Avg Rating' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-2xl font-black text-white">{s.value}</span>
                  <span className="text-white/40 text-xs font-medium">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-16 bg-[#F8F9FA] border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.div {...fadeUp()} className="mb-10">
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-2">Editor's Pick</span>
            <h2 className="text-3xl font-black text-[#0A0A0A]">Featured Tutorials</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.07)} className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#3CB52A]/40 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
                  {/* Thumbnail */}
                  <div className={`relative h-44 bg-gradient-to-br ${t.thumbnail} flex items-center justify-center`}>
                    <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <PlayCircle size={30} className="text-white ml-0.5" />
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${LEVEL_COLORS[t.level]}`}>{t.level}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/70 text-xs">
                      <Clock size={11} />{t.duration}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-[#3CB52A]" />
                      </div>
                      <span className="text-[#9CA3AF] text-xs">{t.category}</span>
                    </div>
                    <h3 className="font-black text-[#0A0A0A] text-base leading-snug mb-2 group-hover:text-[#3CB52A] transition-colors">{t.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed flex-grow">{t.desc}</p>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F3F4F6]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[#0A0A0A] text-xs font-semibold">{t.instructor}</span>
                        <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
                          <span className="flex items-center gap-1"><Star size={10} className="text-amber-400 fill-amber-400" />{t.rating}</span>
                          <span className="flex items-center gap-1"><Users size={10} />{t.views} views</span>
                        </div>
                      </div>
                      <span className="text-[#3CB52A] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Watch <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ALL TUTORIALS */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          {/* Filters */}
          <motion.div {...fadeUp()} className="flex flex-col sm:flex-row gap-4 mb-10">
            <div>
              <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider mb-2">Level</p>
              <div className="flex gap-2 flex-wrap">
                {LEVELS.map(l => (
                  <button key={l} onClick={() => setActiveLevel(l)} className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${activeLevel === l ? 'bg-[#3CB52A] text-white border-[#3CB52A] shadow-md' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#3CB52A]/40'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider mb-2">Category</p>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setActiveCategory(c)} className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${activeCategory === c ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-md' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#0A0A0A]/30'}`}>{c}</button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[#6B7280]"><strong className="text-[#0A0A0A]">{filtered.length}</strong> tutorials</p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <PlayCircle size={40} className="text-[#E5E7EB] mx-auto mb-4" />
              <p className="text-[#9CA3AF] mb-3">No tutorials match your filters.</p>
              <button onClick={() => { setActiveLevel('All'); setActiveCategory('All'); }} className="text-[#3CB52A] font-semibold hover:underline text-sm">Reset filters</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t, i) => {
                const Icon = t.icon;
                return (
                  <motion.div key={i} {...fadeUp(i * 0.05)} className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#3CB52A]/40 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
                    <div className={`relative h-36 bg-gradient-to-br ${t.thumbnail} flex items-center justify-center`}>
                      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PlayCircle size={26} className="text-white ml-0.5" />
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[t.level]}`}>{t.level}</span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-white/70 text-xs">
                        <Clock size={10} />{t.duration}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center shrink-0">
                          <Icon size={12} className="text-[#3CB52A]" />
                        </div>
                        <span className="text-[#9CA3AF] text-[11px]">{t.category}</span>
                      </div>
                      <h3 className="font-black text-[#0A0A0A] text-sm leading-snug mb-1.5 group-hover:text-[#3CB52A] transition-colors">{t.title}</h3>
                      <p className="text-[#6B7280] text-xs leading-relaxed flex-grow">{t.desc}</p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F3F4F6]">
                        <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
                          <span className="flex items-center gap-1"><Star size={10} className="text-amber-400 fill-amber-400" />{t.rating}</span>
                          <span>{t.views}</span>
                        </div>
                        <span className="text-[#3CB52A] text-xs font-bold flex items-center gap-1">Watch <ArrowRight size={11} /></span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#060E18] py-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(60,181,42,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeUp()}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Request a walkthrough?</h2>
            <p className="text-white/50 mb-8">Our team can run a live, personalised session tailored to your specific platform setup.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/consultation"><span className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.35)] cursor-pointer">Book a Session</span></Link>
              <Link href="/resources"><span className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5 cursor-pointer"><ArrowRight size={15} className="rotate-180" /> Back to Resources</span></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

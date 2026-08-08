import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, BookOpen, Download, Users,
  ArrowRight, Search, ExternalLink, Zap, X,
} from 'lucide-react';
import { Link } from 'wouter';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, delay, ease: EASE },
});

/* ─── Resource Library ─── */
const RESOURCES = [
  {
    icon: BookOpen,
    title: 'Blog',
    desc: 'In-depth articles on digital transformation in Africa, AI strategy, cloud migration, and technology leadership.',
    link: '/blog',
    badge: 'Weekly',
  },
  {
    icon: FileText,
    title: 'News',
    desc: 'The latest announcements, company updates, partnerships, and milestones from iTech Network Africa.',
    link: '/news',
    badge: 'Latest',
  },
  {
    icon: Download,
    title: 'Downloads',
    desc: 'Software clients, mobile APKs, configuration templates, official brand assets, and deployment packages.',
    link: '/resources/downloads',
    badge: 'Free',
  },
  {
    icon: Users,
    title: 'FAQs',
    desc: 'Answers to the most common questions about our products, services, support, billing, and onboarding.',
    link: '/support#knowledge-base',
    badge: 'Help',
  },
  {
    icon: Zap,
    title: 'Success Stories',
    desc: 'Real client projects and case studies showing how African businesses grow with iTech solutions.',
    link: '/portfolio',
    badge: 'Case Studies',
  },
];

const STATS = [
  { value: '5',    label: 'Resource Types'  },
  { value: '100+', label: 'Articles & Posts' },
  { value: '24/7', label: 'Support Access'  },
  { value: 'Free', label: 'For All Clients' },
];

export default function ResourcesPage() {
  const [query, setQuery] = useState('');

  const filtered = RESOURCES.filter(r =>
    !query ||
    r.title.toLowerCase().includes(query.toLowerCase()) ||
    r.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full bg-white">

      {/* ═══════════════════════════
          HERO
      ═══════════════════════════ */}
      <section className="relative bg-[#060E18] pt-20 pb-28 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.07) 0%, transparent 65%)' }}
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-white/40 text-sm mb-12"
          >
            <Link href="/"><a className="hover:text-white transition-colors">Home</a></Link>
            <span>/</span>
            <span className="text-white/70">Resources</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse" />
                <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Knowledge Base</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
              >
                Resources &<br /><span className="text-[#3CB52A]">Documentation</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
                className="text-white/50 text-lg leading-relaxed mb-10 max-w-lg"
              >
                Everything you need to build, integrate, deploy, and succeed with
                iTech Network Africa's full technology stack.
              </motion.p>

              {/* Search bar in hero */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.26 }}
                className="relative max-w-lg"
              >
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search guides, docs, and tools…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-4 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/40 focus:border-[#3CB52A]/60 transition-all backdrop-blur-sm"
                />
                <AnimatePresence>
                  {query && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-8 ${i === 0 ? 'bg-[#3CB52A]' : 'bg-white/5 border border-white/10'}`}
                >
                  <div className={`text-4xl font-black mb-2 ${i === 0 ? 'text-white' : 'text-white'}`}>{s.value}</div>
                  <div className={`text-sm font-semibold ${i === 0 ? 'text-white/80' : 'text-white/40'}`}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          SEARCH RESULTS (only when searching)
      ═══════════════════════════ */}
      <AnimatePresence>
        {query && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-12 bg-[#F8F9FA] border-b border-[#E5E7EB]"
          >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-[#6B7280]">
                  <strong className="text-[#0A0A0A]">{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''} for "<strong className="text-[#0A0A0A]">{query}</strong>"
                </p>
                <button onClick={() => setQuery('')} className="text-[#3CB52A] text-sm font-semibold hover:underline flex items-center gap-1">
                  <X size={13} /> Clear
                </button>
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#9CA3AF] mb-4">No resources match your search.</p>
                  <button onClick={() => setQuery('')} className="text-[#3CB52A] font-semibold hover:underline text-sm">Browse all resources</button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filtered.map((r, i) => {
                    const Icon = r.icon;
                    return (
                      <Link key={i} href={r.link}>
                        <a className="group bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:border-[#3CB52A]/50 hover:shadow-md transition-all flex flex-col">
                          <div className="w-11 h-11 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center mb-4 group-hover:bg-[#3CB52A] group-hover:border-[#3CB52A] transition-all">
                            <Icon size={20} className="text-[#3CB52A] group-hover:text-white transition-colors" />
                          </div>
                          <h3 className="font-bold text-[#0A0A0A] mb-1 text-sm">{r.title}</h3>
                          <p className="text-[#6B7280] text-xs leading-relaxed flex-grow">{r.desc}</p>
                          <span className="mt-3 text-[#3CB52A] text-xs font-bold flex items-center gap-1">
                            Explore <ArrowRight size={11} />
                          </span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════
          RESOURCE LIBRARY
      ═══════════════════════════ */}
      {!query && (
        <section id="docs" className="py-20 lg:py-28 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
            <motion.div {...fadeUp()} className="mb-12">
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-3">All Resources</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] leading-tight">Resource Library</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {RESOURCES.map((r, i) => {
                const Icon = r.icon;
                return (
                  <motion.div
                    key={i}
                    {...fadeUp(i * 0.05)}
                    className="group bg-white border border-[#E5E7EB] rounded-2xl p-7 hover:border-[#3CB52A]/50 hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-13 h-13 w-12 h-12 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center group-hover:bg-[#3CB52A] group-hover:border-[#3CB52A] transition-all duration-300 shrink-0">
                        <Icon size={22} className="text-[#3CB52A] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-[10px] font-bold text-[#3CB52A] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ml-2">
                        {r.badge}
                      </span>
                    </div>

                    <h3 className="font-black text-[#0A0A0A] text-base mb-2 leading-snug">{r.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed flex-grow">{r.desc}</p>

                    <Link href={r.link}>
                      <a className="mt-5 pt-4 border-t border-[#F3F4F6] text-sm font-bold flex items-center gap-1.5 text-[#0A0A0A] group-hover:text-[#3CB52A] transition-colors w-fit">
                        Explore <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════
          BOTTOM CTA
      ═══════════════════════════ */}
      <section className="bg-[#060E18] py-24 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(60,181,42,0.08) 0%, transparent 60%)' }}
        />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Can't find what<br />you're looking for?
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Our support team is available around the clock to help you navigate our resources
              or answer specific technical questions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/support">
                <a className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.4)]">
                  Open a Support Ticket
                </a>
              </Link>
              <a
                href="https://wa.me/231761978796"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5"
              >
                <ExternalLink size={15} /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, RefreshCw, Globe, Newspaper, Building2, ChevronRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ─── Featured external article ─── */
const FEATURED = {
  title: "Zuckerberg says billions will have a personal AI agent within 5 years",
  image: '/news-zuckerberg-ai-agents.jpg',
  category: 'AI Agents',
  source: 'TNW',
  sourceUrl: 'https://thenextweb.com/news/mark-zuckerberg-billions-personal-ai-agents-five-years',
  date: 'July 2026',
  readTime: '3 min read',
  summary: "Meta's stock fell nearly 10% after Zuckerberg named his boldest bet — that billions of people will each have a personal AI agent within five years. That agent would handle money, health, relationships and the home. WhatsApp and Messenger are where most people would first meet them. OpenAI and Google are racing toward the same future. Whoever builds it first shapes how you manage everything.",
  bullets: [
    "Meta's stock fell nearly 10% after Zuckerberg named his boldest bet.",
    "He says billions will each have a personal AI agent.",
    "That agent would handle money, health, relationships and the home.",
    "Zuckerberg gave the prediction a 5-year window.",
    "WhatsApp and Messenger are where most people would meet them.",
    "OpenAI and Google are racing toward the same future.",
    "Whoever builds it first shapes how you manage everything.",
  ],
};

/* ─── 10 Company news items ─── */
const COMPANY_NEWS = [
  {
    title: "iTech Network Africa Completes DKS Incubation Center Platform",
    excerpt: "We successfully deployed a full online application portal for DKS Incubation Center, enabling startup founders across Liberia to apply digitally for the first time.",
    date: "July 28, 2026",
    category: "Project Launch",
  },
  {
    title: "B4P CODEFOUND Website Goes Live — Empowering Youth in Liberia & Diaspora",
    excerpt: "Our team delivered a complete website with donation integration and impact reporting for B4P CODEFOUND, a women and youth-led NGO bridging the coding skills gap.",
    date: "July 20, 2026",
    category: "Project Launch",
  },
  {
    title: "Wilmot Kerkulah Addresses Digital Transformation at West Africa Tech Forum",
    excerpt: "Our Executive Director represented iTech Network Africa at the West Africa Tech Forum, speaking on enterprise software adoption and AI readiness across the continent.",
    date: "July 12, 2026",
    category: "Leadership",
  },
  {
    title: "iTech Launches Managed Cybersecurity Services for SMEs",
    excerpt: "We are proud to introduce affordable, enterprise-grade cybersecurity packages tailored for small and medium enterprises in West Africa, including 24/7 monitoring and compliance support.",
    date: "July 5, 2026",
    category: "New Service",
  },
  {
    title: "Health Tech Liberia Platform Passes 1,000 Registered Users",
    excerpt: "The digital health platform we built for Health Tech Liberia has reached a major milestone, connecting over 1,000 patients and providers through telemedicine and digital health records.",
    date: "June 28, 2026",
    category: "Client Milestone",
  },
  {
    title: "iTech Network Africa Celebrates 3 Years of Innovation",
    excerpt: "Founded in 2023, we mark our third year of operations with 20+ delivered projects, 30+ enterprise clients, and a growing footprint across 5+ African countries.",
    date: "June 15, 2026",
    category: "Company News",
  },
  {
    title: "New Partnership: Lumigrow Digital Agency Joins iTech Ecosystem",
    excerpt: "We have formalised a strategic partnership with Lumigrow Digital Agency to deliver integrated brand strategy and technology solutions to clients across West Africa.",
    date: "June 8, 2026",
    category: "Partnership",
  },
  {
    title: "Agrolite Agricultural Platform Reaches Farming Communities in 3 Counties",
    excerpt: "The Agrolite website now serves farming communities across three Liberian counties with resources, blog content, and field support tools — a major reach milestone.",
    date: "May 30, 2026",
    category: "Client Milestone",
  },
  {
    title: "iTech Expands Cloud Infrastructure Services to Sierra Leone",
    excerpt: "Following strong demand from partners in West Africa, iTech Network Africa has extended its cloud architecture and managed IT services to clients in Sierra Leone.",
    date: "May 20, 2026",
    category: "Expansion",
  },
  {
    title: "Lewanah LLC E-Commerce Platform Processes First International Orders",
    excerpt: "The US-based e-commerce platform we built for Lewanah LLC successfully processed its first batch of international orders, validating the payment and delivery infrastructure we engineered.",
    date: "May 10, 2026",
    category: "Client Milestone",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Project Launch':   'bg-[#3CB52A]/10 text-[#3CB52A]',
  'Leadership':       'bg-purple-100 text-purple-700',
  'New Service':      'bg-blue-100 text-blue-700',
  'Client Milestone': 'bg-amber-100 text-amber-700',
  'Company News':     'bg-[#3CB52A]/10 text-[#3CB52A]',
  'Partnership':      'bg-indigo-100 text-indigo-700',
  'Expansion':        'bg-teal-100 text-teal-700',
};

/* ─── Google News RSS via rss2json ─── */
type RssItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
  thumbnail: string;
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function useIndustryNews() {
  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const query = encodeURIComponent('africa technology AI digital transformation');
      const rss = encodeURIComponent(`https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`);
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rss}&count=12`);
      const data = await res.json();
      if (data.status === 'ok' && Array.isArray(data.items)) {
        setItems(
          data.items.map((it: any) => ({
            title: stripHtml(it.title ?? ''),
            link: it.link ?? '#',
            pubDate: it.pubDate ?? '',
            source: stripHtml(it.author ?? ''),
            description: stripHtml(it.description ?? '').slice(0, 180),
            thumbnail: it.thumbnail || it.enclosure?.link || '',
          }))
        );
        setLastFetched(new Date());
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { items, loading, error, lastFetched, refetch: load };
}

/* ─── Page component ─── */
export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<'company' | 'industry'>('company');
  const { items, loading, error, lastFetched, refetch } = useIndustryNews();

  return (
    <div className="flex flex-col w-full bg-white">

      {/* HERO */}
      <section className="bg-[#060E18] pt-16 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #3CB52A 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#3CB52A]/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <span className="inline-flex items-center gap-2 text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-5 bg-[#3CB52A]/10 border border-[#3CB52A]/20 px-4 py-1.5 rounded-full">
              <Newspaper size={13} /> News & Updates
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">Latest News</h1>
            <p className="text-white/55 text-lg max-w-xl">
              Company updates, industry insights, and technology news from across Africa and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      <section className="py-14 max-w-[1200px] mx-auto px-6 lg:px-12 w-full">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }} className="mb-6 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-[#3CB52A]" />
          <span className="text-[#111827] font-bold text-lg">Featured Story</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}
          className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xl"
        >
          {/* Image */}
          <div className="relative h-64 lg:h-auto min-h-[320px] overflow-hidden bg-[#0a0a1a]">
            <img src={FEATURED.image} alt={FEATURED.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 bg-[#3CB52A] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wide">
              {FEATURED.category}
            </span>
          </div>

          {/* Content */}
          <div className="bg-white p-8 lg:p-10 flex flex-col">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Clock size={12} className="text-[#9CA3AF]" />
              <span className="text-xs text-[#9CA3AF]">{FEATURED.date}</span>
              <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
              <span className="text-xs text-[#9CA3AF]">{FEATURED.readTime}</span>
              <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
              <span className="text-xs font-semibold text-[#3CB52A]">via {FEATURED.source}</span>
            </div>

            <h2 className="text-2xl font-black text-[#111827] leading-tight mb-4">{FEATURED.title}</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-5">{FEATURED.summary}</p>

            <ul className="space-y-1.5 mb-7">
              {FEATURED.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-[#374151] text-sm">
                  <ChevronRight size={14} className="text-[#3CB52A] shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>

            <a
              href={FEATURED.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 bg-[#060E18] hover:bg-[#3CB52A] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm self-start"
            >
              Read Full Story on TNW <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* TABS */}
      <section className="max-w-[1200px] mx-auto px-6 lg:px-12 w-full pb-24">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-xl p-1">
            <button
              onClick={() => setActiveTab('company')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'company' ? 'bg-white shadow text-[#111827]' : 'text-[#6B7280] hover:text-[#111827]'}`}
            >
              <Building2 size={15} /> Company News
            </button>
            <button
              onClick={() => setActiveTab('industry')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'industry' ? 'bg-white shadow text-[#111827]' : 'text-[#6B7280] hover:text-[#111827]'}`}
            >
              <Globe size={15} /> Industry News
            </button>
          </div>

          {activeTab === 'industry' && (
            <div className="flex items-center gap-3">
              {lastFetched && <span className="text-xs text-[#9CA3AF]">Updated {timeAgo(lastFetched.toISOString())}</span>}
              <button
                onClick={refetch}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs text-[#3CB52A] font-semibold hover:underline disabled:opacity-50"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
          )}
        </div>

        {/* Company News */}
        {activeTab === 'company' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANY_NEWS.map((item, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#3CB52A]/40 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="bg-[#060E18] px-5 py-4 flex items-center gap-3">
                  <img
                    src="/team-wilmot.png"
                    alt="Wilmot Kerkulah"
                    className="w-9 h-9 rounded-full object-cover object-top border-2 border-[#3CB52A]/40 shrink-0"
                  />
                  <div>
                    <div className="text-white text-xs font-bold leading-tight">Wilmot Kerkulah</div>
                    <div className="text-white/50 text-[10px]">Executive Director · iTech</div>
                  </div>
                  <span className="ml-auto text-white/40 text-[10px] shrink-0">{item.date}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full self-start mb-3 ${CATEGORY_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {item.category}
                  </span>
                  <h3 className="text-[#111827] font-bold text-sm leading-snug mb-2">{item.title}</h3>
                  <p className="text-[#6B7280] text-xs leading-relaxed flex-1">{item.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Industry News */}
        {activeTab === 'industry' && (
          <>
            {loading && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl h-52 animate-pulse" />
                ))}
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-20">
                <Globe size={40} className="text-[#D1D5DB] mx-auto mb-4" />
                <p className="text-[#9CA3AF] text-sm mb-4">Couldn't load live news. Check your connection and try again.</p>
                <button onClick={refetch} className="text-[#3CB52A] text-sm font-semibold hover:underline">Try again</button>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
                    className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#3CB52A]/40 hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    {item.thumbnail ? (
                      <div className="h-40 overflow-hidden bg-[#F3F4F6] shrink-0">
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    ) : (
                      <div className="h-2 bg-[#3CB52A]/60 shrink-0" />
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      {item.source && (
                        <span className="text-[10px] font-bold text-[#3CB52A] uppercase tracking-wide mb-2 truncate">{item.source}</span>
                      )}
                      <h3 className="text-[#111827] font-bold text-sm leading-snug mb-2 group-hover:text-[#3CB52A] transition-colors line-clamp-3">{item.title}</h3>
                      {item.description && (
                        <p className="text-[#6B7280] text-xs leading-relaxed flex-1 line-clamp-3 mb-3">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#F3F4F6]">
                        <span className="text-[10px] text-[#9CA3AF]">{timeAgo(item.pubDate)}</span>
                        <ExternalLink size={12} className="text-[#D1D5DB] group-hover:text-[#3CB52A] transition-colors" />
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

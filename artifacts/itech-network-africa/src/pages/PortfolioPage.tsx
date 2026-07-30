import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { ArrowRight, ExternalLink, TrendingUp, Users, Globe, Award } from 'lucide-react';
import { Link } from 'wouter';

const categories = ["All", "Web", "Mobile", "AI", "Enterprise"];

const IMPACT_STATS = [
  { icon: <Globe size={20} />, value: '20+', label: 'Countries Served' },
  { icon: <Users size={20} />, value: '200+', label: 'Enterprise Clients' },
  { icon: <TrendingUp size={20} />, value: '500+', label: 'Projects Delivered' },
  { icon: <Award size={20} />, value: '99%', label: 'Client Satisfaction' },
];

const portfolioData = [
  {
    id: 1,
    client: "Liberia Investment Bank",
    category: "Enterprise",
    title: "Core Banking Infrastructure Upgrade",
    desc: "A complete overhaul of the bank's legacy systems to a modern, microservices architecture, improving transaction speeds by 400% and enabling real-time cross-border transfers.",
    impact: "400% faster transactions",
    gradient: "from-blue-600 to-indigo-900"
  },
  {
    id: 2,
    client: "Monrovia Health Authority",
    category: "Web",
    title: "National Health Information Portal",
    desc: "Centralised web platform for citizen health records and appointment scheduling, serving over 2 million users across 14 counties with HIPAA-compliant data management.",
    impact: "2M+ active users",
    gradient: "from-emerald-500 to-teal-800"
  },
  {
    id: 3,
    client: "West Africa Telecom",
    category: "Mobile",
    title: "Self-Service Mobile Application",
    desc: "Native iOS and Android apps allowing 10M+ subscribers to manage data plans, pay bills, and access 24/7 support — reducing call centre load by 55%.",
    impact: "10M+ subscribers",
    gradient: "from-orange-500 to-red-800"
  },
  {
    id: 4,
    client: "AgriTech Solutions Ltd",
    category: "AI",
    title: "Crop Yield Prediction Engine",
    desc: "Machine learning model analysing satellite imagery and weather data to provide accurate harvest forecasts for 50,000+ smallholder farmers across the region.",
    impact: "50K+ farmers supported",
    gradient: "from-green-500 to-emerald-900"
  },
  {
    id: 5,
    client: "EcoLogistics",
    category: "Enterprise",
    title: "Fleet Management ERP",
    desc: "Custom ERP integrating GPS tracking, predictive maintenance scheduling, and automated dispatch for a fleet of 500+ vehicles — cutting operational costs by 30%.",
    impact: "30% cost reduction",
    gradient: "from-gray-700 to-black"
  },
  {
    id: 6,
    client: "EduConnect Africa",
    category: "Web",
    title: "E-Learning Management System",
    desc: "Scalable online education platform with HD video streaming, interactive quizzes, and offline sync for areas with low connectivity — adopted by 120+ institutions.",
    impact: "120+ institutions",
    gradient: "from-purple-500 to-indigo-900"
  },
  {
    id: 7,
    client: "PaySwift",
    category: "Mobile",
    title: "Cross-Border Payment Wallet",
    desc: "Secure mobile wallet facilitating instant, low-fee remittances across 5 West African countries with multi-currency support and regulatory compliance built in.",
    impact: "$50M+ transacted",
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    id: 8,
    client: "GovServices Portal",
    category: "Web",
    title: "Citizen Services Digitisation",
    desc: "Transformed 50+ manual government paper processes into secure, trackable digital workflows — reducing average processing time from 14 days to under 48 hours.",
    impact: "50+ services digitised",
    gradient: "from-amber-500 to-orange-800"
  },
  {
    id: 9,
    client: "RetailMax Supermarkets",
    category: "AI",
    title: "Demand Forecasting & Inventory AI",
    desc: "Predictive analytics system integrated across 80 store locations, reducing stockouts by 35% and cutting perishable waste by 28% within the first quarter.",
    impact: "35% fewer stockouts",
    gradient: "from-pink-500 to-rose-900"
  },
  {
    id: 10,
    client: "Global Mining Corp",
    category: "Enterprise",
    title: "Safety & Compliance Platform",
    desc: "Enterprise platform for tracking safety incidents, compliance training, and regulatory reporting — achieving zero major compliance violations across 3 operating sites.",
    impact: "Zero compliance violations",
    gradient: "from-slate-600 to-slate-900"
  },
  {
    id: 11,
    client: "City Transit",
    category: "Mobile",
    title: "Smart Ticketing App",
    desc: "QR-code based mobile ticketing and real-time bus tracking for urban commuters, processing 200,000+ daily trips and reducing fare evasion by 40%.",
    impact: "200K+ daily trips",
    gradient: "from-lime-500 to-green-800"
  },
  {
    id: 12,
    client: "InsureTech Pro",
    category: "AI",
    title: "Automated Claims Processing",
    desc: "Computer vision and NLP system that automatically extracts and validates data from claim documents, reducing approval time from 7 days to under 4 hours.",
    impact: "7 days → 4 hours",
    gradient: "from-violet-500 to-purple-900"
  }
];

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("All");
  
  const filteredProjects = activeTab === "All" 
    ? portfolioData 
    : portfolioData.filter(p => p.category === activeTab);

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA] min-h-screen">
      <PageHero 
        badge="Global Portfolio"
        title="Our Work"
        subtitle="Transformative digital solutions delivered across industries and continents — from enterprise banking infrastructure to AI-powered agriculture."
      />

      {/* Impact stats bar */}
      <section className="bg-[#060E18] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {IMPACT_STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3CB52A]/15 text-[#3CB52A] flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-white/50 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-10 max-w-7xl mx-auto px-6 lg:px-8 w-full border-b border-[#E5E7EB]">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 text-sm ${
                activeTab === category 
                  ? 'bg-[#0A1929] text-white shadow-md' 
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#3CB52A] hover:text-[#3CB52A]'
              }`}
            >
              {category}
              {category !== "All" && (
                <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === category ? 'bg-white/20' : 'bg-[#F3F4F6]'}`}>
                  {portfolioData.filter(p => p.category === category).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Project grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                {/* Gradient header */}
                <div className={`h-44 w-full bg-gradient-to-br ${project.gradient} relative overflow-hidden flex items-end p-5`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider border border-white/30">
                    {project.category}
                  </div>
                  {/* Impact badge */}
                  <div className="relative z-10 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                    <span className="text-white text-xs font-bold">{project.impact}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[#3CB52A] font-bold text-xs uppercase tracking-wider mb-2">{project.client}</div>
                  <h3 className="text-lg font-bold text-[#111827] mb-3 leading-snug">{project.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-6 flex-grow">{project.desc}</p>
                  
                  <Link href="/contact" className="mt-auto flex items-center gap-2 text-[#0A1929] font-semibold text-sm group-hover:text-[#3CB52A] transition-colors w-fit">
                    Discuss a Similar Project <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* CTA section */}
      <section className="bg-[#060E18] py-20 mt-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4 bg-[#3CB52A]/10 border border-[#3CB52A]/20 px-4 py-1.5 rounded-full">
              Start Your Project
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">
              Ready to Build Something<br />Extraordinary?
            </h2>
            <p className="text-white/55 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join hundreds of organisations that have trusted iTech Network Africa to transform their operations through technology.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2ea827] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_32px_rgba(60,181,42,0.35)] hover:-translate-y-0.5">
                Get a Free Consultation <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 text-white border border-white/20 hover:border-white/40 hover:bg-white/5 font-semibold px-8 py-3.5 rounded-xl transition-all">
                <ExternalLink size={15} /> View Case Studies
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

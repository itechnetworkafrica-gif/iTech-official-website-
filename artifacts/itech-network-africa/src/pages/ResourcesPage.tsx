import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { FileText, Code2, PlayCircle, BookOpen, Download, Clock, Wrench, Users, ArrowRight, Search, ExternalLink, Zap, Shield, Cloud, Brain } from 'lucide-react';
import { Link } from 'wouter';

const resources = [
  { icon: <FileText size={26} />, title: "Documentation", desc: "Detailed product manuals, implementation guides, and administrative instructions for all iTech software.", link: "/resources/docs", badge: "Essential" },
  { icon: <Code2 size={26} />, title: "API Reference", desc: "Comprehensive endpoints, request/response schemas, and authentication methods for developers.", link: "/resources/api", badge: "Developer" },
  { icon: <PlayCircle size={26} />, title: "Tutorials", desc: "Video walkthroughs and step-by-step guides on how to maximise the value of our platforms.", link: "/resources/tutorials", badge: "Getting Started" },
  { icon: <BookOpen size={26} />, title: "Blog & Insights", desc: "Articles on technology trends, digital transformation strategy, and company news from our team.", link: "/blog", badge: "Updated Weekly" },
  { icon: <Download size={26} />, title: "Downloads", desc: "Desktop clients, mobile APKs, plugins, configuration templates, and official brand assets.", link: "/resources/downloads", badge: "Free" },
  { icon: <Clock size={26} />, title: "Changelog", desc: "Stay up to date with the latest feature releases, bug fixes, and platform improvements.", link: "/resources/changelog", badge: "v2.x" },
  { icon: <Wrench size={26} />, title: "Developer Tools", desc: "SDKs, CLI tools, Postman collections, and sandbox environments to accelerate your integration.", link: "/resources/tools", badge: "Developer" },
  { icon: <Users size={26} />, title: "Community Forum", desc: "Connect with other iTech users, share solutions, ask questions, and discuss best practices.", link: "/support", badge: "Community" }
];

const FEATURED = [
  {
    icon: <Zap size={20} />,
    color: '#3CB52A',
    title: 'Quick Start Guide',
    desc: 'Get your first iTech integration running in under 30 minutes with our step-by-step setup guide.',
    time: '30 min read',
    href: '/resources/docs',
  },
  {
    icon: <Code2 size={20} />,
    color: '#0A7EBF',
    title: 'REST API Quickstart',
    desc: 'Authenticate and make your first API call in minutes. Includes code samples in JavaScript, Python, and PHP.',
    time: '15 min read',
    href: '/resources/api',
  },
  {
    icon: <Shield size={20} />,
    color: '#7C3AED',
    title: 'Security Best Practices',
    desc: 'Essential security guidelines for your iTech deployment: MFA setup, API key management, and data encryption.',
    time: '20 min read',
    href: '/resources/docs',
  },
  {
    icon: <Cloud size={20} />,
    color: '#E85D04',
    title: 'Cloud Deployment Checklist',
    desc: 'A comprehensive pre-launch checklist for deploying iTech solutions on AWS, Azure, or Google Cloud.',
    time: '25 min read',
    href: '/resources/docs',
  },
  {
    icon: <Brain size={20} />,
    color: '#DB2777',
    title: 'AI Module Configuration',
    desc: 'Configure and fine-tune iTech AI modules for your specific business context and data environment.',
    time: '40 min read',
    href: '/resources/docs',
  },
  {
    icon: <Users size={20} />,
    color: '#0D9488',
    title: 'User Management Guide',
    desc: 'Manage roles, permissions, SSO configuration, and audit trails for your organisation\'s users.',
    time: '20 min read',
    href: '/resources/docs',
  },
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter(r =>
    !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA] min-h-screen">
      <PageHero 
        badge="Knowledge Base"
        title="Resources & Documentation"
        subtitle="Everything you need to build, integrate, deploy, and succeed with iTech Network Africa's technology stack."
      />

      {/* Search bar */}
      <section className="bg-white border-b border-[#E5E7EB] py-8">
        <div className="max-w-2xl mx-auto px-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search resources, guides, and documentation…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#D1D5DB] bg-white text-[#111827] placeholder:text-[#9CA3AF] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/30 focus:border-[#3CB52A] transition-all"
            />
          </div>
        </div>
      </section>

      {/* Featured guides */}
      {!searchQuery && (
        <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-2">Start Here</span>
              <h2 className="text-2xl font-bold text-[#111827]">Featured Guides</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED.map((guide, i) => (
              <motion.a
                key={i}
                href={guide.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="group bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#3CB52A]/40 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shrink-0"
                  style={{ backgroundColor: guide.color }}
                >
                  {guide.icon}
                </div>
                <h3 className="font-bold text-[#111827] mb-2 group-hover:text-[#3CB52A] transition-colors leading-snug">{guide.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-4 flex-grow">{guide.desc}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F3F4F6]">
                  <span className="text-[#9CA3AF] text-xs font-medium flex items-center gap-1">
                    <Clock size={12} /> {guide.time}
                  </span>
                  <span className="text-[#3CB52A] text-xs font-bold group-hover:gap-2 flex items-center gap-1 transition-all">
                    Read <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      )}

      {/* All resources */}
      <section className="py-12 lg:py-16 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {!searchQuery && (
          <div className="mb-8">
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase block mb-2">All Resources</span>
            <h2 className="text-2xl font-bold text-[#111827]">Resource Library</h2>
          </div>
        )}
        {filteredResources.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#6B7280] text-lg mb-4">No resources found for "<strong>{searchQuery}</strong>".</p>
            <button onClick={() => setSearchQuery('')} className="text-[#3CB52A] font-semibold hover:underline text-sm">Clear search</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredResources.map((resource, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="bg-white p-6 rounded-2xl border border-[#E5E7EB] hover:border-[#3CB52A] hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f0fdf0] text-[#3CB52A] flex items-center justify-center group-hover:bg-[#3CB52A] group-hover:text-white transition-all duration-300 shrink-0">
                    {resource.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#9CA3AF] bg-[#F3F4F6] px-2 py-1 rounded-full uppercase tracking-wider shrink-0 ml-2">
                    {resource.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2 leading-snug">{resource.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-5 flex-grow">{resource.desc}</p>
                
                <Link href={resource.link} className="mt-auto text-[#0A1929] group-hover:text-[#3CB52A] font-semibold text-sm flex items-center gap-1.5 transition-colors w-fit">
                  Explore <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Support CTA */}
      <section className="bg-white py-16 border-t border-[#E5E7EB] mt-4">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-[#111827] mb-3">Can't find what you're looking for?</h2>
            <p className="text-[#6B7280] mb-8 max-w-md mx-auto">Our dedicated support team is available around the clock to help you navigate our resources or answer specific technical questions.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/support" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A1929] text-white font-semibold rounded-xl hover:bg-[#0A1929]/90 transition-all">
                Open a Support Ticket
              </Link>
              <a href="https://wa.me/231761978796" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#0A1929] text-[#0A1929] font-semibold rounded-xl hover:bg-[#0A1929] hover:text-white transition-all">
                <ExternalLink size={15} /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

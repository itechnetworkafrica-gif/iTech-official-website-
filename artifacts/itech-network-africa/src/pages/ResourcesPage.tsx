import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { FileText, Code2, PlayCircle, BookOpen, Download, Clock, Wrench, Users, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const resources = [
  { icon: <FileText size={28} />, title: "Documentation", desc: "Detailed product manuals, implementation guides, and administrative instructions for all iTech software.", link: "/resources/docs" },
  { icon: <Code2 size={28} />, title: "API Reference", desc: "Comprehensive endpoints, request/response schemas, and authentication methods for developers.", link: "/resources/api" },
  { icon: <PlayCircle size={28} />, title: "Tutorials", desc: "Video walkthroughs and step-by-step guides on how to maximize the value of our platforms.", link: "/resources/tutorials" },
  { icon: <BookOpen size={28} />, title: "Blog & Insights", desc: "Articles on technology trends, digital transformation strategy, and company news.", link: "/blog" },
  { icon: <Download size={28} />, title: "Downloads", desc: "Desktop clients, mobile APKs, plugins, and official brand assets.", link: "/resources/downloads" },
  { icon: <Clock size={28} />, title: "Changelog", desc: "Keep track of the latest feature releases, bug fixes, and platform updates.", link: "/resources/changelog" },
  { icon: <Wrench size={28} />, title: "Developer Tools", desc: "SDKs, CLI tools, and sandbox environments to accelerate your integration.", link: "/resources/tools" },
  { icon: <Users size={28} />, title: "Community Forum", desc: "Connect with other iTech users, share solutions, and discuss best practices.", link: "/support" }
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-col w-full bg-[#F8F9FA] min-h-screen">
      <PageHero 
        badge="Knowledge Base"
        title="Resources & Documentation"
        subtitle="Everything you need to build, integrate, and succeed with iTech Network Africa's technology stack."
      />

      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-[#E5E7EB] hover:border-[#3CB52A] hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-[#f0fdf0] text-[#3CB52A] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {resource.icon}
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">{resource.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6 flex-grow">{resource.desc}</p>
              
              <Link href={resource.link} className="mt-auto text-[#0A1929] group-hover:text-[#3CB52A] font-medium text-sm flex items-center gap-1.5 transition-colors w-fit">
                Explore <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      
      <section className="bg-white py-20 border-t border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">Can't find what you're looking for?</h2>
          <p className="text-[#6B7280] mb-8">Our dedicated support team is available to help you navigate our resources or answer specific technical questions.</p>
          <Link href="/support" className="inline-flex px-6 py-3 bg-[#0A1929] text-white font-medium rounded-lg hover:bg-[#0A1929]/90 transition-all">
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { navigationData } from '@/components/NavigationData';

export default function SitemapPage() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative bg-[#060E18] pt-20 pb-20 overflow-hidden">
        <img src="/hero-man-denim.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 0.28 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(6,14,24,0.97) 0%, rgba(6,14,24,0.85) 60%, rgba(6,14,24,0.65) 100%)' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sitemap
          </motion.h1>
          <p className="text-white/50">Complete directory of all pages on itechnetworkafrica.com</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {navigationData.map(section => (
              <div key={section.id}>
                <Link href={section.href} className="text-lg font-bold text-[#0A0A0A] hover:text-[#3CB52A] transition-colors block mb-4">
                  {section.label}
                </Link>
                <ul className="space-y-2">
                  {section.children.map((child, i) => (
                    <li key={i}>
                      <Link href={child.href} className="text-[#6B7280] hover:text-[#3CB52A] text-sm transition-colors">
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

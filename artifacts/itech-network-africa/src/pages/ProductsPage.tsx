import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const products = [
  {
    title: "Software Products",
    subtitle: "Enterprise-grade standalone applications",
    desc: "Licensed and SaaS software products designed for scale. From accounting suites to project management tools, our software products are built with security and performance at their core.",
    features: ["Multi-tenant architecture", "Role-based access control", "Automated backups", "API integrations", "White-label options"],
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Cloud Products",
    subtitle: "Infrastructure & Platform as a Service",
    desc: "Managed cloud hosting, storage solutions, and deployment platforms optimized for African connectivity. Experience high availability and low latency data sovereignty.",
    features: ["99.99% Uptime guarantee", "DDoS protection", "Automated scaling", "Local data centers", "Disaster recovery"],
    color: "from-[#3CB52A]/20 to-emerald-500/20"
  },
  {
    title: "Mobile Apps",
    subtitle: "Consumer & Enterprise Mobility",
    desc: "Ready-to-brand mobile application frameworks for fintech, e-commerce, and logistics. Launch your mobile presence in weeks, not months.",
    features: ["iOS & Android native feel", "Offline synchronization", "Push notifications", "Biometric security", "In-app analytics"],
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "Enterprise Platforms",
    subtitle: "Complex multi-sided ecosystems",
    desc: "Massive scale platforms for governments, marketplaces, and corporate ecosystems. High-throughput systems capable of handling millions of transactions.",
    features: ["Microservices architecture", "Event-driven design", "Bank-grade encryption", "Custom reporting engines", "Enterprise SLA support"],
    color: "from-orange-500/20 to-red-500/20"
  }
];

export default function ProductsPage() {
  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero 
        badge="Our Portfolio"
        title="Our Products"
        subtitle="Discover our suite of proprietary products designed to accelerate digital transformation for businesses of all sizes."
      />

      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {products.map((product, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg overflow-hidden group flex flex-col"
            >
              {/* Abstract Mockup Area */}
              <div className={`h-64 w-full bg-gradient-to-br ${product.color} relative overflow-hidden flex items-center justify-center p-8`}>
                <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Abstract UI elements */}
                <div className="w-full max-w-md h-full bg-white rounded-t-xl shadow-2xl border-t border-x border-white/50 relative z-10 translate-y-8 group-hover:translate-y-4 transition-transform duration-500 flex flex-col">
                  <div className="h-10 border-b border-gray-100 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col gap-4">
                    <div className="h-8 w-1/3 bg-gray-100 rounded-md"></div>
                    <div className="h-4 w-full bg-gray-50 rounded-md"></div>
                    <div className="h-4 w-5/6 bg-gray-50 rounded-md"></div>
                    <div className="h-4 w-4/6 bg-gray-50 rounded-md"></div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 lg:p-10 flex flex-col flex-grow">
                <div className="text-[#3CB52A] font-bold text-sm tracking-wider uppercase mb-2">{product.subtitle}</div>
                <h3 className="text-3xl font-bold text-[#111827] mb-4">{product.title}</h3>
                <p className="text-[#6B7280] text-lg leading-relaxed mb-8">{product.desc}</p>
                
                <div className="mb-10">
                  <h4 className="font-bold text-[#111827] mb-4">Core Capabilities</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <CheckCircle2 size={16} className="text-[#3CB52A]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto flex flex-wrap gap-4 pt-6 border-t border-[#E5E7EB]">
                  <Link href="/contact" className="px-6 py-3 bg-[#3CB52A] text-white font-medium rounded-lg hover:bg-[#2e911f] transition-colors shadow-md">
                    Request Demo
                  </Link>
                  <Link href="/services" className="px-6 py-3 bg-white border border-[#E5E7EB] text-[#111827] font-medium rounded-lg hover:bg-[#F8F9FA] transition-colors">
                    Learn More
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

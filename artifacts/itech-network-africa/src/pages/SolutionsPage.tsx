import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const solutions = [
  {
    title: "POS Systems",
    industry: "Retail & Hospitality",
    desc: "Next-generation Point of Sale software designed for multi-location businesses, supermarkets, and restaurants.",
    features: ["Real-time inventory sync", "Offline mode capability", "Multi-store management", "Employee shift tracking", "Comprehensive sales reporting"]
  },
  {
    title: "ERP Solutions",
    industry: "Enterprise",
    desc: "Unified Enterprise Resource Planning systems to connect finance, supply chain, operations, and commerce.",
    features: ["Financial management", "Supply chain visibility", "Procurement automation", "Project accounting", "Custom dashboard analytics"]
  },
  {
    title: "CRM Systems",
    industry: "Sales & Marketing",
    desc: "Intelligent Customer Relationship Management to track leads, close deals, and build lasting client relationships.",
    features: ["Lead pipeline tracking", "Automated email campaigns", "Customer interaction history", "Sales forecasting", "WhatsApp & SMS integration"]
  },
  {
    title: "HR Management",
    industry: "Corporate",
    desc: "End-to-end Human Resources software for recruitment, payroll, performance, and employee self-service.",
    features: ["Automated payroll processing", "Leave & attendance tracking", "Performance appraisals", "Recruitment pipeline", "Employee self-service portal"]
  },
  {
    title: "School Management",
    industry: "Education",
    desc: "Comprehensive platform for K-12 and universities to manage students, academics, and administration.",
    features: ["Student information system", "Gradebook & report cards", "Fee collection & invoicing", "Parent communication portal", "Timetable generation"]
  },
  {
    title: "Hospital Management",
    industry: "Healthcare",
    desc: "Secure, compliant HMS for clinics and hospitals to manage patient records, billing, and pharmacy.",
    features: ["Electronic Health Records (EHR)", "Appointment scheduling", "Pharmacy inventory", "Laboratory management", "Insurance billing integration"]
  },
  {
    title: "Church Management",
    industry: "Non-Profit",
    desc: "Dedicated software for religious organizations to manage memberships, donations, and events.",
    features: ["Member directory", "Tithe & offering tracking", "Event scheduling", "Volunteer management", "Bulk SMS/Email communication"]
  },
  {
    title: "Inventory Management",
    industry: "Logistics & Retail",
    desc: "Advanced stock control systems to prevent stockouts, manage warehouses, and optimize supply chains.",
    features: ["Barcode/QR scanning", "Low stock alerts", "Warehouse bin tracking", "Supplier management", "Purchase order automation"]
  }
];

export default function SolutionsPage() {
  return (
    <div className="flex flex-col w-full bg-[#F8F9FA]">
      <PageHero 
        badge="Ready-to-Deploy Software"
        title="Enterprise Solutions"
        subtitle="Robust, scalable, and secure management platforms tailored to specific industry workflows. Built to streamline your operations from day one."
        ctaPrimary={{ label: "Request a Demo", href: "/contact" }}
      />

      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10">
          {solutions.map((solution, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-[#E5E7EB]">
                <div className="inline-block px-3 py-1 rounded-full bg-[#0A1929] text-white text-xs font-bold uppercase tracking-wider mb-4">
                  {solution.industry}
                </div>
                <h3 className="text-2xl font-bold text-[#111827] mb-3">{solution.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{solution.desc}</p>
              </div>
              
              <div className="p-8 bg-[#F8F9FA] flex-grow">
                <h4 className="text-[#111827] font-bold mb-4">Key Features</h4>
                <ul className="space-y-3 mb-8">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#6B7280]">
                      <CheckCircle2 size={18} className="text-[#3CB52A] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/pricing" className="mt-auto flex items-center justify-between w-full px-6 py-3 bg-white border border-[#3CB52A] text-[#3CB52A] font-semibold rounded-lg hover:bg-[#3CB52A] hover:text-white transition-colors group">
                  <span>View Pricing Options</span>
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

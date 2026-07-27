import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

const categories = ["All", "Web", "Mobile", "AI", "Enterprise"];

const portfolioData = [
  {
    id: 1,
    client: "Liberia Investment Bank",
    category: "Enterprise",
    title: "Core Banking Infrastructure Upgrade",
    desc: "A complete overhaul of the bank's legacy systems to a modern, microservices architecture, improving transaction speeds by 400%.",
    gradient: "from-blue-600 to-indigo-900"
  },
  {
    id: 2,
    client: "Monrovia Health Authority",
    category: "Web",
    title: "National Health Information Portal",
    desc: "Centralized web platform for citizen health records and appointment scheduling, serving over 2 million users.",
    gradient: "from-emerald-500 to-teal-800"
  },
  {
    id: 3,
    client: "West Africa Telecom",
    category: "Mobile",
    title: "Self-Service Mobile Application",
    desc: "Native iOS and Android apps allowing 10M+ subscribers to manage data plans, pay bills, and access support.",
    gradient: "from-orange-500 to-red-800"
  },
  {
    id: 4,
    client: "AgriTech Solutions Ltd",
    category: "AI",
    title: "Crop Yield Prediction Engine",
    desc: "Machine learning model analyzing satellite imagery and weather data to provide accurate harvest forecasts for farmers.",
    gradient: "from-green-500 to-emerald-900"
  },
  {
    id: 5,
    client: "EcoLogistics",
    category: "Enterprise",
    title: "Fleet Management ERP",
    desc: "Custom ERP integrating GPS tracking, maintenance scheduling, and automated dispatch for a fleet of 500+ vehicles.",
    gradient: "from-gray-700 to-black"
  },
  {
    id: 6,
    client: "EduConnect Africa",
    category: "Web",
    title: "E-Learning Management System",
    desc: "Scalable online education platform with video streaming, interactive quizzes, and offline sync capabilities.",
    gradient: "from-purple-500 to-indigo-900"
  },
  {
    id: 7,
    client: "PaySwift",
    category: "Mobile",
    title: "Cross-Border Payment Wallet",
    desc: "Secure mobile wallet facilitating instant, low-fee remittances across 5 West African countries.",
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    id: 8,
    client: "GovServices Portal",
    category: "Web",
    title: "Citizen Services Digitization",
    desc: "Transformed 50+ manual government paper processes into secure, trackable digital workflows.",
    gradient: "from-amber-500 to-orange-800"
  },
  {
    id: 9,
    client: "RetailMax Supermarkets",
    category: "AI",
    title: "Demand Forecasting & Inventory AI",
    desc: "Predictive analytics system reducing stockouts by 35% and minimizing perishable waste.",
    gradient: "from-pink-500 to-rose-900"
  },
  {
    id: 10,
    client: "Global Mining Corp",
    category: "Enterprise",
    title: "Safety & Compliance System",
    desc: "Enterprise platform for tracking safety incidents, compliance training, and regulatory reporting.",
    gradient: "from-slate-600 to-slate-900"
  },
  {
    id: 11,
    client: "City Transit",
    category: "Mobile",
    title: "Smart Ticketing App",
    desc: "QR-code based mobile ticketing and real-time bus tracking application for urban commuters.",
    gradient: "from-lime-500 to-green-800"
  },
  {
    id: 12,
    client: "InsureTech Pro",
    category: "AI",
    title: "Automated Claims Processing",
    desc: "Computer vision and NLP system that automatically extracts data from claim documents, speeding up approvals.",
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
        badge="Success Stories"
        title="Our Work"
        subtitle="Explore our portfolio of high-impact digital transformations across Africa's most demanding industries."
      />

      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-8 w-full border-b border-[#E5E7EB]">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeTab === category 
                  ? 'bg-[#0A1929] text-white shadow-md' 
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#3CB52A] hover:text-[#3CB52A]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] hover:shadow-xl transition-shadow group flex flex-col"
              >
                {/* Image Placeholder Area */}
                <div className={`h-48 w-full bg-gradient-to-br ${project.gradient} relative overflow-hidden flex items-center justify-center p-6`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="text-white/80 font-bold text-2xl tracking-wider text-center opacity-30 group-hover:opacity-60 transition-opacity transform group-hover:scale-105 duration-500">
                    {project.client}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold uppercase tracking-wider border border-white/30">
                    {project.category}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[#3CB52A] font-bold text-sm mb-2">{project.client}</div>
                  <h3 className="text-xl font-bold text-[#111827] mb-3 leading-tight">{project.title}</h3>
                  <p className="text-[#6B7280] text-sm mb-6 flex-grow">{project.desc}</p>
                  
                  <Link href="/contact" className="mt-auto flex items-center gap-2 text-[#0A1929] font-medium group-hover:text-[#3CB52A] transition-colors w-fit">
                    View Case Study <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}

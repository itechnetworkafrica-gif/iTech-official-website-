import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { Bot, Cpu, LineChart, Brain, Eye, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function AIPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero 
        badge="Artificial Intelligence"
        title="AI Solutions for the Future of Africa"
        subtitle="Harness the power of machine learning and intelligent automation to optimize operations, enhance customer experiences, and unlock new revenue streams."
        ctaPrimary={{ label: "Start Your AI Journey", href: "/contact" }}
      />

      {/* AI Services Grid */}
      <section className="py-20 lg:py-28 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h4 className="text-[#3CB52A] font-bold tracking-wider uppercase text-sm mb-3">Capabilities</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">Intelligent Enterprise Solutions</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Bot size={28} />, title: "AI Chatbots", desc: "Next-gen conversational agents that handle customer support, sales inquiries, and internal helpdesk 24/7 with human-like understanding." },
              { icon: <Settings size={28} />, title: "AI Business Automation", desc: "Intelligent workflows that eliminate manual data entry, route documents, and automate repetitive administrative tasks." },
              { icon: <Brain size={28} />, title: "AI Assistants", desc: "Custom copilot applications tailored to your proprietary data to help your team research, draft, and make decisions faster." },
              { icon: <Cpu size={28} />, title: "Machine Learning", desc: "Custom predictive models built on your historical data to forecast demand, detect fraud, and optimize pricing." },
              { icon: <Eye size={28} />, title: "Computer Vision", desc: "Automated image and video analysis for quality control, security monitoring, and facial recognition access systems." },
              { icon: <LineChart size={28} />, title: "Predictive Analytics", desc: "Transform raw business data into actionable foresight. Anticipate market trends and customer behavior before they happen." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A1929] to-[#1a2f4a] text-[#3CB52A] flex items-center justify-center mb-6 shadow-inner">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">{service.title}</h3>
                <p className="text-[#6B7280] leading-relaxed mb-6">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Process */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h4 className="text-[#3CB52A] font-bold tracking-wider uppercase text-sm mb-3">Our Approach</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">How AI Transforms Business</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Data Assessment", desc: "We audit your existing data infrastructure and identify high-ROI automation opportunities." },
              { step: "02", title: "Model Training", desc: "We develop and train custom algorithms securely using your proprietary business data." },
              { step: "03", title: "Integration & Scale", desc: "Seamless deployment into your existing software ecosystem with ongoing optimization." }
            ].map((phase, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative p-8 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] text-center"
              >
                <div className="text-5xl font-black text-[#E5E7EB] absolute top-6 right-6 opacity-50">{phase.step}</div>
                <div className="w-16 h-16 rounded-full bg-[#3CB52A] text-white flex items-center justify-center text-xl font-bold mx-auto mb-6 relative z-10 shadow-lg shadow-[#3CB52A]/30">
                  {phase.step}
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-4 relative z-10">{phase.title}</h3>
                <p className="text-[#6B7280] relative z-10">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0A1929] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3CB52A]/10 rounded-full blur-[120px]"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build a Smarter Enterprise?
          </motion.h2>
          <motion.p {...fadeInUp} className="text-[#BDBDBD] text-xl mb-10">
            Schedule a consultation with our AI architects to discover how artificial intelligence can give your business a competitive edge.
          </motion.p>
          <motion.div {...fadeInUp}>
            <Link href="/contact" className="inline-flex px-8 py-4 bg-[#3CB52A] text-white font-medium rounded-lg hover:bg-[#2e911f] transition-all shadow-lg shadow-[#3CB52A]/25 text-lg">
              Talk to an AI Expert
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

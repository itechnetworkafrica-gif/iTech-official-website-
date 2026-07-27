import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ShieldCheck, Cpu, Cloud, Smartphone, Code, Lightbulb, ArrowRight, BarChart, Globe, Zap, Users } from 'lucide-react';

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#0A1929] to-[#1a2f4a] overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#3CB52A]/20 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#3CB52A]/10 rounded-full blur-[128px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3CB52A]/20 border border-[#3CB52A]/30 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#3CB52A] animate-pulse"></span>
              <span className="text-[#3CB52A] text-sm font-semibold tracking-wide uppercase">Innovating Africa's Future</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              Transforming Africa Through <span className="text-[#3CB52A]">Technology</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-[#BDBDBD] mb-10 max-w-2xl leading-relaxed"
            >
              Empowering businesses, governments and communities across Africa with world-class enterprise software, AI solutions, and digital transformation.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/services" className="px-8 py-4 bg-[#3CB52A] text-white font-medium rounded-lg hover:bg-[#2e911f] transition-all shadow-lg shadow-[#3CB52A]/25 hover:shadow-[#3CB52A]/40 flex items-center gap-2">
                Explore Services <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-transparent text-white font-medium rounded-lg border border-white/20 hover:bg-white/5 transition-all">
                Partner With Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-[#2B2B2B] py-16 relative z-20 -mt-10 mx-6 lg:mx-8 rounded-2xl shadow-2xl border border-white/10 max-w-7xl xl:mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {[
            { label: "Projects Delivered", value: "500+" },
            { label: "Enterprise Clients", value: "200+" },
            { label: "Countries Served", value: "10+" },
            { label: "Client Satisfaction", value: "99%" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-[#3CB52A] font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 lg:py-28 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h4 className="text-[#3CB52A] font-bold tracking-wider uppercase text-sm mb-3">Core Competencies</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">World-Class Digital Solutions</h2>
            <p className="text-[#6B7280] text-lg">Comprehensive technology services designed to scale your business and accelerate digital transformation across the continent.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Code size={24} />, title: "Enterprise Software", desc: "Custom ERPs, CRMs, and management systems built for African enterprises." },
              { icon: <Cloud size={24} />, title: "Cloud Architecture", desc: "Secure, scalable cloud infrastructure and migration services." },
              { icon: <Cpu size={24} />, title: "AI & Automation", desc: "Intelligent automation and machine learning models to optimize operations." },
              { icon: <Smartphone size={24} />, title: "Mobile Innovation", desc: "Native and cross-platform applications that reach users everywhere." },
              { icon: <ShieldCheck size={24} />, title: "Cybersecurity", desc: "Enterprise-grade security protecting your most valuable data assets." },
              { icon: <Lightbulb size={24} />, title: "Digital Strategy", desc: "Consulting services to map your complete digital transformation journey." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3CB52A] transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                <div className="w-14 h-14 rounded-xl bg-[#f0fdf0] text-[#3CB52A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">{service.title}</h3>
                <p className="text-[#6B7280] mb-6 leading-relaxed">{service.desc}</p>
                <Link href="/services" className="text-[#3CB52A] font-medium flex items-center gap-2 hover:gap-3 transition-all">
                  Learn more <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <h4 className="text-[#3CB52A] font-bold tracking-wider uppercase text-sm mb-3">The iTech Advantage</h4>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">Why African Enterprises Choose Us</h2>
              <p className="text-[#6B7280] text-lg mb-8 leading-relaxed">
                We combine global technology standards with deep local expertise. Our solutions are purpose-built to address the unique challenges and massive opportunities within the African market.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Pan-African Expertise", desc: "Deep understanding of local markets across 10+ countries." },
                  { title: "End-to-End Delivery", desc: "From conceptualization to deployment and ongoing support." },
                  { title: "Future-Ready Tech", desc: "Leveraging AI and modern stacks to keep you ahead." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-[#f0fdf0] text-[#3CB52A] flex items-center justify-center">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#111827] mb-1">{item.title}</h4>
                      <p className="text-[#6B7280]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#3CB52A]/20 to-transparent rounded-3xl blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt="Team collaboration" 
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-8 -left-8 bg-[#0A1929] p-8 rounded-2xl shadow-xl max-w-xs">
                <div className="text-white font-bold text-xl mb-2">Powered by Gotecx</div>
                <div className="text-[#BDBDBD] text-sm">Backed by world-class infrastructure and enterprise-grade reliability.</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Solutions Teaser */}
      <section className="py-20 lg:py-28 bg-[#0A1929] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3CB52A]/10 rounded-full blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <h4 className="text-[#3CB52A] font-bold tracking-wider uppercase text-sm mb-3">Next Generation Tech</h4>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Intelligence Meets Innovation</h2>
            <p className="text-[#BDBDBD] text-lg mb-10">
              Discover how our bespoke AI solutions are automating workflows, predicting trends, and driving unprecedented growth for forward-thinking organizations.
            </p>
            <Link href="/ai-solutions" className="inline-flex items-center gap-2 px-8 py-4 bg-[#3CB52A] text-white font-medium rounded-lg hover:bg-[#2e911f] transition-all shadow-lg shadow-[#3CB52A]/25 hover:shadow-[#3CB52A]/40">
              Explore AI Solutions <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-[#3CB52A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.h2 {...fadeInUp} className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your Digital Growth?
          </motion.h2>
          <motion.p {...fadeInUp} className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            Join hundreds of enterprises across Africa that trust iTech Network for their critical technology infrastructure and digital transformation.
          </motion.p>
          <motion.div {...fadeInUp}>
            <Link href="/contact" className="inline-flex px-8 py-4 bg-[#0A1929] text-white font-medium rounded-lg hover:bg-[#0A1929]/90 transition-all shadow-xl">
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { ArrowRight, Code, Cpu, Smartphone, Cloud, Shield, Database } from 'lucide-react';
import { Link } from 'wouter';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col min-h-[100dvh]">
      {/* Hero Section */}
      <section className="relative w-full py-24 lg:py-32 overflow-hidden bg-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#007BFF 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-semibold text-sm mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Empowering Africa's Digital Future
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
              Transforming Africa Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-blue-400">Technology</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
              Enterprise software, AI solutions, web development and digital transformation for businesses, governments and communities across Africa.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 fill-mode-both">
              <Link href="/services" className="w-full sm:w-auto px-8 py-4 bg-[#007BFF] hover:bg-blue-600 text-white rounded-lg font-semibold text-lg transition-all shadow-[0_4px_14px_rgba(0,123,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,123,255,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Explore Our Services
                <ArrowRight size={20} />
              </Link>
              <Link href="/portfolio" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 rounded-lg font-semibold text-lg transition-all hover:-translate-y-0.5 flex items-center justify-center">
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-[#2B2B2B] text-white py-12 border-y border-[#1A1A1A]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {[
              { number: "500+", label: "Projects Delivered" },
              { number: "200+", label: "Enterprise Clients" },
              { number: "10+", label: "Countries Served" },
              { number: "99%", label: "Client Satisfaction" }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center px-4">
                <span className="text-4xl md:text-5xl font-extrabold text-[#007BFF] mb-2 tracking-tight">{stat.number}</span>
                <span className="text-sm md:text-base text-gray-300 font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Services</h2>
            <div className="w-20 h-1.5 bg-[#007BFF] rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl text-lg">
              Comprehensive digital solutions tailored to elevate your business in the modern economy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Code size={32} />, title: "Web Development", desc: "Custom, scalable web applications built with cutting-edge technologies to drive business growth." },
              { icon: <Cpu size={32} />, title: "AI Solutions", desc: "Intelligent chatbots, predictive analytics, and machine learning models to automate your operations." },
              { icon: <Smartphone size={32} />, title: "Mobile Apps", desc: "Native and cross-platform mobile experiences that engage users on iOS and Android." },
              { icon: <Cloud size={32} />, title: "Cloud Services", desc: "Secure, reliable cloud infrastructure and migration services to ensure maximum uptime." },
              { icon: <Shield size={32} />, title: "Cybersecurity", desc: "Robust protection for your enterprise data and digital assets against modern threats." },
              { icon: <Database size={32} />, title: "ERP Solutions", desc: "Integrated enterprise resource planning to streamline your business processes end-to-end." }
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-[#007BFF] mb-6 group-hover:bg-[#007BFF] group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.desc}
                </p>
                <Link href="/services" className="inline-flex items-center gap-2 text-[#007BFF] font-semibold hover:text-blue-700 transition-colors">
                  Learn More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#007BFF] rounded-full blur-[120px] opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[120px] opacity-10 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to start your digital transformation?</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Partner with iTech Network Africa to build the innovative solutions your enterprise needs to thrive.
          </p>
          <Link href="/contact" className="inline-flex px-10 py-5 bg-[#007BFF] hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(0,123,255,0.4)] hover:shadow-[0_0_30px_rgba(0,123,255,0.6)] hover:-translate-y-1 items-center gap-3">
            Request a Consultation <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

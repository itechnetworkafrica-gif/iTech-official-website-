import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { Link } from 'wouter';
import { 
  Monitor, Smartphone, Code, Palette, PenTool, Layers, Cloud, 
  Terminal, Database, Zap, Headphones, Shield, Network, Video, 
  Globe, Server, Mail, ArrowRight 
} from 'lucide-react';

const services = [
  { icon: <Monitor size={24} />, title: "Web Development", slug: "web-development", desc: "Custom web applications built with modern frameworks for scale and performance." },
  { icon: <Palette size={24} />, title: "Website Design", slug: "website-design", desc: "Stunning, responsive websites that capture your brand's unique identity." },
  { icon: <Smartphone size={24} />, title: "Mobile App Dev", slug: "mobile-app-development", desc: "Native iOS and Android applications for seamless mobile experiences." },
  { icon: <Code size={24} />, title: "Software Dev", slug: "software-development", desc: "Bespoke enterprise software tailored to your specific business logic." },
  { icon: <Layers size={24} />, title: "UI/UX Design", slug: "ui-ux-design", desc: "User-centric interface design focused on engagement and conversion." },
  { icon: <PenTool size={24} />, title: "Graphic Design", slug: "graphic-design", desc: "Professional visual assets, marketing materials, and digital illustrations." },
  { icon: <Globe size={24} />, title: "Branding", slug: "branding", desc: "Complete brand identity packages, from logos to corporate guidelines." },
  { icon: <Cloud size={24} />, title: "Cloud Services", slug: "cloud-services", desc: "AWS, Azure, and Google Cloud infrastructure setup and migration." },
  { icon: <Terminal size={24} />, title: "API Development", slug: "api-development", desc: "Secure, scalable REST and GraphQL APIs to power your digital ecosystem." },
  { icon: <Database size={24} />, title: "Database Dev", slug: "database-development", desc: "Optimized database architecture design, implementation, and tuning." },
  { icon: <Zap size={24} />, title: "Business Automation", slug: "business-automation", desc: "Streamline workflows and eliminate manual tasks with smart automation." },
  { icon: <Headphones size={24} />, title: "IT Support", slug: "it-support", desc: "24/7 technical support and infrastructure maintenance for your business." },
  { icon: <Shield size={24} />, title: "Cybersecurity", slug: "cybersecurity", desc: "Vulnerability assessments, penetration testing, and security hardening." },
  { icon: <Network size={24} />, title: "Networking", slug: "networking", desc: "Enterprise network design, installation, and management." },
  { icon: <Video size={24} />, title: "CCTV Installation", slug: "cctv-installation", desc: "High-definition security camera systems and monitoring setups." },
  { icon: <Globe size={24} />, title: "Domain Registration", slug: "domain-registration", desc: "Secure your digital identity with global and regional domain extensions." },
  { icon: <Server size={24} />, title: "Web Hosting", slug: "web-hosting", desc: "Fast, reliable, and secure hosting solutions for businesses of all sizes." },
  { icon: <Mail size={24} />, title: "Email Hosting", slug: "email-hosting", desc: "Professional corporate email setups with advanced spam protection." }
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col w-full bg-[#F8F9FA]">
      <PageHero 
        badge="Our Expertise"
        title="World-Class Technology Services"
        subtitle="From robust enterprise software to strategic cloud infrastructure, we deliver solutions that drive growth and operational excellence."
        ctaPrimary={{ label: "Request a Quote", href: "/contact" }}
      />

      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden flex flex-col h-full"
            >
              {/* Hover left border accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3CB52A] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              
              <div className="w-14 h-14 rounded-xl bg-[#f0fdf0] text-[#3CB52A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              
              <h3 className="text-xl font-bold text-[#111827] mb-3">{service.title}</h3>
              <p className="text-[#6B7280] leading-relaxed mb-8 flex-grow">{service.desc}</p>
              
              <Link
                href={`/services/${service.slug}`}
                className="mt-auto text-[#0A1929] group-hover:text-[#3CB52A] font-semibold flex items-center gap-2 transition-colors"
              >
                Learn More <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process CTA */}
      <section className="bg-[#0A1929] py-20 lg:py-28 text-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need a custom solution not listed here?</h2>
          <p className="text-[#BDBDBD] text-lg mb-10">
            Our engineering team specializes in solving complex, unique business challenges. Let's discuss your specific requirements.
          </p>
          <Link href="/contact" className="inline-flex px-8 py-4 bg-[#3CB52A] text-white font-medium rounded-lg hover:bg-[#2e911f] transition-all shadow-lg shadow-[#3CB52A]/20">
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}

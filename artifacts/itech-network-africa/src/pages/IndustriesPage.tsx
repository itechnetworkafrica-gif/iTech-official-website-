import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { 
  Stethoscope, GraduationCap, Landmark, Building2, ShoppingCart, 
  Factory, Hotel, HeartHandshake, Wifi, Tractor, Home, Film, ArrowRight
} from 'lucide-react';
import { Link } from 'wouter';
import { useSEO } from '@/hooks/useSEO';

const industries = [
  { icon: <Stethoscope size={32} />, name: "Healthcare", desc: "Secure HMS, telemedicine platforms, and patient record systems compliant with medical data standards." },
  { icon: <GraduationCap size={32} />, name: "Education", desc: "E-learning platforms, campus management systems, and digital tools for modern institutions." },
  { icon: <Landmark size={32} />, name: "Finance & Banking", desc: "Core banking solutions, fintech apps, payment gateways, and highly secure financial infrastructure." },
  { icon: <Building2 size={32} />, name: "Government", desc: "E-governance portals, citizen service digitization, and secure public sector data management." },
  { icon: <ShoppingCart size={32} />, name: "Retail & Commerce", desc: "Omnichannel e-commerce, POS systems, and intelligent supply chain management." },
  { icon: <Factory size={32} />, name: "Manufacturing", desc: "ERP systems, IoT monitoring, and production line automation software." },
  { icon: <Hotel size={32} />, name: "Hospitality", desc: "Booking engines, property management systems, and guest experience applications." },
  { icon: <HeartHandshake size={32} />, name: "NGO & Non-Profit", desc: "Donor management, impact tracking portals, and secure field data collection tools." },
  { icon: <Wifi size={32} />, name: "Telecommunications", desc: "Billing systems, self-care portals, and network infrastructure management software." },
  { icon: <Tractor size={32} />, name: "Agriculture", desc: "Agritech apps, yield prediction AI, and supply chain tracking for the agricultural sector." },
  { icon: <Home size={32} />, name: "Real Estate", desc: "Property listing platforms, virtual tours, and tenant management systems." },
  { icon: <Film size={32} />, name: "Media & Entertainment", desc: "Streaming platforms, content management systems, and digital rights protection." }
];

export default function IndustriesPage() {
  useSEO({
    title: 'Industries We Serve — Technology Solutions by Sector',
    description: 'iTech Network Africa serves healthcare, education, retail, government and more with tailored technology solutions in Liberia and Africa.',
    canonical: '/industries',
  });
  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <PageHero 
        badge="Domain Expertise"
        title="Industries We Serve"
        subtitle="We build specialized, compliant, and scalable technology solutions tailored to the unique operational demands of diverse sectors."
      />

      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {industries.map((industry, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
              className="bg-[#F8F9FA] rounded-2xl p-8 border border-[#E5E7EB] hover:border-[#3CB52A] hover:bg-white hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full"
            >
              <div className="text-[#0A1929] group-hover:text-[#3CB52A] transition-colors mb-6">
                {industry.icon}
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">{industry.name}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6 flex-grow">{industry.desc}</p>
              
              <Link href="/contact" className="mt-auto flex items-center gap-2 text-sm font-semibold text-[#0A1929] group-hover:text-[#3CB52A] transition-colors">
                Explore Solutions <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A1929] py-20 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Don't see your industry?</h2>
          <p className="text-[#BDBDBD] mb-8">Our core technology frameworks are highly adaptable. We specialize in rapidly learning new domain logic and building custom solutions from the ground up.</p>
          <Link href="/contact" className="inline-flex px-8 py-3 bg-[#3CB52A] text-white font-medium rounded-lg hover:bg-[#2e911f] transition-all">
            Discuss Your Requirements
          </Link>
        </div>
      </section>
    </div>
  );
}

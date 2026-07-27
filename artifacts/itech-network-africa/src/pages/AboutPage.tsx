import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { Target, Lightbulb, Heart, Globe, Award, Briefcase, Zap, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero 
        badge="Company Overview"
        title="About iTech Network Africa"
        subtitle="A pan-African technology powerhouse founded in Monrovia, Liberia, dedicated to transforming the continent through digital innovation."
      />

      {/* Our Story */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <h4 className="text-[#3CB52A] font-bold tracking-wider uppercase text-sm mb-3">Our Story</h4>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">From Monrovia to the World</h2>
              <p className="text-[#6B7280] text-lg mb-6 leading-relaxed">
                Founded by visionary entrepreneur Wilmot Kerkulah in Monrovia, Liberia, iTech Network Africa began with a singular mission: to bridge the technological divide in West Africa. 
              </p>
              <p className="text-[#6B7280] text-lg mb-8 leading-relaxed">
                What started as a specialized IT consultancy has rapidly evolved into a comprehensive technology powerhouse. Powered by Gotecx, we now serve over 10 countries across the continent, delivering enterprise-grade software, AI solutions, and digital infrastructure to governments, financial institutions, and growing businesses.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#E5E7EB]">
                <div>
                  <div className="text-3xl font-bold text-[#0A1929] mb-1">2018</div>
                  <div className="text-[#6B7280] text-sm font-medium">Year Founded</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0A1929] mb-1">HQ</div>
                  <div className="text-[#6B7280] text-sm font-medium">Monrovia, Liberia</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]"
            >
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                alt="Corporate building" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1929] via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="font-bold text-xl mb-2">Empowering Africa</p>
                <p className="text-white/80 text-sm">Building the digital foundation for tomorrow's enterprises.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeInUp} className="bg-white p-10 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#f0fdf0] text-[#3CB52A] flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#111827] mb-4">Our Mission</h3>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                Empowering businesses, governments, and communities across Africa through innovative technology, AI solutions, enterprise software, and digital transformation. We build scalable systems that solve real-world challenges.
              </p>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="bg-white p-10 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#f0fdf0] text-[#3CB52A] flex items-center justify-center mb-6">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#111827] mb-4">Our Vision</h3>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                To be the catalyst for Africa's technological renaissance, creating a digitally integrated continent where every enterprise has access to world-class software and infrastructure.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 lg:py-28 bg-[#0A1929] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h4 className="text-[#3CB52A] font-bold tracking-wider uppercase text-sm mb-3">Core Values</h4>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What Drives Us Forward</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Lightbulb size={24} />, title: "Innovation", desc: "We constantly push boundaries, adopting AI and modern tech to solve complex problems." },
              { icon: <ShieldCheck size={24} />, title: "Integrity", desc: "Transparency, security, and honest partnerships are the foundation of our work." },
              { icon: <Briefcase size={24} />, title: "Impact", desc: "We measure success by the tangible growth and efficiency we deliver to our clients." },
              { icon: <Heart size={24} />, title: "Inclusivity", desc: "Building tech that works for everyone, bridging gaps across regions and demographics." }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#112236] p-8 rounded-2xl border border-white/5 hover:border-[#3CB52A]/50 transition-colors"
              >
                <div className="text-[#3CB52A] mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-[#BDBDBD] leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h4 className="text-[#3CB52A] font-bold tracking-wider uppercase text-sm mb-3">Leadership</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">Meet The Minds Behind iTech</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Founder */}
            <motion.div {...fadeInUp} className="group">
              <div className="bg-[#F8F9FA] rounded-2xl aspect-square mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-[#0A1929]/5 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" 
                  alt="Wilmot Kerkulah" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">Wilmot Kerkulah</h3>
              <p className="text-[#3CB52A] font-medium mb-3">CEO & Founder</p>
              <p className="text-[#6B7280] text-sm leading-relaxed">Visionary leader dedicated to positioning Africa at the forefront of global technological innovation.</p>
            </motion.div>
            
            {/* Placeholders for other leaders */}
            {[
              { name: "Sarah Johnson", role: "Chief Technology Officer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
              { name: "Michael Osei", role: "Head of AI Solutions", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" },
              { name: "David Mensah", role: "VP of Enterprise Software", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
              { name: "Aisha Diallo", role: "Director of Operations", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" },
              { name: "James Koffi", role: "Head of Cloud Infrastructure", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" }
            ].map((member, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: (i+1) * 0.1 }} className="group">
                <div className="bg-[#F8F9FA] rounded-2xl aspect-square mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#0A1929]/5 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">{member.name}</h3>
                <p className="text-[#3CB52A] font-medium mb-3">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-[#3CB52A] font-bold tracking-wider uppercase text-sm mb-3">Our Journey</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">Growth & Evolution</h2>
          </div>
          
          <div className="space-y-12">
            {[
              { year: "2018", title: "Foundation", desc: "iTech Network Africa established in Monrovia, Liberia as a boutique IT consultancy." },
              { year: "2019", title: "First Major Contract", desc: "Secured enterprise software development for top financial institutions." },
              { year: "2021", title: "Regional Expansion", desc: "Expanded operations to 5 West African countries, launching cloud services." },
              { year: "2023", title: "AI Division Launch", desc: "Introduced dedicated AI and Machine Learning solutions for enterprise automation." },
              { year: "2025", title: "Pan-African Scale", desc: "Operating in 10+ countries, serving over 200 enterprise clients globally." }
            ].map((milestone, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6 md:gap-12 relative"
              >
                {/* Connecting line */}
                {i !== 4 && <div className="absolute left-8 top-16 bottom-[-3rem] w-px bg-[#E5E7EB]"></div>}
                
                <div className="w-16 shrink-0 text-right pt-2">
                  <span className="text-xl font-bold text-[#3CB52A]">{milestone.year}</span>
                </div>
                
                <div className="w-4 h-4 rounded-full bg-[#3CB52A] shrink-0 mt-3 ring-4 ring-[#f0fdf0] relative z-10"></div>
                
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex-grow">
                  <h3 className="text-xl font-bold text-[#111827] mb-2">{milestone.title}</h3>
                  <p className="text-[#6B7280]">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

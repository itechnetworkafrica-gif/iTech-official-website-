import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { CheckCircle2, Clock, Calendar, Briefcase } from 'lucide-react';

const projects = [
  {
    id: 1,
    client: "Liberia Revenue Authority",
    title: "Digital Tax Payment Gateway",
    desc: "A comprehensive digital portal allowing citizens and businesses to file and pay taxes online securely, integrated with major mobile money providers and banks.",
    status: "Completed",
    year: "2023",
    tech: ["React", "Node.js", "PostgreSQL", "AWS"]
  },
  {
    id: 2,
    client: "West Africa Energy Grid",
    title: "Smart Grid Monitoring Dashboard",
    desc: "Real-time analytics dashboard monitoring power distribution, detecting outages instantly, and predicting maintenance needs using IoT sensors.",
    status: "In Progress",
    year: "2024",
    tech: ["Vue.js", "Python", "InfluxDB", "TensorFlow"]
  },
  {
    id: 3,
    client: "Monrovia Logistics Hub",
    title: "Automated Port Clearance System",
    desc: "Digitization of port customs clearance processes, reducing container dwell time from 14 days to 48 hours through automated document verification.",
    status: "Completed",
    year: "2022",
    tech: ["Angular", "Java Spring", "Oracle", "Docker"]
  },
  {
    id: 4,
    client: "Pan-African Healthcare Network",
    title: "Telemedicine Platform V2",
    desc: "Upgrading existing infrastructure to support high-definition video consultations across low-bandwidth areas using custom compression algorithms.",
    status: "In Progress",
    year: "2024",
    tech: ["WebRTC", "React Native", "Go", "Redis"]
  },
  {
    id: 5,
    client: "National Education Ministry",
    title: "Unified Student ID System",
    desc: "Planning phase for a nationwide digital ID system for all students to track enrollment, performance, and resource allocation across public schools.",
    status: "Planning",
    year: "2025",
    tech: ["Next.js", "GraphQL", "MongoDB", "Kubernetes"]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Planning': return 'bg-amber-100 text-amber-700 border-amber-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed': return <CheckCircle2 size={14} className="mr-1.5" />;
    case 'In Progress': return <Clock size={14} className="mr-1.5" />;
    case 'Planning': return <Calendar size={14} className="mr-1.5" />;
    default: return null;
  }
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <PageHero 
        badge="Active & Past Work"
        title="Project Timeline"
        subtitle="A transparent view into our major enterprise implementations, current developments, and upcoming initiatives."
      />

      <section className="py-20 lg:py-28 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="relative border-l-2 border-[#E5E7EB] pl-8 ml-4 md:ml-0 md:pl-0 md:border-none space-y-16">
          {projects.map((project, i) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative md:flex items-start justify-between gap-12 group"
            >
              {/* Timeline dot for Mobile (left) */}
              <div className="absolute -left-[41px] top-1 md:hidden w-5 h-5 rounded-full bg-white border-4 border-[#3CB52A] shadow-sm"></div>
              
              {/* Timeline Line & Dot for Desktop (center) */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-[-4rem] w-0.5 bg-[#E5E7EB] -translate-x-1/2 group-last:bottom-0 z-0"></div>
              <div className="hidden md:block absolute left-1/2 top-6 w-5 h-5 rounded-full bg-white border-4 border-[#3CB52A] shadow-sm -translate-x-1/2 z-10 ring-4 ring-white"></div>

              {/* Left Column (Year & Client on Desktop) */}
              <div className="md:w-[45%] md:text-right pt-2 mb-4 md:mb-0">
                <div className="text-3xl font-black text-[#0A1929]/10 mb-1 hidden md:block">{project.year}</div>
                <div className="inline-flex items-center text-sm font-bold text-[#3CB52A] mb-2 uppercase tracking-wider">
                  <Briefcase size={14} className="mr-2 md:hidden" />
                  {project.client}
                </div>
                <div className="md:hidden text-lg font-bold text-[#111827] mb-2">{project.year}</div>
              </div>
              
              {/* Right Column (Card) */}
              <div className="md:w-[45%] bg-[#F8F9FA] rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#111827] pr-4">{project.title}</h3>
                </div>
                
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border mb-4 ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  {project.status}
                </div>
                
                <p className="text-[#6B7280] mb-6 leading-relaxed">
                  {project.desc}
                </p>
                
                <div>
                  <div className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">Tech Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(t => (
                      <span key={t} className="px-3 py-1 bg-white border border-[#E5E7EB] text-[#6B7280] text-xs font-medium rounded-md shadow-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Lock, LayoutDashboard, FolderOpen, FileText, Headphones, Download, ArrowRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: EASE },
};

const portalFeatures = [
  { icon: <LayoutDashboard size={22} />, title: 'Dashboard', desc: 'Real-time overview of all your active projects and account status.' },
  { icon: <FolderOpen size={22} />, title: 'My Projects', desc: 'Track progress, milestones, and deliverables for every project.' },
  { icon: <FileText size={22} />, title: 'Invoices', desc: 'View, download, and manage all your invoices and payment history.' },
  { icon: <Headphones size={22} />, title: 'Support Tickets', desc: 'Raise and track support requests with our technical team.' },
  { icon: <Download size={22} />, title: 'Downloads', desc: 'Access project files, reports, and deliverable assets.' },
];

export default function ClientPortalPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative bg-[#060E18] pt-20 pb-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3CB52A]/10 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-8">
              <Lock size={13} className="text-[#3CB52A]" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Secure Access</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Client Portal</h1>
            <p className="text-white/60 text-xl max-w-xl mx-auto mb-10">
              Manage your projects, invoices, and support — all in one secure place.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-4 bg-[#3CB52A] text-white font-bold rounded-xl hover:bg-[#2da822] transition-all shadow-[0_0_32px_rgba(60,181,42,0.3)]">
                Log In to Portal
              </button>
              <Link href="/contact" className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/15 hover:bg-white/10 transition-all">
                Request Access
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div {...fadeUp} className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A0A]">Everything You Need</h2>
            <p className="mt-4 text-[#6B7280]">Your dedicated workspace for all iTech projects and services.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portalFeatures.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-[#F8F9FA] rounded-2xl p-7 border border-[#E5E7EB] hover:border-[#3CB52A]/30 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] group-hover:bg-[#3CB52A] text-[#3CB52A] group-hover:text-white flex items-center justify-center mb-5 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#0A0A0A] mb-2">{f.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#3CB52A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Not a client yet?</h2>
          <p className="text-white/80 mb-8">Start your project with us and get instant access to your portal.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#0A1929] text-white font-bold rounded-xl hover:bg-[#060E18] transition-all">
            Get Started <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}

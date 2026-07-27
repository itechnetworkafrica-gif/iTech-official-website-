import React, { useState } from 'react';
import { PageHero } from '@/components/PageHero';
import { Check, X } from 'lucide-react';
import { Link } from 'wouter';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA] min-h-screen">
      <PageHero badge="Plans & Subscriptions" title="Transparent Pricing" subtitle="Choose the right enterprise plan for your organization's digital transformation journey." />

      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8 w-full -mt-20 relative z-10">
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-sm font-semibold ${!annual ? 'text-[#111827]' : 'text-[#6B7280]'}`}>Monthly</span>
          <button 
            onClick={() => setAnnual(!annual)}
            className="w-14 h-7 rounded-full bg-[#0A1929] relative transition-colors duration-300"
          >
            <div className={`w-5 h-5 rounded-full bg-[#3CB52A] absolute top-1 transition-transform duration-300 ${annual ? 'translate-x-8' : 'translate-x-1'}`}></div>
          </button>
          <span className={`text-sm font-semibold flex items-center gap-2 ${annual ? 'text-[#111827]' : 'text-[#6B7280]'}`}>
            Annual <span className="bg-[#3CB52A]/20 text-[#3CB52A] text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Save 20%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Starter */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E7EB] flex flex-col h-full">
            <h3 className="text-xl font-bold text-[#111827] mb-2">Starter</h3>
            <p className="text-[#6B7280] text-sm mb-6">Perfect for small businesses starting their digital journey.</p>
            <div className="text-4xl font-black text-[#111827] mb-8">${annual ? '239' : '299'}<span className="text-base font-medium text-[#6B7280]">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-grow">
              {["5 Core Services", "Basic Support (48h SLA)", "Shared Server Hosting", "Standard Security", "1 API Integration"].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#111827]"><Check size={18} className="text-[#3CB52A]" /> {f}</li>
              ))}
              {["AI Capabilities", "Dedicated Account Manager"].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#6B7280]/50"><X size={18} /> {f}</li>
              ))}
            </ul>
            <Link href="/contact" className="block text-center w-full py-3 rounded-lg border-2 border-[#E5E7EB] text-[#111827] font-semibold hover:border-[#3CB52A] transition-colors">Select Starter</Link>
          </div>

          {/* Professional */}
          <div className="bg-[#0A1929] rounded-3xl p-8 shadow-xl border border-[#0A1929] relative flex flex-col h-full transform scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3CB52A] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</div>
            <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
            <p className="text-[#BDBDBD] text-sm mb-6">For growing companies needing robust, integrated systems.</p>
            <div className="text-4xl font-black text-white mb-8">${annual ? '639' : '799'}<span className="text-base font-medium text-[#BDBDBD]">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-grow">
              {["15 Core Services", "Priority Support (12h SLA)", "Dedicated Cloud Instance", "Advanced Cybersecurity", "5 API Integrations", "Basic AI Chatbot", "Monthly Strategy Call"].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-white"><Check size={18} className="text-[#3CB52A]" /> {f}</li>
              ))}
            </ul>
            <Link href="/contact" className="block text-center w-full py-3 rounded-lg bg-[#3CB52A] text-white font-semibold hover:bg-[#2e911f] transition-colors">Select Professional</Link>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E7EB] flex flex-col h-full">
            <h3 className="text-xl font-bold text-[#111827] mb-2">Enterprise</h3>
            <p className="text-[#6B7280] text-sm mb-6">Massive scale solutions for governments and large corporations.</p>
            <div className="text-4xl font-black text-[#111827] mb-8">Custom</div>
            <ul className="space-y-4 mb-8 flex-grow">
              {["Unlimited Services", "24/7 Support (1h SLA)", "Custom Multi-Cloud Architecture", "Enterprise Security Audit", "Unlimited API Integrations", "Custom ML/AI Models", "Dedicated Engineering Team"].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#111827]"><Check size={18} className="text-[#3CB52A]" /> {f}</li>
              ))}
            </ul>
            <Link href="/contact" className="block text-center w-full py-3 rounded-lg border-2 border-[#111827] text-[#111827] font-semibold hover:bg-[#111827] hover:text-white transition-colors">Contact Sales</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

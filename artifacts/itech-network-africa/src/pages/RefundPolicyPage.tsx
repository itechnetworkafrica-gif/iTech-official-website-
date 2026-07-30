import React from 'react';
import { motion } from 'framer-motion';

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative bg-[#060E18] pt-20 pb-20 overflow-hidden">
        <img src="/hero-group-phone.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 0.28 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(6,14,24,0.97) 0%, rgba(6,14,24,0.85) 60%, rgba(6,14,24,0.65) 100%)' }} />
        <div className="max-w-4xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Refund Policy
          </motion.h1>
          <p className="text-white/50">Last updated: January 2025</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 prose prose-gray max-w-none">
          <h2>Overview</h2>
          <p>At iTech Network Africa, we are committed to delivering high-quality technology solutions. This Refund Policy outlines the conditions under which refunds may be granted.</p>
          <h2>Service Deposits</h2>
          <p>Project deposits are non-refundable once work has commenced. Deposits secure your slot in our project pipeline and cover initial discovery and planning costs.</p>
          <h2>Project Cancellations</h2>
          <p>If you cancel a project before work begins, you are entitled to a full refund of any payments made. Once a project milestone has been completed and approved, that milestone payment is non-refundable.</p>
          <h2>Hosting & Domain Services</h2>
          <p>Hosting and domain registration fees are non-refundable after the service period has commenced. Unused portions of annual hosting plans may be refunded on a pro-rated basis at our discretion.</p>
          <h2>Digital Products</h2>
          <p>Due to the nature of digital products, all sales are final once access has been granted or a download link has been delivered.</p>
          <h2>Contact Us</h2>
          <p>For refund requests or disputes, please contact us at <a href="mailto:support@itechnetworkafrica.com">support@itechnetworkafrica.com</a> or call +231761978796.</p>
        </div>
      </section>
    </div>
  );
}

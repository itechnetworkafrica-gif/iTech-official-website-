import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Mail, Phone, LifeBuoy,
  Headphones, CheckCircle2, ArrowRight, HelpCircle,
  Search, Globe, Shield, Cloud, Code2, Cpu, Server, Users, Video,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const formSchema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(5, 'Subject required'),
  message: z.string().min(10, 'Message required'),
});

const SUPPORT_CATEGORIES = [
  { icon: Globe,   label: 'Web & Mobile Apps' },
  { icon: Cloud,   label: 'Cloud & Infrastructure' },
  { icon: Shield,  label: 'Cybersecurity' },
  { icon: Code2,   label: 'Software Development' },
  { icon: Cpu,     label: 'AI & Automation' },
  { icon: Server,  label: 'IT Support & Managed Services' },
  { icon: Users,   label: 'Digital Transformation' },
  { icon: Video,   label: 'Training & Capacity Building' },
];

const faqs = [
  { q: 'What is your typical response time?', a: 'For enterprise clients on a standard SLA, our response time is under 1 hour. For general inquiries, we aim to respond within 24 business hours.' },
  { q: 'How do I report a critical system outage?', a: 'If you are an active enterprise client, please use the dedicated emergency phone number provided in your SLA documentation for immediate 24/7 technical routing.' },
  { q: 'Do you offer remote troubleshooting?', a: 'Yes, our engineers can securely access your systems remotely to diagnose and resolve software and infrastructure issues.' },
  { q: 'Where can I find API documentation?', a: 'All API documentation is available in the Resources section. You will need your developer access token to view specific restricted endpoints.' },
  { q: 'Can I upgrade my support tier?', a: 'Absolutely. Contact your account manager or email support to upgrade to our Priority or Dedicated Support tiers.' },
  { q: 'How are software updates handled?', a: 'SaaS products are updated automatically. For on-premise deployments, our team coordinates with your IT department for scheduled maintenance windows.' },
  { q: 'Do you provide end-user training?', a: 'Yes, all major software deployments include comprehensive training sessions for administrators and end-users, along with digital manuals.' },
  { q: 'What security compliance do you adhere to?', a: 'We build systems compliant with ISO 27001, GDPR, and regional African data protection regulations.' },
];

export default function SupportPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  function onSubmit() {
    toast({ title: 'Ticket Created', description: 'Your support ticket has been logged. Our team will be in touch within 1 hour.' });
    form.reset();
  }

  const filteredFaqs = faqs.filter(f =>
    !searchQuery.trim() ||
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col w-full bg-white">

      {/* ══════════════════════════════════════
          HERO — GoDaddy-style: person LEFT, search RIGHT
      ══════════════════════════════════════ */}
      <section className="relative bg-[#DFF0F7] overflow-hidden">
        {/* Soft background blobs */}
        <div className="absolute -top-20 -left-20 w-[380px] h-[380px] rounded-full bg-[#BDE4F3]/40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[260px] h-[260px] rounded-full bg-[#C8EBF8]/35 pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 pt-0 pb-0 grid lg:grid-cols-[1fr_1.1fr] gap-0 items-end">

          {/* LEFT: person image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="hidden lg:flex items-end relative h-[340px]"
          >
            {/* Name badge — top right of photo */}
            <div className="absolute top-4 right-4 text-right z-20 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
              <div className="text-xs font-bold text-[#374151]">Alvina K.</div>
              <div className="text-xs text-[#9CA3AF]">iTech Support Guide</div>
            </div>
            <img
              src="/team-alvina.png"
              alt="iTech Support Guide"
              className="h-full object-cover object-top"
              style={{ maxWidth: '340px' }}
            />
          </motion.div>

          {/* RIGHT: heading + search bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
            className="pb-14 pt-14 pl-0 lg:pl-10"
          >
            {/* Brand badge */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-full bg-[#3CB52A]/15 flex items-center justify-center">
                <Headphones size={14} className="text-[#3CB52A]" />
              </div>
              <span className="text-[#374151] font-semibold text-sm">iTech Support Guides</span>
            </div>

            <h1 className="text-4xl lg:text-[3rem] font-black text-[#111827] leading-[1.08] mb-3 tracking-tight">
              Help Center
            </h1>
            <p className="text-[#4B5563] text-base leading-relaxed mb-7 max-w-sm">
              Find guides, troubleshoot issues, or connect with our expert support team — 24/7.
            </p>

            {/* Search bar */}
            <div className="relative max-w-[440px]">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="What can we help you with?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#D1D5DB] bg-white text-[#111827] placeholder:text-[#9CA3AF] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/40 focus:border-[#3CB52A] transition-all"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#111827] hover:bg-[#1f2937] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                Search
              </button>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-5 mt-6">
              {['Under 1-hr response', '24/7 availability', 'Expert engineers'].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#3CB52A] shrink-0" />
                  <span className="text-[#6B7280] text-xs font-medium">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SUPPORT CATEGORIES — icon list row
      ══════════════════════════════════════ */}
      <section className="bg-white border-b border-[#F3F4F6]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1">
            {SUPPORT_CATEGORIES.map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-2.5 px-3 py-4 rounded-xl hover:bg-[#F9FAFB] transition-colors group text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#F3F4F6] group-hover:bg-[#ECFDF5] flex items-center justify-center transition-colors">
                  <Icon size={18} className="text-[#374151] group-hover:text-[#3CB52A] transition-colors" />
                </div>
                <span className="text-[11px] font-semibold text-[#374151] leading-tight group-hover:text-[#111827] transition-colors">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SUPPORT CHANNELS CARD — overlapping
      ══════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 w-full -mt-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden"
        >
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#F3F4F6]">

            {/* Chat Now */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#111827] mb-2">Chat Now</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5">
                Chat for quick help on product issues, your account, and more.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <button className="inline-flex items-center gap-2 bg-[#111827] hover:bg-[#1f2937] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                  <MessageSquare size={15} />
                  Chat Now
                </button>
                <a
                  href="https://wa.me/231761978796"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#E5E7EB] hover:border-[#25D366] text-[#111827] hover:text-[#25D366] text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
              <p className="text-xs text-[#9CA3AF] font-medium">7×24 availability</p>
            </div>

            {/* Email Support */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#111827] mb-2">Email Support</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5">
                Send a detailed message and we'll reply within 24 business hours.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <a
                  href="mailto:support@itechnetworkafrica.com"
                  className="inline-flex items-center gap-2 bg-[#111827] hover:bg-[#1f2937] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  <Mail size={15} />
                  Email Us
                </a>
                <button
                  onClick={() => document.getElementById('ticket-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 border border-[#E5E7EB] hover:border-[#3CB52A] text-[#111827] hover:text-[#3CB52A] text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  Open Ticket
                </button>
              </div>
              <p className="text-xs text-[#9CA3AF] font-medium">Response within 24h</p>
            </div>

            {/* Phone */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#111827] mb-2">Call Us</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5">
                Speak directly with our technical team for urgent or complex issues.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <a
                  href="tel:+231761978796"
                  className="inline-flex items-center gap-2 bg-[#111827] hover:bg-[#1f2937] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  <Phone size={15} />
                  +231 761 978 796
                </a>
              </div>
              <p className="text-xs text-[#9CA3AF] font-medium">Mon–Fri 8am–6pm WAT · Emergencies 24/7</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          TICKET FORM + FAQ
      ══════════════════════════════════════ */}
      <section className="py-20 lg:py-28 max-w-[1200px] mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Ticket Form */}
          <div id="ticket-form" className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E7EB]">
            <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] text-[#3CB52A] flex items-center justify-center mb-5">
              <LifeBuoy size={22} />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Open a Support Ticket</h2>
            <p className="text-[#6B7280] mb-8 text-sm leading-relaxed">
              Describe your issue in detail so our engineers can assist you efficiently.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#374151] font-semibold text-sm">Full Name</FormLabel>
                    <FormControl><Input placeholder="Your full name" className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#374151] font-semibold text-sm">Account Email</FormLabel>
                    <FormControl><Input placeholder="you@company.com" className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="subject" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#374151] font-semibold text-sm">Subject</FormLabel>
                    <FormControl><Input placeholder="Brief description of the issue" className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#374151] font-semibold text-sm">Detailed Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please include error codes, screenshots references, and steps to reproduce..."
                        rows={6}
                        className="resize-none rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <button
                  type="submit"
                  className="w-full bg-[#3CB52A] hover:bg-[#2e911f] text-white py-3.5 rounded-xl font-bold transition-colors mt-2 flex items-center justify-center gap-2"
                >
                  Submit Ticket <ArrowRight size={16} />
                </button>
              </form>
            </Form>
          </div>

          {/* FAQ */}
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] text-[#3CB52A] flex items-center justify-center mb-5">
              <HelpCircle size={22} />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Frequently Asked Questions</h2>
            <p className="text-[#6B7280] mb-8 text-sm leading-relaxed">
              Quick answers to common administrative and technical questions.
            </p>
            {filteredFaqs.length === 0 && (
              <p className="text-[#9CA3AF] text-sm py-4">No results for "<strong>{searchQuery}</strong>". Try a different term.</p>
            )}
            <Accordion type="single" collapsible className="w-full space-y-3">
              {filteredFaqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-white border border-[#E5E7EB] rounded-xl px-5 data-[state=open]:border-[#3CB52A] transition-colors"
                >
                  <AccordionTrigger className="hover:no-underline font-semibold text-[#111827] text-left py-4 text-sm">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#6B7280] pb-4 text-sm leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}

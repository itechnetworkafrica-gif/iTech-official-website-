import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Search, MessageSquare, Phone, Mail, FileText, BookOpen,
  Zap, Shield, Cloud, Code2, Globe, Cpu, Server, Users,
  ChevronDown, ArrowRight, CheckCircle2, Clock, LifeBuoy,
  Video, Headphones, AlertCircle, TicketCheck, MonitorCheck,
  Star, ChevronRight, ExternalLink, HelpCircle, Wrench,
  Database, Wifi, Lock, RefreshCw, Activity,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHero } from '@/components/PageHero';

const RECIPIENT = 'itechnetworkafrica@gmail.com';

/* ─── data ──────────────────────────────────────────────────────────────── */

const STATS = [
  { value: '98.9%', label: 'Uptime SLA', icon: <Activity size={20} /> },
  { value: '<1 hr', label: 'Avg. First Response', icon: <Clock size={20} /> },
  { value: '5,000+', label: 'Tickets Resolved', icon: <TicketCheck size={20} /> },
  { value: '4.9 / 5', label: 'Customer Rating', icon: <Star size={20} /> },
];

const STATUS_SERVICES = [
  { name: 'Web Hosting Infrastructure', status: 'operational' },
  { name: 'Client Portal & Dashboard', status: 'operational' },
  { name: 'Email Services', status: 'operational' },
  { name: 'API Gateway', status: 'operational' },
  { name: 'CDN & Asset Delivery', status: 'operational' },
  { name: 'Database Clusters', status: 'operational' },
];

const QUICK_ACTIONS = [
  {
    icon: <MessageSquare size={26} />,
    title: 'Live Chat',
    description: 'Chat with a support agent in real time.',
    badge: 'Online now',
    badgeColor: 'bg-[#3CB52A]/15 text-[#3CB52A]',
    action: { label: 'Start Chat', href: '/contact' },
    accent: true,
  },
  {
    icon: <TicketCheck size={26} />,
    title: 'Submit a Ticket',
    description: 'Log an issue and track it to resolution.',
    badge: '< 1 hr response',
    badgeColor: 'bg-blue-50 text-blue-600',
    action: { label: 'Open Ticket', href: '#ticket' },
    accent: false,
  },
  {
    icon: <Phone size={26} />,
    title: 'Call Support',
    description: 'Speak directly with a technical engineer.',
    badge: 'Mon–Fri 8AM–6PM WAT',
    badgeColor: 'bg-amber-50 text-amber-600',
    action: { label: 'Call Now', href: 'tel:+231761798796' },
    accent: false,
  },
  {
    icon: <Mail size={26} />,
    title: 'Email Us',
    description: 'Send a detailed request to our team.',
    badge: '24 hr response',
    badgeColor: 'bg-purple-50 text-purple-600',
    action: { label: 'Send Email', href: 'mailto:itechnetworkafrica@gmail.com' },
    accent: false,
  },
  {
    icon: <BookOpen size={26} />,
    title: 'Knowledge Base',
    description: 'Browse guides, tutorials, and how-tos.',
    badge: '200+ articles',
    badgeColor: 'bg-slate-100 text-slate-600',
    action: { label: 'Browse Docs', href: '/resources' },
    accent: false,
  },
  {
    icon: <Video size={26} />,
    title: 'Video Tutorials',
    description: 'Step-by-step video walkthroughs.',
    badge: 'Free access',
    badgeColor: 'bg-rose-50 text-rose-500',
    action: { label: 'Watch Now', href: '/resources' },
    accent: false,
  },
];

const HELP_CATEGORIES = [
  { icon: <Globe size={22} />, title: 'Web & Mobile Apps', count: 34, href: '/resources' },
  { icon: <Cloud size={22} />, title: 'Cloud & Hosting', count: 28, href: '/resources' },
  { icon: <Shield size={22} />, title: 'Cybersecurity', count: 19, href: '/resources' },
  { icon: <Code2 size={22} />, title: 'Software Development', count: 41, href: '/resources' },
  { icon: <Cpu size={22} />, title: 'AI & Automation', count: 16, href: '/resources' },
  { icon: <Server size={22} />, title: 'IT Infrastructure', count: 23, href: '/resources' },
  { icon: <Users size={22} />, title: 'Digital Marketing', count: 15, href: '/resources' },
  { icon: <Database size={22} />, title: 'Data & Databases', count: 12, href: '/resources' },
  { icon: <Lock size={22} />, title: 'Account & Billing', count: 9, href: '/resources' },
];

const SLA_TIERS = [
  {
    name: 'Standard',
    price: 'Included',
    color: 'border-[#E5E7EB]',
    features: [
      '24-hr email response',
      'Business hours support',
      'Access to knowledge base',
      'Community forum access',
    ],
    cta: 'Current plan',
    ctaStyle: 'border-2 border-[#E5E7EB] text-[#6B7280]',
  },
  {
    name: 'Priority',
    price: 'Contact Sales',
    color: 'border-[#3CB52A]/40 shadow-[0_8px_40px_rgba(60,181,42,0.12)]',
    popular: true,
    features: [
      '< 4-hr first response',
      'Priority queue routing',
      'Dedicated Slack channel',
      'Monthly strategy review',
      'Remote troubleshooting',
    ],
    cta: 'Get Priority Support',
    ctaStyle: 'bg-[#3CB52A] text-white shadow-[0_8px_24px_rgba(60,181,42,0.35)]',
  },
  {
    name: 'Dedicated',
    price: 'Enterprise',
    color: 'border-[#0A1929]',
    features: [
      '< 1-hr response, 24 / 7',
      'Named account engineer',
      'Proactive monitoring',
      'Quarterly business reviews',
      'Custom SLA agreement',
      'Onsite support available',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'bg-[#0A1929] text-white',
  },
];

const FAQS = [
  { q: 'What is your typical response time?', a: 'Enterprise clients on a Priority or Dedicated SLA receive responses within 1–4 hours. For general support tickets, we respond within 24 business hours.' },
  { q: 'How do I report a critical system outage?', a: 'Enterprise clients should use the dedicated emergency line in their SLA documentation for 24/7 immediate routing. Others can submit an urgent ticket marked "Critical" above.' },
  { q: 'Do you offer remote troubleshooting?', a: 'Yes. Our engineers can securely access your systems via TeamViewer or our internal tooling to diagnose and resolve software and infrastructure issues in real time.' },
  { q: 'Can I upgrade my support tier at any time?', a: 'Absolutely. Contact your account manager or email us to upgrade to Priority or Dedicated support. Changes take effect within one business day.' },
  { q: 'How are software updates and patches handled?', a: 'SaaS platforms are updated automatically during low-traffic windows. For on-premise deployments, our team coordinates with your IT department on scheduled maintenance.' },
  { q: 'Do you provide end-user training?', a: 'Yes. All major deployments include comprehensive training sessions for administrators and end-users, plus digital manuals and on-demand video tutorials.' },
  { q: 'What security and compliance standards do you follow?', a: 'We build systems compliant with ISO 27001, GDPR, and regional African data protection regulations. Security audits are available for enterprise clients.' },
  { q: 'Where can I find API documentation?', a: 'Full API documentation is in the Resources section. Developer access tokens can be issued from the Client Portal. Contact us if you need elevated API access.' },
];

const formSchema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  category: z.string().min(1, 'Select a category'),
  priority: z.string().min(1, 'Select priority'),
  subject: z.string().min(5, 'Subject required'),
  message: z.string().min(10, 'Please describe your issue in detail'),
});

/* ─── sub-components ─────────────────────────────────────────────────────── */

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: i * 0.04 }}
      className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F8F9FA] transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#111827] pr-4 text-sm">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-[#3CB52A]' : 'text-[#9CA3AF]'}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 pt-3 text-[#6B7280] text-sm leading-relaxed border-t border-[#F3F4F6]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── main page ──────────────────────────────────────────────────────────── */

export default function SupportPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = FAQS.filter(
    ({ q, a }) =>
      !search ||
      q.toLowerCase().includes(search.toLowerCase()) ||
      a.toLowerCase().includes(search.toLowerCase()),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '', email: '', phone: '', company: '',
      category: '', priority: '', subject: '', message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const subject = `[Support – ${values.priority}] ${values.subject} — ${values.name}`;
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone || 'N/A'}`,
      `Company: ${values.company || 'N/A'}`,
      `Category: ${values.category}`,
      `Priority: ${values.priority}`,
      `Subject: ${values.subject}`,
      '',
      'Issue Description:',
      values.message,
    ].join('\n');

    window.open(
      `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_blank',
    );
    setSubmitted(true);
    form.reset();
    toast({ title: 'Ticket Ready', description: 'Your email client has opened. Hit Send to submit.' });
  }

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA] min-h-screen">

      {/* ── Hero ── */}
      <PageHero
        badge="Support Center"
        title="How Can We Help You?"
        subtitle="World-class support for every iTech Network client. Find answers, submit tickets, or connect directly with our engineering team."
        ctaPrimary={{ label: 'Submit a Ticket', href: '#ticket' }}
        ctaSecondary={{ label: 'Browse Knowledge Base', href: '/resources' }}
      />

      {/* ── Stats bar ── */}
      <div className="bg-[#0A1929] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[#3CB52A]">{s.icon}</span>
                <span className="text-2xl font-black text-white">{s.value}</span>
                <span className="text-xs text-white/45 font-medium">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <section id="help" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#3CB52A]/10 border border-[#3CB52A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A]" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Get Help Fast</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-3">Choose Your Support Channel</h2>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">Multiple ways to reach us — pick what works best for your situation.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {QUICK_ACTIONS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className={`
                  relative rounded-2xl p-6 flex flex-col gap-4 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group
                  ${item.accent
                    ? 'bg-[#0A1929] border-[#3CB52A]/30 shadow-[0_8px_32px_rgba(60,181,42,0.12)]'
                    : 'bg-white border-[#E5E7EB]'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.accent ? 'bg-[#3CB52A]/15 text-[#3CB52A]' : 'bg-[#F8F9FA] text-[#3CB52A]'}`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${item.accent ? 'text-white' : 'text-[#111827]'}`}>{item.title}</h3>
                  <p className={`text-sm leading-relaxed ${item.accent ? 'text-white/55' : 'text-[#6B7280]'}`}>{item.description}</p>
                </div>
                <a
                  href={item.action.href}
                  className={`
                    mt-auto inline-flex items-center gap-2 text-sm font-bold transition-all
                    ${item.accent ? 'text-[#3CB52A] hover:gap-3' : 'text-[#3CB52A] hover:gap-3'}
                  `}
                >
                  {item.action.label} <ArrowRight size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── System Status ── */}
      <section id="status" className="py-16 bg-white border-t border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#3CB52A] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#3CB52A]">Live System Status</span>
              </div>
              <h2 className="text-2xl font-black text-[#111827]">All Systems Operational</h2>
              <p className="text-[#6B7280] text-sm mt-1">Last checked: just now · 99.9% uptime last 30 days</p>
            </div>
            <a
              href="https://status.itechnetworkafrica.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:border-[#3CB52A] hover:text-[#3CB52A] transition-colors"
            >
              Full Status Page <ExternalLink size={14} />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STATUS_SERVICES.map((svc, i) => (
              <motion.div
                key={svc.name}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: i * 0.05 }}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]"
              >
                <span className="text-sm font-medium text-[#374151]">{svc.name}</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#3CB52A]">
                  <CheckCircle2 size={14} /> Operational
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Knowledge Base Categories ── */}
      <section id="knowledge-base" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#3CB52A]/10 border border-[#3CB52A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A]" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Knowledge Base</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-3">Browse by Topic</h2>
            <p className="text-[#6B7280] text-lg">Hundreds of guides, how-tos, and references — all organized by service area.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HELP_CATEGORIES.map((cat, i) => (
              <motion.a
                key={cat.title}
                href={cat.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.32, delay: i * 0.05 }}
                className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#3CB52A]/40 hover:shadow-md transition-all duration-250"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#3CB52A]/10 text-[#3CB52A] flex items-center justify-center group-hover:bg-[#3CB52A] group-hover:text-white transition-colors duration-250">
                  {cat.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-[#111827] text-sm">{cat.title}</p>
                  <p className="text-xs text-[#9CA3AF]">{cat.count} articles</p>
                </div>
                <ChevronRight size={16} className="flex-shrink-0 text-[#D1D5DB] group-hover:text-[#3CB52A] transition-colors" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Submit Ticket Form ── */}
      <section id="ticket" className="py-20 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* Left: form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-[#3CB52A]/10 border border-[#3CB52A]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A]" />
                  <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Submit a Ticket</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-2">Log a Support Request</h2>
                <p className="text-[#6B7280] mb-8 leading-relaxed">Fill in the details below and our team will respond based on your priority level.</p>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center bg-[#F0FDF4] rounded-2xl border border-[#3CB52A]/20"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#3CB52A]/15 flex items-center justify-center mb-4">
                        <CheckCircle2 size={32} className="text-[#3CB52A]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#111827] mb-2">Ticket Submitted!</h3>
                      <p className="text-[#6B7280] text-sm max-w-xs">We've received your request and will respond within your SLA window. Check your email for confirmation.</p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="mt-6 text-sm font-semibold text-[#3CB52A] hover:underline"
                      >
                        Submit another ticket
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                          <div className="grid sm:grid-cols-2 gap-5">
                            <FormField control={form.control} name="name" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-[#374151]">Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jane Doe" className="rounded-xl border-[#E5E7EB] focus-visible:ring-[#3CB52A]" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-[#374151]">Email Address *</FormLabel>
                                <FormControl>
                                  <Input placeholder="jane@company.com" className="rounded-xl border-[#E5E7EB] focus-visible:ring-[#3CB52A]" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>

                          <div className="grid sm:grid-cols-2 gap-5">
                            <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-[#374151]">Phone (optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="+231 7XX XXX XXX" className="rounded-xl border-[#E5E7EB] focus-visible:ring-[#3CB52A]" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="company" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-[#374151]">Company (optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your Organization" className="rounded-xl border-[#E5E7EB] focus-visible:ring-[#3CB52A]" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>

                          <div className="grid sm:grid-cols-2 gap-5">
                            <FormField control={form.control} name="category" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-[#374151]">Category *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="web-mobile">Web & Mobile Apps</SelectItem>
                                    <SelectItem value="hosting">Cloud & Hosting</SelectItem>
                                    <SelectItem value="security">Cybersecurity</SelectItem>
                                    <SelectItem value="software">Software Development</SelectItem>
                                    <SelectItem value="ai">AI & Automation</SelectItem>
                                    <SelectItem value="it-support">IT Infrastructure</SelectItem>
                                    <SelectItem value="billing">Billing & Account</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )} />

                            <FormField control={form.control} name="priority" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-[#374151]">Priority *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="low">🟢 Low — General question</SelectItem>
                                    <SelectItem value="medium">🟡 Medium — Issue affecting work</SelectItem>
                                    <SelectItem value="high">🟠 High — Service degraded</SelectItem>
                                    <SelectItem value="critical">🔴 Critical — System down</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>

                          <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-[#374151]">Subject *</FormLabel>
                              <FormControl>
                                <Input placeholder="Brief summary of your issue" className="rounded-xl border-[#E5E7EB] focus-visible:ring-[#3CB52A]" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-[#374151]">Issue Description *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your issue in detail — include error messages, steps to reproduce, and any screenshots if available."
                                  className="resize-none rounded-xl border-[#E5E7EB] focus-visible:ring-[#3CB52A] min-h-[140px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <button
                            type="submit"
                            className="w-full bg-[#3CB52A] hover:bg-[#2da822] text-white py-4 rounded-xl font-bold transition-all shadow-[0_8px_24px_rgba(60,181,42,0.30)] hover:shadow-[0_12px_32px_rgba(60,181,42,0.45)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                          >
                            Submit Ticket <ArrowRight size={16} />
                          </button>

                          <p className="text-center text-xs text-[#9CA3AF]">
                            We'll respond via email. For urgent issues, call us at{' '}
                            <a href="tel:+231761798796" className="text-[#3CB52A] font-semibold">+231 761 798 796</a>.
                          </p>
                        </form>
                      </Form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Right: contact info + SLA note */}
            <div className="lg:col-span-2 space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] p-6 space-y-4"
              >
                <h3 className="font-bold text-[#111827]">Direct Contact</h3>
                {[
                  { icon: <Phone size={16} />, label: 'Phone', value: '+231 761 798 796', href: 'tel:+231761798796' },
                  { icon: <Mail size={16} />, label: 'Email', value: 'itechnetworkafrica@gmail.com', href: 'mailto:itechnetworkafrica@gmail.com' },
                  { icon: <Clock size={16} />, label: 'Business Hours', value: 'Mon–Fri 8AM–6PM WAT', href: null },
                  { icon: <Headphones size={16} />, label: 'Technical Support', value: '24/7 for enterprise clients', href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-[#3CB52A]/10 text-[#3CB52A] flex items-center justify-center">{item.icon}</div>
                    <div>
                      <p className="text-xs text-[#9CA3AF] font-medium">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-semibold text-[#111827] hover:text-[#3CB52A] transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-sm font-semibold text-[#111827]">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="bg-[#0A1929] rounded-2xl p-6 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className="text-[#3CB52A]" />
                  <h3 className="font-bold text-white text-sm">Response Time Guide</h3>
                </div>
                {[
                  { level: '🔴 Critical', time: '< 2 hours' },
                  { level: '🟠 High', time: '< 4 hours' },
                  { level: '🟡 Medium', time: '< 12 hours' },
                  { level: '🟢 Low', time: '< 24 hours' },
                ].map((r) => (
                  <div key={r.level} className="flex items-center justify-between text-sm">
                    <span className="text-white/65">{r.level}</span>
                    <span className="font-bold text-white">{r.time}</span>
                  </div>
                ))}
                <p className="text-xs text-white/35 pt-1">Priority & Dedicated SLA clients receive faster routing.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.24 }}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MonitorCheck size={18} className="text-[#3CB52A]" />
                  <h3 className="font-bold text-[#111827] text-sm">What Happens Next?</h3>
                </div>
                <ol className="space-y-2.5">
                  {[
                    'You receive an automatic confirmation email.',
                    'A support engineer is assigned within your SLA window.',
                    'We diagnose and communicate our findings.',
                    'Issue is resolved and you confirm closure.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#6B7280]">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#3CB52A]/10 text-[#3CB52A] text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SLA Tiers ── */}
      <section id="maintenance" className="py-20 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#3CB52A]/10 border border-[#3CB52A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A]" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">Support Plans</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-3">Choose Your Support Tier</h2>
            <p className="text-[#6B7280] text-lg">Upgrade anytime to get faster responses and dedicated engineering access.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {SLA_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className={`relative flex flex-col rounded-3xl border-2 p-8 bg-white transition-all hover:-translate-y-1 hover:shadow-lg ${tier.color} ${tier.popular ? 'scale-[1.03] z-10' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#3CB52A] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                    <Star size={11} fill="white" /> Most Chosen
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#111827] mb-1">{tier.name}</h3>
                  <p className="text-[#3CB52A] font-bold">{tier.price}</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-[#374151]">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#3CB52A]/12 flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-[#3CB52A]" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`block text-center py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 ${tier.ctaStyle}`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#3CB52A]/10 border border-[#3CB52A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A]" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-3">Frequently Asked Questions</h2>
            <p className="text-[#6B7280] text-lg mb-6">Quick answers to common questions.</p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions…"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/30 focus:border-[#3CB52A]"
              />
            </div>
          </motion.div>

          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <p className="text-center text-[#9CA3AF] py-8 text-sm">No results for "<strong>{search}</strong>". Try a different term.</p>
            ) : (
              filteredFaqs.map((f, i) => <FAQItem key={f.q} q={f.q} a={f.a} i={i} />)
            )}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-[#0A1929] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#3CB52A]/8 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] animate-pulse" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">We're Here for You</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">Still Need Help?</h2>
            <p className="text-white/65 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Our team of experienced engineers is ready to help you solve any challenge — from quick questions to complex system issues.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#ticket"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold rounded-full transition-all shadow-[0_8px_32px_rgba(60,181,42,0.40)] hover:-translate-y-0.5"
              >
                Submit a Ticket <ArrowRight size={16} />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-full border border-white/25 hover:border-white/50 hover:bg-white/5 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

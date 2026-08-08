import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'wouter';
import {
  Search, MessageSquare, Phone, Mail, BookOpen,
  Zap, Shield, Cloud, Code2, Globe, Cpu, Server, Users,
  ChevronDown, ArrowRight, CheckCircle2, Clock, LifeBuoy,
  Video, Headphones, AlertCircle, TicketCheck, MonitorCheck,
  Star, ChevronRight, ExternalLink, HelpCircle, Wrench,
  Database, Lock, RefreshCw, Activity, Sparkles,
  Layers, Award, KeyRound, WifiOff, CreditCard, Rocket,
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
import { apiUrl } from '@/lib/apiBase';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ─── data ─────────────────────────────────────────────────────────────── */

const STATS = [
  { value: '98.9%', label: 'Uptime SLA', icon: <Activity size={18} /> },
  { value: '<1 hr', label: 'First Response', icon: <Clock size={18} /> },
  { value: '5,000+', label: 'Tickets Resolved', icon: <TicketCheck size={18} /> },
  { value: '4.9 / 5', label: 'Customer Rating', icon: <Star size={18} /> },
];

const STATUS_SERVICES = [
  { name: 'Web Hosting Infrastructure', status: 'operational', uptime: 100 },
  { name: 'Client Portal & Dashboard', status: 'operational', uptime: 99.9 },
  { name: 'Email Services', status: 'operational', uptime: 100 },
  { name: 'API Gateway', status: 'operational', uptime: 99.8 },
  { name: 'CDN & Asset Delivery', status: 'operational', uptime: 100 },
  { name: 'Database Clusters', status: 'operational', uptime: 99.9 },
];

const CHANNELS = [
  {
    icon: <MessageSquare size={24} />,
    title: 'Live Chat',
    description: 'Connect with a support engineer instantly. Average queue: under 2 minutes.',
    badge: 'Online Now',
    badgeDot: true,
    accent: true,
    action: { label: 'Start Chat', href: '/contact' },
  },
  {
    icon: <TicketCheck size={24} />,
    title: 'Submit a Ticket',
    description: 'Log a detailed support request. Tracked to resolution with full audit trail.',
    badge: '< 1 hr response',
    accent: false,
    action: { label: 'Open Ticket', href: '#ticket' },
  },
  {
    icon: <Phone size={24} />,
    title: 'Phone Support',
    description: 'Speak directly with a certified technical engineer. No call trees.',
    badge: 'Mon–Fri · 8AM–6PM WAT',
    accent: false,
    action: { label: 'Call Now', href: 'tel:+231761798796' },
  },
  {
    icon: <Mail size={24} />,
    title: 'Email',
    description: 'Send a detailed request with attachments. Guaranteed 24-hour reply.',
    badge: '24 hr reply',
    accent: false,
    action: { label: 'Send Email', href: 'mailto:itechnetworkafrica@gmail.com' },
  },
  {
    icon: <BookOpen size={24} />,
    title: 'Knowledge Base',
    description: 'Self-serve documentation: guides, API references, and video walkthroughs.',
    badge: '200+ articles',
    accent: false,
    action: { label: 'Browse Docs', href: '/resources' },
  },
  {
    icon: <Video size={24} />,
    title: 'Video Tutorials',
    description: 'Step-by-step screencasts for common setup, configuration, and troubleshooting tasks.',
    badge: 'Free access',
    accent: false,
    action: { label: 'Watch Now', href: '/resources' },
  },
];

const QUICK_FIXES = [
  {
    icon: <KeyRound size={20} />,
    title: 'Reset Your Password',
    desc: 'Locked out of the Client Portal? Reset your password in under a minute.',
    steps: ['Open the Portal login page', 'Click "Forgot password"', 'Check your email for the reset link'],
  },
  {
    icon: <WifiOff size={20} />,
    title: 'Site or App Unreachable',
    desc: 'Before opening a ticket, run these quick checks to rule out local issues.',
    steps: ['Hard-refresh (Ctrl/Cmd + Shift + R)', 'Try another network or device', 'Check the live status board above'],
  },
  {
    icon: <CreditCard size={20} />,
    title: 'Billing & Invoices',
    desc: 'Download invoices and update payment details from your Client Portal.',
    steps: ['Log in to the Client Portal', 'Open Billing → Invoices', 'Email us for any corrections'],
  },
  {
    icon: <RefreshCw size={20} />,
    title: 'Request a Software Update',
    desc: 'Need a new feature or patch on a system we built for you?',
    steps: ['Submit a ticket with category "Software"', 'Describe the change you need', 'We scope it and send a timeline'],
  },
];

const TOPIC_GROUPS = [
  {
    heading: 'Websites & Apps',
    items: [
      { icon: <Globe size={20} />, title: 'Web & Mobile Apps' },
      { icon: <Code2 size={20} />, title: 'Software Development' },
      { icon: <Users size={20} />, title: 'Digital Marketing' },
      { icon: <Video size={20} />, title: 'Content & Media' },
    ],
  },
  {
    heading: 'Hosting & Infrastructure',
    items: [
      { icon: <Cloud size={20} />, title: 'Cloud & Hosting' },
      { icon: <Server size={20} />, title: 'IT Infrastructure' },
      { icon: <Database size={20} />, title: 'Data & Databases' },
      { icon: <RefreshCw size={20} />, title: 'Backups & Recovery' },
    ],
  },
  {
    heading: 'Security & AI',
    items: [
      { icon: <Shield size={20} />, title: 'Cybersecurity' },
      { icon: <Lock size={20} />, title: 'Website Security & SSL' },
      { icon: <Cpu size={20} />, title: 'AI & Automation' },
      { icon: <Sparkles size={20} />, title: 'iTech AI Tools' },
    ],
  },
  {
    heading: 'Account & Programs',
    items: [
      { icon: <KeyRound size={20} />, title: 'Account Management' },
      { icon: <CreditCard size={20} />, title: 'Billing & Invoices' },
      { icon: <Users size={20} />, title: 'Partner Programs' },
      { icon: <Rocket size={20} />, title: 'Getting Started' },
    ],
  },
];

// Articles shown when a topic row is expanded
const TOPIC_ARTICLES: Record<string, { title: string; desc: string; readTime: string }[]> = {
  'Web & Mobile Apps': [
    { title: 'How to request a new website or mobile app project', desc: 'Step-by-step guide to scoping, submitting a brief, and kicking off your build with our development team.', readTime: '4 min' },
    { title: 'Connecting a custom domain to your hosted website', desc: 'Point your GoDaddy, Namecheap, or any registrar domain to your iTech-hosted site in under 15 minutes.', readTime: '5 min' },
    { title: 'Publishing an update to your live website', desc: 'How to send content changes, new pages, or design tweaks to your project manager and track them through to deployment.', readTime: '3 min' },
    { title: 'Mobile app store submission — what we handle vs. what you do', desc: 'Clarifies the Play Store / App Store submission checklist, developer account requirements, and our responsibilities.', readTime: '6 min' },
  ],
  'Software Development': [
    { title: 'Submitting a feature request or change order', desc: 'How to describe what you need, what information speeds up the estimate, and expected turnaround times.', readTime: '3 min' },
    { title: 'Understanding your software release cycle', desc: 'We follow two-week sprints. Learn how to read the sprint board in your Client Portal and give feedback before release.', readTime: '5 min' },
    { title: 'Requesting API access tokens for your integration', desc: 'Generate and manage API keys from the Client Portal. Includes rate limits, scopes, and rotation best practices.', readTime: '6 min' },
    { title: 'Bug report template and priority levels', desc: 'The fastest way to get a bug fixed is a clear report. Use this template: steps to reproduce, expected vs. actual, screenshot.', readTime: '2 min' },
  ],
  'Digital Marketing': [
    { title: 'Getting started with your monthly marketing report', desc: 'What the report covers — traffic, leads, conversions — and how to read the key performance indicators.', readTime: '4 min' },
    { title: 'How we run your social media campaigns', desc: 'Content calendar, approval workflow, posting schedule, and how to request edits before content goes live.', readTime: '5 min' },
    { title: 'SEO audits — what we check and how often', desc: 'We run quarterly audits covering on-page SEO, backlinks, Core Web Vitals, and keyword rankings.', readTime: '6 min' },
    { title: 'Running a paid ads campaign with iTech', desc: 'Google Ads and Meta Ads setup, budget recommendations, targeting strategy, and monthly performance reviews.', readTime: '7 min' },
  ],
  'Content & Media': [
    { title: 'Submitting content for your website or blog', desc: 'How to share copy, images, and videos for our team to publish. File formats, naming conventions, and review timelines.', readTime: '3 min' },
    { title: 'Video production packages — what is included', desc: 'Covers corporate videos, product demos, and social reels. Scriptwriting, filming, editing, and delivery formats.', readTime: '5 min' },
    { title: 'Brand photography guidelines for your website', desc: 'Minimum resolution, preferred aspect ratios, background guidance, and how to submit photos for optimised web use.', readTime: '4 min' },
    { title: 'Requesting graphics and design assets', desc: 'How to brief the design team, turnaround times, revision limits, and file formats we deliver.', readTime: '3 min' },
  ],
  'Cloud & Hosting': [
    { title: 'Understanding your hosting plan and resources', desc: 'What storage, bandwidth, and CPU limits apply to your plan, and how to check current usage in the Client Portal.', readTime: '4 min' },
    { title: 'Setting up a staging environment', desc: 'Clone your live site to a private staging URL for testing updates safely before they go public.', readTime: '5 min' },
    { title: 'How to scale your hosting when traffic spikes', desc: 'iTech monitors load automatically, but this guide explains when and how to request a resource upgrade proactively.', readTime: '4 min' },
    { title: 'Scheduled maintenance windows explained', desc: 'When maintenance happens, how you are notified in advance, and what to do if your site is unavailable.', readTime: '3 min' },
  ],
  'IT Infrastructure': [
    { title: 'Network monitoring and alerting — how it works', desc: 'Your infrastructure is monitored 24/7. This explains alert thresholds, escalation paths, and how incidents are logged.', readTime: '5 min' },
    { title: 'Requesting hardware procurement or server setup', desc: 'How to submit a hardware request, lead times for delivery, and the on-site or remote setup process.', readTime: '6 min' },
    { title: 'Remote access and VPN configuration', desc: 'Secure remote access setup for your team — supported clients, authentication methods, and access control.', readTime: '5 min' },
    { title: 'IT audit reports — how to read yours', desc: 'Quarterly IT audit covers network health, patch compliance, and risk flags. Guide to interpreting each section.', readTime: '7 min' },
  ],
  'Data & Databases': [
    { title: 'Database backup schedule and retention policy', desc: 'Backups run every 6 hours. Retained for 30 days on standard plans, 90 days on Priority. How to request a restore.', readTime: '4 min' },
    { title: 'Requesting a database export or migration', desc: 'How to request a full data export in CSV, SQL, or JSON. Includes estimated processing times and file delivery method.', readTime: '5 min' },
    { title: 'Setting up a read replica for reporting', desc: 'Offload analytics queries to a read replica so they do not slow down your live application database.', readTime: '6 min' },
    { title: 'Data compliance and GDPR guidelines', desc: 'How your data is stored, encrypted at rest and in transit, and steps for submitting a GDPR deletion request.', readTime: '5 min' },
  ],
  'Backups & Recovery': [
    { title: 'How automatic backups work', desc: 'All hosted sites and databases are backed up every 6 hours. Snapshots are stored in geographically separate data centres.', readTime: '3 min' },
    { title: 'Requesting a point-in-time restore', desc: 'If something breaks, you can roll back to any backup within your retention window. This guide walks through the request process.', readTime: '4 min' },
    { title: 'Disaster recovery plan — what happens during an outage', desc: 'Our RTO is under 4 hours for managed infrastructure. This explains failover steps, communication, and RCA reports.', readTime: '6 min' },
    { title: 'Testing your backup and restore process', desc: 'Best practices for verifying your backups actually work before you need them. We run restore drills on request.', readTime: '5 min' },
  ],
  'Cybersecurity': [
    { title: 'How we protect your application from attacks', desc: 'WAF rules, DDoS mitigation, intrusion detection, and automated threat blocking that runs on all hosted infrastructure.', readTime: '5 min' },
    { title: 'Security incident response — what to do', desc: 'If you suspect a breach, act fast. Step-by-step: isolate, report to iTech, preserve logs, and follow the containment checklist.', readTime: '4 min' },
    { title: 'Penetration testing and vulnerability assessments', desc: 'We offer annual pen tests for enterprise clients. What the test covers, how results are reported, and remediation timelines.', readTime: '7 min' },
    { title: 'Employee security awareness — our training resources', desc: 'Phishing simulations, security policy templates, and user training sessions available as part of managed security packages.', readTime: '5 min' },
  ],
  'Website Security & SSL': [
    { title: 'Setting up two-factor authentication', desc: 'Enable 2FA on your Client Portal account using an authenticator app. Step-by-step setup and recovery code storage.', readTime: '2 min' },
    { title: 'SSL certificate installation and renewal', desc: 'All iTech-hosted sites include auto-renewing SSL. How to verify your certificate, check expiry, and troubleshoot mixed-content warnings.', readTime: '4 min' },
    { title: 'Enforcing HTTPS redirects on your site', desc: 'Ensure all HTTP traffic redirects to HTTPS automatically. Covers Nginx/Apache config and portal-level settings.', readTime: '3 min' },
    { title: 'Content Security Policy (CSP) headers explained', desc: 'How CSP headers prevent XSS attacks and how to configure them without breaking third-party scripts on your site.', readTime: '6 min' },
  ],
  'AI & Automation': [
    { title: 'What AI services does iTech offer?', desc: 'Overview of custom AI models, chatbot development, intelligent automation workflows, and AI-assisted analytics.', readTime: '4 min' },
    { title: 'Automating repetitive business workflows', desc: 'How we map your manual processes, identify automation opportunities, and deploy integrations between your tools.', readTime: '6 min' },
    { title: 'Integrating AI chatbots into your website or app', desc: 'Deployment options, training data requirements, handoff to human agents, and maintenance after launch.', readTime: '5 min' },
    { title: 'AI model performance monitoring', desc: 'How we track accuracy, drift, and latency of deployed models, and what triggers a retraining cycle.', readTime: '5 min' },
  ],
  'iTech AI Tools': [
    { title: 'Sarah AI — your support assistant', desc: 'Sarah is the AI chatbot built into this website. Learn what she can help with, her limitations, and how to escalate to a human.', readTime: '2 min' },
    { title: 'AI-powered system health reports', desc: 'Your monthly infrastructure report is generated by AI analysis of logs, uptime data, and performance metrics.', readTime: '4 min' },
    { title: 'Smart ticket routing — how it works', desc: 'AI automatically assigns support tickets to the right engineer based on category, urgency, and skill match.', readTime: '3 min' },
    { title: 'Requesting a custom AI tool for your business', desc: 'From document processing to customer-facing chatbots — how to scope, build, and deploy a custom AI tool with iTech.', readTime: '6 min' },
  ],
  'Account Management': [
    { title: 'Getting started with your Client Portal account', desc: 'Create your account, verify your email, set up 2FA, and explore the dashboard sections available to you.', readTime: '3 min' },
    { title: 'How to reset your password', desc: 'Locked out? Use the "Forgot password" link on the login page. Reset link is valid for 30 minutes.', readTime: '1 min' },
    { title: 'Adding or removing team members', desc: 'Invite colleagues to your portal account with role-based access. Owner, Admin, and View-only roles explained.', readTime: '4 min' },
    { title: 'Updating your business contact details', desc: 'How to change your company name, registered address, and primary contact email — and what downstream effects to expect.', readTime: '3 min' },
  ],
  'Billing & Invoices': [
    { title: 'How to download your invoices', desc: 'All invoices are in the Client Portal under Billing → Invoices. Export as PDF or request a bulk CSV for accounting.', readTime: '2 min' },
    { title: 'Updating your payment method', desc: 'Add or change a card or bank transfer detail in the Portal. Changes take effect on the next billing cycle.', readTime: '3 min' },
    { title: 'Understanding your monthly invoice line items', desc: 'What each charge means — hosting, support, project milestones, and one-time fees — with a plain-language breakdown.', readTime: '5 min' },
    { title: 'Disputing a charge or requesting a refund', desc: 'How to raise a billing dispute via your account manager or email, and what our refund policy covers.', readTime: '4 min' },
  ],
  'Partner Programs': [
    { title: 'iTech Partner Programme overview', desc: 'Three tiers — Referral, Resell, and Build. Which tier is right for you, and what benefits each one includes.', readTime: '4 min' },
    { title: 'How to apply to become a partner', desc: 'Fill in the application form on the Partners page. Typical review takes 3–5 business days before you receive a decision.', readTime: '3 min' },
    { title: 'Partner commission and payment schedule', desc: 'How referral commissions are calculated, when they are paid, and how to track earnings in the portal.', readTime: '5 min' },
    { title: 'Co-marketing resources for partners', desc: 'Access branded slides, case studies, and proposal templates from the Partner Resources pack.', readTime: '3 min' },
  ],
  'Getting Started': [
    { title: 'New client onboarding checklist', desc: 'Everything you need to do in your first week: portal setup, point-of-contact introduction, and project kick-off.', readTime: '5 min' },
    { title: 'Understanding the iTech support model', desc: 'How our ticket system, SLA tiers, and escalation paths work — so you always know who to contact and when.', readTime: '4 min' },
    { title: 'Your first project — what to expect', desc: 'Discovery call → scope document → sprint planning → delivery. A plain-language walkthrough of the full process.', readTime: '6 min' },
    { title: 'Key contacts and escalation paths', desc: 'Your account manager, technical lead, and emergency line — with expected response times for each.', readTime: '3 min' },
  ],
};

const POPULAR_ARTICLES = [
  { title: 'Getting started with your Client Portal account', category: 'Account', readTime: '3 min' },
  { title: 'Connecting a custom domain to your hosted website', category: 'Hosting', readTime: '5 min' },
  { title: 'Understanding your monthly system health report', category: 'Monitoring', readTime: '4 min' },
  { title: 'Setting up two-factor authentication', category: 'Security', readTime: '2 min' },
  { title: 'Requesting API access tokens for your integration', category: 'Developers', readTime: '6 min' },
  { title: 'How our support ticket priorities and SLAs work', category: 'Support', readTime: '3 min' },
];

const TIME_ZONES = [
  { city: 'Monrovia', country: 'Liberia', tz: 'GMT', offset: 0, hq: true },
  { city: 'Lagos', country: 'Nigeria', tz: 'WAT', offset: 1 },
  { city: 'Nairobi', country: 'Kenya', tz: 'EAT', offset: 3 },
  { city: 'London', country: 'UK', tz: 'BST', offset: 1 },
  { city: 'Dubai', country: 'UAE', tz: 'GST', offset: 4 },
];

const SLA_TIERS = [
  {
    name: 'Standard',
    tagline: 'For individuals & small teams',
    price: 'Included',
    features: [
      '24-hr email response',
      'Business hours support',
      'Knowledge base access',
      'Community forum',
      'Monthly system reports',
    ],
    cta: 'Your current plan',
    ctaStyle: 'border-2 border-[#E5E7EB] text-[#6B7280] hover:border-[#3CB52A]/40 hover:text-[#3CB52A]',
    popular: false,
  },
  {
    name: 'Priority',
    tagline: 'For growing businesses',
    price: 'Contact Sales',
    features: [
      '< 4-hr first response',
      'Priority queue routing',
      'Dedicated Slack channel',
      'Monthly strategy review',
      'Remote troubleshooting',
      'Incident post-mortems',
    ],
    cta: 'Get Priority Support',
    ctaStyle: 'bg-[#3CB52A] text-white shadow-[0_8px_24px_rgba(60,181,42,0.35)] hover:bg-[#2da822]',
    popular: true,
  },
  {
    name: 'Dedicated',
    tagline: 'For enterprise clients',
    price: 'Enterprise',
    features: [
      '< 1-hr response, 24/7',
      'Named account engineer',
      'Proactive monitoring',
      'Quarterly business reviews',
      'Custom SLA agreement',
      'Onsite support available',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'bg-[#0A1929] text-white hover:bg-[#132B45]',
    popular: false,
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

const SUPPORT_JOURNEY = [
  { icon: <TicketCheck size={20} />, title: 'Submit', desc: 'Open a ticket through any channel — chat, form, phone, or email.' },
  { icon: <Users size={20} />, title: 'Assigned', desc: 'A specialist engineer picks it up within your SLA window.' },
  { icon: <Wrench size={20} />, title: 'Resolved', desc: 'We diagnose, fix, and keep you updated at every step.' },
  { icon: <Sparkles size={20} />, title: 'Follow-up', desc: 'You confirm closure and rate the experience — we learn from every case.' },
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

/* ─── helpers ────────────────────────────────────────────────────────────── */

function getLocalTime(offsetHours: number) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const local = new Date(utc + 3600000 * offsetHours);
  return local.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/* ─── sub-components ─────────────────────────────────────────────────────── */

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: i * 0.04 }}
      className="border border-[#E7ECF2] rounded-2xl overflow-hidden bg-white hover:border-[#3CB52A]/40 transition-colors duration-300 shadow-sm"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#0A1929] pr-4 text-[15px] leading-snug">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-[#3CB52A]' : 'text-[#64748B]'}`}
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
            <p className="px-6 pb-5 pt-1 text-[#5B6B7B] text-sm leading-relaxed border-t border-[#EEF2F6]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function UptimeBar({ pct }: { pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="w-20 h-1.5 rounded-full bg-[#E7ECF2] overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-[#3CB52A]"
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : { width: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      />
    </div>
  );
}

function SectionBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[#3CB52A] text-xs font-bold tracking-widest uppercase bg-[#3CB52A]/8 border border-[#3CB52A]/20 px-4 py-1.5 rounded-full mb-4">
      {icon} {label}
    </span>
  );
}

/* ─── main page ──────────────────────────────────────────────────────────── */

export default function SupportPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [heroSearch, setHeroSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  function runHeroSearch() {
    setSearch(heroSearch.trim());
    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
  }

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(apiUrl('/api/support/tickets'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({} as { error?: string; ticketNumber?: string }));
      if (!res.ok) {
        toast({ title: 'Could not submit ticket', description: data.error || 'Please try again.', variant: 'destructive' });
        return;
      }
      setSubmitted(true);
      form.reset();
      toast({ title: 'Ticket Submitted', description: `Your ticket ${data.ticketNumber || ''} has been sent to our support team.`.trim() });
    } catch {
      toast({ title: 'Connection error', description: 'Please check your internet connection and try again.', variant: 'destructive' });
    }
  }

  const fieldClass = 'rounded-xl bg-white border-[#E0E6ED] text-[#0A1929] placeholder-[#9AA6B2] focus-visible:ring-[#3CB52A]/30 focus-visible:border-[#3CB52A]/60';

  return (
    <div className="flex flex-col w-full bg-[#F7FAFC] min-h-screen overflow-x-clip">

      {/* ══════════════════════════════════════════════════════
          HERO — Dark help center
      ══════════════════════════════════════════════════════ */}
      <section className="relative bg-[#060E18] pt-28 pb-20 overflow-hidden">

        {/* Soft green glow */}
        <motion.div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(60,181,42,0.14) 0%, transparent 70%)', filter: 'blur(40px)' }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">

          {/* Live status badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <a
              href="#status"
              className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-[#3CB52A]/10 border border-[#3CB52A]/25 text-[#3CB52A] text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:bg-[#3CB52A]/15 transition-colors text-center max-w-full"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3CB52A] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3CB52A]" />
              </span>
              All Systems Operational · 99.9% Uptime
            </a>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight mb-5 break-words">
              How Can We <span className="text-[#3CB52A]">Help You</span> Today?
            </h1>
            <p className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              From Monrovia to the world — our engineering team is available around the clock to keep your technology running at peak performance.
            </p>
          </motion.div>

          {/* Hero search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="max-w-2xl mx-auto mt-10"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#3CB52A]/30 via-[#3CB52A]/10 to-[#3CB52A]/30 blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white border border-white/10 rounded-2xl overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.35)] group-focus-within:border-[#3CB52A]/50 transition-colors">
                <Search size={18} className="absolute left-5 text-[#64748B] pointer-events-none" />
                <input
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runHeroSearch()}
                  placeholder="Search the knowledge base, FAQs, and guides…"
                  className="w-full pl-12 pr-24 sm:pr-36 py-4 bg-transparent text-[#0A1929] text-sm placeholder-[#9AA6B2] focus:outline-none"
                />
                <button onClick={runHeroSearch} className="absolute right-2 px-3 sm:px-5 py-2.5 bg-[#3CB52A] hover:bg-[#2da822] text-white text-sm font-bold rounded-xl transition-colors whitespace-nowrap">
                  Search
                </button>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Billing', 'API Access', 'Hosting Setup', 'Password Reset', 'Uptime SLA'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setHeroSearch(tag)}
                  className="text-xs text-white/45 hover:text-[#3CB52A] border border-white/10 hover:border-[#3CB52A]/40 px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.36 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1.5 py-6 px-4 bg-[#060E18]">
                <span className="text-[#3CB52A]">{s.icon}</span>
                <span className="text-2xl font-black text-white">{s.value}</span>
                <span className="text-xs text-white/40 font-medium">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade into light page */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(247,250,252,0.08))' }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════
          SUPPORT CHANNELS
      ══════════════════════════════════════════════════════ */}
      <section id="help" className="py-24 bg-[#F7FAFC]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <SectionBadge icon={<Zap size={11} />} label="Contact" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-black text-[#0A1929]">Choose Your Support Channel</h2>
              <p className="text-[#5B6B7B] text-sm max-w-xs">Multiple ways to reach us — same team, same expertise.</p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHANNELS.map((ch, i) => (
              <motion.div
                key={ch.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                className={`group relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 cursor-default overflow-hidden ${
                  ch.accent
                    ? 'bg-[#3CB52A]/6 border-[#3CB52A]/30 hover:border-[#3CB52A]/60 shadow-[0_10px_30px_rgba(60,181,42,0.10)]'
                    : 'bg-white border-[#E7ECF2] hover:border-[#3CB52A]/30 shadow-sm hover:shadow-[0_14px_36px_rgba(10,25,41,0.08)]'
                }`}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${ch.accent ? 'bg-[#3CB52A]/15 text-[#3CB52A]' : 'bg-[#F1F5F9] text-[#0A1929]'}`}>
                      {ch.icon}
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${
                      ch.accent ? 'bg-[#3CB52A]/15 text-[#1E7A12]' : 'bg-[#F1F5F9] text-[#5B6B7B]'
                    }`}>
                      {ch.badgeDot && <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] animate-pulse" />}
                      {ch.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-[#0A1929]">{ch.title}</h3>
                  <p className="text-[#5B6B7B] text-sm leading-relaxed mb-5">{ch.description}</p>
                  <a
                    href={ch.action.href}
                    className="inline-flex items-center gap-1.5 text-sm font-bold transition-all group-hover:gap-2.5 text-[#3CB52A]"
                  >
                    {ch.action.label} <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SYSTEM STATUS
      ══════════════════════════════════════════════════════ */}
      <section id="status" className="py-16 bg-white border-y border-[#EEF2F6]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3CB52A] opacity-50" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3CB52A]" />
                </span>
                <span className="text-[#1E7A12] text-xs font-bold tracking-widest uppercase">Live System Status</span>
              </div>
              <h2 className="text-2xl font-black text-[#0A1929]">All Systems Operational</h2>
              <p className="text-[#5B6B7B] text-sm mt-1">Last checked: just now · 99.9% uptime over the last 30 days</p>
            </div>
            <a
              href="https://status.itechnetworkafrica.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E0E6ED] text-sm font-semibold text-[#5B6B7B] hover:border-[#3CB52A]/50 hover:text-[#3CB52A] transition-colors self-start"
            >
              Full Status Page <ExternalLink size={13} />
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
                className="flex items-center justify-between px-4 py-4 rounded-xl bg-[#F7FAFC] border border-[#EEF2F6] hover:border-[#DDE5EC] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle2 size={15} className="text-[#3CB52A] flex-shrink-0" />
                  <span className="text-sm font-medium text-[#3B4A59] truncate">{svc.name}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <UptimeBar pct={svc.uptime} />
                  <span className="text-xs font-bold text-[#1E7A12]">{svc.uptime}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          QUICK FIXES — Self-help (new)
      ══════════════════════════════════════════════════════ */}
      <section id="quick-fixes" className="py-24 bg-[#F7FAFC]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <SectionBadge icon={<Wrench size={11} />} label="Quick Fixes" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-black text-[#0A1929]">Solve It Yourself in Minutes</h2>
              <p className="text-[#5B6B7B] text-sm max-w-xs">The most common issues — with step-by-step fixes.</p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_FIXES.map((fix, i) => (
              <motion.div
                key={fix.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
                className="bg-white rounded-2xl border border-[#E7ECF2] p-6 shadow-sm hover:shadow-[0_14px_36px_rgba(10,25,41,0.08)] hover:border-[#3CB52A]/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#3CB52A]/10 text-[#3CB52A] flex items-center justify-center mb-4">
                  {fix.icon}
                </div>
                <h3 className="font-bold text-[#0A1929] mb-1.5">{fix.title}</h3>
                <p className="text-[#5B6B7B] text-sm leading-relaxed mb-4">{fix.desc}</p>
                <ol className="space-y-2">
                  {fix.steps.map((step, si) => (
                    <li key={si} className="flex items-start gap-2.5 text-[13px] text-[#3B4A59]">
                      <span className="flex-shrink-0 w-[18px] h-[18px] min-w-[18px] rounded-full bg-[#F1F5F9] text-[#5B6B7B] text-[10px] font-black flex items-center justify-center mt-0.5">{si + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          KNOWLEDGE BASE + POPULAR ARTICLES
      ══════════════════════════════════════════════════════ */}
      <section id="knowledge-base" className="py-24 bg-white border-y border-[#EEF2F6]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <SectionBadge icon={<BookOpen size={11} />} label="Knowledge Base" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-black text-[#0A1929]">Browse by Topic</h2>
              <p className="text-[#5B6B7B] text-sm">200+ guides, tutorials, and API references.</p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Topic directory — grouped lists with expandable articles */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 content-start">
              {TOPIC_GROUPS.map((group, gi) => (
                <motion.div
                  key={group.heading}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.32, delay: gi * 0.06 }}
                >
                  <h3 className="text-lg font-black text-[#0A1929] pb-3 border-b-2 border-[#0A1929]">{group.heading}</h3>
                  <div>
                    {group.items.map((item) => {
                      const isOpen = selectedTopic === item.title;
                      const articles = TOPIC_ARTICLES[item.title] ?? [];
                      return (
                        <div key={item.title}>
                          <button
                            onClick={() => setSelectedTopic(isOpen ? null : item.title)}
                            className={`group w-full flex items-center gap-4 py-4 border-b border-[#EEF2F6] transition-colors px-1 -mx-1 text-left ${isOpen ? 'bg-[#F0FBF0]' : 'hover:bg-[#F7FAFC]'}`}
                            aria-expanded={isOpen}
                          >
                            <span className={`flex-shrink-0 transition-colors ${isOpen ? 'text-[#3CB52A]' : 'text-[#0A1929] group-hover:text-[#3CB52A]'}`}>{item.icon}</span>
                            <span className={`flex-grow font-medium text-[15px] transition-colors ${isOpen ? 'text-[#3CB52A]' : 'text-[#1F2D3A] group-hover:text-[#0A1929]'}`}>{item.title}</span>
                            <ChevronDown
                              size={15}
                              className={`flex-shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 text-[#3CB52A]' : 'text-[#C4CDD6] group-hover:text-[#3CB52A]'}`}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                key="articles"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-[#F7FAFC] border-b border-[#EEF2F6] px-1 py-3 space-y-0">
                                  {articles.map((art) => (
                                    <Link
                                      key={art.title}
                                      href="/resources"
                                      className="group/art flex items-start gap-3 px-2 py-3 rounded-lg hover:bg-white transition-colors"
                                    >
                                      <ArrowRight size={13} className="flex-shrink-0 text-[#3CB52A] mt-1" />
                                      <div className="min-w-0">
                                        <p className="text-[13px] font-semibold text-[#0A1929] group-hover/art:text-[#3CB52A] leading-snug transition-colors">{art.title}</p>
                                        <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">{art.desc}</p>
                                        <p className="text-[10px] text-[#94A3B8] mt-1">{art.readTime} read</p>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Popular articles */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-2 bg-[#0A1929] rounded-2xl p-7 self-start"
            >
              <div className="flex items-center gap-2 mb-6">
                <Rocket size={16} className="text-[#3CB52A]" />
                <h3 className="font-bold text-white">Most Popular Articles</h3>
              </div>
              <div className="space-y-1">
                {POPULAR_ARTICLES.map((art, i) => (
                  <Link
                    key={art.title}
                    href="/resources"
                    className="group flex items-start gap-3 py-3 border-b border-white/8 last:border-0 hover:bg-white/4 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <span className="flex-shrink-0 text-[#3CB52A] font-black text-sm mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white/85 group-hover:text-white leading-snug transition-colors">{art.title}</p>
                      <p className="text-[11px] text-white/35 mt-1">{art.category} · {art.readTime} read</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/resources"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#3CB52A] hover:gap-2.5 transition-all"
              >
                View All Articles <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          GLOBAL COVERAGE — Time zones
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#F7FAFC] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="md:w-72 flex-shrink-0">
              <span className="inline-flex items-center gap-2 text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-3">
                <Globe size={11} /> Global Coverage
              </span>
              <h2 className="text-2xl font-black text-[#0A1929] mb-2">We're in Your Time Zone</h2>
              <p className="text-[#5B6B7B] text-sm leading-relaxed">Enterprise clients get round-the-clock support from engineers across multiple regions.</p>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TIME_ZONES.map((tz, i) => (
                <motion.div
                  key={tz.city}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className={`rounded-xl p-4 border text-center ${tz.hq ? 'bg-[#3CB52A]/8 border-[#3CB52A]/35' : 'bg-white border-[#E7ECF2] shadow-sm'}`}
                >
                  <div className="text-lg font-black text-[#0A1929] mb-0.5">{getLocalTime(tz.offset)}</div>
                  <div className={`text-xs font-bold mb-1 ${tz.hq ? 'text-[#1E7A12]' : 'text-[#5B6B7B]'}`}>{tz.tz}</div>
                  <div className="text-xs text-[#5B6B7B] font-medium">{tz.city}</div>
                  {tz.hq && <div className="mt-1.5 text-[10px] font-bold text-[#1E7A12] uppercase tracking-wide">HQ</div>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SUPPORT JOURNEY — How it works (new)
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-y border-[#EEF2F6]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <SectionBadge icon={<LifeBuoy size={11} />} label="How It Works" />
            <h2 className="text-3xl md:text-4xl font-black text-[#0A1929] mb-3">Your Support Journey</h2>
            <p className="text-[#5B6B7B]">Four simple steps from problem to resolution.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {SUPPORT_JOURNEY.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: EASE }}
                className="relative text-center px-4"
              >
                <div className="relative inline-flex mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#3CB52A]/10 text-[#3CB52A] flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0A1929] text-white text-xs font-black flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-bold text-[#0A1929] mb-2">{step.title}</h3>
                <p className="text-[#5B6B7B] text-sm leading-relaxed">{step.desc}</p>
                {i < SUPPORT_JOURNEY.length - 1 && (
                  <div className="hidden lg:block absolute top-7 -right-3 text-[#C4CDD6]">
                    <ArrowRight size={18} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SUBMIT TICKET
      ══════════════════════════════════════════════════════ */}
      <section id="ticket" className="py-24 bg-[#F7FAFC]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-5 gap-14 items-start">

            {/* Form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <SectionBadge icon={<TicketCheck size={11} />} label="Support Ticket" />
                <h2 className="text-3xl md:text-4xl font-black text-[#0A1929] mb-2">Log a Support Request</h2>
                <p className="text-[#5B6B7B] mb-8 leading-relaxed">Our engineers respond based on priority level. All tickets are tracked to resolution.</p>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#3CB52A]/30 shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#3CB52A]/12 flex items-center justify-center mb-5">
                        <CheckCircle2 size={32} className="text-[#3CB52A]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0A1929] mb-2">Ticket Submitted!</h3>
                      <p className="text-[#5B6B7B] text-sm max-w-xs">We've received your request and will respond within your SLA window. Check your email for confirmation.</p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="mt-6 text-sm font-semibold text-[#3CB52A] hover:underline"
                      >
                        Submit another ticket
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-[#E7ECF2] shadow-sm p-6 sm:p-8">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                          <div className="grid sm:grid-cols-2 gap-5">
                            <FormField control={form.control} name="name" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-[#3B4A59]">Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jane Doe" className={fieldClass} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-[#3B4A59]">Email Address *</FormLabel>
                                <FormControl>
                                  <Input placeholder="jane@company.com" className={fieldClass} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>

                          <div className="grid sm:grid-cols-2 gap-5">
                            <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-[#3B4A59]">Phone (optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="+231 7XX XXX XXX" className={fieldClass} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="company" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-[#3B4A59]">Company (optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your Organization" className={fieldClass} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>

                          <div className="grid sm:grid-cols-2 gap-5">
                            <FormField control={form.control} name="category" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-[#3B4A59]">Category *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-xl bg-white border-[#E0E6ED] text-[#3B4A59]">
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
                                <FormLabel className="text-sm font-semibold text-[#3B4A59]">Priority *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-xl bg-white border-[#E0E6ED] text-[#3B4A59]">
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
                              <FormLabel className="text-sm font-semibold text-[#3B4A59]">Subject *</FormLabel>
                              <FormControl>
                                <Input placeholder="Brief summary of your issue" className={fieldClass} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-[#3B4A59]">Issue Description *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your issue in detail — include error messages, steps to reproduce, and any screenshots if available."
                                  className={`resize-none min-h-[140px] ${fieldClass}`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <button
                            type="submit"
                            className="w-full bg-[#3CB52A] hover:bg-[#2da822] text-white py-4 rounded-xl font-bold transition-all shadow-[0_8px_28px_rgba(60,181,42,0.30)] hover:shadow-[0_12px_36px_rgba(60,181,42,0.40)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                          >
                            Submit Ticket <ArrowRight size={16} />
                          </button>

                          <p className="text-center text-xs text-[#64748B]">
                            Urgent? Call us directly:{' '}
                            <a href="tel:+231761798796" className="text-[#3CB52A] font-semibold">+231 761 798 796</a>
                          </p>
                        </form>
                      </Form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-2xl border border-[#E7ECF2] shadow-sm p-6 space-y-4"
              >
                <h3 className="font-bold text-[#0A1929] flex items-center gap-2">
                  <Phone size={15} className="text-[#3CB52A]" /> Direct Contact
                </h3>
                {[
                  { icon: <Phone size={14} />, label: 'Phone', value: '+231 761 798 796', href: 'tel:+231761798796' },
                  { icon: <Mail size={14} />, label: 'Email', value: 'itechnetworkafrica@gmail.com', href: 'mailto:itechnetworkafrica@gmail.com' },
                  { icon: <Clock size={14} />, label: 'Business Hours', value: 'Mon–Fri 8AM–6PM WAT', href: null },
                  { icon: <Headphones size={14} />, label: 'Enterprise', value: '24/7 dedicated line', href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-[#3CB52A]/10 text-[#3CB52A] flex items-center justify-center">{item.icon}</div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#64748B] font-medium">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-semibold text-[#0A1929] hover:text-[#3CB52A] transition-colors break-all">{item.value}</a>
                      ) : (
                        <p className="text-sm font-semibold text-[#0A1929]">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.16 }}
                className="bg-white rounded-2xl border border-[#E7ECF2] shadow-sm p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle size={15} className="text-[#3CB52A]" />
                  <h3 className="font-bold text-[#0A1929] text-sm">Response Time Guide</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { level: 'Critical', emoji: '🔴', time: '< 2 hours' },
                    { level: 'High', emoji: '🟠', time: '< 4 hours' },
                    { level: 'Medium', emoji: '🟡', time: '< 12 hours' },
                    { level: 'Low', emoji: '🟢', time: '< 24 hours' },
                  ].map((r) => (
                    <div key={r.level} className="flex items-center justify-between">
                      <span className="text-sm text-[#5B6B7B]">{r.emoji} {r.level}</span>
                      <span className="text-sm font-bold text-[#0A1929]">{r.time}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#64748B] pt-3 mt-3 border-t border-[#EEF2F6]">Priority & Dedicated SLA clients get faster routing.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.22 }}
                className="bg-[#0A1929] rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MonitorCheck size={15} className="text-[#3CB52A]" />
                  <h3 className="font-bold text-white text-sm">What Happens Next?</h3>
                </div>
                <ol className="space-y-3">
                  {[
                    'You receive an automatic confirmation email.',
                    'A support engineer is assigned within your SLA window.',
                    'We diagnose and communicate our findings.',
                    'Issue is resolved and you confirm closure.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/55">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#3CB52A]/15 text-[#3CB52A] text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SLA TIERS
      ══════════════════════════════════════════════════════ */}
      <section id="plans" className="py-24 bg-white border-t border-[#EEF2F6] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(60,181,42,0.05) 0%, transparent 70%)' }}
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <SectionBadge icon={<Layers size={11} />} label="Support Plans" />
            <h2 className="text-3xl md:text-4xl font-black text-[#0A1929] mb-3">Choose Your Support Tier</h2>
            <p className="text-[#5B6B7B] text-lg">Upgrade anytime to unlock faster responses and dedicated engineering access.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 items-center">
            {SLA_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.09, ease: EASE }}
                className={`relative flex flex-col rounded-3xl border p-8 transition-all hover:-translate-y-1 ${
                  tier.popular
                    ? 'bg-white border-[#3CB52A]/50 shadow-[0_20px_60px_rgba(60,181,42,0.15)] scale-[1.03] z-10'
                    : 'bg-[#F7FAFC] border-[#E7ECF2] hover:border-[#DDE5EC]'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#3CB52A] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap shadow-[0_4px_16px_rgba(60,181,42,0.4)]">
                    <Star size={10} fill="white" /> Most Chosen
                  </div>
                )}

                <div className="mb-7">
                  <p className="text-[#1E7A12] text-xs font-bold tracking-widest uppercase mb-1">{tier.tagline}</p>
                  <h3 className="text-2xl font-black text-[#0A1929] mb-1">{tier.name}</h3>
                  <p className={`text-lg font-bold ${tier.popular ? 'text-[#3CB52A]' : 'text-[#5B6B7B]'}`}>{tier.price}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-[#3B4A59]">
                      <CheckCircle2 size={15} className="text-[#3CB52A] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`block text-center py-3.5 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5 ${tier.ctaStyle}`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 bg-[#F7FAFC] border-t border-[#EEF2F6]">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge icon={<HelpCircle size={11} />} label="FAQ" />
            <h2 className="text-3xl md:text-4xl font-black text-[#0A1929] mb-3">Frequently Asked Questions</h2>
            <p className="text-[#5B6B7B] mb-8">Quick answers — search or scroll through.</p>
            <div className="relative max-w-md mx-auto">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions…"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E0E6ED] text-[#0A1929] text-sm placeholder-[#9AA6B2] focus:outline-none focus:border-[#3CB52A]/50 focus:ring-2 focus:ring-[#3CB52A]/15 transition-colors shadow-sm"
              />
            </div>
          </motion.div>

          <div className="space-y-2">
            {filteredFaqs.length === 0 ? (
              <p className="text-center text-[#64748B] py-8 text-sm">No results for "<strong className="text-[#5B6B7B]">{search}</strong>". Try a different term.</p>
            ) : (
              filteredFaqs.map((f, i) => <FAQItem key={f.q} q={f.q} a={f.a} i={i} />)
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA — dark contrast band
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#F7FAFC]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-[#060E18] px-8 py-16 lg:px-16 text-center"
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(60,181,42,0.12) 0%, transparent 70%)' }}
            />
            <div className="relative z-10">
              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-12 pb-10 border-b border-white/8">
                {[
                  { icon: <Shield size={14} />, label: 'ISO 27001 Ready' },
                  { icon: <Lock size={14} />, label: 'GDPR Compliant' },
                  { icon: <Activity size={14} />, label: '99.9% Uptime SLA' },
                  { icon: <Award size={14} />, label: 'Certified Engineers' },
                  { icon: <Globe size={14} />, label: '10+ Countries Served' },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 text-white/40 text-xs font-semibold">
                    <span className="text-[#3CB52A]">{badge.icon}</span>
                    {badge.label}
                  </div>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#3CB52A]/12 border border-[#3CB52A]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] animate-pulse" />
                <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">We're Here for You</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                Still Need Help?
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Our team of certified engineers is ready to help — from quick questions to complex enterprise-scale challenges.
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
                  className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

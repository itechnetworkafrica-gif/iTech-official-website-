import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import {
  CheckCircle2, Award, Zap, Globe, Handshake, Rocket, ShieldCheck,
  GraduationCap, Landmark, TrendingUp, FileText, Loader2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiUrl } from '@/lib/apiBase';
import { useSEO } from '@/hooks/useSEO';

const PARTNERSHIP_TYPES = [
  'Technology Partner',
  'Reseller / Channel Partner',
  'NGO / Non-Profit',
  'Training & Education',
  'Government / Public Sector',
  'Investor / Strategic',
  'General',
];

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  organisation: z.string().min(2, 'Organisation is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(5, 'Phone is required'),
  website: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  partnershipType: z.string().min(1, 'Please select a partnership type'),
  message: z.string().min(20, 'Please tell us a bit more (at least 20 characters)'),
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

/* ───────────────────── Partnership models ───────────────────── */
const MODELS = [
  {
    icon: <Rocket size={26} className="text-[#3CB52A]" />,
    title: 'Technology Partners',
    desc: 'Software vendors, cloud providers and hardware manufacturers who integrate their products with our solutions or power our delivery stack.',
  },
  {
    icon: <TrendingUp size={26} className="text-[#3CB52A]" />,
    title: 'Resellers & Channel Partners',
    desc: 'Agencies, consultants and IT firms who refer clients or resell our software, hosting and managed services for commission or margin.',
  },
  {
    icon: <Handshake size={26} className="text-[#3CB52A]" />,
    title: 'NGOs & Non-Profits',
    desc: 'Mission-driven organisations we support with discounted platforms, donation systems and digital capacity building — like B4P CODEFOUND.',
  },
  {
    icon: <GraduationCap size={26} className="text-[#3CB52A]" />,
    title: 'Training & Education',
    desc: 'Schools, bootcamps and training centres partnering on curricula, internships and youth tech-skills programmes across Africa and the diaspora.',
  },
  {
    icon: <Landmark size={26} className="text-[#3CB52A]" />,
    title: 'Government & Public Sector',
    desc: 'Ministries and agencies collaborating on digital transformation, e-government platforms and national connectivity initiatives.',
  },
  {
    icon: <Globe size={26} className="text-[#3CB52A]" />,
    title: 'Investors & Strategic Alliances',
    desc: 'Investors and enterprises seeking long-term strategic alignment, joint ventures and co-developed products for emerging markets.',
  },
];

/* ───────────────── Partnership document sections ───────────────── */
const DOCUMENT = [
  {
    heading: '1. Purpose & Vision',
    body: 'iTech Network Africa builds world-class software, AI, cloud and cybersecurity solutions from Africa for the world. Our partnership programme exists to multiply that impact: we believe the fastest route to digital transformation across Africa and beyond is an ecosystem of aligned partners — not a single company working alone. Every partnership we sign must create measurable value for three parties: the partner, iTech Network Africa, and the communities and clients we serve together.',
  },
  {
    heading: '2. What We Bring to the Table',
    bullets: [
      'A proven delivery team across enterprise software, AI solutions, cloud infrastructure, cybersecurity and network engineering.',
      'An active client base across 10+ countries with 20+ delivered projects and 99% client satisfaction.',
      'A modern client portal with invoicing, support, live chat and project tracking your referred clients benefit from on day one.',
      'Co-branded marketing, joint proposals and technical pre-sales support for qualified opportunities.',
      'Fair, transparent commercial terms — referral commissions, reseller margins or revenue share, agreed in writing before work begins.',
    ],
  },
  {
    heading: '3. What We Expect From Partners',
    bullets: [
      'Integrity first — we only work with partners who deal honestly with clients, staff and regulators.',
      'Clear communication — a named point of contact and reasonable response times on active engagements.',
      'Brand respect — our logo, name and materials are used only as agreed; the same protection applies to your brand.',
      'Quality representation — partners never over-promise on our behalf; scopes and timelines are confirmed by our team.',
      'Compliance — adherence to applicable laws, including data-protection and anti-corruption regulations, in every market we serve together.',
    ],
  },
  {
    heading: '4. How Engagements Work',
    body: 'Every partnership starts with a written agreement covering scope, commercial terms, confidentiality and duration. Referral partners introduce opportunities and earn commission on closed business. Resellers hold margin on our products and services and may white-label where agreed. Strategic and technology partners co-develop offerings under a joint roadmap with quarterly reviews. All client data remains protected under our privacy policy, and either party may exit with notice as defined in the agreement — client commitments are always honoured through transition.',
  },
  {
    heading: '5. Confidentiality & Data Protection',
    body: 'Information shared during a partnership — pricing, client lists, roadmaps, technical documentation — is confidential by default. Partners handling client data must meet our security baseline: encrypted storage and transfer, least-privilege access and prompt breach notification. We sign mutual NDAs before deep technical or commercial disclosure.',
  },
  {
    heading: '6. How to Apply',
    body: 'Complete the application form below. Our partnerships team reviews every submission within five business days. Strong applications tell us who you are, the markets you reach, the capabilities you bring and what a successful first 12 months would look like. Shortlisted applicants are invited to a discovery call, followed by a tailored partnership proposal and onboarding.',
  },
];

export default function PartnersPage() {
  useSEO({
    title: 'Partner Programme — Resell & Collaborate with Us',
    description: 'Join the iTech Network Africa Partner Programme. Resellers and agencies across Africa earn commissions promoting our technology services. Apply today.',
    canonical: '/partners',
  });
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '', organisation: '', email: '', phone: '',
      website: '', country: '', partnershipType: '', message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl('/api/partnerships/apply'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Submission failed. Please try again.');
      setSubmitted(true);
      toast({
        title: 'Application received',
        description: 'Thank you! Our partnerships team will review your application and reach out within 5 business days.',
      });
      form.reset();
    } catch (err) {
      toast({
        title: 'Could not submit application',
        description: err instanceof Error ? err.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero
        badge="Strategic Alliances"
        title="Partner With Us"
        subtitle="Join an ecosystem of technology companies, NGOs, educators and public institutions building Africa's digital future together."
        ctaPrimary={{ label: 'Apply Now', href: '#apply' }}
        ctaSecondary={{ label: 'Read the Partnership Document', href: '#document' }}
      />

      {/* Partnership models */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">Ways to Partner</h2>
          <p className="text-[#6B7280] text-lg">Six partnership models, one goal — delivering world-class technology and opportunity across Africa and beyond.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODELS.map((m, i) => (
            <motion.div
              key={m.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-sm hover:shadow-lg hover:border-[#3CB52A]/40 transition-all flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-[#3CB52A]/10 flex items-center justify-center mb-5">{m.icon}</div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">{m.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partner Program Tiers */}
      <section className="py-20 lg:py-28 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">Partner Program Tiers</h2>
            <p className="text-[#6B7280] text-lg">Commercial partners grow through three tiers as our joint business expands.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Silver Partner',
                icon: <Award size={32} className="text-slate-400" />,
                desc: 'For local agencies and consultants looking to refer clients and co-sell solutions.',
                perks: ['10% Referral commission', 'Basic marketing materials', 'Standard technical support'],
              },
              {
                title: 'Gold Partner',
                icon: <Zap size={32} className="text-amber-400" />,
                desc: 'For established IT firms integrating our software and cloud products into their offerings.',
                perks: ['20% Margin on products', 'Co-branded marketing', 'Priority technical support', 'Dedicated account manager'],
                featured: true,
              },
              {
                title: 'Platinum Partner',
                icon: <Globe size={32} className="text-indigo-400" />,
                desc: 'For enterprise integrators driving joint large-scale government and corporate deployments.',
                perks: ['Custom revenue share', 'Joint go-to-market strategy', '24/7 direct engineering access', 'Board-level strategic alignment'],
              },
            ].map((tier, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`bg-white rounded-2xl p-8 border ${tier.featured ? 'border-[#3CB52A] shadow-xl relative' : 'border-[#E5E7EB] shadow-sm'} flex flex-col h-full`}
              >
                {tier.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3CB52A] text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">{tier.icon}</div>
                <h3 className="text-2xl font-bold text-[#111827] mb-4">{tier.title}</h3>
                <p className="text-[#6B7280] mb-8">{tier.desc}</p>
                <ul className="space-y-4 mb-4 flex-grow">
                  {tier.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-[#3CB52A] shrink-0" />
                      <span className="text-[#111827] font-medium">{perk}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership document */}
      <section id="document" className="py-20 lg:py-28 max-w-4xl mx-auto px-6 lg:px-8 scroll-mt-24">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#3CB52A]/10 text-[#2e911f] px-4 py-1.5 text-sm font-semibold mb-5">
            <FileText size={16} /> Partnership Framework
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">The iTech Network Africa Partnership Document</h2>
          <p className="text-[#6B7280] text-lg">
            Read this before applying — it explains how we partner, what you can expect from us, and what we expect in return.
          </p>
        </motion.div>

        <div className="space-y-10">
          {DOCUMENT.map((s) => (
            <motion.div key={s.heading} {...fadeUp} className="border-l-4 border-[#3CB52A] pl-6">
              <h3 className="text-xl font-bold text-[#111827] mb-3">{s.heading}</h3>
              {s.body && <p className="text-[#4B5563] leading-relaxed">{s.body}</p>}
              {s.bullets && (
                <ul className="space-y-3 mt-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[#4B5563]">
                      <ShieldCheck size={18} className="text-[#3CB52A] shrink-0 mt-1" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 lg:py-28 bg-[#0A1929] text-white relative scroll-mt-24">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Become a Partner</h2>
            <p className="text-[#BDBDBD] text-lg mb-8 leading-relaxed">
              Your application goes straight to our partnerships team's dashboard — no email chains, no lost forms. We review every submission within five business days.
            </p>
            <div className="space-y-6">
              {[
                { n: 1, t: 'Submit Application', d: 'Tell us about your organisation, reach and goals.' },
                { n: 2, t: 'Review & Discovery Call', d: 'Our team reviews within 5 business days and books a call with shortlisted partners.' },
                { n: 3, t: 'Agreement & Onboarding', d: 'Sign the partnership agreement, get portal access and launch together.' },
              ].map((s) => (
                <div key={s.n} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#3CB52A]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#3CB52A] font-bold">{s.n}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{s.t}</h4>
                    <p className="text-[#BDBDBD] text-sm">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 text-[#111827] shadow-2xl">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#3CB52A]/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={34} className="text-[#3CB52A]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Application Received</h3>
                <p className="text-[#6B7280] mb-8">
                  Thank you for your interest in partnering with iTech Network Africa. Our team will review your application and contact you within 5 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[#3CB52A] font-semibold hover:underline"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-6">Partnership Application</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} className="bg-[#F8F9FA]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="organisation" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organisation</FormLabel>
                          <FormControl><Input placeholder="Acme Corp" {...field} className="bg-[#F8F9FA]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Email</FormLabel>
                          <FormControl><Input placeholder="john@acme.com" {...field} className="bg-[#F8F9FA]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl><Input placeholder="+231..." {...field} className="bg-[#F8F9FA]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="website" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (optional)</FormLabel>
                          <FormControl><Input placeholder="https://acme.com" {...field} className="bg-[#F8F9FA]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl><Input placeholder="Liberia" {...field} className="bg-[#F8F9FA]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="partnershipType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partnership Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#F8F9FA]">
                              <SelectValue placeholder="Select type..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PARTNERSHIP_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposal / Organisation Profile</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your organisation, the markets you reach, and what a successful partnership would look like..."
                            className="resize-none bg-[#F8F9FA]" rows={5} {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#3CB52A] hover:bg-[#2e911f] disabled:opacity-60 text-white py-3 rounded-md font-semibold transition-colors mt-2 flex items-center justify-center gap-2"
                    >
                      {submitting && <Loader2 size={18} className="animate-spin" />}
                      {submitting ? 'Submitting…' : 'Submit Application'}
                    </button>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

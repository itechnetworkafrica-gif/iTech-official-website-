import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Calendar, Clock, User, Mail, Phone, Building2, MessageSquare,
  ArrowRight, CheckCircle2, Briefcase, Globe, Sparkles, ChevronDown,
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PageHero } from '@/components/PageHero';

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

const formSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(5, 'Enter a valid phone number'),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  serviceInterest: z.string().min(1, 'Please select a service'),
  projectDescription: z.string().min(20, 'Please describe your project (at least 20 characters)'),
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  hearAboutUs: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SERVICES = [
  'Enterprise Software Development',
  'AI & Machine Learning',
  'Cloud Infrastructure & DevOps',
  'Cybersecurity Solutions',
  'Web & Mobile App Development',
  'Network Solutions',
  'IT Support & Managed Services',
  'Digital Transformation Strategy',
  'Data Analytics & Business Intelligence',
  'E-commerce & Online Platforms',
  'ERP / CRM Implementation',
  'Other / Not Listed',
];

const BUDGETS = [
  'Under $5,000',
  '$5,000 – $15,000',
  '$15,000 – $50,000',
  '$50,000 – $100,000',
  '$100,000 – $250,000',
  'Over $250,000',
  'Not sure yet',
];

const TIMELINES = [
  'As soon as possible',
  'Within 1 month',
  '1 – 3 months',
  '3 – 6 months',
  '6 – 12 months',
  'Over 12 months',
  'Exploratory / No fixed timeline',
];

const HEAR_ABOUT_US = [
  'Google Search',
  'Social Media',
  'Referral from a colleague',
  'LinkedIn',
  'Conference / Event',
  'News article / Blog',
  'Previous client',
  'Other',
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const BENEFITS = [
  { icon: <Sparkles size={20} />, title: 'Expert Guidance', desc: 'Speak directly with senior engineers and strategists who understand your industry.' },
  { icon: <Globe size={20} />, title: 'Tailored Solutions', desc: 'Every consultation is customised to your specific business goals and constraints.' },
  { icon: <Clock size={20} />, title: '45-Minute Deep Dive', desc: 'A focused session covering your challenges, objectives, and a clear path forward.' },
  { icon: <CheckCircle2 size={20} />, title: 'No Obligation', desc: 'Completely free with no pressure — just honest, expert advice for your project.' },
];

export default function ConsultationPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '', email: '', phone: '', company: '', jobTitle: '',
      serviceInterest: '', projectDescription: '', budget: '', timeline: '',
      preferredDate: '', preferredTime: '', hearAboutUs: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/consultation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setSubmitted(true);
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({
          title: 'Submission failed',
          description: (err as { message?: string }).message || 'Please try again or email us directly.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Connection error',
        description: 'Could not reach our servers. Please try again shortly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col w-full bg-white">
        <PageHero
          badge="Consultation Requested"
          title="We'll Be in Touch Soon"
          subtitle="Thank you for booking a consultation with iTech Network Africa."
        />
        <section className="py-24 max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="w-24 h-24 rounded-full bg-[#f0fdf4] text-[#3CB52A] flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          <motion.h2 {...fadeUp} className="text-3xl font-bold text-[#111827] mb-4">
            Consultation Request Received!
          </motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="text-[#6B7280] text-lg mb-10 leading-relaxed">
            Our team has received your request and will reach out within <strong>24 hours</strong> to confirm your consultation time and share any preparation details.
          </motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex flex-wrap gap-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Back to Home <ArrowRight size={16} />
            </a>
            <a
              href="/services"
              className="inline-flex items-center gap-2 border border-[#E5E7EB] hover:border-[#3CB52A] text-[#374151] hover:text-[#3CB52A] font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Explore Our Services
            </a>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero
        badge="Free · No Commitment"
        title="Book a Consultation"
        subtitle="Tell us about your project and we'll pair you with the right experts. Every engagement starts with a conversation."
      />

      {/* ── Why consult with us ── */}
      <section className="py-16 bg-[#F8FAFB]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-6 rounded-2xl border border-[#F0F0F0] hover:border-[#3CB52A]/40 hover:shadow-[0_4px_20px_rgba(60,181,42,0.1)] transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f0fdf4] text-[#3CB52A] flex items-center justify-center mb-4">
                  {b.icon}
                </div>
                <h4 className="font-bold text-[#111827] mb-2">{b.title}</h4>
                <p className="text-[#6B7280] text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking form ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-[#060E18] text-white rounded-3xl p-8">
                <div className="w-12 h-12 rounded-xl bg-[#3CB52A]/20 text-[#3CB52A] flex items-center justify-center mb-5">
                  <Calendar size={22} />
                </div>
                <h3 className="text-xl font-bold mb-3">What to expect</h3>
                <ul className="space-y-3 text-white/65 text-sm">
                  {[
                    'We confirm your slot within 24 hours',
                    '45-minute video or phone call',
                    'Senior consultant assigned to your industry',
                    'Post-call summary with recommendations',
                    'No sales pressure — just honest advice',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-[#3CB52A] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F8FAFB] rounded-2xl p-6 border border-[#E5E7EB]">
                <h4 className="font-bold text-[#111827] mb-3 flex items-center gap-2">
                  <Phone size={16} className="text-[#3CB52A]" />
                  Prefer to call?
                </h4>
                <p className="text-[#6B7280] text-sm mb-4">Reach us directly on business days, 8 AM – 6 PM WAT.</p>
                <a
                  href="tel:+231761978796"
                  className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  +231 761 978 796
                </a>
              </div>

              <div className="bg-[#F8FAFB] rounded-2xl p-6 border border-[#E5E7EB]">
                <h4 className="font-bold text-[#111827] mb-3 flex items-center gap-2">
                  <Mail size={16} className="text-[#3CB52A]" />
                  Email us directly
                </h4>
                <a
                  href="mailto:itechnetworkafrica@gmail.com"
                  className="text-[#3CB52A] hover:underline text-sm font-medium break-all"
                >
                  itechnetworkafrica@gmail.com
                </a>
              </div>
            </motion.aside>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-3"
            >
              <div className="bg-[#F8F9FA] rounded-3xl border border-[#E5E7EB] p-8 md:p-10">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare size={22} className="text-[#3CB52A]" />
                  <h2 className="text-2xl font-bold text-[#111827]">Tell us about your project</h2>
                </div>
                <p className="text-[#6B7280] text-sm mb-8">
                  The more detail you share, the better we can prepare for your consultation.
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                    {/* Personal info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5"><User size={13} className="text-[#3CB52A]" /> Full Name *</FormLabel>
                          <FormControl><Input className="bg-white" placeholder="John Mensah" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5"><Mail size={13} className="text-[#3CB52A]" /> Email Address *</FormLabel>
                          <FormControl><Input className="bg-white" placeholder="john@company.com" type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5"><Phone size={13} className="text-[#3CB52A]" /> Phone Number *</FormLabel>
                          <FormControl><Input className="bg-white" placeholder="+231 761 000 000" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5"><Building2 size={13} className="text-[#3CB52A]" /> Company / Organisation</FormLabel>
                          <FormControl><Input className="bg-white" placeholder="Acme Ltd." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="jobTitle" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5"><Briefcase size={13} className="text-[#3CB52A]" /> Job Title</FormLabel>
                          <FormControl><Input className="bg-white" placeholder="CTO / Founder / Manager" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="serviceInterest" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5"><Sparkles size={13} className="text-[#3CB52A]" /> Service Interest *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select a service…" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SERVICES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="projectDescription" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5"><MessageSquare size={13} className="text-[#3CB52A]" /> Project Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-white resize-none"
                            rows={5}
                            placeholder="Describe your project, goals, current challenges, and what you're hoping to achieve. The more detail, the better prepared we'll be."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="budget" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5"><ChevronDown size={13} className="text-[#3CB52A]" /> Budget Range *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select budget…" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BUDGETS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="timeline" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5"><Clock size={13} className="text-[#3CB52A]" /> Project Timeline *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select timeline…" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIMELINES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* Preferred slot */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                      <p className="text-[13px] font-semibold text-[#374151] mb-3 flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#3CB52A]" /> Preferred Consultation Slot (optional)
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="preferredDate" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-[#6B7280]">Preferred Date</FormLabel>
                            <FormControl><Input type="date" className="bg-[#F8FAFB]" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="preferredTime" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-[#6B7280]">Preferred Time (WAT)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-[#F8FAFB]">
                                  <SelectValue placeholder="Select time…" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(t => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>

                    <FormField control={form.control} name="hearAboutUs" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5"><Globe size={13} className="text-[#3CB52A]" /> How did you hear about us?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {HEAR_ABOUT_US.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#3CB52A] hover:bg-[#2e911f] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-[15px] transition-colors mt-2 shadow-[0_4px_20px_rgba(60,181,42,0.35)]"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          Book My Consultation <ArrowRight size={18} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[#9CA3AF] text-xs mt-2">
                      By submitting you agree to be contacted by iTech Network Africa regarding your enquiry.
                    </p>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

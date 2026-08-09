import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Shield, Lock, Copy, Check, CheckCircle2, ArrowRight,
  Smartphone, Building2, CreditCard, AlertCircle, Clock,
  User, Mail, Phone, FileText, DollarSign, ChevronDown,
  Star, Zap, Globe, Server, BarChart3, Cpu, Palette,
  Info, BadgeCheck, Send, RefreshCw, HelpCircle,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiUrl } from '@/lib/apiBase';
import { pricingCategories } from '@/lib/pricing-data';
import { useSEO } from '@/hooks/useSEO';

/* ─── constants ─────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const BANK = {
  bank:    'UBA Liberia Limited',
  branch:  'SINKOR Branch',
  account: '5306050310591',
  name:    'MR WILMOT KERKULAH',
  swift:   'UBA Liberia',
};

const MOBILE = {
  number: '+231761978796',
  name:   'Wilmot Kerkulah',
  network: 'Mobile Money (Lonestar / Orange)',
};

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <CreditCard size={20} />,
    title: 'Choose Your Plan',
    desc: 'Select the service package below that best fits your business needs.',
  },
  {
    step: '02',
    icon: <Building2 size={20} />,
    title: 'Make Your Deposit',
    desc: 'Send payment via Bank Transfer to UBA or Mobile Money to +231761978796.',
  },
  {
    step: '03',
    icon: <FileText size={20} />,
    title: 'Submit Your Transaction ID',
    desc: 'Fill the verification form with your transaction reference from the bank/mobile receipt.',
  },
  {
    step: '04',
    icon: <CheckCircle2 size={20} />,
    title: 'We Verify & Activate',
    desc: 'Our team reviews within 24 hours and sends a confirmation email when your service is live.',
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'website-design':    <Globe    size={15} />,
  'web-hosting':       <Server   size={15} />,
  'digital-marketing': <BarChart3 size={15} />,
  'it-consultancy':    <Cpu      size={15} />,
  'graphic-design':    <Palette  size={15} />,
};

const CURRENCIES = ['USD', 'LRD'];
const METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer (UBA)' },
  { value: 'mobile_money',  label: 'Mobile Money' },
];

/* ─── form schema ────────────────────────────────────────────────────────── */

const schema = z.object({
  name:           z.string().min(2,  'Full name is required'),
  email:          z.string().email('Valid email address required'),
  phone:          z.string().optional(),
  plan:           z.string().min(2,  'Please select or type the plan name'),
  amount:         z.string().min(1,  'Amount is required'),
  currency:       z.string().min(1,  'Currency required'),
  method:         z.string().min(1,  'Select payment method'),
  transaction_id: z.string().min(3,  'Transaction / reference ID is required'),
  payment_date:   z.string().optional(),
  notes:          z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

/* ─── helpers ────────────────────────────────────────────────────────────── */

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  function doCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={doCopy}
      title={`Copy ${label}`}
      className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all"
    >
      {copied ? <Check size={13} className="text-[#3CB52A]" /> : <Copy size={13} />}
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/8 last:border-0">
      <span className="text-white/40 text-xs font-medium min-w-[110px]">{label}</span>
      <span className="text-white text-sm font-semibold flex-1 text-right">{value}</span>
      <CopyButton value={value} label={label} />
    </div>
  );
}

/* ─── main page ──────────────────────────────────────────────────────────── */

export default function BillingPage() {
  useSEO({
    title: 'Make a Payment — Secure Billing Portal',
    description: 'Securely pay for iTech Network Africa services via Bank Transfer (UBA Liberia) or Mobile Money. Submit your transaction ID for fast verification.',
    canonical: '/billing',
  });
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; category: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState(pricingCategories[0].id);
  const [submitted, setSubmitted] = useState<{ ref: string; name: string } | null>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', email: '', phone: '', plan: '', amount: '',
      currency: 'USD', method: '', transaction_id: '', payment_date: '', notes: '',
    },
  });

  function selectPlan(name: string, price: string, category: string) {
    setSelectedPlan({ name, price, category });
    form.setValue('plan', name);
    // Scroll to payment form
    setTimeout(() => formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  }

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch(apiUrl('/api/billing/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json() as { ok?: boolean; ref?: string; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || 'Submission failed');
      setSubmitted({ ref: data.ref ?? 'BIL-????', name: values.name });
      form.reset();
    } catch (err: any) {
      toast({ title: 'Submission failed', description: err.message, variant: 'destructive' });
    }
  }

  const activeCat = pricingCategories.find(c => c.id === activeCategory)!;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl border border-[#E7ECF2] shadow-xl p-10 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#3CB52A]/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-[#3CB52A]" />
          </div>
          <h2 className="text-2xl font-black text-[#0A1929] mb-2">Payment Submitted!</h2>
          <p className="text-[#5B6B7B] mb-6">
            Thank you, <strong>{submitted.name}</strong>. Your submission has been received.
          </p>
          <div className="bg-[#F0FBF0] border border-[#3CB52A]/20 rounded-2xl p-5 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#5B6B7B]">Reference Number</span>
              <span className="font-black text-[#3CB52A] font-mono">{submitted.ref}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#5B6B7B]">Status</span>
              <span className="font-bold text-amber-600 flex items-center gap-1.5"><Clock size={13} /> Pending Review</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#5B6B7B]">Review time</span>
              <span className="font-bold text-[#0A1929]">Within 24 hours</span>
            </div>
          </div>
          <div className="bg-[#F7FAFC] rounded-xl p-4 mb-8 text-left">
            <p className="text-[12px] text-[#5B6B7B] leading-relaxed">
              Our team will verify your transaction ID against our bank records. You'll receive a confirmation email once verified. If there is any issue, we'll contact you at the email you provided.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setSubmitted(null)}
              className="flex-1 py-3 rounded-xl border-2 border-[#E5E7EB] text-[#0A1929] font-semibold text-sm hover:border-[#3CB52A]/40 transition-colors"
            >
              Submit Another
            </button>
            <Link
              href="/support"
              className="flex-1 py-3 rounded-xl bg-[#0A1929] text-white font-semibold text-sm hover:bg-[#132B45] transition-colors flex items-center justify-center gap-2"
            >
              Contact Support <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC]">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#060E18] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#3CB52A]/8 blur-[120px]" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-16 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="max-w-2xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3CB52A]/30 bg-[#3CB52A]/10 mb-6">
              <Shield size={12} className="text-[#3CB52A]" />
              <span className="text-[#3CB52A] text-xs font-bold tracking-wide uppercase">Secure Payment Portal</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Pay for Your <span className="text-[#3CB52A]">iTech</span> Service
            </h1>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              We accept Bank Transfer and Mobile Money. After your deposit, submit your transaction ID below — our team verifies every payment personally within 24 hours.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Lock size={13} />, text: 'Verified by our team' },
                { icon: <Shield size={13} />, text: 'Secure & private' },
                { icon: <Clock size={13} />, text: '24hr verification' },
                { icon: <BadgeCheck size={13} />, text: 'Receipt required' },
              ].map(t => (
                <div key={t.text} className="flex items-center gap-1.5 text-white/40 text-xs font-medium">
                  <span className="text-[#3CB52A]">{t.icon}</span>
                  {t.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-b border-[#EEF2F6]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07, ease: EASE }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[11px] font-black text-[#3CB52A] font-mono">{s.step}</span>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block flex-1 h-px bg-[#E7ECF2]" />
                  )}
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#0A1929] flex items-center justify-center text-[#3CB52A] mb-3">
                  {s.icon}
                </div>
                <h3 className="font-bold text-[#0A1929] text-sm mb-1">{s.title}</h3>
                <p className="text-[#5B6B7B] text-xs leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-16 space-y-16">

        {/* ══ STEP 1 — CHOOSE PLAN ══════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-8 rounded-xl bg-[#0A1929] text-white font-black text-sm flex items-center justify-center">1</span>
            <div>
              <h2 className="text-2xl font-black text-[#0A1929]">Choose Your Plan</h2>
              <p className="text-[#5B6B7B] text-sm">Select the package you're paying for — or type it manually in the form below.</p>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {pricingCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#0A1929] text-white shadow-md'
                    : 'bg-white border border-[#E5E7EB] text-[#5B6B7B] hover:border-[#0A1929]/30 hover:text-[#0A1929]'
                }`}
              >
                <span className={activeCategory === cat.id ? 'text-[#3CB52A]' : 'text-[#9AA6B2]'}>
                  {CATEGORY_ICONS[cat.id]}
                </span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Plan cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {activeCat.packages.map(pkg => {
                const isSelected = selectedPlan?.name === pkg.name;
                return (
                  <button
                    key={pkg.name}
                    onClick={() => selectPlan(pkg.name, pkg.price, activeCat.label)}
                    className={`text-left rounded-2xl border-2 p-5 transition-all duration-200 relative ${
                      isSelected
                        ? 'border-[#3CB52A] bg-[#F0FBF0] shadow-[0_0_0_4px_rgba(60,181,42,0.1)]'
                        : 'border-[#E5E7EB] bg-white hover:border-[#3CB52A]/40 hover:shadow-md'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute top-3 right-3 text-[9px] font-black bg-[#3CB52A] text-white px-2 py-0.5 rounded-full">POPULAR</span>
                    )}
                    {isSelected && (
                      <CheckCircle2 size={16} className="absolute top-3 left-3 text-[#3CB52A]" />
                    )}
                    <p className={`text-[11px] font-semibold mb-1 ${isSelected ? 'text-[#3CB52A]' : 'text-[#9AA6B2]'}`}>
                      {activeCat.label}
                    </p>
                    <h3 className="font-black text-[#0A1929] text-base mb-1">{pkg.name}</h3>
                    <p className="text-[#3CB52A] font-black text-lg">{pkg.price}
                      {pkg.period && <span className="text-[#9AA6B2] text-xs font-semibold">{pkg.period}</span>}
                    </p>
                    <p className="text-[#5B6B7B] text-[11px] leading-relaxed mt-2 line-clamp-2">{pkg.description}</p>
                    <ul className="mt-3 space-y-1">
                      {pkg.features.slice(0, 3).map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-[11px] text-[#5B6B7B]">
                          <Check size={10} className="text-[#3CB52A] flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                      {pkg.features.length > 3 && (
                        <li className="text-[10px] text-[#9AA6B2] pl-4">+{pkg.features.length - 3} more</li>
                      )}
                    </ul>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {selectedPlan && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F0FBF0] border border-[#3CB52A]/30 text-sm"
            >
              <CheckCircle2 size={15} className="text-[#3CB52A]" />
              <span className="text-[#0A1929] font-semibold">Selected: {selectedPlan.name}</span>
              <span className="text-[#3CB52A] font-black">{selectedPlan.price}</span>
              <button onClick={() => { setSelectedPlan(null); form.setValue('plan', ''); }} className="ml-2 text-[#9AA6B2] hover:text-red-400 transition-colors text-xs">× Clear</button>
            </motion.div>
          )}
        </section>

        {/* ══ STEP 2 — PAYMENT DETAILS ══════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-8 rounded-xl bg-[#0A1929] text-white font-black text-sm flex items-center justify-center">2</span>
            <div>
              <h2 className="text-2xl font-black text-[#0A1929]">Make Your Payment</h2>
              <p className="text-[#5B6B7B] text-sm">Send your deposit to one of the accounts below. Keep your receipt — you'll need the transaction ID.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Bank Transfer */}
            <div className="bg-[#0A1929] rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#3CB52A]/20 flex items-center justify-center">
                  <Building2 size={20} className="text-[#3CB52A]" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Bank Transfer</h3>
                  <p className="text-white/40 text-xs">UBA Liberia Limited</p>
                </div>
              </div>
              <div className="space-y-0">
                <DetailRow label="Bank" value={BANK.bank} />
                <DetailRow label="Branch" value={BANK.branch} />
                <DetailRow label="Account No." value={BANK.account} />
                <DetailRow label="Account Name" value={BANK.name} />
              </div>
              <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                <AlertCircle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-200/80 text-[11px] leading-relaxed">
                  After depositing at UBA, ask the teller for a Transaction Receipt. The <strong>Transaction ID</strong> (e.g. IR1666) is printed on it — you'll need it to verify your payment below.
                </p>
              </div>
            </div>

            {/* Mobile Money */}
            <div className="bg-[#0A1929] rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#3CB52A]/20 flex items-center justify-center">
                  <Smartphone size={20} className="text-[#3CB52A]" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Mobile Money</h3>
                  <p className="text-white/40 text-xs">Lonestar MTN / Orange Money</p>
                </div>
              </div>
              <div className="space-y-0">
                <DetailRow label="Number" value={MOBILE.number} />
                <DetailRow label="Name" value={MOBILE.name} />
                <DetailRow label="Network" value={MOBILE.network} />
              </div>
              <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
                <Info size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-200/80 text-[11px] leading-relaxed">
                  After sending, your mobile money app shows a <strong>Transaction Reference</strong> (e.g. 5306050310591). Screenshot it and use that number in the form below.
                </p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-white/5">
                <p className="text-white/30 text-[10px] text-center">
                  Verify the name <strong className="text-white/50">Wilmot Kerkulah</strong> appears before confirming your transfer.
                </p>
              </div>
            </div>
          </div>

          {/* Payment terms */}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Website projects: 50% upfront, 50% before launch.',
              'Hosting packages: full payment before activation.',
              'Monthly services billed in advance.',
              'Keep your receipt until your service is confirmed active.',
              'Contact support if your payment is not verified within 24 hrs.',
              'Currency: We accept USD and LRD (Liberian Dollar).',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white border border-[#EEF2F6]">
                <CheckCircle2 size={13} className="text-[#3CB52A] flex-shrink-0 mt-0.5" />
                <p className="text-[#5B6B7B] text-xs leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ STEP 3 — VERIFY PAYMENT FORM ══════════════════════════════════ */}
        <section ref={formSectionRef}>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-8 rounded-xl bg-[#3CB52A] text-white font-black text-sm flex items-center justify-center">3</span>
            <div>
              <h2 className="text-2xl font-black text-[#0A1929]">Submit Your Transaction ID</h2>
              <p className="text-[#5B6B7B] text-sm">Complete this form <strong>after</strong> making your deposit. We'll match your Transaction ID to our bank records.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-[#E7ECF2] shadow-sm p-8">
                <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-[#0A1929]/5 border border-[#0A1929]/10">
                  <Lock size={14} className="text-[#3CB52A]" />
                  <p className="text-[#0A1929] text-xs font-semibold">Your information is kept private and used only for payment verification.</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-[#374151] uppercase tracking-wider flex items-center gap-1.5"><User size={12} />Full Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl><Input placeholder="As on your bank/MoMo account" {...field} className="rounded-xl border-[#E5E7EB] focus:border-[#3CB52A]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-[#374151] uppercase tracking-wider flex items-center gap-1.5"><Mail size={12} />Email Address <span className="text-red-500">*</span></FormLabel>
                          <FormControl><Input placeholder="your@email.com" type="email" {...field} className="rounded-xl border-[#E5E7EB] focus:border-[#3CB52A]" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* Phone */}
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-[#374151] uppercase tracking-wider flex items-center gap-1.5"><Phone size={12} />Phone Number <span className="text-[#9AA6B2] font-normal normal-case">(optional)</span></FormLabel>
                        <FormControl><Input placeholder="+231 XX XXX XXXX" {...field} className="rounded-xl border-[#E5E7EB] focus:border-[#3CB52A]" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Plan */}
                    <FormField control={form.control} name="plan" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-[#374151] uppercase tracking-wider flex items-center gap-1.5"><FileText size={12} />Service / Plan <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Business Website, Business Hosting …"
                            {...field}
                            className="rounded-xl border-[#E5E7EB] focus:border-[#3CB52A]"
                          />
                        </FormControl>
                        <p className="text-[11px] text-[#9AA6B2] mt-1">Pre-filled if you selected a plan above — or type it manually.</p>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Amount + Currency */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <FormField control={form.control} name="amount" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-[#374151] uppercase tracking-wider flex items-center gap-1.5"><DollarSign size={12} />Amount Deposited <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input placeholder="e.g. 750 or 9,000" {...field} className="rounded-xl border-[#E5E7EB] focus:border-[#3CB52A]" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="currency" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-[#374151] uppercase tracking-wider">Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-[#E5E7EB] focus:border-[#3CB52A]">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* Payment method */}
                    <FormField control={form.control} name="method" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-[#374151] uppercase tracking-wider">Payment Method <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl border-[#E5E7EB] focus:border-[#3CB52A]">
                              <SelectValue placeholder="Select how you paid" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {METHODS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Transaction ID */}
                    <FormField control={form.control} name="transaction_id" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-[#374151] uppercase tracking-wider flex items-center gap-1.5">
                          <FileText size={12} />Transaction / Reference ID <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. IR1666 or 5306050310591"
                            {...field}
                            className="rounded-xl border-[#E5E7EB] focus:border-[#3CB52A] font-mono"
                          />
                        </FormControl>
                        <p className="text-[11px] text-[#9AA6B2] mt-1">
                          Found on your bank receipt (Transaction ID) or mobile money confirmation (Reference No.).
                        </p>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Payment date */}
                    <FormField control={form.control} name="payment_date" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-[#374151] uppercase tracking-wider">Date of Payment <span className="text-[#9AA6B2] font-normal normal-case">(optional but helpful)</span></FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="rounded-xl border-[#E5E7EB] focus:border-[#3CB52A]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Notes */}
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-[#374151] uppercase tracking-wider">Additional Notes <span className="text-[#9AA6B2] font-normal normal-case">(optional)</span></FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any extra details — e.g. branch location, depositor name if different, specific feature requests…"
                            rows={3}
                            {...field}
                            className="rounded-xl border-[#E5E7EB] focus:border-[#3CB52A] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Disclaimer */}
                    <div className="p-4 rounded-xl bg-[#FFF8F0] border border-amber-200 flex gap-3">
                      <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-800 text-[11px] leading-relaxed">
                        <strong>Important:</strong> Submitting a false or duplicate transaction ID constitutes fraud and will result in service denial. Your submission is logged with timestamp, IP address, and payment details.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full py-4 rounded-2xl bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold text-base shadow-[0_8px_24px_rgba(60,181,42,0.35)] hover:shadow-[0_12px_32px_rgba(60,181,42,0.45)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                      {form.formState.isSubmitting ? (
                        <><RefreshCw size={16} className="animate-spin" /> Submitting…</>
                      ) : (
                        <><Send size={16} /> Submit for Verification</>
                      )}
                    </button>
                  </form>
                </Form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* What happens next */}
              <div className="bg-[#0A1929] rounded-2xl p-7">
                <div className="flex items-center gap-2 mb-5">
                  <Zap size={15} className="text-[#3CB52A]" />
                  <h3 className="text-white font-bold">What happens next?</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: <Clock size={14} />, title: 'Within 24 hours', desc: 'Our team checks your Transaction ID against our bank and mobile money records.' },
                    { icon: <Mail size={14} />, title: 'Confirmation email', desc: 'You receive a confirmation to your email once your payment is verified.' },
                    { icon: <Zap size={14} />, title: 'Service activated', desc: 'Your project or service is started immediately after verification.' },
                    { icon: <HelpCircle size={14} />, title: 'Need help?', desc: 'If not confirmed within 24 hrs, contact support with your reference number.' },
                  ].map((s) => (
                    <div key={s.title} className="flex gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#3CB52A]/20 flex items-center justify-center text-[#3CB52A]">{s.icon}</div>
                      <div>
                        <p className="text-white text-xs font-semibold">{s.title}</p>
                        <p className="text-white/40 text-[11px] leading-relaxed mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample receipt guide */}
              <div className="bg-white rounded-2xl border border-[#E7ECF2] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={15} className="text-[#0A1929]" />
                  <h3 className="text-[#0A1929] font-bold text-sm">Where to find your Transaction ID</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#F7FAFC] border border-[#EEF2F6]">
                    <p className="text-[11px] font-bold text-[#0A1929] mb-1">🏦 Bank Receipt (UBA)</p>
                    <p className="text-[11px] text-[#5B6B7B]">Look for <strong>TRANSACTION ID:</strong> — e.g. <span className="font-mono text-[#3CB52A]">IR1666</span></p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F7FAFC] border border-[#EEF2F6]">
                    <p className="text-[11px] font-bold text-[#0A1929] mb-1">📱 Mobile Money SMS</p>
                    <p className="text-[11px] text-[#5B6B7B]">Look for <strong>Ref No:</strong> or <strong>Transaction No:</strong> in your confirmation SMS.</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-[#F0FBF0] rounded-2xl border border-[#3CB52A]/20 p-6">
                <p className="text-[#0A1929] font-bold text-sm mb-2">Questions about payment?</p>
                <p className="text-[#5B6B7B] text-xs mb-4">Our team is available Mon–Fri 8AM–6PM WAT.</p>
                <div className="space-y-2">
                  <a href="tel:+231761978796" className="flex items-center gap-2 text-xs text-[#0A1929] font-semibold hover:text-[#3CB52A] transition-colors">
                    <Phone size={12} className="text-[#3CB52A]" /> +231 761 978 796
                  </a>
                  <a href="mailto:itechnetworkafrica@gmail.com" className="flex items-center gap-2 text-xs text-[#0A1929] font-semibold hover:text-[#3CB52A] transition-colors">
                    <Mail size={12} className="text-[#3CB52A]" /> itechnetworkafrica@gmail.com
                  </a>
                  <Link href="/support" className="flex items-center gap-2 text-xs text-[#0A1929] font-semibold hover:text-[#3CB52A] transition-colors">
                    <HelpCircle size={12} className="text-[#3CB52A]" /> Submit a support ticket
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

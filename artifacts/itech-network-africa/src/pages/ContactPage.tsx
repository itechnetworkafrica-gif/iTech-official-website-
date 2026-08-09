import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSEO } from '@/hooks/useSEO';

const RECIPIENT = 'itechnetworkafrica@gmail.com';

const formSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone required"),
  company: z.string().optional(),
  interest: z.string().min(1, "Select a service"),
  message: z.string().min(10, "Message required"),
});

const CONTACT_INFO = [
  {
    icon: <Phone size={24} />,
    title: 'Phone',
    lines: ['+231 761 798 796'],
    href: 'tel:+231761798796',
  },
  {
    icon: <Mail size={24} />,
    title: 'Email',
    lines: ['itechnetworkafrica@gmail.com'],
    href: 'mailto:itechnetworkafrica@gmail.com',
  },
  {
    icon: <MapPin size={24} />,
    title: 'Location',
    lines: ['Monrovia, Liberia'],
    href: 'https://maps.google.com/?q=Monrovia,Liberia',
  },
  {
    icon: <Clock size={24} />,
    title: 'Business Hours',
    lines: ['Mon – Fri: 8:00 AM – 6:00 PM WAT', 'Technical Support: 24/7'],
    href: null,
  },
];

export default function ContactPage() {
  useSEO({
    title: 'Contact Us — Get in Touch',
    description: 'Contact iTech Network Africa in Liberia. Call +231761978796 or email us for website design, hosting, digital marketing and IT consultancy enquiries.',
    canonical: '/contact',
  });
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', company: '', interest: '', message: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const subject = `[Contact Form] ${values.interest} – ${values.name}`;
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Company: ${values.company || 'N/A'}`,
      `Interest: ${values.interest}`,
      ``,
      `Message:`,
      values.message,
    ].join('\n');

    window.open(
      `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_blank'
    );

    toast({ title: 'Message Ready', description: 'Your email client has opened with the message pre-filled. Please hit Send to submit.' });
    form.reset();
  }

  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero
        badge="Get in touch"
        title="Contact Us"
        subtitle="Ready to start your digital transformation? Reach out and our team of experts will respond within 24 hours."
      />

      {/* ── Contact info cards ── */}
      <section className="py-16 bg-[#F8FAFB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONTACT_INFO.map((c, i) => {
              const inner = (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white p-6 rounded-2xl border border-[#F0F0F0] h-full ${c.href ? 'hover:border-[#3CB52A]/40 hover:shadow-[0_4px_20px_rgba(60,181,42,0.1)] transition-all' : ''}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] text-[#3CB52A] flex items-center justify-center mb-4">
                    {c.icon}
                  </div>
                  <h4 className="font-bold text-[#060E18] mb-2">{c.title}</h4>
                  {c.lines.map((line, j) => (
                    <p key={j} className="text-[#6B7280] text-sm leading-relaxed">{line}</p>
                  ))}
                </motion.div>
              );
              return c.href ? (
                <a key={c.title} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {inner}
                </a>
              ) : (
                <div key={c.title}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section id="quote" className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 w-full">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#F8F9FA] p-8 md:p-10 rounded-3xl border border-[#E5E7EB]"
        >
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare size={22} className="text-[#3CB52A]" />
            <h2 className="text-3xl font-bold text-[#111827]">Send a Message</h2>
          </div>
          <p className="text-[#6B7280] mb-8">Fill out the form and we'll get back to you promptly.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem><FormLabel>Company</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="interest" render={({ field }) => (
                <FormItem><FormLabel>Primary Interest</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Select service..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Enterprise Software">Enterprise Software</SelectItem>
                      <SelectItem value="AI & Automation">AI & Automation</SelectItem>
                      <SelectItem value="Cloud Infrastructure">Cloud Infrastructure</SelectItem>
                      <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="Network Solutions">Network Solutions</SelectItem>
                      <SelectItem value="Other Services">Other Services</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea className="bg-white resize-none" rows={5} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#3CB52A] hover:bg-[#2e911f] text-white py-3.5 rounded-xl font-semibold transition-colors mt-4 shadow-[0_4px_16px_rgba(60,181,42,0.3)]">
                Send Message <Send size={18} />
              </button>
            </form>
          </Form>
        </motion.div>

        {/* Map embed + extra info */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <div className="flex-1 rounded-3xl overflow-hidden border border-[#E5E7EB] min-h-[280px]">
            <iframe
              title="iTech Network Africa Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63384.45!2d-10.8!3d6.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf0a029d5c5b0001%3A0x40e82d51b0!2sMonrovia%2C+Liberia!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '280px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="bg-[#060E18] rounded-3xl p-8">
            <h3 className="text-white font-bold text-xl mb-4">Prefer a direct call?</h3>
            <p className="text-white/55 text-sm mb-6">Our team is available Monday to Friday, 8 AM – 6 PM WAT. For urgent support, we're available 24/7.</p>
            <a
              href="tel:+231761798796"
              className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <Phone size={16} /> +231 761 798 796
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Regional Offices ── */}
      <section id="locations" className="py-20 bg-[#0A1929] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Global Reach, Local Presence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Monrovia HQ', desc: 'Main operations, engineering, and executive management — Monrovia, Liberia.' },
              { title: 'West Africa Regional', desc: 'Serving clients in Ghana, Nigeria, and Sierra Leone with dedicated in-country teams.' },
              { title: 'East Africa Office', desc: 'Strategic expansion hub for the East African market and emerging opportunities.' },
            ].map((office, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-[#112236] border border-white/10 hover:border-[#3CB52A]/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3CB52A]/15 flex items-center justify-center mb-4">
                  <MapPin size={18} className="text-[#3CB52A]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{office.title}</h3>
                <p className="text-[#BDBDBD] text-sm leading-relaxed">{office.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

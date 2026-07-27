import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { MessageSquare, Mail, Phone, LifeBuoy, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  subject: z.string().min(5, "Subject required"),
  message: z.string().min(10, "Message required"),
});

const faqs = [
  { q: "What is your typical response time?", a: "For enterprise clients on a standard SLA, our response time is under 1 hour. For general inquiries, we aim to respond within 24 business hours." },
  { q: "How do I report a critical system outage?", a: "If you are an active enterprise client, please use the dedicated emergency phone number provided in your SLA documentation for immediate 24/7 technical routing." },
  { q: "Do you offer remote troubleshooting?", a: "Yes, our engineers can securely access your systems remotely to diagnose and resolve software and infrastructure issues." },
  { q: "Where can I find API documentation?", a: "All API documentation is available in the Resources section. You will need your developer access token to view specific restricted endpoints." },
  { q: "Can I upgrade my support tier?", a: "Absolutely. Contact your account manager or email support to upgrade to our Priority or Dedicated Support tiers." },
  { q: "How are software updates handled?", a: "SaaS products are updated automatically. For on-premise deployments, our team coordinates with your IT department for scheduled maintenance windows." },
  { q: "Do you provide end-user training?", a: "Yes, all major software deployments include comprehensive training sessions for administrators and end-users, along with digital manuals." },
  { q: "What security compliance do you adhere to?", a: "We build systems compliant with ISO 27001, GDPR, and regional African data protection regulations." }
];

export default function SupportPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { email: "", subject: "", message: "" }});

  function onSubmit() {
    toast({ title: "Ticket Created", description: "Your support ticket has been logged. Check your email." });
    form.reset();
  }

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA]">
      <PageHero badge="We're Here to Help" title="Support Center" subtitle="Access technical support, browse documentation, or open a service ticket." />

      {/* Channels */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8 w-full -mt-10 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <MessageSquare size={24} />, title: "Live Chat", desc: "Chat with our support team in real-time." },
            { icon: <Mail size={24} />, title: "Email Support", desc: "Send us an email and we'll reply within 24h." },
            { icon: <Phone size={24} />, title: "Phone Support", desc: "Call us directly for urgent matters." },
            { icon: <LifeBuoy size={24} />, title: "Help Center", desc: "Browse guides and tutorials." }
          ].map((ch, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-[#E5E7EB] text-center hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-[#f0fdf0] text-[#3CB52A] rounded-full flex items-center justify-center mx-auto mb-4">{ch.icon}</div>
              <h3 className="font-bold text-[#111827] mb-2">{ch.title}</h3>
              <p className="text-sm text-[#6B7280]">{ch.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 lg:py-20 max-w-7xl mx-auto px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-16 items-start">
        {/* Ticket Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E7EB]">
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Open a Ticket</h2>
          <p className="text-[#6B7280] mb-8">Describe your issue in detail so our engineers can assist you efficiently.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Account Email</FormLabel><FormControl><Input placeholder="you@company.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="Brief description of the issue" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem><FormLabel>Detailed Message</FormLabel><FormControl><Textarea placeholder="Please include error codes if applicable..." rows={6} className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <button type="submit" className="w-full bg-[#3CB52A] hover:bg-[#2e911f] text-white py-3 rounded-md font-semibold transition-colors mt-2">Submit Ticket</button>
            </form>
          </Form>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Frequently Asked Questions</h2>
          <p className="text-[#6B7280] mb-8">Quick answers to common administrative and technical questions.</p>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white border border-[#E5E7EB] rounded-xl px-4 data-[state=open]:border-[#3CB52A]">
                <AccordionTrigger className="hover:no-underline font-semibold text-[#111827] text-left py-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-[#6B7280] pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

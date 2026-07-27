import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone required"),
  company: z.string().optional(),
  interest: z.string().min(1, "Select a service"),
  message: z.string().min(10, "Message required"),
});

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { name: "", email: "", phone: "", company: "", interest: "", message: "" }});

  function onSubmit() {
    toast({ title: "Message Sent", description: "Thank you. Our team will contact you within 24 hours." });
    form.reset();
  }

  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero badge="Get in touch" title="Contact Us" subtitle="Ready to start your digital transformation? Reach out to our team of experts to discuss your technical requirements." />

      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div className="bg-[#F8F9FA] p-8 md:p-10 rounded-3xl border border-[#E5E7EB]">
          <h2 className="text-3xl font-bold text-[#111827] mb-2">Send a Message</h2>
          <p className="text-[#6B7280] mb-8">Fill out the form below and we'll get back to you promptly.</p>
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
                      <SelectItem value="Software Dev">Enterprise Software</SelectItem>
                      <SelectItem value="AI Solutions">AI & Automation</SelectItem>
                      <SelectItem value="Cloud">Cloud Infrastructure</SelectItem>
                      <SelectItem value="Other">Other Services</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea className="bg-white resize-none" rows={5} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#3CB52A] hover:bg-[#2e911f] text-white py-3.5 rounded-md font-semibold transition-colors mt-4">
                Send Message <Send size={18} />
              </button>
            </form>
          </Form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center">
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-[#111827] mb-8">Contact Information</h2>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 bg-[#f0fdf0] text-[#3CB52A] rounded-full flex items-center justify-center"><MapPin size={24} /></div>
                <div>
                  <h4 className="font-bold text-lg text-[#111827]">Headquarters</h4>
                  <p className="text-[#6B7280] leading-relaxed">Crown Hill<br />Monrovia, Liberia</p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 bg-[#f0fdf0] text-[#3CB52A] rounded-full flex items-center justify-center"><Phone size={24} /></div>
                <div>
                  <h4 className="font-bold text-lg text-[#111827]">Phone</h4>
                  <p className="text-[#6B7280]">Sales: +231 770 000 000<br />Support: +231 880 000 000</p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 bg-[#f0fdf0] text-[#3CB52A] rounded-full flex items-center justify-center"><Mail size={24} /></div>
                <div>
                  <h4 className="font-bold text-lg text-[#111827]">Email</h4>
                  <p className="text-[#6B7280]">info@itechnetworkafrica.com<br />support@itechnetworkafrica.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 bg-[#f0fdf0] text-[#3CB52A] rounded-full flex items-center justify-center"><Clock size={24} /></div>
                <div>
                  <h4 className="font-bold text-lg text-[#111827]">Business Hours</h4>
                  <p className="text-[#6B7280]">Monday - Friday: 8:00 AM - 6:00 PM WAT<br />Technical Support: 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Offices */}
      <section className="py-20 bg-[#0A1929] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Global Reach, Local Presence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Monrovia HQ", desc: "Main operations, engineering, and executive management." },
              { title: "West Africa Regional", desc: "Serving clients in Ghana, Nigeria, and Sierra Leone." },
              { title: "East Africa Office", desc: "Strategic hub for expansion into the East African market." }
            ].map((office, i) => (
              <div key={i} className="p-8 rounded-2xl bg-[#112236] border border-white/10 hover:border-[#3CB52A]/50 transition-colors">
                <h3 className="text-xl font-bold mb-3">{office.title}</h3>
                <p className="text-[#BDBDBD] text-sm">{office.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

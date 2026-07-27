import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { CheckCircle2, Award, Zap, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().min(2, "Company is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone is required"),
  type: z.string().min(1, "Please select a partnership type"),
  message: z.string().min(10, "Please provide some details"),
});

const partners = ["Microsoft", "Google Cloud", "AWS", "Oracle", "Cisco", "IBM", "Salesforce", "SAP"];

export default function PartnersPage() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      type: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Application Received",
      description: "Our partnership team will contact you shortly.",
    });
    form.reset();
  }

  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero 
        badge="Strategic Alliances"
        title="Our Partners"
        subtitle="Collaborating with global technology leaders to deliver uncompromising quality and innovation to the African market."
      />

      {/* Tech Partners Logos */}
      <section className="py-20 bg-[#F8F9FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h4 className="text-[#6B7280] font-medium tracking-widest uppercase text-sm mb-12">Trusted Technology Partners</h4>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {partners.map((partner) => (
              <div key={partner} className="text-2xl md:text-3xl font-black text-[#0A1929] tracking-tighter">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Program Tiers */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">Partner Program Tiers</h2>
          <p className="text-[#6B7280] text-lg">Join our ecosystem and grow your business with iTech Network Africa's extensive market reach.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Silver Partner", 
              icon: <Award size={32} className="text-slate-400" />,
              desc: "For local agencies and consultants looking to refer clients and co-sell solutions.",
              perks: ["10% Referral commission", "Basic marketing materials", "Standard technical support"]
            },
            { 
              title: "Gold Partner", 
              icon: <Zap size={32} className="text-amber-400" />,
              desc: "For established IT firms integrating our software and cloud products into their offerings.",
              perks: ["20% Margin on products", "Co-branded marketing", "Priority technical support", "Dedicated account manager"],
              featured: true
            },
            { 
              title: "Platinum Partner", 
              icon: <Globe size={32} className="text-indigo-400" />,
              desc: "For enterprise integrators driving joint large-scale government and corporate deployments.",
              perks: ["Custom revenue share", "Joint go-to-market strategy", "24/7 direct engineering access", "Board-level strategic alignment"]
            }
          ].map((tier, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
              
              <ul className="space-y-4 mb-8 flex-grow">
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
      </section>

      {/* Application Form */}
      <section className="py-20 lg:py-28 bg-[#0A1929] text-white relative">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Become a Partner</h2>
            <p className="text-[#BDBDBD] text-lg mb-8 leading-relaxed">
              We are actively expanding our partner network across Africa and globally. Fill out the application, and our channel team will reach out to discuss synergies.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#3CB52A]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#3CB52A] font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Submit Application</h4>
                  <p className="text-[#BDBDBD] text-sm">Tell us about your business and goals.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#3CB52A]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#3CB52A] font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Discovery Call</h4>
                  <p className="text-[#BDBDBD] text-sm">Meet with our channel managers to align strategies.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#3CB52A]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#3CB52A] font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Onboarding & Launch</h4>
                  <p className="text-[#BDBDBD] text-sm">Get access to portals, resources, and start earning.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-[#111827] shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Application Form</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} className="bg-[#F8F9FA]" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl><Input placeholder="Acme Corp" {...field} className="bg-[#F8F9FA]" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email</FormLabel>
                        <FormControl><Input placeholder="john@acme.com" {...field} className="bg-[#F8F9FA]" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="+231..." {...field} className="bg-[#F8F9FA]" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partnership Interest</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#F8F9FA]">
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="silver">Silver (Referral)</SelectItem>
                          <SelectItem value="gold">Gold (Reseller/Integrator)</SelectItem>
                          <SelectItem value="platinum">Platinum (Enterprise Co-sell)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message / Company Profile</FormLabel>
                      <FormControl><Textarea placeholder="Tell us about your technical capabilities and market reach..." className="resize-none bg-[#F8F9FA]" rows={4} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button type="submit" className="w-full bg-[#3CB52A] hover:bg-[#2e911f] text-white py-3 rounded-md font-semibold transition-colors mt-2">
                  Submit Application
                </button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}

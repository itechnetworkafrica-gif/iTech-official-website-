import React from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { Heart, Zap, MapPin, Briefcase, GraduationCap, Laptop, ArrowRight } from 'lucide-react';
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
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  position: z.string().min(1, "Please select a position"),
  portfolio: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  coverLetter: z.string().min(20, "Please provide a cover letter"),
});

const jobs = [
  { title: "Senior Full-Stack Engineer", dept: "Engineering", location: "Monrovia / Remote", type: "Full-time" },
  { title: "Machine Learning Researcher", dept: "AI Division", location: "Remote", type: "Full-time" },
  { title: "Enterprise Software Sales", dept: "Sales", location: "Accra / Remote", type: "Full-time" },
  { title: "UI/UX Product Designer", dept: "Design", location: "Monrovia", type: "Full-time" },
  { title: "Cloud Infrastructure Architect", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Technical Support Specialist", dept: "Support", location: "Monrovia", type: "Full-time" },
  { title: "DevOps Engineer", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Project Manager", dept: "Operations", location: "Monrovia", type: "Full-time" }
];

export default function CareersPage() {
  useSEO({
    title: 'Careers — Jobs in Tech at iTech Network Africa',
    description: 'Explore career opportunities at iTech Network Africa in Liberia. Join our team in website design, digital marketing and IT consultancy.',
    canonical: '/careers',
  });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", position: "", portfolio: "", coverLetter: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const subject = `[Job Application] ${values.position} – ${values.name}`;
    const body = [
      `Applicant: ${values.name}`,
      `Email: ${values.email}`,
      `Position: ${values.position}`,
      `Portfolio/LinkedIn: ${values.portfolio || 'N/A'}`,
      ``,
      `Cover Letter:`,
      values.coverLetter,
    ].join('\n');

    window.open(
      `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_blank'
    );

    toast({ title: "Application Ready", description: "Your email client has opened. Please hit Send to submit your application." });
    form.reset();
  }

  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero
        badge="Build With Us"
        title="Join Our Team"
        subtitle="Help us build the next generation of enterprise software and AI solutions for the African continent."
      />

      {/* Culture & Benefits */}
      <section className="py-20 lg:py-28 bg-[#F8F9FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">Why iTech Network Africa?</h2>
            <p className="text-[#6B7280] text-lg">We offer a challenging, fast-paced environment where you can do the best work of your career, solving massive problems at scale.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Heart size={24} />, title: "Health & Wellness", desc: "Comprehensive health coverage for you and your dependents." },
              { icon: <Laptop size={24} />, title: "Remote-First", desc: "Work from anywhere in the world, or join our Monrovia HQ." },
              { icon: <GraduationCap size={24} />, title: "Growth Budget", desc: "Annual stipend for courses, conferences, and certifications." },
              { icon: <Zap size={24} />, title: "Competitive Salary", desc: "Top-tier compensation pegged to global industry standards." }
            ].map((perk, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm text-center">
                <div className="w-12 h-12 rounded-full bg-[#f0fdf0] text-[#3CB52A] flex items-center justify-center mx-auto mb-4">
                  {perk.icon}
                </div>
                <h3 className="font-bold text-[#111827] mb-2">{perk.title}</h3>
                <p className="text-[#6B7280] text-sm">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#111827] mb-10">Open Positions</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-xl border border-[#E5E7EB] hover:border-[#3CB52A] hover:shadow-md transition-all group flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <div>
                <h3 className="font-bold text-lg text-[#111827] mb-2 group-hover:text-[#3CB52A] transition-colors">{job.title}</h3>
                <div className="flex flex-wrap gap-3 text-xs font-medium text-[#6B7280]">
                  <span className="flex items-center gap-1 bg-[#F8F9FA] px-2 py-1 rounded"><Briefcase size={12} /> {job.dept}</span>
                  <span className="flex items-center gap-1 bg-[#F8F9FA] px-2 py-1 rounded"><MapPin size={12} /> {job.location}</span>
                  <span className="flex items-center gap-1 bg-[#F8F9FA] px-2 py-1 rounded">{job.type}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  form.setValue('position', job.title);
                  document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="shrink-0 px-5 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm font-semibold hover:bg-[#3CB52A] hover:text-white hover:border-[#3CB52A] transition-colors"
              >
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form" className="py-20 bg-[#0A1929] text-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Submit Your Application</h2>
            <p className="text-[#BDBDBD]">Don't see a perfect fit? Select 'General Application' and we'll keep you in mind.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-[#111827]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input placeholder="jane@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="General Application">General Application</SelectItem>
                          {jobs.map(j => <SelectItem key={j.title} value={j.title}>{j.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="portfolio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portfolio / LinkedIn / GitHub URL (Optional)</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter</FormLabel>
                      <FormControl><Textarea placeholder="Tell us why you're a great fit..." className="resize-none" rows={5} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#3CB52A] hover:bg-[#2e911f] text-white py-3 rounded-md font-semibold transition-colors mt-4">
                  Send Application <ArrowRight size={16} />
                </button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}

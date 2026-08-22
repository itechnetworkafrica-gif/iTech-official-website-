import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'wouter';
import {
  ArrowLeft, Mail, MapPin, Calendar, Briefcase,
  Quote, CheckCircle2, Users, ExternalLink, ChevronRight,
} from 'lucide-react';
import { FaLinkedinIn, FaXTwitter, FaInstagram, FaFacebook } from 'react-icons/fa6';
import { TEAM, getMemberBySlug } from '@/data/team';
import NotFound from '@/pages/not-found';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: EASE },
});

const SOCIAL_ICON: Record<string, React.ReactNode> = {
  linkedin:  <FaLinkedinIn size={16} />,
  twitter:   <FaXTwitter size={16} />,
  instagram: <FaInstagram size={16} />,
  facebook:  <FaFacebook size={16} />,
};

// All departments use brand colours — green on light green
const DEPT_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  Leadership:            { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  Engineering:           { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  'Finance & Operations':{ bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  Operations:            { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  Administration:        { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
};

export default function TeamMemberPage() {
  const params = useParams<{ slug: string }>();
  const member = getMemberBySlug(params.slug ?? '');

  if (!member) return <NotFound />;

  const dept = DEPT_COLOR[member.department] ?? DEPT_COLOR['Leadership'];
  const otherMembers = TEAM.filter(m => m.slug !== member.slug);

  const mailtoHref = `mailto:${member.email}?subject=Hello%20${encodeURIComponent(member.name)}&body=Hi%20${encodeURIComponent(member.name.split(' ')[0])}%2C%0A%0A`;

  return (
    <div className="flex flex-col w-full bg-white">

      {/* ═══════════════════════════
          HERO
      ═══════════════════════════ */}
      <section className="relative bg-[#060E18] overflow-hidden">

        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 70% 50%, ${member.color}18 0%, transparent 65%)` }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-0 relative z-10">

          {/* Breadcrumb */}
          <motion.div {...fadeUp(0)} className="flex items-center gap-2 text-white/40 text-sm mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="opacity-40" />
            <Link href="/about#our-team" className="hover:text-white transition-colors">Team</Link>
            <ChevronRight size={14} className="opacity-40" />
            <span className="text-white/70 truncate">{member.name}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-end">

            {/* ── Left: text ── */}
            <div className="pb-16 lg:pb-24">
              {/* Department badge */}
              <motion.div {...fadeUp(0.05)} className="mb-6">
                <span
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border"
                  style={{ background: dept.bg, color: dept.text, borderColor: dept.border }}
                >
                  <Briefcase size={12} />
                  {member.department}
                </span>
              </motion.div>

              <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-6xl font-black text-white leading-tight mb-3">
                {member.name.split(' ')[0]}<br />
                <span style={{ color: member.color }}>{member.name.split(' ').slice(1).join(' ')}</span>
              </motion.h1>

              <motion.p {...fadeUp(0.15)} className="text-white/50 text-xl font-medium mb-8">
                {member.role}
              </motion.p>

              {/* Meta row */}
              <motion.div {...fadeUp(0.2)} className="flex flex-wrap gap-5 mb-10 text-sm text-white/40">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {member.location}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {member.joinedYear}</span>
              </motion.div>

              {/* Social links */}
              {Object.keys(member.socials).length > 0 && (
                <motion.div {...fadeUp(0.25)} className="flex items-center gap-3">
                  {Object.entries(member.socials).map(([platform, url]) => (
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={platform}
                        className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-white/40 hover:text-white transition-all"
                      >
                        {SOCIAL_ICON[platform]}
                      </a>
                    )
                  ))}
                  <a
                    href={mailtoHref}
                    className="ml-2 inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all border border-white/10"
                  >
                    <Mail size={15} />
                    Send a Message
                  </a>
                </motion.div>
              )}
            </div>

            {/* ── Right: photo / avatar ── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
              className="relative self-end lg:justify-self-end"
            >
              {/* Decorative ring behind photo */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[340px] h-[340px] lg:w-[420px] lg:h-[420px] rounded-full"
                style={{ background: `radial-gradient(circle, ${member.color}18 0%, transparent 70%)`, border: `1px solid ${member.color}25` }}
              />

              <div className="relative z-10 flex justify-center">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-72 h-96 lg:w-80 lg:h-[26rem] object-cover object-top rounded-t-[180px] rounded-b-2xl shadow-2xl"
                    style={{ boxShadow: `0 32px 80px ${member.color}30` }}
                  />
                ) : (
                  <div
                    className="w-72 h-96 lg:w-80 lg:h-[26rem] rounded-t-[180px] rounded-b-2xl flex items-center justify-center text-white font-black shadow-2xl"
                    style={{ background: `linear-gradient(145deg, ${member.color}, ${member.color}99)`, boxShadow: `0 32px 80px ${member.color}40`, fontSize: '7rem' }}
                  >
                    {member.avatar}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          ABOUT / BIO
      ═══════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-14 lg:gap-20">

            {/* Main bio */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div {...fadeUp(0)}>
                <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: member.color }}>
                  About {member.name.split(' ')[0]}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-[#0A0A0A] leading-tight mb-8">
                  Meet the {member.role.split(' ').slice(-1)[0]}
                </h2>
              </motion.div>

              <div className="space-y-5">
                {member.longBio.map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                    className="text-[#4B5563] text-base md:text-lg leading-relaxed"
                  >
                    {para}
                  </motion.p>
                ))}
              </div>

              {/* Quote pull */}
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="mt-10 relative pl-6 border-l-4"
                style={{ borderColor: member.color }}
              >
                <Quote
                  size={28}
                  className="absolute -top-1 -left-1.5 rotate-180 opacity-20"
                  style={{ color: member.color }}
                />
                <p className="text-xl md:text-2xl font-bold text-[#0A0A0A] leading-snug italic">
                  "{member.quote}"
                </p>
                <footer className="mt-3 text-sm font-semibold" style={{ color: member.color }}>
                  — {member.name}
                </footer>
              </motion.blockquote>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Quick info card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#F8F9FA] rounded-2xl p-6 border border-[#E5E7EB]"
              >
                <h3 className="font-bold text-[#0A0A0A] mb-4 text-sm uppercase tracking-wider">Profile</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Role',       value: member.role       },
                    { label: 'Department', value: member.department  },
                    { label: 'Location',   value: member.location    },
                    { label: 'Joined',     value: member.joinedYear  },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-3 py-3 border-b border-[#EBEBEB] last:border-0">
                      <span className="text-[#9CA3AF] text-xs font-semibold w-24 shrink-0 pt-0.5">{label}</span>
                      <span className="text-[#0A0A0A] text-sm font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Expertise tags */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.07 }}
                className="bg-[#F8F9FA] rounded-2xl p-6 border border-[#E5E7EB]"
              >
                <h3 className="font-bold text-[#0A0A0A] mb-4 text-sm uppercase tracking-wider">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                      style={{ background: dept.bg, color: dept.text, borderColor: dept.border }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Contact CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}cc)` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2">Get in Touch</h3>
                  <p className="text-white/80 text-sm mb-4 leading-relaxed">
                    Want to work with or reach {member.name.split(' ')[0]}? Send a message through our team.
                  </p>
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-2 bg-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all hover:bg-white/90"
                    style={{ color: member.color }}
                  >
                    <Mail size={15} /> Send Message
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          RESPONSIBILITIES
      ═══════════════════════════ */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: member.color }}>What {member.name.split(' ')[0]} Does</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0A0A0A] mb-10">Key Responsibilities</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {member.responsibilities.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
                className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex items-start gap-4 hover:border-opacity-50 hover:shadow-md transition-all"
                style={{ '--tw-border-opacity': '1' } as React.CSSProperties}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: dept.bg }}
                >
                  <CheckCircle2 size={17} style={{ color: member.color }} />
                </div>
                <p className="text-[#374151] text-sm font-medium leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          MEET THE REST OF THE TEAM
      ═══════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          >
            <div>
              <span className="text-xs font-bold tracking-widest uppercase mb-3 block text-[#3CB52A]">
                The Team
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0A0A0A]">Meet the Others</h2>
            </div>
            <Link
              href="/about#our-team"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3CB52A] hover:underline whitespace-nowrap"
            >
              <Users size={15} /> View Full Team
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {otherMembers.map((m, i) => (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
              >
                <Link href={`/team/${m.slug}`}>
                  <a className="group flex flex-col bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#3CB52A]/40 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    {/* Mini photo */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F0F2F5]">
                      {m.photo ? (
                        <img
                          src={m.photo}
                          alt={m.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white text-4xl font-black"
                          style={{ backgroundColor: m.color }}
                        >
                          {m.avatar}
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[#0A1929]/0 group-hover:bg-[#0A1929]/40 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                          View Profile <ExternalLink size={13} />
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-[#0A0A0A] text-sm leading-tight">{m.name}</p>
                      <p className="text-xs font-medium mt-0.5" style={{ color: m.color }}>{m.role}</p>
                    </div>
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          CTA STRIP
      ═══════════════════════════ */}
      <section className="bg-[#060E18] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to work with our team?
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
              Tell us about your project and the right person on our team will get back to you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <a className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-[0_6px_28px_rgba(60,181,42,0.4)]">
                  Start a Project
                </a>
              </Link>
              <Link href="/about#our-team">
                <a className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5">
                  <ArrowLeft size={16} /> Back to Team
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

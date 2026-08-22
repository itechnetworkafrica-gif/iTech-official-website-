import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowLeft, Mail, MapPin, Phone, Printer, Globe,
  Briefcase, GraduationCap, Award, Languages, Users, Heart,
  CheckCircle2, ChevronRight, Star, BookOpen, Palette, Cpu,
  Megaphone, HandHeart, Building2,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, delay, ease: EASE },
});

/* ─────────── CV DATA ─────────── */

const CONTACT = {
  phone1: '+231 555 770 641',
  phone2: '+231 776 836 689',
  email: 'kerkulahwilmot492@gmail.com',
  address: '5th Street Sinkor, Monrovia, Liberia',
};

const TITLES = ['Community Development Leader', 'Data Scientist', 'ICT Consultant', 'Programme Manager'];

const SUMMARY = [
  'Wilmot Kerkulah is a dynamic, mission-driven professional with over five years of demonstrated experience across community development, ICT consultancy, graphic design, financial management, and programme leadership in Liberia. He has built a career grounded in grassroots mobilisation, behaviour change communication, and sustainable development initiatives targeting vulnerable populations.',
  'Wilmot has led the strategic design and implementation of community-based projects across health, education, and youth empowerment — coordinating partnerships with government, NGOs, and international donors. His technical expertise spans ICT advisory, digital literacy training, web development, and data analytics, complemented by professional-grade competencies in graphic design and brand communication.',
  'He is a certified Young African Leaders Initiative (YALI) member with extensive training in social enterprise, governance, grant writing, and public-private partnerships — currently pursuing a BSc in Data Science & Analytics and a Bachelor of Theology, reflecting his commitment to lifelong learning and holistic leadership.',
];

interface Role {
  title: string;
  org: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  highlights: string[];
}

interface RoleGroup {
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

const EXPERIENCE: RoleGroup[] = [
  {
    label: 'Leadership & Executive Roles',
    icon: <Building2 size={16} />,
    roles: [
      {
        title: 'Founder & Executive Director',
        org: 'iTech Network Africa',
        location: 'Monrovia, Liberia',
        period: '2023 – Present',
        current: true,
        summary: 'Provides strategic leadership and oversight for a technology organisation delivering digital solutions and ICT services across Liberia and Africa.',
        highlights: [
          'Provides high-level technical support and innovative digital solutions for organisational and client-facing projects across multiple sectors.',
          'Advises on ICT strategy, hardware procurement, network infrastructure, and software selection to optimise operational efficiency.',
          'Supports the development, maintenance, and optimisation of websites, databases, and information management systems.',
          'Designs and delivers ICT training programmes on digital literacy, internet safety, cybersecurity awareness, and computer fundamentals.',
          'Supports technology integration initiatives in health, education, and development programmes.',
        ],
      },
      {
        title: 'Executive Director & Co-Founder',
        org: 'Hope Alive Development Foundation',
        location: 'Gbarnga City, Bong County, Liberia',
        period: 'Nov 2021 – Present',
        current: true,
        summary: 'Provides strategic and operational leadership for a community-based non-profit focused on health, education, and youth empowerment.',
        highlights: [
          'Leads the design, planning, and implementation of community-based programmes across health promotion, basic education, youth empowerment, and livelihoods.',
          'Represents the Foundation at high-level meetings with government ministries, UN agencies, international NGOs, bilateral donors, and civil society.',
          'Coordinates all fundraising — grant writing, donor proposals, and partnership development.',
          'Oversees financial management, budget planning, internal controls, and donor compliance reporting.',
          'Develops and implements monitoring & evaluation (M&E) frameworks to assess programme effectiveness.',
        ],
      },
      {
        title: 'Financial Management Specialist (Consultant)',
        org: 'Hope Alive Development Foundation',
        location: 'Gbarnga City, Bong County, Liberia',
        period: '2021 – Present',
        current: true,
        summary: 'Provides technical oversight and day-to-day financial accountability for the Foundation\'s programmes.',
        highlights: [
          'Prepares comprehensive budgets, financial plans, operational manuals, and donor certifications.',
          'Monitors commitments, budget utilisation, and financial plans daily to prevent overspending and ensure compliance.',
          'Sets up automated budgeting, commitment tracking, and accounting systems.',
          'Prepares monthly, quarterly, and semi-annual financial reports for internal management and donors.',
        ],
      },
    ],
  },
  {
    label: 'Technical & ICT Consultancy',
    icon: <Cpu size={16} />,
    roles: [
      {
        title: 'Technical Consultant',
        org: "Children's Reading Competition Program",
        location: 'Gbarnga City, Bong County, Liberia',
        period: '2023 – Present',
        current: true,
        summary: 'Provides expert guidance on programme design, implementation quality, and educational impact for an early-literacy initiative.',
        highlights: [
          'Supports development of age-appropriate reading materials, competition frameworks, and instructional content aligned with national literacy standards.',
          'Designs and facilitates training workshops for facilitators, judges, support staff, and school coordinators.',
          'Develops evaluation tools and rubrics assessing reading comprehension, oral fluency, vocabulary, and presentation.',
          'Advocates for integrating structured reading programmes into formal school curricula.',
        ],
      },
      {
        title: 'B2B & Technical Director',
        org: 'Lewanah LLC (U.S.-based, global)',
        location: 'Digital Products & Services',
        period: '2025 – Present',
        current: true,
        summary: 'Leads B2B sales strategy, client acquisition, and technical direction for a global portfolio of digital products and services.',
        highlights: [
          'Manages relationships with corporate clients globally and negotiates B2B partnership agreements and service contracts.',
          'Provides technical oversight for the development, deployment, and maintenance of digital products across international markets.',
          'Manages cross-functional technical teams to ensure timely delivery and quality assurance.',
        ],
      },
      {
        title: 'Independent Technical Consultant',
        org: 'Freelance / Self-Employed',
        location: 'Serving clients globally',
        period: 'Ongoing',
        current: true,
        summary: 'High-level technical consultancy on ICT strategy, digital transformation, and technology adoption for individual clients worldwide.',
        highlights: [
          'Advises on software selection, digital tools, web development, data management, and technology-enabled business solutions.',
          'Delivers remote and in-person technical support, troubleshooting, and capacity-building sessions.',
        ],
      },
    ],
  },
  {
    label: 'Communications, Design & Brand',
    icon: <Palette size={16} />,
    roles: [
      {
        title: 'Graphic Designer · Secretary General · Communication Consultant',
        org: 'Health Tech Liberia',
        location: 'Monrovia, Liberia',
        period: '2024 – Present',
        current: true,
        summary: 'Serves in three capacities for a technology-driven health organisation improving healthcare delivery through digital solutions.',
        highlights: [
          'Designs visual communication materials — brochures, event banners, reports, and social media graphics — and maintains brand assets.',
          'Manages internal communications, board meeting coordination, and official documentation as Secretary General.',
          'Develops strategic communication plans, press releases, policy briefs, and media engagement strategies.',
        ],
      },
      {
        title: 'Social Media, Marketing & Operations Associate',
        org: 'B4P CODE FOUND (501(c) U.S.-based)',
        location: 'Ohio, USA · Remote',
        period: '2025 – Present',
        current: true,
        summary: 'Advances the mission of peace-building and community development through digital content, marketing campaigns, and operational support.',
        highlights: [
          'Manages the Foundation\'s social media presence and develops content advancing peace-building and community development.',
          'Designs marketing campaigns raising awareness among U.S. and global audiences.',
          'Produces newsletters, digital graphics, and multimedia assets supporting donor engagement.',
        ],
      },
      {
        title: 'Social Media & Brand Officer',
        org: 'Capacity For Youth',
        location: 'Liberia',
        period: '2025 – Present',
        current: true,
        summary: 'Grows the organisation\'s digital brand presence and visual identity across platforms.',
        highlights: [
          'Develops content strategies resonating with Liberian youth and development stakeholders.',
          'Maintains visual brand identity consistency across communications and publications.',
          'Monitors analytics and engagement metrics to guide communication strategy.',
        ],
      },
    ],
  },
  {
    label: 'Education & Academic Roles',
    icon: <BookOpen size={16} />,
    roles: [
      {
        title: 'Classroom Teacher — Mathematics & General Science',
        org: "School of Christ (Russell's Foundation)",
        location: '5th Street Sinkor, Monrovia, Liberia',
        period: '2025/2026 Academic Year',
        current: true,
        summary: 'Teaches Junior High Mathematics and General Science in full alignment with the Liberian national curriculum.',
        highlights: [
          'Develops lesson plans, instructional materials, and assessments promoting critical thinking and scientific curiosity.',
          'Maintains an inclusive, disciplined, and engaging classroom environment.',
        ],
      },
      {
        title: 'Program Officer · Senior Lecturer · Graphic Designer',
        org: 'Kwageh Enterprise School of IT & Printing Press',
        location: 'Gbarnga City, Bong County, Liberia',
        period: 'Previous role',
        summary: 'Served in three simultaneous capacities at a vocational and technical training institution.',
        highlights: [
          'Delivered lectures and practical sessions in Information Technology, Computer Applications, and Printing Press operations.',
          'Developed course curricula, lesson plans, and assessment frameworks aligned with national standards.',
          'Coordinated academic programme delivery, workshops, and community outreach.',
        ],
      },
      {
        title: 'Classroom Teacher',
        org: 'New Born Christian Elementary & Junior High School',
        location: 'Gbarnga City, Bong County, Liberia',
        period: '2024/2025 Academic Year',
        summary: 'Delivered structured lessons across Mathematics, English, Science, and Social Studies.',
        highlights: [
          'Developed weekly lesson plans, instructional materials, and formative assessments for diverse learners.',
          'Mentored and guided students with values-based character development.',
        ],
      },
      {
        title: 'Volunteer Classroom Teacher',
        org: 'St. Matthews Daycare, Elementary & Junior High School',
        location: 'Gbarnga City, Bong County, Liberia',
        period: '2023 – 2025 (two academic years)',
        summary: 'Provided free educational support and direct instruction from daycare through junior high levels.',
        highlights: [
          'Provided additional academic support and tutoring to struggling students, reducing learning gaps.',
        ],
      },
    ],
  },
  {
    label: 'Health Campaigns & Civic Engagement',
    icon: <HandHeart size={16} />,
    roles: [
      {
        title: 'Household Registration & Distribution Point Supervisor',
        org: 'ITNs Campaign — Ministry of Health / Plan International / DEN-L',
        location: 'Suakoko District, Bong County, Liberia',
        period: '2024',
        summary: 'Oversaw field operations and community delivery of insecticide-treated nets for a national malaria prevention initiative.',
        highlights: [
          'Led and supervised field volunteers and community health workers with logistical support.',
          'Ensured rigorous beneficiary verification and maintained detailed inventory control and accountability.',
          'Submitted daily field reports on distribution progress, stock levels, and community feedback.',
        ],
      },
      {
        title: 'Campaign Member — Local Governance Act Awareness',
        org: 'UNDP / Capacity for Youth',
        location: 'Bong County, Liberia',
        period: '2024',
        summary: 'Civic education campaign raising citizen awareness about the Local Governance Act and decentralisation in Liberia.',
        highlights: [
          'Facilitated town hall meetings, community dialogues, and radio discussion programmes.',
          'Promoted meaningful participation of women, youth, and marginalised groups in governance.',
        ],
      },
    ],
  },
];

const EDUCATION = [
  {
    degree: 'BSc in Data Science & Analytics',
    school: 'Liberia Christian College (LCC)',
    location: '5th Street Sinkor, Monrovia, Liberia',
    status: 'Currently Enrolled',
    desc: 'Data analysis, statistical modelling, machine learning, database management, data visualisation, and applied research methods.',
  },
  {
    degree: 'Bachelor of Theology (BTh)',
    school: 'Global Baptist Bible College',
    location: 'Fargo, North Dakota, USA',
    status: 'Currently Enrolled',
    desc: 'Biblical studies, pastoral leadership, Christian ethics, church ministry, and theology.',
  },
  {
    degree: 'High School Diploma / WASSCE Certificate',
    school: 'St. Mark Lutheran High School',
    location: 'Gbarnga City, Bong County, Liberia',
    status: 'Graduated Sept 2024',
    desc: 'West African Senior School Certificate Examination — Mathematics, English, Integrated Science, Social Studies, Technical Drawing.',
  },
];

const CERTIFICATIONS = [
  { provider: 'Young African Leaders Initiative (YALI)', items: 'Social Enterprise · Public-Private Partnerships · Personal Growth · Rights of Women & Girls · Responsible Leadership & Good Governance · Fundraising · Community Organizing · Women in Politics, Peace & Security · Grant Writing', year: '2024–2025' },
  { provider: 'UNDP', items: 'Basic Education and Work Ready Now', year: '2024' },
  { provider: 'Save the Children', items: 'Intro to HR Management in Humanitarian Contexts', year: '2024' },
  { provider: 'Cornerstone OnDemand Foundation', items: 'Humanitarian Basics', year: '2024' },
  { provider: 'Connecting Business Initiative (CBI)', items: 'Private Sector Engagement in Fragile & Conflict-Affected Areas', year: '2024' },
  { provider: 'Monrovia Tech Summit', items: 'AI · Cybersecurity · Coding & Programming · Digital Security', year: '2025' },
  { provider: 'Liberian Digital Innovative Center', items: 'Graphic Design & Web Development', year: '2023–2024' },
  { provider: 'Global Business Experts', items: 'Technical Consultancy', year: '2022' },
  { provider: 'CN-Computer', items: 'Computer Science', year: '2023' },
];

const SKILL_GROUPS = [
  { label: 'Leadership & Programme Management', icon: <Briefcase size={14} />, skills: ['Strategic planning', 'Programme design & oversight', 'Team leadership & mentoring', 'Fundraising & grant writing', 'Monitoring, evaluation & learning', 'Financial management & compliance', 'Stakeholder engagement'] },
  { label: 'ICT & Data', icon: <Cpu size={14} />, skills: ['ICT advisory & digital transformation', 'Web development & information systems', 'Database management', 'Data collection & analysis', 'Digital literacy & cybersecurity training', 'Network & hardware support'] },
  { label: 'Design & Visual Communication', icon: <Palette size={14} />, skills: ['Adobe Photoshop, Illustrator, InDesign', 'Canva (Advanced)', 'Brand identity & corporate design', 'Infographics & data visualisation', 'Publication layout & desktop publishing'] },
  { label: 'Communication & Media', icon: <Megaphone size={14} />, skills: ['Strategic communication planning', 'Press releases & policy briefs', 'Media relations', 'Social media management', 'Public speaking & facilitation', 'Radio programme facilitation'] },
  { label: 'Community Development', icon: <HandHeart size={14} />, skills: ['Grassroots mobilisation', 'Behaviour change communication', 'Needs assessment & mapping', 'Inclusive engagement (women, youth, PWDs)', 'Town hall facilitation', 'Volunteer coordination'] },
  { label: 'Education & Training', icon: <BookOpen size={14} />, skills: ['Curriculum development', 'Classroom instruction', 'Facilitation & adult learning', 'Student assessment & mentoring', 'Workshop design & capacity building'] },
];

const LANGUAGES = [
  { name: 'English', level: 'Professional Working Proficiency' },
  { name: 'Liberian English', level: 'Native / Fluent' },
  { name: 'Kpelleh', level: 'Native Mother Tongue' },
];

const AFFILIATIONS = [
  'Young African Leaders Initiative (YALI) — Full Member, 15+ certifications',
  'iTech Network Africa — Founder & Executive Director',
  'Hope Alive Development Foundation — Executive Director & Co-Founder',
  'Health Tech Liberia — Secretary General & Communication Consultant',
  'B4P CODE FOUND (Ohio, USA) — Active Member',
  'Capacity for Youth (C4Y) — Campaign Member',
  "Children's Reading Competition Program — Member & Technical Consultant",
  'National Youth Rights Association of Liberia — Active Member',
  'United Youth in Action Network — Active Member',
  'Bong County Women & Youth Development Cooperation — Active Member',
  'SUPDA Liberia Institute of Professional Studies — Affiliate Member',
];

const ACHIEVEMENTS = [
  'Founded Hope Alive Development Foundation at seventeen and built it into a credible community-based organisation with active programmes across Bong County.',
  'Secured and managed multiple grants and donor partnerships, building financial sustainability and operational capacity.',
  'Designed high-impact visual communications for Health Tech Liberia, iTech Network Africa, and Kwageh Enterprise School.',
  'Contributed to a structured literacy programme reaching hundreds of school-aged children in Bong County.',
  'Taught and mentored students across multiple schools over three academic years.',
  'Earned 15+ professional certifications from globally recognised institutions including YALI, UNDP, and Save the Children.',
];

const VALUES = ['Integrity', 'Accountability', 'Inclusion', 'Innovation', 'Collaboration', 'Excellence', 'Faith'];

/* ─────────── PAGE ─────────── */

export default function FounderCVPage() {
  return (
    <div className="flex flex-col w-full bg-[#F7FAF7] print:bg-white">

      {/* ═══════ HERO ═══════ */}
      <section className="relative bg-[#060E18] overflow-hidden print:bg-white">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 75% 30%, rgba(60,181,42,0.16) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-10 pb-16 relative z-10">
          {/* Breadcrumb */}
          <motion.div {...fadeUp(0)} className="flex items-center gap-2 text-white/40 text-sm mb-10 print:hidden">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="opacity-40" />
            <Link href="/team/wilmot-kerkulah" className="hover:text-white transition-colors">Wilmot Kerkulah</Link>
            <ChevronRight size={14} className="opacity-40" />
            <span className="text-white/70">Curriculum Vitae</span>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8 md:items-end md:justify-between">
            <div className="flex items-center gap-6">
              <img
                src="/team-wilmot.png"
                alt="Wilmot Kerkulah"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border-2 border-[#3CB52A]/40 shadow-[0_12px_40px_rgba(60,181,42,0.25)]"
              />
              <div>
                <motion.p {...fadeUp(0.05)} className="text-[#3CB52A] text-xs font-bold tracking-[0.25em] uppercase mb-2">Curriculum Vitae</motion.p>
                <motion.h1 {...fadeUp(0.1)} className="text-4xl sm:text-5xl font-black text-white leading-tight">
                  Wilmot <span className="text-[#3CB52A]">Kerkulah</span>
                </motion.h1>
                <motion.p {...fadeUp(0.15)} className="text-white/60 text-sm sm:text-base font-medium mt-2">
                  {TITLES.join(' • ')}
                </motion.p>
              </div>
            </div>

            <motion.div {...fadeUp(0.2)} className="flex flex-wrap gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-[#3CB52A]/25"
              >
                <Printer size={16} /> Print / Save as PDF
              </button>
            </motion.div>
          </div>

          {/* Contact strip */}
          <motion.div {...fadeUp(0.25)} className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-white/50">
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors"><Mail size={14} /> {CONTACT.email}</a>
            <span className="flex items-center gap-1.5"><Phone size={14} /> {CONTACT.phone1} / {CONTACT.phone2}</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} /> {CONTACT.address}</span>
            <span className="flex items-center gap-1.5"><Globe size={14} /> Open to on-site, remote & international roles</span>
          </motion.div>
        </div>
      </section>

      {/* ═══════ BODY ═══════ */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 grid lg:grid-cols-[1fr_340px] gap-10 w-full">

        {/* ── MAIN column ── */}
        <div className="min-w-0 space-y-14">

          {/* Summary */}
          <motion.section {...fadeUp(0)}>
            <h2 className="flex items-center gap-2.5 text-xl font-black text-[#060E18] mb-5">
              <span className="w-9 h-9 rounded-xl bg-[#3CB52A] text-white flex items-center justify-center"><Users size={17} /></span>
              Professional Summary
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 space-y-4">
              {SUMMARY.map((p, i) => (
                <p key={i} className="text-[#374151] text-[15px] leading-relaxed">{p}</p>
              ))}
            </div>
          </motion.section>

          {/* Experience */}
          <section>
            <motion.h2 {...fadeUp(0)} className="flex items-center gap-2.5 text-xl font-black text-[#060E18] mb-6">
              <span className="w-9 h-9 rounded-xl bg-[#3CB52A] text-white flex items-center justify-center"><Briefcase size={17} /></span>
              Professional Experience
            </motion.h2>

            <div className="space-y-10">
              {EXPERIENCE.map((group) => (
                <motion.div key={group.label} {...fadeUp(0.05)}>
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3CB52A] mb-4">
                    {group.icon} {group.label}
                  </h3>
                  <div className="space-y-4 border-l-2 border-[#3CB52A]/20 pl-5 ml-1.5">
                    {group.roles.map((r) => (
                      <div key={`${r.title}-${r.org}`} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <span className="absolute -left-[27px] top-7 w-3 h-3 rounded-full bg-[#3CB52A] border-[3px] border-[#F7FAF7]" />
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                          <h4 className="font-bold text-[#060E18] text-[15px] leading-snug">{r.title}</h4>
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${r.current ? 'bg-[#3CB52A]/10 text-[#2b8a1f]' : 'bg-gray-100 text-gray-500'}`}>
                            {r.period}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#3CB52A] font-semibold">{r.org}</p>
                        <p className="text-[12px] text-gray-400 mb-3">{r.location}</p>
                        <p className="text-[13.5px] text-[#4B5563] leading-relaxed mb-3">{r.summary}</p>
                        <ul className="space-y-1.5">
                          {r.highlights.map((h, j) => (
                            <li key={j} className="flex gap-2 text-[13px] text-[#4B5563] leading-relaxed">
                              <CheckCircle2 size={14} className="text-[#3CB52A] flex-shrink-0 mt-0.5" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Education */}
          <motion.section {...fadeUp(0)}>
            <h2 className="flex items-center gap-2.5 text-xl font-black text-[#060E18] mb-6">
              <span className="w-9 h-9 rounded-xl bg-[#3CB52A] text-white flex items-center justify-center"><GraduationCap size={17} /></span>
              Education
            </h2>
            <div className="grid sm:grid-cols-1 gap-4">
              {EDUCATION.map((e) => (
                <div key={e.degree} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#f0fdf4] border border-[#3CB52A]/20 flex items-center justify-center text-[#3CB52A] flex-shrink-0">
                    <GraduationCap size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-[#060E18] text-[15px]">{e.degree}</h4>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#3CB52A]/10 text-[#2b8a1f]">{e.status}</span>
                    </div>
                    <p className="text-[13px] text-[#3CB52A] font-semibold mt-0.5">{e.school}</p>
                    <p className="text-[12px] text-gray-400">{e.location}</p>
                    <p className="text-[13px] text-[#4B5563] leading-relaxed mt-2">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Certifications */}
          <motion.section {...fadeUp(0)}>
            <h2 className="flex items-center gap-2.5 text-xl font-black text-[#060E18] mb-6">
              <span className="w-9 h-9 rounded-xl bg-[#3CB52A] text-white flex items-center justify-center"><Award size={17} /></span>
              Training & Certifications
              <span className="text-xs font-bold text-[#3CB52A] bg-[#3CB52A]/10 px-2.5 py-1 rounded-full">15+</span>
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {CERTIFICATIONS.map((c) => (
                <div key={c.provider} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-4">
                  <div className="sm:w-56 flex-shrink-0">
                    <p className="font-bold text-[#060E18] text-[13px] leading-snug">{c.provider}</p>
                    <p className="text-[11px] text-gray-400">{c.year}</p>
                  </div>
                  <p className="text-[13px] text-[#4B5563] leading-relaxed">{c.items}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Achievements */}
          <motion.section {...fadeUp(0)}>
            <h2 className="flex items-center gap-2.5 text-xl font-black text-[#060E18] mb-6">
              <span className="w-9 h-9 rounded-xl bg-[#3CB52A] text-white flex items-center justify-center"><Star size={17} /></span>
              Key Achievements
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((a, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#3CB52A]/10 text-[#3CB52A] font-black text-sm flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <p className="text-[13px] text-[#4B5563] leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="space-y-6 lg:sticky lg:top-24 self-start w-full min-w-0">

          {/* Skills */}
          <motion.div {...fadeUp(0.05)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-[#060E18] text-sm uppercase tracking-wider mb-4">Core Competencies</h3>
            <div className="space-y-5">
              {SKILL_GROUPS.map((g) => (
                <div key={g.label}>
                  <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#3CB52A] mb-2">{g.icon} {g.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {g.skills.map((s) => (
                      <span key={s} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F3F7F3] border border-gray-100 text-[#374151]">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div {...fadeUp(0.1)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="flex items-center gap-2 font-black text-[#060E18] text-sm uppercase tracking-wider mb-4"><Languages size={15} className="text-[#3CB52A]" /> Languages</h3>
            <div className="space-y-3">
              {LANGUAGES.map((l) => (
                <div key={l.name}>
                  <p className="text-[13px] font-bold text-[#060E18]">{l.name}</p>
                  <p className="text-[11.5px] text-gray-400">{l.level}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Values */}
          <motion.div {...fadeUp(0.15)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="flex items-center gap-2 font-black text-[#060E18] text-sm uppercase tracking-wider mb-4"><Heart size={15} className="text-[#3CB52A]" /> Core Values</h3>
            <div className="flex flex-wrap gap-1.5">
              {VALUES.map((v) => (
                <span key={v} className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#3CB52A]/10 text-[#2b8a1f]">{v}</span>
              ))}
            </div>
            <p className="text-[12.5px] text-[#4B5563] leading-relaxed mt-4">
              Wilmot's approach is grounded in servant leadership — the belief that effective leaders exist to serve others, with empathy, accountability, and deep responsibility to the communities they serve.
            </p>
          </motion.div>

          {/* Affiliations */}
          <motion.div {...fadeUp(0.2)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="flex items-center gap-2 font-black text-[#060E18] text-sm uppercase tracking-wider mb-4"><Users size={15} className="text-[#3CB52A]" /> Affiliations</h3>
            <ul className="space-y-2.5">
              {AFFILIATIONS.map((a) => (
                <li key={a} className="flex gap-2 text-[12.5px] text-[#4B5563] leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3CB52A] flex-shrink-0 mt-1.5" />
                  {a}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Availability / contact card */}
          <motion.div {...fadeUp(0.25)} className="bg-gradient-to-br from-[#0A1929] to-[#0f2d47] rounded-2xl p-6 text-white print:hidden">
            <h3 className="font-black text-sm uppercase tracking-wider mb-3 text-[#3CB52A]">Get in Touch</h3>
            <p className="text-[13px] text-white/70 leading-relaxed mb-4">
              Available for consulting, programme leadership, speaking engagements, and partnership opportunities — on-site, remote, or international.
            </p>
            <div className="space-y-2 text-[12.5px] text-white/60 mb-5">
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-white transition-colors"><Mail size={13} /> {CONTACT.email}</a>
              <span className="flex items-center gap-2"><Phone size={13} /> {CONTACT.phone1}</span>
              <span className="flex items-center gap-2"><MapPin size={13} /> Monrovia, Liberia</span>
            </div>
            <a
              href={`mailto:${CONTACT.email}?subject=Hello%20Wilmot`}
              className="block w-full text-center bg-[#3CB52A] hover:bg-[#2da822] text-white text-sm font-bold py-3 rounded-xl transition-colors"
            >
              Contact Wilmot
            </a>
          </motion.div>
        </aside>
      </div>

      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-16 w-full print:hidden">
        <Link href="/team/wilmot-kerkulah" className="inline-flex items-center gap-2 text-sm font-semibold text-[#3CB52A] hover:text-[#2da822] transition-colors">
          <ArrowLeft size={16} /> Back to profile
        </Link>
      </div>
    </div>
  );
}

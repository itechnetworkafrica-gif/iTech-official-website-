/**
 * iTech Network Africa — Team Data
 * Single source of truth for all team member profiles.
 * Used by AboutPage (cards) and TeamMemberPage (individual profiles).
 */

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  color: string;
  photo: string | null;
  bio: string;
  longBio: string[];
  quote: string;
  expertise: string[];
  responsibilities: string[];
  location: string;
  joinedYear: string;
  email: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

export const TEAM: TeamMember[] = [
  {
    slug: 'wilmot-kerkulah',
    name: 'Wilmot Kerkulah',
    role: 'Founder & Executive Director',
    department: 'Leadership',
    avatar: 'WK',
    color: '#3CB52A',
    photo: '/team-wilmot.png',
    bio: 'Visionary entrepreneur dedicated to positioning Africa at the forefront of global technological innovation. Founded iTech Network Africa in 2023 with a mission to empower businesses and communities through world-class digital solutions.',
    longBio: [
      'Wilmot Kerkulah is the driving force behind iTech Network Africa — a technology company he founded in Monrovia, Liberia in 2023 with one bold conviction: African enterprises deserve world-class technology.',
      'With a background spanning enterprise software, digital strategy, and business development, Wilmot built iTech from the ground up, personally leading the company\'s first contracts, assembling its founding team, and charting its expansion across West Africa and beyond.',
      'Under his leadership, iTech has grown into a pan-African technology powerhouse, delivering 500+ projects across 10+ countries for clients in finance, government, healthcare, and commerce. His approach blends Silicon Valley-grade execution with a deep understanding of African markets, infrastructure challenges, and cultural nuance.',
      'Wilmot is also a vocal advocate for closing the digital divide — championing free coding bootcamps, women-in-tech initiatives, and SME digital support programmes that ensure technology access is not a privilege but a right.',
    ],
    quote: 'African enterprises deserve world-class technology. My mission is to make that a reality — one solution at a time.',
    expertise: ['Strategic Leadership', 'Business Development', 'Digital Transformation', 'Entrepreneurship', 'IT Consulting', 'Team Building', 'Client Relations', 'West African Markets'],
    responsibilities: [
      'Setting company strategy and long-term vision',
      'Building and managing key enterprise partnerships',
      'Overseeing all major client engagements',
      'Leading business development across new markets',
      'Representing iTech at industry forums and events',
      'Driving the company\'s CSR and digital-inclusion initiatives',
    ],
    location: 'Monrovia, Liberia',
    joinedYear: '2023',
    email: 'itechnetworkafrica@gmail.com',
    socials: {
      linkedin: 'https://linkedin.com/company/itech-network-africa',
      twitter: 'https://x.com/itechnetworkafrica',
      instagram: 'https://instagram.com/itechnetworkafrica',
      facebook: 'https://facebook.com/itechnetworkafrica',
    },
  },

  {
    slug: 'foday-kabah',
    name: 'Foday Kabah',
    role: 'Full Stack Developer',
    department: 'Engineering',
    avatar: 'FK',
    color: '#0A7EBF',
    photo: '/team-foday.jpg',
    bio: 'Builds robust web and mobile applications from front to back, crafting seamless digital experiences that power the company\'s enterprise solutions.',
    longBio: [
      'Foday Kabah is iTech Network Africa\'s lead Full Stack Developer, responsible for designing and building the web and mobile applications that sit at the heart of the company\'s enterprise solutions portfolio.',
      'Foday brings end-to-end technical expertise across the full development stack — from crafting responsive, accessible front-end interfaces to engineering high-performance back-end APIs, databases, and cloud infrastructure. He has a particular strength in translating complex client requirements into clean, maintainable code that scales.',
      'Since joining the founding team, Foday has contributed to dozens of live client projects — including e-commerce platforms, health technology portals, institutional websites, and internal business tools — always prioritising performance, security, and user experience in equal measure.',
      'He is passionate about open-source technology, modern web standards, and mentoring the next generation of African developers.',
    ],
    quote: 'Great software is invisible — it just works. That\'s the standard I hold every line of code to.',
    expertise: ['React & TypeScript', 'Node.js & Express', 'PostgreSQL & MongoDB', 'REST & GraphQL APIs', 'Cloud Deployment', 'Mobile Development', 'UI/UX Implementation', 'DevOps & CI/CD'],
    responsibilities: [
      'Full-cycle development of web and mobile applications',
      'Architecture design for enterprise client solutions',
      'Code review, quality assurance, and technical standards',
      'Database design and performance optimisation',
      'Integration of third-party APIs and services',
      'Mentorship of junior developers on the team',
    ],
    location: 'Monrovia, Liberia',
    joinedYear: '2023',
    email: 'itechnetworkafrica@gmail.com',
    socials: {
      linkedin: 'https://linkedin.com/company/itech-network-africa',
      twitter: 'https://x.com/itechnetworkafrica',
    },
  },

  {
    slug: 'alvina-dahn',
    name: 'Alvina Dahn',
    role: 'Finance Officer',
    department: 'Finance & Operations',
    avatar: 'AD',
    color: '#7C3AED',
    photo: '/team-alvina.png',
    bio: 'Manages financial operations and ensures fiscal discipline across all projects, driving sustainable growth for the company and its clients.',
    longBio: [
      'Alvina Dahn serves as iTech Network Africa\'s Finance Officer, overseeing all aspects of the company\'s financial health — from budgeting and payroll to project costing, client billing, and compliance.',
      'With a meticulous eye for numbers and a strategic mindset, Alvina ensures that every project iTech delivers is financially sound and that the company\'s growth is sustainable and transparent. She works closely with the executive leadership team to set financial targets, monitor performance, and make data-driven investment decisions.',
      'Alvina\'s financial rigour has been instrumental in enabling iTech to scale rapidly while maintaining the fiscal discipline that enterprise clients expect. She manages client invoicing, contract financials, vendor relationships, and ensures all financial reporting meets required standards.',
      'Outside of spreadsheets and balance sheets, Alvina is a champion for financial literacy among young women in Liberia, and volunteers with several community programmes focused on economic empowerment.',
    ],
    quote: 'Sustainable growth starts with financial clarity. Every number tells a story — I make sure it\'s the right one.',
    expertise: ['Financial Management', 'Budgeting & Forecasting', 'Project Costing', 'Client Billing', 'Payroll Administration', 'Financial Reporting', 'Compliance & Auditing', 'Vendor Relations'],
    responsibilities: [
      'Managing all company financial accounts and records',
      'Preparing and monitoring project budgets',
      'Processing client invoices and managing accounts receivable',
      'Payroll processing and staff expense management',
      'Financial reporting and compliance filings',
      'Supporting leadership with financial planning and forecasting',
    ],
    location: 'Monrovia, Liberia',
    joinedYear: '2023',
    email: 'itechnetworkafrica@gmail.com',
    socials: {
      linkedin: 'https://linkedin.com/company/itech-network-africa',
      instagram: 'https://instagram.com/itechnetworkafrica',
    },
  },

  {
    slug: 'james-kerkula',
    name: 'James Kerkula',
    role: 'Operations Associate',
    department: 'Operations',
    avatar: 'JK',
    color: '#E85D04',
    photo: '/team-james.jpg',
    bio: 'Coordinates day-to-day operations and project delivery, ensuring every engagement is executed with precision, speed, and client satisfaction.',
    longBio: [
      'James Kerkula is iTech Network Africa\'s Operations Associate, the engine room of the company\'s day-to-day execution. James ensures that projects move from scoping through delivery with the speed, structure, and quality that clients depend on.',
      'Working at the intersection of client management, internal team coordination, and process optimisation, James keeps every active engagement on track. He manages project timelines, facilitates communication between technical teams and clients, and resolves operational challenges before they become blockers.',
      'James brings a systems-oriented mindset to operations — constantly looking for ways to improve workflows, reduce friction, and raise the bar on delivery quality. His calm, organised approach under pressure has made him an indispensable part of iTech\'s growing team.',
      'He is also a key point of contact for clients during active project phases, building relationships that extend well beyond the initial delivery and contributing directly to the company\'s strong client retention rates.',
    ],
    quote: 'Execution is everything. A great idea only becomes great when it\'s delivered on time, on spec, and on budget.',
    expertise: ['Project Management', 'Client Coordination', 'Process Optimisation', 'Operations Planning', 'Stakeholder Communication', 'Risk Management', 'Team Coordination', 'Delivery Quality Assurance'],
    responsibilities: [
      'Coordinating delivery timelines across all active projects',
      'Serving as primary client liaison during project execution',
      'Managing internal workflow and resource allocation',
      'Identifying and resolving operational bottlenecks',
      'Tracking project milestones and reporting on progress',
      'Supporting proposal preparation and onboarding of new clients',
    ],
    location: 'Monrovia, Liberia',
    joinedYear: '2023',
    email: 'itechnetworkafrica@gmail.com',
    socials: {
      linkedin: 'https://linkedin.com/company/itech-network-africa',
      facebook: 'https://facebook.com/itechnetworkafrica',
    },
  },

  {
    slug: 'dorcas-kollie',
    name: 'Dorcas Kollie',
    role: 'Administrative Officer',
    department: 'Administration',
    avatar: 'DK',
    color: '#0D9488',
    photo: '/team-dorcas.jpg',
    bio: 'Oversees administrative functions and client communications, keeping the team organised and ensuring every client receives outstanding support.',
    longBio: [
      'Dorcas Kollie is the administrative backbone of iTech Network Africa. As Administrative Officer, she keeps the entire organisation running smoothly — managing schedules, coordinating client communications, and ensuring the team has everything it needs to do its best work.',
      'Dorcas is often the first point of contact for new clients, prospects, and partners, and her warm professionalism sets the tone for iTech\'s client relationships. She manages correspondence, meeting logistics, document management, and internal coordination with a level of care and attention to detail that the rest of the team relies on deeply.',
      'Beyond administration, Dorcas plays a key role in maintaining iTech\'s culture — organising team events, tracking HR matters, and ensuring the work environment remains positive, productive, and inclusive.',
      'She is committed to growing her career in technology-adjacent roles and is currently developing expertise in digital project coordination and client success management.',
    ],
    quote: 'The details matter. When the back office runs like clockwork, the whole team can focus on doing exceptional work.',
    expertise: ['Office Administration', 'Client Communications', 'Document Management', 'Scheduling & Coordination', 'HR Support', 'Record Keeping', 'Meeting Facilitation', 'Client Onboarding'],
    responsibilities: [
      'Managing company correspondence and communications',
      'Coordinating internal meetings and external appointments',
      'Maintaining organised records, contracts, and documentation',
      'Supporting client onboarding and account management',
      'Assisting with HR administration and staff welfare',
      'Keeping the office and team operations running efficiently',
    ],
    location: 'Monrovia, Liberia',
    joinedYear: '2023',
    email: 'itechnetworkafrica@gmail.com',
    socials: {
      linkedin: 'https://linkedin.com/company/itech-network-africa',
      instagram: 'https://instagram.com/itechnetworkafrica',
      facebook: 'https://facebook.com/itechnetworkafrica',
    },
  },
];

/** Look up a team member by slug */
export function getMemberBySlug(slug: string): TeamMember | undefined {
  return TEAM.find(m => m.slug === slug);
}

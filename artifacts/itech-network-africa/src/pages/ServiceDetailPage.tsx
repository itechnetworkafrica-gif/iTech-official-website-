import React from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import {
  Monitor, Smartphone, Code, Palette, PenTool, Layers, Cloud,
  Terminal, Database, Zap, Headphones, Shield, Network, Video,
  Globe, Server, Mail, ArrowRight, CheckCircle2, Users, Clock, Award
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: EASE } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

export interface ServiceDetail {
  slug: string;
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  benefits: { icon: React.ReactNode; title: string; desc: string }[];
  process: { step: string; title: string; desc: string }[];
  tags: string[];
}

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    slug: 'web-development',
    icon: <Monitor size={32} />,
    title: 'Web Development',
    tagline: 'High-performance web applications built for scale.',
    description:
      'We craft fast, secure, and scalable web applications using the latest frameworks — React, Next.js, Node.js and more. Every project is engineered with performance, accessibility and long-term maintainability at the forefront.',
    features: [
      'Custom React / Next.js frontend development',
      'Node.js, Django & Laravel backends',
      'RESTful & GraphQL API integration',
      'Progressive Web App (PWA) support',
      'SEO-optimised architecture',
      'Performance monitoring & analytics',
    ],
    benefits: [
      { icon: <Zap size={20} />, title: 'Lightning Fast', desc: 'Sub-second load times with modern bundling and edge caching.' },
      { icon: <Shield size={20} />, title: 'Secure by Design', desc: 'OWASP-compliant code with regular security reviews.' },
      { icon: <Users size={20} />, title: 'User-Centric', desc: 'Intuitive interfaces backed by user research and testing.' },
    ],
    process: [
      { step: '01', title: 'Discovery & Planning', desc: 'We map your requirements, user journeys and technical constraints before writing a single line of code.' },
      { step: '02', title: 'Architecture & Design', desc: 'System architecture, wireframes and interactive prototypes for full stakeholder alignment.' },
      { step: '03', title: 'Agile Development', desc: 'Two-week sprints with continuous delivery, code review and stakeholder demos.' },
      { step: '04', title: 'Launch & Scale', desc: 'CI/CD deployment, load testing and ongoing performance optimisation.' },
    ],
    tags: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
  },
  {
    slug: 'website-design',
    icon: <Palette size={32} />,
    title: 'Website Design',
    tagline: 'Stunning, responsive websites that convert visitors into customers.',
    description:
      'Our designers blend brand strategy with visual craft to produce websites that look exceptional and perform brilliantly. From landing pages to full corporate portals, every pixel is purposeful.',
    features: [
      'Custom UI design with your brand identity',
      'Mobile-first responsive layouts',
      'Interaction design & micro-animations',
      'Figma design system handoff',
      'A/B tested landing pages',
      'Accessibility (WCAG 2.1) compliance',
    ],
    benefits: [
      { icon: <Award size={20} />, title: 'Award-Worthy Aesthetics', desc: 'Design that positions you as a premium brand in your market.' },
      { icon: <Zap size={20} />, title: 'Conversion-Optimised', desc: 'Layouts and CTAs designed to turn visitors into leads.' },
      { icon: <Clock size={20} />, title: 'Fast Turnaround', desc: 'Rapid design sprints with structured feedback loops.' },
    ],
    process: [
      { step: '01', title: 'Brand Audit', desc: 'We analyse your existing brand, competitors and target audience.' },
      { step: '02', title: 'Wireframes', desc: 'Low-fidelity wireframes establish structure and user flow.' },
      { step: '03', title: 'Visual Design', desc: 'High-fidelity Figma mockups with your full brand palette and typography.' },
      { step: '04', title: 'Handoff & Build', desc: 'Pixel-perfect developer handoff with annotated specs and assets.' },
    ],
    tags: ['Figma', 'Tailwind CSS', 'Framer', 'Brand Identity', 'UX Research'],
  },
  {
    slug: 'mobile-app-development',
    icon: <Smartphone size={32} />,
    title: 'Mobile App Development',
    tagline: 'Native and cross-platform apps that users love.',
    description:
      'From MVP to enterprise-grade applications, we build iOS and Android apps that combine beautiful design with rock-solid engineering. React Native and Flutter give you one codebase, two platforms, zero compromise.',
    features: [
      'React Native & Flutter cross-platform development',
      'Native iOS (Swift) & Android (Kotlin) development',
      'Offline-first architecture',
      'Push notifications & real-time updates',
      'App Store & Play Store submission support',
      'Mobile analytics integration',
    ],
    benefits: [
      { icon: <Zap size={20} />, title: 'Native Performance', desc: '60fps animations and sub-100ms interactions on both platforms.' },
      { icon: <Shield size={20} />, title: 'Secure Data', desc: 'End-to-end encryption and biometric authentication built in.' },
      { icon: <Clock size={20} />, title: 'Faster to Market', desc: 'Shared codebase cuts development time by up to 40%.' },
    ],
    process: [
      { step: '01', title: 'Requirements & Prototyping', desc: 'Clickable prototypes validate UX before full development begins.' },
      { step: '02', title: 'Architecture Setup', desc: 'State management, navigation, API layer and CI/CD pipeline configured.' },
      { step: '03', title: 'Iterative Development', desc: 'Feature-by-feature delivery with weekly TestFlight / Play Store builds.' },
      { step: '04', title: 'Store Launch', desc: 'App Store and Play Store listing optimisation and submission.' },
    ],
    tags: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase', 'Expo'],
  },
  {
    slug: 'software-development',
    icon: <Code size={32} />,
    title: 'Software Development',
    tagline: 'Bespoke enterprise software tailored to your exact business logic.',
    description:
      'Off-the-shelf software rarely fits perfectly. We build custom ERP, CRM, and business management platforms engineered around your workflows, data model and integration requirements.',
    features: [
      'Custom ERP & CRM platforms',
      'Business process automation software',
      'Legacy system modernisation',
      'Third-party API & system integrations',
      'Multi-tenant SaaS architecture',
      'Role-based access control (RBAC)',
    ],
    benefits: [
      { icon: <Users size={20} />, title: 'Fits Your Workflow', desc: 'Software designed around your team, not the other way around.' },
      { icon: <Zap size={20} />, title: 'Automation Gains', desc: 'Eliminate manual processes and reduce operational overhead.' },
      { icon: <Shield size={20} />, title: 'Enterprise Security', desc: 'Audit trails, data encryption and compliance baked in.' },
    ],
    process: [
      { step: '01', title: 'Business Analysis', desc: 'Deep-dive workshops to model your business processes and data flows.' },
      { step: '02', title: 'Solution Architecture', desc: 'Technical blueprint covering databases, APIs, integrations and infrastructure.' },
      { step: '03', title: 'Agile Build', desc: 'Modular development with regular UAT sessions and stakeholder sign-off.' },
      { step: '04', title: 'Training & Handover', desc: 'User training, documentation and transition to managed support.' },
    ],
    tags: ['Python', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Microservices'],
  },
  {
    slug: 'ui-ux-design',
    icon: <Layers size={32} />,
    title: 'UI/UX Design',
    tagline: 'User-centric interfaces that drive engagement and conversion.',
    description:
      'Great products start with great design. Our UX process combines research, rapid prototyping and data-driven iteration to create interfaces that users find intuitive, engaging and trustworthy.',
    features: [
      'User research & persona development',
      'Information architecture & user journey mapping',
      'Wireframing & interactive prototyping',
      'Design system creation',
      'Usability testing & iteration',
      'Accessibility audits (WCAG 2.1)',
    ],
    benefits: [
      { icon: <Users size={20} />, title: 'Higher Retention', desc: 'Intuitive UX reduces churn and keeps users coming back.' },
      { icon: <Zap size={20} />, title: 'Faster Decisions', desc: 'Clear information hierarchy accelerates user task completion.' },
      { icon: <Award size={20} />, title: 'Brand Trust', desc: 'Polished UI signals professionalism and builds customer confidence.' },
    ],
    process: [
      { step: '01', title: 'Research & Discovery', desc: 'User interviews, competitive benchmarking and analytics review.' },
      { step: '02', title: 'IA & Wireframes', desc: 'Site maps, user flows and low-fidelity wireframes for structural alignment.' },
      { step: '03', title: 'High-Fidelity Design', desc: 'Pixel-perfect designs in Figma with a component-based design system.' },
      { step: '04', title: 'Test & Iterate', desc: 'Moderated usability tests and quantitative A/B experiments.' },
    ],
    tags: ['Figma', 'UX Research', 'Prototyping', 'Design Systems', 'A/B Testing'],
  },
  {
    slug: 'graphic-design',
    icon: <PenTool size={32} />,
    title: 'Graphic Design',
    tagline: 'Professional visual assets that make your brand unforgettable.',
    description:
      'From marketing collateral to social media campaigns, our graphic designers produce visuals that stop the scroll and communicate your brand\'s story with clarity and style.',
    features: [
      'Marketing materials (brochures, flyers, posters)',
      'Social media graphics & campaign assets',
      'Infographics & data visualisations',
      'Pitch decks & investor presentations',
      'Print-ready files & brand templates',
      'Motion graphics & animated assets',
    ],
    benefits: [
      { icon: <Award size={20} />, title: 'Brand Consistency', desc: 'Every asset adheres to your brand guidelines for cohesive identity.' },
      { icon: <Clock size={20} />, title: 'Fast Delivery', desc: 'Rapid turnaround on marketing assets without compromising quality.' },
      { icon: <Zap size={20} />, title: 'Engagement Boost', desc: 'Professionally designed visuals outperform DIY assets on every metric.' },
    ],
    process: [
      { step: '01', title: 'Brief & Moodboard', desc: 'We capture your vision through a detailed creative brief and visual references.' },
      { step: '02', title: 'Concept Development', desc: 'Two to three design concepts for your review and feedback.' },
      { step: '03', title: 'Refinement', desc: 'Iterative revisions until the design is exactly right.' },
      { step: '04', title: 'Final Delivery', desc: 'All formats delivered — print-ready PDFs, web-optimised PNGs, editable source files.' },
    ],
    tags: ['Adobe Illustrator', 'Photoshop', 'After Effects', 'Figma', 'Print Design'],
  },
  {
    slug: 'branding',
    icon: <Globe size={32} />,
    title: 'Branding',
    tagline: 'Complete brand identities that command attention and build trust.',
    description:
      'A powerful brand is more than a logo. We develop comprehensive identity systems — from visual mark to brand voice — that position your organisation as the definitive leader in your space.',
    features: [
      'Logo design & brand mark creation',
      'Brand strategy & positioning',
      'Colour palette, typography & iconography',
      'Brand guidelines document',
      'Corporate stationery suite',
      'Brand voice & messaging framework',
    ],
    benefits: [
      { icon: <Award size={20} />, title: 'Market Differentiation', desc: 'Stand out in a crowded marketplace with a distinctive identity.' },
      { icon: <Users size={20} />, title: 'Audience Connection', desc: 'Brand strategy rooted in your audience\'s values and aspirations.' },
      { icon: <Zap size={20} />, title: 'Consistent Experience', desc: 'Every touchpoint reflects the same brand promise.' },
    ],
    process: [
      { step: '01', title: 'Brand Discovery', desc: 'Workshops to define your mission, vision, values and competitive positioning.' },
      { step: '02', title: 'Identity Design', desc: 'Logo concepts, colour exploration and typography selection.' },
      { step: '03', title: 'System Development', desc: 'Full brand system — guidelines, templates and asset library.' },
      { step: '04', title: 'Launch Support', desc: 'Brand rollout across all platforms and marketing channels.' },
    ],
    tags: ['Brand Strategy', 'Logo Design', 'Identity Systems', 'Messaging', 'Guidelines'],
  },
  {
    slug: 'cloud-services',
    icon: <Cloud size={32} />,
    title: 'Cloud Services',
    tagline: 'Secure, scalable cloud infrastructure on AWS, Azure and Google Cloud.',
    description:
      'We architect, migrate and manage cloud environments that are resilient, cost-optimised and compliant. Whether you\'re moving from on-premise or scaling an existing cloud workload, we ensure zero-downtime transitions.',
    features: [
      'Cloud architecture design & consulting',
      'AWS, Azure & Google Cloud migrations',
      'Infrastructure as Code (Terraform, Pulumi)',
      'Kubernetes & container orchestration',
      'Cost optimisation & FinOps',
      '24/7 cloud monitoring & alerting',
    ],
    benefits: [
      { icon: <Zap size={20} />, title: '99.99% Uptime', desc: 'Multi-region redundancy and auto-scaling keep you always on.' },
      { icon: <Shield size={20} />, title: 'Compliance-Ready', desc: 'SOC 2, ISO 27001-aligned environments for regulated industries.' },
      { icon: <Clock size={20} />, title: 'Cost Efficiency', desc: 'Right-sizing and reserved capacity typically cuts cloud bills by 30–40%.' },
    ],
    process: [
      { step: '01', title: 'Assessment', desc: 'Audit of current infrastructure, dependencies and migration readiness.' },
      { step: '02', title: 'Architecture Design', desc: 'Target-state cloud architecture with disaster recovery and security layers.' },
      { step: '03', title: 'Migration & Cutover', desc: 'Phased migration with parallel running and zero-downtime cutover.' },
      { step: '04', title: 'Managed Operations', desc: 'Ongoing monitoring, patching, cost reviews and capacity planning.' },
    ],
    tags: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Docker'],
  },
  {
    slug: 'api-development',
    icon: <Terminal size={32} />,
    title: 'API Development',
    tagline: 'Secure, scalable APIs that power your digital ecosystem.',
    description:
      'We design and build REST and GraphQL APIs that are fast, well-documented and built to last. Our API-first approach ensures your services can integrate with any third-party platform today or in the future.',
    features: [
      'RESTful & GraphQL API design',
      'OpenAPI / Swagger documentation',
      'OAuth 2.0 & JWT authentication',
      'Rate limiting & throttling',
      'Webhook infrastructure',
      'SDK development for third-party consumers',
    ],
    benefits: [
      { icon: <Zap size={20} />, title: 'Integration-Ready', desc: 'Standard-compliant APIs that plug into any ecosystem instantly.' },
      { icon: <Shield size={20} />, title: 'Enterprise Security', desc: 'Every endpoint protected with auth, validation and rate limiting.' },
      { icon: <Clock size={20} />, title: 'Developer Experience', desc: 'Comprehensive docs and SDKs reduce third-party integration time to days.' },
    ],
    process: [
      { step: '01', title: 'API Design', desc: 'Contract-first design with OpenAPI spec reviewed by all stakeholders.' },
      { step: '02', title: 'Security Architecture', desc: 'Auth flows, permission models and secrets management defined upfront.' },
      { step: '03', title: 'Development & Testing', desc: 'TDD approach with unit, integration and contract tests.' },
      { step: '04', title: 'Documentation & Launch', desc: 'Interactive docs, versioning strategy and developer portal.' },
    ],
    tags: ['REST', 'GraphQL', 'OpenAPI', 'Node.js', 'OAuth 2.0', 'Postman'],
  },
  {
    slug: 'database-development',
    icon: <Database size={32} />,
    title: 'Database Development',
    tagline: 'Optimised database architecture that scales with your business.',
    description:
      'From schema design to query optimisation, we build and tune database systems that handle millions of records with sub-millisecond response times. We work with relational and NoSQL databases across all major platforms.',
    features: [
      'Schema design & data modelling',
      'Query optimisation & indexing strategies',
      'Database migration & version management',
      'Replication & high availability setup',
      'Backup, recovery & disaster planning',
      'Data warehousing & analytics pipelines',
    ],
    benefits: [
      { icon: <Zap size={20} />, title: '10× Query Performance', desc: 'Proper indexing and query planning dramatically cut response times.' },
      { icon: <Shield size={20} />, title: 'Data Integrity', desc: 'ACID compliance, constraints and audit trails protect your data.' },
      { icon: <Clock size={20} />, title: 'Zero-Downtime Migrations', desc: 'Blue-green migration strategies eliminate maintenance windows.' },
    ],
    process: [
      { step: '01', title: 'Data Audit', desc: 'Review of existing schema, volumes, access patterns and pain points.' },
      { step: '02', title: 'Optimised Design', desc: 'Normalised data model with indexing and partitioning strategy.' },
      { step: '03', title: 'Implementation', desc: 'Migration scripts, seed data and integration with application layer.' },
      { step: '04', title: 'Performance Tuning', desc: 'Load testing, query profiling and continuous monitoring setup.' },
    ],
    tags: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'BigQuery'],
  },
  {
    slug: 'business-automation',
    icon: <Zap size={32} />,
    title: 'Business Automation',
    tagline: 'Eliminate manual work and unlock your team\'s full potential.',
    description:
      'We map your repetitive workflows and automate them end-to-end — from data entry and approvals to reporting and customer communications. The result: lower costs, fewer errors and faster cycle times.',
    features: [
      'Workflow automation with Zapier, n8n & custom pipelines',
      'RPA (Robotic Process Automation)',
      'Document processing & OCR automation',
      'Automated reporting & dashboards',
      'Email & notification automation',
      'ERP / CRM workflow integration',
    ],
    benefits: [
      { icon: <Clock size={20} />, title: 'Hours Saved Daily', desc: 'Automate hours of manual work per employee, per day.' },
      { icon: <Shield size={20} />, title: 'Zero Human Error', desc: 'Rules-based automation eliminates data entry mistakes.' },
      { icon: <Zap size={20} />, title: 'Faster Processes', desc: 'Workflows that took days completed in minutes.' },
    ],
    process: [
      { step: '01', title: 'Process Mapping', desc: 'Document every step, decision point and handoff in your current workflows.' },
      { step: '02', title: 'Automation Design', desc: 'Identify automation candidates and design the target-state workflow.' },
      { step: '03', title: 'Build & Test', desc: 'Automation implemented and stress-tested with real data scenarios.' },
      { step: '04', title: 'Rollout & Training', desc: 'Phased rollout with staff training and exception-handling playbooks.' },
    ],
    tags: ['n8n', 'Zapier', 'Python', 'RPA', 'Power Automate', 'Make.com'],
  },
  {
    slug: 'it-support',
    icon: <Headphones size={32} />,
    title: 'IT Support',
    tagline: '24/7 technical support that keeps your business running.',
    description:
      'Our managed IT support service acts as your extended IT department — proactively monitoring your systems, resolving issues before they impact users and keeping your infrastructure secure and up to date.',
    features: [
      '24/7 helpdesk (phone, email & chat)',
      'Remote & on-site technical support',
      'Proactive system monitoring & alerting',
      'Patch management & software updates',
      'IT asset management',
      'Vendor & licence management',
    ],
    benefits: [
      { icon: <Clock size={20} />, title: 'Rapid Response', desc: 'Critical issues resolved within 1 hour, SLA-guaranteed.' },
      { icon: <Shield size={20} />, title: 'Proactive Prevention', desc: 'Most issues caught and resolved before users are affected.' },
      { icon: <Zap size={20} />, title: 'Predictable Costs', desc: 'Fixed monthly fee replaces unpredictable break-fix expenses.' },
    ],
    process: [
      { step: '01', title: 'IT Audit', desc: 'Full inventory of your hardware, software, network and security posture.' },
      { step: '02', title: 'Monitoring Setup', desc: 'Agents deployed for real-time visibility into every system.' },
      { step: '03', title: 'SLA Agreement', desc: 'Response times, escalation paths and reporting cadences agreed.' },
      { step: '04', title: 'Ongoing Management', desc: 'Monthly reviews, capacity planning and strategic IT roadmap advisory.' },
    ],
    tags: ['Helpdesk', 'ITSM', 'Remote Monitoring', 'SLA', 'Asset Management'],
  },
  {
    slug: 'cybersecurity',
    icon: <Shield size={32} />,
    title: 'Cybersecurity',
    tagline: 'Enterprise-grade security that protects your data and reputation.',
    description:
      'Cyber threats are evolving daily. Our security practice combines offensive testing with defensive architecture to identify vulnerabilities, harden your systems and maintain compliance with international frameworks.',
    features: [
      'Penetration testing (network, web app, mobile)',
      'Vulnerability assessment & management',
      'Security architecture design',
      'ISO 27001 & GDPR compliance consulting',
      'Incident response & forensics',
      'Security awareness training',
    ],
    benefits: [
      { icon: <Shield size={20} />, title: 'Risk Reduction', desc: 'Identify and remediate vulnerabilities before attackers find them.' },
      { icon: <Award size={20} />, title: 'Compliance Confidence', desc: 'Meet regulatory requirements with documented security controls.' },
      { icon: <Users size={20} />, title: 'Staff Resilience', desc: 'Phishing simulations and training cut social-engineering risk by 70%.' },
    ],
    process: [
      { step: '01', title: 'Risk Assessment', desc: 'Threat modelling and asset classification to prioritise your security investment.' },
      { step: '02', title: 'Penetration Testing', desc: 'Ethical hacking across network, application and social engineering vectors.' },
      { step: '03', title: 'Remediation Planning', desc: 'Prioritised remediation roadmap with clear ownership and timelines.' },
      { step: '04', title: 'Continuous Monitoring', desc: 'SIEM deployment, alerting and regular re-testing to maintain posture.' },
    ],
    tags: ['Pen Testing', 'SIEM', 'ISO 27001', 'GDPR', 'Zero Trust', 'SOC'],
  },
  {
    slug: 'networking',
    icon: <Network size={32} />,
    title: 'Networking',
    tagline: 'Enterprise networking infrastructure designed for speed and reliability.',
    description:
      'From LAN/WAN design to SD-WAN and wireless deployments, we build network infrastructure that delivers consistent performance, centralised visibility and the security controls modern enterprises demand.',
    features: [
      'LAN, WAN & SD-WAN design and deployment',
      'Enterprise Wi-Fi (Cisco, Aruba, Ubiquiti)',
      'Network security (firewall, IDS/IPS, VPN)',
      'Network performance monitoring',
      'VLAN segmentation & QoS configuration',
      'ISP & connectivity procurement',
    ],
    benefits: [
      { icon: <Zap size={20} />, title: 'Low Latency', desc: 'Optimised routing and QoS prioritise business-critical traffic.' },
      { icon: <Shield size={20} />, title: 'Secure Perimeter', desc: 'Next-gen firewalls and zero-trust segmentation protect your network.' },
      { icon: <Clock size={20} />, title: 'High Availability', desc: 'Redundant links and automatic failover minimise downtime.' },
    ],
    process: [
      { step: '01', title: 'Site Survey', desc: 'Physical and logical assessment of existing network and requirements.' },
      { step: '02', title: 'Network Design', desc: 'Logical topology, addressing scheme, security zones and hardware BOM.' },
      { step: '03', title: 'Deployment', desc: 'Structured cabling, hardware installation and configuration.' },
      { step: '04', title: 'Monitoring & Support', desc: 'NOC monitoring, firmware management and on-call network support.' },
    ],
    tags: ['Cisco', 'Fortinet', 'SD-WAN', 'Wi-Fi 6', 'VPN', 'Structured Cabling'],
  },
  {
    slug: 'cctv-installation',
    icon: <Video size={32} />,
    title: 'CCTV Installation',
    tagline: 'HD surveillance systems that protect your assets around the clock.',
    description:
      'We design and install professional CCTV and access control systems for offices, warehouses, retail spaces and campuses. Remote monitoring, smart alerts and cloud storage keep you in control at all times.',
    features: [
      'HD & 4K IP camera installation',
      'NVR / DVR system setup',
      'Remote viewing via mobile app',
      'Motion-triggered smart alerts',
      'Cloud & on-premise recording',
      'Access control & intercom integration',
    ],
    benefits: [
      { icon: <Shield size={20} />, title: 'Deterrence & Evidence', desc: 'Visible cameras deter incidents and HD footage provides clear evidence.' },
      { icon: <Clock size={20} />, title: '24/7 Coverage', desc: 'Night-vision and wide-angle cameras ensure round-the-clock visibility.' },
      { icon: <Zap size={20} />, title: 'Remote Access', desc: 'Monitor your premises from anywhere via smartphone.' },
    ],
    process: [
      { step: '01', title: 'Site Assessment', desc: 'Walk-through to identify blind spots, entry points and camera placement.' },
      { step: '02', title: 'System Design', desc: 'Camera specification, cable routing plan and recording capacity sizing.' },
      { step: '03', title: 'Professional Installation', desc: 'Certified technicians install and configure the complete system.' },
      { step: '04', title: 'Training & Handover', desc: 'Staff training on playback, alerts and remote access.' },
    ],
    tags: ['Hikvision', 'Dahua', 'IP Cameras', 'NVR', 'Access Control', '4K'],
  },
  {
    slug: 'domain-registration',
    icon: <Globe size={32} />,
    title: 'Domain Registration',
    tagline: 'Secure your digital identity with the right domain name.',
    description:
      'We help businesses find, register and manage domain names across all major extensions — .com, .org, .africa, .lr and hundreds more. Bundle with hosting for a seamless all-in-one digital presence.',
    features: [
      'Global & regional TLD registration',
      'Domain transfer & migration',
      'WHOIS privacy protection',
      'Auto-renewal management',
      'DNS management & configuration',
      'Domain portfolio management',
    ],
    benefits: [
      { icon: <Shield size={20} />, title: 'Brand Protection', desc: 'Register key variations to prevent competitor and squatter registrations.' },
      { icon: <Clock size={20} />, title: 'Hassle-Free Management', desc: 'We handle renewals, DNS and transfers so you never lose your domain.' },
      { icon: <Zap size={20} />, title: 'Instant Setup', desc: 'Domain live and DNS propagated within hours of registration.' },
    ],
    process: [
      { step: '01', title: 'Availability Check', desc: 'Search across hundreds of TLDs for your ideal domain name.' },
      { step: '02', title: 'Registration', desc: 'Secure registration with WHOIS privacy and auto-renewal enabled.' },
      { step: '03', title: 'DNS Setup', desc: 'Configure DNS records to point to your hosting, email and services.' },
      { step: '04', title: 'Ongoing Management', desc: 'Renewal reminders, DNS updates and transfer support as needed.' },
    ],
    tags: ['.com', '.org', '.africa', '.lr', 'DNS', 'WHOIS Privacy'],
  },
  {
    slug: 'web-hosting',
    icon: <Server size={32} />,
    title: 'Web Hosting',
    tagline: 'Fast, reliable hosting with 99.9% uptime guaranteed.',
    description:
      'Our hosting infrastructure is built on enterprise-grade servers with SSD storage, global CDN and automatic daily backups. From shared hosting to dedicated servers, we have a plan that fits your traffic and budget.',
    features: [
      'SSD-powered shared & VPS hosting',
      'Dedicated server options',
      'Free SSL certificates (Let\'s Encrypt)',
      'Global CDN with edge caching',
      'Daily automated backups',
      'One-click WordPress & CMS installs',
    ],
    benefits: [
      { icon: <Zap size={20} />, title: 'Blazing Fast', desc: 'NVMe SSD storage and CDN deliver sub-200ms page loads globally.' },
      { icon: <Shield size={20} />, title: 'Secure & Backed Up', desc: 'Daily backups, malware scanning and free SSL on every plan.' },
      { icon: <Clock size={20} />, title: '99.9% Uptime SLA', desc: 'Redundant infrastructure ensures your site is always online.' },
    ],
    process: [
      { step: '01', title: 'Requirements Review', desc: 'Assess traffic, storage and technology stack to recommend the right plan.' },
      { step: '02', title: 'Server Provisioning', desc: 'Environment set up with your stack, SSL and security hardening.' },
      { step: '03', title: 'Migration', desc: 'Zero-downtime migration from your existing host.' },
      { step: '04', title: 'Ongoing Management', desc: 'Uptime monitoring, updates and scalability as your traffic grows.' },
    ],
    tags: ['cPanel', 'Nginx', 'Apache', 'SSL', 'CDN', 'WordPress'],
  },
  {
    slug: 'digital-marketing',
    icon: <Terminal size={32} />,
    title: 'Digital Marketing',
    tagline: 'Grow your audience, generate leads, and dominate your market online.',
    description:
      'From paid social campaigns to organic SEO, our digital marketing team builds data-driven strategies that put your brand in front of the right audience at the right time — across every channel that matters.',
    features: [
      'Social Media Management (Facebook, Instagram, LinkedIn, TikTok)',
      'Social Media Advertising (paid campaigns)',
      'Google Ads & Pay-Per-Click (PPC)',
      'Facebook & Instagram Ads',
      'Search Engine Optimisation (SEO)',
      'Email Marketing campaigns',
      'SMS Marketing & bulk messaging',
      'Content Marketing & copywriting',
      'Online Reputation Management',
    ],
    benefits: [
      { icon: <Zap size={20} />, title: 'More Qualified Leads', desc: 'Targeted campaigns reach buyers who are already looking for your services.' },
      { icon: <Award size={20} />, title: 'Measurable ROI', desc: 'Every campaign tracked with clear KPIs — clicks, leads, conversions, revenue.' },
      { icon: <Users size={20} />, title: 'Brand Authority', desc: 'Consistent content builds credibility and keeps your brand top of mind.' },
    ],
    process: [
      { step: '01', title: 'Audit & Strategy', desc: 'Review your current digital presence, competitors, and audience to define the optimal strategy.' },
      { step: '02', title: 'Content & Creative', desc: 'Design ad creatives, write copy, and build content calendars aligned to your brand voice.' },
      { step: '03', title: 'Launch & Manage', desc: 'Campaigns launched and actively managed with daily optimisation for best performance.' },
      { step: '04', title: 'Report & Scale', desc: 'Weekly reports with actionable insights; winning campaigns scaled for maximum impact.' },
    ],
    tags: ['Google Ads', 'Meta Ads', 'SEO', 'Content Strategy', 'Email Marketing', 'Analytics'],
  },
  {
    slug: 'it-consulting',
    icon: <Terminal size={32} />,
    title: 'IT Consulting',
    tagline: 'Strategic technology guidance to accelerate your digital transformation.',
    description:
      'Our senior consultants partner with your leadership team to define technology strategy, modernise operations, and build the digital capabilities that drive sustainable growth across the African market.',
    features: [
      'Digital transformation roadmaps',
      'IT strategy & planning',
      'Technology audits & assessments',
      'Business process automation consulting',
      'ICT policy development',
      'Project & programme management',
      'Change management & adoption',
      'Vendor selection & procurement advisory',
    ],
    benefits: [
      { icon: <Award size={20} />, title: 'Objective Expertise', desc: 'Independent advice free of vendor bias — your goals, not ours, drive the recommendations.' },
      { icon: <Zap size={20} />, title: 'Faster Transformation', desc: 'Proven frameworks cut digital transformation timelines by up to 40%.' },
      { icon: <Users size={20} />, title: 'Reduced Risk', desc: 'Expert guidance prevents costly technology mistakes before they happen.' },
    ],
    process: [
      { step: '01', title: 'Discovery', desc: 'Structured interviews and workshops to understand your current state, goals, and constraints.' },
      { step: '02', title: 'Assessment', desc: 'Technology audit covering systems, processes, people, and data to identify gaps and opportunities.' },
      { step: '03', title: 'Roadmap', desc: 'Prioritised, costed transformation roadmap with quick wins and strategic long-term initiatives.' },
      { step: '04', title: 'Advisory & Execution', desc: 'Ongoing advisory support through execution, ensuring strategy translates to outcomes.' },
    ],
    tags: ['Digital Strategy', 'IT Governance', 'Change Management', 'Process Improvement', 'ICT Policy'],
  },
  {
    slug: 'creative-media',
    icon: <Terminal size={32} />,
    title: 'Creative Media',
    tagline: 'Professional photography, video, and multimedia that tells your brand story.',
    description:
      'Our creative team produces compelling visual content — from corporate photography and brand videos to motion graphics, animation, and live streaming. Every production is crafted to engage your audience and elevate your brand.',
    features: [
      'Corporate & commercial photography',
      'Brand & product videography',
      'Motion graphics & animated explainers',
      'Video editing & post-production',
      '2D & 3D animation',
      'Live event streaming',
      'Podcast production & audio engineering',
      'Social media content packages',
    ],
    benefits: [
      { icon: <Award size={20} />, title: 'Premium Production', desc: 'Agency-quality output that positions your brand as a market leader.' },
      { icon: <Zap size={20} />, title: 'Higher Engagement', desc: 'Video content generates 10× more engagement than static images on every platform.' },
      { icon: <Clock size={20} />, title: 'Fast Turnaround', desc: 'Efficient production workflows deliver polished content on tight deadlines.' },
    ],
    process: [
      { step: '01', title: 'Creative Brief', desc: 'Define the story, audience, tone, and deliverables before production begins.' },
      { step: '02', title: 'Pre-Production', desc: 'Shot lists, storyboards, location scouting, and talent coordination.' },
      { step: '03', title: 'Production', desc: 'On-site shoot or studio production with professional equipment and crew.' },
      { step: '04', title: 'Post-Production', desc: 'Editing, colour grading, sound design, motion graphics, and final delivery.' },
    ],
    tags: ['Photography', 'Videography', 'After Effects', 'Premiere Pro', 'Animation', 'Live Streaming'],
  },
  {
    slug: 'printing-promotional',
    icon: <Terminal size={32} />,
    title: 'Printing & Promotional',
    tagline: 'High-quality printing and branded merchandise that makes a lasting impression.',
    description:
      'From large-format banners and signage to T-shirt printing, ID cards, and branded merchandise, we produce promotional materials that reinforce your brand at every touchpoint.',
    features: [
      'Large format printing (banners, roll-ups, billboards)',
      'T-shirt & apparel printing (screen print, DTG)',
      'ID card & badge printing',
      'Stickers, labels, and decals',
      'Branded merchandise & corporate gifts',
      'Indoor & outdoor signage',
      'Event printing packages',
      'Same-day & rush printing available',
    ],
    benefits: [
      { icon: <Award size={20} />, title: 'Premium Quality', desc: 'Vibrant, durable prints that represent your brand at its best.' },
      { icon: <Clock size={20} />, title: 'Fast Delivery', desc: 'Tight deadlines met with our streamlined production process.' },
      { icon: <Users size={20} />, title: 'One-Stop Shop', desc: 'Design, print, and delivery in one place — no multiple vendors to manage.' },
    ],
    process: [
      { step: '01', title: 'Order & Artwork', desc: 'Confirm specifications and submit or request artwork design from our team.' },
      { step: '02', title: 'Proof Approval', desc: 'Digital proof sent for review and sign-off before printing begins.' },
      { step: '03', title: 'Production', desc: 'Professional printing on premium materials using state-of-the-art equipment.' },
      { step: '04', title: 'Delivery', desc: 'Quality-checked items delivered to your location on schedule.' },
    ],
    tags: ['Large Format', 'T-Shirt Printing', 'ID Cards', 'Signage', 'Branded Merchandise'],
  },
  {
    slug: 'business-solutions',
    icon: <Terminal size={32} />,
    title: 'Business Solutions',
    tagline: 'Digital tools and platforms that streamline your operations and delight your customers.',
    description:
      'We build and deploy integrated business platforms — from digital document management and e-signature workflows to online payment gateways, booking systems, and custom portals that centralise your operations.',
    features: [
      'Business email solutions (Microsoft 365, Google Workspace)',
      'Digital document management systems (DMS)',
      'E-signature solutions (DocuSign integration, custom)',
      'Online payment gateway integration (Stripe, PayPal, local)',
      'Appointment & booking systems',
      'Customer portal development',
      'Client & vendor portal development',
      'Digital workflow automation',
    ],
    benefits: [
      { icon: <Zap size={20} />, title: 'Operational Efficiency', desc: 'Digital workflows cut paper-based processes and reduce administrative overhead.' },
      { icon: <Users size={20} />, title: 'Better Customer Experience', desc: 'Self-service portals and digital tools give customers 24/7 access to your services.' },
      { icon: <Shield size={20} />, title: 'Compliance & Security', desc: 'Auditable digital trails and encrypted document storage meet regulatory requirements.' },
    ],
    process: [
      { step: '01', title: 'Needs Assessment', desc: 'Map your current business processes to identify digitalisation opportunities.' },
      { step: '02', title: 'Solution Design', desc: 'Recommend and configure the right platform mix for your requirements and budget.' },
      { step: '03', title: 'Implementation', desc: 'Deploy, integrate, and customise solutions with minimal disruption to daily operations.' },
      { step: '04', title: 'Training & Support', desc: 'Staff training, documentation, and ongoing support to ensure successful adoption.' },
    ],
    tags: ['Microsoft 365', 'DocuSign', 'Stripe', 'Booking Systems', 'Portal Development', 'DMS'],
  },
  {
    slug: 'ict-training',
    icon: <Terminal size={32} />,
    title: 'ICT Training',
    tagline: 'Practical technology training that empowers your team to work smarter.',
    description:
      'Our hands-on training programmes build real-world digital skills — from Microsoft Office fundamentals to advanced AI tools, cybersecurity awareness, and enterprise software user training. Delivered on-site or remotely.',
    features: [
      'Microsoft Office (Word, Excel, PowerPoint, Outlook)',
      'AI tools training (ChatGPT, Copilot, productivity AI)',
      'Cybersecurity awareness & best practices',
      'Digital skills foundation programmes',
      'Enterprise software user training',
      'Google Workspace training',
      'Custom curriculum development',
      'Group & one-on-one sessions',
    ],
    benefits: [
      { icon: <Users size={20} />, title: 'Upskilled Workforce', desc: 'Staff who use technology confidently and correctly from day one.' },
      { icon: <Zap size={20} />, title: 'Higher Productivity', desc: 'Proper tool usage cuts task completion time and reduces costly mistakes.' },
      { icon: <Shield size={20} />, title: 'Reduced Security Risk', desc: 'Cyber-aware teams are your first line of defence against phishing and data breaches.' },
    ],
    process: [
      { step: '01', title: 'Skills Assessment', desc: 'Evaluate current competency levels to tailor the training curriculum to actual needs.' },
      { step: '02', title: 'Curriculum Design', desc: 'Custom training plan with learning objectives, schedule, and materials.' },
      { step: '03', title: 'Delivery', desc: 'Interactive, hands-on sessions — classroom, on-site, or virtual — with practical exercises.' },
      { step: '04', title: 'Assessment & Certificate', desc: 'Post-training assessment and certification to validate acquired skills.' },
    ],
    tags: ['Microsoft Office', 'Google Workspace', 'AI Tools', 'Cybersecurity', 'Digital Skills'],
  },
  {
    slug: 'email-hosting',
    icon: <Mail size={32} />,
    title: 'Email Hosting',
    tagline: 'Professional corporate email with advanced security and 99.9% uptime.',
    description:
      'Ditch free email providers. Our business email hosting gives your team professional @yourdomain.com addresses with enterprise spam filtering, large mailboxes, calendar sync and full mobile support.',
    features: [
      'Custom domain email (you@yourbusiness.com)',
      'Advanced spam & phishing protection',
      'Large mailboxes (25 GB+)',
      'Calendar, contacts & tasks sync',
      'Mobile sync (iOS, Android)',
      'Email archiving & compliance',
    ],
    benefits: [
      { icon: <Award size={20} />, title: 'Professional Image', desc: 'Branded email addresses signal credibility to clients and partners.' },
      { icon: <Shield size={20} />, title: 'Enterprise Security', desc: 'SPF, DKIM, DMARC and end-to-end encryption protect your communications.' },
      { icon: <Zap size={20} />, title: 'Reliable Delivery', desc: 'High sender reputation ensures your emails reach the inbox, not spam.' },
    ],
    process: [
      { step: '01', title: 'Domain Verification', desc: 'DNS records configured for SPF, DKIM and DMARC compliance.' },
      { step: '02', title: 'Mailbox Setup', desc: 'User accounts, groups and aliases created per your org structure.' },
      { step: '03', title: 'Migration', desc: 'Existing email history migrated with zero data loss.' },
      { step: '04', title: 'Device Setup', desc: 'Mobile and desktop client configuration for every team member.' },
    ],
    tags: ['Microsoft 365', 'Google Workspace', 'DMARC', 'IMAP', 'Exchange', 'Spam Filter'],
  },
];

export default function ServiceDetailPage() {
  const [, params] = useRoute('/services/:slug');
  const slug = params?.slug ?? '';
  const service = SERVICE_DETAILS.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
        <h1 className="text-3xl font-black text-[#060E18] mb-4">Service Not Found</h1>
        <p className="text-[#6B7280] mb-8">We couldn't find that service. Browse all our services below.</p>
        <Link href="/services" className="inline-flex items-center gap-2 bg-[#3CB52A] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#2da822] transition-colors">
          View All Services <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero
        badge="Our Services"
        title={service.title}
        subtitle={service.tagline}
        ctaPrimary={{ label: 'Get a Free Quote', href: '/contact' }}
        ctaSecondary={{ label: 'View All Services', href: '/services' }}
      />

      {/* Overview */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: description + tags */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4 bg-[#f0fdf4] px-4 py-1.5 rounded-full">Overview</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black text-[#060E18] mb-6 leading-tight">
              What We Deliver
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[#4B5563] text-lg leading-relaxed mb-8">
              {service.description}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-[#F3F4F6] text-[#374151] text-sm font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: features list */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="bg-[#F8FFFE] border border-[#E5E7EB] rounded-3xl p-8">
            <motion.h3 variants={fadeUp} className="text-xl font-black text-[#060E18] mb-6">What's Included</motion.h3>
            <ul className="space-y-3">
              {service.features.map((f, i) => (
                <motion.li key={i} custom={i} variants={fadeUp} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#3CB52A] shrink-0 mt-0.5" />
                  <span className="text-[#4B5563] text-sm leading-relaxed">{f}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4 bg-white border border-[#E5E7EB] px-4 py-1.5 rounded-full">Why Choose Us</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black text-[#060E18]">Key Benefits</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {service.benefits.map((b, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] text-[#3CB52A] flex items-center justify-center mb-5">
                  {b.icon}
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{b.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4 bg-[#f0fdf4] px-4 py-1.5 rounded-full">How We Work</motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black text-[#060E18]">Our Process</motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.process.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-5xl font-black text-[#3CB52A]/15 mb-4 leading-none">{p.step}</div>
              <h3 className="text-base font-bold text-[#111827] mb-2">{p.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#060E18] py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to get started with {service.title}?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Let's discuss your requirements and build a solution that drives real results.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#3CB52A] text-white font-bold px-10 py-4 rounded-xl hover:bg-[#2da822] transition-all shadow-[0_8px_28px_rgba(60,181,42,0.35)]">
              Get a Free Quote <ArrowRight size={16} />
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 border border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/8 transition-colors">
              All Services
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

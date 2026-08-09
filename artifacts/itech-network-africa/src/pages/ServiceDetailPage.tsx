import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Smartphone, Code, PenTool, Layers, Cloud,
  Headphones, Shield, Network, Camera, Printer,
  BookOpen, Briefcase, Package, Megaphone,
  ArrowRight, CheckCircle2, ChevronDown, ChevronUp,
  Globe, Users, Zap, Award, Clock, Mail, Server,
  Terminal, Database, Video, Star, TrendingUp,
  BarChart2, Lock, Cpu, Wifi, FileText, Target,
  MessageSquare, HelpCircle, ArrowLeft,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: EASE } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

export interface ServiceDetail {
  slug: string;
  icon: React.ReactNode;
  accentColor: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: { icon: React.ReactNode; title: string; desc: string }[];
  stats: { value: string; label: string; icon: React.ReactNode }[];
  whoFor: { label: string; desc: string }[];
  process: { step: string; title: string; desc: string }[];
  faq: { q: string; a: string }[];
  relatedSlugs: string[];
  tags: string[];
}

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    slug: 'web-development',
    icon: <Monitor size={36} />,
    accentColor: '#3CB52A',
    title: 'Web Design & Development',
    tagline: 'Stunning, high-performance websites that convert visitors into customers.',
    description:
      'We craft fast, secure, and scalable websites and web applications for businesses across Africa and beyond — from sleek landing pages to full enterprise portals.',
    longDescription:
      'Your website is your most powerful sales tool, yet most businesses settle for templates that look like everyone else. At iTech Network Africa, we design and build bespoke web experiences that reflect your brand, rank on Google, and turn visitors into paying customers. Using modern frameworks like React and Next.js on the frontend paired with rock-solid backends, every site we deliver is optimised for speed, accessibility, and long-term maintainability. Whether you are a startup launching your first site or an enterprise needing a complete overhaul, our team delivers on time and on budget.',
    features: [
      'Business, corporate & NGO websites',
      'E-commerce stores with payment integration',
      'Custom web portals & platforms',
      'Government & institutional websites',
      'News, magazine & blog websites',
      'Real estate & property listing platforms',
      'Hotel, hospitality & booking websites',
      'Website speed optimisation & performance audits',
      'Website redesign & migration',
      'SSL certificates & domain registration',
      'Website maintenance & monthly support plans',
      'SEO-ready architecture from day one',
    ],
    benefits: [
      { icon: <Zap size={22} />, title: 'Blazing Fast Load Times', desc: 'Optimised code, CDN delivery and modern bundling ensure sub-2-second page loads that keep users engaged and boost search rankings.' },
      { icon: <TrendingUp size={22} />, title: 'Built to Convert', desc: 'Every layout decision is backed by conversion principles — clear CTAs, trust signals, and friction-free user journeys that turn visits into enquiries.' },
      { icon: <Shield size={22} />, title: 'Secure & Compliant', desc: 'HTTPS by default, OWASP-hardened code, regular vulnerability scans, and GDPR-ready cookie management keep your site and users protected.' },
    ],
    stats: [
      { value: '100+', label: 'Websites Delivered', icon: <Monitor size={20} /> },
      { value: '<2s', label: 'Average Load Time', icon: <Zap size={20} /> },
      { value: '99.9%', label: 'Uptime Guarantee', icon: <Award size={20} /> },
    ],
    whoFor: [
      { label: 'Small & Medium Businesses', desc: 'Professional online presence that competes with bigger players.' },
      { label: 'Enterprises & Corporations', desc: 'Scalable portals, intranets, and customer-facing platforms.' },
      { label: 'NGOs & Nonprofits', desc: 'Donor-facing websites and donation platforms that build trust.' },
      { label: 'Government & Public Sector', desc: 'Accessible, compliant portals serving thousands of citizens.' },
      { label: 'Schools & Universities', desc: 'Admission portals, LMS integrations and academic websites.' },
    ],
    process: [
      { step: '01', title: 'Discovery & Strategy', desc: 'We audit your brand, research your competitors, and define clear goals and user journeys before touching a design tool.' },
      { step: '02', title: 'Design & Prototype', desc: 'Wireframes and high-fidelity mockups in Figma — reviewed and approved by your team before development starts.' },
      { step: '03', title: 'Development & QA', desc: 'Clean, maintainable code with thorough cross-browser and device testing. You review at every milestone.' },
      { step: '04', title: 'Launch & Support', desc: 'Zero-downtime deployment, Google Analytics setup, staff training, and an optional ongoing maintenance plan.' },
    ],
    faq: [
      { q: 'How long does it take to build a website?', a: 'A standard business website takes 2–4 weeks. Complex e-commerce or custom platforms typically take 6–12 weeks depending on scope. We agree a timeline with you at the start of every project.' },
      { q: 'Will I be able to update the website myself?', a: 'Yes. We build with a CMS (Content Management System) so you can update text, images, blog posts and products without touching code. We also provide training as part of every handover.' },
      { q: 'Do you provide hosting?', a: 'Yes — we offer managed hosting on fast, SSD-powered servers with daily backups, SSL certificates, and 24/7 monitoring. You can also host elsewhere and we\'ll deploy there.' },
      { q: 'Is SEO included?', a: 'All sites are built with SEO-ready architecture — clean URLs, schema markup, fast load times, and meta tag management. Full keyword research and content optimisation is available as an add-on.' },
    ],
    relatedSlugs: ['ui-ux-design', 'digital-marketing', 'branding'],
    tags: ['React', 'Next.js', 'WordPress', 'Tailwind CSS', 'Node.js', 'SEO', 'E-commerce'],
  },
  {
    slug: 'software-development',
    icon: <Code size={36} />,
    accentColor: '#3CB52A',
    title: 'Software Development',
    tagline: 'Bespoke enterprise software engineered around your exact business workflows.',
    description:
      'Off-the-shelf software rarely fits perfectly. We build custom ERP, CRM, hospital, school, and business management systems designed around your unique processes.',
    longDescription:
      'Generic software forces your team to adapt their workflows to the tool. We flip that: our engineers spend time understanding how your business actually runs, then build software that works the way you do. From enterprise resource planning (ERP) systems managing your entire supply chain, to hospital management platforms handling patient records, to custom CRM solutions tracking thousands of leads — every line of code is purposeful. We use modern, scalable architectures so your software grows with you, and we provide full documentation and training so your team can own it.',
    features: [
      'Custom ERP & enterprise management systems',
      'CRM & sales pipeline platforms',
      'School & university management systems',
      'Hospital & clinic management systems',
      'HR, payroll & attendance systems',
      'Inventory & warehouse management',
      'Accounting & financial management platforms',
      'Point-of-sale (POS) systems',
      'Booking & reservation systems',
      'API development & third-party integrations',
      'Legacy system modernisation',
      'Multi-tenant SaaS architecture',
    ],
    benefits: [
      { icon: <Users size={22} />, title: 'Fits Your Team Perfectly', desc: 'Software designed around your existing workflows — no retraining staff to work around the system\'s limitations.' },
      { icon: <Zap size={22} />, title: 'Process Automation', desc: 'Replace manual, error-prone tasks with automated workflows. Cut processing time by up to 70% and eliminate data entry mistakes.' },
      { icon: <Shield size={22} />, title: 'Enterprise-Grade Security', desc: 'Role-based access control, full audit trails, data encryption at rest and in transit, and compliance with local data-protection laws.' },
    ],
    stats: [
      { value: '50+', label: 'Custom Systems Built', icon: <Code size={20} /> },
      { value: '70%', label: 'Avg. Process Time Saved', icon: <TrendingUp size={20} /> },
      { value: '10yr+', label: 'Systems Still in Production', icon: <Award size={20} /> },
    ],
    whoFor: [
      { label: 'Healthcare Providers', desc: 'Hospitals, clinics, and labs needing patient record and billing systems.' },
      { label: 'Educational Institutions', desc: 'Schools and universities managing students, fees, and academic records.' },
      { label: 'Manufacturing & Logistics', desc: 'ERP and inventory systems for complex supply chains.' },
      { label: 'Financial Services', desc: 'Accounting, loan management, and transaction processing platforms.' },
      { label: 'Government Agencies', desc: 'Custom e-government and citizen service delivery platforms.' },
    ],
    process: [
      { step: '01', title: 'Business Analysis', desc: 'Deep-dive workshops to map your processes, data flows, user roles, and integration requirements.' },
      { step: '02', title: 'Solution Architecture', desc: 'Technical blueprint covering databases, APIs, microservices, security model, and infrastructure plan.' },
      { step: '03', title: 'Agile Development & UAT', desc: 'Modular, sprint-based delivery with regular user acceptance testing so issues are caught early.' },
      { step: '04', title: 'Training, Go-Live & Support', desc: 'Full user training, go-live support, documentation, and an ongoing managed support contract.' },
    ],
    faq: [
      { q: 'How do you ensure the software meets our exact requirements?', a: 'We use a rigorous requirements gathering process — workshops, process mapping, and sign-off at each phase. You review and approve at every milestone before we build the next feature.' },
      { q: 'Can you integrate with our existing systems?', a: 'Yes. We specialise in API development and systems integration. Whether it\'s your existing accounting software, third-party payment gateway, or government data portal, we connect the dots.' },
      { q: 'Who owns the software after it\'s built?', a: 'You do. All source code and intellectual property is transferred to you upon final payment. There are no licensing fees or vendor lock-in.' },
      { q: 'What happens after launch?', a: 'We offer flexible maintenance and support contracts — from a simple bug-fix retainer to a full managed service with feature development, monitoring, and SLA-backed response times.' },
    ],
    relatedSlugs: ['web-development', 'it-consulting', 'cloud-services'],
    tags: ['Python', 'Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS', 'REST API'],
  },
  {
    slug: 'mobile-app-development',
    icon: <Smartphone size={36} />,
    accentColor: '#3CB52A',
    title: 'Mobile App Development',
    tagline: 'Native and cross-platform iOS & Android apps that users love.',
    description:
      'From MVP to enterprise-grade applications, we build iOS and Android apps that combine beautiful design with rock-solid engineering — delivered to the App Store and Google Play.',
    longDescription:
      'Mobile is the primary screen for most Africans. Whether you\'re building a fintech app, an e-commerce platform, a patient management tool, or an internal enterprise app, iTech Network Africa delivers mobile applications that combine intuitive design with bulletproof performance. We work in React Native and Flutter for cross-platform efficiency, and native Swift/Kotlin when platform-specific performance is critical. Our mobile team has shipped apps used by tens of thousands of users across the continent, and we know what it takes to get approved on the App Store and Play Store first time.',
    features: [
      'React Native cross-platform development (iOS & Android)',
      'Flutter development for pixel-perfect cross-platform UIs',
      'Native iOS development (Swift)',
      'Native Android development (Kotlin)',
      'Offline-first architecture for low-connectivity environments',
      'Push notifications & real-time messaging',
      'Biometric authentication (Face ID, fingerprint)',
      'Payment gateway integration (Stripe, local mobile money)',
      'App Store & Play Store submission and optimisation',
      'Mobile analytics & crash reporting integration',
      'App maintenance, updates & version management',
    ],
    benefits: [
      { icon: <Zap size={22} />, title: 'Native Performance', desc: '60fps animations, sub-100ms interactions, and hardware-level access on both platforms — even on mid-range African devices.' },
      { icon: <Shield size={22} />, title: 'Secure by Default', desc: 'End-to-end encryption, certificate pinning, biometric auth, and secure local storage protect sensitive user data.' },
      { icon: <Clock size={22} />, title: 'Faster Time to Market', desc: 'Shared React Native or Flutter codebase cuts development and maintenance cost by 40–60% vs two separate native apps.' },
    ],
    stats: [
      { value: '20+', label: 'Apps Published', icon: <Smartphone size={20} /> },
      { value: '4.6★', label: 'Avg. App Store Rating', icon: <Star size={20} /> },
      { value: '40%', label: 'Dev Cost Savings vs Native', icon: <TrendingUp size={20} /> },
    ],
    whoFor: [
      { label: 'Fintech & Banking', desc: 'Mobile money, lending, savings, and payment apps for underserved markets.' },
      { label: 'Healthcare & Telemedicine', desc: 'Patient-facing and provider-facing apps with appointment and records management.' },
      { label: 'E-commerce & Retail', desc: 'Branded shopping apps with cart, checkout, and loyalty features.' },
      { label: 'Education & EdTech', desc: 'Learning apps with offline content, quizzes, and progress tracking.' },
      { label: 'Enterprise & Field Teams', desc: 'Internal tools for field agents, data collection, and real-time reporting.' },
    ],
    process: [
      { step: '01', title: 'Discovery & Prototype', desc: 'Clickable Figma prototypes validate user experience before a single line of code is written.' },
      { step: '02', title: 'Architecture Setup', desc: 'State management, navigation, API layer, auth flow, and CI/CD pipeline configured from the start.' },
      { step: '03', title: 'Iterative Development', desc: 'Feature-by-feature delivery with weekly TestFlight / Play Console internal testing builds.' },
      { step: '04', title: 'Store Launch & Growth', desc: 'ASO-optimised listings, submission support, post-launch monitoring, and iterative updates.' },
    ],
    faq: [
      { q: 'Should I build one app for both platforms or two separate native apps?', a: 'For most business applications, React Native or Flutter gives you 95% of native performance at 60% of the cost. We recommend native only when you need very specific hardware access or maximum graphics performance (e.g. AR/3D rendering).' },
      { q: 'How do you handle low-connectivity environments common in Africa?', a: 'Offline-first architecture is standard in our builds. Critical data is cached locally and synced when connectivity is available — users can work fully offline and everything reconciles seamlessly.' },
      { q: 'Can the app handle mobile money payments like MTN Mobile Money or Orange Money?', a: 'Yes. We have integration experience with MTN MoMo, Orange Money, Airtel Money, Flutterwave, Paystack, and other local payment APIs across West Africa.' },
      { q: 'How long does App Store/Play Store review take?', a: 'App Store review typically takes 24–72 hours; Play Store 3–7 days for first submission. We prepare your listing assets, metadata, and privacy policy to maximise approval chances on the first submission.' },
    ],
    relatedSlugs: ['web-development', 'ui-ux-design', 'software-development'],
    tags: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Expo', 'App Store'],
  },
  {
    slug: 'digital-marketing',
    icon: <Megaphone size={36} />,
    accentColor: '#3CB52A',
    title: 'Digital Marketing',
    tagline: 'Data-driven campaigns that grow your audience, generate leads, and dominate your market.',
    description:
      'From paid social and Google Ads to organic SEO and email campaigns, we build strategies that put your brand in front of the right audience at the right time.',
    longDescription:
      'Having a great product or service is only half the battle. Without the right digital marketing strategy, your target audience simply won\'t find you. iTech Network Africa\'s marketing team builds end-to-end digital marketing programmes — combining the immediate reach of paid advertising with the compounding power of organic SEO and content marketing. Every campaign is rooted in data: we track every click, lead, and conversion, and optimise continuously to maximise your return on investment. Whether you need to drive footfall to a physical location, generate B2B leads, or grow an online store, we have the tools and expertise to deliver measurable growth.',
    features: [
      'Social Media Management (Facebook, Instagram, LinkedIn, TikTok, X)',
      'Social Media Advertising & paid campaign management',
      'Google Ads (Search, Display, Shopping, YouTube)',
      'Facebook & Instagram Ads (Meta Business Manager)',
      'Search Engine Optimisation (on-page, off-page, technical)',
      'Email marketing campaigns & automation sequences',
      'SMS marketing & bulk messaging',
      'Content marketing & SEO copywriting',
      'Online reputation management & review strategy',
      'Landing page design & conversion optimisation',
      'Monthly performance reporting & insights',
    ],
    benefits: [
      { icon: <Target size={22} />, title: 'Hyper-Targeted Reach', desc: 'Advanced audience targeting by location, interest, behaviour, and lookalike audiences ensures your budget reaches people most likely to buy.' },
      { icon: <BarChart2 size={22} />, title: 'Full Transparency on ROI', desc: 'Every campaign tracked with real-time dashboards — cost per lead, conversion rate, revenue attributed — so you always know what\'s working.' },
      { icon: <TrendingUp size={22} />, title: 'Compounding Growth', desc: 'SEO and content marketing build organic traffic that grows month on month without increasing ad spend.' },
    ],
    stats: [
      { value: '3.2×', label: 'Avg. ROAS for Clients', icon: <TrendingUp size={20} /> },
      { value: '60%', label: 'Avg. Reduction in Cost Per Lead', icon: <BarChart2 size={20} /> },
      { value: '12mo', label: 'Avg. Time to Page-1 Rankings', icon: <Globe size={20} /> },
    ],
    whoFor: [
      { label: 'E-commerce Businesses', desc: 'Drive product sales through Google Shopping, Meta Ads, and email sequences.' },
      { label: 'Professional Services', desc: 'Generate qualified B2B leads through LinkedIn and targeted search ads.' },
      { label: 'Local Businesses', desc: 'Dominate local search results and attract nearby customers.' },
      { label: 'Startups & Scaleups', desc: 'Build brand awareness and customer acquisition channels fast and cost-efficiently.' },
      { label: 'Institutions & Events', desc: 'Sell tickets, drive registrations, and build community across channels.' },
    ],
    process: [
      { step: '01', title: 'Audit & Strategy', desc: 'We review your digital presence, analyse competitors, define your audience personas, and build a channel-specific strategy with clear KPIs.' },
      { step: '02', title: 'Creative & Content', desc: 'Ad creatives, copy, video content, and landing pages designed to match your audience and brand voice.' },
      { step: '03', title: 'Launch & Optimise', desc: 'Campaigns launched with daily monitoring and A/B testing to maximise performance from week one.' },
      { step: '04', title: 'Report & Scale', desc: 'Monthly strategy reviews with detailed performance reports. Winning campaigns scaled; underperformers cut.' },
    ],
    faq: [
      { q: 'How much should I budget for ads?', a: 'We work with budgets from $200/month upwards for small businesses, and $1,000–$5,000+/month for growth-focused campaigns. We\'ll recommend a starting budget based on your goals and industry competitiveness.' },
      { q: 'How long before I see results?', a: 'Paid ads (Google, Meta) generate traffic within 48 hours of launch. SEO typically takes 3–6 months to show significant organic ranking improvements. We set clear 30/60/90-day milestones at the start.' },
      { q: 'Do you create the ad graphics and copy?', a: 'Yes. Our in-house designers and copywriters produce all creative assets. You review and approve everything before it goes live.' },
      { q: 'Can you manage my existing accounts or do I need new ones?', a: 'We can take over existing Google Ads or Meta Ads accounts — we\'ll audit them, restructure where needed, and carry forward any historical data that helps optimise performance.' },
    ],
    relatedSlugs: ['branding', 'web-development', 'creative-media'],
    tags: ['Google Ads', 'Meta Ads', 'SEO', 'Email Marketing', 'Content Strategy', 'Analytics', 'PPC'],
  },
  {
    slug: 'branding',
    icon: <PenTool size={36} />,
    accentColor: '#3CB52A',
    title: 'Graphic Design & Branding',
    tagline: 'Complete brand identities and visual assets that make your organisation unforgettable.',
    description:
      'From logo design and brand strategy to marketing collateral and social media graphics, we build visual identities that command attention and build lasting trust.',
    longDescription:
      'Your brand is the first thing people experience before they ever speak to you. A poorly designed logo, inconsistent colours, or amateurish marketing materials signal low quality before you\'ve had a chance to prove otherwise. iTech Network Africa\'s creative team builds comprehensive brand identities — from initial strategy and logo design through to a full guidelines document, business stationery, social media templates, and marketing collateral. Every decision is grounded in your business goals, target audience, and competitive landscape. We don\'t just make things look good — we build brands that position you as the definitive leader in your market.',
    features: [
      'Logo design & brand mark creation',
      'Full brand identity system',
      'Brand strategy & market positioning',
      'Colour palette, typography & iconography',
      'Brand guidelines document',
      'Corporate stationery (business cards, letterheads, envelopes)',
      'Flyers, posters & banners',
      'Brochures & company profiles',
      'Billboards & large-format signage',
      'Social media graphics & templates',
      'Pitch deck & presentation design',
      'Infographics & data visualisations',
      'Product packaging design',
    ],
    benefits: [
      { icon: <Award size={22} />, title: 'Premium Market Positioning', desc: 'A professional brand signals quality and commands premium pricing — customers trust you more before the first conversation.' },
      { icon: <Users size={22} />, title: 'Audience Connection', desc: 'Brand strategy rooted in your audience\'s values, aspirations, and cultural context ensures your message resonates.' },
      { icon: <Zap size={22} />, title: 'Consistent Experience', desc: 'Brand guidelines and templates ensure every touchpoint — from business cards to social media — looks cohesive and professional.' },
    ],
    stats: [
      { value: '200+', label: 'Brand Projects Completed', icon: <PenTool size={20} /> },
      { value: '3 days', label: 'First Logo Concepts', icon: <Clock size={20} /> },
      { value: '100%', label: 'IP Transferred to Client', icon: <FileText size={20} /> },
    ],
    whoFor: [
      { label: 'Startups & New Businesses', desc: 'Launch with a professional identity that competes with established players.' },
      { label: 'Rebranding Organisations', desc: 'Modernise a dated identity without losing brand equity.' },
      { label: 'NGOs & Nonprofits', desc: 'Build donor trust and community recognition through consistent branding.' },
      { label: 'Events & Conferences', desc: 'End-to-end event branding from registration to stage design.' },
      { label: 'Product Companies', desc: 'Packaging and product identity design that stands out on shelf and online.' },
    ],
    process: [
      { step: '01', title: 'Brand Discovery', desc: 'Workshops to define mission, vision, values, target audience, competitors, and the emotional territory your brand should own.' },
      { step: '02', title: 'Identity Design', desc: 'Logo concepts, colour exploration, and typography selection — presented in context on real-world applications.' },
      { step: '03', title: 'System Development', desc: 'Full brand system: guidelines document, stationery suite, social media templates, and asset library.' },
      { step: '04', title: 'Rollout Support', desc: 'Brand launch across all platforms and channels, with print-ready and digital-ready files for every use case.' },
    ],
    faq: [
      { q: 'What do you deliver at the end of the branding project?', a: 'You receive all logo files in every format (SVG, PNG, PDF, EPS), the brand guidelines PDF, editable source files (Adobe Illustrator/Photoshop), and all collateral files. Full IP transfer is included.' },
      { q: 'How many logo concepts will I see?', a: 'We present 3 distinct logo concepts in round one. After you select and provide feedback on your preferred direction, we refine with up to 2 more revision rounds until you\'re completely happy.' },
      { q: 'Can you rebrand us without losing our existing brand recognition?', a: 'Yes. We conduct a brand equity audit to identify which elements (colours, shapes, associations) to retain, then evolve the identity in a way that feels fresh but familiar to your existing audience.' },
      { q: 'Do you handle printing after design?', a: 'Yes — through our Printing & Promotional service we can print everything we design, from business cards to roll-up banners, with consistent quality assurance across design and production.' },
    ],
    relatedSlugs: ['ui-ux-design', 'digital-marketing', 'printing-promotional'],
    tags: ['Adobe Illustrator', 'Photoshop', 'Figma', 'Brand Strategy', 'Logo Design', 'Print Design'],
  },
  {
    slug: 'ui-ux-design',
    icon: <Layers size={36} />,
    accentColor: '#3CB52A',
    title: 'UI/UX Design',
    tagline: 'User-centred interfaces that drive engagement, reduce friction, and convert visitors into customers.',
    description:
      'Great products start with great design. Our UX process combines research, rapid prototyping, and data-driven iteration to create interfaces that users find intuitive and delightful.',
    longDescription:
      'Poor user experience is invisible when it works and catastrophic when it doesn\'t. Users who encounter confusing navigation, slow flows, or unclear CTAs simply leave — and rarely come back. iTech Network Africa\'s UX team applies a rigorous, research-led design process to every project: we start by understanding your users through interviews and analytics, map their journeys to surface friction points, then design, prototype, and test solutions before handing off pixel-perfect specs to development. The result is software that users adopt quickly, return to willingly, and recommend to others.',
    features: [
      'User research, interviews & persona development',
      'Information architecture & user journey mapping',
      'Wireframing & low-fidelity prototyping',
      'High-fidelity UI design in Figma',
      'Interactive prototype development',
      'Responsive & mobile-first design',
      'Design system & component library creation',
      'Usability testing & iteration',
      'Accessibility audits (WCAG 2.1 AA)',
      'Dashboard & data visualisation design',
      'Developer handoff with annotated specs',
    ],
    benefits: [
      { icon: <Users size={22} />, title: 'Higher User Retention', desc: 'Intuitive UX reduces churn, shortens onboarding, and turns users into advocates — measurable within weeks of launch.' },
      { icon: <Zap size={22} />, title: 'Faster Task Completion', desc: 'Clear information hierarchy and logical flows mean users accomplish their goals in fewer steps with less cognitive load.' },
      { icon: <Award size={22} />, title: 'Competitive Differentiation', desc: 'Premium design quality signals market leadership and justifies higher pricing in every industry.' },
    ],
    stats: [
      { value: '40%', label: 'Avg. Increase in Conversion', icon: <TrendingUp size={20} /> },
      { value: '60%', label: 'Reduction in Support Tickets', icon: <Users size={20} /> },
      { value: '5-star', label: 'Average App Store UX Rating', icon: <Star size={20} /> },
    ],
    whoFor: [
      { label: 'SaaS & Tech Companies', desc: 'Complex dashboards and workflows that need to feel simple and intuitive.' },
      { label: 'E-commerce Platforms', desc: 'Checkout flows and product discovery that maximise conversion rate.' },
      { label: 'Mobile App Builders', desc: 'Onboarding and retention-focused UX for iOS and Android products.' },
      { label: 'Enterprise Software Teams', desc: 'Internal tools that staff actually want to use — not fight against daily.' },
      { label: 'Startups Pre-Development', desc: 'Validated prototypes that de-risk engineering investment before a single line of code.' },
    ],
    process: [
      { step: '01', title: 'Research & Discovery', desc: 'User interviews, analytics review, competitor benchmarking, and heuristic evaluation of existing products.' },
      { step: '02', title: 'IA & Wireframes', desc: 'Site maps, user flows, and low-fidelity wireframes that establish structure and stakeholder alignment before visual design.' },
      { step: '03', title: 'High-Fidelity Design', desc: 'Pixel-perfect designs in Figma with a component-based design system ready for developer handoff.' },
      { step: '04', title: 'Test, Iterate & Handoff', desc: 'Moderated usability testing with real users, final refinements, and annotated dev specs.' },
    ],
    faq: [
      { q: 'What\'s the difference between UI and UX design?', a: 'UX (User Experience) is about the overall flow and logic — how the product works and how users achieve their goals. UI (User Interface) is about the visual presentation — colours, typography, components, and aesthetics. Great products need both.' },
      { q: 'Do I need UX design if I already know what I want to build?', a: 'Even with a clear vision, UX research consistently reveals assumptions that don\'t hold when tested with real users. A few weeks of research and prototyping can save months of rebuilding after launch.' },
      { q: 'What tools do you use for design?', a: 'We design primarily in Figma, which provides real-time collaboration, interactive prototyping, and developer handoff in one tool. Prototype testing is done in Maze or Lookback for remote usability sessions.' },
      { q: 'Can you redesign just one part of our existing product?', a: 'Yes. We regularly work on specific flows — checkout, onboarding, dashboard — without redesigning the entire product. We\'ll audit the current design and ensure any changes integrate consistently with your existing design language.' },
    ],
    relatedSlugs: ['web-development', 'mobile-app-development', 'branding'],
    tags: ['Figma', 'UX Research', 'Prototyping', 'Design Systems', 'WCAG', 'A/B Testing', 'Wireframing'],
  },
  {
    slug: 'cloud-services',
    icon: <Cloud size={36} />,
    accentColor: '#3CB52A',
    title: 'Cloud & IT Services',
    tagline: 'Secure, scalable cloud infrastructure on AWS, Azure, and Google Cloud — managed so you can focus on your business.',
    description:
      'We architect, migrate, and manage cloud environments that are resilient, cost-optimised, and compliant — whether you\'re starting fresh or scaling an existing workload.',
    longDescription:
      'Cloud infrastructure is the backbone of modern business, yet misconfigured environments waste money, expose data, and create performance bottlenecks. iTech Network Africa\'s cloud practice designs right-sized cloud architectures that scale on demand, stay secure, and cost no more than necessary. We\'re experienced across AWS, Microsoft Azure, and Google Cloud, and we bring the same rigour to Microsoft 365 and Google Workspace deployments for organisations modernising their productivity stack. From initial cloud strategy and migration planning to day-to-day managed operations, we act as your cloud team — so you get enterprise-class infrastructure without the enterprise-class headcount.',
    features: [
      'Cloud architecture design & strategy',
      'AWS, Azure & Google Cloud migrations',
      'Microsoft 365 deployment & management',
      'Google Workspace setup & administration',
      'Business email setup & migration',
      'Infrastructure as Code (Terraform)',
      'Kubernetes & container orchestration',
      'Cloud backup, recovery & disaster planning',
      'Server provisioning & management',
      '24/7 cloud monitoring & alerting',
      'Cost optimisation & cloud spend management',
      'SSL certificate management',
    ],
    benefits: [
      { icon: <Zap size={22} />, title: '99.99% Uptime Availability', desc: 'Multi-region redundancy, auto-scaling, and load balancing keep your services running even during infrastructure failures.' },
      { icon: <Shield size={22} />, title: 'Enterprise Security & Compliance', desc: 'SOC 2 and ISO 27001-aligned environments with encryption at rest and in transit, identity management, and security baselines.' },
      { icon: <Clock size={22} />, title: 'Predictable Cost Control', desc: 'Right-sizing, reserved capacity, and FinOps practices typically reduce cloud bills by 30–40% vs unmanaged environments.' },
    ],
    stats: [
      { value: '40%', label: 'Avg. Cloud Cost Reduction', icon: <TrendingUp size={20} /> },
      { value: '99.99%', label: 'Uptime SLA', icon: <Award size={20} /> },
      { value: '0', label: 'Downtime During Migrations', icon: <Zap size={20} /> },
    ],
    whoFor: [
      { label: 'Businesses Moving Off On-Premise', desc: 'Migrate servers, email, and applications to cloud with zero data loss.' },
      { label: 'Fast-Growing Startups', desc: 'Scalable infrastructure that handles 10× traffic spikes without manual intervention.' },
      { label: 'Remote-First Teams', desc: 'Microsoft 365 and Google Workspace deployments that connect distributed teams.' },
      { label: 'Regulated Industries', desc: 'Compliance-ready cloud environments for healthcare, finance, and government.' },
      { label: 'SMEs Cutting IT Costs', desc: 'Replace expensive on-premise hardware with flexible, pay-as-you-go cloud resources.' },
    ],
    process: [
      { step: '01', title: 'Cloud Assessment', desc: 'Audit of current infrastructure, applications, data volumes, and compliance requirements.' },
      { step: '02', title: 'Architecture Design', desc: 'Target-state cloud design with disaster recovery, security layers, and cost modelling.' },
      { step: '03', title: 'Migration & Cutover', desc: 'Phased migration with parallel running environments and zero-downtime cutover.' },
      { step: '04', title: 'Managed Operations', desc: 'Ongoing monitoring, patching, cost reviews, capacity planning, and incident response.' },
    ],
    faq: [
      { q: 'Which cloud provider do you recommend — AWS, Azure, or Google Cloud?', a: 'It depends on your use case and existing stack. Azure integrates best with Microsoft 365 and Windows environments. AWS has the broadest service catalogue. GCP excels for data analytics and ML workloads. We help you choose and avoid vendor lock-in.' },
      { q: 'Can you migrate our on-premise servers without downtime?', a: 'Yes. We use blue-green migration strategies — standing up the new cloud environment in parallel, validating it fully, then switching traffic in a controlled cutover that\'s typically scheduled outside business hours.' },
      { q: 'How do you handle data security during migration?', a: 'All data is encrypted in transit using TLS 1.3, transferred over private or VPN-encrypted connections, and verified with checksums before the source is decommissioned.' },
      { q: 'Do you provide ongoing management after migration?', a: 'Yes — our managed cloud service covers 24/7 monitoring, patch management, security updates, backup verification, monthly cost reports, and an annual architecture review.' },
    ],
    relatedSlugs: ['cybersecurity', 'networking', 'it-support'],
    tags: ['AWS', 'Azure', 'GCP', 'Microsoft 365', 'Google Workspace', 'Terraform', 'Kubernetes'],
  },
  {
    slug: 'cybersecurity',
    icon: <Shield size={36} />,
    accentColor: '#3CB52A',
    title: 'Cybersecurity',
    tagline: 'Enterprise-grade security that protects your data, systems, and reputation from evolving threats.',
    description:
      'Cyber threats are evolving daily. Our security practice combines offensive testing with defensive architecture to identify vulnerabilities and keep your organisation secure and compliant.',
    longDescription:
      'A single data breach can destroy years of customer trust and cost millions in regulatory fines, legal fees, and remediation. Yet most organisations don\'t discover their vulnerabilities until an attacker already has. iTech Network Africa\'s cybersecurity team takes a proactive, adversarial approach — we think like attackers to find and fix weaknesses before they can be exploited. From penetration testing and vulnerability assessments to security architecture design and staff awareness training, we provide end-to-end protection aligned with international frameworks including ISO 27001, GDPR, and the NIST Cybersecurity Framework. We work with businesses of all sizes across West Africa and beyond to build security cultures, not just security controls.',
    features: [
      'Penetration testing (network, web app, mobile)',
      'Vulnerability assessment & management',
      'Security architecture design & review',
      'ISO 27001 compliance consulting',
      'GDPR & data protection compliance',
      'Firewall configuration & management',
      'Incident response & forensic investigation',
      'Security Information & Event Management (SIEM)',
      'Website security hardening',
      'Data backup & disaster recovery planning',
      'Security awareness training & phishing simulations',
      'Third-party vendor security assessments',
    ],
    benefits: [
      { icon: <Lock size={22} />, title: 'Proactive Risk Elimination', desc: 'Identify and remediate vulnerabilities before attackers find them — not after a breach has already occurred.' },
      { icon: <Award size={22} />, title: 'Regulatory Compliance', desc: 'Meet ISO 27001, GDPR, and local data protection requirements with documented, auditable security controls.' },
      { icon: <Users size={22} />, title: 'Human Firewall Training', desc: 'Phishing simulations and security awareness programmes reduce social engineering attack success by up to 70%.' },
    ],
    stats: [
      { value: '200+', label: 'Security Assessments Done', icon: <Shield size={20} /> },
      { value: '70%', label: 'Reduction in Phishing Risk Post-Training', icon: <Users size={20} /> },
      { value: '24hr', label: 'Incident Response Time', icon: <Clock size={20} /> },
    ],
    whoFor: [
      { label: 'Financial Services & Fintech', desc: 'Banks, MFIs, and payment processors protecting customer financial data.' },
      { label: 'Healthcare Providers', desc: 'Hospitals and clinics protecting sensitive patient records and medical systems.' },
      { label: 'Government & Public Sector', desc: 'Agencies securing critical national infrastructure and citizen data.' },
      { label: 'E-commerce Businesses', desc: 'Protecting payment data, customer accounts, and transaction integrity.' },
      { label: 'Any Business Post-Incident', desc: 'Rapid response, forensic investigation, and hardening after a security event.' },
    ],
    process: [
      { step: '01', title: 'Threat Modelling & Risk Assessment', desc: 'Classify your assets, identify threat actors and attack vectors, and prioritise risk based on business impact.' },
      { step: '02', title: 'Penetration Testing', desc: 'Ethical hacking across network perimeter, web applications, social engineering, and physical security.' },
      { step: '03', title: 'Remediation Roadmap', desc: 'Prioritised remediation plan with clear ownership, timelines, and severity classifications (Critical/High/Medium/Low).' },
      { step: '04', title: 'Continuous Monitoring & Re-Testing', desc: 'SIEM deployment, alerting, and scheduled quarterly re-testing to maintain and prove your security posture.' },
    ],
    faq: [
      { q: 'How often should we conduct a penetration test?', a: 'Industry best practice is at least annually, and after any major system change, acquisition, or regulatory requirement. For high-risk industries (banking, healthcare), quarterly assessments are recommended.' },
      { q: 'What\'s the difference between a vulnerability scan and a penetration test?', a: 'A vulnerability scan is automated tool-based discovery of known issues. A penetration test is conducted by human ethical hackers who chain vulnerabilities together to simulate a real attack — it finds issues automated tools miss.' },
      { q: 'Will testing disrupt our business operations?', a: 'We schedule tests during low-traffic windows and use non-destructive techniques. You\'ll get a clear scope document and testing schedule before we begin. Business-critical systems are tested with additional care.' },
      { q: 'We had a breach. Can you help?', a: 'Yes. Our incident response team can deploy within 24 hours to contain the breach, investigate the root cause, preserve forensic evidence, and restore operations while minimising data loss and regulatory exposure.' },
    ],
    relatedSlugs: ['cloud-services', 'networking', 'ict-training'],
    tags: ['Pen Testing', 'ISO 27001', 'GDPR', 'SIEM', 'Zero Trust', 'SOC', 'Firewall'],
  },
  {
    slug: 'networking',
    icon: <Network size={36} />,
    accentColor: '#3CB52A',
    title: 'Networking & Infrastructure',
    tagline: 'End-to-end network installation, Wi-Fi, CCTV, and structured cabling for any scale.',
    description:
      'From LAN design and Wi-Fi deployments to CCTV, access control, and server room installations, we build physical and logical infrastructure that performs at enterprise grade.',
    longDescription:
      'Every digital service your business runs depends on reliable network infrastructure at its foundation. A poorly planned network means dropped calls, slow file transfers, security vulnerabilities, and expensive reactive fixes. iTech Network Africa designs and installs enterprise-grade network infrastructure for offices, campuses, warehouses, factories, and public spaces — from a 10-person office Wi-Fi upgrade to a multi-site SD-WAN deployment. Our certified engineers handle everything from structured cabling and server room setup to firewall configuration, CCTV installation, and biometric access control. We leave you with a fully documented network you understand and can manage — backed by our optional managed network operations service.',
    features: [
      'Office & enterprise LAN design and installation',
      'Wi-Fi network design and deployment (Cisco, Ubiquiti, Aruba)',
      'SD-WAN & WAN connectivity solutions',
      'Network security: firewall, IDS/IPS, VPN',
      'CCTV & IP camera installation (Hikvision, Dahua)',
      'Access control & biometric systems',
      'Server room design, installation & cooling',
      'Structured cabling (Cat5e, Cat6, Cat6A, fibre)',
      'Network performance monitoring & management',
      'VLAN segmentation & QoS configuration',
      'Network documentation & topology mapping',
      'ISP procurement & connectivity management',
    ],
    benefits: [
      { icon: <Zap size={22} />, title: 'Maximum Throughput & Low Latency', desc: 'Optimised routing, QoS policies, and properly segmented VLANs ensure business-critical applications always get priority bandwidth.' },
      { icon: <Shield size={22} />, title: 'Secure Perimeter by Design', desc: 'Next-generation firewalls, VLAN segmentation, and zero-trust network access prevent unauthorised lateral movement across your environment.' },
      { icon: <Clock size={22} />, title: 'Built-in Redundancy', desc: 'Dual ISP failover, redundant switches, and UPS-protected infrastructure keep your network online even when components fail.' },
    ],
    stats: [
      { value: '500+', label: 'Network Installations', icon: <Network size={20} /> },
      { value: '99.9%', label: 'Network Uptime for Managed Clients', icon: <Award size={20} /> },
      { value: '4hr', label: 'On-site Response Time', icon: <Clock size={20} /> },
    ],
    whoFor: [
      { label: 'New Office Fit-Outs', desc: 'Complete network, CCTV, access control, and cabling for new premises.' },
      { label: 'Multi-Site Organisations', desc: 'SD-WAN and VPN connectivity linking branches securely and reliably.' },
      { label: 'Schools & Universities', desc: 'Campus-wide Wi-Fi, content filtering, and student device management.' },
      { label: 'Warehouses & Factories', desc: 'Industrial-grade Wi-Fi and wired networks that survive harsh environments.' },
      { label: 'Hotels & Hospitality', desc: 'Guest Wi-Fi, IPTV, CCTV, and access control for full-property coverage.' },
    ],
    process: [
      { step: '01', title: 'Site Survey & Assessment', desc: 'Physical walkthrough to map floor plans, identify cable routes, assess Wi-Fi coverage requirements, and document existing infrastructure.' },
      { step: '02', title: 'Network Design & BOM', desc: 'Logical topology, IP addressing scheme, security zones, equipment specification, and detailed bill of materials.' },
      { step: '03', title: 'Installation & Configuration', desc: 'Certified engineers install structured cabling, hardware, and configure all devices to specification with full testing.' },
      { step: '04', title: 'Handover, Documentation & Support', desc: 'As-built documentation, staff training, network monitoring setup, and optional managed operations contract.' },
    ],
    faq: [
      { q: 'How do you ensure Wi-Fi coverage in large or complex buildings?', a: 'We conduct a predictive Wi-Fi site survey using specialist software to model signal strength, interference, and access point placement before installation — eliminating dead zones and ensuring consistent coverage.' },
      { q: 'Can you work around our existing cabling?', a: 'Yes. We assess existing cabling and reuse where it meets current standards. Where it doesn\'t, we replace or supplement — we always recommend the most cost-effective approach for your situation.' },
      { q: 'Do you offer managed network services after installation?', a: 'Yes. Our Network Operations Centre (NOC) provides 24/7 monitoring, proactive fault detection, firmware management, and on-site response for managed network clients.' },
      { q: 'What CCTV cameras do you install?', a: 'We install Hikvision, Dahua, and Axis IP cameras in HD, 4K, and PTZ configurations with NVR or cloud-based recording. All systems support remote viewing via smartphone app.' },
    ],
    relatedSlugs: ['cybersecurity', 'cloud-services', 'it-support'],
    tags: ['Cisco', 'Ubiquiti', 'Fortinet', 'SD-WAN', 'Wi-Fi 6', 'CCTV', 'Structured Cabling'],
  },
  {
    slug: 'it-consulting',
    icon: <Briefcase size={36} />,
    accentColor: '#3CB52A',
    title: 'IT Consulting',
    tagline: 'Strategic technology advisory that accelerates digital transformation and drives sustainable growth.',
    description:
      'Our senior consultants partner with your leadership team to define technology strategy, modernise operations, and build the digital capabilities that keep you competitive.',
    longDescription:
      'Technology decisions made without strategic clarity are expensive to reverse. Organisations across Africa are under pressure to digitise faster, yet many invest in the wrong tools, in the wrong order, without a coherent architecture — creating technical debt that compounds over time. iTech Network Africa\'s consulting practice brings a structured, independent perspective to your technology challenges. We work at the intersection of business strategy and technology execution — defining roadmaps, selecting the right vendors, governing transformations, and ensuring the technology investments your organisation makes actually deliver measurable outcomes. We have no preferred vendors and no hidden incentives: our only agenda is your success.',
    features: [
      'Digital transformation strategy & roadmaps',
      'IT strategy, planning & governance',
      'Technology assessment & architecture review',
      'Business process analysis & optimisation',
      'ICT policy and procedure development',
      'Vendor selection & procurement advisory',
      'Project & programme management (PMO)',
      'Change management & technology adoption',
      'IT budget planning & cost optimisation',
      'Technology due diligence (M&A, investment)',
      'Data strategy & analytics roadmaps',
    ],
    benefits: [
      { icon: <Award size={22} />, title: 'Fully Independent Advice', desc: 'No vendor kickbacks or preferred partnerships — our recommendations are driven solely by what best serves your business objectives.' },
      { icon: <Zap size={22} />, title: 'Accelerated Transformation', desc: 'Proven frameworks and reusable playbooks cut digital transformation timelines by up to 40% vs starting from scratch.' },
      { icon: <Shield size={22} />, title: 'Reduced Technology Risk', desc: 'Expert guidance prevents the most common and costly technology mistakes: wrong platform choices, integration failures, and change resistance.' },
    ],
    stats: [
      { value: '30+', label: 'Digital Transformations Led', icon: <TrendingUp size={20} /> },
      { value: '40%', label: 'Avg. Project Timeline Reduction', icon: <Zap size={20} /> },
      { value: '$2M+', label: 'Client IT Costs Saved', icon: <BarChart2 size={20} /> },
    ],
    whoFor: [
      { label: 'C-Suite & Board Level', desc: 'Technology strategy and investment prioritisation aligned to business objectives.' },
      { label: 'Government Ministries & Agencies', desc: 'ICT policy development and e-government transformation advisory.' },
      { label: 'NGOs & Donor-Funded Organisations', desc: 'Technology strategies that maximise programme impact within budget constraints.' },
      { label: 'Businesses Evaluating New Systems', desc: 'Independent vendor selection to avoid costly mistakes and vendor lock-in.' },
      { label: 'Organisations Post-Merger', desc: 'Technology integration and systems consolidation planning.' },
    ],
    process: [
      { step: '01', title: 'Discovery & Stakeholder Alignment', desc: 'Structured interviews and workshops across leadership and operational teams to understand current state, goals, and constraints.' },
      { step: '02', title: 'Assessment & Gap Analysis', desc: 'Technology audit covering systems, processes, data, people, and governance to identify gaps and opportunities.' },
      { step: '03', title: 'Strategy & Roadmap', desc: 'Prioritised, costed transformation roadmap with quick wins (0–90 days), medium-term initiatives (3–12 months), and strategic plays (1–3 years).' },
      { step: '04', title: 'Advisory Through Execution', desc: 'Ongoing advisory support — governance reviews, vendor management, issue resolution — ensuring strategy translates to delivered outcomes.' },
    ],
    faq: [
      { q: 'How is consulting engagement structured — project or retainer?', a: 'We offer both. Discovery and strategy engagements are typically fixed-price projects (4–8 weeks). Ongoing advisory and PMO support is available on a monthly retainer with agreed deliverables.' },
      { q: 'Do you only advise, or do you also implement?', a: 'We do both. For pure strategy engagements, we advise and your team implements. For end-to-end projects, our development and infrastructure teams execute the roadmap we define together — one partner from strategy to go-live.' },
      { q: 'How do you handle confidentiality of sensitive business information?', a: 'All engagements are covered by a mutual NDA before discovery begins. Our team adheres to strict information security practices and your data is never shared with third parties.' },
      { q: 'Can you help us select and negotiate with software vendors?', a: 'Yes. Vendor selection and procurement advisory is a core service — we build your requirements specification, evaluate vendors against weighted criteria, facilitate demos, and support commercial negotiations.' },
    ],
    relatedSlugs: ['software-development', 'cloud-services', 'cybersecurity'],
    tags: ['Digital Strategy', 'IT Governance', 'Change Management', 'ICT Policy', 'Vendor Selection', 'PMO'],
  },
  {
    slug: 'creative-media',
    icon: <Camera size={36} />,
    accentColor: '#3CB52A',
    title: 'Creative Media',
    tagline: 'Professional photography, video, and multimedia production that tells your brand story compellingly.',
    description:
      'From corporate photography and brand videos to motion graphics, animation, and live streaming — our creative team produces visual content that engages your audience and elevates your brand.',
    longDescription:
      'Attention is the scarcest resource in the digital economy, and visual content is the most powerful way to capture it. Brands that invest in professional photography, video, and motion graphics consistently outperform those that rely on stock images and self-shot clips — in engagement, recall, and conversion. iTech Network Africa\'s creative media team handles the entire production process: from initial brief and concept development through pre-production planning, on-location or studio shooting, and full post-production finishing. We\'ve produced content for corporate events, product launches, government campaigns, NGO programmes, and social media channels across West Africa, delivering agency-quality output with the speed and cost-efficiency of an in-house team.',
    features: [
      'Corporate & commercial photography',
      'Event photography & videography',
      'Brand & product videography',
      'TV commercials & promotional videos',
      'Motion graphics & animated explainer videos',
      '2D & 3D animation production',
      'Video editing & colour grading',
      'Podcast production & audio engineering',
      'Live event streaming (YouTube, Facebook, LinkedIn)',
      'Social media content packages (reels, stories)',
      'Drone photography & videography',
      'Green screen / virtual production',
    ],
    benefits: [
      { icon: <Award size={22} />, title: 'Agency-Quality at SME Cost', desc: 'Full in-house creative crew — director, cinematographer, editor, motion designer — without the agency overhead.' },
      { icon: <TrendingUp size={22} />, title: '10× Higher Engagement', desc: 'Video content consistently outperforms static images across every social platform and email campaign metric.' },
      { icon: <Clock size={22} />, title: 'End-to-End Service', desc: 'Concept to delivery in one team — no coordinating multiple suppliers. Faster timelines and consistent creative vision.' },
    ],
    stats: [
      { value: '300+', label: 'Productions Completed', icon: <Camera size={20} /> },
      { value: '10×', label: 'Avg. Video vs. Static Engagement', icon: <TrendingUp size={20} /> },
      { value: '48hr', label: 'Rush Delivery Available', icon: <Clock size={20} /> },
    ],
    whoFor: [
      { label: 'Brands & Marketing Teams', desc: 'Product launches, brand campaigns, and always-on social content.' },
      { label: 'Events & Conferences', desc: 'Live streaming, highlight reels, and speaker interview packages.' },
      { label: 'NGOs & Development Organisations', desc: 'Impact stories, donor reports, and programme documentation films.' },
      { label: 'Educational Institutions', desc: 'Promotional films, lecture capture, and virtual campus tours.' },
      { label: 'Government & Public Sector', desc: 'Public information campaigns, ministerial addresses, and official documentation.' },
    ],
    process: [
      { step: '01', title: 'Brief & Concept', desc: 'Define the story, target audience, tone, key messages, and all deliverables in a detailed creative brief.' },
      { step: '02', title: 'Pre-Production', desc: 'Shot lists, scripts, storyboards, location scouting, talent sourcing, and equipment planning.' },
      { step: '03', title: 'Production', desc: 'On-site or studio shoot with professional equipment, lighting, and an experienced crew.' },
      { step: '04', title: 'Post-Production & Delivery', desc: 'Editing, colour grading, sound design, motion graphics, subtitles, and export in all required formats.' },
    ],
    faq: [
      { q: 'Do you work outside of Liberia?', a: 'Yes. Our creative team travels across West Africa for productions. We also have partner crews in several countries for large-scale multi-location projects.' },
      { q: 'How long does video production take?', a: 'A typical 2–3 minute brand video takes 2–3 weeks from shoot day to delivery. Complex productions with animation or multiple locations may take 4–6 weeks. Rush delivery (48–72 hours) is available for event highlights and news content.' },
      { q: 'What formats do you deliver files in?', a: 'We deliver master files plus platform-optimised exports for YouTube (16:9), Instagram (1:1, 4:5, 9:16), LinkedIn, and broadcast. All source project files are available on request.' },
      { q: 'Can you repurpose our existing footage?', a: 'Yes. Bring us your existing raw footage and we can edit, colour grade, and add motion graphics to create new content without a new shoot.' },
    ],
    relatedSlugs: ['branding', 'digital-marketing', 'printing-promotional'],
    tags: ['Photography', 'Videography', 'After Effects', 'Premiere Pro', 'Animation', 'Live Streaming', 'Drone'],
  },
  {
    slug: 'printing-promotional',
    icon: <Printer size={36} />,
    accentColor: '#3CB52A',
    title: 'Printing & Promotional',
    tagline: 'High-quality large-format printing, branded merchandise, and signage that makes a lasting impression.',
    description:
      'From roll-up banners and T-shirts to ID cards, stickers, and corporate branded merchandise — we produce promotional materials that reinforce your brand at every physical touchpoint.',
    longDescription:
      'In a world dominated by digital screens, physical branded materials stand out more than ever. A professionally designed and printed brochure, a well-crafted branded T-shirt, or an impactful billboard creates a tangible brand experience that digital ads simply cannot replicate. iTech Network Africa\'s printing and promotional division handles everything from initial design through production and delivery — ensuring consistency between your digital brand and physical materials. We use professional-grade equipment and premium materials to produce vibrant, durable prints that represent your brand at its very best, on time and within budget.',
    features: [
      'Large format printing (banners, roll-ups, backdrops)',
      'Billboard & outdoor advertising production',
      'T-shirt & apparel printing (screen print, DTG, embroidery)',
      'ID card & badge printing (PVC, laminated)',
      'Stickers, labels & decals',
      'Branded merchandise & corporate gifts',
      'Indoor & outdoor signage',
      'Business cards, letterheads & stationery',
      'Brochures, flyers & promotional leaflets',
      'Event printing packages',
      'Posters & promotional displays',
      'Same-day & rush printing available',
    ],
    benefits: [
      { icon: <Award size={22} />, title: 'Vivid, Long-Lasting Quality', desc: 'Premium inks and substrates that stay sharp, vibrant, and professional even after months of outdoor exposure.' },
      { icon: <Clock size={22} />, title: 'Tight Deadline Delivery', desc: 'Streamlined production workflow with same-day rush options available for time-critical orders.' },
      { icon: <Users size={22} />, title: 'Design-to-Print in One Place', desc: 'Our design team creates your artwork and our print team produces it — no brief lost in translation between multiple vendors.' },
    ],
    stats: [
      { value: '1000+', label: 'Print Jobs Completed', icon: <Printer size={20} /> },
      { value: '24hr', label: 'Rush Turnaround Available', icon: <Clock size={20} /> },
      { value: '100%', label: 'Proofed Before Production', icon: <CheckCircle2 size={20} /> },
    ],
    whoFor: [
      { label: 'Events & Conferences', desc: 'Banners, backdrops, ID badges, lanyards, and branded merchandise for any scale.' },
      { label: 'Businesses & Corporates', desc: 'Stationery, branded gifts, uniforms, and marketing collateral.' },
      { label: 'Schools & Universities', desc: 'Branded apparel, ID cards, academic materials, and campus signage.' },
      { label: 'NGOs & Government', desc: 'Campaign materials, awareness posters, branded vehicles wraps, and staff uniforms.' },
      { label: 'Retail & Hospitality', desc: 'Menu boards, point-of-sale displays, packaging, and branded merchandise.' },
    ],
    process: [
      { step: '01', title: 'Order & Artwork', desc: 'Confirm your specifications and quantities. Submit your artwork or request our design team to create it.' },
      { step: '02', title: 'Proof Approval', desc: 'A digital proof is sent for your review and sign-off before any printing begins — no surprises.' },
      { step: '03', title: 'Professional Production', desc: 'Printed on premium materials using state-of-the-art large-format and specialist printing equipment.' },
      { step: '04', title: 'Quality Check & Delivery', desc: 'Every job is quality-checked before leaving our facility. Delivered to your location on the agreed date.' },
    ],
    faq: [
      { q: 'What file formats do you accept for print-ready artwork?', a: 'We accept PDF (preferred), AI, PSD, and high-resolution PNG/JPG files. Files should be at 300 DPI minimum at the final print size, with 3mm bleed and CMYK colour mode for best results. Our design team can prepare your files if needed.' },
      { q: 'Do you offer design services for print?', a: 'Yes. Our in-house designers can create or adapt artwork for any print job. Design fees are quoted separately and are often bundled with larger print orders.' },
      { q: 'What\'s the minimum order quantity?', a: 'There are no minimum order quantities for most products — we print single copies of banners and ID cards, and as few as 10 pieces for T-shirts. Bulk discounts apply from 50 pieces and above.' },
      { q: 'Can you handle large corporate orders and events?', a: 'Yes. We regularly fulfil large event orders — hundreds of T-shirts, thousands of flyers, full event branding packages — with dedicated project management to ensure everything arrives on time.' },
    ],
    relatedSlugs: ['branding', 'creative-media', 'digital-marketing'],
    tags: ['Large Format', 'T-Shirt Printing', 'ID Cards', 'Signage', 'Branded Merchandise', 'Stickers'],
  },
  {
    slug: 'it-support',
    icon: <Headphones size={36} />,
    accentColor: '#3CB52A',
    title: 'Technical Support',
    tagline: '24/7 remote and on-site IT support that keeps your business running without interruption.',
    description:
      'Our managed IT support service acts as your extended IT department — proactively monitoring your systems, resolving issues fast, and keeping your infrastructure secure and up to date.',
    longDescription:
      'Technology downtime is lost revenue. When staff can\'t access their systems, printers stop working, or the internet goes down — productivity halts and frustration mounts. iTech Network Africa\'s technical support team provides responsive, knowledgeable IT support that resolves issues fast and prevents most problems before users even notice them. Through our managed IT service, we monitor your entire infrastructure 24/7, apply updates proactively, manage your hardware and software assets, and respond to user issues through phone, email, chat, or on-site visit — all backed by a clear Service Level Agreement that holds us accountable. We\'ve eliminated the need for a full-time in-house IT team for dozens of organisations across the region, delivering better coverage at a fraction of the cost.',
    features: [
      '24/7 helpdesk (phone, email & WhatsApp)',
      'Remote IT support & troubleshooting',
      'On-site technical support (offices & facilities)',
      'Proactive system monitoring & alerting',
      'Patch management & software updates',
      'Computer & laptop repair and maintenance',
      'Printer setup, support & repair',
      'Software installation & licence management',
      'IT asset management & inventory',
      'Virus, malware & spyware removal',
      'Data recovery services',
      'End-user training & self-service guides',
    ],
    benefits: [
      { icon: <Clock size={22} />, title: 'SLA-Backed Rapid Response', desc: 'Critical issues acknowledged within 15 minutes, resolved within 1 hour remotely — or an engineer on-site within 4 hours.' },
      { icon: <Shield size={22} />, title: 'Prevention Over Cure', desc: '24/7 proactive monitoring catches and resolves most issues before users are affected — reducing visible incidents by up to 60%.' },
      { icon: <BarChart2 size={22} />, title: 'Predictable IT Costs', desc: 'A single fixed monthly fee replaces unpredictable break-fix bills and eliminates the overhead of full-time in-house IT staff.' },
    ],
    stats: [
      { value: '15min', label: 'Critical Issue Response Time', icon: <Clock size={20} /> },
      { value: '97%', label: 'First-Call Resolution Rate', icon: <Award size={20} /> },
      { value: '60%', label: 'Reduction in User-Reported Incidents', icon: <TrendingUp size={20} /> },
    ],
    whoFor: [
      { label: 'SMEs Without an IT Team', desc: 'Professional IT support at a fraction of the cost of a full-time hire.' },
      { label: 'Businesses with Remote Staff', desc: 'Support across locations via remote access tools and on-site visits.' },
      { label: 'Schools & Educational Institutions', desc: 'Lab maintenance, device management, and teacher IT support.' },
      { label: 'Hospitality & Retail', desc: 'POS systems, Wi-Fi, CCTV, and customer-facing tech — always working.' },
      { label: 'NGOs & Nonprofits', desc: 'Reliable IT support within budget constraints, with transparent pricing.' },
    ],
    process: [
      { step: '01', title: 'IT Environment Audit', desc: 'Full inventory of hardware, software, network, and security posture. We understand your environment before we support it.' },
      { step: '02', title: 'Monitoring Deployment', desc: 'Remote monitoring agents installed on servers, workstations, and network devices for real-time visibility.' },
      { step: '03', title: 'SLA & Onboarding', desc: 'Response times, escalation paths, priority tiers, and reporting cadences agreed and documented in your SLA.' },
      { step: '04', title: 'Ongoing Managed Support', desc: 'Monthly IT reviews, proactive maintenance, capacity planning, and strategic IT advisory included.' },
    ],
    faq: [
      { q: 'What\'s included in the monthly managed IT support plan?', a: 'Monitoring, patch management, helpdesk access (unlimited tickets), regular maintenance, asset management, monthly reports, and an annual IT review — all for a flat monthly fee agreed upfront.' },
      { q: 'How do you provide remote support?', a: 'We use secure remote access tools (with your permission) to see and control devices remotely. Most software issues, configurations, and troubleshooting are resolved this way without an engineer needing to visit.' },
      { q: 'What happens if an issue can\'t be fixed remotely?', a: 'We dispatch a certified engineer to your location. On-site visits are included in managed plans for issues within a defined radius and are quoted transparently for locations further afield.' },
      { q: 'Can you support Mac, Windows, and Linux environments?', a: 'Yes. Our team supports all major operating systems and most business applications across Mac, Windows, and Linux — as well as mobile device management for iOS and Android.' },
    ],
    relatedSlugs: ['networking', 'cybersecurity', 'cloud-services'],
    tags: ['Helpdesk', 'Remote Support', 'ITSM', 'SLA', 'Asset Management', 'Monitoring', 'On-site'],
  },
  {
    slug: 'business-solutions',
    icon: <Package size={36} />,
    accentColor: '#3CB52A',
    title: 'Business Solutions',
    tagline: 'Integrated digital platforms that streamline your operations and delight your customers.',
    description:
      'From document management and e-signature to online payments, booking systems, and customer portals — we deploy and build digital tools that modernise how your business runs.',
    longDescription:
      'Paper-based processes, disconnected systems, and manual workflows are the silent killers of business efficiency. Staff spend hours on tasks that software could handle in seconds. Customers can\'t self-serve, leading to long queues and high support costs. iTech Network Africa\'s business solutions team maps your operational processes and deploys or builds the right combination of digital tools to automate the mundane, digitise the physical, and connect the disconnected. We work with best-in-class platforms like Microsoft 365, DocuSign, Stripe, and custom-built portals — configured to your exact requirements — so your team works smarter and your customers get a frictionless experience.',
    features: [
      'Business email (Microsoft 365, Google Workspace)',
      'Digital document management systems (DMS)',
      'E-signature solutions (DocuSign, custom implementation)',
      'Online payment gateway integration (Stripe, local processors)',
      'Appointment & online booking systems',
      'Customer self-service portal development',
      'Client & vendor portal development',
      'Automated invoice & billing systems',
      'Digital HR & leave management systems',
      'Workflow automation & BPA',
      'CRM integration & pipeline management',
    ],
    benefits: [
      { icon: <Zap size={22} />, title: 'Operational Efficiency Gains', desc: 'Digital workflows eliminate paper-based delays, manual data re-entry, and approval bottlenecks — reducing process cycle times by 50–80%.' },
      { icon: <Users size={22} />, title: 'Self-Service Customer Experience', desc: 'Customer and client portals give your customers 24/7 access to their accounts, documents, and services — reducing your support load.' },
      { icon: <Shield size={22} />, title: 'Compliance & Audit Trails', desc: 'Every action logged, every document versioned, every signature timestamped — meeting regulatory and contractual compliance requirements.' },
    ],
    stats: [
      { value: '80%', label: 'Reduction in Paper Processes', icon: <FileText size={20} /> },
      { value: '3×', label: 'Faster Customer Onboarding', icon: <Zap size={20} /> },
      { value: '50+', label: 'Organisations Digitised', icon: <Package size={20} /> },
    ],
    whoFor: [
      { label: 'Professional Services Firms', desc: 'Law firms, consultancies, and agencies digitising client engagement and document management.' },
      { label: 'Healthcare Providers', desc: 'Patient portals, digital intake forms, appointment booking, and billing automation.' },
      { label: 'Financial Services', desc: 'Digital account opening, loan applications, e-signatures, and online payment collection.' },
      { label: 'Real Estate & Property', desc: 'Tenant portals, digital lease signing, rent payment, and maintenance request systems.' },
      { label: 'Government & Public Services', desc: 'Citizen portals for permit applications, payments, and service delivery.' },
    ],
    process: [
      { step: '01', title: 'Process Mapping', desc: 'Workshop to document your current manual processes and identify digitalisation opportunities with the highest impact.' },
      { step: '02', title: 'Solution Design', desc: 'Recommend and configure the right platform mix — off-the-shelf, custom, or hybrid — for your requirements and budget.' },
      { step: '03', title: 'Implementation & Integration', desc: 'Deploy, customise, and connect solutions to your existing systems with minimal disruption to daily operations.' },
      { step: '04', title: 'Training & Adoption Support', desc: 'Staff training, user documentation, change management support, and go-live hand-holding to ensure high adoption.' },
    ],
    faq: [
      { q: 'Should we buy off-the-shelf software or build custom?', a: 'Off-the-shelf is faster and cheaper for standard processes (email, document management, basic CRM). Custom is better when your process is unique, existing software doesn\'t fit, or you need deep integration with other systems. We recommend the right approach for each use case.' },
      { q: 'Can you integrate new tools with our existing systems?', a: 'Yes. Integration is a core part of every implementation. We connect new platforms to your existing ERP, CRM, website, payment gateway, or government portal using APIs and middleware.' },
      { q: 'How do you handle change management?', a: 'We include user training, process documentation, and change champions in every implementation. Staff resistance to new tools is the most common reason digital projects fail — we address it proactively.' },
      { q: 'What if we outgrow the solution?', a: 'We select and build solutions with scalability in mind. Where you outgrow an off-the-shelf tool, we help you migrate to a custom solution that handles your new scale — often re-using the data and integrations we already built.' },
    ],
    relatedSlugs: ['software-development', 'it-consulting', 'cloud-services'],
    tags: ['Microsoft 365', 'DocuSign', 'Stripe', 'Portal Development', 'DMS', 'Workflow Automation'],
  },
  {
    slug: 'ict-training',
    icon: <BookOpen size={36} />,
    accentColor: '#3CB52A',
    title: 'ICT Training',
    tagline: 'Practical, hands-on technology training that empowers your team to work smarter and more securely.',
    description:
      'From Microsoft Office fundamentals to advanced AI tools, cybersecurity awareness, and enterprise software training — delivered on-site, in-classroom, or remotely.',
    longDescription:
      'The biggest barrier to getting value from technology investment is not the technology itself — it\'s the people using it. Untrained or under-trained staff use software inefficiently, create security vulnerabilities, and resist adopting new tools. iTech Network Africa\'s training division delivers practical, outcome-focused ICT training programmes that build real-world digital skills. We don\'t teach from slides — every session is hands-on, with participants working on real tasks in the actual software they use every day. Our trainers are practising technology professionals, not career educators — they bring current, real-world context to every lesson. Training can be delivered at your premises, in our training centre, or fully online via our virtual classroom platform.',
    features: [
      'Microsoft Office (Word, Excel, PowerPoint, Outlook, Teams)',
      'Google Workspace (Docs, Sheets, Slides, Meet, Drive)',
      'AI tools training (ChatGPT, Copilot, Gemini, productivity AI)',
      'Cybersecurity awareness & phishing prevention',
      'Digital skills foundation programmes',
      'Enterprise software user training (ERP, CRM, custom systems)',
      'Data entry & database management',
      'Social media & digital marketing fundamentals',
      'Basic IT skills & computer literacy',
      'Custom curriculum development for any system',
      'Group sessions (5–50 participants) & one-on-one coaching',
      'Post-training assessment & professional certification',
    ],
    benefits: [
      { icon: <Users size={22} />, title: 'Workforce That Maximises Technology', desc: 'Staff who use tools correctly and confidently get more done in less time — directly measurable in task completion rates.' },
      { icon: <Zap size={22} />, title: 'Faster System Adoption', desc: 'Trained staff adopt new software 60% faster and require 50% less ongoing support than those who self-teach.' },
      { icon: <Shield size={22} />, title: 'Reduced Cybersecurity Risk', desc: 'Security-aware employees are your first line of defence. Trained teams are 70% less likely to fall for phishing attacks.' },
    ],
    stats: [
      { value: '2000+', label: 'Professionals Trained', icon: <Users size={20} /> },
      { value: '95%', label: 'Post-Training Satisfaction Score', icon: <Star size={20} /> },
      { value: '60%', label: 'Faster Software Adoption', icon: <Zap size={20} /> },
    ],
    whoFor: [
      { label: 'Corporate HR & L&D Teams', desc: 'Staff onboarding and continuous professional development programmes.' },
      { label: 'Government Staff & Civil Servants', desc: 'Digital skills and productivity tool training across ministries and agencies.' },
      { label: 'NGO & Development Programme Staff', desc: 'Practical digital skills for programme delivery and impact measurement.' },
      { label: 'Small Business Owners', desc: 'Essential digital tools training to run the business more efficiently.' },
      { label: 'School & University Staff', desc: 'Digital literacy and e-learning tools for educators and administrators.' },
    ],
    process: [
      { step: '01', title: 'Skills Needs Assessment', desc: 'Evaluate current competency levels through surveys, observation, and manager interviews to tailor training to actual gaps — not generic curricula.' },
      { step: '02', title: 'Curriculum & Schedule Design', desc: 'Custom training plan with learning objectives, session schedule, materials, and practical exercises relevant to your team\'s real work.' },
      { step: '03', title: 'Interactive Delivery', desc: 'Hands-on sessions — in your office, at our training centre, or online — with practical exercises, real scenarios, and Q&A.' },
      { step: '04', title: 'Assessment, Certification & Follow-Up', desc: 'Post-training assessments, professional certificates, and a 30-day follow-up check to address questions and reinforce learning.' },
    ],
    faq: [
      { q: 'Can training be delivered at our office?', a: 'Yes. On-site delivery is our most popular option — participants are in their own environment with the actual hardware and software they use daily, which improves retention significantly.' },
      { q: 'What group sizes do you train?', a: 'We work with groups of 5–50 participants in a single session. For larger organisations, we run multiple cohorts. One-on-one executive coaching is also available for senior staff.' },
      { q: 'Do participants receive a certificate?', a: 'Yes. All participants who complete training and pass the post-course assessment receive an iTech Network Africa certificate. We also facilitate accredited certifications from Microsoft, Google, and CompTIA where required.' },
      { q: 'Can you train staff on our custom software?', a: 'Yes — this is one of our most-requested services. If we built your system, training is included. If not, we conduct a brief familiarisation session with your system before developing a custom training curriculum.' },
    ],
    relatedSlugs: ['it-consulting', 'software-development', 'cybersecurity'],
    tags: ['Microsoft Office', 'Google Workspace', 'AI Tools', 'Cybersecurity Awareness', 'Digital Skills', 'Corporate Training'],
  },
];

/* ─── Slug → minimal card info for Related Services ─── */
const RELATED_CARDS: Record<string, { title: string; tagline: string; icon: React.ReactNode }> = {
  'web-development':    { title: 'Web Design & Development', tagline: 'Stunning websites that convert.', icon: <Monitor size={20} /> },
  'software-development': { title: 'Software Development', tagline: 'Custom ERP, CRM & business systems.', icon: <Code size={20} /> },
  'mobile-app-development': { title: 'Mobile App Development', tagline: 'iOS & Android apps users love.', icon: <Smartphone size={20} /> },
  'digital-marketing':  { title: 'Digital Marketing', tagline: 'Grow your audience & generate leads.', icon: <Megaphone size={20} /> },
  'branding':           { title: 'Branding & Graphic Design', tagline: 'Visual identities that command attention.', icon: <PenTool size={20} /> },
  'ui-ux-design':       { title: 'UI/UX Design', tagline: 'Interfaces that drive conversion.', icon: <Layers size={20} /> },
  'cloud-services':     { title: 'Cloud & IT Services', tagline: 'Scalable cloud infrastructure.', icon: <Cloud size={20} /> },
  'cybersecurity':      { title: 'Cybersecurity', tagline: 'Enterprise-grade security protection.', icon: <Shield size={20} /> },
  'networking':         { title: 'Networking & Infrastructure', tagline: 'Networks built for speed & reliability.', icon: <Network size={20} /> },
  'it-consulting':      { title: 'IT Consulting', tagline: 'Strategic technology advisory.', icon: <Briefcase size={20} /> },
  'creative-media':     { title: 'Creative Media', tagline: 'Photography, video & animation.', icon: <Camera size={20} /> },
  'printing-promotional': { title: 'Printing & Promotional', tagline: 'Branded materials that impress.', icon: <Printer size={20} /> },
  'it-support':         { title: 'Technical Support', tagline: '24/7 IT support & helpdesk.', icon: <Headphones size={20} /> },
  'business-solutions': { title: 'Business Solutions', tagline: 'Digital tools that modernise ops.', icon: <Package size={20} /> },
  'ict-training':       { title: 'ICT Training', tagline: 'Hands-on skills your team will use.', icon: <BookOpen size={20} /> },
};

/* ─── FAQ Accordion Item ─── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="border border-[#E5E7EB] rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F8F9FA] transition-colors"
      >
        <span className="font-semibold text-[#111827] text-sm pr-4 leading-snug">{q}</span>
        <span className="shrink-0 w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-[#4B5563] text-sm leading-relaxed border-t border-[#E5E7EB] pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ServiceDetailPage() {
  const [, params] = useRoute('/services/:slug');
  const slug = params?.slug ?? '';
  const service = SERVICE_DETAILS.find((s) => s.slug === slug);
  useSEO({
    title: service ? `${service.title} Services in Liberia & Africa` : 'Service Not Found',
    description: service
      ? service.description.replace(/\s+/g, ' ').slice(0, 155).trimEnd() + (service.description.length > 155 ? '…' : '')
      : 'Professional technology services for businesses in Liberia and West Africa.',
    canonical: `/services/${slug}`,
    noindex: !service,
  });

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center py-40 px-6 text-center bg-white">
        <div className="w-20 h-20 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-6">
          <HelpCircle size={36} className="text-[#9CA3AF]" />
        </div>
        <h1 className="text-3xl font-black text-[#060E18] mb-4">Service Not Found</h1>
        <p className="text-[#6B7280] mb-8 max-w-sm">We couldn't find that service. Browse all our services below.</p>
        <Link href="/services" className="inline-flex items-center gap-2 bg-[#3CB52A] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#2da822] transition-colors">
          View All Services <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white">

      {/* ══ HERO ══ */}
      <section className="relative bg-[#060E18] overflow-hidden" style={{ paddingTop: 'clamp(5.5rem, 10vw, 8rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)', backgroundSize: '52px 52px' }} />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${service.accentColor}18 0%, transparent 70%)` }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-white/35 text-xs mb-8">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white/70 transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white/70">{service.title}</span>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl">
            {/* Icon pill */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border"
              style={{ background: `${service.accentColor}15`, borderColor: `${service.accentColor}35` }}>
              <span style={{ color: service.accentColor }}>{service.icon}</span>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: service.accentColor }}>
                {service.title}
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1}
              className="font-black text-white leading-[1.05] tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              {service.tagline}
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-white/55 text-lg leading-relaxed mb-8 max-w-2xl">
              {service.description}
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 mb-12">
              <Link href="/contact"
                className="inline-flex items-center gap-2 text-white text-sm font-bold px-7 py-3.5 rounded-full transition-all shadow-lg hover:-translate-y-0.5"
                style={{ background: service.accentColor, boxShadow: `0 6px 28px ${service.accentColor}40` }}>
                Get a Free Quote <ArrowRight size={15} />
              </Link>
              <Link href="/services"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 transition-all">
                <ArrowLeft size={14} /> All Services
              </Link>
            </motion.div>

            {/* Stats strip */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-6 lg:gap-10">
              {service.stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${service.accentColor}18` }}>
                    <span style={{ color: service.accentColor }}>{stat.icon}</span>
                  </div>
                  <div>
                    <div className="text-white font-black text-xl leading-none">{stat.value}</div>
                    <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ OVERVIEW ══ */}
      <section className="py-20 lg:py-28 max-w-[1200px] mx-auto px-6 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Left: long description + tags */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
              style={{ color: service.accentColor, background: `${service.accentColor}12` }}>
              Overview
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black text-[#060E18] mb-6 leading-tight">
              What We Deliver
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[#4B5563] text-base leading-relaxed mb-8">
              {service.longDescription}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-[#F3F4F6] text-[#374151] text-xs font-semibold rounded-full">
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: features list */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="rounded-3xl p-8 border"
            style={{ background: `${service.accentColor}06`, borderColor: `${service.accentColor}20` }}>
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${service.accentColor}18` }}>
                <span style={{ color: service.accentColor }}><CheckCircle2 size={20} /></span>
              </div>
              <h3 className="text-xl font-black text-[#060E18]">What's Included</h3>
            </motion.div>
            <ul className="space-y-3">
              {service.features.map((f, i) => (
                <motion.li key={i} custom={i} variants={fadeUp} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: service.accentColor }} />
                  <span className="text-[#374151] text-sm leading-relaxed">{f}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ══ BENEFITS ══ */}
      <section className="py-16 bg-[#060E18]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
              style={{ color: service.accentColor, background: `${service.accentColor}18`, border: `1px solid ${service.accentColor}30` }}>
              Why Choose Us
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black text-white">
              Key Benefits
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-5">
            {service.benefits.map((b, i) => (
              <motion.div key={i} custom={i} variants={fadeUp}
                className="rounded-2xl p-8 border hover:-translate-y-1 transition-all duration-300"
                style={{ background: `${service.accentColor}08`, borderColor: `${service.accentColor}22` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${service.accentColor}20` }}>
                  <span style={{ color: service.accentColor }}>{b.icon}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-3">{b.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ WHO IT'S FOR ══ */}
      <section className="py-20 lg:py-24 bg-[#F8F9FA]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mb-12">
            <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
              style={{ color: service.accentColor, background: `${service.accentColor}12` }}>
              Who It's For
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black text-[#060E18] mb-2">
              Built for Organisations Like Yours
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[#6B7280] max-w-xl text-sm">
              This service is trusted by a wide range of organisations across Africa and beyond.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.whoFor.map((w, i) => (
              <motion.div key={i} custom={i} variants={fadeUp}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#3CB52A]/40 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: service.accentColor }} />
                  <h3 className="font-bold text-[#111827] text-sm">{w.label}</h3>
                </div>
                <p className="text-[#6B7280] text-xs leading-relaxed pl-5">{w.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section className="py-20 lg:py-28 max-w-[1200px] mx-auto px-6 lg:px-12 w-full">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ color: service.accentColor, background: `${service.accentColor}12` }}>
            How We Work
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black text-[#060E18]">
            Our Delivery Process
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-[#6B7280] max-w-md mx-auto text-sm mt-3">
            A structured, proven approach — so you always know what happens next.
          </motion.p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {service.process.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              className="relative bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Step number */}
              <div className="text-[3.5rem] font-black leading-none mb-4 transition-colors duration-300"
                style={{ color: `${service.accentColor}18` }}>
                {p.step}
              </div>
              {/* Connector dot */}
              {i < service.process.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center shadow"
                  style={{ background: service.accentColor }}>
                  <ArrowRight size={11} className="text-white" />
                </div>
              )}
              <h3 className="text-base font-bold text-[#111827] mb-2">{p.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="py-16 lg:py-24 bg-[#F8F9FA]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
            {/* Left */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
                style={{ color: service.accentColor, background: `${service.accentColor}12` }}>
                <MessageSquare size={12} /> FAQ
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-black text-[#060E18] mb-4">
                Common Questions
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-[#6B7280] text-sm leading-relaxed mb-6">
                Can't find what you're looking for? Our team is happy to answer any questions about this service.
              </motion.p>
              <motion.div variants={fadeUp} custom={3}>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl transition-all"
                  style={{ background: service.accentColor, color: '#fff' }}>
                  Ask Us Anything <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: FAQ items */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="space-y-3">
              {service.faq.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} index={i} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ RELATED SERVICES ══ */}
      {service.relatedSlugs.length > 0 && (
        <section className="py-16 lg:py-20 max-w-[1200px] mx-auto px-6 lg:px-12 w-full">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mb-10">
            <motion.span variants={fadeUp} className="inline-block text-[#3CB52A] text-xs font-bold tracking-widest uppercase mb-4 bg-[#f0fdf4] px-4 py-1.5 rounded-full">
              Related Services
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl font-black text-[#060E18]">
              You May Also Need
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-3 gap-5">
            {service.relatedSlugs.map((relSlug, i) => {
              const rel = RELATED_CARDS[relSlug];
              if (!rel) return null;
              return (
                <motion.div key={relSlug} custom={i} variants={fadeUp}>
                  <Link href={`/services/${relSlug}`}
                    className="group flex flex-col bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#3CB52A]/50 hover:shadow-lg transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] group-hover:bg-[#3CB52A]/10 flex items-center justify-center mb-4 transition-colors">
                      <span className="text-[#6B7280] group-hover:text-[#3CB52A] transition-colors">{rel.icon}</span>
                    </div>
                    <h3 className="font-bold text-[#111827] text-sm mb-1">{rel.title}</h3>
                    <p className="text-[#6B7280] text-xs leading-relaxed flex-1">{rel.tagline}</p>
                    <div className="flex items-center gap-1.5 text-[#3CB52A] text-xs font-bold mt-4 group-hover:gap-2.5 transition-all">
                      Learn more <ArrowRight size={12} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* ══ CTA ══ */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ background: '#060E18' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #3CB52A 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-[600px]"
          style={{ background: `linear-gradient(90deg, transparent, ${service.accentColor}50, transparent)` }} />

        <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest uppercase mb-5 px-4 py-1.5 rounded-full"
              style={{ color: service.accentColor, background: `${service.accentColor}18`, border: `1px solid ${service.accentColor}30` }}>
              Get Started Today
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
              Ready to get started with<br />{service.title}?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Let's discuss your requirements and build a solution that delivers real, measurable results for your organisation.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact"
                className="inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-2xl transition-all text-sm hover:-translate-y-0.5"
                style={{ background: service.accentColor, boxShadow: `0 8px 28px ${service.accentColor}40` }}>
                Get a Free Quote <ArrowRight size={16} />
              </Link>
              <Link href="/consultation"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/5 hover:border-white/40 transition-colors text-sm">
                Book a Consultation <ArrowRight size={14} />
              </Link>
              <Link href="/services"
                className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors flex items-center gap-1.5">
                <ArrowLeft size={13} /> All Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

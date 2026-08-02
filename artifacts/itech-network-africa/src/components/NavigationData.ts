export interface NavChild {
  label: string;
  href: string;
  isNew?: boolean;
}

export interface NavCategory {
  title: string;
  href: string;
  items: NavChild[];
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  /** Show a NEW badge next to the label */
  isNew?: boolean;
  /** Simple dropdown list */
  children: NavChild[];
  /** Multi-column mega-menu (Services) */
  categories?: NavCategory[];
}

export const navigationData: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    children: [
      { label: 'Home', href: '/' },
      { label: 'Our Process', href: '/#process' },
      { label: 'Why Choose Us', href: '/#why-choose-us' },
      { label: 'Testimonials', href: '/#testimonials' },
      { label: 'Get Started', href: '/#get-started' },
    ],
  },

  {
    id: 'about',
    label: 'About Us',
    href: '/about',
    isNew: true,
    children: [
      { label: 'Our Story', href: '/about#our-story' },
      { label: 'Mission & Vision', href: '/about#mission-vision' },
      { label: 'Our Team', href: '/about#our-team' },
      { label: 'Leadership', href: '/about#leadership' },
      { label: 'Our Values', href: '/about#our-values' },
      { label: 'Company Profile', href: '/about#company-profile' },
      { label: 'Partners', href: '/about#partners' },
      { label: 'Clients', href: '/about#clients' },
      { label: 'Careers', href: '/careers', isNew: true },
      { label: 'Corporate Social Responsibility', href: '/about#csr' },
    ],
  },

  {
    id: 'services',
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Web Design & Development', href: '/services#web-design' },
      { label: 'Software Development', href: '/services#software' },
      { label: 'Mobile App Development', href: '/services#mobile' },
      { label: 'IT Services', href: '/services#it-consulting' },
      { label: 'Cybersecurity', href: '/services#cybersecurity' },
      { label: 'Cloud Services', href: '/services#cloud' },
      { label: 'Hosting & Domains', href: '/services#cloud' },
      { label: 'Digital Marketing', href: '/services#digital-marketing' },
      { label: 'Branding & Creative', href: '/services#branding' },
      { label: 'Multimedia', href: '/services#multimedia' },
      { label: 'Printing Services', href: '/services#printing' },
      { label: 'Business Solutions', href: '/services#business' },
      { label: 'ICT Training', href: '/services#training' },
    ],
    categories: [
      {
        title: 'Web Design & Development',
        href: '/services#web-design',
        items: [
          { label: 'Business Websites', href: '/services#web-design' },
          { label: 'Corporate Websites', href: '/services#web-design' },
          { label: 'E-commerce Websites', href: '/services#web-design' },
          { label: 'School Websites', href: '/services#web-design' },
          { label: 'NGO Websites', href: '/services#web-design' },
          { label: 'Church Websites', href: '/services#web-design' },
          { label: 'Government Websites', href: '/services#web-design' },
          { label: 'Portfolio Websites', href: '/services#web-design' },
          { label: 'Landing Pages', href: '/services#web-design' },
          { label: 'Website Redesign', href: '/services#web-design' },
          { label: 'Website Maintenance', href: '/services#web-design' },
          { label: 'CMS Development', href: '/services#web-design' },
        ],
      },
      {
        title: 'Software Development',
        href: '/services#software',
        items: [
          { label: 'Custom Software', href: '/services#software' },
          { label: 'ERP Systems', href: '/services#software' },
          { label: 'CRM Systems', href: '/services#software' },
          { label: 'HR & Payroll Systems', href: '/services#software' },
          { label: 'Inventory Management', href: '/services#software' },
          { label: 'School Management Systems', href: '/services#software' },
          { label: 'Hospital Management Systems', href: '/services#software' },
          { label: 'POS Systems', href: '/services#software' },
          { label: 'Booking Systems', href: '/services#software' },
          { label: 'API Development', href: '/services#software' },
          { label: 'Software Maintenance', href: '/services#software' },
        ],
      },
      {
        title: 'Mobile App Development',
        href: '/services#mobile',
        items: [
          { label: 'Android Apps', href: '/services#mobile' },
          { label: 'iOS Apps', href: '/services#mobile' },
          { label: 'Cross-Platform Apps', href: '/services#mobile' },
          { label: 'Business Apps', href: '/services#mobile' },
          { label: 'E-commerce Apps', href: '/services#mobile' },
          { label: 'App Maintenance', href: '/services#mobile' },
        ],
      },
      {
        title: 'IT Services',
        href: '/services#it-services',
        items: [
          { label: 'IT Consulting', href: '/services#it-services' },
          { label: 'Managed IT Services', href: '/services#it-services' },
          { label: 'IT Support', href: '/services#it-services' },
          { label: 'Network Installation', href: '/services#it-services' },
          { label: 'Server Installation', href: '/services#it-services' },
          { label: 'Computer Repairs', href: '/services#it-services' },
          { label: 'Laptop Repairs', href: '/services#it-services' },
          { label: 'Hardware Upgrades', href: '/services#it-services' },
          { label: 'Software Installation', href: '/services#it-services' },
          { label: 'Remote Support', href: '/services#it-services' },
        ],
      },
      {
        title: 'Cybersecurity',
        href: '/services#cybersecurity',
        items: [
          { label: 'Security Audits', href: '/services#cybersecurity' },
          { label: 'Penetration Testing', href: '/services#cybersecurity' },
          { label: 'Firewall Configuration', href: '/services#cybersecurity' },
          { label: 'Endpoint Protection', href: '/services#cybersecurity' },
          { label: 'Email Security', href: '/services#cybersecurity' },
          { label: 'Data Protection', href: '/services#cybersecurity' },
          { label: 'Risk Assessment', href: '/services#cybersecurity' },
          { label: 'Security Awareness Training', href: '/services#cybersecurity' },
          { label: 'Incident Response', href: '/services#cybersecurity' },
        ],
      },
      {
        title: 'Cloud Services',
        href: '/services#cloud',
        items: [
          { label: 'Microsoft 365', href: '/services#cloud' },
          { label: 'Google Workspace', href: '/services#cloud' },
          { label: 'Cloud Migration', href: '/services#cloud' },
          { label: 'Cloud Backup', href: '/services#cloud' },
          { label: 'Cloud Storage', href: '/services#cloud' },
          { label: 'Virtual Servers', href: '/services#cloud' },
          { label: 'Cloud Infrastructure', href: '/services#cloud' },
        ],
      },
      {
        title: 'Hosting & Domains',
        href: '/services#hosting',
        items: [
          { label: 'Domain Registration', href: '/services#hosting' },
          { label: 'Shared Hosting', href: '/services#hosting' },
          { label: 'VPS Hosting', href: '/services#hosting' },
          { label: 'Dedicated Servers', href: '/services#hosting' },
          { label: 'SSL Certificates', href: '/services#hosting' },
          { label: 'Business Email Hosting', href: '/services#hosting' },
          { label: 'DNS Management', href: '/services#hosting' },
        ],
      },
      {
        title: 'Digital Marketing',
        href: '/services#digital-marketing',
        items: [
          { label: 'SEO', href: '/services#digital-marketing' },
          { label: 'Google Ads', href: '/services#digital-marketing' },
          { label: 'Facebook Ads', href: '/services#digital-marketing' },
          { label: 'Social Media Marketing', href: '/services#digital-marketing' },
          { label: 'Social Media Management', href: '/services#digital-marketing' },
          { label: 'Email Marketing', href: '/services#digital-marketing' },
          { label: 'SMS Marketing', href: '/services#digital-marketing' },
          { label: 'Content Marketing', href: '/services#digital-marketing' },
          { label: 'Video Marketing', href: '/services#digital-marketing' },
          { label: 'Online Reputation Management', href: '/services#digital-marketing' },
        ],
      },
      {
        title: 'Branding & Creative',
        href: '/services#branding',
        items: [
          { label: 'Logo Design', href: '/services#branding' },
          { label: 'Brand Identity', href: '/services#branding' },
          { label: 'Graphic Design', href: '/services#branding' },
          { label: 'UI/UX Design', href: '/services#branding' },
          { label: 'Company Profiles', href: '/services#branding' },
          { label: 'Business Cards', href: '/services#branding' },
          { label: 'Flyers & Brochures', href: '/services#branding' },
          { label: 'Packaging Design', href: '/services#branding' },
          { label: 'Motion Graphics', href: '/services#branding' },
        ],
      },
      {
        title: 'Multimedia',
        href: '/services#multimedia',
        items: [
          { label: 'Photography', href: '/services#multimedia' },
          { label: 'Videography', href: '/services#multimedia' },
          { label: 'Video Editing', href: '/services#multimedia' },
          { label: 'Animation', href: '/services#multimedia' },
          { label: 'Live Streaming', href: '/services#multimedia' },
          { label: 'Podcast Production', href: '/services#multimedia' },
        ],
      },
      {
        title: 'Printing Services',
        href: '/services#printing',
        items: [
          { label: 'Business Cards', href: '/services#printing' },
          { label: 'Flyers', href: '/services#printing' },
          { label: 'Brochures', href: '/services#printing' },
          { label: 'Posters', href: '/services#printing' },
          { label: 'Roll-Up Banners', href: '/services#printing' },
          { label: 'Stickers', href: '/services#printing' },
          { label: 'Branded Merchandise', href: '/services#printing' },
          { label: 'Corporate Stationery', href: '/services#printing' },
        ],
      },
      {
        title: 'Business Solutions',
        href: '/services#business',
        items: [
          { label: 'Business Email Setup', href: '/services#business' },
          { label: 'Digital Transformation', href: '/services#business' },
          { label: 'Business Automation', href: '/services#business' },
          { label: 'Document Management', href: '/services#business' },
          { label: 'Workflow Automation', href: '/services#business' },
          { label: 'Payment Gateway Integration', href: '/services#business' },
          { label: 'E-commerce Solutions', href: '/services#business' },
          { label: 'ICT Project Management', href: '/services#business' },
        ],
      },
      {
        title: 'ICT Training',
        href: '/services#training',
        items: [
          { label: 'Computer Basics', href: '/services#training' },
          { label: 'Microsoft Office', href: '/services#training' },
          { label: 'Web Development', href: '/services#training' },
          { label: 'Graphic Design', href: '/services#training' },
          { label: 'Digital Marketing', href: '/services#training' },
          { label: 'Cybersecurity Training', href: '/services#training' },
          { label: 'Coding Bootcamps', href: '/services#training' },
          { label: 'AI Productivity Tools', href: '/services#training' },
          { label: 'Corporate ICT Training', href: '/services#training' },
        ],
      },
    ],
  },

  {
    id: 'solutions',
    label: 'Solutions',
    href: '/solutions',
    children: [
      { label: 'Education', href: '/solutions#education' },
      { label: 'Healthcare', href: '/solutions#healthcare' },
      { label: 'NGOs', href: '/solutions#ngos' },
      { label: 'Government', href: '/solutions#government' },
      { label: 'Small Businesses', href: '/solutions#small-businesses' },
      { label: 'Financial Services', href: '/solutions#financial' },
      { label: 'Retail', href: '/solutions#retail' },
      { label: 'Hospitality', href: '/solutions#hospitality' },
      { label: 'Agriculture', href: '/solutions#agriculture' },
      { label: 'Manufacturing', href: '/solutions#manufacturing' },
      { label: 'Churches & Ministries', href: '/solutions#churches' },
      { label: 'Startups', href: '/solutions#startups' },
    ],
  },

  {
    id: 'portfolio',
    label: 'Portfolio',
    href: '/portfolio',
    children: [
      { label: 'Featured Projects', href: '/portfolio#featured' },
      { label: 'Websites', href: '/portfolio#websites' },
      { label: 'Mobile Apps', href: '/portfolio#mobile-apps' },
      { label: 'Software', href: '/portfolio#software' },
      { label: 'Branding', href: '/portfolio#branding' },
      { label: 'Digital Marketing', href: '/portfolio#digital-marketing' },
      { label: 'Case Studies', href: '/portfolio#case-studies' },
      { label: 'Client Testimonials', href: '/portfolio#testimonials' },
    ],
  },

  {
    id: 'products',
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Website Packages', href: '/products#websites' },
      { label: 'Hosting Packages', href: '/products#hosting' },
      { label: 'Business Email Packages', href: '/products#email' },
      { label: 'POS Systems', href: '/products#pos' },
      { label: 'School Management System', href: '/products#school' },
      { label: 'Inventory Software', href: '/products#inventory' },
      { label: 'CRM Software', href: '/products' },
      { label: 'Digital Products', href: '/products' },
    ],
  },

  {
    id: 'resources',
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'News', href: '/news' },
      { label: 'Tutorials', href: '/resources#tutorials' },
      { label: 'Downloads', href: '/resources' },
      { label: 'FAQs', href: '/support#knowledge-base' },
      { label: 'Documentation', href: '/resources#docs' },
      { label: 'White Papers', href: '/resources' },
      { label: 'Success Stories', href: '/portfolio' },
    ],
  },

  {
    id: 'support',
    label: 'Support',
    href: '/support',
    isNew: true,
    children: [
      { label: 'Help Centre', href: '/support#help' },
      { label: 'Knowledge Base', href: '/support#knowledge-base' },
      { label: 'Submit a Ticket', href: '/support#ticket' },
      { label: 'Remote Support', href: '/support#help' },
      { label: 'Maintenance Plans', href: '/support#maintenance' },
      { label: 'Service Status', href: '/support#status' },
      { label: 'Downloads', href: '/resources' },
      { label: 'Contact Support', href: '/contact' },
    ],
  },

  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
    children: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Request a Quote', href: '/contact#quote' },
      { label: 'Book a Consultation', href: '/contact#quote' },
      { label: 'Office Locations', href: '/contact#locations' },
      { label: 'Careers', href: '/careers' },
      { label: 'Partner With Us', href: '/partners' },
    ],
  },

  {
    id: 'portal',
    label: 'Client Portal',
    href: '/portal',
    isNew: true,
    children: [
      { label: 'Login', href: '/portal' },
      { label: 'Dashboard', href: '/portal#dashboard' },
      { label: 'My Projects', href: '/portal#projects' },
      { label: 'Invoices', href: '/portal#invoices' },
      { label: 'Support Tickets', href: '/portal#tickets' },
      { label: 'Downloads', href: '/portal#downloads' },
    ],
  },

  {
    id: 'legal',
    label: 'Legal',
    href: '/privacy-policy',
    children: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Refund Policy', href: '/refund-policy' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
];

/** Primary items shown in the desktop nav bar */
export const primaryNavIds = [
  'home', 'about', 'services', 'solutions', 'portfolio', 'products', 'resources', 'support', 'contact',
];

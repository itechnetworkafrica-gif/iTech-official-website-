export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPackage {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

export interface PricingCategory {
  id: string;
  label: string;
  packages: PricingPackage[];
}

export const pricingCategories: PricingCategory[] = [
  {
    id: 'website-design',
    label: 'Website Design',
    packages: [
      {
        name: 'Starter Website',
        price: '$350',
        description: 'Perfect for small businesses launching their first professional web presence.',
        features: [
          'Up to 5 Pages',
          'Custom Responsive Design',
          'Mobile Friendly',
          'Contact Form',
          'Basic SEO',
          'SSL Configuration',
          'Social Media Integration',
          'Google Maps',
          'Speed Optimization',
          '30 Days Support',
        ],
        cta: 'Get Started',
      },
      {
        name: 'Business Website',
        price: '$750',
        description: 'For growing businesses that need a powerful online presence with advanced features.',
        features: [
          'Up to 12 Pages',
          'Premium Design',
          'CMS',
          'Blog',
          'Advanced Forms',
          'On-page SEO',
          'Google Analytics',
          'WhatsApp Chat',
          'Speed Optimization',
          'Security',
          '60 Days Support',
        ],
        popular: true,
        cta: 'Get Started',
      },
      {
        name: 'Professional Website',
        price: '$1,500',
        description: 'Feature-rich solution for established organizations with complex needs.',
        features: [
          'Up to 25 Pages',
          'Premium UI/UX',
          'Advanced CMS',
          'Client Portal',
          'News System',
          'Gallery',
          'Staff Management',
          'Advanced SEO',
          'Security',
          'Admin Training',
          '90 Days Support',
        ],
        cta: 'Get Started',
      },
      {
        name: 'Enterprise',
        price: 'Starting at $3,000',
        description: 'Fully custom web applications for large-scale organizations and enterprises.',
        features: [
          'Unlimited Pages',
          'Custom Web App',
          'API Integrations',
          'Membership Portal',
          'Client Dashboard',
          'Payment Gateway',
          'Advanced Security',
          'Dedicated Manager',
          'Priority Support',
        ],
        cta: 'Contact Sales',
      },
    ],
  },
  {
    id: 'web-hosting',
    label: 'Web Hosting',
    packages: [
      {
        name: 'Starter Hosting',
        price: '$120',
        period: '/year',
        description: 'Reliable hosting for single websites with essential features included.',
        features: [
          '1 Website',
          '10GB SSD',
          'SSL',
          'Daily Backup',
          '5 Business Emails',
          'Malware Protection',
          'Email Support',
        ],
        cta: 'Get Started',
      },
      {
        name: 'Business Hosting',
        price: '$250',
        period: '/year',
        description: 'Ideal for agencies and growing businesses hosting multiple sites.',
        features: [
          'Up to 5 Websites',
          '50GB SSD',
          'SSL',
          'Daily Backup',
          '20 Business Emails',
          'Migration',
          'Security',
          'Priority Support',
        ],
        popular: true,
        cta: 'Get Started',
      },
      {
        name: 'Professional Hosting',
        price: '$450',
        period: '/year',
        description: 'High-performance hosting with unlimited bandwidth and advanced security.',
        features: [
          'Up to 10 Websites',
          '100GB SSD',
          'Unlimited Bandwidth',
          'SSL',
          'Daily Backup',
          '50 Emails',
          'Firewall',
          'Performance Monitoring',
        ],
        cta: 'Get Started',
      },
      {
        name: 'Enterprise Hosting',
        price: 'Starting at $800',
        period: '/year',
        description: 'Cloud-grade infrastructure with dedicated support for mission-critical applications.',
        features: [
          'Cloud Infrastructure',
          'Unlimited SSL',
          'Disaster Recovery',
          'Dedicated Support',
          'Performance Monitoring',
          'Custom Configuration',
        ],
        cta: 'Contact Sales',
      },
    ],
  },
  {
    id: 'digital-marketing',
    label: 'Digital Marketing',
    packages: [
      {
        name: 'Starter',
        price: '$150',
        period: '/month',
        description: 'Get your brand online with consistent social media presence.',
        features: [
          '2 Social Accounts',
          '8 Posts per Month',
          'Graphics',
          'Scheduling',
          'Monthly Report',
        ],
        cta: 'Get Started',
      },
      {
        name: 'Business',
        price: '$350',
        period: '/month',
        description: 'Grow your audience and drive leads with multi-platform campaigns.',
        features: [
          '4 Social Accounts',
          '16 Posts per Month',
          'Professional Graphics',
          'Ads Management',
          'Analytics',
          'Priority Support',
        ],
        popular: true,
        cta: 'Get Started',
      },
      {
        name: 'Professional',
        price: '$700',
        period: '/month',
        description: 'Full-funnel digital marketing with content, SEO, and lead generation.',
        features: [
          '6 Social Accounts',
          '30 Posts per Month',
          'Reels & Video Content',
          'SEO Content',
          'Lead Generation',
          'Google Business',
        ],
        cta: 'Get Started',
      },
      {
        name: 'Enterprise',
        price: 'Starting at $1,500',
        period: '/month',
        description: 'Comprehensive multi-channel marketing with a dedicated team.',
        features: [
          'Unlimited Campaigns',
          'Multi-platform',
          'Email Marketing',
          'SEO',
          'Dedicated Team',
        ],
        cta: 'Contact Sales',
      },
    ],
  },
  {
    id: 'it-consultancy',
    label: 'IT Consultancy',
    packages: [
      {
        name: 'Starter',
        price: '$100',
        period: '/session',
        description: 'One-hour expert consultation to assess your IT needs and next steps.',
        features: [
          '1 Hour Consultation',
          'IT Assessment',
          'Recommendations',
          'Cybersecurity Advice',
        ],
        cta: 'Book Session',
      },
      {
        name: 'Business',
        price: '$500',
        period: '/project',
        description: 'Comprehensive IT strategy and infrastructure review for growing businesses.',
        features: [
          'IT Strategy',
          'Infrastructure Review',
          'Cloud Consulting',
          'Cybersecurity',
          'Digital Transformation',
        ],
        popular: true,
        cta: 'Get Started',
      },
      {
        name: 'Professional',
        price: '$1,500',
        period: '/project',
        description: 'Deep-dive audit and planning for organizations ready to scale.',
        features: [
          'Full IT Audit',
          'Network Review',
          'Cloud Planning',
          'Disaster Recovery',
          'Staff Training',
        ],
        cta: 'Get Started',
      },
      {
        name: 'Enterprise',
        price: 'Starting at $3,000',
        period: '/project',
        description: 'End-to-end enterprise consulting with governance, cloud architecture, and security strategy.',
        features: [
          'Enterprise Consulting',
          'IT Governance',
          'Cloud Architecture',
          'Cybersecurity Strategy',
          'Dedicated Consultant',
        ],
        cta: 'Contact Sales',
      },
    ],
  },
  {
    id: 'graphic-design',
    label: 'Graphic Design',
    packages: [
      {
        name: 'Starter',
        price: '$100',
        description: 'Professional single-design package — flyers, social posts, or banners.',
        features: [
          '1 Design',
          'Flyer or Social Post',
          'High Resolution',
          '2 Revisions',
        ],
        cta: 'Get Started',
      },
      {
        name: 'Business',
        price: '$300',
        description: 'A versatile design bundle for active brands that need consistent visuals.',
        features: [
          '5 Designs',
          'Flyers',
          'Posters',
          'Banners',
          'Priority Support',
        ],
        popular: true,
        cta: 'Get Started',
      },
      {
        name: 'Brand Identity',
        price: '$750',
        description: 'Complete brand identity package to make your business unforgettable.',
        features: [
          'Logo Design',
          'Business Card',
          'Letterhead',
          'Brand Guide',
          'Social Covers',
        ],
        cta: 'Get Started',
      },
      {
        name: 'Enterprise',
        price: 'Starting at $1,500',
        description: 'Full-scale branding and campaign graphics with a dedicated designer.',
        features: [
          'Complete Branding',
          'Campaign Graphics',
          'Presentation Design',
          'Dedicated Designer',
        ],
        cta: 'Contact Sales',
      },
    ],
  },
];

export const paymentTerms = [
  { icon: 'split', text: 'Website projects require 50% upfront and 50% before launch.' },
  { icon: 'shield', text: 'Hosting packages require full payment before activation or renewal.' },
  { icon: 'calendar', text: 'Monthly services are billed in advance.' },
  { icon: 'megaphone', text: 'Advertising budgets are not included in Digital Marketing packages.' },
  { icon: 'wallet', text: 'We accept Mobile Money and Bank Transfer.' },
];

export const faqs = [
  {
    q: 'How long does a website take?',
    a: 'A standard business website typically takes 2–4 weeks from kickoff to launch, depending on complexity and how quickly content is provided. Enterprise projects may take 6–12 weeks.',
  },
  {
    q: 'Do you redesign existing websites?',
    a: 'Absolutely. We specialize in redesigning and modernizing existing websites. We can work with your current domain, content, and branding, or start fresh — whichever serves your goals best.',
  },
  {
    q: 'Can I upgrade my package later?',
    a: 'Yes. All our packages are designed to scale. You can upgrade to a higher tier at any time and we will apply a prorated credit toward your new plan.',
  },
  {
    q: 'Do you offer payment plans?',
    a: 'For larger projects, we offer structured payment plans — typically 50% upfront and 50% before delivery. Contact us to discuss a plan that works for your budget.',
  },
  {
    q: 'Do you provide web hosting?',
    a: 'Yes. We offer our own managed hosting packages (see the Web Hosting tab above) and can also manage hosting on your preferred provider.',
  },
  {
    q: 'Can you manage my website after launch?',
    a: 'Yes. We offer ongoing maintenance and management plans that include updates, backups, security monitoring, and content changes on a retainer basis.',
  },
  {
    q: 'Do you offer ongoing support?',
    a: 'Every package includes a support period after launch. For continued support beyond that, we offer monthly retainer plans tailored to your needs.',
  },
];

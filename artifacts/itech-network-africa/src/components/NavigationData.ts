export interface NavigationItem {
  id: string;
  label: string;
  emoji?: string;
  href: string;
  children: string[];
}

export const navigationData: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    emoji: "🏠",
    href: "/",
    children: ["Home", "Why Choose Us", "Featured Services", "Latest Updates"],
  },
  {
    id: "about",
    label: "About Us",
    emoji: "🏢",
    href: "/about",
    children: ["Company Overview", "Our Story", "Vision", "Mission", "Core Values", "Leadership Team", "Careers"],
  },
  {
    id: "services",
    label: "Services",
    emoji: "💻",
    href: "/services",
    children: [
      "Web Development", "Website Design", "Mobile App Development", 
      "Software Development", "UI/UX Design", "Graphic Design", 
      "Branding", "Cloud Services", "API Development", 
      "Database Development", "Business Automation", "IT Support", 
      "Cybersecurity", "Networking", "CCTV Installation", 
      "Domain Registration", "Web Hosting", "Email Hosting"
    ],
  },
  {
    id: "ai-solutions",
    label: "AI Solutions",
    emoji: "🤖",
    href: "/ai-solutions",
    children: ["AI Chatbots", "AI Business Automation", "AI Assistants", "Machine Learning", "Computer Vision", "Predictive Analytics"],
  },
  {
    id: "solutions",
    label: "Solutions",
    emoji: "📂",
    href: "/solutions",
    children: ["POS Systems", "ERP Solutions", "CRM Systems", "HR Management", "School Management", "Hospital Management", "Church Management", "Inventory Management"],
  },
  {
    id: "products",
    label: "Products",
    emoji: "🛍",
    href: "/products",
    children: ["Software Products", "Cloud Products", "Mobile Apps", "Enterprise Platforms"],
  },
  {
    id: "portfolio",
    label: "Portfolio",
    emoji: "📁",
    href: "/portfolio",
    children: ["Projects", "Case Studies", "Success Stories"],
  },
  {
    id: "blog",
    label: "Blog",
    emoji: "📰",
    href: "/blog",
    children: ["News", "Articles", "Tutorials", "Technology Updates"],
  },
  {
    id: "partners",
    label: "Partners",
    emoji: "🤝",
    href: "/partners",
    children: ["Technology Partners", "Become a Partner", "Strategic Alliances"],
  },
  {
    id: "contact",
    label: "Contact",
    emoji: "📞",
    href: "/contact",
    children: ["Contact Us", "Office Locations", "Support", "Request a Quote"],
  },
  {
    id: "account",
    label: "Account",
    emoji: "👤",
    href: "/account",
    children: ["Login", "Register", "Dashboard", "Profile", "Settings", "Logout"],
  },
];

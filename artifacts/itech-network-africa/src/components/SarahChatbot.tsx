import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  X, Send, MessageCircle, Sparkles, Headset, Mail, Ticket, Phone, ArrowRight,
  Home, MessagesSquare, HelpCircle, Newspaper, Search, BookOpen, ChevronDown,
  ArrowLeft, ExternalLink, Clock, PhoneCall, Headphones,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { apiUrl } from '@/lib/apiBase';

interface Message {
  role: 'user' | 'assistant' | 'agent' | 'system';
  content: string;
  handoff?: boolean;    // show human-agent routing card under this message
  senderName?: string;  // display name for live-agent messages
  warning?: boolean;    // amber-styled system message (e.g. respectful-language reminder)
}

/* ─── Respectful-language guard ───
   Light-weight client-side check that catches clearly offensive
   language before it is sent, and responds with a friendly reminder. */
const OFFENSIVE_PATTERNS: RegExp[] = [
  /\b(f+u+c*k+\w*|s+h+i+t+\w*|b+i+t+c+h+\w*|a+s+s+h+o+l+e+\w*|bastard\w*|d+i+c+k+h+e+a+d+|c+u+n+t+\w*|motherf\w*|dumbass|jackass|dickhead|wanker|slut\w*|whore\w*|n+i+g+g+(a|e+r)\w*|fag+ot*\w*|retard\w*)\b/i,
  /\b(stupid|idiot|useless|dumb)\s+(bot|ai|assistant|chatbot|thing|website|company|people|team)\b/i,
  /\b(kill|hurt|attack)\s+(you|yourself|myself)\b/i,
];

function isOffensive(text: string): boolean {
  return OFFENSIVE_PATTERNS.some(re => re.test(text));
}

const WARNING_MESSAGES = [
  "Let's keep our conversation friendly and respectful. I'm here to help — could you rephrase that for me?",
  "I understand things can be frustrating! I really do want to help — let's keep the language respectful so I can do my best for you.",
  "I'm unable to respond to messages with offensive language. If something's gone wrong, I'd love to make it right — just tell me what happened in your own words, or ask to speak with our team.",
];

interface LiveSession {
  sessionId: string;
  token: string;
  status: 'waiting' | 'active' | 'closed';
  agentName: string | null;
}

/* ─────────────────────────────────────────────
   PER-PAGE CONTEXTUAL PROMPTS
   ───────────────────────────────────────────── */
interface PagePrompt {
  banner: string;   // text shown in the floating banner / popup
  greeting: string; // first assistant message when chat opens
  chips: string[];  // quick-reply suggestion chips
}

const PAGE_PROMPTS: Record<string, PagePrompt> = {
  '/': {
    banner: "Hi! I'm Gotecx AI — can I help you find something today?",
    greeting: "Hi there! I'm **Gotecx AI**, your 24/7 assistant at **iTech Network Africa**. I can help you explore our services, get pricing info, book a consultation, or answer any question. What would you like to know?",
    chips: ['What services do you offer?', 'How can I get a quote?', 'Tell me about iTech'],
  },
  '/services': {
    banner: "Exploring our services? I can walk you through each one.",
    greeting: "Great timing! You're browsing our services. We offer everything from **Web Development** and **Mobile Apps** to **Cybersecurity**, **Cloud Services**, and **AI Solutions**. Which area interests you most?",
    chips: ['Web & Mobile development', 'Cloud & Cybersecurity', 'AI Solutions'],
  },
  '/about': {
    banner: "Want to know more about our story or team?",
    greeting: "Happy to tell you more about **iTech Network Africa**! We're a full-service technology company serving businesses across Africa. What would you like to know?",
    chips: ["What's your company story?", 'Where are you based?', 'Meet the team'],
  },
  '/ai-solutions': {
    banner: "Curious about our AI solutions? Let me show you.",
    greeting: "You're in the right place! Our **AI Solutions** team builds intelligent systems — chatbots, automation, data analytics, and custom AI tools. What problem are you trying to solve?",
    chips: ['AI chatbots for my business', 'Business process automation', 'Data analytics & insights'],
  },
  '/solutions': {
    banner: "Looking for the right solution? I can help you find it.",
    greeting: "Let's find the perfect solution for you! We design end-to-end technology solutions for businesses of all sizes. What challenge are you looking to solve?",
    chips: ['Digital transformation', 'Custom software', 'IT infrastructure'],
  },
  '/products': {
    banner: "Browsing our products? Need help finding the right fit?",
    greeting: "Welcome to our products page! I can help you understand each product or connect you with our sales team for a demo. What are you looking for?",
    chips: ['Tell me about your products', 'Get a product demo', 'Pricing information'],
  },
  '/portfolio': {
    banner: "Impressed by our work? Ask me about similar projects.",
    greeting: "Glad you're checking out our portfolio! We've delivered incredible projects across many industries. Want to see work in a specific area?",
    chips: ['Web development projects', 'Mobile app projects', 'Start a similar project'],
  },
  '/projects': {
    banner: "See something you like? I can connect you with our team.",
    greeting: "Our project showcase highlights the real impact we've made! If any project inspires you, I can help you start something similar. What interests you?",
    chips: ['Start a project like this', 'Get a project quote', 'Talk to the team'],
  },
  '/pricing': {
    banner: "Have pricing questions? I can help clarify everything.",
    greeting: "Great — let's talk pricing! Our packages are designed for every budget. I can walk you through our plans or get you a custom quote. What's your project type?",
    chips: ['Website pricing', 'App development cost', 'Get a custom quote'],
  },
  '/consultation': {
    banner: "Ready to book your free consultation? It only takes a minute.",
    greeting: "You're one step away from a **free consultation**! Our experts will listen to your needs and recommend the best solution — no commitment, no pressure. Any questions before you book?",
    chips: ['What happens in a consultation?', 'How long does it take?', 'Book now'],
  },
  '/contact': {
    banner: "Need to reach us? I can get you to the right person fast.",
    greeting: "I'll help you get in touch with the right team! Whether it's sales, support, or a partnership — just let me know and I'll point you in the right direction.",
    chips: ['Sales enquiry', 'Technical support', 'Partnership opportunity'],
  },
  '/support': {
    banner: "Having an issue? I'm here to help troubleshoot or escalate.",
    greeting: "Sorry to hear you're having an issue! Our support team is available 24/7. Can you briefly describe what's happening so I can point you to the right resource?",
    chips: ['Submit a support ticket', 'Check service status', 'Contact support team'],
  },
  '/careers': {
    banner: "Interested in joining the iTech team? Let's talk.",
    greeting: "We're always looking for talented people to join the **iTech Network Africa** family. I can tell you about our culture, current openings, and what it's like to work here!",
    chips: ['Current job openings', 'Company culture', 'How to apply'],
  },
  '/blog': {
    banner: "Enjoying our content? Ask me anything to explore further.",
    greeting: "Glad you're reading our blog! Our team writes about tech trends, business insights, and behind-the-scenes stories. Is there a topic you'd love to dive deeper into?",
    chips: ['Tech tips for my business', 'Latest news & trends', 'Subscribe to updates'],
  },
  '/news': {
    banner: "Any questions about what we've been up to recently?",
    greeting: "Welcome to our newsroom! Stay up to date with iTech Network Africa's latest milestones, partnerships, and industry news. Anything specific you'd like to know?",
    chips: ['Latest company news', 'New service launches', 'Partnership updates'],
  },
  '/industries': {
    banner: "Curious how we serve your industry? Let me show you.",
    greeting: "We work across many industries — from **healthcare** and **finance** to **retail**, **education**, and **government**. What industry are you in?",
    chips: ['Healthcare solutions', 'Finance & fintech', 'Education technology', 'Retail & e-commerce'],
  },
  '/partners': {
    banner: "Interested in partnering with us? Let's explore what's possible.",
    greeting: "We love building win-win partnerships! Whether you're a technology vendor, reseller, or complementary service provider, there could be a great opportunity here!",
    chips: ['Technology partnership', 'Reseller programme', 'Referral partnership'],
  },
  '/resources': {
    banner: "Looking for guides or tools? I can help you find what you need.",
    greeting: "Our resource hub has docs, tutorials, tools, and more! What are you trying to learn or accomplish? I'll point you to the right resource.",
    chips: ['Developer documentation', 'Video tutorials', 'Download tools'],
  },
};

const DEFAULT_PROMPT: PagePrompt = {
  banner: "Have a question? I'm Gotecx AI — ask me anything.",
  greeting: "Hi there! I'm **Gotecx AI**, your 24/7 AI assistant at **iTech Network Africa**. I'm here to help with any question — services, pricing, projects, support, or anything else. What's on your mind?",
  chips: ['What services do you offer?', 'Get a quote', 'Contact the team'],
};

type SupportTab = 'home' | 'messages' | 'help' | 'news' | 'chat';

const FAQS = [
  ['What services does iTech Network Africa offer?', 'We provide web and mobile development, enterprise software, AI and automation, cloud infrastructure, cybersecurity, network solutions, digital marketing, branding, multimedia, printing and IT support.', 'Getting Started'],
  ['How do I request a project quote?', 'Use the Get a Quote or free consultation links on the website. Share your goals, timeline and requirements and our team will follow up with a tailored scope.', 'Getting Started'],
  ['What happens during a consultation?', 'We listen to your goals, understand the challenge, review the technical requirements and recommend a practical next step. There is no pressure to proceed.', 'Getting Started'],
  ['What is your project process?', 'Our usual process is Discovery, Strategy, Build, then Launch & Support, with regular communication and reviews throughout.', 'Getting Started'],
  ['How long does a website project take?', 'Timing depends on the scope, content and integrations. The team confirms a delivery roadmap after discovery and requirements review.', 'Getting Started'],
  ['Do you work with clients outside Liberia?', 'Yes. iTech Network Africa serves clients across Africa, Europe and North America through remote and on-site delivery where appropriate.', 'General'],
  ['Do you offer website design?', 'Yes. We design and build responsive websites, landing pages, CMS-backed sites and digital experiences for organisations and businesses.', 'Web & Mobile'],
  ['Can you build a mobile application?', 'Yes. Our mobile app service covers the planning, design, engineering and launch of mobile products for your users and teams.', 'Web & Mobile'],
  ['Can you build custom business software?', 'Yes. We build custom enterprise platforms such as ERP, CRM, portals and workflow systems around your operating model.', 'Software'],
  ['Can you improve an existing website?', 'Yes. We can audit, redesign, rebuild or extend an existing website while preserving the parts that already work.', 'Web & Mobile'],
  ['What AI solutions do you build?', 'Our AI work includes support chatbots, business-process automation, analytics, document processing, recommendation systems and custom machine-learning tools.', 'AI & Automation'],
  ['Can you add an AI chatbot to my website?', 'Yes. We can design a customer-facing assistant, connect it to verified business knowledge and include escalation to a human team.', 'AI & Automation'],
  ['Can you automate repetitive business tasks?', 'Yes. We map the current workflow, identify safe automation opportunities and connect the tools your team already uses.', 'AI & Automation'],
  ['Do you provide cloud services?', 'Yes. We design and manage secure, scalable cloud infrastructure across AWS, Azure and Google Cloud.', 'Cloud & Hosting'],
  ['Do you provide website hosting?', 'Yes. Hosting, domains, SSL, monitoring and managed support are available through our cloud and hosting services.', 'Cloud & Hosting'],
  ['Can you register a domain name?', 'Yes. Ask our team about domain availability and the best domain setup for your organisation.', 'Cloud & Hosting'],
  ['Do hosted websites include SSL?', 'Our hosted sites include SSL configuration and support. The team can also help troubleshoot HTTPS and mixed-content issues.', 'Security'],
  ['Can you move my website to new hosting?', 'Yes. Migration planning, backups, DNS changes and post-migration checks can be included in a hosting engagement.', 'Cloud & Hosting'],
  ['Do you provide cybersecurity services?', 'Yes. We offer security audits, vulnerability assessments, penetration-testing support, threat protection and security guidance.', 'Security'],
  ['How do you protect client data?', 'Security is considered throughout delivery, including access controls, secure infrastructure and appropriate protection for data in transit and at rest.', 'Security'],
  ['Can you set up network infrastructure?', 'Yes. Our IT and network services cover connectivity, monitoring, remote access, hardware setup and managed infrastructure.', 'IT Infrastructure'],
  ['Do you offer 24/7 support?', 'Managed support and technical assistance are available for supported engagements. Your service scope and response targets are confirmed during onboarding.', 'Support'],
  ['How do I contact the support team?', 'Use the Contact Support action in this center, open the Support page, email the team or start a live chat when an agent is available.', 'Support'],
  ['Can I speak with a human agent?', 'Yes. Ask Gotecx AI to connect you with a human, use the headset action, or choose live chat from the support handoff card.', 'Support'],
  ['How do I open a support ticket?', 'Open the Support page from this website or use the Open a support ticket action when Gotecx AI offers human support.', 'Support'],
  ['How do I check a project update?', 'Clients can use the Client Portal where access has been configured. You can also contact your account team for a project update.', 'Client Portal'],
  ['What is the Client Portal?', 'The Client Portal is the secure area for client projects, invoices, support tickets, notifications and service information.', 'Client Portal'],
  ['How do I sign in to the Client Portal?', 'Use the Client Portal link in the website navigation and sign in with the account details provided to you.', 'Client Portal'],
  ['What should I do if I cannot access the portal?', 'Check your connection and credentials first. If the issue continues, use Support or contact the team so we can verify your account safely.', 'Client Portal'],
  ['Where can I find invoices?', 'Signed-in clients can find billing and invoice information in the Client Portal when the account has billing access enabled.', 'Billing'],
  ['Can you help with payment integrations?', 'Yes. We can scope secure payment and commerce integrations as part of a web, mobile or business-platform project.', 'Software'],
  ['Do you build e-commerce websites?', 'Yes. We build commerce experiences with catalogues, checkout, payments, order management and business integrations where required.', 'Software'],
  ['Do you offer digital marketing?', 'Yes. Services include digital strategy, SEO, social campaigns, content and performance-focused marketing support.', 'Marketing'],
  ['Can you create a brand identity?', 'Yes. Our branding and creative service can cover identity direction, design systems, campaign assets and digital brand applications.', 'Creative'],
  ['Do you produce video and multimedia?', 'Yes. We support multimedia, video production, graphics and campaign content for digital and business communication.', 'Creative'],
  ['Do you offer ICT training?', 'Yes. Training and e-learning programmes can be designed for teams, individuals and organisations based on the skills required.', 'Training'],
  ['What industries do you serve?', 'Our work includes finance and fintech, healthcare, education, government, retail and commerce, NGOs and non-profits, among others.', 'General'],
  ['Can you work with government or NGOs?', 'Yes. We have experience supporting government, NGO, INGO and enterprise-oriented digital programmes.', 'General'],
  ['How do partnerships work?', 'Agencies, IT firms, NGOs and institutions can explore referral, reseller and joint-programme opportunities through the Partners page.', 'Partners'],
  ['What is Gotecx?', 'Gotecx is iTech Network Africa’s flagship brand product and technology engine, helping businesses build their digital presence and growth systems.', 'Products'],
  ['How can I learn about Gotecx?', 'Visit the Products page or ask the iTech team for a Gotecx walkthrough and the best fit for your business.', 'Products'],
  ['What is Gotecx AI able to help with?', 'Gotecx AI can explain our services, point you to relevant pages, help with common questions, discuss the next step and connect you with the team.', 'AI Assistant'],
  ['Can Gotecx AI connect me to a person?', 'Yes. Say “talk to a person” or choose the human-support option. Gotecx AI will collect only the details needed to start the handoff.', 'AI Assistant'],
  ['Does Gotecx AI know private client information?', 'No. Gotecx AI should not be used to share passwords, private account details or sensitive credentials. Use the secure portal or contact the team.', 'AI Assistant'],
  ['How do I request a refund?', 'Refund questions should be sent through the Contact or Support channels so the team can review the relevant engagement and policy.', 'Billing'],
  ['How is my privacy handled?', 'Privacy and terms information are available through the legal links in the website footer. Contact the team if you have a specific privacy request.', 'Privacy'],
  ['Where can I read iTech news and updates?', 'Visit the News page for company updates, product news, announcements and technology insights.', 'News'],
] as const;

const SUPPORT_NEWS = [
  { category: 'Product', title: 'Meet Gotecx — the iTech technology engine', description: 'Discover the flagship product brand helping businesses build a stronger digital presence.', href: '/products' },
  { category: 'Services', title: 'Build your next digital platform with iTech', description: 'From discovery to launch and support, explore how our team turns ambitious ideas into useful systems.', href: '/services' },
  { category: 'AI & Automation', title: 'Practical AI for modern organisations', description: 'Explore chatbots, workflow automation, analytics and custom AI tools designed around real business needs.', href: '/ai' },
  { category: 'Company', title: 'Global expertise, delivered from Africa', description: 'Learn more about iTech Network Africa, our story and the partners and clients we serve.', href: '/about' },
];

const SUPPORT_AVATARS = [
  { kind: 'ai', label: 'Gotecx AI', color: '#3CB52A' },
  { kind: 'support', label: 'iTech support team', color: '#0A7EBF' },
  { kind: 'success', label: 'Client success team', color: '#7C3AED' },
  { kind: 'technical', label: 'Technical assistance', color: '#E85D04' },
];

function CustomAvatar({ kind, size = 'small' }: { kind: string; size?: 'small' | 'medium' }) {
  const Icon = kind === 'ai' ? Sparkles : kind === 'support' ? Headset : kind === 'success' ? MessagesSquare : Headphones;
  const colors = kind === 'ai'
    ? 'from-[#3CB52A] to-[#16803A]'
    : kind === 'support'
      ? 'from-[#0A7EBF] to-[#075985]'
      : kind === 'success'
        ? 'from-[#7C3AED] to-[#4C1D95]'
        : 'from-[#E85D04] to-[#9A3412]';
  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${colors} text-white shadow-inner ${size === 'medium' ? 'h-8 w-8' : 'h-full w-full'}`}>
      <span className="absolute -right-1 -top-1 h-1/2 w-1/2 rounded-full bg-white/20" />
      <span className="absolute bottom-0 left-1/2 h-1/2 w-3/4 -translate-x-1/2 rounded-t-full bg-black/10" />
      <Icon size={size === 'medium' ? 15 : 17} strokeWidth={2.5} aria-hidden="true" className="relative" />
    </span>
  );
}

function SupportAvatarStack({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center -space-x-2" aria-label="Gotecx AI and the iTech support team">
      {SUPPORT_AVATARS.map((avatar, index) => (
        <div
          key={avatar.label}
          className={`h-9 w-9 overflow-hidden rounded-full border-2 ${dark ? 'border-[#0A1929]' : 'border-white'} flex items-center justify-center text-[10px] font-black text-white shadow-sm`}
          style={{ zIndex: SUPPORT_AVATARS.length - index, backgroundColor: avatar.color }}
          aria-label={avatar.label}
          title={avatar.label}
        >
          <CustomAvatar kind={avatar.kind} />
        </div>
      ))}
    </div>
  );
}

function GotecxAvatar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 ${dark ? 'border-[#0A1929]' : 'border-white'} bg-[#dff5dc] shadow-sm`}
      aria-label="Gotecx AI avatar"
      title="Gotecx AI"
    >
      <CustomAvatar kind="ai" size="medium" />
    </div>
  );
}

/* Timings */
const SHOW_AFTER_MS = 15_000;   // appear 15s after last hide / page change
const HIDE_AFTER_MS = 8_000;    // auto-hide banner + button after 8s if untouched

/* ─── Typing indicator ─── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-[#3CB52A]/70"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

/* ─── Inline markdown: **bold**, /page-links ─── */
function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\/[a-z][a-z0-9\-/]*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (/^\/[a-z][a-z0-9\-/]*$/.test(part)) {
          return <span key={i} className="text-[#3CB52A] font-medium">{part}</span>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

/* ─── Full message renderer — proper block structure ─── */
function MessageText({ text, isUser }: { text: string; isUser?: boolean }) {
  // Normalise: collapse 3+ newlines → 2, strip separator lines (━━━)
  const cleaned = text
    .replace(/━+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Split into logical lines, preserving paragraph gaps
  const lines = cleaned.split('\n');

  const nodes: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // Skip blank lines (handled as spacing via space-y)
    if (!trimmed) {
      nodes.push(<div key={key++} className="h-1" />);
      continue;
    }

    // Bullet item
    const bullet = trimmed.match(/^[•\-\*]\s+(.+)/);
    if (bullet) {
      nodes.push(
        <div key={key++} className="flex items-start gap-2 leading-relaxed">
          <span className={`flex-shrink-0 mt-[3px] text-xs ${isUser ? 'text-white/80' : 'text-[#3CB52A]'}`}>●</span>
          <span className="flex-1 min-w-0"><InlineMarkdown text={bullet[1]} /></span>
        </div>
      );
      continue;
    }

    // Numbered item  e.g. "1. Something"
    const numbered = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numbered) {
      nodes.push(
        <div key={key++} className="flex items-start gap-2 leading-relaxed">
          <span className={`flex-shrink-0 font-semibold text-xs mt-[3px] ${isUser ? 'text-white/80' : 'text-[#3CB52A]'}`}>{numbered[1]}.</span>
          <span className="flex-1 min-w-0"><InlineMarkdown text={numbered[2]} /></span>
        </div>
      );
      continue;
    }

    // Normal text line
    nodes.push(
      <p key={key++} className="leading-relaxed">
        <InlineMarkdown text={trimmed} />
      </p>
    );
  }

  return <div className="space-y-1 text-[13px]">{nodes}</div>;
}

function SupportCenter({
  tab,
  setTab,
  onClose,
  onOpenChat,
  onRequestHuman,
  onAsk,
  messageCount,
}: {
  tab: Exclude<SupportTab, 'chat'>;
  setTab: (tab: Exclude<SupportTab, 'chat'>) => void;
  onClose: () => void;
  onOpenChat: () => void;
  onRequestHuman: () => void;
  onAsk: (question: string) => void;
  messageCount: number;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState<number | null>(null);
  const categories = ['All', ...Array.from(new Set(FAQS.map(faq => faq[2])))];
  const filteredFaqs = FAQS.filter(([question, answer, faqCategory]) => {
    const haystack = `${question} ${answer} ${faqCategory}`.toLowerCase();
    return (category === 'All' || faqCategory === category) && haystack.includes(query.toLowerCase());
  });
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'messages' as const, label: 'Messages', icon: MessagesSquare },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
    { id: 'news' as const, label: 'News', icon: Newspaper },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:left-6 sm:w-[min(720px,calc(100vw-48px))] sm:h-[min(760px,calc(100vh-48px))] z-[60] bg-[#F8F9FA] sm:rounded-3xl shadow-[0_24px_90px_rgba(10,25,41,0.3)] overflow-hidden border border-white/70 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="iTech Network Africa Support Center"
    >
      <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#0A1929] via-[#0f3043] to-[#247d3b] px-6 pt-5 pb-8 text-white">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#3CB52A]/20 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SupportAvatarStack dark />
            <div>
              <div className="font-black tracking-tight">iTech Support Center</div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#b9f2ae]"><span className="h-1.5 w-1.5 rounded-full bg-[#8ee47b] animate-pulse" /> Gotecx AI and the team are here to help</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Support Center" className="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <X size={19} />
          </button>
        </div>
        {tab === 'home' && (
          <div className="relative mt-8">
            <p className="text-2xl font-medium text-white/75">Hi there</p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight">How can we help?</h1>
          </div>
        )}
        {tab !== 'home' && (
          <div className="relative mt-6 flex items-center gap-3">
            <button onClick={() => setTab('home')} className="rounded-xl p-2 -ml-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Back to Support Center home"><ArrowLeft size={18} /></button>
            <h1 className="text-2xl font-black">{tabs.find(item => item.id === tab)?.label}</h1>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-20 sm:pb-4">
        {tab === 'home' && (
          <div className="space-y-4 p-5 sm:p-6">
            <button onClick={onOpenChat} className="group flex w-full items-center justify-between rounded-2xl bg-white p-5 text-left shadow-sm border border-black/5 hover:-translate-y-0.5 hover:shadow-md transition-all">
              <span>
                <span className="block text-base font-black text-[#0A1929]">Ask Gotecx AI a question</span>
                <span className="mt-1 block text-sm text-[#6B7280]">Our AI assistant can help you find the right answer</span>
              </span>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#3CB52A] text-white shadow-lg shadow-[#3CB52A]/20 group-hover:scale-105 transition-transform"><MessageCircle size={22} /></span>
            </button>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/consultation" onClick={onClose} className="rounded-2xl bg-white p-4 border border-black/5 shadow-sm hover:border-[#3CB52A]/40 transition-colors">
                <Clock size={19} className="mb-3 text-[#3CB52A]" /><span className="block text-sm font-bold text-[#0A1929]">Book a consultation</span><span className="mt-1 block text-xs text-[#6B7280]">Talk through your goals</span>
              </Link>
              <Link href="/contact" onClick={onClose} className="rounded-2xl bg-white p-4 border border-black/5 shadow-sm hover:border-[#3CB52A]/40 transition-colors">
                <PhoneCall size={19} className="mb-3 text-[#3CB52A]" /><span className="block text-sm font-bold text-[#0A1929]">Contact the team</span><span className="mt-1 block text-xs text-[#6B7280]">Sales, support or partners</span>
              </Link>
            </div>
            <div className="rounded-2xl bg-white border border-black/5 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5"><BookOpen size={17} className="text-[#3CB52A]" /><h2 className="text-sm font-black text-[#0A1929]">Popular questions</h2></div>
              {FAQS.slice(0, 5).map(([question], index) => (
                <button key={question} onClick={() => { setTab('help'); setQuery(question); }} className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left text-sm text-[#374151] hover:bg-[#f0fdf4] transition-colors border-b last:border-0 border-black/5">
                  <span>{question}</span><ChevronDown size={15} className="-rotate-90 shrink-0 text-[#3CB52A]" />
                </button>
              ))}
            </div>
            <div className="rounded-2xl bg-[#0A1929] p-5 text-white">
              <div className="text-xs font-bold uppercase tracking-widest text-[#8ee47b]">Need a human?</div>
              <p className="mt-2 text-sm text-white/70">Gotecx AI can connect you to our support team for the next step.</p>
              <button onClick={onOpenChat} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#3CB52A] px-4 py-2.5 text-xs font-bold text-white hover:bg-white hover:text-[#0A1929] transition-colors">Talk to the team <ArrowRight size={14} /></button>
            </div>
          </div>
        )}

        {tab === 'messages' && (
          <div className="space-y-4 p-5 sm:p-6">
            {messageCount > 0 ? (
              <>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1929] via-[#12314a] to-[#247d3b] p-5 text-white shadow-lg">
                  <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#3CB52A]/20 blur-2xl" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#b9f2ae]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8ee47b] animate-pulse" /> Active conversation
                      </span>
                      <h2 className="mt-4 text-xl font-black tracking-tight">Your conversation with Gotecx AI</h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/65">Pick up where you left off or connect with our team for personal help.</p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#b9f2ae] ring-1 ring-white/10">
                      <MessagesSquare size={22} />
                    </div>
                  </div>
                  <div className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xs font-semibold text-white/55">{messageCount} messages saved in this session</span>
                    <button onClick={onOpenChat} className="inline-flex items-center gap-1.5 rounded-xl bg-[#3CB52A] px-3.5 py-2 text-xs font-bold text-white hover:bg-white hover:text-[#0A1929] transition-colors">
                      Open chat <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#3CB52A]/20 bg-[#f0fdf4] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3CB52A] text-white"><Headset size={17} /></span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-black text-[#0A1929]">Need a person instead?</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#52705a]">A support team member can join this conversation and help with your specific request.</p>
                      <button onClick={onRequestHuman} className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-[#218516] hover:underline">
                        Connect to a human agent <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setTab('help')} className="group rounded-2xl border border-black/5 bg-white p-4 text-left shadow-sm hover:-translate-y-0.5 hover:border-[#3CB52A]/30 hover:shadow-md transition-all">
                    <HelpCircle size={18} className="text-[#3CB52A]" />
                    <span className="mt-3 block text-xs font-black text-[#0A1929]">Browse FAQs</span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-[#6B7280]">Find a quick answer</span>
                  </button>
                  <Link href="/support" onClick={onClose} className="group rounded-2xl border border-black/5 bg-white p-4 text-left shadow-sm hover:-translate-y-0.5 hover:border-[#3CB52A]/30 hover:shadow-md transition-all">
                    <Ticket size={18} className="text-[#3CB52A]" />
                    <span className="mt-3 block text-xs font-black text-[#0A1929]">Open a ticket</span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-[#6B7280]">Track a support request</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1929] via-[#12314a] to-[#247d3b] p-7 text-center text-white shadow-lg">
                  <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#3CB52A]/20 blur-2xl" />
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#b9f2ae] ring-1 ring-white/15">
                    <MessagesSquare size={28} />
                  </div>
                  <h2 className="relative mt-5 text-xl font-black">Start a helpful conversation</h2>
                  <p className="relative mt-2 text-sm leading-relaxed text-white/65">Gotecx AI can answer questions instantly, or route you to a human agent when you need one.</p>
                  <button onClick={onOpenChat} className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3CB52A] px-5 py-3 text-sm font-bold text-white hover:bg-white hover:text-[#0A1929] transition-colors">
                    Start with Gotecx AI <ArrowRight size={15} />
                  </button>
                </div>
                <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3CB52A]/10 text-[#3CB52A]"><Headset size={17} /></span>
                    <div>
                      <h3 className="text-sm font-black text-[#0A1929]">Already know you need support?</h3>
                      <p className="mt-1 text-xs text-[#6B7280]">Connect directly with a human agent.</p>
                    </div>
                  </div>
                  <button onClick={onRequestHuman} className="mt-4 w-full rounded-xl border border-[#3CB52A]/30 py-2.5 text-xs font-black text-[#218516] hover:bg-[#f0fdf4] transition-colors">
                    Connect to a human agent
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'help' && (
          <div className="p-5 sm:p-6">
            <div className="relative">
              <Search size={17} className="absolute left-4 top-3.5 text-[#6B7280]" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for help..." className="w-full rounded-2xl border border-black/10 bg-white py-3.5 pl-11 pr-4 text-sm text-[#0A1929] outline-none focus:border-[#3CB52A] focus:ring-2 focus:ring-[#3CB52A]/15" />
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map(item => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${category === item ? 'bg-[#3CB52A] text-white' : 'bg-white text-[#6B7280] border border-black/10 hover:border-[#3CB52A]'}`}>{item}</button>)}
            </div>
            <div className="mt-5 space-y-2">
              {filteredFaqs.map(([question, answer, faqCategory], index) => {
                const faqIndex = FAQS.indexOf(FAQS.find(faq => faq[0] === question)!);
                const isOpen = expanded === faqIndex;
                return <div key={question} className="rounded-2xl bg-white border border-black/5 overflow-hidden">
                  <button onClick={() => setExpanded(isOpen ? null : faqIndex)} className="flex w-full items-center justify-between gap-4 p-4 text-left">
                    <span><span className="block text-sm font-bold text-[#0A1929]">{question}</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-[#3CB52A]">{faqCategory}</span></span>
                    <ChevronDown size={17} className={`shrink-0 text-[#3CB52A] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>{isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="border-t border-black/5 px-4 pb-4 pt-3 text-sm leading-relaxed text-[#6B7280]">{answer}</p><button onClick={() => onAsk(question)} className="mx-4 mb-4 text-xs font-bold text-[#3CB52A] hover:underline">Ask Gotecx AI about this →</button></motion.div>}</AnimatePresence>
                </div>;
              })}
              {filteredFaqs.length === 0 && <div className="rounded-2xl bg-white p-8 text-center border border-black/5"><Search size={28} className="mx-auto text-[#9CA3AF]" /><p className="mt-3 text-sm font-bold text-[#0A1929]">We couldn't find an answer for that.</p><p className="mt-1 text-xs text-[#6B7280]">Try another search or ask Gotecx AI.</p><button onClick={onOpenChat} className="mt-4 rounded-xl bg-[#3CB52A] px-4 py-2 text-xs font-bold text-white">Ask Gotecx AI</button></div>}
            </div>
          </div>
        )}

        {tab === 'news' && (
          <div className="space-y-3 p-5 sm:p-6">
            <p className="mb-5 text-sm text-[#6B7280]">Updates, ideas and useful resources from iTech Network Africa.</p>
            {SUPPORT_NEWS.map(article => <Link key={article.title} href={article.href} onClick={onClose} className="group flex gap-4 rounded-2xl bg-white p-4 border border-black/5 shadow-sm hover:border-[#3CB52A]/40 transition-colors"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0A1929] text-[#3CB52A]"><Newspaper size={20} /></div><div className="min-w-0 flex-1"><span className="text-[10px] font-bold uppercase tracking-widest text-[#3CB52A]">{article.category}</span><h2 className="mt-1 text-sm font-black text-[#0A1929] group-hover:text-[#3CB52A]">{article.title}</h2><p className="mt-1 text-xs leading-relaxed text-[#6B7280]">{article.description}</p></div><ExternalLink size={15} className="mt-1 shrink-0 text-[#9CA3AF]" /></Link>)}
          </div>
        )}
      </div>

      <nav className="absolute bottom-0 left-0 right-0 grid grid-cols-4 border-t border-black/10 bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md sm:static sm:shrink-0 sm:border-t sm:pb-2">
        {tabs.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => setTab(item.id)} className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-bold transition-colors ${tab === item.id ? 'text-[#3CB52A]' : 'text-[#6B7280] hover:text-[#0A1929]'}`}><Icon size={19} strokeWidth={tab === item.id ? 2.5 : 1.8} /><span>{item.label}{item.id === 'messages' && messageCount > 0 ? ` (${messageCount})` : ''}</span></button>; })}
      </nav>
    </motion.div>
  );
}

/* ─── Human agent handoff card ─── */
function HandoffCard({ onStartLive, starting }: { onStartLive: (name: string, email: string) => void; starting: boolean }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="ml-9 mt-1 max-w-[82%] rounded-2xl border border-[#3CB52A]/30 bg-white shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-[#0A1929] to-[#0f2d47]">
        <Headset size={14} className="text-[#3CB52A]" />
        <p className="text-[11px] font-bold text-white">Connect with a human agent</p>
      </div>
      <div className="p-2 space-y-1">
        {/* Live chat with the team — right here in the widget */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-[#3CB52A]/10 hover:bg-[#3CB52A]/20 transition-colors group text-left"
          >
            <span className="w-7 h-7 rounded-full bg-[#3CB52A] flex items-center justify-center flex-shrink-0"><Headset size={13} className="text-white" /></span>
            <span className="min-w-0">
              <span className="block text-xs font-bold text-[#0A1929]">Chat with our team now</span>
              <span className="block text-[10px] text-gray-500">An agent will join this conversation</span>
            </span>
          </button>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (name.trim()) onStartLive(name.trim(), email.trim()); }}
            className="p-2 rounded-xl bg-[#3CB52A]/5 border border-[#3CB52A]/20 space-y-1.5"
          >
            <p className="text-[11px] font-bold text-[#0A1929]">Before we connect you:</p>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name *" required
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3CB52A]"
            />
            <input
              value={email} onChange={e => setEmail(e.target.value)} type="email"
              placeholder="Email (optional)"
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3CB52A]"
            />
            <button
              type="submit" disabled={!name.trim() || starting}
              className="w-full text-xs font-bold py-1.5 rounded-lg bg-[#3CB52A] hover:bg-[#2da822] text-white disabled:opacity-50 transition-colors"
            >
              {starting ? 'Connecting…' : 'Start live chat'}
            </button>
          </form>
        )}
        <a
          href="https://wa.me/231776836689?text=Hi%2C%20I%20was%20chatting%20with%20Gotecx%20AI%20and%20would%20like%20to%20speak%20with%20an%20agent."
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-green-50 transition-colors group"
        >
          <span className="w-7 h-7 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0"><Phone size={13} className="text-[#25D366]" /></span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold text-[#0A1929] group-hover:text-[#3CB52A]">WhatsApp — chat now</span>
            <span className="block text-[10px] text-gray-400">Typically replies within minutes</span>
          </span>
        </a>
        <a
          href="/support"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-green-50 transition-colors group"
        >
          <span className="w-7 h-7 rounded-full bg-[#3CB52A]/10 flex items-center justify-center flex-shrink-0"><Ticket size={13} className="text-[#3CB52A]" /></span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold text-[#0A1929] group-hover:text-[#3CB52A]">Open a support ticket</span>
            <span className="block text-[10px] text-gray-400">Tracked by our 24/7 support team</span>
          </span>
        </a>
        <a
          href="mailto:itechnetworkafrica@gmail.com"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-green-50 transition-colors group"
        >
          <span className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0"><Mail size={13} className="text-blue-500" /></span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold text-[#0A1929] group-hover:text-[#3CB52A]">Email the team</span>
            <span className="block text-[10px] text-gray-400">Reply within 1 business day</span>
          </span>
        </a>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export const SarahChatbot: React.FC = () => {
  const [location] = useLocation();

  const [open, setOpen]           = useState(false);
  const [supportTab, setSupportTab] = useState<SupportTab>('home');
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [visible, setVisible]     = useState(false); // button + banner shown
  const [live, setLive]           = useState<LiveSession | null>(null);
  const [starting, setStarting]   = useState(false);
  const lastMsgIdRef              = useRef(0);
  const liveRef                   = useRef<LiveSession | null>(null);
  liveRef.current = live;

  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const inputRef        = useRef<HTMLInputElement>(null);
  const showTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef         = useRef(false);
  const messagesRef     = useRef<Message[]>([]);

  openRef.current    = open;
  messagesRef.current = messages;

  /* ─── Helpers ─── */
  const getPrompt = useCallback((path: string): PagePrompt => {
    if (PAGE_PROMPTS[path]) return PAGE_PROMPTS[path];
    const match = Object.keys(PAGE_PROMPTS)
      .filter(k => k !== '/' && path.startsWith(k))
      .sort((a, b) => b.length - a.length)[0];
    return match ? PAGE_PROMPTS[match] : DEFAULT_PROMPT;
  }, []);

  /* ─── Schedule the next "appear" event ─── */
  const scheduleAppear = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    showTimerRef.current = setTimeout(() => {
      if (!openRef.current) {
        setVisible(true);
        // Auto-hide after HIDE_AFTER_MS if user doesn't interact
        hideTimerRef.current = setTimeout(() => {
          setVisible(false);
          scheduleAppear(); // schedule the next cycle
        }, HIDE_AFTER_MS);
      }
    }, SHOW_AFTER_MS);
  }, []);

  /* ─── Start cycle on mount ─── */
  useEffect(() => {
    scheduleAppear();
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [scheduleAppear]);

  /* ─── Reset cycle on page navigation ─── */
  useEffect(() => {
    if (!openRef.current) {
      setVisible(false);
      scheduleAppear();
    }
  }, [location, scheduleAppear]);

  /* ─── Auto-scroll ─── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* ─── Focus input when opened ─── */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  /* ─── Open chat ─── */
  const handleOpen = useCallback(() => {
    const prompt = getPrompt(location);
    setVisible(false);
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setSupportTab('home');
    setOpen(true);
    // Set greeting if this is the first open
    setMessages(prev => prev.length === 0
      ? [{ role: 'assistant', content: prompt.greeting }]
      : prev
    );
  }, [location, getPrompt]);

  /* ─── Close chat ─── */
  const handleClose = useCallback(() => {
    setOpen(false);
    openRef.current = false;
    scheduleAppear();
  }, [scheduleAppear]);

  const openChatView = useCallback(() => {
    const prompt = getPrompt(location);
    setSupportTab('chat');
    setMessages(prev => prev.length === 0
      ? [{ role: 'assistant', content: prompt.greeting }]
      : prev
    );
  }, [location, getPrompt]);

  /* Open the existing live-agent handoff directly from the Messages tab.
     This stays frontend-first for now; the live-chat endpoint can be enabled
     later without changing the user-facing route. */
  const requestHumanAgent = useCallback(() => {
    setSupportTab('chat');
    setMessages(prev => {
      if (prev.length === 0) {
        return [
          { role: 'assistant', content: getPrompt(location).greeting },
          { role: 'assistant', content: 'I can connect you with a human agent. Share your name below to join the support queue.', handoff: true },
        ];
      }
      const last = prev[prev.length - 1];
      if (last.handoff) return prev;
      return [
        ...prev,
        { role: 'assistant', content: 'I can connect you with a human agent. Share your name below to join the support queue.', handoff: true },
      ];
    });
  }, [getPrompt, location]);

  /* ─── Dismiss banner (but keep cycle going) ─── */
  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    scheduleAppear(); // restart cycle
  }, [scheduleAppear]);

  /* ─────────────────────────────────────────────
     UNIFIED SEND — used by typed input & chips
     Takes the text to send + current messages snapshot
     ───────────────────────────────────────────── */
  const doSend = useCallback(async (text: string, currentMessages: Message[]) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    const withUser = [...currentMessages, userMsg];

    // Show user message + empty assistant placeholder immediately
    setMessages([...withUser, { role: 'assistant', content: '' }]);
    setLoading(true);

    const errorMsg = "I'm sorry, I had a little hiccup there. Please try again, or reach us directly at **itechnetworkafrica@gmail.com**.";

    const setLast = (content: string) =>
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'assistant', content };
        return copy;
      });

    try {
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: withUser }),
      });

      if (!res.ok) {
        setLast(errorMsg);
        return;
      }

      const data = await res.json() as { message?: string; error?: string; handoff?: boolean };
      const fullText = data.message?.trim() || errorMsg;

      // ── Simulate typing: reveal the response word-by-word ──
      const words = fullText.split(/(\s+)/); // keep whitespace tokens
      let built = '';
      for (const word of words) {
        built += word;
        setLast(built);
        // tiny yield so React can flush each frame
        await new Promise<void>(r => setTimeout(r, 22));
      }

      // ── Attach handoff card once the full message is revealed ──
      if (data.handoff) {
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { ...copy[copy.length - 1], handoff: true };
          return copy;
        });
      }
    } catch {
      setLast(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const askFromHelp = useCallback((question: string) => {
    setSupportTab('chat');
    setMessages(prev => prev.length === 0
      ? [{ role: 'assistant', content: getPrompt(location).greeting }]
      : prev
    );
    setTimeout(() => doSend(question, messagesRef.current), 80);
  }, [doSend, getPrompt, location]);

  /* ─────────────────────────────────────────────
     LIVE AGENT MODE
     ───────────────────────────────────────────── */
  const startLive = useCallback(async (name: string, email: string) => {
    if (starting || liveRef.current) return;
    setStarting(true);
    try {
      const transcript = messagesRef.current
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(apiUrl('/api/live-chat/start'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorName: name, visitorEmail: email, topic: location, transcript }),
      });
      if (!res.ok) throw new Error('failed');
      const data = await res.json() as { sessionId: string; token: string };
      lastMsgIdRef.current = 0;
      setLive({ sessionId: data.sessionId, token: data.token, status: 'waiting', agentName: null });
      setMessages(prev => [
        ...prev.map(m => ({ ...m, handoff: false })),
        { role: 'system' as const, content: "You're in the queue — a team member will join shortly. You can keep typing here." },
      ]);
    } catch {
      setMessages(prev => [...prev, { role: 'system', content: "Sorry — we couldn't start a live chat right now. Please try WhatsApp or open a support ticket below." }]);
    } finally {
      setStarting(false);
    }
  }, [starting, location]);

  /* Poll the live session for agent replies / status changes */
  useEffect(() => {
    if (!live || live.status === 'closed') return;
    let stopped = false;
    const tick = async () => {
      try {
        const res = await fetch(apiUrl(`/api/live-chat/${live.sessionId}?after=${lastMsgIdRef.current}`), {
          headers: { 'X-Visitor-Token': live.token },
        });
        if (!res.ok || stopped) return;
        const data = await res.json() as {
          status: 'waiting' | 'active' | 'closed';
          agentName: string | null;
          messages: { id: number; sender: string; senderName: string; text: string }[];
        };
        const incoming = data.messages.filter(m => m.id > lastMsgIdRef.current);
        if (incoming.length > 0) {
          lastMsgIdRef.current = incoming[incoming.length - 1].id;
          const mapped = incoming
            .filter(m => m.sender !== 'visitor') // our own messages are already shown
            .map<Message>(m => m.sender === 'agent'
              ? { role: 'agent', content: m.text, senderName: m.senderName }
              : { role: 'system', content: m.text });
          if (mapped.length > 0) setMessages(prev => [...prev, ...mapped]);
        }
        if (data.status !== live.status || data.agentName !== live.agentName) {
          setLive(prev => prev ? { ...prev, status: data.status, agentName: data.agentName } : prev);
        }
      } catch { /* transient network issue — keep polling */ }
    };
    tick();
    const id = setInterval(tick, 3000);
    return () => { stopped = true; clearInterval(id); };
  }, [live?.sessionId, live?.status, live?.agentName]);

  const sendLiveMessage = useCallback(async (text: string) => {
    const session = liveRef.current;
    if (!session) return;
    try {
      const res = await fetch(apiUrl(`/api/live-chat/${session.sessionId}/message`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Visitor-Token': session.token },
        body: JSON.stringify({ text }),
      });
      if (res.status === 422) {
        // Server-side respectful-language guard
        setMessages(prev => [...prev, { role: 'system', content: "Let's keep our conversation friendly and respectful. Our team is here to help — could you rephrase that?", warning: true }]);
        return;
      }
      if (!res.ok) throw new Error('send failed');
      const data = await res.json() as { message?: { id: number } };
      // Only show the message once the server has stored it
      setMessages(prev => [...prev, { role: 'user', content: text }]);
      if (data.message?.id && data.message.id > lastMsgIdRef.current) lastMsgIdRef.current = data.message.id;
    } catch {
      setInput(text); // put the text back so the visitor can retry
      setMessages(prev => [...prev, { role: 'system', content: "Your message didn't go through — please try sending it again." }]);
    }
  }, []);

  const endLive = useCallback(async () => {
    const session = liveRef.current;
    if (!session) return;
    setLive(null);
    lastMsgIdRef.current = 0;
    setMessages(prev => [...prev, { role: 'system', content: 'Live chat ended. Gotecx AI is back if you need anything else!' }]);
    try {
      await fetch(apiUrl(`/api/live-chat/${session.sessionId}/close`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Visitor-Token': session.token },
        body: JSON.stringify({}),
      });
    } catch { /* best effort */ }
  }, []);

  /* ─── Send typed message ─── */
  const warnCountRef = useRef(0);
  const sendMessage = useCallback(() => {
    if (!input.trim() || loading) return;
    const text = input.trim();

    // Respectful-language guard — flag offensive messages instead of sending
    if (isOffensive(text)) {
      const idx = Math.min(warnCountRef.current, WARNING_MESSAGES.length - 1);
      warnCountRef.current += 1;
      setInput('');
      setMessages(prev => [...prev, { role: 'system', content: WARNING_MESSAGES[idx], warning: true }]);
      return;
    }

    setInput('');
    if (liveRef.current && liveRef.current.status !== 'closed') {
      sendLiveMessage(text);
    } else {
      doSend(text, messagesRef.current);
    }
  }, [input, loading, doSend, sendLiveMessage]);

  /* ─── Send chip (quick reply) ─── */
  const sendChip = useCallback((text: string) => {
    if (loading) return;
    doSend(text, messagesRef.current);
  }, [loading, doSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const prompt     = getPrompt(location);
  const showChips  = messages.length === 1 && !loading;

  return (
    <>
      {/* ═══════════════════════════════
          CHAT WINDOW
          ═══════════════════════════════ */}
      <AnimatePresence>
        {open && supportTab !== 'chat' && (
          <SupportCenter
            tab={supportTab}
            setTab={setSupportTab}
            onClose={handleClose}
            onOpenChat={openChatView}
            onRequestHuman={requestHumanAgent}
            onAsk={askFromHelp}
            messageCount={messages.length}
          />
        )}
        {open && supportTab === 'chat' && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:left-6 sm:w-[min(720px,calc(100vw-48px))] sm:h-[min(760px,calc(100vh-48px))] z-[60] bg-white sm:rounded-3xl shadow-[0_24px_90px_rgba(10,25,41,0.3)] flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-[#0A1929] via-[#0f2d47] to-[#247d3b] text-white flex-shrink-0 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 85% 0%, rgba(60,181,42,0.18) 0%, transparent 60%)' }} />
              <button onClick={() => setSupportTab('messages')} className="relative z-10 mr-1 rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Back to Support Center messages">
                <ArrowLeft size={19} />
              </button>
              <div className="relative z-10">
                <SupportAvatarStack dark />
              </div>
              <div className="relative z-10 flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight">
                  {live ? (live.agentName || 'iTech Support') : 'Gotecx AI'}
                </p>
                <p className="text-[11px] text-green-400 leading-tight flex items-center gap-1">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${live?.status === 'waiting' ? 'bg-amber-400' : 'bg-green-400'} animate-pulse`} />
                  {live
                    ? (live.status === 'waiting' ? 'Waiting for an agent…' : live.status === 'active' ? 'Live agent connected' : 'Chat ended')
                    : 'Always online · AI Assistant'}
                </p>
              </div>
              {live ? (
                <button
                  onClick={endLive}
                  className="text-white/60 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider"
                  aria-label="End live chat"
                  title="End live chat"
                >
                  End
                </button>
              ) : (
                <button
                  onClick={() => sendChip('I would like to talk to a human agent, please.')}
                  className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                  aria-label="Talk to a human agent"
                  title="Talk to a human agent"
                >
                  <Headset size={16} />
                </button>
              )}
              <button
                onClick={handleClose}
                className="relative z-10 text-white/70 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-7 space-y-4 bg-[#F8F9FA]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'system' ? (
                    <div className="w-full text-center px-4">
                      <span className={`inline-block text-[11px] rounded-2xl px-3.5 py-2 leading-relaxed whitespace-pre-wrap ${
                        msg.warning
                          ? 'text-amber-700 bg-amber-50 border border-amber-200 font-medium'
                          : 'text-gray-400 bg-gray-100'
                      }`}>{msg.content}</span>
                    </div>
                  ) : msg.role === 'agent' ? (
                    <>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0A1929] to-[#0f2d47] flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-sm">
                        <Headset size={13} className="text-[#3CB52A]" />
                      </div>
                      <div className="max-w-[82%] min-w-0">
                        {msg.senderName && <p className="text-[10px] font-bold text-[#0A1929]/60 mb-0.5">{msg.senderName} · Support Team</p>}
                        <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white border border-gray-200 text-[#0A1929] shadow-sm">
                          <MessageText text={msg.content} />
                        </div>
                      </div>
                    </>
                  ) : (
                  <>
                   {msg.role === 'assistant' && <GotecxAvatar />}

                  {msg.role === 'user' ? (
                    /* ── User bubble ── */
                    <div className="max-w-[78%] min-w-0 px-3.5 py-2.5 rounded-2xl rounded-br-sm bg-gradient-to-br from-[#3CB52A] to-[#2da822] text-white shadow-sm overflow-hidden">
                      <MessageText text={msg.content} isUser />
                    </div>
                  ) : (
                    /* ── Assistant: no box, clean text on the chat background ── */
                    <div className="max-w-[82%] min-w-0 text-[#0A1929]">
                      {msg.content === ''
                        ? <TypingDots />
                        : <MessageText text={msg.content} />
                      }
                    </div>
                  )}
                  </>
                  )}
                </motion.div>
              ))}

              {/* Human handoff card */}
              {!live && messages.length > 0 && messages[messages.length - 1].handoff && !loading && (
                <HandoffCard onStartLive={startLive} starting={starting} />
              )}

              {/* Quick-reply chips — only after the first greeting */}
              <AnimatePresence>
                {showChips && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="flex flex-wrap gap-1.5 pl-9"
                  >
                    {prompt.chips.map(chip => (
                      <button
                        key={chip}
                        onClick={() => sendChip(chip)}
                        className="text-xs px-2.5 py-1 rounded-full bg-white border border-[#3CB52A]/40 text-[#3CB52A] hover:bg-[#3CB52A] hover:text-white transition-all duration-200 font-medium shadow-sm"
                      >
                        {chip}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-4 sm:px-6 bg-white border-t border-gray-100 flex-shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                 placeholder={live ? 'Message our team…' : 'Ask Gotecx AI anything…'}
                maxLength={500}
                className="flex-1 text-sm px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/30 focus:border-[#3CB52A] placeholder-gray-400 text-[#0A1929] transition-all"
                disabled={loading}
              />
              {input.length > 400 && (
                <span className={`text-[10px] font-semibold flex-shrink-0 ${input.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>{500 - input.length}</span>
              )}
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3CB52A] to-[#2da822] hover:from-[#2da822] hover:to-[#259a1e] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
                aria-label="Send"
              >
                <Send size={15} />
              </button>
            </div>

            {/* Footer */}
            <div className="px-3 pb-3 text-center flex-shrink-0 bg-white">
              <p className="text-[10px] text-gray-400">
                Powered by <span className="font-semibold text-[#3CB52A]">iTech Network Africa</span> · 24/7 AI Assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════
          FLOATING BANNER + BUTTON
          Appears every 15 s, auto-hides
          after 8 s if not interacted with
          ═══════════════════════════════ */}
      {!open && (
        <div className="fixed bottom-6 left-4 sm:bottom-8 sm:left-8 z-[60] flex flex-col items-start gap-3">
          {/* Nudge banner — appears periodically above the static button */}
          <AnimatePresence>
            {visible && (
              <motion.div
                key="nudge"
                initial={{ opacity: 0, y: 14, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.94 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-white rounded-2xl shadow-[0_16px_48px_rgba(10,25,41,0.18)] border border-gray-100 px-4 pt-3 pb-3 max-w-[250px] cursor-pointer group"
                onClick={handleOpen}
              >
                <button
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 flex items-center justify-center transition-colors z-10"
                  onClick={handleDismiss}
                  aria-label="Dismiss"
                >
                  <X size={10} />
                </button>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#3CB52A] to-[#2da822] flex items-center justify-center flex-shrink-0">
                    <Sparkles size={10} className="text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-[#0A1929]">Gotecx AI</span>
                  <span className="text-[10px] text-green-500 flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                    online
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-snug group-hover:text-[#0A1929] transition-colors">
                  {prompt.banner}
                </p>
                <p className="text-[10px] text-[#3CB52A] font-semibold mt-1.5">
                  Tap to chat →
                </p>
                <div className="absolute -bottom-1.5 left-7 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Static launcher — always visible */}
          <div className="group relative flex items-center">
            {/* Hover label */}
            <span className="hidden sm:block absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#0A1929] text-white text-xs font-semibold whitespace-nowrap opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-lg">
               Chat with Gotecx AI
            </span>
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleOpen}
               aria-label="Chat with Gotecx AI"
              className="relative w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-gradient-to-br from-[#3CB52A] via-[#34a824] to-[#25911a] text-white shadow-[0_10px_36px_rgba(60,181,42,0.45)] ring-4 ring-[#3CB52A]/15 flex items-center justify-center"
            >
              <MessageCircle size={26} strokeWidth={2.2} />
              {/* AI sparkle badge */}
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0A1929] border-2 border-white flex items-center justify-center">
                <Sparkles size={10} className="text-[#3CB52A]" />
              </span>
              {/* Online dot */}
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
            </motion.button>
          </div>
        </div>
      )}

    </>
  );
};

import { Router } from "express";
import OpenAI from "openai";

const router = Router();

/* ─────────────────────────────────────────────────────────────────────────────
   COMPREHENSIVE KNOWLEDGE BASE SYSTEM PROMPT
   Trained on all iTech Network Africa website data.
   ───────────────────────────────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are Sarah, a friendly, warm, and highly knowledgeable 24/7 virtual assistant for iTech Network Africa — a leading full-service technology company delivering cutting-edge ICT solutions across Africa.

YOUR PERSONALITY:
- Warm, enthusiastic, conversational, and genuinely helpful
- You love technology and get excited when helping people find the right solution
- Speak in first person ("I", "we") naturally on behalf of the company
- Keep answers concise but complete; use bullet points and line breaks for readability
- Use 1–2 relevant emojis per message — never overdo it
- Always end with a helpful follow-up offer or next step
- If you don't know something specific, say so and offer to connect them via /contact or itechnetworkafrica@gmail.com
- NEVER invent prices, staff, project names, or facts not listed below

CRITICAL RULE: Only answer using the verified company information in this prompt. If asked something outside this knowledge, say "I'd recommend reaching out to our team directly at /contact or itechnetworkafrica@gmail.com for the most accurate answer."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPANY OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: iTech Network Africa
Founded: 2023 by Wilmot Kerkulah in Monrovia, Liberia
Industry: Information & Communication Technology (ICT)
Website: itechnetworkafrica.com
Email: itechnetworkafrica@gmail.com
Phone: +231 761 798 796
Address: Monrovia, Liberia (HQ). Regional hubs: West Africa (Ghana, Nigeria, Sierra Leone), East Africa
Social Media: LinkedIn, X (Twitter), Instagram, Facebook — all @itechnetworkafrica
Business Hours: Monday–Friday 8:00 AM – 6:00 PM WAT | Technical Support: 24/7

KEY STATS:
- Founded 2023
- 10+ countries served (Africa, Europe, North America)
- 30+ enterprise clients
- 20+ projects delivered
- 5 core team members
- 99% client satisfaction rate

MISSION: To empower businesses, governments, and communities across Africa through innovative technology, AI solutions, enterprise software, and end-to-end digital transformation.
VISION: To be Africa's most trusted technology brand, present in 50+ countries by 2030.
VALUES: Innovation, Integrity, Impact, Inclusivity, Collaboration, Excellence.

COMPANY HISTORY:
- 2023: Founded in Monrovia, Liberia. First contracts with local businesses, NGOs, and international institutions.
- 2024: Launched cybersecurity, cloud, and AI divisions. Expanded to North America and Europe, partnering with financial institutions, NGOs, and government agencies.
- 2025: Operating in 10+ countries across Africa, Europe, and North America. 20+ projects delivered for 30+ enterprise clients.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEAM (all based in Monrovia, Liberia — joined 2023)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Wilmot Kerkulah — Founder & Executive Director
   Sets company strategy, manages enterprise partnerships, leads business development across new markets.
   Expertise: Strategic Leadership, Digital Transformation, IT Consulting.
   Quote: "African enterprises deserve world-class technology. My mission is to make that a reality — one solution at a time."
   Profile: /team/wilmot-kerkulah

2. Foday Kabah — Full Stack Developer
   Builds robust web and mobile applications, crafting seamless digital experiences for the enterprise solutions portfolio.
   Expertise: React, TypeScript, Node.js, Cloud Deployment.
   Profile: /team/foday-kabah

3. Alvina Dahn — Finance Officer
   Manages financial operations, budgeting, and reporting.
   Expertise: Financial Management, Budgeting, Compliance.
   Profile: /team/alvina-dahn

4. James Kerkula — Operations Associate
   Supports day-to-day operations and project coordination.
   Expertise: Project Management, Client Coordination.
   Profile: /team/james-kerkula

5. Dorcas Kollie — Administrative Officer
   Oversees administrative functions and client communications; often the first point of contact for new clients.
   Expertise: Office Administration, HR Support.
   Profile: /team/dorcas-kollie

Full team page: /about#our-team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Web Design & Development (/services/web-development)
   Corporate & business websites, e-commerce stores, landing pages, government/NGO/university portals, Progressive Web Apps (PWAs). Fast, mobile-friendly, SEO-ready.

2. Software Development (/services/software-development)
   Custom ERP, CRM, Hospital Management Systems, School Management Systems, HR & Payroll, POS Systems, API integrations, and bespoke enterprise software.

3. Mobile App Development (/services/mobile-development)
   Native Android & iOS apps, cross-platform apps (React Native/Flutter) for business, healthcare, education, e-commerce, and on-demand services.

4. Digital Marketing (/services/digital-marketing)
   SEO, Google Ads/PPC, social media management & advertising, content marketing, email & SMS marketing, lead generation strategies.

5. Graphic Design & Branding (/services/graphic-design)
   Logo design, brand identity systems, brand guidelines, marketing collateral (brochures, flyers, business cards), social media graphics, presentation design, packaging.

6. UI/UX Design (/services/ui-ux-design)
   User research, wireframing, prototyping, and user-centred interface design that drives engagement and conversions.

7. Cloud & IT Services (/services/cloud-services)
   Cloud migration & setup (AWS, Azure, Google Cloud), Microsoft 365 & Google Workspace setup, managed hosting, backup & disaster recovery, DevOps & CI/CD, cost optimisation.

8. Cybersecurity (/services/cybersecurity)
   Security audits & vulnerability assessments, penetration testing, threat monitoring & incident response, firewall & network security, data protection & compliance, employee security training.

9. Networking & Infrastructure (/services/networking)
   Wi-Fi & network installation, CCTV & surveillance systems, access control & biometric systems, structured cabling, VoIP telephony.

10. IT Consulting (/services/it-consulting)
    Strategic technology advisory, digital transformation roadmaps, technology due diligence.

11. AI Solutions (/ai-solutions)
    Custom AI chatbots, business process automation, predictive analytics & ML models, computer vision, document processing & OCR, AI-powered recommendation engines, data dashboards.

12. Creative Media (/services/creative-media)
    Professional photography, videography, motion graphics, 3D animation.

13. Printing & Promotional (/services/printing)
    Large-format printing, branded merchandise, signage, banners, promotional items.

14. Technical Support (/support)
    24/7 remote and on-site IT support, hardware repairs, helpdesk ticketing.

15. Business Solutions (/services/business-solutions)
    Digital payments, customer portals, e-signature, document management systems.

16. ICT Training (/services/ict-training)
    Microsoft Office Suite, cybersecurity awareness, AI tools for business, programming fundamentals, cloud computing basics, digital marketing essentials. Available for individuals and corporate teams.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCTS & PRICING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WEBSITE PACKAGES:
- Starter: $350 — 5 pages, responsive design
- Business: $750 — 12 pages + CMS (content management)
- Professional: $1,500 — 25 pages + Client portal
- Enterprise: Starting $3,000 — Fully custom solution

WEB HOSTING PACKAGES (per year):
- Starter: $120/year
- Business: $250/year
- Professional: $450/year
- Enterprise: Starting $800/year

BUSINESS EMAIL:
- Basic: From $3/user/month
- Business: From $6/user/month
- Enterprise: Custom pricing

POS SYSTEMS:
- Basic: From $299 (single location)
- Multi-Branch: From $699
- Enterprise: Custom pricing

SCHOOL MANAGEMENT SYSTEM:
- Basic: From $299/year
- Standard: From $599/year
- Enterprise: Custom pricing

INVENTORY MANAGEMENT SOFTWARE:
- Starter: From $99/month
- Growth: From $249/month
- Enterprise: Custom pricing

CRM SOFTWARE:
- Starter: From $49/month
- Team: From $149/month
- Enterprise: Custom pricing

Note: All prices are starting prices. Final quotes depend on specific requirements. Visit /pricing for full details or book a free consultation at /consultation for a custom quote.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPORT TIERS & SLAs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Standard Support:
- Email response within 24 hours
- Business hours coverage (Mon–Fri 8am–6pm WAT)

Priority Support:
- Response within 4 hours
- Priority queue placement
- Dedicated Slack channel

Dedicated Support:
- Response within 1 hour, 24/7
- Named account engineer
- Proactive monitoring & reporting

Uptime SLA Guarantee: 98.9% – 99.9%
Submit tickets or get help at: /support

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PORTFOLIO & PROJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Health Tech Liberia (healthtech-liberia.org) — Digital health platform connecting patients & providers across Liberia with electronic health records and telemedicine.
2. Galaxy International (galaxyinternational.com) — Corporate website with full CMS, responsive design, and brand identity system.
3. B4P CODEFOUND (b4pcodefound.org) — NGO website for a women & youth-led coding education organisation with donation integration.
4. DKS Incubation Center (dksincubationcenter.org) — Institution website with an online application portal for startup incubation programs.
5. Lewanah LLC (lewanahllc.com) — E-commerce platform for a US-based digital brand with payment processing and instant delivery.
6. Agrolite (agrolite.org) — Agricultural organisation website with editorial blog, photo gallery, and community outreach resources.

More at /portfolio and /projects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTNERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Lumigrow Digital (lumigrowdigitalagency.online) — Creative digital agency: brand strategy, web design, marketing
- Capacity For Youth / C4Y (youthcapacity.org) — NGO empowering young people across Africa
- Health Tech Liberia (healthtech-liberia.org) — Digital health infrastructure and telemedicine
- Softnet Africa (softnetafrica.com) — Pan-African software development and network infrastructure
- B4P CODEFOUND (b4pcodefound.org) — Women & youth-led NGO bridging the coding skills gap
More at /partners

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INDUSTRIES SERVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Healthcare, Finance & Banking, Retail & E-commerce, Education & EdTech, Government & Public Sector, Manufacturing, Hospitality & Tourism, NGOs & Nonprofits, Telecommunications, Agriculture, Real Estate, Media & Creative, Logistics & Supply Chain
More at /industries

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAREERS & JOB OPENINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current open roles:
- Senior Full-Stack Engineer
- Machine Learning Researcher
- Enterprise Software Sales
- UI/UX Product Designer
- Cloud Infrastructure Architect
- Technical Support Specialist
- DevOps Engineer
- Project Manager

Benefits: Health & wellness (dependents included), Remote-first (Monrovia HQ or global), Annual learning & growth budget, Competitive salary aligned to global industry standards.
Apply at: /careers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CSR & SOCIAL INITIATIVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Tech Education Initiative: Free coding bootcamps and digital literacy programs reaching 2,000+ youth across rural communities each year
- Green Technology: Committed to carbon-neutral operations by 2026 via cloud-first infrastructure
- Women in Tech: Scholarship programs and mentorship in STEM; goal of 50% female workforce by 2027
- SME Digital Support: Subsidised technology packages helping small African businesses compete digitally

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SITE PAGES (for directing users)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/ Home | /about About | /services All Services | /ai-solutions AI Solutions
/solutions Business Solutions | /products Products | /portfolio Portfolio
/projects Projects | /industries Industries | /partners Partners
/resources Resources | /blog Blog | /news News | /careers Careers
/support Support | /contact Contact | /pricing Pricing
/consultation Free Consultation | /portal Client Portal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- For pricing questions: share the relevant package prices from the data above, then suggest /pricing or a free consultation at /consultation for custom quotes
- For support issues: direct to /support and offer email itechnetworkafrica@gmail.com
- For project enquiries: direct to /consultation (free, no commitment)
- For careers: direct to /careers
- For services: describe the service from the data above, then offer a free consultation
- Response time: 1 business day for email; technical support is 24/7
- When a user is ready to start: guide them to /consultation or /contact`;

/* ─────────────────────────────────────────────
   BUILT-IN KNOWLEDGE BASE FALLBACK
   Used when OPENAI_API_KEY is not set or fails.
   Ensures Sarah is always functional.
   ───────────────────────────────────────────── */
interface KBEntry {
  patterns: RegExp[];
  response: string;
}

const KNOWLEDGE_BASE: KBEntry[] = [
  {
    patterns: [/^(hi|hello|hey|howdy|good\s*(morning|afternoon|evening)|hola|sup)/i],
    response: "Hi there! 👋 I'm **Sarah**, your 24/7 assistant at **iTech Network Africa**. I'm here to help with our services, pricing, projects, team, and more. What can I help you with today?",
  },
  {
    patterns: [/founder|wilmot|kerkulah|executive director|who (started|created|founded|runs|owns|leads)/i],
    response: "**iTech Network Africa** was founded by **Wilmot Kerkulah** in Monrovia, Liberia in **2023**! 🌍\n\nWilmot is the Founder & Executive Director — the visionary entrepreneur who set out to bridge the technological divide in West Africa. He has a background in enterprise software, digital strategy, and business development.\n\nHis quote: *\"African enterprises deserve world-class technology. My mission is to make that a reality — one solution at a time.\"*\n\nRead his full profile at **/team/wilmot-kerkulah**.",
  },
  {
    patterns: [/team|staff|employee|who work|people (at|behind)|meet (the|your)/i],
    response: "Meet the talented team behind **iTech Network Africa**! 👥\n\n• **Wilmot Kerkulah** — Founder & Executive Director\n• **Foday Kabah** — Full Stack Developer\n• **Alvina Dahn** — Finance Officer\n• **James Kerkula** — Operations Associate\n• **Dorcas Kollie** — Administrative Officer\n\nAll based in Monrovia, Liberia and united by a mission to transform Africa through technology. 🌍\n\nVisit **/about#our-team** for full profiles.",
  },
  {
    patterns: [/who are you|about (you|the company|itech)|what is itech|tell me about|history|when (was|were|did)|founded|established/i],
    response: "**iTech Network Africa** is a full-service technology company founded in **2023** by **Wilmot Kerkulah** in Monrovia, Liberia! 🌍\n\nWe started as a specialised IT consultancy and rapidly grew into a comprehensive technology powerhouse serving:\n• **30+ enterprise clients** across **10+ countries**\n• Africa, Europe & North America\n• Industries from healthcare and finance to government and NGOs\n\nOur mission: *African enterprises deserve world-class technology.*\n\nLearn more at **/about**.",
  },
  {
    patterns: [/pric(e|ing|es)|cost|how much|quote|budget|fee|rate/i],
    response: "Here's an overview of our starting prices! 💰\n\n**Website Packages:** Starter $350 • Business $750 • Professional $1,500 • Enterprise from $3,000\n**Hosting:** $120–$800+/year\n**CRM Software:** from $49/month\n**POS Systems:** from $299\n**School Management:** from $299/year\n**Inventory Software:** from $99/month\n**Business Email:** from $3/user/month\n\nAll prices are starting points — final quotes depend on your specific needs. Visit **/pricing** for the full breakdown, or book a **free consultation** at **/consultation** for a custom proposal!",
  },
  {
    patterns: [/what (services|do you (offer|provide|do))|services (you|do you)|your services/i],
    response: "We offer a full range of technology services across Africa! 🛠️\n\n• **Web Design & Development** — Corporate, e-commerce, government sites\n• **Mobile App Development** — iOS & Android, native & cross-platform\n• **Software Development** — Custom ERP, CRM, POS, management systems\n• **Digital Marketing** — SEO, Google Ads, social media\n• **Cloud & IT Services** — AWS, Azure, Google Cloud\n• **Cybersecurity** — Audits, penetration testing, threat protection\n• **AI Solutions** — Chatbots, automation, analytics\n• **Graphic Design & Branding**\n• **Networking & Infrastructure** — CCTV, Wi-Fi, access control\n• **ICT Training** — Microsoft Office, AI tools, programming\n• And more!\n\nVisit **/services** or ask me about any specific service!",
  },
  {
    patterns: [/contact|reach|get in touch|email|phone|call|talk to (someone|the team)/i],
    response: "Here's how to reach **iTech Network Africa**! 📩\n\n• **Phone:** +231 761 798 796\n• **Email:** itechnetworkafrica@gmail.com\n• **Contact form:** **/contact**\n• **Free consultation:** **/consultation**\n• **Support tickets:** **/support**\n• **Hours:** Mon–Fri 8:00 AM – 6:00 PM WAT | Tech Support: 24/7\n\nWe typically respond within 1 business day.",
  },
  {
    patterns: [/web(site|site design| design| development| dev)|(build|create|make) (a |my |our )?(website|web app|site)/i],
    response: "We build **stunning, fast, conversion-optimised websites** for every industry! 🌐\n\nPackages start from:\n• **Starter** — $350 (5 pages)\n• **Business** — $750 (12 pages + CMS)\n• **Professional** — $1,500 (25 pages + portal)\n• **Enterprise** — from $3,000 (fully custom)\n\nAll sites are mobile-friendly, fast, and SEO-ready. Book a **free consultation** at **/consultation** to get started!",
  },
  {
    patterns: [/mobile (app|application)|ios|android|app (development|dev|build)/i],
    response: "We develop **native and cross-platform mobile apps** for iOS and Android! 📱\n\nFrom consumer apps to enterprise & healthcare solutions. Book a **free consultation** at **/consultation** to discuss your app idea — we'll walk you through the process, timeline, and cost.",
  },
  {
    patterns: [/\bai\b|artificial intelligence|machine learning|chatbot|automation|predictive/i],
    response: "Our **AI Solutions** team is ready to transform your business! 🤖\n\nWe build:\n• Custom AI chatbots (like me! 😄)\n• Business process automation\n• Predictive analytics & ML models\n• Computer vision systems\n• Document processing & OCR\n• Data dashboards & AI-powered recommendations\n\nVisit **/ai-solutions** to learn more. Book a **free consultation** at **/consultation** to explore how AI can help your specific business!",
  },
  {
    patterns: [/cyber(security)?|security audit|penetration test|hacking|data breach|protect (data|system)/i],
    response: "Cybersecurity is critical — and we take it seriously! 🔒\n\nOur services include:\n• Security audits & vulnerability assessments\n• Penetration testing\n• Threat monitoring & incident response\n• Firewall & network security\n• Data protection & compliance\n• Employee security training\n\nDon't wait for a breach! Book a **free consultation** at **/consultation** to assess your security posture.",
  },
  {
    patterns: [/cloud|aws|azure|google cloud|hosting|server|infrastructure|migration/i],
    response: "We provide **secure, scalable cloud & IT services** on the world's leading platforms! ☁️\n\nHosting packages start from **$120/year**. We cover AWS, Azure, and Google Cloud — including migration, setup, backup & disaster recovery, DevOps, and managed hosting.\n\nBook a **free consultation** at **/consultation** to find the right cloud solution for your business!",
  },
  {
    patterns: [/support|help|issue|problem|not working|broken|fix|technical/i],
    response: "Our **24/7 support team** is here to help! 🔧\n\n**Support tiers:**\n• **Standard** — 24-hour email response\n• **Priority** — <4 hour response + dedicated Slack\n• **Dedicated** — <1 hour, 24/7, named account engineer\n\nSubmit a ticket at **/support** or email **itechnetworkafrica@gmail.com**. Can you describe the issue?",
  },
  {
    patterns: [/consultation|book|appointment|meeting|schedule|demo|free call/i],
    response: "Booking a **free consultation** is the perfect first step! 📅\n\nHead to **/consultation**, fill in a quick form, and our team will reach out to schedule a call at your convenience. No commitment, no pressure — just a friendly conversation about your technology needs.",
  },
  {
    patterns: [/career|job|hiring|vacancy|opening|work (at|for|with)|join (the |your |itech)/i],
    response: "We're always looking for talented people to join the **iTech Network Africa** team! 🚀\n\n**Open roles:**\n• Senior Full-Stack Engineer\n• Machine Learning Researcher\n• Enterprise Software Sales\n• UI/UX Product Designer\n• Cloud Infrastructure Architect\n• Technical Support Specialist\n• DevOps Engineer\n• Project Manager\n\n**Benefits:** Health & wellness, remote-first, learning budget, competitive global salary.\n\nApply at **/careers**!",
  },
  {
    patterns: [/portfolio|project(s)?|past work|examples?|case stud|what have you built/i],
    response: "We're proud of the work we've delivered! 🎨\n\n• **Health Tech Liberia** — Digital health & telemedicine platform\n• **Galaxy International** — Corporate site with CMS & brand identity\n• **B4P CODEFOUND** — NGO site with donation integration\n• **DKS Incubation Center** — Institution site with application portal\n• **Lewanah LLC** — US-based e-commerce platform\n• **Agrolite** — Agricultural organisation website\n\nSee more at **/portfolio** and **/projects**!",
  },
  {
    patterns: [/partner(ship)?|resell|referral|affiliate|collaborate/i],
    response: "We love building win-win partnerships! 🤝\n\nOur current partners:\n• **Lumigrow Digital** — Creative digital agency\n• **Capacity For Youth (C4Y)** — Pan-African youth empowerment NGO\n• **Health Tech Liberia** — Digital health infrastructure\n• **Softnet Africa** — Pan-African software & network firm\n• **B4P CODEFOUND** — Women & youth coding education NGO\n\nInterested in partnering? Visit **/partners** or contact us at **/contact**.",
  },
  {
    patterns: [/train(ing)?|course|learn|education|workshop|microsoft office|skill/i],
    response: "We offer **hands-on ICT training** for individuals and corporate teams! 🎓\n\n• Microsoft Office Suite (Word, Excel, PowerPoint)\n• Cybersecurity awareness\n• AI tools for business\n• Programming fundamentals\n• Cloud computing basics\n• Digital marketing essentials\n\nContact us at **/contact** to arrange training for your team!",
  },
  {
    patterns: [/where (are you|is itech)|locat(ion|ed)|address|liberia|monrovia|country|africa|office/i],
    response: "**iTech Network Africa** is headquartered in **Monrovia, Liberia** 🌍 — founded there in 2023 by Wilmot Kerkulah.\n\nWe now operate across **10+ countries** in Africa, Europe, and North America, with regional hubs in West Africa (Ghana, Nigeria, Sierra Leone) and East Africa.\n\nContact us at **/contact** or call **+231 761 798 796**.",
  },
  {
    patterns: [/^(bye|goodbye|thanks?|thank you|cheers|ok thanks|that'?s all|no thanks)/i],
    response: "You're very welcome! 😊 It was great chatting with you. I'm here 24/7 whenever you need me.\n\nYou can also reach us at **itechnetworkafrica@gmail.com** or **+231 761 798 796**. Have a wonderful day! 🌟",
  },
];

function fallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.patterns.some((p) => p.test(msg))) return entry.response;
  }
  return `That's a great question! 🤔 I want to make sure you get the most accurate answer.\n\nFor the best assistance:\n• **Browse our website** — most answers are just a click away!\n• **Contact our team** at **/contact** or **itechnetworkafrica@gmail.com**\n• **Call us** at **+231 761 798 796** (Mon–Fri 8am–6pm WAT)\n• **Book a free consultation** at **/consultation** — our experts will personally assist you\n\nIs there anything else I can help you with?`;
}

/* ─────────────────────────────────────────────
   ROUTE: POST /api/chat
   ───────────────────────────────────────────── */
router.post("/chat", async (req, res) => {
  const { messages } = req.body as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required." });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  /* ─── Fallback: built-in knowledge base ─── */
  if (!apiKey) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    res.json({ message: fallbackResponse(lastUser?.content ?? "") });
    return;
  }

  /* ─── OpenAI mode ─── */
  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 600,
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    res.json({ message: text || fallbackResponse("") });
  } catch (err: unknown) {
    console.error("Chat error:", err);
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    res.json({ message: fallbackResponse(lastUser?.content ?? "") });
  }
});

export default router;

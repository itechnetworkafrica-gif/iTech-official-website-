import { Router } from "express";
import OpenAI from "openai";

const router = Router();

/* ─────────────────────────────────────────────
   SYSTEM PROMPT — fed to OpenAI when available
   ───────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are Sarah, a friendly, warm, and highly knowledgeable 24/7 virtual assistant for iTech Network Africa — a leading full-service technology company delivering cutting-edge ICT solutions across Africa and beyond.

Your personality:
- Warm, enthusiastic, conversational, and genuinely helpful
- You love technology and get excited when helping people find the right solution
- You use first person ("I", "we") naturally when speaking on behalf of the company
- Keep answers concise but informative; use line breaks for readability
- Use 1-2 relevant emojis per message to stay engaging — never overdo it
- Always end with a helpful follow-up offer or next step
- Never make up specific prices or guarantees — direct users to /pricing or /consultation
- If you are asked something you genuinely don't know, say so honestly and offer to connect them with the team

CRITICAL RULE: Only answer based on the verified company information below. Do NOT invent or guess facts about the company, team, pricing, or projects. If you're unsure, say "I'd recommend reaching out to our team directly at /contact or itechnetworkafrica@gmail.com for the most accurate answer."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPANY OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Company Name: iTech Network Africa
Founded: 2023
Headquarters: Monrovia, Liberia
Industry: Information & Communication Technology (ICT)
Operations: Global — 10+ countries across Africa, Europe, and North America
Contact Email: itechnetworkafrica@gmail.com
Website: itechnetworkafrica.com
Social Media: LinkedIn, Twitter/X, Instagram, Facebook — all @itechnetworkafrica

Key Stats:
- Founded: 2023
- 10+ countries served
- 30+ enterprise clients
- 20+ projects delivered
- 5 core team members
- 99% client satisfaction

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPANY STORY & HISTORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
iTech Network Africa was founded in 2023 by Wilmot Kerkulah in Monrovia, Liberia, with a singular mission: to bridge the technological divide in West Africa. What started as a specialised IT consultancy rapidly evolved into a comprehensive technology powerhouse.

Timeline:
- 2023: Founded in Monrovia, Liberia by Wilmot Kerkulah. Secured initial software development and IT consulting projects with local businesses, NGOs, and international institutions.
- 2024: Launched cybersecurity, cloud infrastructure, and AI solutions divisions. Extended delivery into North America and Europe, partnering with financial institutions, NGOs, and government agencies across four continents.
- 2025: Operating in 10+ countries across Africa, Europe, and North America. 20+ projects delivered for 30+ enterprise clients worldwide.

Mission: To empower businesses, governments, and communities across Africa through innovative technology, AI solutions, enterprise software, and end-to-end digital transformation — building scalable systems that solve real-world challenges.

Vision: To be the catalyst for Africa's technological renaissance — creating a digitally integrated continent where every enterprise, from startup to government, has access to world-class infrastructure and software. Goal: Africa's most trusted technology brand, present in 50+ countries by 2030.

Core Values: Innovation, Integrity, Impact, Inclusivity, Collaboration, Excellence.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOUNDER & LEADERSHIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Founder & Executive Director: Wilmot Kerkulah
- The founder and driving force behind iTech Network Africa
- Founded the company in Monrovia, Liberia in 2023
- Background in enterprise software, digital strategy, and business development
- Personally led the company's first contracts and assembled the founding team
- Advocates for closing the digital divide: champions free coding bootcamps, women-in-tech initiatives, and SME digital support programmes
- Quote: "African enterprises deserve world-class technology. My mission is to make that a reality — one solution at a time."
- Location: Monrovia, Liberia
- Profile: /team/wilmot-kerkulah

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FULL TEAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Wilmot Kerkulah — Founder & Executive Director (Leadership) | /team/wilmot-kerkulah
   Sets company strategy, manages key enterprise partnerships, oversees major client engagements, leads business development across new markets.

2. Foday Kabah — Full Stack Developer (Engineering) | /team/foday-kabah
   Builds robust web and mobile applications, crafting seamless digital experiences that power the company's enterprise solutions portfolio.

3. Alvina Dahn — Finance Officer (Finance & Operations) | /team/alvina-dahn
   Manages financial operations, budgeting, and reporting to keep the company on a strong fiscal footing.

4. James Kerkula — Operations Associate (Operations) | /team/james-kerkula
   Supports day-to-day operational functions and project coordination across the company's growing client base.

5. Dorcas Kollie — Administrative Officer (Administration) | /team/dorcas-kollie
   Oversees administrative functions and client communications; often the first point of contact for new clients and partners.

Full team page: /about#our-team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUR SERVICES (with page links)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Web Design & Development (/services/web-development) — Stunning, fast websites for every industry: landing pages, corporate sites, e-commerce, enterprise portals
• Software Development (/services/software-development) — Bespoke ERP, CRM, management systems, and custom enterprise software
• Mobile App Development (/services/mobile-development) — Native and cross-platform iOS & Android apps
• Digital Marketing (/services/digital-marketing) — SEO, social media management, lead generation, PPC, content marketing
• Graphic Design & Branding (/services/graphic-design) — Professional visual identities, logos, marketing collateral, creative assets
• UI/UX Design (/services/ui-ux-design) — User-centred interfaces that drive engagement and conversions
• Cloud & IT Services (/services/cloud-services) — AWS, Azure, and Google Cloud infrastructure, migration, and management
• Cybersecurity (/services/cybersecurity) — Security audits, penetration testing, threat protection, compliance
• Networking & Infrastructure (/services/networking) — Network installation, CCTV, access control, structured cabling, VoIP
• IT Consulting (/services/it-consulting) — Strategic technology advisory and digital transformation roadmaps
• AI Solutions (/ai-solutions) — Custom AI tools, chatbots, automation, machine learning, data analytics
• Creative Media (/services/creative-media) — Professional photography, videography, motion graphics, 3D animation
• Printing & Promotional (/services/printing) — Large-format printing, branded merchandise, signage, banners
• Technical Support (/support) — 24/7 remote and on-site IT support, hardware repairs, helpdesk
• Business Solutions (/services/business-solutions) — Digital payments, customer portals, e-signature, document management
• ICT Training (/services/ict-training) — Microsoft Office, cybersecurity, AI tools, programming, and tech skills training

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PORTFOLIO PROJECTS (verified)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Health Tech Liberia (healthtech-liberia.org) — Health technology platform connecting patients and providers across Liberia with digital health records and telemedicine capabilities.
2. Galaxy International (galaxyinternational.com) — Corporate website with full CMS, responsive design, and brand identity system for an international business group.
3. B4P CODEFOUND (b4pcodefound.org) — Website for a women and youth-led NGO operating in Liberia and the diaspora, featuring program pages, impact reporting, and donation integration for coding education.
4. DKS Incubation Center (dksincubationcenter.org) — Institution website with a fully integrated online application portal for startup founders and incubation program applicants.
5. Lewanah LLC (lewanahllc.com) — E-commerce platform for a US-based digital brand with instant delivery, product management, and payment processing.
6. Agrolite (agrolite.org) — Agricultural organisation website with editorial blog, photo gallery, and outreach resources for farming communities.

Portfolio page: /portfolio | Projects showcase: /projects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTNERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Lumigrow Digital (lumigrowdigitalagency.online) — Creative digital agency: brand strategy, web design, marketing
• Capacity For Youth / C4Y (youthcapacity.org) — NGO empowering young people across Africa
• Health Tech Liberia (healthtech-liberia.org) — Digital health infrastructure and telemedicine
• Softnet Africa (softnetafrica.com) — Pan-African software development and network infrastructure
• B4P CODEFOUND (b4pcodefound.org) — Women and youth-led NGO bridging the coding skills gap

Partners page: /partners

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INDUSTRIES WE SERVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Healthcare, Finance & Fintech, Retail & E-commerce, Education & EdTech, Government & Public Sector, Manufacturing, Hospitality & Tourism, NGOs & Nonprofits, Real Estate, Logistics & Supply Chain

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CSR & SOCIAL INITIATIVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Tech Education Initiative — Free coding bootcamps and digital literacy programs reaching 2,000+ youth across rural communities each year
• Green Technology — Committed to carbon-neutral operations by 2026 through cloud-first infrastructure and renewable energy adoption
• Women in Tech — Scholarship programs and mentorship for women in STEM, with a goal of 50% female workforce by 2027
• SME Digital Support — Subsidised technology packages helping small African businesses compete in the digital economy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY PAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Home /, About /about, Services /services, AI Solutions /ai-solutions, Solutions /solutions, Products /products, Portfolio /portfolio, Projects /projects, Industries /industries, Partners /partners, Resources /resources, Blog /blog, News /news, Careers /careers, Support /support, Contact /contact, Pricing /pricing, Free Consultation /consultation, Client Portal /portal, Privacy Policy /privacy-policy, Terms /terms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Guide users to the most relevant page using the links above
- For pricing questions → /pricing or suggest a free consultation at /consultation
- For technical support → /support
- For project enquiries → /contact or /consultation
- For careers → /careers
- If a user is interested in a service, invite them to book a FREE consultation
- For questions outside the verified facts above, offer to connect them via /contact
- Be reassuring about timelines, quality, and support
- Response time: we aim to respond within 1 business day for emails; support team is available 24/7
- Never invent team members, project names, client names, prices, or company history not listed above`;

/* ─────────────────────────────────────────────
   BUILT-IN KNOWLEDGE BASE FALLBACK
   Used when OPENAI_API_KEY is not configured.
   Ensures the chatbot is always 24/7 functional.
   ───────────────────────────────────────────── */
interface KBEntry {
  patterns: RegExp[];
  response: string;
}

const KNOWLEDGE_BASE: KBEntry[] = [
  // Greetings
  {
    patterns: [/^(hi|hello|hey|howdy|good\s*(morning|afternoon|evening)|hola|sup|what'?s up)/i],
    response: "Hi there! 👋 I'm **Sarah**, your 24/7 assistant at **iTech Network Africa**. I'm here to help you with our services, pricing, projects, and more. What can I help you with today?",
  },
  // Founder / leadership questions
  {
    patterns: [/founder|who (started|created|built|established|set up|founded)|wilmot|kerkulah|executive director|ceo|head of|who (is|runs|owns|leads) (itech|the company)/i],
    response: "**iTech Network Africa** was founded by **Wilmot Kerkulah** 🌍\n\nWilmot is the Founder & Executive Director — the visionary entrepreneur who established the company in Monrovia, Liberia in **2023** with a bold mission: to bridge the technological divide in West Africa.\n\nHe has a background in enterprise software, digital strategy, and business development, and personally led the company's first contracts. He's also a champion for closing the digital divide — running free coding bootcamps and women-in-tech initiatives.\n\n📖 Read his full profile at **/team/wilmot-kerkulah**. Would you like to know more about our team?",
  },
  // Team questions
  {
    patterns: [/team|staff|employee|who work|people (at|behind|in)|meet (the|your)/i],
    response: "Meet the talented team behind **iTech Network Africa**! 👥\n\n• **Wilmot Kerkulah** — Founder & Executive Director\n• **Foday Kabah** — Full Stack Developer\n• **Alvina Dahn** — Finance Officer\n• **James Kerkula** — Operations Associate\n• **Dorcas Kollie** — Administrative Officer\n\nAll based in Monrovia, Liberia, united by a mission to transform Africa through technology. 🌍\n\nVisit **/about#our-team** to read full profiles. Is there a specific team member you'd like to know more about?",
  },
  // About / company history / founding
  {
    patterns: [/who are you|about (you|the company|itech)|your company|what is itech|tell me about|when (was|were|did)|history|founded|established|start(ed)?/i],
    response: "**iTech Network Africa** is a full-service technology company founded in **2023** by **Wilmot Kerkulah** in Monrovia, Liberia! 🌍\n\nWe started as a specialised IT consultancy and rapidly grew into a comprehensive technology powerhouse. Today we:\n• Serve **30+ enterprise clients** across **10+ countries**\n• Have delivered **20+ projects** across Africa, Europe & North America\n• Offer everything from web development and AI to cybersecurity and cloud\n\nOur mission: *African enterprises deserve world-class technology.*\n\nLearn more at **/about**. Anything specific you'd like to know?",
  },
  // Portfolio / projects
  {
    patterns: [/portfolio|project(s)?|past work|examples?|case stud(y|ies)|what have you built|clients?/i],
    response: "We're proud of the work we've delivered! 🎨\n\nSome of our notable projects:\n• **Health Tech Liberia** — Digital health platform with telemedicine capabilities\n• **Galaxy International** — Corporate website with full CMS & brand identity\n• **B4P CODEFOUND** — NGO website with donation integration\n• **DKS Incubation Center** — Institution site with application portal\n• **Lewanah LLC** — E-commerce platform for a US-based brand\n• **Agrolite** — Agricultural organisation website with blog & gallery\n\nSee more at **/portfolio** and **/projects**. Would you like details on any of these?",
  },
  // Services overview
  {
    patterns: [/what (services|do you (offer|provide|do))|services (you|do you)|your services/i],
    response: "We offer a wide range of technology services across Africa! 🛠️\n\n• **Web Design & Development** — Stunning websites for any industry\n• **Mobile App Development** — iOS & Android apps\n• **Software Development** — Custom ERP, CRM & enterprise systems\n• **Digital Marketing** — SEO, social media & lead generation\n• **Cloud & IT Services** — AWS, Azure, Google Cloud\n• **Cybersecurity** — Security audits & threat protection\n• **AI Solutions** — Chatbots, automation & analytics\n• **Graphic Design & Branding**\n• **Networking & Infrastructure**\n• **ICT Training** & much more!\n\nVisit **/services** to explore each one. Would you like details on any specific service?",
  },
  // Pricing
  {
    patterns: [/pric(e|ing|es)|cost|how much|quote|budget|fees?|rate/i],
    response: "Our pricing is tailored to each project's needs — we don't believe in one-size-fits-all! 💰\n\nFor a general overview, visit our **Pricing page** at **/pricing**.\n\nFor a custom quote specific to your project, I'd recommend booking a **free consultation** at **/consultation** — our team will assess your needs and give you a detailed proposal at no cost. Shall I help you with that?",
  },
  // Contact
  {
    patterns: [/contact|reach|get in touch|email|phone|call|talk to (someone|a person|the team)/i],
    response: "You can reach the iTech Network Africa team in several ways! 📩\n\n• **Email:** itechnetworkafrica@gmail.com\n• **Contact form:** Visit **/contact**\n• **Book a consultation:** Visit **/consultation** (it's free!)\n• **Support issues:** Visit **/support**\n\nWe typically respond within 1 business day. How can we assist you?",
  },
  // Web development
  {
    patterns: [/web(site|site design| design| development| dev)|(build|create|make) (a |my |our )?(website|web app|web portal|site)/i],
    response: "We build **stunning, fast, and conversion-optimised websites** for every industry! 🌐\n\nOur web development services include:\n• Corporate & business websites\n• E-commerce stores\n• Landing pages & marketing sites\n• Enterprise web portals\n• Progressive Web Apps (PWAs)\n\nWe use the latest technologies to ensure your site is fast, mobile-friendly, and SEO-ready.\n\nReady to get started? Book a **free consultation** at **/consultation** and let's bring your vision to life! 🚀",
  },
  // Mobile app
  {
    patterns: [/mobile (app|application)|ios|android|app (development|dev|build)/i],
    response: "We develop **native and cross-platform mobile apps** for iOS and Android! 📱\n\nOur mobile development team builds:\n• Consumer apps\n• Enterprise & business apps\n• E-commerce & marketplace apps\n• On-demand service apps\n• Custom integrations with your existing systems\n\nInterested? Book a **free consultation** at **/consultation** to discuss your app idea. We'll walk you through the process and timelines!",
  },
  // AI Solutions
  {
    patterns: [/\bai\b|artificial intelligence|machine learning|chatbot|automation|data analytic/i],
    response: "Our **AI Solutions** team is ready to transform your business! 🤖\n\nWe build:\n• Custom AI chatbots (like me! 😄)\n• Business process automation\n• Data analytics & dashboards\n• Predictive models & machine learning\n• Document processing & OCR\n• AI-powered recommendations\n\nVisit **/ai-solutions** to see what's possible. Book a **free consultation** at **/consultation** to explore how AI can help your specific business!",
  },
  // Digital Marketing
  {
    patterns: [/digital marketing|seo|social media|marketing|lead generation|google ads|ppc/i],
    response: "Our **Digital Marketing** team helps businesses grow their online presence and generate real leads! 📈\n\nServices include:\n• Search Engine Optimisation (SEO)\n• Social media management & advertising\n• Google Ads & PPC campaigns\n• Content marketing & copywriting\n• Email marketing campaigns\n• Lead generation strategies\n\nReady to grow? Visit **/services** or book a **free consultation** at **/consultation** to discuss your marketing goals!",
  },
  // Cybersecurity
  {
    patterns: [/cyber(security)?|security audit|penetration test|hacking|data breach|protect (my |our )?(data|system|business)/i],
    response: "Cybersecurity is critical in today's digital world — and we take it seriously! 🔒\n\nOur cybersecurity services include:\n• Security audits & vulnerability assessments\n• Penetration testing\n• Threat monitoring & incident response\n• Data protection & compliance\n• Employee security training\n• Firewall & network security\n\nDon't wait until after a breach! Book a **free consultation** at **/consultation** to assess your current security posture.",
  },
  // Cloud services
  {
    patterns: [/cloud|aws|azure|google cloud|cloud migration|hosting|server|infrastructure/i],
    response: "We provide **secure, scalable cloud & IT services** on the world's leading platforms! ☁️\n\nOur cloud services include:\n• Cloud migration & setup (AWS, Azure, Google Cloud)\n• Infrastructure design & management\n• Backup & disaster recovery\n• DevOps & CI/CD pipelines\n• Managed hosting\n• Cost optimisation\n\nLet's find the right cloud solution for your business. Book a **free consultation** at **/consultation**!",
  },
  // Support
  {
    patterns: [/support|help|issue|problem|not working|broken|fix|technical/i],
    response: "Our **24/7 support team** is here to help! 🔧\n\nYou can:\n• Submit a support ticket at **/support**\n• Email us at **itechnetworkafrica@gmail.com**\n• For urgent issues, visit **/contact** to reach us directly\n\nCan you tell me more about the issue you're experiencing? I'll help you find the fastest path to resolution!",
  },
  // Consultation / booking
  {
    patterns: [/consultation|book|appointment|meeting|schedule|demo|free call/i],
    response: "Booking a **free consultation** is the perfect first step! 📅\n\nJust head to **/consultation** — fill in a quick form and our team will reach out to schedule a call at your convenience. No commitment, no pressure — just a friendly chat about your technology needs.\n\nWould you like me to guide you there?",
  },
  // Careers / jobs
  {
    patterns: [/career|job|hiring|vacancy|opening|work (at|for|with)|join (the |your |itech)/i],
    response: "We're always on the lookout for talented, passionate people to join the **iTech Network Africa** team! 🚀\n\nVisit our **Careers page** at **/careers** to:\n• See current job openings\n• Learn about our company culture\n• Submit your application\n\nWe value innovation, collaboration, and a passion for technology. Is there a specific role or field you're interested in?",
  },
  // Partners
  {
    patterns: [/partner(ship)?|resell(er)?|referral|affiliate|collaborate/i],
    response: "We love building win-win partnerships! 🤝\n\nOur current partners include Lumigrow Digital, Capacity For Youth, Health Tech Liberia, Softnet Africa, and B4P CODEFOUND.\n\nVisit our **Partners page** at **/partners** to learn more. If you're interested in partnering with us — reach out via **/contact** and let's explore the opportunity together!",
  },
  // Graphic Design / Branding
  {
    patterns: [/graphic design|brand(ing)?|logo|visual identity|design(er)?|creative/i],
    response: "Our creative team delivers **world-class graphic design and branding** that makes your business stand out! 🎨\n\nServices include:\n• Logo design & visual identity\n• Brand guidelines\n• Marketing collateral (brochures, flyers, business cards)\n• Social media graphics\n• Presentation design\n• Packaging design\n\nReady to build a brand that turns heads? Visit **/services** or book a **free consultation** at **/consultation**!",
  },
  // Training
  {
    patterns: [/train(ing)?|course|learn|education|workshop|microsoft office|skill/i],
    response: "We offer **hands-on ICT training** for individuals and teams! 🎓\n\nTraining programmes include:\n• Microsoft Office Suite (Word, Excel, PowerPoint)\n• Cybersecurity awareness\n• AI tools for business\n• Programming fundamentals\n• Cloud computing basics\n• Digital marketing essentials\n\nVisit **/services** for more details or contact us at **/contact** to arrange corporate training for your team!",
  },
  // Location / where are you based
  {
    patterns: [/where (are you|is itech)|locat(ion|ed)|address|country|africa|office|liberia|monrovia/i],
    response: "**iTech Network Africa** is headquartered in **Monrovia, Liberia** 🌍 — founded there in 2023 by Wilmot Kerkulah.\n\nWe now operate in **10+ countries** across Africa, Europe, and North America, delivering technology solutions to clients from startups to large enterprises.\n\nFor our contact details and to reach us, visit **/contact** or email **itechnetworkafrica@gmail.com**. We'd love to connect!",
  },
  // Bye / thanks
  {
    patterns: [/^(bye|goodbye|thanks?|thank you|cheers|ok thanks|that'?s all|no thanks)/i],
    response: "You're welcome! 😊 It was great chatting with you. Don't hesitate to come back anytime — I'm here 24/7!\n\nIf you need anything else, you can also reach us at **itechnetworkafrica@gmail.com**. Have a wonderful day! 🌟",
  },
];

function fallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();

  for (const entry of KNOWLEDGE_BASE) {
    if (entry.patterns.some((p) => p.test(msg))) {
      return entry.response;
    }
  }

  // Generic fallback
  return `That's a great question! 🤔 I want to make sure you get the most accurate answer.\n\nFor the best assistance, I'd recommend:\n• **Browsing our website** — most answers are just a click away!\n• **Contacting our team** at **/contact** or **itechnetworkafrica@gmail.com**\n• **Booking a free consultation** at **/consultation** — our experts will personally assist you\n\nIs there anything else I can help you with right now?`;
}

/* ─────────────────────────────────────────────
   ROUTE: POST /api/chat
   Returns plain JSON — avoids SSE proxy-buffering
   issues in reverse-proxy environments.
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
    const text = fallbackResponse(lastUser?.content ?? "");
    res.json({ message: text });
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

    const text = completion.choices[0]?.message?.content ?? "";
    res.json({ message: text });
  } catch (err: unknown) {
    // On OpenAI error, fall back gracefully to knowledge base
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const text = fallbackResponse(lastUser?.content ?? "");
    res.json({ message: text });
  }
});

export default router;

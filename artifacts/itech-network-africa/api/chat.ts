/* ─────────────────────────────────────────────────────────────────────────────
   Vercel Serverless Function: POST /api/chat
   Sarah AI chatbot — trained on all iTech Network Africa website data.
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
- 2024: Launched cybersecurity, cloud, and AI divisions. Expanded to North America and Europe.
- 2025: Operating in 10+ countries. 20+ projects delivered for 30+ enterprise clients.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEAM (all based in Monrovia, Liberia — joined 2023)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Wilmot Kerkulah — Founder & Executive Director
   Sets company strategy, manages enterprise partnerships, leads business development.
   Expertise: Strategic Leadership, Digital Transformation, IT Consulting.
   Quote: "African enterprises deserve world-class technology. My mission is to make that a reality — one solution at a time."
   Profile: /team/wilmot-kerkulah

2. Foday Kabah — Full Stack Developer
   Builds web and mobile applications for the enterprise solutions portfolio.
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
   Oversees administrative functions and client communications.
   Expertise: Office Administration, HR Support.
   Profile: /team/dorcas-kollie

Full team page: /about#our-team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Web Design & Development (/services/web-development)
   Corporate & business websites, e-commerce stores, landing pages, government/NGO/university portals, PWAs. Fast, mobile-friendly, SEO-ready.

2. Software Development (/services/software-development)
   Custom ERP, CRM, Hospital Management Systems, School Management Systems, HR & Payroll, POS Systems, API integrations.

3. Mobile App Development (/services/mobile-development)
   Native Android & iOS apps, cross-platform apps (React Native/Flutter) for business, healthcare, education, e-commerce.

4. Digital Marketing (/services/digital-marketing)
   SEO, Google Ads/PPC, social media management & advertising, content marketing, email & SMS marketing, lead generation.

5. Graphic Design & Branding (/services/graphic-design)
   Logo design, brand identity, brand guidelines, marketing collateral, social media graphics, presentation design, packaging.

6. UI/UX Design (/services/ui-ux-design)
   User research, wireframing, prototyping, and user-centred interface design.

7. Cloud & IT Services (/services/cloud-services)
   Cloud migration & setup (AWS, Azure, Google Cloud), Microsoft 365 & Google Workspace, managed hosting, backup & disaster recovery, DevOps & CI/CD.

8. Cybersecurity (/services/cybersecurity)
   Security audits & vulnerability assessments, penetration testing, threat monitoring & incident response, firewall & network security, data protection & compliance, security training.

9. Networking & Infrastructure (/services/networking)
   Wi-Fi & network installation, CCTV & surveillance, access control & biometrics, structured cabling, VoIP telephony.

10. IT Consulting (/services/it-consulting)
    Strategic technology advisory, digital transformation roadmaps, technology due diligence.

11. AI Solutions (/ai-solutions)
    Custom AI chatbots, business process automation, predictive analytics & ML models, computer vision, document processing & OCR, AI-powered recommendation engines.

12. Creative Media (/services/creative-media)
    Professional photography, videography, motion graphics, 3D animation.

13. Printing & Promotional (/services/printing)
    Large-format printing, branded merchandise, signage, banners.

14. Technical Support (/support)
    24/7 remote and on-site IT support, hardware repairs, helpdesk ticketing.

15. Business Solutions (/services/business-solutions)
    Digital payments, customer portals, e-signature, document management systems.

16. ICT Training (/services/ict-training)
    Microsoft Office Suite, cybersecurity awareness, AI tools, programming, cloud computing, digital marketing. For individuals and corporate teams.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCTS & PRICING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WEBSITE PACKAGES:
- Starter: $350 (5 pages, responsive design)
- Business: $750 (12 pages + CMS)
- Professional: $1,500 (25 pages + client portal)
- Enterprise: Starting $3,000 (fully custom)

WEB HOSTING (per year):
- Starter: $120/year | Business: $250/year | Professional: $450/year | Enterprise: from $800/year

BUSINESS EMAIL:
- Basic: from $3/user/month | Business: from $6/user/month | Enterprise: custom

POS SYSTEMS:
- Basic: from $299 | Multi-Branch: from $699 | Enterprise: custom

SCHOOL MANAGEMENT SYSTEM:
- Basic: from $299/year | Standard: from $599/year | Enterprise: custom

INVENTORY SOFTWARE:
- Starter: from $99/month | Growth: from $249/month | Enterprise: custom

CRM SOFTWARE:
- Starter: from $49/month | Team: from $149/month | Enterprise: custom

Note: All prices are starting prices. Final quotes depend on specific requirements. Visit /pricing or book a free consultation at /consultation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPORT TIERS & SLAs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Standard Support: Email response within 24 hours, business hours (Mon–Fri 8am–6pm WAT)
Priority Support: Response within 4 hours, priority queue, dedicated Slack channel
Dedicated Support: Response within 1 hour 24/7, named account engineer, proactive monitoring
Uptime SLA: 98.9% – 99.9% guaranteed | Submit tickets at: /support

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PORTFOLIO & PROJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Health Tech Liberia — Digital health platform with telemedicine capabilities
2. Galaxy International — Corporate website with CMS and brand identity
3. B4P CODEFOUND — NGO website with donation integration for coding education
4. DKS Incubation Center — Institution site with startup application portal
5. Lewanah LLC — US-based e-commerce platform with payment processing
6. Agrolite — Agricultural organisation website with blog and gallery
More at /portfolio and /projects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTNERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lumigrow Digital, Capacity For Youth (C4Y), Health Tech Liberia, Softnet Africa, B4P CODEFOUND
More at /partners

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INDUSTRIES SERVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Healthcare, Finance & Banking, Retail & E-commerce, Education & EdTech, Government & Public Sector, Manufacturing, Hospitality & Tourism, NGOs & Nonprofits, Telecommunications, Agriculture, Real Estate, Media, Logistics & Supply Chain
More at /industries

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAREERS — OPEN ROLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Senior Full-Stack Engineer, Machine Learning Researcher, Enterprise Software Sales, UI/UX Product Designer, Cloud Infrastructure Architect, Technical Support Specialist, DevOps Engineer, Project Manager.
Benefits: Health & wellness (dependents included), remote-first, annual learning budget, competitive global salary.
Apply at: /careers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CSR & SOCIAL INITIATIVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tech Education Initiative: Free coding bootcamps reaching 2,000+ youth/year
Green Technology: Carbon-neutral operations target by 2026
Women in Tech: Scholarships & mentorship; 50% female workforce goal by 2027
SME Digital Support: Subsidised tech packages for small African businesses

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY PAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/ Home | /about | /services | /ai-solutions | /solutions | /products | /portfolio | /projects | /industries | /partners | /resources | /blog | /news | /careers | /support | /contact | /pricing | /consultation (free) | /portal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- For pricing: share the relevant prices from above, then suggest /pricing or /consultation for custom quotes
- For support: direct to /support and itechnetworkafrica@gmail.com
- For project enquiries: direct to /consultation (free, no commitment)
- For careers: direct to /careers
- For services: describe from data above, then offer a free consultation
- Response time: 1 business day for email; technical support is 24/7
- When ready to start: guide to /consultation or /contact`;

/* ─── Built-in knowledge base fallback ─── */
interface KBEntry { patterns: RegExp[]; response: string; }

const KB: KBEntry[] = [
  { patterns: [/^(hi|hello|hey|howdy|good\s*(morning|afternoon|evening)|hola|sup)/i], response: "Hi there! 👋 I'm **Sarah**, your 24/7 assistant at **iTech Network Africa**. I'm here to help with our services, pricing, projects, team, and more. What can I help you with today?" },
  { patterns: [/founder|wilmot|kerkulah|executive director|who (started|created|founded|runs|owns|leads)/i], response: "**iTech Network Africa** was founded by **Wilmot Kerkulah** in Monrovia, Liberia in **2023**! 🌍\n\nWilmot is the Founder & Executive Director — the visionary behind the company's mission to bridge the technological divide in West Africa. His background spans enterprise software, digital strategy, and business development.\n\nRead his full profile at **/team/wilmot-kerkulah**." },
  { patterns: [/team|staff|employee|who work|people (at|behind)|meet (the|your)/i], response: "Meet the **iTech Network Africa** team! 👥\n\n• **Wilmot Kerkulah** — Founder & Executive Director\n• **Foday Kabah** — Full Stack Developer\n• **Alvina Dahn** — Finance Officer\n• **James Kerkula** — Operations Associate\n• **Dorcas Kollie** — Administrative Officer\n\nAll based in Monrovia, Liberia. Visit **/about#our-team** for full profiles." },
  { patterns: [/who are you|about (you|the company|itech)|what is itech|tell me about|history|when (was|were|did)|founded|established/i], response: "**iTech Network Africa** is a full-service technology company founded in **2023** by **Wilmot Kerkulah** in Monrovia, Liberia! 🌍\n\nWe serve **30+ enterprise clients** across **10+ countries** in Africa, Europe, and North America — from healthcare and finance to government and NGOs.\n\nOur mission: *African enterprises deserve world-class technology.*\n\nLearn more at **/about**." },
  { patterns: [/pric(e|ing|es)|cost|how much|quote|budget|fee|rate/i], response: "Here's a quick overview of our prices! 💰\n\n• **Website:** Starter $350 → Enterprise from $3,000\n• **Hosting:** $120–$800+/year\n• **CRM:** from $49/month\n• **POS Systems:** from $299\n• **School Management:** from $299/year\n• **Inventory Software:** from $99/month\n• **Business Email:** from $3/user/month\n\nVisit **/pricing** for the full breakdown, or book a **free consultation** at **/consultation** for a custom quote!" },
  { patterns: [/what (services|do you (offer|provide|do))|services (you|do you)|your services/i], response: "We offer a full range of technology services! 🛠️\n\n• **Web Design & Development** | • **Mobile App Development**\n• **Custom Software (ERP, CRM, POS)** | • **Digital Marketing & SEO**\n• **Cloud & IT Services** (AWS, Azure, GCP) | • **Cybersecurity**\n• **AI Solutions & Chatbots** | • **Graphic Design & Branding**\n• **Networking & Infrastructure** | • **ICT Training**\n• **Creative Media** | • **Technical Support 24/7**\n\nVisit **/services** or ask me about any specific one!" },
  { patterns: [/contact|reach|get in touch|email|phone|call|talk to (someone|the team)/i], response: "Here's how to reach us! 📩\n\n• **Phone:** +231 761 798 796\n• **Email:** itechnetworkafrica@gmail.com\n• **Contact form:** **/contact**\n• **Free consultation:** **/consultation**\n• **Support tickets:** **/support**\n• **Hours:** Mon–Fri 8am–6pm WAT | Tech Support: 24/7\n\nWe respond within 1 business day." },
  { patterns: [/web(site|site design| design| development| dev)|(build|create|make) (a |my |our )?(website|web app|site)/i], response: "We build **stunning, fast websites** for every industry! 🌐\n\n• **Starter** — $350 (5 pages)\n• **Business** — $750 (12 pages + CMS)\n• **Professional** — $1,500 (25 pages + portal)\n• **Enterprise** — from $3,000 (fully custom)\n\nAll sites are mobile-friendly, fast, and SEO-ready. Book a **free consultation** at **/consultation** to get started!" },
  { patterns: [/mobile (app|application)|ios|android|app (development|dev|build)/i], response: "We develop **native and cross-platform mobile apps** for iOS and Android! 📱\n\nFrom consumer apps to enterprise solutions in healthcare, education, and e-commerce. Book a **free consultation** at **/consultation** to discuss your app idea!" },
  { patterns: [/\bai\b|artificial intelligence|machine learning|chatbot|automation|predictive/i], response: "Our **AI Solutions** team transforms businesses! 🤖\n\n• Custom AI chatbots (like me! 😄)\n• Business process automation\n• Predictive analytics & ML models\n• Computer vision & document processing\n• Data dashboards & AI recommendations\n\nVisit **/ai-solutions** or book a **free consultation** at **/consultation**!" },
  { patterns: [/cyber(security)?|security audit|penetration test|hacking|data breach|protect (data|system)/i], response: "Cybersecurity is critical — and we take it seriously! 🔒\n\n• Security audits & vulnerability assessments\n• Penetration testing\n• Threat monitoring & incident response\n• Firewall & network security\n• Compliance & employee security training\n\nBook a **free consultation** at **/consultation** to assess your security posture." },
  { patterns: [/cloud|aws|azure|google cloud|hosting|server|infrastructure|migration/i], response: "We provide **secure, scalable cloud & IT services**! ☁️\n\nHosting from **$120/year**. We cover AWS, Azure, and Google Cloud — including migration, setup, backup, DevOps, and managed hosting.\n\nBook a **free consultation** at **/consultation**!" },
  { patterns: [/support|help|issue|problem|not working|broken|fix|technical/i], response: "Our **24/7 support team** is ready to help! 🔧\n\n• **Standard** — 24-hour email response\n• **Priority** — <4 hour response + dedicated Slack\n• **Dedicated** — <1 hour, 24/7, named account engineer\n\nSubmit a ticket at **/support** or email **itechnetworkafrica@gmail.com**." },
  { patterns: [/consultation|book|appointment|meeting|schedule|demo|free call/i], response: "Booking a **free consultation** is the perfect first step! 📅\n\nHead to **/consultation**, fill in a quick form, and our team will reach out at your convenience. No commitment, no pressure!" },
  { patterns: [/career|job|hiring|vacancy|opening|work (at|for|with)|join (the |your |itech)/i], response: "We're always looking for talented people! 🚀\n\n**Open roles:** Senior Full-Stack Engineer, ML Researcher, Enterprise Sales, UI/UX Designer, Cloud Architect, Technical Support Specialist, DevOps Engineer, Project Manager.\n\n**Benefits:** Health & wellness, remote-first, learning budget, competitive global salary.\n\nApply at **/careers**!" },
  { patterns: [/portfolio|project(s)?|past work|examples?|case stud|what have you built/i], response: "We're proud of our delivered work! 🎨\n\n• **Health Tech Liberia** — Digital health & telemedicine platform\n• **Galaxy International** — Corporate site with CMS & brand identity\n• **B4P CODEFOUND** — NGO site with donation integration\n• **DKS Incubation Center** — Application portal for startups\n• **Lewanah LLC** — US-based e-commerce platform\n• **Agrolite** — Agricultural organisation website\n\nSee more at **/portfolio** and **/projects**!" },
  { patterns: [/partner(ship)?|resell|referral|collaborate/i], response: "We love building win-win partnerships! 🤝\n\nOur partners: **Lumigrow Digital**, **Capacity For Youth (C4Y)**, **Health Tech Liberia**, **Softnet Africa**, **B4P CODEFOUND**.\n\nInterested in partnering? Visit **/partners** or contact us at **/contact**." },
  { patterns: [/train(ing)?|course|learn|education|workshop|microsoft office|skill/i], response: "We offer **hands-on ICT training** for individuals and corporate teams! 🎓\n\n• Microsoft Office Suite • Cybersecurity awareness • AI tools for business • Programming fundamentals • Cloud computing • Digital marketing\n\nContact us at **/contact** to arrange training!" },
  { patterns: [/where (are you|is itech)|locat(ion|ed)|address|liberia|monrovia|office/i], response: "**iTech Network Africa** is headquartered in **Monrovia, Liberia** 🌍 (founded there in 2023) with regional hubs in West Africa (Ghana, Nigeria, Sierra Leone) and East Africa.\n\nWe now operate in **10+ countries** across Africa, Europe, and North America.\n\nCall **+231 761 798 796** or visit **/contact**." },
  { patterns: [/^(bye|goodbye|thanks?|thank you|cheers|ok thanks|that'?s all|no thanks)/i], response: "You're very welcome! 😊 I'm here 24/7 whenever you need me.\n\nYou can also reach us at **itechnetworkafrica@gmail.com** or **+231 761 798 796**. Have a wonderful day! 🌟" },
];

function fallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();
  for (const entry of KB) {
    if (entry.patterns.some((p) => p.test(msg))) return entry.response;
  }
  return `That's a great question! 🤔 For the most accurate answer:\n\n• **Contact our team** at **/contact** or **itechnetworkafrica@gmail.com**\n• **Call us** at **+231 761 798 796** (Mon–Fri 8am–6pm WAT)\n• **Book a free consultation** at **/consultation** — our experts will personally assist you\n\nIs there anything else I can help you with?`;
}

function readBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    if (req.body !== undefined) {
      if (typeof req.body === 'string') return resolve(req.body);
      return resolve(JSON.stringify(req.body));
    }
    let data = '';
    req.on('data', (chunk: Buffer) => { data += chunk.toString(); });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  let messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  try {
    const raw = await readBody(req);
    const parsed = typeof raw === 'object' ? raw : JSON.parse(raw);
    messages = parsed.messages ?? [];
  } catch {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required.' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    res.status(200).json({ message: fallbackResponse(lastUser?.content ?? '') });
    return;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 600,
        temperature: 0.4,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!response.ok) throw new Error(`OpenAI ${response.status}`);

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const text = data.choices[0]?.message?.content?.trim() ?? '';
    res.status(200).json({ message: text || fallbackResponse('') });
  } catch (err) {
    console.error('Chat handler error:', err);
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    res.status(200).json({ message: fallbackResponse(lastUser?.content ?? '') });
  }
}

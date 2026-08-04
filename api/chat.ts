/* ─────────────────────────────────────────────────────────────────────────────
   Vercel Serverless Function: POST /api/chat
   Mirrors the Express route in artifacts/api-server/src/routes/chat.ts so the
   Sarah AI chatbot works on the static Vercel deployment.
   ───────────────────────────────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are Sarah, a friendly, warm, and highly knowledgeable 24/7 virtual assistant for iTech Network Africa — a leading full-service technology company delivering cutting-edge ICT solutions across Africa.

Your personality:
- Warm, enthusiastic, conversational, and genuinely helpful
- You love technology and get excited when helping people find the right solution
- You use first person ("I", "we") naturally
- Keep answers concise but informative; use line breaks for readability
- Use 1-2 relevant emojis per message to stay engaging — never overdo it
- Always end with a helpful follow-up offer or next step
- Never make up specific prices or guarantees — direct users to /pricing or /consultation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABOUT ITECH NETWORK AFRICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A full-service technology company serving individuals, startups, SMEs, and enterprises across Africa.
Contact: itechnetworkafrica@gmail.com
Website: itechnetworkafrica.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUR SERVICES (with page links)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Web Design & Development (/services/web-development) — Stunning, fast websites for every industry
• Software Development (/services/software-development) — Bespoke ERP, CRM, custom enterprise software
• Mobile App Development (/services/mobile-development) — Native and cross-platform iOS & Android apps
• Digital Marketing (/services/digital-marketing) — SEO, social media, lead generation, PPC
• Graphic Design & Branding (/services/graphic-design) — Visual identities, logos, marketing collateral
• UI/UX Design (/services/ui-ux-design) — User-centred interfaces
• Cloud & IT Services (/services/cloud-services) — AWS, Azure, Google Cloud
• Cybersecurity (/services/cybersecurity) — Security audits, penetration testing, threat protection
• Networking & Infrastructure (/services/networking) — Network installation, CCTV, VoIP
• IT Consulting (/services/it-consulting) — Strategic technology advisory
• AI Solutions (/ai-solutions) — Custom AI tools, chatbots, automation, analytics
• Creative Media (/services/creative-media) — Photography, videography, motion graphics
• Printing & Promotional (/services/printing) — Large-format printing, branded merchandise
• Technical Support (/support) — 24/7 remote and on-site IT support
• Business Solutions (/services/business-solutions) — Digital payments, customer portals
• ICT Training (/services/ict-training) — Microsoft Office, cybersecurity, AI tools, programming

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY PAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Home: / | About: /about | Services: /services | AI Solutions: /ai-solutions
Portfolio: /portfolio | Pricing: /pricing | Consultation (free): /consultation
Contact: /contact | Support: /support | Careers: /careers | Blog: /blog

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INDUSTRIES WE SERVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Healthcare, Finance & Fintech, Retail & E-commerce, Education, Government, Manufacturing, Hospitality, NGOs, Real Estate, Logistics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Guide users to the most relevant page using the links above
- For pricing → /pricing or suggest free consultation at /consultation
- For support → /support
- For project enquiries → /contact or /consultation
- Invite interested users to book a FREE consultation
- If asked about response time: 1 business day for emails; support team is 24/7`;

/* ─── Built-in knowledge base fallback ─── */
interface KBEntry { patterns: RegExp[]; response: string; }

const KB: KBEntry[] = [
  { patterns: [/^(hi|hello|hey|howdy|good\s*(morning|afternoon|evening)|hola)/i], response: "Hi there! 👋 I'm **Sarah**, your 24/7 assistant at **iTech Network Africa**. How can I help you today?" },
  { patterns: [/what (services|do you (offer|provide|do))|services (you|do you)|your services/i], response: "We offer a wide range of technology services across Africa! 🛠️\n\n• **Web Design & Development**\n• **Mobile App Development**\n• **Custom Software Development**\n• **Digital Marketing & SEO**\n• **Cloud & IT Services**\n• **Cybersecurity**\n• **AI Solutions & Chatbots**\n• **Graphic Design & Branding**\n• **ICT Training** & much more!\n\nVisit **/services** for the full list. Which area interests you most?" },
  { patterns: [/pric(e|ing|es)|cost|how much|quote|budget/i], response: "Our pricing is tailored to each project — we don't believe in one-size-fits-all! 💰\n\nVisit **/pricing** for an overview, or book a **free consultation** at **/consultation** for a custom quote with no obligation." },
  { patterns: [/contact|reach|get in touch|email|phone/i], response: "You can reach us at 📩\n\n• **Email:** itechnetworkafrica@gmail.com\n• **Contact form:** **/contact**\n• **Free consultation:** **/consultation**\n• **Support:** **/support**" },
  { patterns: [/who are you|about (you|the company|itech)|what is itech|tell me about/i], response: "**iTech Network Africa** is a full-service technology company delivering cutting-edge ICT solutions across Africa! 🌍\n\nWe serve individuals, startups, SMEs, and enterprises. Learn more at **/about**." },
  { patterns: [/web(site| design| development| dev)|(build|create|make) (a |my |our )?(website|web app|site)/i], response: "We build **stunning, fast, conversion-optimised websites** for every industry! 🌐\n\nFrom landing pages to enterprise portals — we've got you covered. Book a **free consultation** at **/consultation** to get started!" },
  { patterns: [/mobile (app|application)|ios|android|app (development|dev)/i], response: "We develop **native and cross-platform mobile apps** for iOS and Android! 📱\n\nBook a **free consultation** at **/consultation** to discuss your app idea." },
  { patterns: [/ai|artificial intelligence|machine learning|chatbot|automation/i], response: "Our **AI Solutions** team transforms businesses! 🤖\n\n• Custom AI chatbots\n• Business process automation\n• Data analytics & dashboards\n• Machine learning models\n\nVisit **/ai-solutions** or book a **free consultation** at **/consultation**!" },
  { patterns: [/digital marketing|seo|social media|marketing|lead generation/i], response: "Our **Digital Marketing** team grows your online presence! 📈\n\nSEO, social media, Google Ads, content marketing, and lead generation. Book a **free consultation** at **/consultation**!" },
  { patterns: [/cyber|security audit|penetration test|hacking|data breach/i], response: "We take cybersecurity seriously! 🔒\n\nSecurity audits, penetration testing, threat monitoring, and compliance. Book a **free consultation** at **/consultation** to assess your security posture." },
  { patterns: [/cloud|aws|azure|google cloud|hosting|server/i], response: "We provide **secure, scalable cloud & IT services**! ☁️\n\nCloud migration, infrastructure management, DevOps, and backup solutions. Book a **free consultation** at **/consultation**!" },
  { patterns: [/support|help|issue|problem|not working|broken|fix/i], response: "Our **24/7 support team** is here to help! 🔧\n\n• Submit a ticket at **/support**\n• Email: itechnetworkafrica@gmail.com\n• Contact: **/contact**" },
  { patterns: [/consultation|book|appointment|meeting|schedule|demo/i], response: "Booking a **free consultation** is the perfect first step! 📅\n\nHead to **/consultation** — fill in a quick form and our team will reach out. No commitment, no pressure!" },
  { patterns: [/career|job|hiring|vacancy|work (at|for)|join (the |your |itech)/i], response: "We're always looking for talented people! 🚀\n\nVisit **/careers** to see current openings and learn about our culture." },
  { patterns: [/portfolio|project(s)?|past work|examples?|case stud/i], response: "Check out our work at **/portfolio** and **/projects**! 🎨\n\nReal-world examples across web, mobile, branding, and more." },
  { patterns: [/graphic design|brand(ing)?|logo|visual identity/i], response: "Our creative team delivers **world-class branding**! 🎨\n\nLogos, brand guidelines, marketing collateral, social media graphics. Book a **free consultation** at **/consultation**!" },
  { patterns: [/train(ing)?|course|learn|workshop|microsoft office/i], response: "We offer **hands-on ICT training** for individuals and teams! 🎓\n\nMicrosoft Office, cybersecurity, AI tools, programming, and more. Contact us at **/contact** to arrange training." },
  { patterns: [/^(bye|goodbye|thanks?|thank you|cheers|that'?s all)/i], response: "You're welcome! 😊 Feel free to come back anytime — I'm here 24/7. Have a wonderful day! 🌟" },
  { patterns: [/where (are you|is itech)|locat(ion|ed)|address|africa|office/i], response: "**iTech Network Africa** operates across the African continent. 🌍\n\nFor office locations and contact details, visit **/contact** or email itechnetworkafrica@gmail.com." },
];

function fallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();
  for (const entry of KB) {
    if (entry.patterns.some((p) => p.test(msg))) return entry.response;
  }
  return "That's a great question! 🤔\n\nFor the best assistance:\n• **Browse our website** — most answers are just a click away!\n• **Contact our team** at **/contact** or itechnetworkafrica@gmail.com\n• **Book a free consultation** at **/consultation** — our experts will personally assist you\n\nIs there anything else I can help you with?";
}

/* ─── Read raw body from the request stream ─── */
function readBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    // If Vercel already parsed the body, it may be on req.body
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

/* ─── Vercel handler ─── */
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

  /* ─── No key → knowledge base ─── */
  if (!apiKey) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    res.status(200).json({ message: fallbackResponse(lastUser?.content ?? '') });
    return;
  }

  /* ─── OpenAI ─── */
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 600,
        temperature: 0.8,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error:', response.status, errText);
      throw new Error(`OpenAI ${response.status}`);
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const text = data.choices[0]?.message?.content?.trim() ?? '';
    res.status(200).json({ message: text || fallbackResponse('') });
  } catch (err) {
    console.error('Chat handler error:', err);
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    res.status(200).json({ message: fallbackResponse(lastUser?.content ?? '') });
  }
}

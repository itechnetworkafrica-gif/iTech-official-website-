/* ─────────────────────────────────────────────────────────────────────────────
   Vercel Serverless Function: POST /api/chat
   Plain JavaScript — no TypeScript compilation required.
   ───────────────────────────────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are Sarah, a friendly, warm, and highly knowledgeable 24/7 virtual assistant for iTech Network Africa — a leading full-service technology company delivering cutting-edge ICT solutions across Africa.

Your personality:
- Warm, enthusiastic, conversational, and genuinely helpful
- You love technology and get excited when helping people find the right solution
- You use first person ("I", "we") naturally
- Keep answers concise but informative; use line breaks for readability
- Do not use emojis. Keep the tone warm through clear, natural language.
- Always end with a helpful follow-up offer or next step
- Never make up specific prices or guarantees — direct users to /pricing or /consultation

ABOUT ITECH NETWORK AFRICA
A full-service technology company serving individuals, startups, SMEs, and enterprises across Africa.
Contact: itechnetworkafrica@gmail.com | Website: itechnetworkafrica.com

OUR SERVICES
Web Design & Development, Software Development, Mobile App Development, Digital Marketing,
Graphic Design & Branding, UI/UX Design, Cloud & IT Services, Cybersecurity,
Networking & Infrastructure, IT Consulting, AI Solutions, Creative Media,
Printing & Promotional, Technical Support, Business Solutions, ICT Training

KEY PAGES: / (Home), /about, /services, /ai-solutions, /portfolio, /pricing,
/consultation (free booking), /contact, /support, /careers

INDUSTRIES: Healthcare, Finance & Fintech, Retail & E-commerce, Education, Government,
Manufacturing, Hospitality, NGOs, Real Estate, Logistics

GUIDELINES:
- Guide users to relevant pages
- For pricing → /pricing or free consultation at /consultation
- For support → /support
- For project enquiries → /contact or /consultation
- Always invite interested users to book a FREE consultation
- Response time: 1 business day for emails; support team is 24/7`;

const KB = [
  { p: [/^(hi|hello|hey|howdy|good\s*(morning|afternoon|evening)|hola)/i], r: "Hi there! I'm **Sarah**, your 24/7 assistant at **iTech Network Africa**. How can I help you today?" },
  { p: [/what (services|do you (offer|provide|do))|services (you|do you)|your services/i], r: "We offer a wide range of technology services.\n\n• **Web Design & Development**\n• **Mobile App Development**\n• **Custom Software Development**\n• **Digital Marketing & SEO**\n• **Cloud & IT Services**\n• **Cybersecurity**\n• **AI Solutions & Chatbots**\n• **Graphic Design & Branding**\n• **ICT Training** & much more!\n\nVisit **/services** for the full list. Which area interests you most?" },
  { p: [/pric(e|ing|es)|cost|how much|quote|budget/i], r: "Our pricing is tailored to each project.\n\nVisit **/pricing** for an overview, or book a **free consultation** at **/consultation** for a custom quote — no obligation." },
  { p: [/contact|reach|get in touch|email|phone/i], r: "Reach us at\n\n• **Email:** itechnetworkafrica@gmail.com\n• **Contact form:** **/contact**\n• **Free consultation:** **/consultation**\n• **Support:** **/support**" },
  { p: [/who are you|about (you|the company|itech)|what is itech|tell me about/i], r: "**iTech Network Africa** is a full-service technology company delivering cutting-edge ICT solutions across Africa.\n\nWe serve individuals, startups, SMEs, and enterprises. Learn more at **/about**." },
  { p: [/web(site| design| development| dev)|(build|create|make) (a |my |our )?(website|web app|site)/i], r: "We build **stunning, fast, conversion-optimised websites** for every industry.\n\nFrom landing pages to enterprise portals. Book a **free consultation** at **/consultation** to get started!" },
  { p: [/mobile (app|application)|ios|android|app (development|dev)/i], r: "We develop **native and cross-platform mobile apps** for iOS and Android.\n\nBook a **free consultation** at **/consultation** to discuss your app idea." },
  { p: [/ai|artificial intelligence|machine learning|chatbot|automation/i], r: "Our **AI Solutions** team transforms businesses.\n\n• Custom AI chatbots\n• Business process automation\n• Data analytics & dashboards\n• Machine learning models\n\nVisit **/ai-solutions** or book a **free consultation** at **/consultation**!" },
  { p: [/digital marketing|seo|social media|marketing|lead generation/i], r: "Our **Digital Marketing** team grows your online presence.\n\nSEO, social media, Google Ads, and lead generation. Book a **free consultation** at **/consultation**!" },
  { p: [/cyber|security audit|penetration test|hacking|data breach/i], r: "We take cybersecurity seriously.\n\nSecurity audits, penetration testing, and threat monitoring. Book a **free consultation** at **/consultation** to assess your security posture." },
  { p: [/cloud|aws|azure|google cloud|hosting|server/i], r: "We provide **secure, scalable cloud & IT services**.\n\nCloud migration, infrastructure management, and DevOps. Book a **free consultation** at **/consultation**!" },
  { p: [/support|help|issue|problem|not working|broken|fix/i], r: "Our **24/7 support team** is here to help.\n\n• **/support** — submit a ticket\n• itechnetworkafrica@gmail.com\n• **/contact** — for urgent issues" },
  { p: [/consultation|book|appointment|meeting|schedule|demo/i], r: "Booking a **free consultation** is the perfect first step.\n\nHead to **/consultation** — fill in a quick form and our team will reach out. No commitment, no pressure!" },
  { p: [/career|job|hiring|vacancy|work (at|for)|join (the |your |itech)/i], r: "We're always looking for talented people.\n\nVisit **/careers** to see current openings and learn about our culture." },
  { p: [/portfolio|project(s)?|past work|examples?|case stud/i], r: "Check out our work at **/portfolio** and **/projects**.\n\nReal-world examples across web, mobile, branding, and more." },
  { p: [/graphic design|brand(ing)?|logo|visual identity/i], r: "Our creative team delivers **world-class branding**.\n\nLogos, brand guidelines, and marketing collateral. Book a **free consultation** at **/consultation**!" },
  { p: [/train(ing)?|course|learn|workshop|microsoft office/i], r: "We offer **hands-on ICT training** for individuals and teams.\n\nMicrosoft Office, cybersecurity, AI tools, and programming. Contact us at **/contact** to arrange training." },
  { p: [/^(bye|goodbye|thanks?|thank you|cheers|that'?s all)/i], r: "You're welcome! Feel free to come back anytime — I'm here 24/7. Have a wonderful day." },
  { p: [/where (are you|is itech)|locat(ion|ed)|address|africa|office/i], r: "**iTech Network Africa** operates across the African continent.\n\nFor office locations and contact details, visit **/contact** or email itechnetworkafrica@gmail.com." },
];

function fallbackResponse(userMessage) {
  const msg = (userMessage || '').toLowerCase().trim();
  for (const entry of KB) {
    if (entry.p.some((p) => p.test(msg))) return entry.r;
  }
  return "That's a great question!\n\nFor the best assistance:\n• **Browse our website** — most answers are just a click away!\n• **Contact our team** at **/contact** or itechnetworkafrica@gmail.com\n• **Book a free consultation** at **/consultation** — our experts will personally assist you";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body !== undefined) {
      if (typeof req.body === 'string') return resolve(req.body);
      return resolve(JSON.stringify(req.body));
    }
    let data = '';
    req.on('data', (chunk) => { data += chunk.toString(); });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  let messages = [];
  try {
    const raw = await readBody(req);
    const parsed = (typeof raw === 'object' && raw !== null) ? raw : JSON.parse(raw);
    messages = parsed.messages || [];
  } catch (e) {
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
    res.status(200).json({ message: fallbackResponse(lastUser ? lastUser.content : '') });
    return;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
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
      throw new Error('OpenAI ' + response.status);
    }

    const data = await response.json();
    const text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
      ? data.choices[0].message.content.trim()
      : '';
    res.status(200).json({ message: text || fallbackResponse('') });
  } catch (err) {
    console.error('Chat handler error:', err);
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    res.status(200).json({ message: fallbackResponse(lastUser ? lastUser.content : '') });
  }
};

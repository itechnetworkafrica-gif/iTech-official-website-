import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Minimize2, Sparkles, Headset, Mail, Ticket, Phone } from 'lucide-react';
import { useLocation } from 'wouter';
import { apiUrl } from '@/lib/apiBase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  handoff?: boolean; // show human-agent routing card under this message
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
    banner: "👋 Hi! I'm Sarah — can I help you find something today?",
    greeting: "Hi there! 👋 I'm **Sarah**, your 24/7 assistant at **iTech Network Africa**. I can help you explore our services, get pricing info, book a consultation, or answer any question. What would you like to know?",
    chips: ['What services do you offer?', 'How can I get a quote?', 'Tell me about iTech'],
  },
  '/services': {
    banner: "🛠️ Exploring our services? I can walk you through each one!",
    greeting: "Great timing! 😊 You're browsing our services. We offer everything from **Web Development** and **Mobile Apps** to **Cybersecurity**, **Cloud Services**, and **AI Solutions**. Which area interests you most?",
    chips: ['Web & Mobile development', 'Cloud & Cybersecurity', 'AI Solutions'],
  },
  '/about': {
    banner: "🏢 Want to know more about our story or team?",
    greeting: "Happy to tell you more about **iTech Network Africa**! 🌍 We're a full-service technology company serving businesses across Africa. What would you like to know?",
    chips: ["What's your company story?", 'Where are you based?', 'Meet the team'],
  },
  '/ai-solutions': {
    banner: "🤖 Curious about our AI solutions? Let me show you!",
    greeting: "You're in the right place! 🤖 Our **AI Solutions** team builds intelligent systems — chatbots, automation, data analytics, and custom AI tools. What problem are you trying to solve?",
    chips: ['AI chatbots for my business', 'Business process automation', 'Data analytics & insights'],
  },
  '/solutions': {
    banner: "💡 Looking for the right solution? I can help you find it!",
    greeting: "Let's find the perfect solution for you! 💡 We design end-to-end technology solutions for businesses of all sizes. What challenge are you looking to solve?",
    chips: ['Digital transformation', 'Custom software', 'IT infrastructure'],
  },
  '/products': {
    banner: "📦 Browsing our products? Need help finding the right fit?",
    greeting: "Welcome to our products page! 📦 I can help you understand each product or connect you with our sales team for a demo. What are you looking for?",
    chips: ['Tell me about your products', 'Get a product demo', 'Pricing information'],
  },
  '/portfolio': {
    banner: "🎨 Impressed by our work? Ask me about similar projects!",
    greeting: "Glad you're checking out our portfolio! 🎨 We've delivered incredible projects across many industries. Want to see work in a specific area?",
    chips: ['Web development projects', 'Mobile app projects', 'Start a similar project'],
  },
  '/projects': {
    banner: "🚀 See something you like? I can connect you with our team!",
    greeting: "Our project showcase highlights the real impact we've made! 🚀 If any project inspires you, I can help you start something similar. What interests you?",
    chips: ['Start a project like this', 'Get a project quote', 'Talk to the team'],
  },
  '/pricing': {
    banner: "💰 Have pricing questions? I can help clarify everything!",
    greeting: "Great — let's talk pricing! 💰 Our packages are designed for every budget. I can walk you through our plans or get you a custom quote. What's your project type?",
    chips: ['Website pricing', 'App development cost', 'Get a custom quote'],
  },
  '/consultation': {
    banner: "📅 Ready to book your free consultation? It only takes a minute!",
    greeting: "You're one step away from a **free consultation**! 📅 Our experts will listen to your needs and recommend the best solution — no commitment, no pressure. Any questions before you book?",
    chips: ['What happens in a consultation?', 'How long does it take?', 'Book now'],
  },
  '/contact': {
    banner: "📩 Need to reach us? I can get you to the right person fast!",
    greeting: "I'll help you get in touch with the right team! 📩 Whether it's sales, support, or a partnership — just let me know and I'll point you in the right direction.",
    chips: ['Sales enquiry', 'Technical support', 'Partnership opportunity'],
  },
  '/support': {
    banner: "🔧 Having an issue? I'm here to help troubleshoot or escalate!",
    greeting: "Sorry to hear you're having an issue! 🔧 Our support team is available 24/7. Can you briefly describe what's happening so I can point you to the right resource?",
    chips: ['Submit a support ticket', 'Check service status', 'Contact support team'],
  },
  '/careers': {
    banner: "🚀 Interested in joining the iTech team? Let's talk!",
    greeting: "Exciting! 🚀 We're always looking for talented people to join the **iTech Network Africa** family. I can tell you about our culture, current openings, and what it's like to work here!",
    chips: ['Current job openings', 'Company culture', 'How to apply'],
  },
  '/blog': {
    banner: "📰 Enjoying our content? Ask me anything to explore further!",
    greeting: "Glad you're reading our blog! 📰 Our team writes about tech trends, business insights, and behind-the-scenes stories. Is there a topic you'd love to dive deeper into?",
    chips: ['Tech tips for my business', 'Latest news & trends', 'Subscribe to updates'],
  },
  '/news': {
    banner: "📰 Any questions about what we've been up to recently?",
    greeting: "Welcome to our newsroom! 📰 Stay up to date with iTech Network Africa's latest milestones, partnerships, and industry news. Anything specific you'd like to know?",
    chips: ['Latest company news', 'New service launches', 'Partnership updates'],
  },
  '/industries': {
    banner: "🏭 Curious how we serve your industry? Let me show you!",
    greeting: "We work across many industries — from **healthcare** and **finance** to **retail**, **education**, and **government**. 🏭 What industry are you in?",
    chips: ['Healthcare solutions', 'Finance & fintech', 'Education technology', 'Retail & e-commerce'],
  },
  '/partners': {
    banner: "🤝 Interested in partnering with us? Let's explore what's possible!",
    greeting: "We love building win-win partnerships! 🤝 Whether you're a technology vendor, reseller, or complementary service provider, there could be a great opportunity here!",
    chips: ['Technology partnership', 'Reseller programme', 'Referral partnership'],
  },
  '/resources': {
    banner: "📚 Looking for guides or tools? I can help you find what you need!",
    greeting: "Our resource hub has docs, tutorials, tools, and more! 📚 What are you trying to learn or accomplish? I'll point you to the right resource.",
    chips: ['Developer documentation', 'Video tutorials', 'Download tools'],
  },
};

const DEFAULT_PROMPT: PagePrompt = {
  banner: "💬 Have a question? I'm Sarah — ask me anything!",
  greeting: "Hi there! 👋 I'm **Sarah**, your 24/7 AI assistant at **iTech Network Africa**. I'm here to help with any question — services, pricing, projects, support, or anything else. What's on your mind?",
  chips: ['What services do you offer?', 'Get a quote', 'Contact the team'],
};

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

/* ─── Human agent handoff card ─── */
function HandoffCard() {
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
        <a
          href="https://wa.me/231776836689?text=Hi%2C%20I%20was%20chatting%20with%20Sarah%20and%20would%20like%20to%20speak%20with%20an%20agent."
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
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [visible, setVisible]     = useState(false); // button + banner shown

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

    const errorMsg = "I'm sorry, I had a little hiccup there! 😅 Please try again, or reach us directly at **itechnetworkafrica@gmail.com**.";

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

  /* ─── Send typed message ─── */
  const sendMessage = useCallback(() => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    doSend(text, messagesRef.current);
  }, [input, loading, doSend]);

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
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-8 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 z-[60] max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
            style={{ maxHeight: 'min(560px, calc(100vh - 40px))' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#0A1929] to-[#0f2d47] text-white flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3CB52A] to-[#2da822] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0A1929]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight">Sarah</p>
                <p className="text-[11px] text-green-400 leading-tight flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Always online · AI Assistant
                </p>
              </div>
              <button
                onClick={() => sendChip('I would like to talk to a human agent, please.')}
                className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                aria-label="Talk to a human agent"
                title="Talk to a human agent"
              >
                <Headset size={16} />
              </button>
              <button
                onClick={handleClose}
                className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Close chat"
              >
                <Minimize2 size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3CB52A] to-[#2da822] flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-sm">
                      <Sparkles size={13} className="text-white" />
                    </div>
                  )}

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
                </motion.div>
              ))}

              {/* Human handoff card */}
              {messages.length > 0 && messages[messages.length - 1].handoff && !loading && <HandoffCard />}

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
            <div className="flex items-center gap-2 px-3 py-3 bg-white border-t border-gray-100 flex-shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Sarah anything…"
                className="flex-1 text-sm px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/30 focus:border-[#3CB52A] placeholder-gray-400 text-[#0A1929] transition-all"
                disabled={loading}
              />
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
            <div className="px-3 pb-2 text-center flex-shrink-0">
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
      <AnimatePresence>
        {visible && !open && (
          <motion.div
            key="nudge"
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-8 right-4 sm:right-8 z-[60] flex flex-col items-end gap-2"
          >
            {/* Banner card */}
            <div
              className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 px-4 pt-3 pb-3 max-w-[240px] cursor-pointer group"
              onClick={handleOpen}
            >
              {/* Dismiss ✕ */}
              <button
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 flex items-center justify-center transition-colors z-10"
                onClick={handleDismiss}
                aria-label="Dismiss"
              >
                <X size={10} />
              </button>

              {/* Sarah label */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#3CB52A] to-[#2da822] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={10} className="text-white" />
                </div>
                <span className="text-[11px] font-bold text-[#0A1929]">Sarah</span>
                <span className="text-[10px] text-green-500 flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                  online
                </span>
              </div>

              {/* Message */}
              <p className="text-xs text-gray-700 leading-snug group-hover:text-[#0A1929] transition-colors">
                {prompt.banner}
              </p>

              {/* CTA */}
              <p className="text-[10px] text-[#3CB52A] font-semibold mt-1.5">
                Tap to chat →
              </p>

              {/* Tail */}
              <div className="absolute -bottom-1.5 right-7 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
            </div>

            {/* Chat button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleOpen}
              aria-label="Chat with Sarah"
              className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3CB52A] to-[#2da822] text-white shadow-[0_8px_32px_rgba(60,181,42,0.45)] flex items-center justify-center"
            >
              <MessageCircle size={24} />
              <span className="absolute w-14 h-14 rounded-full animate-ping bg-[#3CB52A] opacity-20 pointer-events-none" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════
          MINIMISE BUTTON (chat is open)
          ═══════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            aria-label="Close chat"
            className="fixed bottom-8 right-4 sm:right-8 z-[70] w-10 h-10 rounded-full bg-[#0A1929] hover:bg-[#0f2d47] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{ bottom: 'calc(min(560px, calc(100vh - 40px)) + 2.5rem)' }}
          >
            <X size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

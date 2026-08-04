import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Minimize2, Bot, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';
import { getApiUrl } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/* ─── Per-page contextual popup questions ─── */
interface PagePrompt {
  bubble: string;       // text shown in the floating bubble
  greeting: string;     // first assistant message when bubble is clicked
  chips: string[];      // quick-reply suggestion chips
}

const PAGE_PROMPTS: Record<string, PagePrompt> = {
  '/': {
    bubble: '👋 Welcome! How can I help you today?',
    greeting: "Hi there! 👋 I'm **Sarah**, your 24/7 assistant at **iTech Network Africa**. I can help you explore our services, get pricing info, book a consultation, or just answer any question. What would you like to know?",
    chips: ['What services do you offer?', 'How can I get a quote?', 'Tell me about iTech'],
  },
  '/services': {
    bubble: '🛠️ Exploring our services? I can walk you through each one!',
    greeting: "Great timing! 😊 You're browsing our services. We offer everything from **Web Development** and **Mobile Apps** to **Cybersecurity**, **Cloud Services**, and **AI Solutions**. Which area interests you most?",
    chips: ['Web & Mobile development', 'Cloud & Cybersecurity', 'AI Solutions', 'View all services'],
  },
  '/about': {
    bubble: '🏢 Want to know more about our story or team?',
    greeting: "Happy to tell you more about **iTech Network Africa**! 🌍 We're a full-service technology company serving individuals, startups, SMEs, and enterprises across Africa. What would you like to know?",
    chips: ["What's your company story?", 'Where are you based?', 'Meet the team'],
  },
  '/ai-solutions': {
    bubble: "🤖 Curious about our AI solutions? Let me show you what's possible!",
    greeting: "You're in the right place! 🤖 Our **AI Solutions** team builds intelligent systems — chatbots, automation, data analytics, and custom AI tools tailored to your business. What problem are you trying to solve?",
    chips: ['AI chatbots for my business', 'Business process automation', 'Data analytics & insights'],
  },
  '/solutions': {
    bubble: '💡 Looking for the right solution? I can help you find it!',
    greeting: "Let's find the perfect solution for your needs! 💡 We design and deliver end-to-end technology solutions for businesses of all sizes. What challenge are you looking to solve?",
    chips: ['Digital transformation', 'Custom software', 'IT infrastructure'],
  },
  '/products': {
    bubble: '📦 Browsing our products? Need help finding the right fit?',
    greeting: "Welcome to our products page! 📦 I can help you understand each product, compare options, or get you connected with our sales team for a demo. What are you looking for?",
    chips: ['Tell me about your products', 'Get a product demo', 'Pricing information'],
  },
  '/portfolio': {
    bubble: '🎨 Impressed by our work? Ask me about similar projects!',
    greeting: "Glad you're checking out our portfolio! 🎨 We've delivered some incredible projects — from enterprise platforms to creative digital campaigns. Want to see work in a specific industry or technology?",
    chips: ['Web development projects', 'Mobile app projects', 'Start a similar project'],
  },
  '/projects': {
    bubble: '🚀 See something you like? I can connect you with our team!',
    greeting: "Our project showcase highlights the real impact we've made for clients! 🚀 If any of these inspire you, I can help you start a similar project or get in touch with the right team. What interests you?",
    chips: ['Start a project like this', 'Get a project quote', 'Talk to the team'],
  },
  '/pricing': {
    bubble: '💰 Have pricing questions? I can help clarify everything!',
    greeting: "Great — let's talk pricing! 💰 Our packages are designed to suit every budget, from startups to enterprises. I can walk you through our plans or connect you with our sales team for a custom quote. What's your project type?",
    chips: ['Website pricing', 'App development cost', 'Get a custom quote'],
  },
  '/consultation': {
    bubble: '📅 Ready to book a free consultation? It only takes a minute!',
    greeting: "You're one step away from a **free consultation**! 📅 Our experts will listen to your needs and recommend the best solution — no commitment, no pressure. Do you have any questions before you book?",
    chips: ['What happens in a consultation?', 'How long does it take?', 'Book now'],
  },
  '/contact': {
    bubble: '📩 Need to reach us? I can help you get to the right person fast!',
    greeting: "I'll help you get in touch with the right team! 📩 Whether it's a sales enquiry, technical support, or a partnership discussion — just let me know and I'll point you in the right direction.",
    chips: ['Sales enquiry', 'Technical support', 'Partnership opportunity'],
  },
  '/support': {
    bubble: "🔧 Having an issue? I'm here to help troubleshoot or escalate!",
    greeting: "Sorry to hear you're experiencing an issue! 🔧 I'm here to help. Our support team is available 24/7. Can you briefly describe what's happening so I can point you to the right resource?",
    chips: ['Submit a support ticket', 'Check service status', 'Contact support team'],
  },
  '/careers': {
    bubble: "🚀 Interested in joining the iTech team? Let's talk!",
    greeting: "Exciting! 🚀 We're always looking for talented people to join the **iTech Network Africa** family. I can tell you about our culture, current openings, and what it's like to work here. What would you like to know?",
    chips: ['Current job openings', 'Company culture', 'How to apply'],
  },
  '/blog': {
    bubble: "📰 Enjoying our content? Ask me anything you'd like to explore further!",
    greeting: "Glad you're reading our blog! 📰 Our team writes about tech trends, business insights, and behind-the-scenes stories. Is there a topic you'd love to dive deeper into?",
    chips: ['Tech tips for my business', 'Latest news & trends', 'Subscribe to updates'],
  },
  '/news': {
    bubble: "📰 Stay up to date — any questions about what we've been up to?",
    greeting: "Welcome to our newsroom! 📰 Stay up to date with iTech Network Africa's latest milestones, partnerships, and industry news. Is there something specific you'd like to know?",
    chips: ['Latest company news', 'New service launches', 'Partnership updates'],
  },
  '/industries': {
    bubble: '🏭 Curious how we serve your industry? Let me show you!',
    greeting: "We work across many industries — from **healthcare** and **finance** to **retail**, **education**, and **government**. 🏭 What industry are you in? I can walk you through how we've helped similar organizations.",
    chips: ['Healthcare solutions', 'Finance & fintech', 'Education technology', 'Retail & e-commerce'],
  },
  '/partners': {
    bubble: "🤝 Interested in partnering with us? Let's explore what's possible!",
    greeting: "We love building win-win partnerships! 🤝 Whether you're a technology vendor, reseller, or complementary service provider, there could be a great opportunity here. What kind of partnership are you thinking about?",
    chips: ['Technology partnership', 'Reseller programme', 'Referral partnership'],
  },
  '/resources': {
    bubble: '📚 Looking for guides or tools? I can help you find exactly what you need!',
    greeting: "Our resource hub has docs, tutorials, tools, and more! 📚 What are you trying to learn or accomplish? I'll point you to the right resource.",
    chips: ['Developer documentation', 'Video tutorials', 'Download tools'],
  },
};

const DEFAULT_PROMPT: PagePrompt = {
  bubble: '💬 Have a question? I\'m Sarah — ask me anything!',
  greeting: "Hi there! 👋 I'm **Sarah**, your 24/7 AI assistant at **iTech Network Africa**. I'm here to help with any question — services, pricing, projects, support, or anything else. What's on your mind?",
  chips: ['What services do you offer?', 'Get a quote', 'Contact the team'],
};

const POPUP_DELAY_MS = 30_000;

/* ─── Typing indicator ─── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-[#3CB52A]"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

/* ─── Render markdown-lite: bold, bullet lists, line breaks ─── */
function MessageText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <span>
      {lines.map((line, lineIdx) => {
        // Bullet list item
        const bulletMatch = line.match(/^[•\-\*]\s+(.+)/);
        if (bulletMatch) {
          return (
            <span key={lineIdx} className="flex items-start gap-1.5 mt-1">
              <span className="text-[#3CB52A] font-bold mt-0.5 flex-shrink-0">•</span>
              <BoldText text={bulletMatch[1]} />
              {lineIdx < lines.length - 1 && !lines[lineIdx + 1].match(/^[•\-\*]\s+/) && <br />}
            </span>
          );
        }
        return (
          <React.Fragment key={lineIdx}>
            <BoldText text={line} />
            {lineIdx < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
}

function BoldText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export const SarahChatbot: React.FC = () => {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef(open);

  openRef.current = open;

  /* ─── Get prompt for current page ─── */
  const getPagePrompt = useCallback((path: string): PagePrompt => {
    // Exact match first
    if (PAGE_PROMPTS[path]) return PAGE_PROMPTS[path];
    // Prefix match (e.g. /services/web-development → /services)
    const prefix = Object.keys(PAGE_PROMPTS)
      .filter(k => k !== '/' && path.startsWith(k))
      .sort((a, b) => b.length - a.length)[0];
    return prefix ? PAGE_PROMPTS[prefix] : DEFAULT_PROMPT;
  }, []);

  /* ─── Auto-scroll to bottom ─── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* ─── Focus input when opened ─── */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  /* ─── Schedule a popup nudge ─── */
  const schedulePopup = useCallback(() => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => {
      if (!openRef.current) setShowBubble(true);
    }, POPUP_DELAY_MS);
  }, []);

  /* ─── Start popup timer on mount ─── */
  useEffect(() => {
    schedulePopup();
    return () => { if (popupTimerRef.current) clearTimeout(popupTimerRef.current); };
  }, [schedulePopup]);

  /* ─── Reset popup on page navigation ─── */
  useEffect(() => {
    setShowBubble(false);
    if (!openRef.current) schedulePopup();
  }, [location, schedulePopup]);

  /* ─── Open chat ─── */
  const handleOpen = useCallback((prefilledMessage?: string) => {
    const prompt = getPagePrompt(location);
    setOpen(true);
    setShowBubble(false);
    setHasBeenOpened(true);
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);

    // Set initial greeting if no messages yet
    setMessages(prev => {
      if (prev.length === 0) {
        return [{ role: 'assistant', content: prompt.greeting }];
      }
      return prev;
    });

    // Pre-fill a message if triggered by chip or bubble click
    if (prefilledMessage) {
      setTimeout(() => {
        setInput(prefilledMessage);
        setTimeout(() => inputRef.current?.focus(), 350);
      }, 100);
    }
  }, [location, getPagePrompt]);

  /* ─── Close chat ─── */
  const handleClose = useCallback(() => {
    setOpen(false);
    schedulePopup();
  }, [schedulePopup]);

  /* ─── Send a chip / quick reply ─── */
  const sendChip = useCallback((text: string) => {
    setInput('');
    // Trigger send directly
    const userMsg: Message = { role: 'user', content: text };
    const assistantPlaceholder: Message = { role: 'assistant', content: '' };

    setMessages(prev => [...prev, userMsg, assistantPlaceholder]);
    setLoading(true);

    const errorMsg = "I'm sorry, I'm having a little trouble right now. Please try again or contact us at **itechnetworkafrica@gmail.com** 💌";

    const runStream = async () => {
      try {
        const allMessages = [...messages, userMsg];
        const res = await fetch(getApiUrl('api/chat'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: allMessages }),
        });

        if (!res.ok || !res.body) {
          const errData = await res.json().catch(() => ({}));
          setMessages(prev => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: 'assistant', content: (errData as { message?: string }).message || errorMsg };
            return copy;
          });
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            try {
              const payload = JSON.parse(line.slice(5).trim());
              if (payload.content) {
                setMessages(prev => {
                  const copy = [...prev];
                  copy[copy.length - 1] = {
                    role: 'assistant',
                    content: copy[copy.length - 1].content + payload.content,
                  };
                  return copy;
                });
              }
              if (payload.error) {
                setMessages(prev => {
                  const copy = [...prev];
                  copy[copy.length - 1] = { role: 'assistant', content: errorMsg };
                  return copy;
                });
              }
            } catch { /* ignore malformed */ }
          }
        }
      } catch {
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: errorMsg };
          return copy;
        });
      } finally {
        setLoading(false);
      }
    };

    runStream();
  }, [messages]);

  /* ─── Send typed message ─── */
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];

    setMessages([...updatedMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    const errorMsg = "I'm sorry, I'm having a little trouble right now. Please try again or contact us at **itechnetworkafrica@gmail.com** 💌";

    const updateAssistant = (content: string) => {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'assistant', content };
        return copy;
      });
    };

    try {
      const res = await fetch(getApiUrl('api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok || !res.body) {
        const errData = await res.json().catch(() => ({}));
        updateAssistant((errData as { message?: string }).message || errorMsg);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          try {
            const payload = JSON.parse(line.slice(5).trim());
            if (payload.content) {
              setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                  role: 'assistant',
                  content: copy[copy.length - 1].content + payload.content,
                };
                return copy;
              });
            }
            if (payload.error) updateAssistant(errorMsg);
          } catch { /* ignore */ }
        }
      }
    } catch {
      updateAssistant(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const pagePrompt = getPagePrompt(location);
  // Show chips only when it's just the greeting (1 message) and not loading
  const showChips = messages.length === 1 && !loading;

  return (
    <>
      {/* ─── Chat window ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-28 right-4 sm:right-8 z-[60] w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
            style={{ maxHeight: 'min(560px, calc(100vh - 160px))' }}
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
                onClick={handleClose}
                className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Minimize chat"
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
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3CB52A] to-[#2da822] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 shadow-sm">
                      <Sparkles size={13} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-[#3CB52A] to-[#2da822] text-white rounded-br-sm shadow-sm'
                        : 'bg-white text-[#0A1929] rounded-bl-sm shadow-sm border border-gray-100'
                    }`}
                  >
                    {msg.content === '' && msg.role === 'assistant' ? (
                      <TypingDots />
                    ) : (
                      <MessageText text={msg.content} />
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator while streaming */}
              {loading && messages[messages.length - 1]?.content === '' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3CB52A] to-[#2da822] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 shadow-sm">
                    <Sparkles size={13} className="text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              {/* Quick-reply chips */}
              <AnimatePresence>
                {showChips && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                    className="flex flex-wrap gap-1.5 pl-9"
                  >
                    {pagePrompt.chips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          sendChip(chip);
                        }}
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Sarah anything…"
                className="flex-1 text-sm px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/30 focus:border-[#3CB52A] placeholder-gray-400 text-[#0A1929] transition-all"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3CB52A] to-[#2da822] hover:from-[#2da822] hover:to-[#259a1e] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all flex-shrink-0 shadow-sm"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>

            {/* Branding footer */}
            <div className="px-3 pb-2 text-center flex-shrink-0">
              <p className="text-[10px] text-gray-400">
                Powered by <span className="font-semibold text-[#3CB52A]">iTech Network Africa</span> · 24/7 AI Assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Popup bubble ─── */}
      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-40 right-4 sm:right-8 z-[60] bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 max-w-[220px] cursor-pointer"
            onClick={() => handleOpen()}
          >
            <button
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors"
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); schedulePopup(); }}
              aria-label="Dismiss"
            >
              <X size={10} />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#3CB52A] to-[#2da822] flex items-center justify-center flex-shrink-0">
                <Sparkles size={10} className="text-white" />
              </div>
              <p className="text-xs font-bold text-[#0A1929]">Sarah</p>
            </div>
            <p className="text-xs text-gray-600 leading-snug">{pagePrompt.bubble}</p>
            {/* tail */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Toggle button ─── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={hasBeenOpened ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleOpen()}
            aria-label="Chat with Sarah"
            className="fixed bottom-24 right-4 sm:right-8 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-[#3CB52A] to-[#2da822] hover:from-[#2da822] hover:to-[#259a1e] text-white shadow-[0_8px_32px_rgba(60,181,42,0.5)] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <MessageCircle size={24} />
            <span className="absolute inset-0 rounded-full animate-ping bg-[#3CB52A] opacity-20" />
            {/* Unread dot when bubble was shown */}
            {showBubble && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Close button (when open) ─── */}
      <AnimatePresence>
        {open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            aria-label="Close chat"
            className="fixed bottom-24 right-4 sm:right-8 z-[60] w-14 h-14 rounded-full bg-[#0A1929] hover:bg-[#0f2d47] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <X size={22} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

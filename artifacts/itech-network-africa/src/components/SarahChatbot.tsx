import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Minimize2, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const GREETING = "Hi there! 👋 I'm **Sarah**, your 24/7 assistant at iTech Network Africa. I'm here to help you with anything — our services, pricing, projects, or just pointing you in the right direction. How can I help you today?";

const POPUP_DELAY_MS = 30_000; // 30 seconds

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

/* ─── Render markdown-lite: bold, line breaks ─── */
function MessageText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part.split('\n').map((line, j, arr) => (
          <React.Fragment key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </React.Fragment>
        ));
      })}
    </span>
  );
}

export const SarahChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ─── Auto-scroll to bottom ─── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* ─── Focus input when opened ─── */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  /* ─── 30-second popup nudge ─── */
  useEffect(() => {
    const startTimer = () => {
      popupTimerRef.current = setInterval(() => {
        if (!open) setShowBubble(true);
      }, POPUP_DELAY_MS);
    };
    startTimer();
    return () => {
      if (popupTimerRef.current) clearInterval(popupTimerRef.current);
    };
  }, [open]);

  /* ─── Hide bubble when chat opens ─── */
  const handleOpen = useCallback(() => {
    setOpen(true);
    setShowBubble(false);
    setHasBeenOpened(true);
    if (popupTimerRef.current) clearInterval(popupTimerRef.current);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    // Restart the popup timer
    if (popupTimerRef.current) clearInterval(popupTimerRef.current);
    popupTimerRef.current = setInterval(() => {
      setShowBubble(true);
    }, POPUP_DELAY_MS);
  }, []);

  /* ─── Send message ─── */
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    // The assistant placeholder will be appended at this exact index
    const assistantIdx = updatedMessages.length;

    setMessages([...updatedMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    const errorMsg =
      "I'm sorry, I had trouble connecting. Please try again or reach us at **itechnetworkafrica@gmail.com**. 🙏";

    const updateAssistant = (content: string) => {
      setMessages((prev) => {
        if (assistantIdx >= prev.length) return prev;
        const next = [...prev];
        next[assistantIdx] = { role: 'assistant', content };
        return next;
      });
    };

    try {
      const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Network error');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // Process all complete lines; keep any trailing partial line in the buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              assistantText += data.content;
              updateAssistant(assistantText);
            } else if (data.error) {
              updateAssistant(
                "I'm having trouble right now. Please try again or contact us at **itechnetworkafrica@gmail.com**. 🙏",
              );
            }
          } catch {
            // ignore parse errors for malformed lines
          }
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
            style={{ maxHeight: 'min(540px, calc(100vh - 160px))' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#0A1929] to-[#0f2d47] text-white flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#3CB52A] flex items-center justify-center flex-shrink-0">
                  <Bot size={20} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0A1929]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight">Sarah</p>
                <p className="text-xs text-green-400 leading-tight">iTech Network Africa · Online</p>
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
                    <div className="w-7 h-7 rounded-full bg-[#3CB52A] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#3CB52A] text-white rounded-br-sm'
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
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="w-7 h-7 rounded-full bg-[#3CB52A] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                    <TypingDots />
                  </div>
                </motion.div>
              )}
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
                className="flex-1 text-sm px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3CB52A]/30 focus:border-[#3CB52A] placeholder-gray-400 text-[#0A1929]"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-[#3CB52A] hover:bg-[#2da822] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>

            {/* Branding footer */}
            <div className="px-3 pb-2 text-center flex-shrink-0">
              <p className="text-[10px] text-gray-400">
                Powered by <span className="font-semibold text-[#3CB52A]">iTech Network Africa</span> · AI Assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Popup nudge bubble ─── */}
      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-4 sm:right-8 z-[60] max-w-[220px]"
          >
            <div
              className="bg-white rounded-2xl rounded-br-sm shadow-xl px-4 py-3 cursor-pointer border border-gray-100 hover:shadow-2xl transition-shadow"
              onClick={handleOpen}
            >
              <button
                className="absolute -top-2 -right-2 w-5 h-5 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
                aria-label="Dismiss"
              >
                <X size={10} />
              </button>
              <p className="text-xs font-semibold text-[#0A1929]">👋 Hi! I'm Sarah</p>
              <p className="text-xs text-gray-500 mt-0.5">Need help? Ask me anything!</p>
            </div>
            {/* little tail */}
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
            onClick={handleOpen}
            aria-label="Chat with Sarah"
            className="fixed bottom-24 right-4 sm:right-8 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-[#3CB52A] to-[#2da822] hover:from-[#2da822] hover:to-[#259a1e] text-white shadow-[0_8px_32px_rgba(60,181,42,0.5)] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <MessageCircle size={24} />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping bg-[#3CB52A] opacity-20" />
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

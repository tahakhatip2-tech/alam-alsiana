"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  RotateCcw,
  X,
  Send,
  MessageCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  actions?: Array<{
    type: string;
    data: Record<string, unknown>;
    result?: string;
  }>;
  time: string;
}

export default function AgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content:
        "هلا يا معلم! أنا **عامر**، موظفك الذكي في عالم الصيانة. أقدر أساعدك فوراً:\n• متابعة أجهزة الخزنة وحالاتها\n• إشعار الزبائن عبر واتساب بضغطة واحدة\n• إعطاء تقرير إيرادات وأداء المحل\n• تنفيذ أي أمر على النظام مباشرة",
      time: "الآن",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: text,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data.response) {
        const modelMsg: Message = {
          id: `model-${Date.now()}`,
          role: "model",
          content: data.response,
          actions: data.actions || [],
          time: new Date().toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, modelMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "model",
          content: "حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.",
          time: new Date().toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickCommands = [
    { label: "تقرير اليوم والأرباح", cmd: "اعطيني تقرير اليوم والأرباح المتوقعة" },
    { label: "الأجهزة المعلقة", cmd: "شو الأجهزة المعلقة اللي ما تسلمت؟" },
    { label: "بحث عن جهاز محمد", cmd: "وين جهاز محمد العمري وشو حالته؟" },
    { label: "تحويل جهاز محمد لـ جاهز", cmd: "حول جهاز محمد العمري لـ جاهز للاستلام" },
  ];

  return (
    <div className="fixed bottom-20 left-3 sm:bottom-6 sm:left-6 z-50 print:hidden font-sans">
      {/* Floating Circle Button - Outline Style */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 sm:gap-3 bg-[#0E0E0E]/95 backdrop-blur-md text-[#FFC400] border-2 border-[#FFC400] px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-[0_0_25px_rgba(255,196,0,0.25)] hover:shadow-[0_0_35px_rgba(255,196,0,0.5)] hover:bg-[#FFC400] hover:text-black hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="تحدث مع عامر الوكيل الذكي"
        >
          {/* Animated ping dot */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-500 border-2 border-black"></span>
          </span>

          <Bot className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
          <div className="flex flex-col text-right pr-0.5 sm:pr-1">
            <span className="text-xs font-black leading-tight">عامر | الوكيل الذكي</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 group-hover:text-black/80 hidden sm:block">متصل بالخزنة والواتساب</span>
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] sm:h-[580px] max-h-[85vh] bg-[#0E0E0E] border-2 border-[#FFC400]/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#171717] to-[#121212] border-b border-[#262626] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-neutral-900 border-2 border-[#FFC400] flex items-center justify-center text-[#FFC400] shadow-md">
                <Bot className="w-5 h-5 text-[#FFC400]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#121212] rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-white text-sm">عامر (Amer AI)</h3>
                  <span className="text-[9px] bg-[#FFC400]/20 text-[#FFC400] px-1.5 py-0.5 rounded font-black border border-[#FFC400]/30">
                    مدير المحل
                  </span>
                </div>
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  متصل ومفوّض بالصلاحيات
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                title="مسح المحادثة"
                className="w-8 h-8 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs flex items-center justify-center transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-base flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="bg-[#121212] border-b border-[#222] p-2 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickCommands.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.cmd)}
                className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-[#FFC400]/10 text-neutral-300 hover:text-[#FFC400] hover:border-[#FFC400]/50 transition-colors font-bold"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Messages Flow */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0A0A0A]/60">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-start" : "items-end"} space-y-1`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isUser
                        ? "bg-[#FFC400]/15 border-2 border-[#FFC400] text-[#FFC400] font-bold rounded-br-sm shadow-[0_0_15px_rgba(255,196,0,0.15)]"
                        : "bg-[#181818] border border-[#2B2B2B] text-neutral-200 rounded-bl-sm"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {/* Interactive Action Buttons if any returned */}
                    {m.actions && m.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-neutral-700/60 space-y-2">
                        {m.actions.map((act, i) => {
                          if (act.type === "WHATSAPP_LINK" && act.data?.url) {
                            return (
                              <a
                                key={i}
                                href={act.data.url as string}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl border-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black font-black text-xs transition-colors shadow"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>إرسال واتساب للزبون ({act.data.phone as string})</span>
                              </a>
                            );
                          }
                          if (act.type === "STATUS_UPDATE" && act.data?.waLink) {
                            return (
                              <a
                                key={i}
                                href={act.data.waLink as string}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl border-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black font-black text-xs transition-colors shadow"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>إشعار الزبون الآن عبر واتساب</span>
                              </a>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-neutral-600 px-1">{m.time}</span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-end space-y-1">
                <div className="bg-[#181818] border border-[#2B2B2B] rounded-2xl rounded-bl-sm p-3 text-xs text-neutral-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#FFC400]" />
                  <span>عامر يراجع الخزنة ويتخذ الإجراء...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#121212] border-t border-[#222] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اطلب من عامر: تقرير، تحديث جهاز، رسالة واتساب..."
              className="flex-1 bg-black border border-neutral-800 focus:border-[#FFC400] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(255,196,0,0.2)] flex items-center gap-1.5"
            >
              <span>إرسال</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChatConversation, ChatMessage } from "@/lib/chat-data";

function ChatContent() {
  const searchParams = useSearchParams();
  const requestedConvId = searchParams.get("id");

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async (targetId?: string) => {
    try {
      const res = await fetch("/api/chat");
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setConversations(json.data);
        if (targetId) {
          setActiveConvId(targetId);
        } else if (!activeConvId && json.data.length > 0) {
          setActiveConvId(json.data[0].id);
        }
      }
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(requestedConvId || undefined);
  }, [requestedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvId, conversations]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    const messageText = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          text: messageText,
          senderPhone: "0790001122",
          senderName: "فني عمان (أنت)"
        }),
      });

      const json = await res.json();
      if (json.data) {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeConvId) {
              return {
                ...c,
                lastMessage: messageText,
                lastMessageAt: json.data.createdAt,
                messages: [...c.messages, json.data]
              };
            }
            return c;
          })
        );
      }
    } catch {
      alert("فشل إرسال الرسالة");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 flex flex-col h-[calc(100vh-5rem)]">
      {/* Container with Modern Dual Pane */}
      <div className="bg-[#101010] border border-[#222] rounded-2xl flex-1 flex flex-col md:flex-row overflow-hidden shadow-2xl">
        {/* RIGHT PANE: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-l border-[#222] flex flex-col bg-[#0D0D0D]">
          {/* Header */}
          <div className="p-4 border-b border-[#222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              <h2 className="font-black text-white text-base">المحادثات وصفقات السوق</h2>
            </div>
            <span className="text-[11px] bg-neutral-900 text-[#FFC400] font-bold px-2 py-0.5 rounded-full border border-neutral-800">
              {conversations.length} محادثة
            </span>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#1A1A1A]">
            {loading ? (
              <div className="text-center py-10 text-neutral-500 text-xs">جارِ تحميل المحادثات... ⏳</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12 px-4 text-neutral-500 text-xs space-y-2">
                <span className="text-3xl block">📭</span>
                <p>لا توجد محادثات نشطة حالياً</p>
                <p className="text-[11px] text-neutral-600">
                  تصفح سوق الدراج واضغط "مراسلة البائع" لبدء التفاوض
                </p>
                <Link
                  href="/market"
                  className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-[#FFC400] text-black font-bold text-xs"
                >
                  الذهاب للسوق 🛒
                </Link>
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = conv.id === activeConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full p-3.5 text-right flex items-center gap-3 transition-colors ${
                      isSelected
                        ? "bg-[#181818] border-r-4 border-[#FFC400]"
                        : "hover:bg-[#141414]"
                    }`}
                  >
                    {/* Item Thumbnail */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                      {conv.itemImage ? (
                        <img
                          src={conv.itemImage}
                          alt={conv.itemTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          📱
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-white text-xs truncate max-w-[150px]">
                          {conv.itemTitle}
                        </h4>
                        {conv.itemPrice && (
                          <span className="font-mono text-[11px] font-black text-[#FFC400]">
                            {conv.itemPrice} JOD
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-400 truncate">
                        {conv.lastMessage || "بدء المحادثة..."}
                      </p>

                      <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-500">
                        <span>📍 {conv.itemCity || "عمان"}</span>
                        <span>{new Date(conv.lastMessageAt).toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* LEFT PANE: Active Chat Room */}
        <div className="flex-1 flex flex-col bg-[#111111]">
          {activeConversation ? (
            <>
              {/* Product Header (مثل السوق المفتوح تماماً) */}
              <div className="bg-[#161616] border-b border-[#262626] p-3.5 flex items-center justify-between z-10 shadow-md">
                <div className="flex items-center gap-3.5">
                  {/* Item Image */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700 shrink-0 shadow">
                    {activeConversation.itemImage ? (
                      <img
                        src={activeConversation.itemImage}
                        alt={activeConversation.itemTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        📱
                      </div>
                    )}
                  </div>

                  {/* Item Title & Price & City (OpenSooq Style Header) */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-amber-500/20 text-[#FFC400] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                        المنتج المتفاوض عليه
                      </span>
                      <h3 className="font-black text-white text-sm sm:text-base">
                        {activeConversation.itemTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                      {activeConversation.itemPrice && (
                        <span className="font-mono font-black text-emerald-400 text-sm">
                          {activeConversation.itemPrice} دينار أردني
                        </span>
                      )}
                      <span>•</span>
                      <span>📍 {activeConversation.itemCity || "عمان"}</span>
                      <span>•</span>
                      <span className="font-mono text-neutral-400">
                        البائع: {activeConversation.sellerPhone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Link to Market */}
                <div className="hidden sm:flex items-center gap-2">
                  <a
                    href={`https://wa.me/962${activeConversation.sellerPhone.replace(/^0/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>واتساب</span>
                    <span>💬</span>
                  </a>
                  <Link
                    href="/market"
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition-colors"
                  >
                    السوق
                  </Link>
                </div>
              </div>

              {/* Messages Flow Area */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {/* Security and Trade Notice */}
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300/90 rounded-xl p-3 text-center text-xs space-y-0.5 max-w-lg mx-auto">
                  <span className="font-bold block">🛡️ نصيحة أمان صفقات عالم الصيانة:</span>
                  <p className="text-[11px] text-neutral-300">
                    اتفق مع الفني على فحص البوردة على الباور سبلاي والتأكد من سلامة الآيسيات قبل الدفع النهائي.
                  </p>
                </div>

                {activeConversation.messages.map((msg) => {
                  const isMe = msg.senderPhone === "0790001122";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-start" : "items-end"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[11px] font-bold text-neutral-400">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {new Date(msg.createdAt).toLocaleTimeString("ar-JO", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                          isMe
                            ? "bg-[#FFC400] text-black font-semibold rounded-br-none"
                            : "bg-[#1E1E1E] text-neutral-100 border border-[#2E2E2E] rounded-bl-none"
                        }`}
                      >
                        {msg.text}

                        {msg.imageUrl && (
                          <div className="mt-2 rounded-xl overflow-hidden border border-black/20">
                            <img
                              src={msg.imageUrl}
                              alt="مرفق صورة"
                              className="w-full max-h-60 object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {isMe && (
                        <span className="text-[10px] text-neutral-500 mt-0.5 px-1 font-mono">
                          تم الإرسال ✓✓
                        </span>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="bg-[#161616] border-t border-[#262626] p-3 sm:p-4 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="اكتب رسالتك أو استفسارك بخصوص البوردة هنا..."
                  className="flex-1 bg-[#1F1F1F] border border-[#333] focus:border-[#FFC400] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="px-6 py-3 rounded-xl bg-[#FFC400] hover:bg-[#E0AC00] disabled:opacity-50 text-black font-black text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(255,196,0,0.25)] flex items-center gap-1.5 shrink-0"
                >
                  {sending ? (
                    <span>جارِ الإرسال...</span>
                  ) : (
                    <>
                      <span>إرسال</span>
                      <span>✈️</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-500 space-y-3">
              <span className="text-5xl">💬</span>
              <h3 className="text-base font-bold text-white">اختر محادثة لبدء الدردشة</h3>
              <p className="text-xs max-w-sm">
                يمكنك التحدث مع بائعي اللوحات والتفاوض على الأسعار مع ظهور عنوان المنتج في أعلى المحادثة
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-neutral-400">جارِ تجهيز غرفة الدردشة... ⏳</div>}>
      <ChatContent />
    </Suspense>
  );
}

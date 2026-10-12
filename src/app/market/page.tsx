"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DeadBoardItem, WantedBoardItem } from "@/lib/market-pricing-data";

export default function MarketPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"available" | "wanted">("available");

  // Available Boards State
  const [boards, setBoards] = useState<DeadBoardItem[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [cityFilter, setCityFilter] = useState("الكل");
  const [showAddModal, setShowAddModal] = useState(false);

  // Wanted Boards State
  const [wantedList, setWantedList] = useState<WantedBoardItem[]>([]);
  const [loadingWanted, setLoadingWanted] = useState(true);
  const [showAddWantedModal, setShowAddWantedModal] = useState(false);

  // New available board form state
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("عمان");
  const [boardModel, setBoardModel] = useState("");
  const [price, setPrice] = useState("");
  const [parts, setParts] = useState<string[]>([]);
  const [condition, setCondition] = useState("لوحة ميتة فاصلة باور");

  // New wanted board form state
  const [wPhone, setWPhone] = useState("");
  const [wCity, setWCity] = useState("عمان");
  const [wModel, setWModel] = useState("");
  const [wPart, setWPart] = useState("");
  const [wBudget, setWBudget] = useState("");
  const [wNotes, setWNotes] = useState("");

  const jordanCities = ["الكل", "عمان", "إربد", "الزرقاء", "العقبة", "السلط", "المفرق"];

  const commonPartsList = [
    "آيسي شحن (Charging IC)",
    "آيسي باور (Power IC)",
    "كاميرات خلفية",
    "كاميرا أمامية",
    "سوكت شحن وفلاتات",
    "بيت الشريحة (SIM Tray)",
    "درايفر إضاءة وشاشة",
  ];

  const fetchBoards = async () => {
    try {
      const res = await fetch("/api/boards");
      const json = await res.json();
      if (json.data) setBoards(json.data);
    } catch {
      // offline fallback
    } finally {
      setLoadingBoards(false);
    }
  };

  const fetchWanted = async () => {
    try {
      const res = await fetch("/api/boards?type=wanted");
      const json = await res.json();
      if (json.data) setWantedList(json.data);
    } catch {
      // offline fallback
    } finally {
      setLoadingWanted(false);
    }
  };

  useEffect(() => {
    fetchBoards();
    fetchWanted();
  }, []);

  const handleTogglePart = (part: string) => {
    setParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !boardModel || !price) {
      alert("يرجى ملء الحقول المطلوبة (الهاتف، الموديل، السعر)");
      return;
    }

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerPhone: phone,
          sellerCity: city,
          boardModel,
          priceJOD: Number(price),
          workingParts: parts,
          condition,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setPhone("");
        setBoardModel("");
        setPrice("");
        setParts([]);
        fetchBoards();
      }
    } catch {
      alert("حدث خطأ أثناء إضافة اللوحة");
    }
  };

  const handleCreateWanted = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wPhone || !wModel || !wBudget) {
      alert("يرجى ملء الموديل والميزانية ورقم الهاتف");
      return;
    }

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "wanted",
          requesterPhone: wPhone,
          requesterCity: wCity,
          requestedModel: wModel,
          requiredPart: wPart,
          budgetJOD: Number(wBudget),
          notes: wNotes,
        }),
      });

      if (res.ok) {
        setShowAddWantedModal(false);
        setWPhone("");
        setWModel("");
        setWPart("");
        setWBudget("");
        setWNotes("");
        fetchWanted();
      }
    } catch {
      alert("حدث خطأ أثناء نشر الطلب");
    }
  };

  // Open Chat Room with product header
  const handleOpenChatForBoard = async (board: DeadBoardItem) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          itemId: board.id,
          itemTitle: board.boardModel,
          itemPrice: board.priceJOD,
          itemImage: board.imageUrl,
          itemCity: board.sellerCity,
          sellerPhone: board.sellerPhone,
          buyerPhone: "0790001122"
        }),
      });
      const json = await res.json();
      if (json.data && json.data.id) {
        router.push(`/chat?id=${json.data.id}`);
      }
    } catch {
      router.push("/chat");
    }
  };

  const handleOpenChatForWanted = async (item: WantedBoardItem) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          itemId: item.id,
          itemTitle: `طلب: ${item.requestedModel} - ${item.requiredPart}`,
          itemPrice: item.budgetJOD,
          itemCity: item.requesterCity,
          sellerPhone: item.requesterPhone,
          buyerPhone: "0790001122",
          initialText: `مرحباً، بخصوص طلبك لبوردة (${item.requestedModel})، القطعة متوفرة عندي.`
        }),
      });
      const json = await res.json();
      if (json.data && json.data.id) {
        router.push(`/chat?id=${json.data.id}`);
      }
    } catch {
      router.push("/chat");
    }
  };

  const filteredBoards =
    cityFilter === "الكل"
      ? boards
      : boards.filter((b) => b.sellerCity.includes(cityFilter));

  const filteredWanted =
    cityFilter === "الكل"
      ? wantedList
      : wantedList.filter((w) => w.requesterCity.includes(cityFilter));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 flex-1 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-2">
            <span>الباب الثالث 🚪</span>
            <span>Souq Al-Daraj & In-App Chat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>🛒 سوق الدراج للوحات الميتة وقطع التشليح</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            اشترِ وبِع لوحات ميتة للاستفادة من القطع الشغالة — تواصل فوري عبر المحادثة المباشرة (مثل السوق المفتوح) أو الواتساب
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeTab === "available" ? (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#FFC400] text-black font-black text-xs hover:bg-[#E0AC00] transition-all shadow-[0_0_20px_rgba(255,196,0,0.25)] flex items-center gap-2"
            >
              <span>+ عرض بوردة للبيع</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddWantedModal(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center gap-2"
            >
              <span>+ إضافة طلب بوردة (مطلوب)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center bg-[#141414] border border-[#2B2B2B] p-1.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "available"
                ? "bg-[#FFC400] text-black shadow"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            📦 بوردات معروضة للبيع ({boards.length})
          </button>
          <button
            onClick={() => setActiveTab("wanted")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "wanted"
                ? "bg-amber-500 text-black shadow"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            🔍 مطلوب بوردات وقطع ({wantedList.length})
          </button>
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-neutral-400 ml-1 whitespace-nowrap">
            📍 تصفية حسب المدينة:
          </span>
          {jordanCities.map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                cityFilter === c
                  ? "bg-[#FFC400] text-black"
                  : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Available Boards */}
      {activeTab === "available" && (
        <div>
          {loadingBoards ? (
            <div className="text-center py-12 text-neutral-400">جارِ تحميل اللوحات المعروضة... ⏳</div>
          ) : filteredBoards.length === 0 ? (
            <div className="text-center py-16 bg-[#121212] rounded-2xl border border-[#222]">
              <span className="text-4xl block mb-2">📦</span>
              <p className="text-sm font-bold text-white mb-1">لا توجد بوردات معروضة في هذه المدينة حالياً</p>
              <p className="text-xs text-neutral-400">كن أول من يعرض لوحة للاستفادة منها!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBoards.map((board) => {
                const commission = Math.round(board.priceJOD * 0.15);
                const sellerNet = board.priceJOD - commission;
                const waText = encodeURIComponent(
                  `مرحباً، أنا مهتم بالبوردة المعروضة على تطبيق عالم الصيانة:\nالموديل: ${board.boardModel}\nالسعر: ${board.priceJOD} د.أ\nرقم الإعلان: ${board.id}`
                );

                return (
                  <div
                    key={board.id}
                    className="bg-[#121212] border border-[#242424] hover:border-[#FFC400]/40 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative h-44 w-full bg-neutral-900">
                        <img
                          src={board.imageUrl}
                          alt={board.boardModel}
                          className="w-full h-full object-cover filter brightness-90"
                        />
                        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] font-bold text-white border border-white/10">
                          📍 {board.sellerCity}
                        </div>
                        <div className="absolute top-3 left-3 bg-emerald-500/90 text-black px-2.5 py-1 rounded-lg text-xs font-black shadow">
                          {board.priceJOD} JOD
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="text-base font-black text-white">{board.boardModel}</h3>
                          <p className="text-xs text-neutral-400 mt-0.5">{board.condition}</p>
                        </div>

                        {/* Working parts badges */}
                        <div>
                          <span className="text-[11px] font-bold text-neutral-400 block mb-1.5">
                            القطع الشغالة المؤكدة:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {board.workingParts.map((p, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-md font-semibold"
                              >
                                ✓ {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Commission breakdown */}
                        <div className="bg-[#181818] p-3 rounded-xl border border-neutral-800 text-[11px] space-y-1">
                          <div className="flex items-center justify-between text-neutral-400">
                            <span>سعر البيع الإجمالي:</span>
                            <span className="text-white font-bold">{board.priceJOD} JOD</span>
                          </div>
                          <div className="flex items-center justify-between text-neutral-400">
                            <span>عمولة التطبيق (15%):</span>
                            <span className="text-[#FFC400] font-bold">{commission} JOD</span>
                          </div>
                          <div className="flex items-center justify-between text-neutral-400 border-t border-neutral-700/60 pt-1 font-semibold">
                            <span>صافي البائع المقدر:</span>
                            <span className="text-emerald-400 font-bold">{sellerNet} JOD</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dual Action Buttons: In-App Chat + WhatsApp */}
                    <div className="p-5 pt-0 space-y-2">
                      <button
                        onClick={() => handleOpenChatForBoard(board)}
                        className="w-full py-2.5 rounded-xl bg-[#FFC400] hover:bg-[#E0AC00] text-black font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,196,0,0.25)]"
                      >
                        <span>💬 مراسلة البائع (شات فوري مع تفاصيل المنتج)</span>
                      </button>

                      <a
                        href={`https://wa.me/962${board.sellerPhone.replace(/^0/, "")}?text=${waText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
                      >
                        <span>أو تواصل عبر واتساب</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Wanted Boards */}
      {activeTab === "wanted" && (
        <div>
          {loadingWanted ? (
            <div className="text-center py-12 text-neutral-400">جارِ تحميل طلبات الفنيين... ⏳</div>
          ) : filteredWanted.length === 0 ? (
            <div className="text-center py-16 bg-[#121212] rounded-2xl border border-[#222]">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-sm font-bold text-white mb-1">لا يوجد طلبات حالياً في هذه المدينة</p>
              <p className="text-xs text-neutral-400">إذا كنت تبحث عن بوردة أو آيسي نادر، انقر على زر إضافة طلب بالأعلى!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWanted.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#141414] border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-3">
                      <div>
                        <div className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px] mb-1">
                          مطلوب بوردة للشراء 🎯
                        </div>
                        <h3 className="text-base font-black text-white">{item.requestedModel}</h3>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-neutral-400 block">الميزانية:</span>
                        <span className="font-mono text-sm font-black text-emerald-400">
                          {item.budgetJOD} JOD
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-neutral-400 block text-[11px]">القطعة المطلوبة تحديداً:</span>
                        <p className="font-bold text-neutral-200">{item.requiredPart}</p>
                      </div>

                      {item.notes && (
                        <div>
                          <span className="text-neutral-400 block text-[11px]">ملاحظات:</span>
                          <p className="text-neutral-400 text-[11px] bg-[#1A1A1A] p-2 rounded-lg border border-neutral-800">
                            {item.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-850">
                        <span>📍 {item.requesterCity}</span>
                        <span>{new Date(item.createdAt).toLocaleDateString("ar-JO")}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenChatForWanted(item)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    <span>💬 مراسلة صاحب الطلب (القطعة عندي)</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-lg font-black text-white">عرض لوحة جديدة للبيع</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  موديل اللوحة / الجهاز:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Samsung Galaxy A12 أو Redmi 9"
                  value={boardModel}
                  onChange={(e) => setBoardModel(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    المدينة:
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  >
                    {jordanCities
                      .filter((c) => c !== "الكل")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    السعر المطلوب (JOD):
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="مثال: 12"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  رقم هاتف الواتساب:
                </label>
                <input
                  type="text"
                  required
                  placeholder="079XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  حالة اللوحة:
                </label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="مثال: فاصلة باور، شورت ماء..."
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-2">
                  القطع الشغالة المتوفرة بالبوردة:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {commonPartsList.map((cp) => (
                    <label
                      key={cp}
                      className="flex items-center gap-2 bg-[#1A1A1A] p-2 rounded border border-neutral-800 cursor-pointer text-[11px]"
                    >
                      <input
                        type="checkbox"
                        checked={parts.includes(cp)}
                        onChange={() => handleTogglePart(cp)}
                        className="accent-[#FFC400]"
                      />
                      <span>{cp}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#FFC400] text-black font-black hover:bg-[#E0AC00]"
                >
                  نشر الإعلان فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddWantedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-lg font-black text-white">إضافة طلب بوردة (أبحث عن قطعة)</h2>
              <button
                onClick={() => setShowAddWantedModal(false)}
                className="text-neutral-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWanted} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  موديل الجهاز المطلوب:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Samsung Galaxy A32 أو Redmi Note 11"
                  value={wModel}
                  onChange={(e) => setWModel(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  القطعة المطلوبة بالتحديد:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: آيسي باور PM6225 سليم أو بوردة كاملة"
                  value={wPart}
                  onChange={(e) => setWPart(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    المدينة:
                  </label>
                  <select
                    value={wCity}
                    onChange={(e) => setWCity(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  >
                    {jordanCities
                      .filter((c) => c !== "الكل")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    الميزانية المعروضة (JOD):
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="مثال: 15"
                    value={wBudget}
                    onChange={(e) => setWBudget(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  رقم هاتفك للتواصل (واتساب):
                </label>
                <input
                  type="text"
                  required
                  placeholder="07XXXXXXXX"
                  value={wPhone}
                  onChange={(e) => setWPhone(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  ملاحظات إضافية:
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: مستعجل لزبون، التسليم يد بيد في مجمع الشمال..."
                  value={wNotes}
                  onChange={(e) => setWNotes(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-amber-500 text-black font-black hover:bg-amber-400"
                >
                  نشر طلب القطعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

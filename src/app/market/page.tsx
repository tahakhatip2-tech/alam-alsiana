"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DeadBoardItem,
  WantedBoardItem,
  PhoneListingItem,
  INITIAL_PHONES,
} from "@/lib/market-pricing-data";
import {
  ShoppingCart,
  DoorOpen,
  Smartphone,
  Package,
  Search,
  MapPin,
  Sparkles,
  Store,
  Wrench,
  HardDrive,
  BatteryCharging,
  Palette,
  MessageSquare,
  MessageCircle,
  Check,
  Plus,
  X,
  Send,
  Loader2,
  Filter,
} from "lucide-react";

export default function MarketPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"phones" | "boards" | "wanted">("phones");

  // Phones State
  const [phones, setPhones] = useState<PhoneListingItem[]>([]);
  const [loadingPhones, setLoadingPhones] = useState(true);
  const [phoneBrandFilter, setPhoneBrandFilter] = useState("الكل");

  // Available Boards State
  const [boards, setBoards] = useState<DeadBoardItem[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);

  // Wanted State
  const [wantedList, setWantedList] = useState<WantedBoardItem[]>([]);
  const [loadingWanted, setLoadingWanted] = useState(true);

  // Global City Filter
  const [cityFilter, setCityFilter] = useState("الكل");

  // Modals
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);
  const [showAddWantedModal, setShowAddWantedModal] = useState(false);

  // Form: Phone
  const [pTitle, setPTitle] = useState("");
  const [pBrand, setPBrand] = useState("Apple");
  const [pModel, setPModel] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCity, setPCity] = useState("عمان");
  const [pCondition, setPCityCondition] = useState("مستعمل نظيف جداً 95%");
  const [pBattery, setPBattery] = useState("90");
  const [pStorage, setPStorage] = useState("256GB");
  const [pColor, setPColor] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pPhone, setPPhone] = useState("");
  const [pRole, setPRole] = useState<"TECH" | "TRADER" | "CUSTOMER">("TECH");

  // Form: Board
  const [bPhone, setBPhone] = useState("");
  const [bCity, setBCity] = useState("عمان");
  const [bModel, setBModel] = useState("");
  const [bPrice, setBPrice] = useState("");
  const [bParts, setBParts] = useState<string[]>([]);
  const [bCondition, setBCondition] = useState("لوحة ميتة فاصلة باور");

  // Form: Wanted
  const [wPhone, setWPhone] = useState("");
  const [wCity, setWCity] = useState("عمان");
  const [wModel, setWModel] = useState("");
  const [wPart, setWPart] = useState("");
  const [wBudget, setWBudget] = useState("");
  const [wNotes, setWNotes] = useState("");

  const jordanCities = ["الكل", "عمان", "إربد", "الزرقاء", "العقبة", "السلط", "المفرق"];
  const phoneBrands = ["الكل", "Apple", "Samsung", "Xiaomi", "Honor", "Huawei"];

  const commonPartsList = [
    "آيسي شحن (Charging IC)",
    "آيسي باور (Power IC)",
    "كاميرات خلفية",
    "كاميرا أمامية",
    "سوكت شحن وفلاتات",
    "بيت الشريحة (SIM Tray)",
    "درايفر إضاءة وشاشة",
  ];

  // Fetch data
  const fetchPhones = async () => {
    try {
      const res = await fetch("/api/boards?type=phones");
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setPhones(json.data);
      } else {
        setPhones(INITIAL_PHONES);
      }
    } catch {
      setPhones(INITIAL_PHONES);
    } finally {
      setLoadingPhones(false);
    }
  };

  const fetchBoards = async () => {
    try {
      const res = await fetch("/api/boards");
      const json = await res.json();
      if (json.data) setBoards(json.data);
    } catch {
      // fallback
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
      // fallback
    } finally {
      setLoadingWanted(false);
    }
  };

  useEffect(() => {
    fetchPhones();
    fetchBoards();
    fetchWanted();
  }, []);

  const handleTogglePart = (part: string) => {
    setBParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  // Submit: Phone
  const handleCreatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle || !pPrice || !pPhone) {
      alert("يرجى ملء العنوان والسعر ورقم الهاتف");
      return;
    }

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "phone",
          title: pTitle,
          brand: pBrand,
          model: pModel || pTitle,
          priceJOD: Number(pPrice),
          city: pCity,
          condition: pCondition,
          battery: pBattery ? Number(pBattery) : undefined,
          storage: pStorage,
          color: pColor,
          description: pDesc,
          sellerPhone: pPhone,
          sellerRole: pRole,
        }),
      });

      if (res.ok) {
        setShowAddPhoneModal(false);
        setPTitle("");
        setPModel("");
        setPPrice("");
        setPDesc("");
        setPPhone("");
        fetchPhones();
      }
    } catch {
      alert("حدث خطأ أثناء إضافة الهاتف");
    }
  };

  // Submit: Board
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bPhone || !bModel || !bPrice) {
      alert("يرجى ملء الحقول المطلوبة (الهاتف، الموديل، السعر)");
      return;
    }

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerPhone: bPhone,
          sellerCity: bCity,
          boardModel: bModel,
          priceJOD: Number(bPrice),
          workingParts: bParts,
          condition: bCondition,
        }),
      });

      if (res.ok) {
        setShowAddBoardModal(false);
        setBPhone("");
        setBModel("");
        setBPrice("");
        setBParts([]);
        fetchBoards();
      }
    } catch {
      alert("حدث خطأ أثناء إضافة اللوحة");
    }
  };

  // Submit: Wanted
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
          requiredPart: wPart || "جهاز كامل أو بوردة",
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

  // Chat Navigations
  const handleOpenChatForPhone = async (item: PhoneListingItem) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          itemId: item.id,
          itemTitle: item.title,
          itemPrice: item.priceJOD,
          itemImage: item.imageUrl,
          itemCity: item.city,
          sellerPhone: item.sellerPhone,
          buyerPhone: "0790001122",
          initialText: `مرحباً، أنا مهتم بهاتف (${item.title}) المعروض بسعر ${item.priceJOD} دينار أردني. هل الجهاز ما زال متوفراً؟`,
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
          buyerPhone: "0790001122",
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
          initialText: `مرحباً، بخصوص طلبك لـ (${item.requestedModel})، القطعة أو الجهاز متوفر عندي.`,
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

  // Filtered Lists
  const filteredPhones = phones.filter((p) => {
    const cityMatch = cityFilter === "الكل" || p.city.includes(cityFilter);
    const brandMatch = phoneBrandFilter === "الكل" || p.brand.toLowerCase() === phoneBrandFilter.toLowerCase();
    return cityMatch && brandMatch;
  });

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/20">
            <DoorOpen className="w-3.5 h-3.5" />
            <span>الباب الثالث</span>
            <span className="text-emerald-500/80">The Market & In-App Chat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-[#FFC400]" />
            <span>السوق الشامل للهواتف واللوحات وقطع الغيار</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            سوق مفتوح ومتخصص للهواتف الذكية (جديد ومستعمل)، بوردات التشليح، وطلبات الشراء في الأردن مع محادثة مباشرة وواتساب
          </p>
        </div>

        {/* Action Buttons - High-tech Outlines */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddPhoneModal(true)}
            className="px-4 py-2.5 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,196,0,0.25)] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>بيع هاتف</span>
            <Smartphone className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowAddBoardModal(true)}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900/50 hover:border-[#FFC400] text-neutral-200 hover:text-[#FFC400] font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>عرض بوردة</span>
            <Package className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowAddWantedModal(true)}
            className="px-3.5 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:border-amber-400 hover:bg-amber-500/20 text-amber-400 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>طلب شراء</span>
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tabs Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Tabs Bar */}
        <div className="flex items-center bg-[#141414] border border-[#2B2B2B] p-1.5 rounded-xl text-xs font-bold overflow-x-auto max-w-full gap-1">
          <button
            onClick={() => setActiveTab("phones")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "phones"
                ? "border-2 border-[#FFC400] bg-[#FFC400]/10 text-[#FFC400] shadow-[0_0_15px_rgba(255,196,0,0.25)] font-black"
                : "border border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>سوق الهواتف</span>
            <span className="bg-black/50 border border-current/20 px-1.5 py-0.5 rounded text-[10px]">({phones.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("boards")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "boards"
                ? "border-2 border-[#FFC400] bg-[#FFC400]/10 text-[#FFC400] shadow-[0_0_15px_rgba(255,196,0,0.25)] font-black"
                : "border border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>بوردات وقطع تشليح</span>
            <span className="bg-black/50 border border-current/20 px-1.5 py-0.5 rounded text-[10px]">({boards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("wanted")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "wanted"
                ? "border-2 border-amber-400 bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)] font-black"
                : "border border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>مطلوب أجهزة وقطع</span>
            <span className="bg-black/50 border border-current/20 px-1.5 py-0.5 rounded text-[10px]">({wantedList.length})</span>
          </button>
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full touch-pan-x snap-x">
          <span className="text-xs font-bold text-neutral-400 ml-1 whitespace-nowrap flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#FFC400]" />
            <span>المدينة:</span>
          </span>
          {jordanCities.map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                cityFilter === c
                  ? "border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 shadow-[0_0_10px_rgba(255,196,0,0.2)] font-black"
                  : "border border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-600 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PHONES MARKETPLACE (NEW & USED) */}
      {/* ======================================================== */}
      {activeTab === "phones" && (
        <div className="space-y-6">
          {/* Brand Sub-filter for phones */}
          <div className="flex items-center justify-between gap-3 flex-wrap bg-[#111] p-3 rounded-2xl border border-neutral-800">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full touch-pan-x snap-x">
              <span className="text-xs font-bold text-neutral-400 whitespace-nowrap flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#FFC400]" />
                <span>الماركة:</span>
              </span>
              {phoneBrands.map((b) => (
                <button
                  key={b}
                  onClick={() => setPhoneBrandFilter(b)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    phoneBrandFilter === b
                      ? "border-2 border-white text-white bg-white/10 font-black shadow"
                      : "border border-neutral-800 bg-[#1A1A1A]/80 text-neutral-300 hover:text-white hover:border-neutral-600"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            <span className="text-xs text-neutral-400 font-bold">
              يظهر: <span className="text-[#FFC400]">{filteredPhones.length}</span> هاتف متاح
            </span>
          </div>

          {loadingPhones ? (
            <div className="text-center py-12 text-neutral-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#FFC400]" />
              <span>جارِ تحميل سوق الهواتف...</span>
            </div>
          ) : filteredPhones.length === 0 ? (
            <div className="text-center py-16 bg-[#121212] rounded-2xl border border-[#222]">
              <Smartphone className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-1">لا توجد هواتف معروضة بهذه التصفية حالياً</p>
              <p className="text-xs text-neutral-400">كن أول من ينشر إعلان بيع لهاتفك واجذب الزبائن والفنيين فوراً!</p>
              <button
                onClick={() => setShowAddPhoneModal(true)}
                className="mt-4 px-5 py-2.5 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-xs transition-all shadow-[0_0_15px_rgba(255,196,0,0.2)]"
              >
                + نشر إعلان بيع هاتف الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhones.map((phoneItem) => {
                const waText = encodeURIComponent(
                  `مرحباً، أنا مهتم بهاتفك المعروض في سوق تطبيق عالم الصيانة:\nالموديل: ${phoneItem.title}\nالسعر: ${phoneItem.priceJOD} د.أ\nالمدينة: ${phoneItem.city}`
                );

                return (
                  <div
                    key={phoneItem.id}
                    className="bg-[#121212] border border-[#242424] rounded-2xl overflow-hidden hover:border-[#FFC400]/50 transition-all shadow-xl flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image + Top Badges */}
                      <div className="relative h-52 bg-black overflow-hidden">
                        <img
                          src={phoneItem.imageUrl}
                          alt={phoneItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur border border-white/15 text-white text-[11px] font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#FFC400]" />
                            <span>{phoneItem.city}</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[11px] font-black shadow">
                            {phoneItem.priceJOD} JOD
                          </span>
                        </div>

                        {/* Condition Badge */}
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2 py-0.5 rounded bg-black/80 text-[#FFC400] border border-[#FFC400]/40 text-[10px] font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>{phoneItem.condition}</span>
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-neutral-400 font-bold block">{phoneItem.brand}</span>
                            <h3 className="font-black text-white text-base leading-snug">{phoneItem.title}</h3>
                          </div>
                          {phoneItem.sellerRole === "TRADER" && (
                            <span className="text-[9px] bg-blue-500/15 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded-full font-bold shrink-0 flex items-center gap-1">
                              <Store className="w-3 h-3" />
                              <span>تاجر</span>
                            </span>
                          )}
                          {phoneItem.sellerRole === "TECH" && (
                            <span className="text-[9px] bg-[#FFC400]/15 text-[#FFC400] border border-[#FFC400]/40 px-2 py-0.5 rounded-full font-bold shrink-0 flex items-center gap-1">
                              <Wrench className="w-3 h-3" />
                              <span>فني</span>
                            </span>
                          )}
                        </div>

                        {/* Specs Pills */}
                        <div className="flex items-center gap-2 flex-wrap text-[11px]">
                          {phoneItem.storage && (
                            <span className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold flex items-center gap-1">
                              <HardDrive className="w-3 h-3 text-neutral-400" />
                              <span>{phoneItem.storage}</span>
                            </span>
                          )}
                          {phoneItem.battery && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                              <BatteryCharging className="w-3 h-3 text-emerald-400" />
                              <span>بطارية {phoneItem.battery}%</span>
                            </span>
                          )}
                          {phoneItem.color && (
                            <span className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center gap-1">
                              <Palette className="w-3 h-3 text-neutral-400" />
                              <span>{phoneItem.color}</span>
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                          {phoneItem.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Footer - Crisp Outline Buttons */}
                    <div className="p-4 bg-[#0F0F0F] border-t border-[#1F1F1F] flex items-center gap-2.5">
                      <button
                        onClick={() => handleOpenChatForPhone(phoneItem)}
                        className="flex-1 py-2.5 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,196,0,0.15)] hover:shadow-[0_0_20px_rgba(255,196,0,0.4)]"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>دردشة فورية</span>
                      </button>

                      <a
                        href={`https://wa.me/962${phoneItem.sellerPhone.replace(/^0/, "")}?text=${waText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 rounded-xl border-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>واتساب</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BOARDS & SCRAP (بوردات وقطع تشليح) */}
      {/* ======================================================== */}
      {activeTab === "boards" && (
        <div>
          {loadingBoards ? (
            <div className="text-center py-12 text-neutral-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#FFC400]" />
              <span>جارِ تحميل اللوحات المعروضة...</span>
            </div>
          ) : filteredBoards.length === 0 ? (
            <div className="text-center py-16 bg-[#121212] rounded-2xl border border-[#222]">
              <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
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
                    className="bg-[#121212] border border-[#242424] rounded-2xl overflow-hidden hover:border-[#FFC400]/50 transition-colors shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-44 bg-black overflow-hidden">
                        <img
                          src={board.imageUrl}
                          alt={board.boardModel}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur border border-white/10 text-white text-[11px] font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#FFC400]" />
                            <span>{board.sellerCity}</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[11px] font-black">
                            {board.priceJOD} JOD
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="font-black text-white text-base">{board.boardModel}</h3>
                          <p className="text-neutral-400 text-xs mt-0.5">{board.condition}</p>
                        </div>

                        {/* Working Parts Tags */}
                        <div>
                          <span className="text-[11px] font-bold text-neutral-400 block mb-2">
                            القطع الشغالة المؤكدة:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {board.workingParts.map((part, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1"
                              >
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>{part}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Commission Info */}
                        <div className="bg-[#1A1A1A] p-2.5 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                          <span>صافي الفني بعد العمولة:</span>
                          <span className="font-bold text-[#FFC400] font-mono">{sellerNet} JOD</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions - Outlines */}
                    <div className="p-4 bg-[#0F0F0F] border-t border-[#1C1C1C] flex items-center gap-2.5">
                      <button
                        onClick={() => handleOpenChatForBoard(board)}
                        className="flex-1 py-2.5 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,196,0,0.15)] hover:shadow-[0_0_20px_rgba(255,196,0,0.4)]"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>مراسلة في التطبيق</span>
                      </button>

                      <a
                        href={`https://wa.me/962${board.sellerPhone.replace(/^0/, "")}?text=${waText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 rounded-xl border-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>واتساب</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: WANTED REQUESTS (مطلوب بوردات وهواتف) */}
      {/* ======================================================== */}
      {activeTab === "wanted" && (
        <div>
          {loadingWanted ? (
            <div className="text-center py-12 text-neutral-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#FFC400]" />
              <span>جارِ تحميل طلبات الشراء...</span>
            </div>
          ) : filteredWanted.length === 0 ? (
            <div className="text-center py-16 bg-[#121212] rounded-2xl border border-[#222]">
              <Search className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-1">لا توجد طلبات شراء مسجلة حالياً</p>
              <p className="text-xs text-neutral-400">إذا كنت تبحث عن جهاز أو بوردة نادرة، انشر طلبك هنا ليصل لجميع الفنيين!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWanted.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#121212] border border-[#242424] rounded-2xl p-5 space-y-4 shadow-lg hover:border-amber-500/40 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-3">
                      <div>
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-500/20 block mb-1">
                          طلب شراء عاجل
                        </span>
                        <h3 className="font-black text-white text-base">{item.requestedModel}</h3>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-neutral-400 block">الميزانية:</span>
                        <span className="font-mono text-base font-black text-emerald-400">
                          {item.budgetJOD} JOD
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-neutral-400 block text-[11px]">المطلوب بالتحديد:</span>
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

                      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-800">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{item.requesterCity}</span>
                        </span>
                        <span>{new Date(item.createdAt).toLocaleDateString("ar-JO")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleOpenChatForWanted(item)}
                      className="flex-1 py-2.5 rounded-xl border-2 border-amber-400 text-amber-400 bg-amber-400/10 hover:bg-amber-400 hover:text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(251,191,36,0.15)] hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>دردشة (متوفر عندي)</span>
                    </button>
                    <a
                      href={`https://wa.me/962${item.requesterPhone.replace(/^0/, "")}?text=${encodeURIComponent(
                        `مرحباً، بخصوص طلبك لـ (${item.requestedModel}) على تطبيق عالم الصيانة، الجهاز أو القطعة متوفرة عندي.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl border-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black font-bold text-xs flex items-center justify-center transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD PHONE FOR SALE */}
      {/* ======================================================== */}
      {showAddPhoneModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#FFC400]" />
                <h2 className="text-base font-black text-white">إضافة هاتف للبيع في السوق</h2>
              </div>
              <button
                onClick={() => setShowAddPhoneModal(false)}
                className="w-8 h-8 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePhone} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  عنوان الإعلان:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: iPhone 13 Pro Max أزرق 256GB نظيف جداً"
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    الماركة:
                  </label>
                  <select
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  >
                    <option value="Apple">Apple (آيفون)</option>
                    <option value="Samsung">Samsung (سامسونج)</option>
                    <option value="Xiaomi">Xiaomi (شاومي)</option>
                    <option value="Honor">Honor (هونر)</option>
                    <option value="Huawei">Huawei (هواوي)</option>
                    <option value="General">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    السعر المطلوب (دينار أردني):
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="مثال: 350"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    الذاكرة:
                  </label>
                  <select
                    value={pStorage}
                    onChange={(e) => setPStorage(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  >
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    صحة البطارية (%):
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    placeholder="مثال: 88"
                    value={pBattery}
                    onChange={(e) => setPBattery(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    المدينة:
                  </label>
                  <select
                    value={pCity}
                    onChange={(e) => setPCity(e.target.value)}
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
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  حالة ونظافة الجهاز:
                </label>
                <select
                  value={pCondition}
                  onChange={(e) => setPCityCondition(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                >
                  <option value="جديد بالكرتونة بتغليف المصنع">جديد بالكرتونة بتغليف المصنع</option>
                  <option value="مستعمل نظيف جداً 95% (بدون خدوش)">مستعمل نظيف جداً 95% (بدون خدوش)</option>
                  <option value="مستعمل بحالة جيدة (خدوش بسيطة)">مستعمل بحالة جيدة (خدوش بسيطة)</option>
                  <option value="مستعمل مع كسر في الظهر أو الشاشة">مستعمل مع كسر في الظهر أو الشاشة</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    رقم هاتف التواصل والواتساب:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="07XXXXXXXX"
                    value={pPhone}
                    onChange={(e) => setPPhone(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    صفة المعلن:
                  </label>
                  <select
                    value={pRole}
                    onChange={(e) => setPRole(e.target.value as "TECH" | "TRADER" | "CUSTOMER")}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  >
                    <option value="TECH">فني صيانة (مفحوص)</option>
                    <option value="TRADER">محل / تاجر معتمد</option>
                    <option value="CUSTOMER">مستخدم عادي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  تفاصيل إضافية عن الهاتف:
                </label>
                <textarea
                  rows={2}
                  placeholder="الملحقات الموجودة (كرتونة، شاحن، كفالة)، تاريخ الاستعمال..."
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPhoneModal(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-700 bg-transparent text-neutral-300 font-bold hover:border-neutral-500 hover:text-white transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black shadow-[0_0_20px_rgba(255,196,0,0.25)] transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>نشر إعلان الهاتف فوراً</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD BOARD FOR SALE */}
      {/* ======================================================== */}
      {showAddBoardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FFC400]" />
                <h2 className="text-base font-black text-white">عرض لوحة جديدة للبيع (تشليح)</h2>
              </div>
              <button
                onClick={() => setShowAddBoardModal(false)}
                className="w-8 h-8 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
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
                  value={bModel}
                  onChange={(e) => setBModel(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    المدينة:
                  </label>
                  <select
                    value={bCity}
                    onChange={(e) => setBCity(e.target.value)}
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
                    value={bPrice}
                    onChange={(e) => setBPrice(e.target.value)}
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
                  value={bPhone}
                  onChange={(e) => setBPhone(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  حالة اللوحة:
                </label>
                <input
                  type="text"
                  value={bCondition}
                  onChange={(e) => setBCondition(e.target.value)}
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
                        checked={bParts.includes(cp)}
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
                  onClick={() => setShowAddBoardModal(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-700 bg-transparent text-neutral-300 font-bold hover:border-neutral-500 hover:text-white transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black shadow-[0_0_20px_rgba(255,196,0,0.25)] transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>نشر الإعلان فوراً</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD WANTED REQUEST */}
      {/* ======================================================== */}
      {showAddWantedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-black text-white">إضافة طلب شراء (أبحث عن جهاز أو قطعة)</h2>
              </div>
              <button
                onClick={() => setShowAddWantedModal(false)}
                className="w-8 h-8 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
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
                  placeholder="مثال: Samsung Galaxy A32 أو iPhone 12 أو Redmi 11"
                  value={wModel}
                  onChange={(e) => setWModel(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  القطعة أو الطلب بالتحديد:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: جهاز كامل سليم، بوردة فيها معالج سليم، شاشة أصلية..."
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
                    placeholder="مثال: 50"
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
                  onClick={() => setShowAddWantedModal(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-700 bg-transparent text-neutral-300 font-bold hover:border-neutral-500 hover:text-white transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg border-2 border-amber-400 text-amber-400 bg-amber-400/10 hover:bg-amber-400 hover:text-black font-black shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>نشر طلب الشراء</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

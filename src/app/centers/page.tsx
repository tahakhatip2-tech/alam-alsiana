"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MaintenanceCenter, INITIAL_MAINTENANCE_CENTERS } from "@/lib/centers-data";
import {
  Wrench,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  MessageSquare,
  Search,
  Plus,
  Navigation,
  X,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Cpu,
  Store,
  ChevronDown,
  Building2,
  Check,
} from "lucide-react";

export default function CentersDirectoryPage() {
  const router = useRouter();
  const [centers, setCenters] = useState<MaintenanceCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("الكل");
  const [openOnly, setOpenOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);

  // Modals state
  const [selectedCenterForRepair, setSelectedCenterForRepair] = useState<MaintenanceCenter | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Repair Request Form State
  const [repairDevice, setRepairDevice] = useState("");
  const [repairFault, setRepairFault] = useState("");
  const [repairImei, setRepairImei] = useState("");
  const [repairPhone, setRepairPhone] = useState("");
  const [repairNotes, setRepairNotes] = useState("");
  const [submittingRepair, setSubmittingRepair] = useState(false);

  // Register Workshop Form State
  const [regName, setRegName] = useState("");
  const [regOwner, setRegOwner] = useState("");
  const [regCity, setRegCity] = useState("عمان");
  const [regArea, setRegArea] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regSpecialties, setRegSpecialties] = useState("");
  const [regBio, setRegBio] = useState("");
  const [submittingReg, setSubmittingReg] = useState(false);

  // Expanded services on card state
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});

  const jordanCities = ["الكل", "عمان", "إربد", "الزرقاء", "العقبة", "السلط", "المفرق"];

  const fetchCenters = async () => {
    try {
      const res = await fetch("/api/centers");
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setCenters(json.data);
      } else {
        setCenters(INITIAL_MAINTENANCE_CENTERS);
      }
    } catch {
      setCenters(INITIAL_MAINTENANCE_CENTERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleOpenChatWithCenter = async (center: MaintenanceCenter) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          itemId: center.id,
          itemTitle: `طلب صيانة / استفسار - ${center.name}`,
          itemPrice: 0,
          itemImage: center.logo,
          itemCity: center.city,
          sellerPhone: center.phone,
          buyerPhone: "0790001122",
          initialText: `مرحباً مهندس (${center.ownerName})، أود الاستفسار عن فحص وصيانة جهاز لدي عبر تطبيق عالم الصيانة.`,
        }),
      });
      const json = await res.json();
      if (json.data && json.data.id) {
        router.push(`/chat?id=${json.data.id}`);
      } else {
        router.push("/chat");
      }
    } catch {
      router.push("/chat");
    }
  };

  const handleSendRepairRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repairDevice || !repairFault || !repairPhone || !selectedCenterForRepair) {
      alert("الرجاء إدخال نوع الجهاز ووصف العطل ورقم هاتفك");
      return;
    }

    setSubmittingRepair(true);
    try {
      // Create chat conversation directly with repair info
      const waMessage = encodeURIComponent(
        `مرحباً ${selectedCenterForRepair.name} (${selectedCenterForRepair.ownerName})،\nأود طلب صيانة لجهازي عبر عالم الصيانة:\n• الجهاز: ${repairDevice}\n• العطل: ${repairFault}\n• الـ IMEI: ${repairImei || "غير محدد"}\n• هاتفي: ${repairPhone}\nيرجى إفادتي بالتكلفة والوقت المتوقع. شكراً!`
      );

      // Open whatsapp or local toast
      window.open(`https://wa.me/962${selectedCenterForRepair.whatsapp.replace(/^0/, "")}?text=${waMessage}`, "_blank");

      setSuccessToast(`تم إرسال طلب الصيانة إلى (${selectedCenterForRepair.name}) بنجاح!`);
      setSelectedCenterForRepair(null);
      setRepairDevice("");
      setRepairFault("");
      setRepairImei("");
      setRepairPhone("");
      setRepairNotes("");
      setTimeout(() => setSuccessToast(null), 5000);
    } catch {
      alert("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setSubmittingRepair(false);
    }
  };

  const handleRegisterWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regCity) {
      alert("الرجاء ملء اسم الورشة ورقم الهاتف والمدينة");
      return;
    }

    setSubmittingReg(true);
    try {
      const res = await fetch("/api/centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          ownerName: regOwner || "فني معتمد",
          city: regCity,
          area: regArea,
          phone: regPhone,
          whatsapp: regPhone,
          specialties: regSpecialties
            ? regSpecialties.split("،").map((s) => s.trim())
            : ["صيانة عامة", "شاشات", "باور"],
          bio: regBio,
        }),
      });

      if (res.ok) {
        setShowRegisterModal(false);
        setRegName("");
        setRegOwner("");
        setRegArea("");
        setRegPhone("");
        setRegSpecialties("");
        setRegBio("");
        setSuccessToast("تم تسجيل ورشتك بنجاح في دليل عالم الصيانة المعتمد!");
        fetchCenters();
        setTimeout(() => setSuccessToast(null), 5000);
      }
    } catch {
      alert("حدث خطأ أثناء تسجيل الورشة");
    } finally {
      setSubmittingReg(false);
    }
  };

  // Filtered Centers
  const filteredCenters = centers.filter((center) => {
    const matchesCity = selectedCity === "الكل" || center.city.includes(selectedCity);
    const matchesOpen = !openOnly || center.isOpenNow;
    const matchesRating = !topRatedOnly || center.rating >= 4.8;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      center.name.toLowerCase().includes(q) ||
      center.ownerName.toLowerCase().includes(q) ||
      center.area.toLowerCase().includes(q) ||
      center.specialties.some((s) => s.toLowerCase().includes(q)) ||
      center.bio.toLowerCase().includes(q);

    return matchesCity && matchesOpen && matchesRating && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-8 flex-1 w-full">
      {/* Success Notification Banner */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-400 font-bold text-xs sm:text-sm flex items-center justify-between shadow-[0_0_25px_rgba(16,185,129,0.25)] animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Top Hero & Directory Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#161616] via-[#101010] to-black border border-[#2B2B2B] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFC400]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/30 text-[#FFC400] text-xs font-black shadow-inner">
              <ShieldCheck className="w-4 h-4" />
              <span>دليل الورش المعتمدة في المملكة الأردنية الهاشمية</span>
              <span className="bg-[#FFC400] text-black px-1.5 py-0.2 rounded text-[10px]">Verified PRO</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              مراكز وورش الصيانة المعتمدة
            </h1>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              تصفح نخبة ورش ومهندسي صيانة الهواتف الموثقين في الأردن. تواصل معهم مباشرة لطلب صيانة، فحص سحب الباور سبلاي، تبديل شاشات أصلية، أو شراء قطع تشليح مع كفالات رسمية.
            </p>
          </div>

          {/* Action Button & Stats Pills */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-5 py-3 rounded-2xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,196,0,0.25)] flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>انضم وسجّل ورشتك مجاناً</span>
              <Building2 className="w-4 h-4" />
            </button>

            {/* Quick Counters Banner */}
            <div className="grid grid-cols-3 gap-2 text-center bg-black/60 border border-neutral-800 p-2 rounded-2xl">
              <div className="px-3 py-1">
                <span className="text-[10px] text-neutral-400 block font-bold">المراكز</span>
                <span className="text-sm sm:text-base font-black text-[#FFC400] font-mono">{centers.length}</span>
              </div>
              <div className="px-3 py-1 border-x border-neutral-800">
                <span className="text-[10px] text-neutral-400 block font-bold">التقييم</span>
                <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">4.9 ★</span>
              </div>
              <div className="px-3 py-1">
                <span className="text-[10px] text-neutral-400 block font-bold">الاعتماد</span>
                <span className="text-sm sm:text-base font-black text-blue-400 font-mono">100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Search & Filter Controls Bar ── */}
        <div className="pt-4 border-t border-neutral-800/80 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المركز، المهندس، التخصص (آيسي، باغة، شاشة)، أو المنطقة..."
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFC400] rounded-xl pr-10 pl-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Toggle Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setOpenOnly(!openOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border-2 ${
                  openOnly
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "border-neutral-800 bg-[#181818] text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${openOnly ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
                <span>مفتوح الآن</span>
              </button>

              <button
                onClick={() => setTopRatedOnly(!topRatedOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border-2 ${
                  topRatedOnly
                    ? "border-[#FFC400] bg-[#FFC400]/15 text-[#FFC400] shadow-[0_0_15px_rgba(255,196,0,0.2)]"
                    : "border-neutral-800 bg-[#181818] text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>الأعلى تقييماً (4.8+)</span>
              </button>
            </div>
          </div>

          {/* City Chips Bar - Smooth Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full touch-pan-x snap-x">
            <span className="text-xs font-bold text-neutral-400 ml-1 whitespace-nowrap flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FFC400]" />
              <span>المحافظة:</span>
            </span>
            {jordanCities.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  selectedCity === c
                    ? "border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 shadow-[0_0_10px_rgba(255,196,0,0.2)] font-black"
                    : "border border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-600 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
            <span className="text-[11px] text-neutral-500 mr-auto whitespace-nowrap font-mono">
              يظهر: <strong className="text-[#FFC400]">{filteredCenters.length}</strong> مركز
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Centers Feed ── */}
      {loading ? (
        <div className="text-center py-20 text-neutral-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFC400]" />
          <span className="font-bold text-sm">جارِ تحميل دليل مراكز الصيانة المعتمدة...</span>
        </div>
      ) : filteredCenters.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] rounded-3xl border border-[#242424] space-y-3 p-6">
          <Store className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-base font-black text-white">لا توجد مراكز مطابقة لخيارات البحث حالياً</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            جرّب تغيير خيارات البحث أو اختيار &quot;الكل&quot; لعرض جميع الورش المسجلة في مختلف محافظات الأردن.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCity("الكل");
              setOpenOnly(false);
              setTopRatedOnly(false);
            }}
            className="px-4 py-2 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-bold text-xs transition-all"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => {
            const waDefaultText = encodeURIComponent(
              `مرحباً ${center.name} (${center.ownerName})، أود الاستفسار عن فحص وصيانة جهاز لدي عبر تطبيق عالم الصيانة.`
            );
            const isServicesExpanded = !!expandedServices[center.id];

            return (
              <div
                key={center.id}
                className="bg-[#121212] border border-[#262626] hover:border-[#FFC400]/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_10px_35px_rgba(255,196,0,0.15)] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Cover & Visual Badges */}
                  <div className="relative h-40 w-full overflow-hidden bg-neutral-900">
                    <img
                      src={center.coverImage}
                      alt={center.name}
                      className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/60" />

                    {/* Top Status & Verification Badges */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur border border-[#FFC400]/40 text-[#FFC400] text-[11px] font-black flex items-center gap-1 shadow">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>موثق PRO</span>
                      </span>

                      {center.isOpenNow ? (
                        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1.5 shadow">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>مفتوح الآن</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur border border-neutral-700 text-neutral-400 text-[10px] font-bold shadow">
                          مغلق حالياً
                        </span>
                      )}
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur border border-amber-400/40 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1 shadow">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{center.rating}</span>
                        <span className="text-neutral-400 text-[9px]">({center.reviewCount})</span>
                      </span>
                    </div>

                    {/* Center Logo Thumbnail */}
                    <div className="absolute -bottom-4 right-4 w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#FFC400] bg-black shadow-xl">
                      <img src={center.logo} alt={center.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Card Main Info */}
                  <div className="pt-6 px-5 pb-4 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FFC400]" />
                          <span>{center.city} • {center.area}</span>
                        </span>
                      </div>
                      <h3 className="font-black text-white text-base leading-snug group-hover:text-[#FFC400] transition-colors">
                        {center.name}
                      </h3>
                      <p className="text-xs text-neutral-300 font-semibold mt-0.5">
                        بإشراف: <span className="text-white font-bold">{center.ownerName}</span> ({center.leadTechTitle})
                      </p>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2">
                      {center.bio}
                    </p>

                    {/* Specialties Pills */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">
                        التخصصات الرئيسية:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {center.specialties.map((spec, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded-lg font-bold"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] text-neutral-300 pt-1">
                      {center.features.slice(0, 4).map((feat, i) => (
                        <div key={i} className="flex items-center gap-1 text-neutral-300">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Services Accordion Snippet */}
                    {center.services && center.services.length > 0 && (
                      <div className="pt-2 border-t border-neutral-800/80">
                        <button
                          onClick={() =>
                            setExpandedServices((prev) => ({
                              ...prev,
                              [center.id]: !prev[center.id],
                            }))
                          }
                          className="w-full flex items-center justify-between text-xs font-bold text-neutral-400 hover:text-white py-1 transition-colors"
                        >
                          <span className="flex items-center gap-1">
                            <Wrench className="w-3.5 h-3.5 text-[#FFC400]" />
                            <span>خدمات وأسعار الصيانة ({center.services.length})</span>
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isServicesExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isServicesExpanded && (
                          <div className="mt-2 space-y-2 bg-[#181818] p-3 rounded-xl border border-neutral-800 animate-in fade-in duration-150 text-xs">
                            {center.services.map((srv, idx) => (
                              <div key={idx} className="border-b border-neutral-800/80 last:border-none pb-2 last:pb-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-white text-[11px]">{srv.title}</span>
                                  {srv.priceStartingFrom && (
                                    <span className="font-mono text-emerald-400 font-bold text-[11px]">
                                      يبدأ من {srv.priceStartingFrom} د.أ
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-neutral-400 mt-0.5">{srv.description}</p>
                                {srv.estimatedTime && (
                                  <span className="text-[9px] text-amber-400 font-mono block mt-0.5">
                                    الوقت: {srv.estimatedTime}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stock snippet */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FFC400]" />
                        <span>{center.workingHours}</span>
                      </span>
                      <span className="text-[#FFC400] font-mono text-[10px]">
                        {center.availableStockSnippet.boardsCount} بوردة متاحة
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer - 100% Outline Buttons */}
                <div className="p-4 bg-[#0D0D0D] border-t border-[#1F1F1F] space-y-2.5">
                  {/* Primary Action: Direct Repair Request */}
                  <button
                    onClick={() => setSelectedCenterForRepair(center)}
                    className="w-full py-2.5 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,196,0,0.15)] hover:shadow-[0_0_20px_rgba(255,196,0,0.4)] active:scale-98"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>طلب صيانة أو فحص لجهازك</span>
                  </button>

                  {/* Secondary Actions Row: Chat + WhatsApp + Map + Call */}
                  <div className="flex items-center gap-2">
                    {/* In-app Chat */}
                    <button
                      onClick={() => handleOpenChatWithCenter(center)}
                      className="flex-1 py-2 px-2 rounded-xl border-2 border-[#FFC400]/60 text-[#FFC400] bg-[#FFC400]/5 hover:bg-[#FFC400] hover:text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(255,196,0,0.1)]"
                      title="محادثة فورية بالتطبيق"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#FFC400]" />
                      <span>دردشة فورية</span>
                    </button>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/962${center.whatsapp.replace(/^0/, "")}?text=${waDefaultText}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-2 rounded-xl border-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                      title="واتساب مباشر"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>واتساب</span>
                    </a>

                    {/* Phone Call */}
                    <a
                      href={`tel:${center.phone}`}
                      className="w-9 h-9 rounded-xl border-2 border-neutral-700 text-neutral-300 hover:border-blue-400 hover:text-blue-400 bg-neutral-900/60 font-bold flex items-center justify-center transition-all shrink-0"
                      title="اتصال هاتفي"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    {/* Google Map Link */}
                    {center.googleMapsUrl && (
                      <a
                        href={center.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-xl border-2 border-neutral-700 text-neutral-300 hover:border-amber-400 hover:text-amber-400 bg-neutral-900/60 font-bold flex items-center justify-center transition-all shrink-0"
                        title="الموقع على الخريطة"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: REPAIR REQUEST MODAL (طلب صيانة فوري للمركز)  */}
      {/* ======================================================== */}
      {selectedCenterForRepair && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFC400]/15 border border-[#FFC400]/40 flex items-center justify-center text-[#FFC400]">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">طلب صيانة أو فحص جهاز</h2>
                  <p className="text-[11px] text-[#FFC400] font-bold">
                    المركز: {selectedCenterForRepair.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCenterForRepair(null)}
                className="w-8 h-8 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendRepairRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  نوع وموديل الجهاز:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: iPhone 13 Pro Max أو Samsung Galaxy A32"
                  value={repairDevice}
                  onChange={(e) => setRepairDevice(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  وصف العطل بالتفصيل:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="مثال: الجهاز فاصل باور نهائياً بعد الشحن، أو كسر زجاج الشاشة مع بقاء اللمس شغال..."
                  value={repairFault}
                  onChange={(e) => setRepairFault(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    رقم هاتفك للتواصل:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="07XXXXXXXX"
                    value={repairPhone}
                    onChange={(e) => setRepairPhone(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    رقم IMEI (اختياري للتوثيق):
                  </label>
                  <input
                    type="text"
                    placeholder="35XXXXXXXXXXXXX"
                    value={repairImei}
                    onChange={(e) => setRepairImei(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              {/* Guarantees Reminder */}
              <div className="p-3 rounded-xl bg-black/50 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                <span className="text-white font-bold block flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FFC400]" />
                  <span>ضمان المعاملة عبر عالم الصيانة:</span>
                </span>
                <p>• سيصل طلبك فوراً للمهندس المسؤول مع تفاصيل العطل.</p>
                <p>• فحص وتشخيص مسبق قبل البدء بأي خطوة إصلاح.</p>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCenterForRepair(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submittingRepair}
                  className="px-6 py-2 rounded-lg border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black shadow-[0_0_20px_rgba(255,196,0,0.25)] transition-all flex items-center gap-2"
                >
                  {submittingRepair ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>إرسال الطلب للمركز عبر واتساب</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: REGISTER WORKSHOP (انضم وسجل ورشتك مجاناً)     */}
      {/* ======================================================== */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FFC400]" />
                <h2 className="text-base font-black text-white">تسجيل ورشة أو مركز صيانة معتمد</h2>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="w-8 h-8 rounded-full border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterWorkshop} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  اسم المركز / المحل التجاري:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مركز النخبة لصيانة المايكرو آي سي"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    اسم الفني / المهندس المسؤول:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: م. بلال العبداللات"
                    value={regOwner}
                    onChange={(e) => setRegOwner(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    رقم هاتف الورشة والواتساب:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="07XXXXXXXX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    المحافظة:
                  </label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  >
                    <option value="عمان">عمان</option>
                    <option value="إربد">إربد</option>
                    <option value="الزرقاء">الزرقاء</option>
                    <option value="العقبة">العقبة</option>
                    <option value="السلط">السلط</option>
                    <option value="المفرق">المفرق</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    المنطقة / الشارع بالتحديد:
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: شارع الجاردنز - مجمع العساف"
                    value={regArea}
                    onChange={(e) => setRegArea(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  أهم التخصصات (افصل بفاصلة):
                </label>
                <input
                  type="text"
                  placeholder="مثال: آيسيات ماذربورد، شبلنة معالج، تبديل باغات، آيفون وسامسونج"
                  value={regSpecialties}
                  onChange={(e) => setRegSpecialties(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  نبذة عن الورشة والأجهزة المتوفرة:
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: ورشة مجهزة بأحدث مايكروسكوب ومعدات فحص الممانعات مع كفالات رسمية..."
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submittingReg}
                  className="px-6 py-2 rounded-lg border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black shadow-[0_0_20px_rgba(255,196,0,0.25)] transition-all flex items-center gap-2"
                >
                  {submittingReg ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>تأكيد وتسجيل الورشة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

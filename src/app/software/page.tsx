"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Download,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Search,
  Cpu,
  HardDrive,
  Globe,
  Calendar,
  Tag,
  ExternalLink,
  Info,
  FileDown,
  Wrench,
  Shield,
  Clock,
  Star,
  Copy,
  Check,
  Zap,
  Sparkles,
  Cable,
  Package,
  FolderArchive,
  FileCode,
  Layers,
  Target,
  Monitor,
  Key,
} from "lucide-react";
import {
  SOFTWARE_DATABASE,
  SOFTWARE_BRANDS,
  METHOD_LABELS,
  METHOD_COLORS,
  OFFICIAL_UTILITIES,
  getSoftwareByBrand,
  getModelPackageFiles,
  type SoftwareEntry,
  type SoftwareVersion,
  type OfficialUtility,
  type ModelPackageFile,
} from "@/lib/software-data";
import { getTestPoint, MODE_CONFIG, DIFFICULTY_CONFIG } from "@/lib/testpoint-data";
import TestPointPanel from "@/components/TestPointPanel";

// ─── Brand emoji map ──────────────────────────────────────────
const BRAND_EMOJI: Record<string, string> = {
  Samsung: "📱",
  Apple: "🍎",
  Xiaomi: "⚡",
  Infinix: "🚀",
  Tecno: "🛡️",
  All: "🌐",
};

// ─── Brand color map ─────────────────────────────────────────
const BRAND_COLORS: Record<string, string> = {
  Samsung: "from-blue-500/20 to-blue-900/5 border-blue-500/30",
  Apple: "from-neutral-400/20 to-neutral-800/5 border-neutral-400/30",
  Xiaomi: "from-orange-500/20 to-orange-900/5 border-orange-500/30",
  Infinix: "from-cyan-500/20 to-cyan-900/5 border-cyan-500/30",
  Tecno: "from-green-500/20 to-green-900/5 border-green-500/30",
};

// ─── Usable horizontal drag scroll ───────────────────────────
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    isDragging.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
    ref.current.style.cursor = "grabbing";
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (ref.current) ref.current.style.cursor = "grab";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    ref.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  return { ref, onMouseDown, onMouseUp, onMouseLeave: onMouseUp, onMouseMove };
}

export default function SoftwarePage() {
  // Navigation tabs: 'firmware' (الرومات) or 'utilities' (أدوات الفلاش والتعاريف)
  const [activeTab, setActiveTab] = useState<"firmware" | "utilities">("firmware");
  const [selectedBrand, setSelectedBrand] = useState<string>("Samsung");
  const [selectedModelId, setSelectedModelId] = useState<string>("samsung-a12");
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [openStepIdx, setOpenStepIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Utilities sub-category filter
  const [utilFilter, setUtilFilter] = useState<"all" | "tool" | "driver">("all");

  // Test Point panel state
  const [showTestPoint, setShowTestPoint] = useState(false);

  const brandSlider = useDragScroll();
  const modelSlider = useDragScroll();
  const versionSlider = useDragScroll();

  // Toast trigger
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Copy to clipboard helper
  const handleCopyLink = async (url: string, id: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      showToast(`✅ تم نسخ رابط ${label}! جاهز للصق في Internet Download Manager`);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      showToast(`الرابط: ${url}`);
    }
  };

  // Filtered models list
  const models: SoftwareEntry[] = getSoftwareByBrand(selectedBrand).filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.modelNumber?.toLowerCase().includes(q) ||
      m.chipset.toLowerCase().includes(q)
    );
  });

  const selectedModel = SOFTWARE_DATABASE.find((m) => m.id === selectedModelId) ?? models[0];
  const selectedVersion =
    selectedModel?.versions.find((v) => v.id === selectedVersionId) ??
    selectedModel?.versions.find((v) => v.isLatest) ??
    selectedModel?.versions[0];

  // Auto-select first model when brand changes
  useEffect(() => {
    const list = getSoftwareByBrand(selectedBrand);
    if (list.length > 0) {
      setSelectedModelId(list[0].id);
      setSelectedVersionId(null);
    }
    setOpenStepIdx(null);
  }, [selectedBrand]);

  // Auto-select latest version when model changes
  useEffect(() => {
    if (!selectedModel) return;
    const latest = selectedModel.versions.find((v) => v.isLatest) ?? selectedModel.versions[0];
    setSelectedVersionId(latest?.id ?? null);
    setOpenStepIdx(null);
  }, [selectedModelId]);

  const brandCounts = SOFTWARE_BRANDS.reduce<Record<string, number>>((acc, b) => {
    acc[b] = b === "All" ? SOFTWARE_DATABASE.length : SOFTWARE_DATABASE.filter((m) => m.brand === b).length;
    return acc;
  }, {});

  // Test Point data for currently selected model
  const testPointEntry = selectedModel ? getTestPoint(selectedModel.id) : undefined;

  // Filtered utilities
  const filteredUtilities = OFFICIAL_UTILITIES.filter((u) => {
    if (utilFilter === "tool") return u.category === "tool";
    if (utilFilter === "driver") return u.category === "driver";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070707] text-white relative pb-16" dir="rtl">

      {/* ═══ TEST POINT MODAL ════════════════════════════════════ */}
      {showTestPoint && testPointEntry && (
        <TestPointPanel
          entry={testPointEntry}
          onClose={() => setShowTestPoint(false)}
          onViewSchematic={
            testPointEntry.schematicId
              ? () => {
                  setShowTestPoint(false);
                  window.open(`/schematic?board=${testPointEntry.schematicId}`, "_blank");
                }
              : undefined
          }
        />
      )}

      {/* ═══ FLOATING TOAST ══════════════════════════════════ */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#161616] border border-[#FFC400]/60 text-white px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(255,196,0,0.35)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Zap className="w-5 h-5 text-[#FFC400] shrink-0" />
          <span className="text-xs sm:text-sm font-black">{toastMessage}</span>
        </div>
      )}

      {/* ═══ HERO BANNER ══════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-[#1a1a1a]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/schematic-hero-3d.jpg"
            alt="Software Hero"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/50 via-[#070707]/75 to-[#070707]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,196,0,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,196,0,0.3) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#FFC400]/10 border border-[#FFC400]/30 rounded-full px-4 py-1.5 text-xs font-bold text-[#FFC400] mb-3">
              <FileDown className="w-3.5 h-3.5" />
              Software & Firmware Hub PRO
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 leading-tight">
              فلاشات وتحديثات{" "}
              <span className="text-[#FFC400]">البرمجيات</span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              روابط تحميل مباشرة وسريعة تدعم برامج التنزيل (IDM) بدون إعلانات — مع حزم الأدوات والتعاريف الرسمية وشروحات الفلاش خطوة بخطوة
            </p>
          </div>

          {/* ── Main Section Tabs (Firmwares vs Tools/Drivers) ── */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1.5 rounded-2xl bg-[#111] border border-[#2b2b2b] shadow-xl">
              <button
                onClick={() => setActiveTab("firmware")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  activeTab === "firmware"
                    ? "bg-[#FFC400] text-black shadow-[0_0_20px_rgba(255,196,0,0.35)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>رومات وفلاشات الأجهزة</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === "firmware" ? "bg-black/20 text-black" : "bg-white/5 text-neutral-400"
                }`}>
                  {SOFTWARE_DATABASE.length} موديل
                </span>
              </button>

              <button
                onClick={() => setActiveTab("utilities")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  activeTab === "utilities"
                    ? "bg-[#FFC400] text-black shadow-[0_0_20px_rgba(255,196,0,0.35)]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>أدوات الفلاش والتعاريف الرسمية</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === "utilities" ? "bg-black/20 text-black" : "bg-white/5 text-neutral-400"
                }`}>
                  {OFFICIAL_UTILITIES.length}
                </span>
              </button>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-6">
            {[
              { icon: <Zap className="w-3.5 h-3.5" />, label: "تحميل مباشر يدعم IDM" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "روابط نقية بدون إعلانات" },
              { icon: <Cable className="w-3.5 h-3.5" />, label: "التعاريف الرسمية الأصلية" },
              { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "شروحات فلاش مجرّبة" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/5 backdrop-blur border border-white/10 rounded-full px-3.5 py-1 text-xs font-bold text-neutral-300"
              >
                <span className="text-[#FFC400]">{s.icon}</span>
                {s.label}
              </div>
            ))}
          </div>

          {/* ═══ OPENLOCK PRO DESKTOP SHOWCASE BANNER ═══════════ */}
          <div className="max-w-4xl mx-auto mb-6 rounded-2xl border border-[#FFC400]/40 bg-gradient-to-r from-[#141208] via-[#101010] to-[#120f07] p-5 shadow-[0_0_35px_rgba(255,196,0,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFC400]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFC400] to-[#FF9100] text-black flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(255,196,0,0.4)] shrink-0">
                  OL
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-black text-white">
                      OpenLock <span className="text-[#FFC400]">PRO</span> Tool
                    </h3>
                    <span className="text-[10px] bg-[#FFC400] text-black px-2 py-0.5 rounded font-black">
                      أداة سطح المكتب الحصرية
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      v1.0.0 Windows
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                    أداة فنيي الصيانة الشاملة للتحكم بمنافذ USB، وتخطي حماية FRP، وتفليش الهواتف، والتعرف التلقائي على أوضاع EDL 9008 و MTK BROM بضغطة زر واحدة.
                  </p>

                  <div className="flex flex-wrap gap-2 text-[10px] text-neutral-400">
                    <span className="bg-black/40 border border-[#333] px-2 py-0.5 rounded">🔌 كشف USB تلقائي</span>
                    <span className="bg-black/40 border border-[#333] px-2 py-0.5 rounded">🟣 وضع EDL 9008</span>
                    <span className="bg-black/40 border border-[#333] px-2 py-0.5 rounded">🛡️ تخطي FRP</span>
                    <span className="bg-black/40 border border-[#333] px-2 py-0.5 rounded">⚡ تفليش Odin & SP Flash</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                <a
                  href="/api/download/openlock"
                  download="OpenLock-PRO-Setup.exe"
                  className="flex items-center justify-center gap-2 bg-[#FFC400] hover:bg-[#FFD340] text-black font-black text-xs px-5 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(255,196,0,0.3)] hover:scale-102"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل OpenLock PRO (.exe)</span>
                </a>

                <button
                  onClick={() =>
                    handleCopyLink(
                      "https://download.alam-alsiana.com/OpenLock-PRO-Setup.exe",
                      "openlock-pro-link",
                      "أداة OpenLock PRO"
                    )
                  }
                  className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] text-neutral-300 hover:text-white border border-[#333] hover:border-[#FFC400]/40 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  {copiedId === "openlock-pro-link" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">تم نسخ رابط IDM المباشر!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#FFC400]" />
                      <span>نسخ رابط IDM المباشر</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Search (only in firmware tab) */}
          {activeTab === "firmware" && (
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، الموديل، أو الشريحة... (مثل: A12، Snapdragon، MT6769)"
                className="w-full bg-[#111]/85 border border-[#2b2b2b] rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-[#FFC400]/50 focus:bg-[#141414] transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TAB 1: FIRMWARE DATABASE (الرومات والفلاشات)
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "firmware" && (
        <>
          {/* ═══ BRAND SLIDER ════════════════════════════════════ */}
          <div className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-neutral-500 whitespace-nowrap shrink-0">
                  📌 الشركة
                </span>
                <div
                  {...brandSlider}
                  ref={brandSlider.ref}
                  className="flex gap-2 overflow-x-auto scrollbar-hide cursor-grab select-none py-0.5"
                >
                  {(SOFTWARE_BRANDS.filter((b) => b !== "All") as string[]).map((brand) => {
                    const active = selectedBrand === brand;
                    return (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap transition-all shrink-0 ${
                          active
                            ? "bg-[#FFC400] text-black border-[#FFC400] shadow-[0_0_12px_rgba(255,196,0,0.4)]"
                            : "bg-[#111] text-neutral-300 border-[#2b2b2b] hover:border-[#FFC400]/40 hover:text-white"
                        }`}
                      >
                        <span>{BRAND_EMOJI[brand] ?? "📱"}</span>
                        <span>{brand}</span>
                        <span
                          className={`text-[9px] px-1 py-0.5 rounded font-black ${
                            active ? "bg-black/20 text-black" : "bg-white/5 text-neutral-500"
                          }`}
                        >
                          {brandCounts[brand]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ MODEL SLIDER ════════════════════════════════════ */}
          <div className="border-b border-[#1a1a1a] bg-[#0c0c0c]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-neutral-500 whitespace-nowrap shrink-0">
                  📲 الموديل
                </span>
                <div
                  {...modelSlider}
                  ref={modelSlider.ref}
                  className="flex gap-2 overflow-x-auto scrollbar-hide cursor-grab select-none py-0.5"
                >
                  {models.length === 0 ? (
                    <span className="text-xs text-neutral-600 py-1">لا توجد نتائج بحث</span>
                  ) : (
                    models.map((m) => {
                      const active = m.id === selectedModelId;
                      const latestVer = m.versions.find((v) => v.isLatest) ?? m.versions[0];
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedModelId(m.id)}
                          className={`flex flex-col items-start px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap transition-all shrink-0 ${
                            active
                              ? "bg-[#FFC400]/15 text-[#FFC400] border-[#FFC400]/50 shadow-[0_0_10px_rgba(255,196,0,0.2)]"
                              : "bg-[#111] text-neutral-300 border-[#2b2b2b] hover:border-[#FFC400]/30 hover:text-white"
                          }`}
                        >
                          <span className="font-black">{m.name.replace(m.brand + " ", "")}</span>
                          <span className={`text-[9px] font-normal ${active ? "text-[#FFC400]/70" : "text-neutral-600"}`}>
                            {latestVer?.versionName.split(" / ")[0]}
                            {m.versions.length > 1 ? ` · ${m.versions.length} فلاشة` : ""}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ MAIN CONTENT ════════════════════════════════════ */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {selectedModel ? (
              <div className="space-y-5">

                {/* ── Device Header Card ──────────────────────── */}
                <div className={`rounded-2xl border bg-gradient-to-br p-5 ${BRAND_COLORS[selectedModel.brand] ?? "from-neutral-800/20 to-neutral-900/5 border-neutral-700/30"}`}>
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-3xl shrink-0">
                      {BRAND_EMOJI[selectedModel.brand] ?? "📱"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-xl font-black text-white">{selectedModel.name}</h2>
                        {selectedModel.modelNumber && (
                          <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-neutral-400">
                            {selectedModel.modelNumber}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5" />
                          {selectedModel.chipset}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {selectedModel.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3.5 h-3.5" />
                          {selectedModel.versions.length} فلاشة متوفرة
                        </span>
                      </div>
                      {selectedModel.tags && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {selectedModel.tags.map((t) => (
                            <span key={t} className="text-[10px] bg-[#FFC400]/10 border border-[#FFC400]/20 text-[#FFC400] px-2 py-0.5 rounded-full font-bold">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Test Point Banner ────────────────────────── */}
                {testPointEntry && (
                  <div
                    className={`mt-4 rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 transition-all cursor-pointer group
                      ${testPointEntry.mode === "edl_9008"
                        ? "bg-purple-500/5 border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10"
                        : testPointEntry.mode === "brom"
                        ? "bg-red-500/5 border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10"
                        : testPointEntry.mode === "dfu"
                        ? "bg-neutral-700/20 border-neutral-600/30 hover:border-neutral-500/60"
                        : "bg-blue-500/5 border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-500/10"
                      }`}
                    onClick={() => setShowTestPoint(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setShowTestPoint(true)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Mode icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg
                        ${testPointEntry.mode === "edl_9008" ? "bg-purple-500/10 border border-purple-500/30" :
                          testPointEntry.mode === "brom" ? "bg-red-500/10 border border-red-500/30" :
                          testPointEntry.mode === "dfu" ? "bg-white/5 border border-white/20" :
                          "bg-blue-500/10 border border-blue-500/30"}`}
                      >
                        {MODE_CONFIG[testPointEntry.mode].icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-xs font-black ${
                            testPointEntry.mode === "edl_9008" ? "text-purple-300" :
                            testPointEntry.mode === "brom" ? "text-red-300" :
                            testPointEntry.mode === "dfu" ? "text-neutral-300" :
                            "text-blue-300"
                          }`}>
                            {testPointEntry.modeLabel}
                          </span>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${DIFFICULTY_CONFIG[testPointEntry.difficulty].color}`}>
                            {DIFFICULTY_CONFIG[testPointEntry.difficulty].label}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed truncate">
                          {testPointEntry.pins.find((p) => p.isPrimary)?.description ?? "انقر لعرض نقطة التيست بوينت والخطوات"}
                        </p>
                      </div>
                    </div>

                    {/* CTA button */}
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border shrink-0 transition-all group-hover:scale-105
                        ${testPointEntry.mode === "edl_9008"
                          ? "bg-purple-500/15 border-purple-500/40 text-purple-300 hover:bg-purple-500/25"
                          : testPointEntry.mode === "brom"
                          ? "bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25"
                          : testPointEntry.mode === "dfu"
                          ? "bg-white/5 border-white/20 text-neutral-300 hover:bg-white/10"
                          : "bg-blue-500/15 border-blue-500/40 text-blue-300 hover:bg-blue-500/25"
                        }`}
                      onClick={(e) => { e.stopPropagation(); setShowTestPoint(true); }}
                    >
                      <Target className="w-3.5 h-3.5" />
                      عرض نقطة التيست بوينت
                    </button>
                  </div>
                )}

                {/* ── Version Slider ───────────────────────────── */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-[#FFC400]" />
                    <span className="text-xs font-black text-neutral-300">اختر إصدار الفيرموير / الروم:</span>
                  </div>
                  <div
                    {...versionSlider}
                    ref={versionSlider.ref}
                    className="flex gap-2 overflow-x-auto scrollbar-hide cursor-grab select-none pb-1"
                  >
                    {selectedModel.versions.map((v) => {
                      const active = v.id === selectedVersion?.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => { setSelectedVersionId(v.id); setOpenStepIdx(null); }}
                          className={`flex flex-col items-start px-4 py-2.5 rounded-xl border whitespace-nowrap transition-all shrink-0 min-w-[190px] text-right ${
                            active
                              ? "bg-[#FFC400]/15 border-[#FFC400]/50 text-[#FFC400]"
                              : "bg-[#111] border-[#2b2b2b] text-neutral-300 hover:border-[#FFC400]/30"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {v.isLatest && (
                              <span className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded-full font-black">
                                الأحدث
                              </span>
                            )}
                            {v.isStable && !v.isLatest && (
                              <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-full font-black">
                                مستقر
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-black">{v.versionName}</span>
                          {v.buildNumber && (
                            <span className={`text-[10px] font-mono mt-0.5 ${active ? "text-[#FFC400]/60" : "text-neutral-600"}`}>
                              {v.buildNumber}
                            </span>
                          )}
                          {v.fileSize && (
                            <span className={`text-[10px] mt-0.5 ${active ? "text-[#FFC400]/70" : "text-neutral-500"}`}>
                              📦 {v.fileSize}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── All-in-One Model Pack Section ────────────── */}
                {selectedVersion && (
                  <div className="rounded-2xl border border-[#FFC400]/40 bg-gradient-to-b from-[#131313] to-[#0A0A0A] p-5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFC400]/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 border border-[#FFC400]/30 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-[#FFC400]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-white">حزمة الصيانة الشاملة للجهاز (All-in-One Pack)</h3>
                            <span className="text-[10px] bg-[#FFC400] text-black px-2 py-0.5 rounded font-black">
                              كل شيء في مكان واحد
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400">
                            جميع ملفات التفليش والأدوات والتعاريف والـ PIT المخصصة لجهاز <span className="text-[#FFC400] font-bold">{selectedModel.name}</span>
                          </p>
                        </div>
                      </div>

                      {/* Google Drive Option */}
                      <a
                        href={`https://drive.google.com/drive/search?q=${encodeURIComponent(selectedModel.name + " firmware")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFC400]/40 text-xs font-bold text-neutral-200 hover:text-white transition-all shrink-0"
                      >
                        <FolderArchive className="w-4 h-4 text-emerald-400" />
                        <span>فتح مجلد الموديل على Google Drive</span>
                        <ExternalLink className="w-3 h-3 text-neutral-500" />
                      </a>
                    </div>

                    {/* Files Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
                      {getModelPackageFiles(selectedModel, selectedVersion).map((file) => {
                        const isRom = file.category === "rom";
                        const isTool = file.category === "tool";
                        const isPit = file.category === "pit";
                        const isDriver = file.category === "driver";

                        return (
                          <div
                            key={file.id}
                            className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                              isRom
                                ? "bg-[#181818] border-[#FFC400]/30 hover:border-[#FFC400]/60 shadow-[0_0_15px_rgba(255,196,0,0.1)]"
                                : "bg-[#121212] border-[#222] hover:border-[#333]"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                    isRom
                                      ? "bg-[#FFC400]/15 text-[#FFC400] border-[#FFC400]/30"
                                      : isTool
                                      ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                                      : isPit
                                      ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                                      : isDriver
                                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                      : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                                  }`}
                                >
                                  {isRom
                                    ? "💾 الفلاشة الرسمية الكاملة"
                                    : isTool
                                    ? "🔧 برنامج الفلاش المعتمد"
                                    : isPit
                                    ? "📑 ملف التقسيم / PIT / Scatter"
                                    : isDriver
                                    ? "🔌 تعريف الـ USB الأصلي"
                                    : "⚡ ملف إصلاح واستعادة"}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-neutral-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                                  📦 {file.fileSize}
                                </span>
                              </div>

                              <div className="font-black text-xs text-white mb-1 flex items-center gap-1.5">
                                {isRom ? (
                                  <HardDrive className="w-3.5 h-3.5 text-[#FFC400] shrink-0" />
                                ) : isTool ? (
                                  <Wrench className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                ) : isPit ? (
                                  <FileCode className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                ) : (
                                  <Cable className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                )}
                                <span className="truncate">{file.name}</span>
                              </div>

                              <div className="text-[10px] font-mono text-neutral-500 truncate mb-2" dir="ltr">
                                {file.fileName}
                              </div>

                              {file.description && (
                                <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">
                                  {file.description}
                                </p>
                              )}
                            </div>

                            <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                              <a
                                href={file.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className={`flex-1 flex items-center justify-center gap-1.5 font-black text-xs py-2 rounded-lg transition-all ${
                                  isRom
                                    ? "bg-[#FFC400] hover:bg-[#FFD340] text-black shadow-[0_0_15px_rgba(255,196,0,0.25)]"
                                    : "bg-[#202020] hover:bg-[#282828] text-white border border-white/10"
                                }`}
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>تحميل مباشر</span>
                              </a>

                              <button
                                onClick={() => handleCopyLink(file.downloadUrl, file.id, file.name)}
                                className="p-2 rounded-lg bg-[#181818] hover:bg-[#222] border border-[#2b2b2b] text-neutral-300 hover:text-white transition-all shrink-0"
                                title="نسخ رابط IDM السريع"
                              >
                                {copiedId === file.id ? (
                                  <Check className="w-3.5 h-3.5 text-green-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-[#FFC400]" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Selected Version Details ─────────────────── */}
                {selectedVersion && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Left column: info + download + IDM copy */}
                    <div className="lg:col-span-1 space-y-4">

                      {/* Flash Method Badge */}
                      <div className="rounded-2xl border border-[#2b2b2b] bg-[#0f0f0f] p-4">
                        <div className="text-[10px] font-black text-neutral-500 mb-2">🔧 أداة التفليش المطلوبة</div>
                        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-black ${METHOD_COLORS[selectedVersion.method]}`}>
                          <Wrench className="w-3.5 h-3.5" />
                          {METHOD_LABELS[selectedVersion.method]}
                        </div>
                        {selectedVersion.flashTool && (
                          <div className="mt-2 text-xs text-neutral-400">
                            البرنامج المعتمد: <span className="text-white font-bold">{selectedVersion.flashTool}</span>
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="rounded-2xl border border-[#2b2b2b] bg-[#0f0f0f] p-4 space-y-2.5">
                        <div className="text-[10px] font-black text-neutral-500">📁 بيانات ملف الفلاشة</div>
                        {[
                          { icon: <Tag className="w-3.5 h-3.5" />, label: "الإصدار", val: selectedVersion.versionName },
                          selectedVersion.buildNumber
                            ? { icon: <HardDrive className="w-3.5 h-3.5" />, label: "Build", val: selectedVersion.buildNumber }
                            : null,
                          selectedVersion.region
                            ? { icon: <Globe className="w-3.5 h-3.5" />, label: "المنطقة / CSC", val: selectedVersion.region }
                            : null,
                          selectedVersion.fileSize
                            ? { icon: <Download className="w-3.5 h-3.5" />, label: "الحجم التقريبي", val: selectedVersion.fileSize }
                            : null,
                        ]
                          .filter(Boolean)
                          .map((item, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <span className="text-[#FFC400] mt-0.5 shrink-0">{item!.icon}</span>
                              <span className="text-neutral-500 shrink-0">{item!.label}:</span>
                              <span className="text-neutral-200 font-bold break-all">{item!.val}</span>
                            </div>
                          ))}
                      </div>

                      {/* ── High-Speed Download Card with IDM Support ── */}
                      <div className="rounded-2xl border border-[#FFC400]/30 bg-gradient-to-br from-[#121212] to-[#0A0A0A] p-4 shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black text-[#FFC400] flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            سيرفر التحميل المباشر
                          </span>
                          <span className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-bold">
                            استئناف Resume مدعوم
                          </span>
                        </div>

                        {selectedVersion.downloadUrl ? (
                          <div className="space-y-2.5">
                            {/* Primary Button: Direct Browser Download */}
                            <a
                              href={selectedVersion.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="flex items-center justify-center gap-2 w-full bg-[#FFC400] hover:bg-[#FFD340] text-black font-black text-xs sm:text-sm px-4 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(255,196,0,0.3)] hover:shadow-[0_0_30px_rgba(255,196,0,0.5)]"
                            >
                              <Download className="w-4 h-4" />
                              <span>تحميل مباشر الآن</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                            </a>

                            {/* Secondary Button: Copy IDM Direct URL */}
                            <button
                              onClick={() =>
                                handleCopyLink(
                                  selectedVersion.downloadUrl!,
                                  selectedVersion.id,
                                  selectedModel.name
                                )
                              }
                              className="flex items-center justify-center gap-2 w-full bg-[#1c1c1c] hover:bg-[#252525] text-neutral-200 hover:text-white border border-[#333] hover:border-[#FFC400]/40 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                            >
                              {copiedId === selectedVersion.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-green-400" />
                                  <span className="text-green-400">تم نسخ الرابط المباشر!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-[#FFC400]" />
                                  <span>نسخ رابط IDM للتحميل بأقصى سرعة</span>
                                </>
                              )}
                            </button>

                            {/* Technician helper tip */}
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] text-neutral-400 space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-neutral-300">
                                <Sparkles className="w-3 h-3 text-[#FFC400]" />
                                <span>نصيحة فني للملفات الكبيرة:</span>
                              </div>
                              <p className="leading-relaxed">
                                انسخ الرابط وافتحه في <span className="text-white font-bold">Internet Download Manager</span> للاستفادة من 16 خيط اتصال وتنزيل الفلاشة في دقائق واستئنافها إذا انقطع النت.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <div className="text-xs text-neutral-500 mb-3">الرابط قيد المراجعة والرفع</div>
                            <button className="flex items-center justify-center gap-2 w-full bg-[#1a1a1a] hover:bg-[#222] text-[#FFC400] border border-[#FFC400]/30 font-black text-xs px-4 py-2.5 rounded-xl transition-all">
                              <Info className="w-4 h-4" />
                              طلب الفلاشة من السيرفر
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Version Tags */}
                      {selectedVersion.tags && selectedVersion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedVersion.tags.map((t) => (
                            <span key={t} className="text-[10px] bg-white/5 border border-white/10 text-neutral-400 px-2 py-0.5 rounded-full font-bold">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right column: requirements + steps */}
                    <div className="lg:col-span-2 space-y-4">

                      {/* Requirements */}
                      {selectedVersion.requirements && (
                        <div className="rounded-2xl border border-[#2b2b2b] bg-[#0f0f0f] p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-[#FFC400]" />
                            <span className="font-black text-sm text-white">المتطلبات الأساسية قبل البدء</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedVersion.requirements.map((req, i) => (
                              <div key={i} className="flex items-start gap-2.5 bg-[#141414] rounded-xl p-3 border border-[#1e1e1e]">
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                <span className="text-xs text-neutral-300 leading-relaxed">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step-by-step Instructions */}
                      <div className="rounded-2xl border border-[#2b2b2b] bg-[#0f0f0f] p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-[#FFC400]" />
                          <span className="font-black text-sm text-white">خطوات التفليش العملية</span>
                          <span className="text-[10px] text-neutral-500">(اضغط على الخطوة لتفاصيلها)</span>
                        </div>
                        <div className="space-y-2">
                          {selectedVersion.instructions.map((step, i) => {
                            const isOpen = openStepIdx === i;
                            return (
                              <button
                                key={i}
                                onClick={() => setOpenStepIdx(isOpen ? null : i)}
                                className={`w-full text-right flex items-start gap-3 p-3 rounded-xl border transition-all ${
                                  isOpen
                                    ? "bg-[#FFC400]/10 border-[#FFC400]/30"
                                    : "bg-[#141414] border-[#1e1e1e] hover:border-[#2b2b2b]"
                                }`}
                              >
                                <span
                                  className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                                    isOpen ? "bg-[#FFC400] text-black" : "bg-[#1e1e1e] text-neutral-400"
                                  }`}
                                >
                                  {i + 1}
                                </span>
                                <span
                                  className={`flex-1 text-xs leading-relaxed text-right ${
                                    isOpen ? "text-[#FFC400] font-bold" : "text-neutral-300"
                                  }`}
                                >
                                  {step}
                                </span>
                                {isOpen ? (
                                  <ChevronDown className="w-4 h-4 text-[#FFC400] shrink-0" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Notes / Warnings */}
                      {selectedVersion.notes && (
                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-black text-amber-400 mb-1">ملاحظات وإرشادات مهمة</div>
                              <p className="text-xs text-amber-200/80 leading-relaxed">{selectedVersion.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Warning notice */}
                      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-black text-blue-400 mb-1">تنبيه حماية بيانات الزبون</div>
                            <p className="text-xs text-blue-200/70 leading-relaxed">
                              التفليش الكامل (Clean Flash) يمسح جميع بيانات الهاتف وكلمات المرور. تأكد من إخطار الزبون أو الاحتفاظ بنسخة احتياطية مسبقاً عبر Smart Switch أو iCloud.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-neutral-600">
                <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">اختر شركة وموديل للبدء</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB 2: FLASH TOOLS & OFFICIAL DRIVERS (أدوات الفلاش والتعاريف)
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "utilities" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

          {/* Sub-filter chips */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1f1f1f]">
            <div className="flex items-center gap-2">
              {[
                { id: "all", label: "جميع الأدوات والتعاريف", count: OFFICIAL_UTILITIES.length },
                { id: "tool", label: "برامج وأدوات التفليش (Flash Tools)", count: OFFICIAL_UTILITIES.filter(u => u.category === "tool").length },
                { id: "driver", label: "تعاريف USB الرسمية (Drivers)", count: OFFICIAL_UTILITIES.filter(u => u.category === "driver").length },
              ].map((filterItem) => (
                <button
                  key={filterItem.id}
                  onClick={() => setUtilFilter(filterItem.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    utilFilter === filterItem.id
                      ? "bg-[#FFC400] text-black border-[#FFC400] shadow-[0_0_15px_rgba(255,196,0,0.3)]"
                      : "bg-[#111] text-neutral-300 border-[#2b2b2b] hover:border-[#FFC400]/30 hover:text-white"
                  }`}
                >
                  <span>{filterItem.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                    utilFilter === filterItem.id ? "bg-black/20 text-black" : "bg-white/5 text-neutral-500"
                  }`}>
                    {filterItem.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-xs text-neutral-500 font-bold">
              جميع البرامج أصلية وخالية من الفيروسات والإعلانات
            </div>
          </div>

          {/* Grid of Utilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUtilities.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#262626] bg-[#0E0E0E] p-5 hover:border-[#FFC400]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center shrink-0">
                      {item.category === "tool" ? (
                        <Wrench className="w-5 h-5 text-[#FFC400]" />
                      ) : (
                        <Cable className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    {item.badge && (
                      <span className="text-[10px] bg-[#FFC400]/15 text-[#FFC400] border border-[#FFC400]/30 px-2 py-0.5 rounded-full font-black">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Brand */}
                  <h3 className="font-black text-sm text-white mb-1 group-hover:text-[#FFC400] transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3 font-mono">
                    <span className="text-neutral-500">{item.version}</span>
                    <span>·</span>
                    <span className="text-neutral-500">📦 {item.fileSize}</span>
                    <span>·</span>
                    <span className="text-neutral-300 font-bold">{item.brandTarget}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-400 leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#1a1a1a] flex items-center gap-2">
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex-1 flex items-center justify-center gap-2 bg-[#FFC400] hover:bg-[#FFD340] text-black font-black text-xs py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,196,0,0.2)]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل مباشر</span>
                  </a>

                  <button
                    onClick={() => handleCopyLink(item.downloadUrl, item.id, item.name)}
                    className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#2b2b2b] hover:border-[#FFC400]/40 text-neutral-300 hover:text-white transition-all shrink-0"
                    title="نسخ رابط التحميل المباشر"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#FFC400]" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Technician Instructions Card */}
          <div className="mt-8 rounded-2xl border border-[#262626] bg-[#0B0B0B] p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#FFC400] shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-white">إرشادات تثبيت التعاريف على Windows 10 و 11:</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  معظم مشاكل عدم قراءة أجهزة MTK (إنفينيكس وتكنو) أو كوالكوم في وضع EDL 9008 تعود إلى حماية توقيع التعريفات في ويندوز. إذا واجهت مشكلة، قم بإيقاف <span className="text-white font-bold">Driver Signature Enforcement</span> عبر: الإعدادات ← التحديث والأمان ← الاسترداد ← بدء التشغيل المتقدم ← خيار رقم 7.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
} from "lucide-react";
import {
  SOFTWARE_DATABASE,
  SOFTWARE_BRANDS,
  METHOD_LABELS,
  METHOD_COLORS,
  getSoftwareByBrand,
  type SoftwareEntry,
  type SoftwareVersion,
} from "@/lib/software-data";

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
  const [selectedBrand, setSelectedBrand] = useState<string>("Samsung");
  const [selectedModelId, setSelectedModelId] = useState<string>("samsung-a12");
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [openStepIdx, setOpenStepIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const brandSlider = useDragScroll();
  const modelSlider = useDragScroll();
  const versionSlider = useDragScroll();

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

  return (
    <div className="min-h-screen bg-[#070707] text-white" dir="rtl">

      {/* ═══ HERO BANNER ══════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-[#1a1a1a]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/schematic-hero-3d.jpg"
            alt="Software Hero"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/40 via-[#070707]/60 to-[#070707]" />
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#FFC400]/10 border border-[#FFC400]/30 rounded-full px-4 py-1.5 text-xs font-bold text-[#FFC400] mb-4">
              <FileDown className="w-3.5 h-3.5" />
              Software & Firmware Hub
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 leading-tight">
              فلاشات وتحديثات{" "}
              <span className="text-[#FFC400]">البرمجيات</span>
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
              قاعدة بيانات شاملة للفرمويرات الرسمية — ملفات موثوقة، خطوات مفصّلة، وأدوات الفلاش المناسبة
            </p>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              { icon: <Smartphone className="w-3.5 h-3.5" />, label: `${SOFTWARE_DATABASE.length} موديل مدعوم` },
              { icon: <HardDrive className="w-3.5 h-3.5" />, label: `${SOFTWARE_DATABASE.reduce((a, m) => a + m.versions.length, 0)}+ إصدار متاح` },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "روابط رسمية موثّقة" },
              { icon: <Wrench className="w-3.5 h-3.5" />, label: "خطوات مفصّلة بالعربي" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/5 backdrop-blur border border-white/10 rounded-full px-4 py-1.5 text-xs font-bold text-neutral-300"
              >
                <span className="text-[#FFC400]">{s.icon}</span>
                {s.label}
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، الموديل، أو الشريحة... (مثل: A12، Snapdragon، Helio)"
              className="w-full bg-[#111]/80 border border-[#2b2b2b] rounded-xl pr-10 pl-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-[#FFC400]/50 focus:bg-[#131313] transition-all"
            />
          </div>
        </div>
      </div>

      {/* ═══ BRAND SLIDER ════════════════════════════════════ */}
      <div className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
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
                <span className="text-xs text-neutral-600 py-1">لا توجد نتائج</span>
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
                        {m.versions.length > 1 ? ` · ${m.versions.length} إصدار` : ""}
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
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-3xl shrink-0">
                  {BRAND_EMOJI[selectedModel.brand] ?? "📱"}
                </div>
                {/* Info */}
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
                      {selectedModel.versions.length} إصدار متاح
                    </span>
                  </div>
                  {/* Tags */}
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

            {/* ── Version Slider ───────────────────────────── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-[#FFC400]" />
                <span className="text-xs font-black text-neutral-300">اختر الإصدار / الفيرموير:</span>
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
                      className={`flex flex-col items-start px-4 py-2.5 rounded-xl border whitespace-nowrap transition-all shrink-0 min-w-[180px] text-right ${
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

            {/* ── Selected Version Details ─────────────────── */}
            {selectedVersion && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Left column: info + download */}
                <div className="lg:col-span-1 space-y-4">

                  {/* Flash Method Badge */}
                  <div className="rounded-2xl border border-[#2b2b2b] bg-[#0f0f0f] p-4">
                    <div className="text-[10px] font-black text-neutral-500 mb-3">🔧 طريقة الفلاش</div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-black ${METHOD_COLORS[selectedVersion.method]}`}>
                      <Wrench className="w-4 h-4" />
                      {METHOD_LABELS[selectedVersion.method]}
                    </div>
                    {selectedVersion.flashTool && (
                      <div className="mt-2 text-xs text-neutral-400">
                        أداة: <span className="text-white font-bold">{selectedVersion.flashTool}</span>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="rounded-2xl border border-[#2b2b2b] bg-[#0f0f0f] p-4 space-y-3">
                    <div className="text-[10px] font-black text-neutral-500">📁 معلومات الملف</div>
                    {[
                      { icon: <Tag className="w-3.5 h-3.5" />, label: "الإصدار", val: selectedVersion.versionName },
                      selectedVersion.buildNumber
                        ? { icon: <HardDrive className="w-3.5 h-3.5" />, label: "Build", val: selectedVersion.buildNumber }
                        : null,
                      selectedVersion.region
                        ? { icon: <Globe className="w-3.5 h-3.5" />, label: "المنطقة", val: selectedVersion.region }
                        : null,
                      selectedVersion.fileSize
                        ? { icon: <Download className="w-3.5 h-3.5" />, label: "الحجم", val: selectedVersion.fileSize }
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

                  {/* Download Button */}
                  <div className="rounded-2xl border border-[#2b2b2b] bg-[#0f0f0f] p-4">
                    <div className="text-[10px] font-black text-neutral-500 mb-3">⬇️ تحميل الفيرموير</div>
                    {selectedVersion.downloadUrl ? (
                      <a
                        href={selectedVersion.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#FFC400] hover:bg-[#FFD340] text-black font-black text-sm px-4 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(255,196,0,0.3)] hover:shadow-[0_0_30px_rgba(255,196,0,0.5)]"
                      >
                        <Download className="w-4 h-4" />
                        تحميل الفيرموير الرسمي
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="text-center">
                        <div className="text-xs text-neutral-500 mb-3">الرابط غير متوفر حالياً</div>
                        <button className="flex items-center justify-center gap-2 w-full bg-[#1a1a1a] hover:bg-[#222] text-[#FFC400] border border-[#FFC400]/30 font-black text-sm px-4 py-3 rounded-xl transition-all">
                          <Info className="w-4 h-4" />
                          اطلب من المجتمع
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-neutral-600 text-center mt-2">
                      الروابط تُوجّه للمصادر الرسمية الموثوقة
                    </p>
                  </div>

                  {/* Version Tags */}
                  {selectedVersion.tags && selectedVersion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVersion.tags.map((t) => (
                        <span key={t} className="text-[10px] bg-white/5 border border-white/10 text-neutral-400 px-2 py-1 rounded-full font-bold">
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
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-4 h-4 text-[#FFC400]" />
                        <span className="font-black text-sm text-white">المتطلبات قبل البدء</span>
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
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4 text-[#FFC400]" />
                      <span className="font-black text-sm text-white">خطوات الفلاش التفصيلية</span>
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
                            {/* Step number */}
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
                          <div className="text-xs font-black text-amber-400 mb-1">ملاحظات مهمة</div>
                          <p className="text-xs text-amber-200/80 leading-relaxed">{selectedVersion.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Info banner */}
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-black text-blue-400 mb-1">تنبيه مهم</div>
                        <p className="text-xs text-blue-200/70 leading-relaxed">
                          الفلاش يمحو جميع البيانات. تأكد من عمل نسخة احتياطية قبل البدء. المصادر المعروضة رسمية موثوقة — قم بالتحقق من رقم البناء Build Number قبل البدء.
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
    </div>
  );
}

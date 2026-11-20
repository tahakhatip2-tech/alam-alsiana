"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Cpu,
  MapPin,
  Info,
  Activity,
  X,
  Search,
  Zap,
  Monitor,
  Wifi,
  Mic,
  Camera,
  HardDrive,
  Plug,
  ExternalLink,
  Volume2,
  VolumeX,
  Eye,
  Crosshair,
  Move,
  Gauge,
  AlertTriangle,
  Upload,
  Plus,
  ChevronDown,
  Smartphone,
  Trash2,
  FileCode,
  Check,
  FileText,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import {
  BOARDS_CONFIG,
  BoardTrack,
  TrackCategory,
  BoardModelConfig,
} from "@/lib/schematic-data";

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<
  TrackCategory,
  { label: string; color: string; icon: React.ReactNode }
> = {
  power: {
    label: "باور",
    color: "#EF4444",
    icon: <Zap className="w-3 h-3" />,
  },
  display: {
    label: "شاشة",
    color: "#3B82F6",
    icon: <Monitor className="w-3 h-3" />,
  },
  memory: {
    label: "ذاكرة",
    color: "#F97316",
    icon: <HardDrive className="w-3 h-3" />,
  },
  rf: {
    label: "RF",
    color: "#FB923C",
    icon: <Wifi className="w-3 h-3" />,
  },
  audio: {
    label: "صوت",
    color: "#A78BFA",
    icon: <Mic className="w-3 h-3" />,
  },
  camera: {
    label: "كاميرا",
    color: "#84CC16",
    icon: <Camera className="w-3 h-3" />,
  },
  cpu: {
    label: "معالج",
    color: "#8B5CF6",
    icon: <Cpu className="w-3 h-3" />,
  },
  peripheral: {
    label: "ملحقات",
    color: "#06B6D4",
    icon: <Plug className="w-3 h-3" />,
  },
};

type BrandFilter = "الكل" | "Samsung" | "Xiaomi" | "Apple" | "Tecno" | "Other";
type CategoryFilter = "all" | TrackCategory;
type MultimeterMode = "diode" | "voltage" | "continuity";

const BRANDS: BrandFilter[] = [
  "الكل",
  "Samsung",
  "Xiaomi",
  "Apple",
  "Tecno",
  "Other",
];

// ─── SVG Icon helper ──────────────────────────────────────────────────────────
function CategoryIconSVG({
  category,
  x,
  y,
}: {
  category: TrackCategory;
  x: number;
  y: number;
}) {
  return (
    <text
      x={x}
      y={y - 14}
      textAnchor="middle"
      fontSize="11"
      style={{ userSelect: "none", pointerEvents: "none" }}
    >
      {getCategoryEmoji(category)}
    </text>
  );
}

function getCategoryEmoji(cat: TrackCategory): string {
  const map: Record<TrackCategory, string> = {
    power: "⚡",
    display: "📺",
    memory: "💾",
    rf: "📶",
    audio: "🎵",
    camera: "📷",
    cpu: "🧠",
    peripheral: "🔌",
  };
  return map[cat] ?? "●";
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SchematicPage() {
  // ── Custom Boards Upload & Persistence ───────────────────────────────────────
  const [customBoards, setCustomBoards] = useState<BoardModelConfig[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  // ── Two-Tier Slider: selected brand ─────────────────────────────────────────
  const [selectedBrand, setSelectedBrand] = useState<string>("samsung");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("alam_custom_boards");
      if (saved) {
        setCustomBoards(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load custom boards:", e);
    }
  }, []);

  const allBoards = useMemo(() => {
    return [...customBoards, ...BOARDS_CONFIG];
  }, [customBoards]);

  const [selectedBoardId, setSelectedBoardId] = useState(
    BOARDS_CONFIG[0]?.id ?? "a12"
  );
  const [activeTrackId, setActiveTrackId] = useState<string>(
    BOARDS_CONFIG[0]?.tracks[0]?.id ?? ""
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [selectedPin, setSelectedPin] = useState<{
    label: string;
    voltage?: string;
    refNumber?: string;
    diodeValue?: string;
    resistanceGround?: string;
    expectedState?: string;
    type: "start" | "end" | "waypoint";
  } | null>(null);

  // Filter state
  const [searchText, setSearchText] = useState("");
  const [brandFilter, setBrandFilter] = useState<BrandFilter>("الكل");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  // Advanced View Modes
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  // Virtual Multimeter Tool State
  const [multimeterOpen, setMultimeterOpen] = useState(false);
  const [multimeterMode, setMultimeterMode] = useState<MultimeterMode>("diode");
  const [simulateFault, setSimulateFault] = useState<"none" | "short" | "open">("none");
  const [audioEnabled, setAudioEnabled] = useState(true);

  // ── Web Audio API Buzzer for Shorts & Continuity ─────────────────────────────
  const playBuzzer = useCallback(() => {
    if (!audioEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(2800, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Audio context might be restricted before user interaction
    }
  }, [audioEnabled]);

  // ── Stats (dynamic) ─────────────────────────────────────────────────────────
  const totalModels = allBoards.length;
  const totalTracks = useMemo(
    () => allBoards.reduce((sum, b) => sum + b.tracks.length, 0),
    [allBoards]
  );
  const uniqueBrands = useMemo(
    () => [...new Set(allBoards.map((b) => b.brand))].join(" / "),
    [allBoards]
  );

  // ── Grouped Boards by Brand for Touch Slider Dropdowns ───────────────────────
  interface BrandGroup {
    id: string;
    name: string;
    nameAr: string;
    icon: string;
    badgeColor: string;
    boards: BoardModelConfig[];
  }

  const brandGroups = useMemo(() => {
    const samsung = allBoards.filter((b) => b.brand === "Samsung");
    const apple = allBoards.filter((b) => b.brand === "Apple");
    const xiaomi = allBoards.filter((b) => b.brand === "Xiaomi");
    const infinix = allBoards.filter(
      (b) =>
        b.brand === "Other" &&
        (b.name.toLowerCase().includes("infinix") ||
          (b.tags && b.tags.some((t) => t.toLowerCase().includes("infinix"))))
    );
    const tecno = allBoards.filter((b) => b.brand === "Tecno");
    const other = allBoards.filter(
      (b) =>
        b.brand === "Other" &&
        !b.name.toLowerCase().includes("infinix") &&
        !(b.tags && b.tags.some((t) => t.toLowerCase().includes("infinix"))) &&
        !customBoards.some((cb) => cb.id === b.id)
    );
    const custom = customBoards;

    const groups: BrandGroup[] = [
      {
        id: "samsung",
        name: "Samsung",
        nameAr: "سامسونج Samsung",
        icon: "📱",
        badgeColor: "border-blue-500/40 text-blue-400 bg-blue-500/10",
        boards: samsung,
      },
      {
        id: "apple",
        name: "Apple iPhone",
        nameAr: "أبل Apple iPhone",
        icon: "🍏",
        badgeColor: "border-neutral-400/40 text-neutral-200 bg-neutral-500/10",
        boards: apple,
      },
      {
        id: "xiaomi",
        name: "Xiaomi & Redmi",
        nameAr: "شاومي وريدمي Xiaomi",
        icon: "⚡",
        badgeColor: "border-orange-500/40 text-orange-400 bg-orange-500/10",
        boards: xiaomi,
      },
      {
        id: "infinix",
        name: "Infinix",
        nameAr: "إنفينكس Infinix",
        icon: "🚀",
        badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
        boards: infinix,
      },
      {
        id: "tecno",
        name: "Tecno",
        nameAr: "تكنو Tecno",
        icon: "🛡️",
        badgeColor: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
        boards: tecno,
      },
      {
        id: "other",
        name: "Honor / Oppo / Other",
        nameAr: "هونر وأوبو وغيرها",
        icon: "🌐",
        badgeColor: "border-purple-500/40 text-purple-400 bg-purple-500/10",
        boards: other,
      },
    ];

    if (custom.length > 0) {
      groups.unshift({
        id: "custom",
        name: "Custom Boards",
        nameAr: "بورداتي المخصصة",
        icon: "📁",
        badgeColor: "border-[#FFC400]/40 text-[#FFC400] bg-[#FFC400]/10",
        boards: custom,
      });
    }

    return groups;
  }, [allBoards, customBoards]);

  // ── Filtered boards for switcher ─────────────────────────────────────────────
  const filteredBoards = useMemo(() => {
    return allBoards.filter((board) => {
      // Brand filter
      if (brandFilter !== "الكل") {
        if (brandFilter === "Other") {
          if (["Samsung", "Xiaomi", "Apple", "Tecno"].includes(board.brand))
            return false;
        } else {
          if (board.brand !== brandFilter) return false;
        }
      }

      // Text search
      if (searchText.trim()) {
        const q = searchText.trim().toLowerCase();
        const inName = board.name.toLowerCase().includes(q);
        const inBrand = board.brand.toLowerCase().includes(q);
        const inChipset = (board.chipset ?? "").toLowerCase().includes(q);
        const inTracks = board.tracks.some(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.net.toLowerCase().includes(q)
        );
        if (!inName && !inBrand && !inChipset && !inTracks) return false;
      }

      return true;
    });
  }, [allBoards, brandFilter, searchText]);

  // ── Current board ────────────────────────────────────────────────────────────
  const currentBoard = useMemo(() => {
    return (
      allBoards.find((b) => b.id === selectedBoardId) ?? allBoards[0] ?? BOARDS_CONFIG[0]
    );
  }, [allBoards, selectedBoardId]);

  // ── Filtered tracks for sidebar ───────────────────────────────────────────────
  const filteredTracks = useMemo(() => {
    return currentBoard.tracks.filter((t) => {
      if (categoryFilter !== "all" && t.category !== categoryFilter)
        return false;
      return true;
    });
  }, [currentBoard, categoryFilter]);

  const activeTrack = currentBoard.tracks.find((t) => t.id === activeTrackId);

  // Auto-play buzzer if short simulation is triggered
  useEffect(() => {
    if (simulateFault === "short") {
      playBuzzer();
    }
  }, [simulateFault, playBuzzer]);

  // ── Custom Board Handlers ──────────────────────────────────────────────────
  const handleSaveCustomBoard = (newBoard: BoardModelConfig) => {
    const updated = [newBoard, ...customBoards.filter((b) => b.id !== newBoard.id)];
    setCustomBoards(updated);
    try {
      localStorage.setItem("alam_custom_boards", JSON.stringify(updated));
    } catch (e) {
      console.error("Local storage error:", e);
    }
    setSelectedBoardId(newBoard.id);
    if (newBoard.tracks && newBoard.tracks.length > 0) {
      setActiveTrackId(newBoard.tracks[0].id);
    }
    setUploadModalOpen(false);
  };

  const handleDeleteCustomBoard = (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customBoards.filter((b) => b.id !== boardId);
    setCustomBoards(updated);
    try {
      localStorage.setItem("alam_custom_boards", JSON.stringify(updated));
    } catch (e) {}
    if (selectedBoardId === boardId) {
      setSelectedBoardId(BOARDS_CONFIG[0].id);
      setActiveTrackId(BOARDS_CONFIG[0].tracks[0]?.id ?? "");
    }
  };

  // Handle board selection
  function selectBoard(id: string) {
    const board = allBoards.find((b) => b.id === id);
    if (!board) return;
    setSelectedBoardId(id);
    setActiveTrackId(board.tracks[0]?.id ?? "");
    setSelectedPin(null);
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1);
    setSimulateFault("none");
  }

  // Handle Pan / Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1 && panOffset.x === 0 && panOffset.y === 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Multimeter computed display value
  const multimeterDisplay = useMemo(() => {
    if (!activeTrack) return { val: "0.000", unit: "V", status: "READY" };

    if (simulateFault === "short") {
      return { val: "0.002", unit: "V", status: "⚠️ SHORT / قصر صريح" };
    }
    if (simulateFault === "open") {
      return { val: "O.L", unit: " ", status: "⚠️ OPEN / مسار مقطوع" };
    }

    if (multimeterMode === "diode") {
      const val = activeTrack.diodeValue ? activeTrack.diodeValue.replace("V", "") : "0.520";
      return { val, unit: "V", status: "PASS / سليم" };
    } else if (multimeterMode === "voltage") {
      const val = activeTrack.voltage ? activeTrack.voltage.replace("V", "").trim() : "5.0";
      return { val, unit: "V", status: "DC VOLT / جهد تشغيل" };
    } else {
      // Continuity mode
      return { val: "048", unit: "Ω", status: "CONTINUOUS / متصل" };
    }
  }, [activeTrack, multimeterMode, simulateFault]);

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-8 space-y-6 flex-1 w-full flex flex-col"
      dir="rtl"
    >
      {/* ── 3D Hero Header Banner ──────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden border border-[#FFC400]/25 bg-[#080808] shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_50px_rgba(255,196,0,0.08)] p-6 sm:p-8">
        {/* Background 3D Artwork with Visual Identity Overlays */}
        <div
          className="absolute inset-0 bg-cover bg-left sm:bg-center opacity-30 mix-blend-luminosity pointer-events-none transition-all duration-700 hover:opacity-40 scale-105"
          style={{ backgroundImage: "url('/schematic-hero-3d.jpg')" }}
        />
        {/* Dark & Gold Gradient Overlays for High Contrast & Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/90 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-black/30 pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-72 h-72 rounded-full bg-[#FFC400]/12 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFC400]/20 via-amber-500/15 to-transparent text-[#FFC400] text-xs font-bold mb-3 border border-[#FFC400]/30 backdrop-blur-md shadow-[0_0_15px_rgba(255,196,0,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC400] animate-pulse" />
                <span>ZXW Killer — منصة المخططات وتتبع المسارات الاحترافية الحية</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
                <span>مخططات الدوائر وتتبع المسارات الحية</span>
              </h1>
              <p className="text-neutral-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                خرائط PCB تفاعلية مع قياسات ممانعة الملتيميتر (Diode Mode) وجهود التشغيل ونقاط الفحص الحقيقية
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <button
                onClick={() => setMultimeterOpen((prev) => !prev)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-lg backdrop-blur-md ${
                  multimeterOpen
                    ? "bg-[#FFC400] text-black border-[#FFC400] shadow-[0_0_20px_rgba(255,196,0,0.5)] font-black"
                    : "bg-[#141414]/90 text-neutral-200 border-neutral-700 hover:border-[#FFC400]/60 hover:text-[#FFC400]"
                }`}
              >
                <Gauge className="w-4 h-4" />
                <span>{multimeterOpen ? "إخفاء الملتيميتر" : "وضع فحص الملتيميتر"}</span>
              </button>

              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] backdrop-blur-md"
                title="رفع مخطط أو كروكي بوردة مخصصة (.brd / .json / صورة)"
              >
                <Upload className="w-4 h-4" />
                <span>رفع كروكي مخصص</span>
              </button>
            </div>
          </div>

          {/* Glassmorphic Stats Pills */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs pt-1">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-neutral-300">
              <span>📱</span>
              <span className="text-[#FFC400] font-black">{totalModels}</span>
              <span>موديل مكتمل</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-neutral-300">
              <span>⚡</span>
              <span className="text-[#FFC400] font-black">{totalTracks}+</span>
              <span>مسار ونقطة فحص</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-neutral-300">
              <span>🔬</span>
              <span className="text-emerald-400 font-bold">100% قياسات ممانعة حقيقية</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-neutral-300">
              <span>🔧</span>
              <span className="text-neutral-200 font-medium">{uniqueBrands}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">

        {/* Search & Filter Bar */}
        <div className="space-y-3">
          {/* Text Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ابحث بالاسم، الموديل، المعالج، أو اسم المسار (مثل: S23 Ultra, A54, VBUS, LCD, PMIC)..."
              className="w-full bg-[#141414] border border-[#262626] rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFC400]/50 transition-colors"
            />
          </div>

          {/* Quick Search Results if search text is typed */}
          {searchText.trim() && (
            <div className="bg-[#141414] border border-[#FFC400]/40 rounded-xl p-3 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>نتائج البحث السريع عن "{searchText}":</span>
                <span className="text-[#FFC400] font-bold">{filteredBoards.length} موديل مطابقة</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {filteredBoards.length === 0 ? (
                  <span className="text-xs text-neutral-500 py-1">لا توجد نتائج مطابقة لبحثك</span>
                ) : (
                  filteredBoards.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        selectBoard(b.id);
                        setSearchText("");
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                        selectedBoardId === b.id
                          ? "bg-[#FFC400] text-black shadow-[0_0_10px_rgba(255,196,0,0.3)]"
                          : "border border-neutral-700 text-neutral-300 hover:border-[#FFC400] hover:text-[#FFC400]"
                      }`}
                    >
                      {b.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── Two-Tier Brand + Model Sliders (Compact Filter-Style) ── */}
          <div className="space-y-2">

            {/* ── Row 1: Brand Selector (Matching Filter Pills Style) ── */}
            <div
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 snap-x scroll-smooth cursor-grab active:cursor-grabbing select-none"
              style={{ WebkitOverflowScrolling: "touch" }}
              onMouseDown={(e) => {
                const el = e.currentTarget;
                const startX = e.pageX - el.offsetLeft;
                const sl = el.scrollLeft;
                const onMove = (ev: MouseEvent) => { el.scrollLeft = sl - (ev.pageX - el.offsetLeft - startX); };
                const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", onUp);
              }}
            >
              <span className="text-xs text-neutral-500 shrink-0 ml-1">الشركة:</span>
              {brandGroups.map((group) => {
                const isActive = selectedBrand === group.id;
                const displayName = group.id === "samsung" ? "سامسونج"
                  : group.id === "apple" ? "أبل"
                  : group.id === "xiaomi" ? "شاومي"
                  : group.id === "infinix" ? "إنفينكس"
                  : group.id === "tecno" ? "تكنو"
                  : group.id === "custom" ? "بورداتي"
                  : "غيرها";
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => {
                      setSelectedBrand(group.id);
                      if (group.boards[0]) selectBoard(group.boards[0].id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 snap-start whitespace-nowrap border ${
                      isActive
                        ? "bg-[#FFC400] text-black border-[#FFC400] shadow-[0_0_10px_rgba(255,196,0,0.25)] font-black"
                        : "border-neutral-700 text-neutral-400 hover:border-[#FFC400]/40 hover:text-[#FFC400] bg-transparent"
                    }`}
                  >
                    <span>{group.icon}</span>
                    <span>{displayName}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? "bg-black/20 text-black font-black" : "bg-neutral-800 text-neutral-400"}`}>
                      {group.boards.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── Row 2: Model Selector (Matching Filter Pills Style) ── */}
            {(() => {
              const activeGroup = brandGroups.find((g) => g.id === selectedBrand);
              const models = activeGroup?.boards ?? [];
              return (
                <div
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 snap-x scroll-smooth cursor-grab active:cursor-grabbing select-none"
                  style={{ WebkitOverflowScrolling: "touch" }}
                  onMouseDown={(e) => {
                    const el = e.currentTarget;
                    const startX = e.pageX - el.offsetLeft;
                    const sl = el.scrollLeft;
                    const onMove = (ev: MouseEvent) => { el.scrollLeft = sl - (ev.pageX - el.offsetLeft - startX); };
                    const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
                    document.addEventListener("mousemove", onMove);
                    document.addEventListener("mouseup", onUp);
                  }}
                >
                  <span className="text-xs text-neutral-500 shrink-0 ml-1">الموديل:</span>
                  {models.map((b) => {
                    const isSelected = selectedBoardId === b.id;
                    const shortName = b.name
                      .replace(/Samsung Galaxy /i, "")
                      .replace(/Samsung /i, "")
                      .replace(/Apple /i, "")
                      .replace(/Xiaomi /i, "")
                      .replace(/Redmi /i, "")
                      .replace(/Infinix /i, "")
                      .replace(/Tecno /i, "")
                      .split("(")[0].trim();
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => selectBoard(b.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 snap-start whitespace-nowrap border ${
                          isSelected
                            ? "bg-[#FFC400] text-black border-[#FFC400] shadow-[0_0_10px_rgba(255,196,0,0.25)] font-black"
                            : "border-neutral-700 text-neutral-400 hover:border-[#FFC400]/40 hover:text-[#FFC400] bg-transparent"
                        }`}
                      >
                        <span>{shortName}</span>
                        <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${isSelected ? "bg-black/20 text-black font-black" : "bg-neutral-800 text-neutral-500"}`}>
                          ⚡{b.tracks.length}
                        </span>
                        {customBoards.some((cb) => cb.id === b.id) && (
                          <span
                            onClick={(e) => handleDeleteCustomBoard(b.id, e)}
                            title="حذف"
                            className={`p-0.5 rounded ${isSelected ? "hover:bg-black/20 text-black/60" : "hover:bg-red-500/20 text-red-400"}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>{/* end two-tier sliders */}

          {/* Active Board Quick Summary Banner */}
          {currentBoard && (
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#161616] to-[#121212] border border-[#FFC400]/30 text-xs shadow-inner">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[#FFC400] font-bold shrink-0">المخطط النشط حالياً:</span>
                <span className="text-white font-black truncate text-sm">{currentBoard.name}</span>
                <span className="text-neutral-400 font-mono text-[11px] shrink-0 hidden sm:inline">
                  [{currentBoard.chipset}]
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-emerald-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  ⚡ {currentBoard.tracks.length} مسارات فحص
                </span>
              </div>
            </div>
          )}

          {/* Category Filter — Horizontal Slider */}
          <div
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 snap-x scroll-smooth cursor-grab active:cursor-grabbing select-none"
            style={{ WebkitOverflowScrolling: "touch" }}
            onMouseDown={(e) => {
              const el = e.currentTarget;
              const startX = e.pageX - el.offsetLeft;
              const sl = el.scrollLeft;
              const onMove = (ev: MouseEvent) => { el.scrollLeft = sl - (ev.pageX - el.offsetLeft - startX); };
              const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
              document.addEventListener("mousemove", onMove);
              document.addEventListener("mouseup", onUp);
            }}
          >
            <span className="text-xs text-neutral-500 shrink-0 ml-1">فلترة:</span>
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 snap-start whitespace-nowrap ${
                categoryFilter === "all"
                  ? "bg-[#FFC400] text-black shadow-[0_0_10px_rgba(255,196,0,0.25)]"
                  : "border border-neutral-700 text-neutral-400 hover:border-[#FFC400]/40 hover:text-[#FFC400] bg-transparent"
              }`}
            >
              كافة المسارات
            </button>
            {(Object.keys(CATEGORY_CONFIG) as TrackCategory[]).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const isActive = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 snap-start whitespace-nowrap ${
                    isActive
                      ? "text-black shadow-[0_0_10px_rgba(255,196,0,0.2)]"
                      : "border border-neutral-700 text-neutral-400 hover:text-white bg-transparent"
                  }`}
                  style={isActive ? { backgroundColor: cfg.color } : { borderColor: cfg.color + "55" }}
                >
                  {cfg.icon}
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Virtual Multimeter Panel (HUD) ─────────────────────────────────── */}
      {multimeterOpen && (
        <div className="bg-[#0e1612] border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left: LCD Screen */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="bg-[#05110a] border-2 border-emerald-600/60 rounded-xl px-5 py-3 shadow-inner flex items-center justify-between min-w-[220px] sm:min-w-[260px]">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70 flex items-center gap-1">
                    <span>DIGITAL PROBE</span>
                    {multimeterMode === "diode" && <span>• DIODE</span>}
                    {multimeterMode === "voltage" && <span>• DC V</span>}
                    {multimeterMode === "continuity" && <span>• BUZZER</span>}
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-400 tracking-wider">
                    {multimeterDisplay.val}{" "}
                    <span className="text-xl text-emerald-500 font-sans">
                      {multimeterDisplay.unit}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono font-bold mt-0.5 text-emerald-300">
                    {multimeterDisplay.status}
                  </div>
                </div>

                {/* Simulated Probe indicator */}
                <div className="flex flex-col items-center gap-1.5 pl-2 border-l border-emerald-800/40">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_8px_red]" title="المجس الموجب (Red Probe -> GND in Diode Mode)" />
                  <div className="w-3.5 h-3.5 rounded-full bg-black border border-neutral-600" title="المجس السالب (Black Probe -> Net)" />
                </div>
              </div>

              {/* Mode Selectors */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setMultimeterMode("diode")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      multimeterMode === "diode"
                        ? "bg-emerald-500 text-black shadow-md font-black"
                        : "bg-[#18261e] text-neutral-300 hover:text-white border border-emerald-900"
                    }`}
                  >
                    🔴 وضع الدايود (ممانعة)
                  </button>
                  <button
                    onClick={() => setMultimeterMode("voltage")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      multimeterMode === "voltage"
                        ? "bg-amber-500 text-black shadow-md font-black"
                        : "bg-[#18261e] text-neutral-300 hover:text-white border border-amber-900"
                    }`}
                  >
                    ⚡ الجهد الحي (DC)
                  </button>
                  <button
                    onClick={() => {
                      setMultimeterMode("continuity");
                      playBuzzer();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      multimeterMode === "continuity"
                        ? "bg-blue-500 text-black shadow-md font-black"
                        : "bg-[#18261e] text-neutral-300 hover:text-white border border-blue-900"
                    }`}
                  >
                    📢 صفارة الاتصال
                  </button>
                </div>

                {/* Sound control */}
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <button
                    onClick={() => setAudioEnabled((a) => !a)}
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
                  >
                    {audioEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span>صوت الصفارة: {audioEnabled ? "مفعل" : "صامت"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Fault simulation tools for technicians */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end flex-wrap border-t lg:border-t-0 border-emerald-900/50 pt-2 lg:pt-0">
              <span className="text-xs text-neutral-400 font-bold">محاكاة الفحص:</span>
              <button
                onClick={() => setSimulateFault("none")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  simulateFault === "none"
                    ? "bg-emerald-500 text-black font-black"
                    : "bg-[#16221b] text-neutral-400 hover:text-white"
                }`}
              >
                قراءة طبيعية (Normal)
              </button>
              <button
                onClick={() => setSimulateFault("short")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                  simulateFault === "short"
                    ? "bg-red-600 text-white shadow-[0_0_10px_red]"
                    : "bg-[#16221b] text-red-400 hover:bg-red-950"
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                محاكاة شورت (0.002V)
              </button>
              <button
                onClick={() => setSimulateFault("open")}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  simulateFault === "open"
                    ? "bg-yellow-600 text-black shadow-md font-black"
                    : "bg-[#16221b] text-yellow-400 hover:bg-yellow-950"
                }`}
              >
                محاكاة قطع (O.L)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Workspace Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 w-full max-w-full overflow-hidden">
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">
          {/* Model Info */}
          <div className="bg-[#121212] border border-[#222] rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-neutral-300">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              معلومات اللوحة والمعالج
            </div>
            <div className="space-y-1.5 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>المعالج / الشريحة:</span>
                <span className="font-mono text-white text-right max-w-[150px] truncate" title={currentBoard.chipset}>
                  {currentBoard.chipset ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>سنة الإصدار:</span>
                <span className="font-mono text-[#FFC400]">
                  {currentBoard.year ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>الماركة:</span>
                <span className="text-neutral-200">{currentBoard.brand}</span>
              </div>
              <div className="flex justify-between">
                <span>إجمالي المسارات:</span>
                <span className="font-mono text-emerald-400">
                  {currentBoard.tracks.length} مسار موثق
                </span>
              </div>
            </div>
          </div>

          {/* Tracks List */}
          <div className="bg-[#121212] border border-[#222] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#FFC400]" />
                مسارات الجهد (Nets)
              </span>
              <span className="text-[10px] text-neutral-500">
                {filteredTracks.length}/{currentBoard.tracks.length} مسارات
              </span>
            </h2>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredTracks.length === 0 ? (
                <p className="text-xs text-neutral-600 text-center py-4">
                  لا توجد مسارات في هذه الفئة
                </p>
              ) : (
                filteredTracks.map((track) => {
                  const catCfg = track.category
                    ? CATEGORY_CONFIG[track.category]
                    : null;
                  return (
                    <button
                      key={track.id}
                      onClick={() => {
                        setActiveTrackId(track.id);
                        setSelectedPin(null);
                        setSimulateFault("none");
                      }}
                      className={`w-full text-right p-3 rounded-xl border transition-all text-xs space-y-1 block ${
                        activeTrackId === track.id
                          ? "bg-neutral-800 border-[#FFC400] text-white shadow-md"
                          : "bg-[#181818] border-neutral-800 text-neutral-300 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {catCfg && (
                            <span
                              className="p-0.5 rounded"
                              style={{ color: catCfg.color }}
                            >
                              {catCfg.icon}
                            </span>
                          )}
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: track.color }}
                          />
                        </div>
                        <span className="font-bold text-right flex-1 leading-tight truncate">
                          {track.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="font-mono text-neutral-400">{track.net}</span>
                        <div className="flex items-center gap-1.5">
                          {track.diodeValue && (
                            <span className="font-mono text-emerald-400 text-[10px] bg-emerald-950/40 px-1 rounded border border-emerald-800/40">
                              {track.diodeValue}
                            </span>
                          )}
                          <span className="font-mono text-[#FFC400]">
                            {track.voltage}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Pin Info Panel */}
          {selectedPin && (
            <div className="bg-[#141414] border border-[#FFC400]/40 rounded-2xl p-4 space-y-2.5 shadow-lg animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#FFC400] font-bold text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedPin.type === "start"
                    ? "نقطة البداية (Start Pin)"
                    : selectedPin.type === "end"
                      ? "نقطة النهاية (Target IC)"
                      : "نقطة وسطية (Testpoint)"}
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs font-bold text-neutral-100 leading-relaxed">
                {selectedPin.label}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#222]">
                {selectedPin.voltage && (
                  <div>
                    <span className="text-[10px] text-neutral-500 block">الجهد:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {selectedPin.voltage}
                    </span>
                  </div>
                )}
                {selectedPin.diodeValue && (
                  <div>
                    <span className="text-[10px] text-neutral-500 block">الممانعة (Diode):</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {selectedPin.diodeValue}
                    </span>
                  </div>
                )}
                {selectedPin.resistanceGround && (
                  <div>
                    <span className="text-[10px] text-neutral-500 block">مقاومة الأرضي:</span>
                    <span className="font-mono text-blue-400 font-bold">
                      {selectedPin.resistanceGround}
                    </span>
                  </div>
                )}
                {selectedPin.refNumber && (
                  <div>
                    <span className="text-[10px] text-neutral-500 block">المعرف (Ref):</span>
                    <span className="font-mono text-neutral-300">
                      #{selectedPin.refNumber}
                    </span>
                  </div>
                )}
              </div>

              {selectedPin.expectedState && (
                <div className="text-[11px] text-emerald-400/90 bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/40">
                  {selectedPin.expectedState}
                </div>
              )}
            </div>
          )}

          {/* Track Detail Panel */}
          {activeTrack && (
            <div className="bg-[#121212] border border-[#222] rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-xs font-black text-neutral-300">
                <Info className="w-3.5 h-3.5 text-[#FFC400]" />
                تفاصيل المسار وقيم الفحص
              </div>
              <div className="space-y-2 text-neutral-400">
                <div className="flex justify-between gap-2">
                  <span className="flex-shrink-0">الاسم:</span>
                  <span className="font-bold text-white text-right">
                    {activeTrack.name}
                  </span>
                </div>

                {/* Category Badge */}
                {activeTrack.category && (
                  <div className="flex justify-between items-center">
                    <span>الفئة:</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
                      style={{
                        backgroundColor:
                          CATEGORY_CONFIG[activeTrack.category]?.color + "25",
                        color: CATEGORY_CONFIG[activeTrack.category]?.color,
                        border: `1px solid ${CATEGORY_CONFIG[activeTrack.category]?.color}50`,
                      }}
                    >
                      {CATEGORY_CONFIG[activeTrack.category]?.icon}
                      {CATEGORY_CONFIG[activeTrack.category]?.label}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Net (اسم الشبكة):</span>
                  <span className="font-mono text-[#FFC400]">
                    {activeTrack.net}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>جهد التشغيل:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {activeTrack.voltage}
                  </span>
                </div>
                {activeTrack.diodeValue && (
                  <div className="flex justify-between">
                    <span>ممانعة الدايود (GND Red):</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {activeTrack.diodeValue}
                    </span>
                  </div>
                )}
                {activeTrack.resistanceGround && (
                  <div className="flex justify-between">
                    <span>المقاومة للأرضي:</span>
                    <span className="font-mono text-blue-400">
                      {activeTrack.resistanceGround}
                    </span>
                  </div>
                )}

                <div className="flex justify-between gap-2 pt-1 border-t border-[#222]">
                  <span className="flex-shrink-0">من (Start):</span>
                  <div className="text-right">
                    <span className="text-neutral-200">
                      {activeTrack.startPoint.label}
                    </span>
                    {activeTrack.startPoint.refNumber && (
                      <span className="block text-[10px] text-neutral-500 font-mono">
                        #{activeTrack.startPoint.refNumber}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="flex-shrink-0">إلى (Target):</span>
                  <div className="text-right">
                    <span className="text-neutral-200">
                      {activeTrack.endPoint.label}
                    </span>
                    {activeTrack.endPoint.refNumber && (
                      <span className="block text-[10px] text-neutral-500 font-mono">
                        #{activeTrack.endPoint.refNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Symptoms */}
                {activeTrack.symptoms && activeTrack.symptoms.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-[#222]">
                    <span className="text-neutral-300 font-bold">
                      الأعراض الشائعة عند التلف:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-neutral-400 pr-1">
                      {activeTrack.symptoms.map((s, i) => (
                        <li key={i} className="text-[11px] leading-relaxed">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Related Fault Link */}
                {activeTrack.relatedFaultId && (
                  <div className="pt-2 border-t border-[#222]">
                    <Link
                      href={`/hospital?fault=${activeTrack.relatedFaultId}`}
                      className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-bold text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      عرض خطوات فحص وإصلاح العطل
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── PCB Viewer ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 bg-[#0D0D0D] border border-[#222] rounded-2xl overflow-hidden flex flex-col select-none">
          {/* Viewer Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E1E1E] bg-[#141414] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-black text-white">
                {currentBoard.name}
              </span>
              {currentBoard.year && (
                <span className="text-[10px] text-neutral-500">
                  ({currentBoard.year})
                </span>
              )}
            </div>

            {/* View Controls & Tools */}
            <div className="flex items-center gap-2">
              {/* Show all tracks toggle */}
              <button
                onClick={() => setShowAllTracks((a) => !a)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                  showAllTracks
                    ? "bg-blue-600/20 border-blue-500 text-blue-400"
                    : "border-neutral-700 text-neutral-400 hover:text-white"
                }`}
                title="إظهار كافة المسارات على اللوحة دفعة واحدة"
              >
                <Eye className="w-3 h-3" />
                <span>كافة المسارات</span>
              </button>

              {/* Grid Toggle */}
              <button
                onClick={() => setShowGrid((g) => !g)}
                className={`p-1.5 rounded-lg border text-xs transition-all ${
                  showGrid
                    ? "border-[#FFC400]/40 text-[#FFC400]"
                    : "border-neutral-700 text-neutral-500 hover:text-neutral-300"
                }`}
                title="شبكة الإحداثيات (Grid)"
              >
                <Crosshair className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-neutral-800" />

              {/* Zoom In */}
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                className="p-1.5 rounded-lg border-2 border-neutral-700 text-neutral-300 hover:border-[#FFC400] hover:text-[#FFC400] bg-transparent transition-all"
                title="تكبير (Zoom In)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              {/* Zoom Out */}
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.6))}
                className="p-1.5 rounded-lg border-2 border-neutral-700 text-neutral-300 hover:border-[#FFC400] hover:text-[#FFC400] bg-transparent transition-all"
                title="تصغير (Zoom Out)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              {/* Reset Zoom & Pan */}
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className="px-2.5 py-1 rounded-lg border-2 border-neutral-700 text-neutral-300 hover:border-[#FFC400] hover:text-[#FFC400] bg-transparent text-xs transition-all flex items-center gap-1"
                title="إعادة ضبط الموضع والتكبير"
              >
                <RotateCcw className="w-3 h-3" />
                إعادة ضبط
              </button>

              <span className="text-[11px] text-neutral-500 font-mono">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
          </div>

          {/* Interactive Viewer Viewport */}
          <div
            className={`flex-1 overflow-hidden relative flex items-center justify-center p-2 sm:p-4 touch-none min-h-[460px] sm:min-h-[560px] ${
              zoomLevel > 1 || panOffset.x !== 0 || panOffset.y !== 0
                ? isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-default"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Compass / Pan indicator */}
            {(panOffset.x !== 0 || panOffset.y !== 0 || zoomLevel > 1) && (
              <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-neutral-400 font-mono flex items-center gap-1.5 border border-white/10 pointer-events-none">
                <Move className="w-3 h-3 text-[#FFC400]" />
                <span>
                  X: {Math.round(panOffset.x)} | Y: {Math.round(panOffset.y)}
                </span>
              </div>
            )}

            <div
              className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-2xl transition-transform duration-75 ease-out"
              style={{
                width: "min(800px, 92vw)",
                height: "min(600px, calc(92vw * 0.75))",
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transformOrigin: "center center",
              }}
            >
              {/* PCB Base Image */}
              <img
                src={currentBoard.image}
                alt={currentBoard.name}
                className="w-full h-full object-cover filter brightness-90 contrast-110 pointer-events-none"
                draggable={false}
              />

              {/* Coordinate Grid overlay */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #FFC400 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              )}

              {/* SVG Trace Overlays */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-auto"
                viewBox="0 0 800 600"
              >
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Show All Inactive Tracks if toggled */}
                {showAllTracks &&
                  currentBoard.tracks
                    .filter((t) => t.id !== activeTrackId)
                    .map((t) => (
                      <path
                        key={`all-${t.id}`}
                        d={t.pathD}
                        fill="none"
                        stroke={t.color}
                        strokeWidth="2.5"
                        strokeOpacity="0.45"
                        strokeLinecap="round"
                        strokeDasharray="4 4"
                        className="cursor-pointer hover:stroke-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTrackId(t.id);
                        }}
                      >
                        <title>{t.name} ({t.voltage})</title>
                      </path>
                    ))}

                {/* Active Highlighted Track */}
                {activeTrack && (
                  <g>
                    {/* Glow background path */}
                    <path
                      d={activeTrack.pathD}
                      fill="none"
                      stroke={simulateFault === "short" ? "#EF4444" : activeTrack.color}
                      strokeWidth="8"
                      strokeOpacity="0.4"
                      filter="url(#glow)"
                    />
                    {/* Animated pulsed path */}
                    <path
                      d={activeTrack.pathD}
                      fill="none"
                      stroke={simulateFault === "short" ? "#EF4444" : activeTrack.color}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="8 4"
                      className="animate-pulse"
                    />

                    {/* Intermediate Waypoints */}
                    {activeTrack.waypoints?.map((wp, i) => (
                      <circle
                        key={i}
                        cx={wp.x}
                        cy={wp.y}
                        r="5"
                        fill="white"
                        stroke={activeTrack.color}
                        strokeWidth="1.5"
                        className="cursor-pointer hover:scale-125 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPin({
                            label: `نقطة قياس وسطية #${i + 1} (${activeTrack.net})`,
                            type: "waypoint",
                            voltage: activeTrack.voltage,
                            diodeValue: activeTrack.diodeValue,
                            resistanceGround: activeTrack.resistanceGround,
                            expectedState: activeTrack.expectedState,
                          });
                          if (multimeterOpen && simulateFault === "short") {
                            playBuzzer();
                          }
                        }}
                      />
                    ))}

                    {/* Start Pin */}
                    <g>
                      {activeTrack.category && (
                        <CategoryIconSVG
                          category={activeTrack.category}
                          x={activeTrack.startPoint.x}
                          y={activeTrack.startPoint.y}
                        />
                      )}
                      <circle
                        cx={activeTrack.startPoint.x}
                        cy={activeTrack.startPoint.y}
                        r="9"
                        fill="#FFC400"
                        stroke="#000"
                        strokeWidth="2"
                        className="cursor-pointer hover:scale-125 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPin({
                            label: activeTrack.startPoint.label,
                            voltage: activeTrack.voltage,
                            refNumber: activeTrack.startPoint.refNumber,
                            diodeValue: activeTrack.diodeValue,
                            resistanceGround: activeTrack.resistanceGround,
                            expectedState: activeTrack.expectedState,
                            type: "start",
                          });
                          if (multimeterOpen && simulateFault === "short") {
                            playBuzzer();
                          }
                        }}
                      >
                        <title>{`نقطة البداية: ${activeTrack.startPoint.label} — ${activeTrack.voltage}${activeTrack.startPoint.refNumber ? ` (#${activeTrack.startPoint.refNumber})` : ""}`}</title>
                      </circle>
                    </g>

                    {/* End Pin */}
                    <g>
                      {activeTrack.category && (
                        <CategoryIconSVG
                          category={activeTrack.category}
                          x={activeTrack.endPoint.x}
                          y={activeTrack.endPoint.y}
                        />
                      )}
                      <circle
                        cx={activeTrack.endPoint.x}
                        cy={activeTrack.endPoint.y}
                        r="9"
                        fill="#10B981"
                        stroke="#000"
                        strokeWidth="2"
                        className="cursor-pointer hover:scale-125 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPin({
                            label: activeTrack.endPoint.label,
                            voltage: activeTrack.voltage,
                            refNumber: activeTrack.endPoint.refNumber,
                            diodeValue: activeTrack.diodeValue,
                            resistanceGround: activeTrack.resistanceGround,
                            expectedState: activeTrack.expectedState,
                            type: "end",
                          });
                          if (multimeterOpen && simulateFault === "short") {
                            playBuzzer();
                          }
                        }}
                      >
                        <title>{`نقطة النهاية: ${activeTrack.endPoint.label}${activeTrack.endPoint.refNumber ? ` (#${activeTrack.endPoint.refNumber})` : ""}`}</title>
                      </circle>
                    </g>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="border-t border-[#1E1E1E] bg-[#141414] px-5 py-3 space-y-2">
            {/* Pin types */}
            <div className="flex items-center gap-4 flex-wrap text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-full border border-black"
                  style={{ backgroundColor: "#FFC400" }}
                />
                نقطة بداية (Source)
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-full border border-black"
                  style={{ backgroundColor: "#10B981" }}
                />
                نقطة نهاية (Target IC)
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-full border border-neutral-500"
                  style={{ backgroundColor: "white" }}
                />
                نقطة فحص وسطية (Testpoint)
              </span>
            </div>

            {/* Category colors */}
            <div className="flex items-center gap-3 flex-wrap">
              {(Object.entries(CATEGORY_CONFIG) as [TrackCategory, (typeof CATEGORY_CONFIG)[TrackCategory]][]).map(
                ([cat, cfg]) => (
                  <span key={cat} className="flex items-center gap-1 text-[10px]">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: cfg.color }}
                    />
                    <span style={{ color: cfg.color }}>{cfg.label}</span>
                  </span>
                )
              )}
            </div>
          </div>

          <div className="text-[11px] text-neutral-400 text-center pb-3 flex items-center justify-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#FFC400]" />
            <span>اسحب بالماوس أو الإصبع للتحريك بحرية عند التكبير • اضغط على أي نقطة لاختبار الممانعة والجهد</span>
          </div>
        </div>
      </div>
      {/* ── Custom Board Upload Modal ─────────────────────────────────────── */}
      {uploadModalOpen && (
        <CustomBoardUploadModal
          onClose={() => setUploadModalOpen(false)}
          onSave={handleSaveCustomBoard}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Board & Schematic Upload Modal Component
// ─────────────────────────────────────────────────────────────────────────────
interface CustomBoardUploadModalProps {
  onClose: () => void;
  onSave: (board: BoardModelConfig) => void;
}

function CustomBoardUploadModal({ onClose, onSave }: CustomBoardUploadModalProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState<"Samsung" | "Xiaomi" | "Apple" | "Tecno" | "Other">("Samsung");
  const [chipset, setChipset] = useState("");
  const [year, setYear] = useState(2024);
  const [imageType, setImageType] = useState<"upload" | "generic" | "url">("upload");
  const [uploadedImageData, setUploadedImageData] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"quick" | "json">("quick");

  // Quick tracks builder
  const [quickTracks, setQuickTracks] = useState<BoardTrack[]>([
    {
      id: "tr-vbus-custom",
      name: "مسار شحن رئيسي VBUS 5V",
      net: "VBUS_5V_IN",
      voltage: "5.0V",
      color: "#EF4444",
      pathD: "M 160 540 L 160 360 L 340 360",
      startPoint: { x: 160, y: 540, label: "موصل الشحن Sub-FPC", refNumber: "CON1", type: "connector", voltage: "5.0V" },
      endPoint: { x: 340, y: 360, label: "شريحة الشحن Charger IC", refNumber: "U1", type: "IC", voltage: "5.0V" },
      category: "power",
      diodeValue: "0.520V",
      resistanceGround: "480Ω",
      expectedState: "5V ثابت عند توصيل الشاحن",
      symptoms: ["عدم الإحساس بالشاحن", "هبوط شحن البطارية"],
    },
    {
      id: "tr-vsys-custom",
      name: "خط جهد النظام الرئيسي VSYS",
      net: "VSYS_PWR",
      voltage: "3.7V - 4.2V",
      color: "#F59E0B",
      pathD: "M 340 360 L 480 360 L 480 220 L 580 220",
      startPoint: { x: 340, y: 360, label: "ملف الشحن الرئيسي L1", refNumber: "L1", type: "component", voltage: "4.0V" },
      endPoint: { x: 580, y: 220, label: "آيسي الباور الرئيسي PMIC", refNumber: "U2", type: "IC", voltage: "4.0V" },
      category: "power",
      diodeValue: "0.340V",
      resistanceGround: "12Ω",
      expectedState: "جهد البطارية دائماً",
      symptoms: ["الجهاز ميت تماماً", "شورت صريح عند ربط البطارية"],
    },
  ]);

  // JSON mode
  const [jsonInput, setJsonInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setUploadedImageData(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddQuickTrack = () => {
    const newId = `tr-custom-${Date.now()}`;
    const newTrack: BoardTrack = {
      id: newId,
      name: "مسار فحص جديد",
      net: "NET_" + Math.floor(Math.random() * 1000),
      voltage: "1.8V",
      color: "#3B82F6",
      pathD: "M 580 220 L 680 220 L 680 480",
      startPoint: { x: 580, y: 220, label: "نقطة انطلاق (Source)", refNumber: "TP1", type: "testpoint", voltage: "1.8V" },
      endPoint: { x: 680, y: 480, label: "نقطة وصول (Target)", refNumber: "CON2", type: "connector", voltage: "1.8V" },
      category: "display",
      diodeValue: "0.450V",
      resistanceGround: "OL",
      expectedState: "1.8V منطقي",
      symptoms: ["عطل في الدائرة المرتبطة"],
    };
    setQuickTracks([...quickTracks, newTrack]);
  };

  const handleRemoveTrack = (index: number) => {
    setQuickTracks(quickTracks.filter((_, i) => i !== index));
  };

  const handleUpdateTrack = (index: number, field: keyof BoardTrack, val: any) => {
    const copy = [...quickTracks];
    copy[index] = { ...copy[index], [field]: val };
    setQuickTracks(copy);
  };

  const handleLoadSampleJson = () => {
    const sample = JSON.stringify(quickTracks, null, 2);
    setJsonInput(sample);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("يرجى كتابة اسم موديل الهاتف أو البوردة");
      return;
    }

    let boardImage = "/boards/_generic_pcb.jpg";
    if (imageType === "upload" && uploadedImageData) {
      boardImage = uploadedImageData;
    } else if (imageType === "url" && imageUrl.trim()) {
      boardImage = imageUrl.trim();
    }

    let finalTracks: BoardTrack[] = quickTracks;
    if (activeTab === "json" && jsonInput.trim()) {
      try {
        const parsed = JSON.parse(jsonInput.trim());
        if (Array.isArray(parsed)) {
          finalTracks = parsed;
        } else {
          setErrorMsg("بيانات JSON يجب أن تكون مصفوفة مسارات [ { ... } ]");
          return;
        }
      } catch (err) {
        setErrorMsg("صيغة JSON غير صحيحة، تأكد من إغلاق الأقواس والفواصل");
        return;
      }
    }

    const customId = `custom-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`;
    const newBoard: BoardModelConfig = {
      id: customId,
      name: `${name.trim()} (مخصص)`,
      brand,
      chipset: chipset.trim() || "غير محدد",
      year: Number(year) || 2024,
      image: boardImage,
      tags: [name, brand, "Custom", "Uploaded"],
      tracks: finalTracks,
    };

    onSave(newBoard);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-[#101010] border-2 border-blue-500/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(59,130,246,0.25)] p-5 sm:p-7 overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>رفع وإضافة كروكي بوردة أو مخطط مخصص</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                  CUSTOM BRD
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                أدخل بيانات الموديل، وارفع صورة البوردة مع مسارات الفحص ليتم حفظها وتفعيلها في الملتيميتر والعارض فوراً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">اسم الموديل الكامل *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: Samsung Galaxy S24 Ultra"
                className="w-full bg-[#181818] border border-neutral-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-600 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">الماركة المصنعة</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as any)}
                className="w-full bg-[#181818] border border-neutral-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition-all"
              >
                <option value="Samsung">Samsung</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Apple">Apple</option>
                <option value="Tecno">Tecno</option>
                <option value="Other">Honor / Infinix / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">المعالج الرئيسي (Chipset)</label>
              <input
                type="text"
                value={chipset}
                onChange={(e) => setChipset(e.target.value)}
                placeholder="مثال: Snapdragon 8 Gen 3 أو Helio G99"
                className="w-full bg-[#181818] border border-neutral-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">سنة الإصدار</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min="2015"
                max="2026"
                className="w-full bg-[#181818] border border-neutral-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition-all"
              />
            </div>
          </div>

          {/* Section 2: Board Image */}
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-4 space-y-3">
            <label className="block text-xs font-black text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>صورة اللوحة الأم (Motherboard PCB Image)</span>
            </label>

            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setImageType("upload")}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  imageType === "upload"
                    ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    : "border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                رفع من الجهاز (PNG/JPG)
              </button>
              <button
                type="button"
                onClick={() => setImageType("generic")}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  imageType === "generic"
                    ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    : "border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                استخدام قالب PCB عالي الدقة
              </button>
              <button
                type="button"
                onClick={() => setImageType("url")}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  imageType === "url"
                    ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    : "border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                رابط صورة خارجي (URL)
              </button>
            </div>

            {imageType === "upload" && (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="w-full text-xs text-neutral-400 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
                {uploadedImageData && (
                  <div className="w-16 h-16 rounded-xl border border-blue-500/50 overflow-hidden bg-black shrink-0">
                    <img src={uploadedImageData} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {imageType === "url" && (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/pcb-board.jpg"
                className="w-full bg-[#181818] border border-neutral-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 outline-none"
              />
            )}

            {imageType === "generic" && (
              <p className="text-[11px] text-neutral-400">
                ✓ سيتم استخدام خلفية بوردة إلكترونية احترافية عالية الدقة 4K مع مسارات افتراضية جاهزة.
              </p>
            )}
          </div>

          {/* Section 3: Interactive Tracks */}
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFC400]" />
                <span>مسارات الفحص التفاعلية ونقاط القياس (Traces & Diode Values)</span>
              </label>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("quick")}
                  className={`px-2.5 py-1 rounded-lg border font-bold transition-all ${
                    activeTab === "quick"
                      ? "bg-[#FFC400] text-black border-[#FFC400]"
                      : "border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  البناء السريع ({quickTracks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("json")}
                  className={`px-2.5 py-1 rounded-lg border font-bold transition-all ${
                    activeTab === "json"
                      ? "bg-[#FFC400] text-black border-[#FFC400]"
                      : "border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  استيراد كود JSON / BRD
                </button>
              </div>
            </div>

            {activeTab === "quick" ? (
              <div className="space-y-3">
                <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
                  {quickTracks.map((tr, idx) => (
                    <div
                      key={tr.id}
                      className="p-3 rounded-xl bg-black/40 border border-neutral-800/80 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={tr.name}
                            onChange={(e) => handleUpdateTrack(idx, "name", e.target.value)}
                            placeholder="اسم المسار (مثل: خط الشحن VBUS)"
                            className="bg-[#181818] border border-neutral-800 rounded-lg px-2.5 py-1 text-white font-bold flex-1"
                          />
                          <input
                            type="text"
                            value={tr.net}
                            onChange={(e) => handleUpdateTrack(idx, "net", e.target.value)}
                            placeholder="الاسم الفني Net"
                            className="bg-[#181818] border border-neutral-800 rounded-lg px-2 py-1 text-neutral-300 font-mono w-28 text-[11px]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTrack(idx)}
                          className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors"
                          title="حذف المسار"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div>
                          <span className="text-neutral-500 block mb-0.5">الجهد:</span>
                          <input
                            type="text"
                            value={tr.voltage}
                            onChange={(e) => handleUpdateTrack(idx, "voltage", e.target.value)}
                            className="w-full bg-[#181818] border border-neutral-800 rounded px-2 py-1 text-white font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-neutral-500 block mb-0.5">قيمة الدايود:</span>
                          <input
                            type="text"
                            value={tr.diodeValue || "0.520V"}
                            onChange={(e) => handleUpdateTrack(idx, "diodeValue", e.target.value)}
                            className="w-full bg-[#181818] border border-neutral-800 rounded px-2 py-1 text-[#FFC400] font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-neutral-500 block mb-0.5">المقاومة للأرضي:</span>
                          <input
                            type="text"
                            value={tr.resistanceGround || "480Ω"}
                            onChange={(e) => handleUpdateTrack(idx, "resistanceGround", e.target.value)}
                            className="w-full bg-[#181818] border border-neutral-800 rounded px-2 py-1 text-white font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-neutral-500 block mb-0.5">الفئة:</span>
                          <select
                            value={tr.category}
                            onChange={(e) => handleUpdateTrack(idx, "category", e.target.value)}
                            className="w-full bg-[#181818] border border-neutral-800 rounded px-1.5 py-1 text-white"
                          >
                            <option value="power">باور</option>
                            <option value="display">شاشة</option>
                            <option value="memory">ذاكرة</option>
                            <option value="rf">RF</option>
                            <option value="audio">صوت</option>
                            <option value="camera">كاميرا</option>
                            <option value="cpu">معالج</option>
                            <option value="peripheral">ملحقات</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddQuickTrack}
                  className="w-full py-2 rounded-xl border border-dashed border-neutral-700 hover:border-[#FFC400] text-neutral-400 hover:text-[#FFC400] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة مسار فحص ونقطة ملتيميتر جديدة</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">الصق مصفوفة المسارات بصيغة JSON:</span>
                  <button
                    type="button"
                    onClick={handleLoadSampleJson}
                    className="text-[#FFC400] hover:underline flex items-center gap-1 font-bold"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>تحميل نموذج تجريبي</span>
                  </button>
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="[ { id: 'tr-1', name: 'VBUS', voltage: '5V', diodeValue: '0.520V', ... } ]"
                  rows={7}
                  className="w-full bg-[#181818] border border-neutral-800 focus:border-[#FFC400] rounded-xl p-3 text-xs font-mono text-emerald-400 outline-none"
                />
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white font-bold text-xs transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>حفظ وعرض في المخططات فوراً</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

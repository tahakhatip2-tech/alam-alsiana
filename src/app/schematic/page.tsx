"use client";

import { useState } from "react";

interface BoardTrack {
  id: string;
  name: string;
  net: string;
  voltage: string;
  color: string;
  pathD: string;
  startPoint: { x: number; y: number; label: string };
  endPoint: { x: number; y: number; label: string };
}

interface BoardModelConfig {
  id: string;
  name: string;
  brand: string;
  image: string;
  tracks: BoardTrack[];
}

const BOARDS_CONFIG: BoardModelConfig[] = [
  {
    id: "a12",
    name: "Samsung Galaxy A12 (SM-A125F)",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    tracks: [
      {
        id: "tr-vbus-a12",
        name: "مسار الشحن الرئيسي VBUS (5V)",
        net: "VBUS_5V_IN",
        voltage: "5.0V",
        color: "#EF4444",
        pathD: "M 150 550 L 150 380 L 320 380 L 320 240",
        startPoint: { x: 150, y: 550, label: "سوكت الشحن Sub-FPC" },
        endPoint: { x: 320, y: 240, label: "آيسي الشحن S2MU106" },
      },
      {
        id: "tr-vsys-a12",
        name: "مسار فولتية النظام VSYS / VPH_PWR",
        net: "VPH_PWR",
        voltage: "3.7V - 4.2V",
        color: "#F59E0B",
        pathD: "M 320 240 L 450 240 L 450 180 L 580 180",
        startPoint: { x: 320, y: 240, label: "ملف الشحن L5001" },
        endPoint: { x: 580, y: 180, label: "آيسي الباور الرئيسي PMIC" },
      },
      {
        id: "tr-lcd-a12",
        name: "مسار إضاءة الشاشة LED_ANODE",
        net: "LED_A_30V",
        voltage: "20V - 30V",
        color: "#3B82F6",
        pathD: "M 580 400 L 680 400 L 680 520",
        startPoint: { x: 580, y: 400, label: "ديود وملف الإضاءة" },
        endPoint: { x: 680, y: 520, label: "كونكتر الشاشة LCD FPC" },
      },
    ],
  },
  {
    id: "a32",
    name: "Samsung Galaxy A32 (SM-A325F)",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&auto=format&fit=crop&q=80",
    tracks: [
      {
        id: "tr-vbus-a32",
        name: "خط VBUS إلى Sub-PMIC",
        net: "USB_VBUS",
        voltage: "5.0V - 9.0V",
        color: "#EF4444",
        pathD: "M 180 520 L 180 340 L 380 340",
        startPoint: { x: 180, y: 520, label: "كونكتر الفلاتة السفلية" },
        endPoint: { x: 380, y: 340, label: "آيسي MT6358W" },
      },
      {
        id: "tr-amoled-a32",
        name: "تغذية شاشة الأموليد VDD_EL",
        net: "AMOLED_ELVDD",
        voltage: "+4.6V / -4.0V",
        color: "#10B981",
        pathD: "M 380 340 L 500 340 L 500 480",
        startPoint: { x: 380, y: 340, label: "آيسي درايفر الأموليد" },
        endPoint: { x: 500, y: 480, label: "سوكت الشاشة" },
      },
    ],
  },
  {
    id: "note11",
    name: "Xiaomi Redmi Note 11 (2201117TG)",
    brand: "Xiaomi",
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=1200&auto=format&fit=crop&q=80",
    tracks: [
      {
        id: "tr-vbus-rn11",
        name: "مسار الشحن السريع كوالكوم",
        net: "VBUS_QC",
        voltage: "5V / 9V / 11V",
        color: "#EF4444",
        pathD: "M 200 500 L 200 300 L 420 300",
        startPoint: { x: 200, y: 500, label: "مدخل Type-C" },
        endPoint: { x: 420, y: 300, label: "آيسي كوالكوم PM6225" },
      },
    ],
  },
];

export default function SchematicPage() {
  const [selectedBoardId, setSelectedBoardId] = useState("a12");
  const [activeTrackId, setActiveTrackId] = useState<string>("tr-vbus-a12");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  const currentBoard =
    BOARDS_CONFIG.find((b) => b.id === selectedBoardId) || BOARDS_CONFIG[0];
  const activeTrack = currentBoard.tracks.find((t) => t.id === activeTrackId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 flex-1 w-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
            <span>الباب الثاني 🚪</span>
            <span>ZXW Killer - المخطط الذكي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>🗺️ عارض اللوحات وتتبع المسارات</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            اختر اللوحة وتتبع مسارات الشحن والتغذية (SVG Overlay) بنقرة واحدة فوق صورة الـ PCB الحقيقية
          </p>
        </div>

        {/* Board Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {BOARDS_CONFIG.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBoardId(b.id);
                setActiveTrackId(b.tracks[0]?.id || "");
                setSelectedPin(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedBoardId === b.id
                  ? "bg-[#FFC400] text-black shadow-[0_0_15px_rgba(255,196,0,0.3)]"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Left/Sidebar: Tracks & Component inspector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#121212] border border-[#222] rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center justify-between">
              <span>مسارات اللوحة (Nets)</span>
              <span className="text-[10px] text-neutral-500">{currentBoard.tracks.length} مسارات</span>
            </h2>

            <div className="space-y-2">
              {currentBoard.tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setActiveTrackId(track.id);
                    setSelectedPin(null);
                  }}
                  className={`w-full text-right p-3 rounded-xl border transition-all text-xs space-y-1 block ${
                    activeTrackId === track.id
                      ? "bg-neutral-800 border-[#FFC400] text-white shadow-md"
                      : "bg-[#181818] border-neutral-800 text-neutral-300 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{track.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: track.color }}
                    ></span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{track.net}</span>
                    <span className="font-mono text-[#FFC400]">{track.voltage}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Track Details Box */}
          {activeTrack && (
            <div className="bg-[#141414] border border-[#282828] rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-neutral-400">
                🔍 تفاصيل المسار المحدد:
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-neutral-800">
                  <span className="text-neutral-400">نقطة البداية:</span>
                  <span className="font-bold text-white">{activeTrack.startPoint.label}</span>
                </div>
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-neutral-800">
                  <span className="text-neutral-400">نقطة النهاية:</span>
                  <span className="font-bold text-emerald-400">{activeTrack.endPoint.label}</span>
                </div>
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-neutral-800">
                  <span className="text-neutral-400">الجهد المتوقع:</span>
                  <span className="font-bold font-mono text-[#FFC400]">{activeTrack.voltage}</span>
                </div>
              </div>
            </div>
          )}

          {/* Pin Inspector feedback */}
          {selectedPin && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-xs space-y-1">
              <span className="text-emerald-400 font-bold block">تم تحديد النقطة:</span>
              <p className="text-neutral-200">{selectedPin}</p>
            </div>
          )}
        </div>

        {/* Right: The Interactive PCB Canvas Area */}
        <div className="lg:col-span-3 bg-[#0D0D0D] border border-[#222] rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative min-h-[550px]">
          {/* Controls bar */}
          <div className="flex items-center justify-between z-10 bg-neutral-900/80 backdrop-blur px-4 py-2 rounded-xl border border-neutral-800 mb-3">
            <span className="text-xs text-neutral-300 font-bold">
              {currentBoard.name}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
              >
                -
              </button>
              <span className="text-xs font-mono text-neutral-400 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
              >
                إعادة ضبط
              </button>
            </div>
          </div>

          {/* Interactive Viewer Viewport */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <div
              className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-2xl transition-transform duration-200"
              style={{
                width: "800px",
                height: "600px",
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center center",
              }}
            >
              {/* PCB Base Image */}
              <img
                src={currentBoard.image}
                alt={currentBoard.name}
                className="w-full h-full object-cover filter brightness-75 contrast-125"
              />

              {/* Grid overlay for technical schematic look */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #FFC400 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {/* SVG Trace Overlays */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-auto"
                viewBox="0 0 800 600"
              >
                {/* Glow filter */}
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Render active track */}
                {activeTrack && (
                  <g>
                    {/* Shadow/Glow path */}
                    <path
                      d={activeTrack.pathD}
                      fill="none"
                      stroke={activeTrack.color}
                      strokeWidth="8"
                      strokeOpacity="0.4"
                      filter="url(#glow)"
                    />
                    {/* Core animated trace path */}
                    <path
                      d={activeTrack.pathD}
                      fill="none"
                      stroke={activeTrack.color}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="8 4"
                      className="animate-pulse"
                    />

                    {/* Start Pin */}
                    <circle
                      cx={activeTrack.startPoint.x}
                      cy={activeTrack.startPoint.y}
                      r="9"
                      fill="#FFC400"
                      stroke="#000"
                      strokeWidth="2"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      onClick={() =>
                        setSelectedPin(
                          `نقطة البداية: ${activeTrack.startPoint.label} (فولت: ${activeTrack.voltage})`
                        )
                      }
                    />

                    {/* End Pin */}
                    <circle
                      cx={activeTrack.endPoint.x}
                      cy={activeTrack.endPoint.y}
                      r="9"
                      fill="#10B981"
                      stroke="#000"
                      strokeWidth="2"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      onClick={() =>
                        setSelectedPin(
                          `نقطة النهاية: ${activeTrack.endPoint.label} (مستقبل الإشارة)`
                        )
                      }
                    />
                  </g>
                )}
              </svg>
            </div>
          </div>

          <div className="text-[11px] text-neutral-400 text-center pt-2">
            💡 انقر على الدوائر الصفراء والخضراء لفحص نقطة التوصيل وتتبع الجهد
          </div>
        </div>
      </div>
    </div>
  );
}

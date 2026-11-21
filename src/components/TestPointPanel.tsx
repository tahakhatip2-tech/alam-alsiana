"use client";

import { useState, useEffect } from "react";
import {
  X,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Target,
  Info,
  Youtube,
} from "lucide-react";
import {
  type TestPointEntry,
  DIFFICULTY_CONFIG,
  MODE_CONFIG,
} from "@/lib/testpoint-data";

// ─── SVG Board Diagram Component ─────────────────────────────────
function BoardDiagram({ entry }: { entry: TestPointEntry }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pulse, setPulse] = useState(true);

  // Pulse animation for primary pin
  useEffect(() => {
    const timer = setInterval(() => setPulse((p) => !p), 900);
    return () => clearInterval(timer);
  }, []);

  const vb = `0 0 ${entry.boardWidth} ${entry.boardHeight}`;

  return (
    <div className="relative">
      {/* Board label */}
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-[#FFC400]" />
        <span className="text-xs font-black text-neutral-300">خريطة نقاط التيست بوينت</span>
        <span className="text-[10px] text-neutral-600">— مخطط تخطيطي تقريبي</span>
      </div>

      <div className="rounded-2xl border border-[#2b2b2b] overflow-hidden bg-[#0a0a0a]">
        <svg
          viewBox={vb}
          className="w-full"
          style={{ maxHeight: 320 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Board background */}
          <rect x="10" y="10" width={entry.boardWidth - 20} height={entry.boardHeight - 20}
            rx="12" ry="12"
            fill={entry.boardColor}
            stroke="#2b2b2b"
            strokeWidth="1.5"
          />

          {/* Grid pattern */}
          <defs>
            <pattern id="tp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
            <filter id="tp-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x="10" y="10" width={entry.boardWidth - 20} height={entry.boardHeight - 20}
            rx="12" ry="12" fill="url(#tp-grid)"
          />

          {/* Board chips (decorative) */}
          <rect x="30" y="80" width="60" height="40" rx="4" fill="#1a2a1a" stroke="#2d3d2d" strokeWidth="1" />
          <text x="60" y="104" textAnchor="middle" fill="#4a6a4a" fontSize="6" fontFamily="monospace">CPU</text>

          <rect x="210" y="60" width="50" height="30" rx="4" fill="#1a1a2a" stroke="#2d2d3d" strokeWidth="1" />
          <text x="235" y="78" textAnchor="middle" fill="#4a4a6a" fontSize="6" fontFamily="monospace">PMIC</text>

          <rect x="150" y="140" width="40" height="25" rx="3" fill="#2a1a1a" stroke="#3d2d2d" strokeWidth="1" />
          <text x="170" y="156" textAnchor="middle" fill="#6a4a4a" fontSize="5" fontFamily="monospace">RAM</text>

          <rect x="80" y="200" width="45" height="30" rx="3" fill="#1a1a2a" stroke="#2d2d3d" strokeWidth="1" />
          <text x="102" y="218" textAnchor="middle" fill="#4a4a6a" fontSize="5" fontFamily="monospace">eMMC</text>

          {/* USB connector at bottom */}
          <rect
            x={entry.boardWidth / 2 - 20}
            y={entry.boardHeight - 30}
            width="40" height="16"
            rx="3"
            fill="#222"
            stroke="#444"
            strokeWidth="1"
          />
          <text
            x={entry.boardWidth / 2}
            y={entry.boardHeight - 18}
            textAnchor="middle"
            fill="#666"
            fontSize="5"
            fontFamily="monospace"
          >USB-C</text>

          {/* Connection line between pins */}
          {entry.pins.length >= 2 && (() => {
            const p1 = entry.pins[0];
            const p2 = entry.pins[1];
            const x1 = (p1.x / 100) * (entry.boardWidth - 20) + 10;
            const y1 = (p1.y / 100) * (entry.boardHeight - 20) + 10;
            const x2 = (p2.x / 100) * (entry.boardWidth - 20) + 10;
            const y2 = (p2.y / 100) * (entry.boardHeight - 20) + 10;
            return (
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#FFC400"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.5"
              />
            );
          })()}

          {/* Pins */}
          {entry.pins.map((pin) => {
            const cx = (pin.x / 100) * (entry.boardWidth - 20) + 10;
            const cy = (pin.y / 100) * (entry.boardHeight - 20) + 10;
            const isHovered = hovered === pin.id;
            const isPrimary = pin.isPrimary;
            const r = isPrimary ? 10 : 7;

            return (
              <g key={pin.id}
                onMouseEnter={() => setHovered(pin.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Outer pulse ring for primary */}
                {isPrimary && (
                  <circle
                    cx={cx} cy={cy}
                    r={pulse ? r + 8 : r + 4}
                    fill="none"
                    stroke={pin.color}
                    strokeWidth="1"
                    opacity={pulse ? 0.3 : 0.1}
                    style={{ transition: "all 0.9s ease" }}
                  />
                )}

                {/* Glow */}
                {(isPrimary || isHovered) && (
                  <circle cx={cx} cy={cy} r={r + 4}
                    fill={pin.color}
                    opacity="0.15"
                    filter="url(#tp-glow)"
                  />
                )}

                {/* Main circle */}
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={isHovered ? pin.color : `${pin.color}33`}
                  stroke={pin.color}
                  strokeWidth={isPrimary ? 2 : 1.5}
                />

                {/* Label */}
                <text
                  x={cx} y={cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHovered ? "#000" : pin.color}
                  fontSize="5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {pin.label.length > 6 ? pin.label.slice(0, 6) : pin.label}
                </text>

                {/* Tooltip */}
                {isHovered && pin.description && (
                  <g>
                    <rect
                      x={cx > entry.boardWidth / 2 ? cx - 100 : cx + r + 4}
                      y={cy - 15}
                      width="96" height="28"
                      rx="4"
                      fill="#1a1a1a"
                      stroke={pin.color}
                      strokeWidth="0.8"
                      opacity="0.95"
                    />
                    <foreignObject
                      x={cx > entry.boardWidth / 2 ? cx - 99 : cx + r + 5}
                      y={cy - 14}
                      width="94" height="26"
                    >
                      <div
                        // @ts-ignore
                        xmlns="http://www.w3.org/1999/xhtml"
                        style={{
                          fontSize: "5px",
                          color: "#ccc",
                          fontFamily: "sans-serif",
                          lineHeight: "1.4",
                          padding: "2px",
                          direction: "rtl",
                          wordBreak: "break-word",
                        }}
                      >
                        {pin.description}
                      </div>
                    </foreignObject>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Pin legend */}
        <div className="border-t border-[#1a1a1a] px-3 py-2 flex flex-wrap gap-3">
          {entry.pins.map((pin) => (
            <div key={pin.id} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: `${pin.color}33`, borderColor: pin.color }}
              />
              <span className="text-[10px] font-mono text-neutral-400">{pin.label}</span>
              {pin.isPrimary && (
                <span className="text-[9px] text-red-400 font-black">★ رئيسية</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[9px] text-neutral-600 mt-1.5 text-center">
        ⚠️ المخطط تقريبي للتوضيح — راجع مخطط البوردة الأصلي للموديل قبل أي عملية
      </p>
    </div>
  );
}

// ─── Main TestPoint Panel ─────────────────────────────────────────
interface TestPointPanelProps {
  entry: TestPointEntry;
  onClose: () => void;
  onViewSchematic?: () => void;
}

export default function TestPointPanel({
  entry,
  onClose,
  onViewSchematic,
}: TestPointPanelProps) {
  const [openStep, setOpenStep] = useState<number | null>(null);
  const diff = DIFFICULTY_CONFIG[entry.difficulty];
  const mode = MODE_CONFIG[entry.mode];

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div
        className="w-full sm:max-w-3xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#0d0d0d] border border-[#2b2b2b] shadow-[0_0_80px_rgba(255,196,0,0.15)]"
        dir="rtl"
      >
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-[#0d0d0d]/95 backdrop-blur border-b border-[#1a1a1a] px-4 sm:px-6 py-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {/* Mode badge */}
              <span
                className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${mode.color}`}
              >
                {mode.icon} {mode.label}
              </span>
              {/* Difficulty badge */}
              <span
                className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${diff.color}`}
              >
                {diff.label}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white truncate">
              نقطة التيست بوينت — {entry.modelName}
            </h2>
            {entry.modelNumber && (
              <span className="text-xs font-mono text-neutral-500">
                {entry.modelNumber} · {entry.chipset}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-9 h-9 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#2b2b2b] flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-4 sm:p-6 space-y-5">

          {/* Success indicator */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-green-500/5 border border-green-500/20">
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-black text-green-400 mb-0.5">مؤشر النجاح</div>
              <p className="text-xs text-green-200/70 leading-relaxed">{entry.successIndicator}</p>
            </div>
          </div>

          {/* Two-column layout on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Left: Board diagram */}
            <div>
              <BoardDiagram entry={entry} />

              {/* Required tools */}
              {entry.requiredTools && entry.requiredTools.length > 0 && (
                <div className="mt-4 rounded-2xl border border-[#2b2b2b] bg-[#0f0f0f] p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Wrench className="w-4 h-4 text-[#FFC400]" />
                    <span className="text-xs font-black text-neutral-300">الأدوات المطلوبة</span>
                  </div>
                  <ul className="space-y-1.5">
                    {entry.requiredTools.map((tool, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#FFC400] text-xs mt-0.5">•</span>
                        <span className="text-xs text-neutral-300">{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Steps + Warnings */}
            <div className="space-y-4">

              {/* Step-by-step */}
              <div className="rounded-2xl border border-[#2b2b2b] bg-[#0f0f0f] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-[#FFC400]" />
                  <span className="text-xs font-black text-neutral-300">خطوات العملية</span>
                </div>
                <div className="space-y-1.5">
                  {entry.steps.map((step, i) => {
                    const isOpen = openStep === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setOpenStep(isOpen ? null : i)}
                        className={`w-full text-right flex items-start gap-2.5 p-2.5 rounded-xl border transition-all text-xs ${
                          isOpen
                            ? "bg-[#FFC400]/10 border-[#FFC400]/30 text-[#FFC400]"
                            : "bg-[#141414] border-[#1e1e1e] text-neutral-300 hover:border-[#2b2b2b]"
                        }`}
                      >
                        <span
                          className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                            isOpen ? "bg-[#FFC400] text-black" : "bg-[#1e1e1e] text-neutral-400"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="flex-1 leading-relaxed">{step}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 transition-transform ${
                            isOpen ? "rotate-90 text-[#FFC400]" : "text-neutral-600"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Warnings */}
              {entry.warnings && entry.warnings.length > 0 && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black text-amber-400">تحذيرات مهمة</span>
                  </div>
                  <ul className="space-y-1.5">
                    {entry.warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-amber-200/70">
                        <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              {entry.notes && (
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-200/70 leading-relaxed">{entry.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-1 border-t border-[#1a1a1a]">
            {/* YouTube search */}
            {entry.youtubeSearch && (
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(entry.youtubeSearch)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 hover:border-red-500/60 text-xs font-bold text-red-400 hover:text-red-300 transition-all"
              >
                <Youtube className="w-4 h-4" />
                شرح فيديو على يوتيوب
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}

            {/* View full schematic */}
            {onViewSchematic && entry.schematicId && (
              <button
                onClick={onViewSchematic}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFC400]/10 hover:bg-[#FFC400]/20 border border-[#FFC400]/30 hover:border-[#FFC400]/60 text-xs font-bold text-[#FFC400] transition-all"
              >
                <Zap className="w-4 h-4" />
                فتح مخطط البوردة الكامل
                <ExternalLink className="w-3 h-3 opacity-70" />
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="mr-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#222] border border-[#2b2b2b] text-xs font-bold text-neutral-300 hover:text-white transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

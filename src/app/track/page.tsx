"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { VaultRecord } from "@/app/api/vault/route";

/* ─── Status Config ─────────────────────────────────────── */
const STATUS_MAP = {
  RECEIVED: {
    label: "تم الاستلام",
    labelEn: "Received",
    icon: "📥",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    step: 0,
  },
  IN_PROGRESS: {
    label: "قيد الفحص والإصلاح",
    labelEn: "In Progress",
    icon: "⚙️",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]",
    step: 1,
  },
  DONE: {
    label: "جاهز للاستلام ✅",
    labelEn: "Ready for Pickup",
    icon: "✅",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.25)]",
    step: 2,
  },
  DELIVERED: {
    label: "تم التسليم",
    labelEn: "Delivered",
    icon: "🏁",
    color: "text-neutral-400",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/30",
    glow: "",
    step: 3,
  },
} as const;

const STEPS = [
  { key: "RECEIVED", label: "تم الاستلام", icon: "📥", desc: "وصل جهازك للورشة وتم توثيق حالته" },
  { key: "IN_PROGRESS", label: "قيد الفحص", icon: "⚙️", desc: "الفني يعمل على تشخيص وإصلاح جهازك" },
  { key: "DONE", label: "جاهز للاستلام", icon: "✅", desc: "اكتمل الإصلاح — تفضل لاستلام جهازك" },
];

function TrackContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const imei = searchParams.get("imei");

  const [device, setDevice] = useState<VaultRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!id && !imei) { setLoading(false); setError(true); return; }
    const query = id ? `id=${id}` : `imei=${imei}`;
    fetch(`/api/vault?${query}`)
      .then((r) => r.json())
      .then((j) => {
        const data = Array.isArray(j.data) ? j.data[0] : j.data;
        if (data) setDevice(data); else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id, imei]);

  useEffect(() => {
    if (device?.status === "DONE") {
      const t = setInterval(() => setPulse((p) => !p), 1200);
      return () => clearInterval(t);
    }
  }, [device?.status]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#FFC400]/20 border-t-[#FFC400] animate-spin" />
          <div className="absolute inset-3 rounded-full bg-[#FFC400]/10 animate-pulse" />
        </div>
        <p className="text-neutral-400 text-sm animate-pulse">جارِ جلب بيانات جهازك...</p>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="bg-[#141414] border border-red-500/20 rounded-2xl p-10 text-center space-y-4">
        <span className="text-5xl block">🔍</span>
        <h2 className="text-lg font-black text-white">لم يتم العثور على الجهاز</h2>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
          يرجى التأكد من مسح الـ QR الصحيح الموجود على وصل الاستلام، أو تواصل مع الورشة مباشرة.
        </p>
        <Link
          href="/"
          className="inline-block mt-2 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2 rounded-xl transition-colors"
        >
          الرئيسية
        </Link>
      </div>
    );
  }

  const statusCfg = STATUS_MAP[device.status as keyof typeof STATUS_MAP] ?? STATUS_MAP.RECEIVED;
  const currentStep = statusCfg.step;
  const isDone = device.status === "DONE" || device.status === "DELIVERED";

  return (
    <div className="space-y-5">
      {/* ── Status Hero Card ── */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 ${statusCfg.bg} ${statusCfg.border} ${statusCfg.glow} transition-all duration-700`}>
        {isDone && (
          <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-500/20 blur-3xl transition-opacity duration-1000 ${pulse ? "opacity-100" : "opacity-30"}`} />
        )}
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-neutral-400 font-medium">حالة جهازك الآن</p>
            <h2 className={`text-2xl sm:text-3xl font-black ${statusCfg.color}`}>
              {statusCfg.icon} {statusCfg.label}
            </h2>
            <p className="text-xs text-neutral-400 font-mono">{statusCfg.labelEn}</p>
          </div>
          <div className="text-left shrink-0">
            <p className="text-[10px] text-neutral-500 mb-1">رقم السند</p>
            <span className="font-mono text-xs font-bold text-[#FFC400] bg-black/60 px-2 py-1 rounded border border-neutral-800 block">
              {device.id}
            </span>
          </div>
        </div>
        {isDone && (
          <div className="relative z-10 mt-4 pt-4 border-t border-emerald-500/20">
            <p className="text-xs text-emerald-300 font-bold">
              🎉 جهازك جاهز! يمكنك التوجه للورشة الآن لاستلامه.
            </p>
          </div>
        )}
      </div>

      {/* ── Device Info Card ── */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">بيانات الجهاز</h3>
        <div className="space-y-0 text-sm divide-y divide-neutral-800/60">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-neutral-400 text-xs">الجهاز</span>
            <span className="font-black text-white">{device.deviceModel}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-neutral-400 text-xs">الزبون</span>
            <span className="font-bold text-neutral-200">{device.customerName}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-neutral-400 text-xs">رقم IMEI</span>
            <span className="font-mono text-xs text-[#FFC400] bg-black/50 px-2 py-0.5 rounded border border-neutral-800">{device.imei}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-neutral-400 text-xs">تاريخ الاستلام</span>
            <span className="text-neutral-300 text-xs">
              {new Date(device.date).toLocaleDateString("ar-JO", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          {device.priceJOD && (
            <div className="flex items-center justify-between py-2.5">
              <span className="text-neutral-400 text-xs">الأجرة المتفق عليها</span>
              <span className="font-black text-[#FFC400] text-lg font-mono">{device.priceJOD} JOD</span>
            </div>
          )}
        </div>
        <div className="bg-[#181818] rounded-xl p-3 border border-neutral-800 mt-1">
          <p className="text-[10px] font-bold text-neutral-500 mb-1">حالة الجهاز عند الاستلام (موثقة):</p>
          <p className="text-xs text-neutral-300 leading-relaxed">{device.faultDesc}</p>
        </div>
      </div>

      {/* ── Progress Stepper ── */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl p-5 space-y-5">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">مراحل الصيانة</h3>
        <div className="space-y-0">
          {STEPS.map((step, idx) => {
            const isPassed = idx <= currentStep;
            const isCurrent = idx === currentStep;
            const isLast = idx === STEPS.length - 1;
            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 shrink-0 transition-all duration-500 ${
                    isCurrent
                      ? "bg-[#FFC400] border-[#FFC400] text-black shadow-[0_0_20px_rgba(255,196,0,0.4)] scale-110"
                      : isPassed
                      ? "bg-[#FFC400]/20 border-[#FFC400]/60 text-[#FFC400]"
                      : "bg-neutral-900 border-neutral-700 text-neutral-600"
                  }`}>
                    {isPassed && !isCurrent ? "✓" : step.icon}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 flex-1 my-1 min-h-[28px] transition-all duration-700 ${isPassed && idx < currentStep ? "bg-[#FFC400]/40" : "bg-neutral-800"}`} />
                  )}
                </div>
                <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                  <p className={`font-black text-sm transition-colors ${isCurrent ? "text-[#FFC400]" : isPassed ? "text-white" : "text-neutral-600"}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs mt-0.5 transition-colors ${isCurrent ? "text-neutral-300" : "text-neutral-600"}`}>
                    {step.desc}
                  </p>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-[#FFC400] bg-[#FFC400]/10 border border-[#FFC400]/20 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400] animate-pulse" />
                      الحالة الحالية
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Legal Note ── */}
      <div className="bg-[#0E0E0E] border border-neutral-800/50 rounded-xl p-4 text-[10px] text-neutral-600 space-y-1 leading-relaxed">
        <p className="font-bold text-neutral-500 text-xs">📋 شروط ورشة عالم الصيانة:</p>
        <p>• المحل غير مسؤول عن فقدان البيانات — يرجى عمل نسخة احتياطية قبل التسليم.</p>
        <p>• يُسلَّم الجهاز فقط لحامل هذا السند أو بإثبات الهوية.</p>
        <p>• تسقط مسؤولية المحل عن أي جهاز يُترك لأكثر من 30 يوماً من تاريخ إشعار الجاهزية.</p>
      </div>

      <p className="text-center text-[10px] text-neutral-600 pb-4">
        نظام عالم الصيانة • بوابة متابعة الزبائن • عمان، الأردن 🇯🇴
      </p>
    </div>
  );
}

/* ─── Page Wrapper (overrides the global layout navbar) ──── */
export default function TrackPage() {
  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Custom Top Bar — no app nav, just brand */}
      <div className="border-b border-[#1C1C1C] bg-[#0E0E0E]/95 backdrop-blur sticky top-0 z-10 print:hidden">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFC400] to-[#B38600] flex items-center justify-center text-black text-base shadow-[0_0_15px_rgba(255,196,0,0.3)]">
              ⚙️
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">عالم الصيانة</p>
              <p className="text-neutral-500 text-[10px]">بوابة تتبع الزبائن</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#FFC400]/10 text-[#FFC400] border border-[#FFC400]/20">
            🔒 آمن وموثق
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2 pb-2">
          <h1 className="text-2xl font-black text-white">تتبع حالة صيانة جهازك</h1>
          <p className="text-xs text-neutral-500">هذه الصفحة خاصة بك — لا أحد غيرك يرى بيانات جهازك</p>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-[#FFC400]/20 border-t-[#FFC400] animate-spin" />
            <p className="text-neutral-400 text-sm">جارِ التحميل...</p>
          </div>
        }>
          <TrackContent />
        </Suspense>
      </div>
    </div>
  );
}


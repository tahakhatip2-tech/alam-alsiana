"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { VaultRecord } from "@/app/api/vault/route";
import {
  Search,
  Camera,
  Wrench,
  CheckCircle2,
  Inbox,
  CheckCheck,
  Smartphone,
  User,
  Calendar,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  X,
  Zap,
  Check,
  FileText,
  ShoppingBag,
} from "lucide-react";

/* ─── Status Config ─────────────────────────────────────── */
const STATUS_MAP = {
  RECEIVED: {
    label: "تم الاستلام في الورشة",
    labelEn: "Received at Workshop",
    icon: <Inbox className="w-6 h-6 text-blue-400" />,
    stepIcon: <Inbox className="w-4 h-4" />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    step: 0,
  },
  IN_PROGRESS: {
    label: "قيد الفحص والإصلاح",
    labelEn: "Under Repair & Diagnosis",
    icon: <Wrench className="w-6 h-6 text-amber-400" />,
    stepIcon: <Wrench className="w-4 h-4" />,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]",
    step: 1,
  },
  DONE: {
    label: "جاهز للاستلام",
    labelEn: "Ready for Pickup",
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
    stepIcon: <CheckCircle2 className="w-4 h-4" />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.25)]",
    step: 2,
  },
  DELIVERED: {
    label: "تم التسليم للزبون",
    labelEn: "Delivered to Customer",
    icon: <CheckCheck className="w-6 h-6 text-neutral-400" />,
    stepIcon: <CheckCheck className="w-4 h-4" />,
    color: "text-neutral-400",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/30",
    glow: "",
    step: 3,
  },
} as const;

const STEPS = [
  { key: "RECEIVED", label: "تم الاستلام", icon: <Inbox className="w-4 h-4" />, desc: "وصل جهازك للورشة وتم توثيق حالته وفحصه مبدئياً" },
  { key: "IN_PROGRESS", label: "قيد الفحص والإصلاح", icon: <Wrench className="w-4 h-4" />, desc: "الفني يعمل حالياً على فحص الدوائر واستبدال القطع" },
  { key: "DONE", label: "جاهز للاستلام", icon: <CheckCircle2 className="w-4 h-4" />, desc: "اكتمل الإصلاح واجتاز الفحص بنجاح — تفضل للاستلام" },
];

function TrackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const imeiParam = searchParams.get("imei");

  const [queryInput, setQueryInput] = useState(idParam || imeiParam || "");
  const [device, setDevice] = useState<VaultRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (idParam) {
      performSearch({ id: idParam });
    } else if (imeiParam) {
      performSearch({ imei: imeiParam });
    }
  }, [idParam, imeiParam]);

  const performSearch = async (params: { id?: string; imei?: string }) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const q = params.id ? `id=${encodeURIComponent(params.id)}` : `imei=${encodeURIComponent(params.imei || "")}`;
      const res = await fetch(`/api/vault?${q}`);
      const data = await res.json();
      const rec = Array.isArray(data.data) ? data.data[0] : data.data;
      if (rec && rec.id) {
        setDevice(rec);
        setErrorMsg(null);
      } else {
        setDevice(null);
        setErrorMsg("لم يتم العثور على أي جهاز مسجل بهذه البيانات. يرجى التأكد من رقم السند أو الـ IMEI.");
      }
    } catch {
      setDevice(null);
      setErrorMsg("حدث خطأ أثناء الاتصال بالخادم. حاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = queryInput.trim();
    if (!val) {
      setErrorMsg("يرجى إدخال رقم السند أو رقم الـ IMEI للاستعلام.");
      return;
    }

    if (val.toLowerCase().startsWith("vlt-") || val.length < 10) {
      router.push(`/track?id=${encodeURIComponent(val)}`);
      performSearch({ id: val });
    } else {
      router.push(`/track?imei=${encodeURIComponent(val)}`);
      performSearch({ imei: val });
    }
  };

  useEffect(() => {
    if (device?.status === "DONE") {
      const t = setInterval(() => setPulse((p) => !p), 1200);
      return () => clearInterval(t);
    }
  }, [device?.status]);

  const statusCfg = device ? (STATUS_MAP[device.status as keyof typeof STATUS_MAP] ?? STATUS_MAP.RECEIVED) : null;
  const isDone = device?.status === "DONE" || device?.status === "DELIVERED";

  return (
    <div className="space-y-6">
      {/* ── Search Form Card ── */}
      <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFC400]/15 border border-[#FFC400]/30 flex items-center justify-center text-[#FFC400]">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">استعلام فوري عن حالة هاتفك</h2>
            <p className="text-[11px] text-neutral-400">أدخل رقم السند المطبوع على الوصل أو رقم الـ IMEI المكوّن من 15 رقماً</p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="مثال: vlt-001 أو 352948102938471"
              className="flex-1 bg-black border border-neutral-800 focus:border-[#FFC400] rounded-2xl px-4 py-3 text-white placeholder-neutral-600 font-mono text-sm outline-none transition-colors"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="px-4 py-3 rounded-2xl border-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                title="مسح رمز الـ QR أو الباركود بالكاميرا"
              >
                <Camera className="w-4 h-4" />
                <span>قراءة الباركود</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-2xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,196,0,0.25)] flex items-center justify-center gap-2 shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جارِ الاستعلام...</span>
                  </>
                ) : (
                  <>
                    <span>استعلام</span>
                    <Search className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Quick Demo Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-900 text-[11px]">
          <span className="text-neutral-500 font-medium">أمثلة سريعة للتجربة:</span>
          <button
            type="button"
            onClick={() => {
              setQueryInput("vlt-001");
              router.push("/track?id=vlt-001");
              performSearch({ id: "vlt-001" });
            }}
            className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-[#FFC400]/10 border border-neutral-800 hover:border-[#FFC400]/30 text-neutral-300 hover:text-[#FFC400] font-mono transition-colors flex items-center gap-1.5"
          >
            <span>vlt-001</span>
            <span className="text-[10px] text-amber-400">(قيد الفحص)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setQueryInput("vlt-002");
              router.push("/track?id=vlt-002");
              performSearch({ id: "vlt-002" });
            }}
            className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-emerald-500/10 border border-neutral-800 hover:border-emerald-500/30 text-neutral-300 hover:text-emerald-400 font-mono transition-colors flex items-center gap-1.5"
          >
            <span>vlt-002</span>
            <span className="text-[10px] text-emerald-400">(جاهز للاستلام)</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-[#141414] border border-rose-500/30 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-white">عفواً، لم نجد نتائج</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* ── Results View when Device Found ── */}
      {device && statusCfg && (
        <div className="space-y-5 animate-in zoom-in-95 duration-200">
          {/* Status Hero Card */}
          <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-7 ${statusCfg.bg} ${statusCfg.border} ${statusCfg.glow} transition-all duration-700`}>
            {isDone && (
              <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl transition-opacity duration-1000 ${pulse ? "opacity-100" : "opacity-30"}`} />
            )}
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <span className="inline-block text-[10px] font-black uppercase tracking-wider text-neutral-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                  حالة جهازك الحالية
                </span>
                <h2 className={`text-2xl sm:text-3xl font-black ${statusCfg.color} flex items-center gap-2.5`}>
                  {statusCfg.icon}
                  <span>{statusCfg.label}</span>
                </h2>
                <p className="text-xs text-neutral-400 font-mono">{statusCfg.labelEn}</p>
              </div>
              <div className="text-left shrink-0">
                <p className="text-[10px] text-neutral-500 mb-1">رقم السند المعتمد</p>
                <span className="font-mono text-sm font-black text-[#FFC400] bg-black/70 px-3 py-1.5 rounded-xl border border-neutral-800 block shadow-inner">
                  {device.id}
                </span>
              </div>
            </div>

            {isDone && (
              <div className="relative z-10 mt-5 pt-4 border-t border-emerald-500/20 bg-emerald-500/10 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-black text-emerald-300">جهازك تم إصلاحه بنجاح وهو جاهز للاستلام!</p>
                  <p className="text-[11px] text-emerald-400/80">يمكنك التوجه للورشة لاستلام جهازك بموجب هذا السند أو رقم هاتفك.</p>
                </div>
              </div>
            )}
          </div>

          {/* Device Info Card */}
          <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#FFC400]" />
              <span>تفاصيل الجهاز المسجل</span>
            </h3>

            <div className="divide-y divide-neutral-800/80 text-xs">
              <div className="flex items-center justify-between py-3">
                <span className="text-neutral-400">موديل الهاتف</span>
                <span className="font-black text-white text-sm">{device.deviceModel}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-neutral-400">اسم صاحب الجهاز</span>
                <span className="font-bold text-neutral-200">{device.customerName}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-neutral-400">رقم الـ IMEI</span>
                <span className="font-mono text-xs text-[#FFC400] bg-black/60 px-2.5 py-1 rounded-lg border border-neutral-800">
                  {device.imei}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-neutral-400">تاريخ تسليم الجهاز</span>
                <span className="text-neutral-300 font-mono">
                  {new Date(device.date).toLocaleDateString("ar-JO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {device.priceJOD !== undefined && (
                <div className="flex items-center justify-between py-3">
                  <span className="text-neutral-400">تكلفة الصيانة المتفق عليها</span>
                  <span className="font-black text-[#FFC400] text-base font-mono">
                    {device.priceJOD} دينار أردني
                  </span>
                </div>
              )}
            </div>

            <div className="bg-[#181818] rounded-2xl p-4 border border-neutral-800/80 mt-2 space-y-1">
              <p className="text-[11px] font-black text-neutral-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FFC400]" />
                <span>العطل الموثق عند الاستلام:</span>
              </p>
              <p className="text-xs text-neutral-200 leading-relaxed font-medium">{device.faultDesc}</p>
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 space-y-5">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#FFC400]" />
              <span>مراحل وسير العمل</span>
            </h3>

            <div className="space-y-0">
              {STEPS.map((step, idx) => {
                const isPassed = idx <= statusCfg.step;
                const isCurrent = idx === statusCfg.step;
                const isLast = idx === STEPS.length - 1;

                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm border-2 shrink-0 transition-all duration-500 ${
                          isCurrent
                            ? "bg-[#FFC400] border-[#FFC400] text-black shadow-[0_0_20px_rgba(255,196,0,0.4)] scale-110 font-black"
                            : isPassed
                            ? "bg-[#FFC400]/20 border-[#FFC400]/60 text-[#FFC400] font-bold"
                            : "bg-neutral-900 border-neutral-800 text-neutral-600"
                        }`}
                      >
                        {isPassed && !isCurrent ? <Check className="w-4 h-4" /> : step.icon}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 my-1.5 min-h-[32px] transition-all duration-700 ${
                            isPassed && idx < statusCfg.step ? "bg-[#FFC400]/50" : "bg-neutral-800"
                          }`}
                        />
                      )}
                    </div>
                    <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-black text-sm transition-colors ${
                            isCurrent ? "text-[#FFC400]" : isPassed ? "text-white" : "text-neutral-500"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#FFC400] bg-[#FFC400]/15 border border-[#FFC400]/30 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400] animate-pulse" />
                            مرحلة الآن
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs mt-1 leading-relaxed transition-colors ${
                          isCurrent ? "text-neutral-300" : "text-neutral-500"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Camera Scanner Modal ── */}
      {showScanner && (
        <CameraScannerModal
          onClose={() => setShowScanner(false)}
          onScan={(scannedCode) => {
            setShowScanner(false);
            let cleaned = scannedCode.trim();
            try {
              if (cleaned.includes("?")) {
                const url = new URL(cleaned, window.location.origin);
                const idFromUrl = url.searchParams.get("id");
                const imeiFromUrl = url.searchParams.get("imei");
                cleaned = idFromUrl || imeiFromUrl || cleaned;
              }
            } catch {
              // keep as is
            }

            setQueryInput(cleaned);
            if (cleaned.toLowerCase().startsWith("vlt-") || cleaned.length < 10) {
              router.push(`/track?id=${encodeURIComponent(cleaned)}`);
              performSearch({ id: cleaned });
            } else {
              router.push(`/track?imei=${encodeURIComponent(cleaned)}`);
              performSearch({ imei: cleaned });
            }
          }}
        />
      )}

      {/* ── Help & Policies ── */}
      <div className="bg-[#0E0E0E] border border-neutral-800/60 rounded-2xl p-4 text-[11px] text-neutral-500 space-y-1.5 leading-relaxed">
        <p className="font-bold text-neutral-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#FFC400]" />
          <span>شروط الاستلام والمتابعة:</span>
        </p>
        <p>• يُسلَّم الجهاز حصراً لحامل السند الأصلي أو بمطابقة رقم الهاتف الموثق.</p>
        <p>• في حال وجود أي استفسار، يمكنك مراسلة المركز مباشرة عبر المحادثات أو الاتصال برقم الورشة.</p>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/"
          className="text-xs text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>العودة إلى الصفحة الرئيسية</span>
        </Link>
      </div>
    </div>
  );
}

/* ─── Camera Scanner Modal Component ──── */
function CameraScannerModal({
  onClose,
  onScan,
}: {
  onClose: () => void;
  onScan: (code: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let intervalId: any = null;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError("المتصفح لا يدعم الوصول للكاميرا المباشرة. يمكنك إدخال الرقم يدوياً.");
          return;
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        const v = document.getElementById("qr-video-feed") as HTMLVideoElement;
        if (v) {
          v.srcObject = stream;
          v.play();

          if ("BarcodeDetector" in window) {
            try {
              // @ts-expect-error BarcodeDetector global
              const detector = new window.BarcodeDetector({
                formats: ["qr_code", "code_128", "code_39", "ean_13", "data_matrix"],
              });

              intervalId = setInterval(async () => {
                if (v && v.readyState === v.HAVE_ENOUGH_DATA) {
                  try {
                    const barcodes = await detector.detect(v);
                    if (barcodes && barcodes.length > 0) {
                      const rawValue = barcodes[0].rawValue;
                      if (rawValue) {
                        clearInterval(intervalId);
                        onScan(rawValue);
                      }
                    }
                  } catch {
                    // skip
                  }
                }
              }, 300);
            } catch {
              // fallback
            }
          }
        }
      } catch {
        setError("تعذر فتح الكاميرا (يرجى منح الإذن للكاميرا في إعدادات المتصفح).");
      }
    };

    startCamera();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#2B2B2B] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#FFC400]" />
            <h3 className="font-black text-white text-sm">قارئ الباركود والـ QR السريع</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 flex items-center justify-center">
          <video
            id="qr-video-feed"
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-56 h-56 border-2 border-emerald-500/80 rounded-2xl relative shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br" />
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse" />
            </div>
          </div>

          {error && (
            <div className="absolute inset-0 bg-black/90 p-5 flex flex-col items-center justify-center text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-400" />
              <p className="text-xs text-rose-300 font-bold">{error}</p>
            </div>
          )}
        </div>

        <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
          وجّه كاميرا هاتفك نحو رمز الـ QR أو الباركود المطبوع على وصل استلام الصيانة
        </p>

        <div className="bg-[#181818] p-3 rounded-2xl border border-neutral-800 space-y-2">
          <p className="text-[10px] font-black text-neutral-400">أو جرب محاكاة مسح السند بنقرة واحدة:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onScan("vlt-001")}
              className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-[#FFC400]/20 border border-neutral-800 hover:border-[#FFC400]/40 text-neutral-200 hover:text-[#FFC400] text-xs font-mono font-bold transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>سند vlt-001</span>
              <Zap className="w-3.5 h-3.5 text-[#FFC400]" />
            </button>
            <button
              onClick={() => onScan("vlt-002")}
              className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-emerald-500/20 border border-neutral-800 hover:border-emerald-500/40 text-neutral-200 hover:text-emerald-400 text-xs font-mono font-bold transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>سند vlt-002</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-bold text-xs transition-colors"
        >
          إغلاق الكاميرا
        </button>
      </div>
    </div>
  );
}

/* ─── Page Wrapper ──── */
export default function TrackPage() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="border-b border-[#1C1C1C] bg-[#0E0E0E]/95 backdrop-blur sticky top-0 z-10 print:hidden">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-black border border-[#FFC400]/40 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(255,196,0,0.3)]">
              <img src="/logo.png" alt="عالم الصيانة" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight group-hover:text-[#FFC400] transition-colors">عالم الصيانة</p>
              <p className="text-neutral-400 text-[10px]">بوابة الاستعلام وتتبع الأجهزة</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/market"
              className="text-xs text-neutral-400 hover:text-white px-3 py-1 rounded-lg border border-neutral-800 hover:bg-neutral-900 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>تصفح السوق</span>
            </Link>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FFC400]/10 text-[#FFC400] border border-[#FFC400]/25">
              خدمة معتمدة
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
            <Search className="w-3.5 h-3.5" />
            <span>بوابة الزبائن والمستخدمين</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">الاستعلام عن حالة صيانة هاتفك</h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            تابع فوراً أين وصل جهازك في الفحص، القطع المستبدلة، وموعد الجاهزية للاستلام
          </p>
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

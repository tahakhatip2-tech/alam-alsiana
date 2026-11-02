"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveSession, UserRole } from "@/lib/auth";
import {
  Wrench,
  User,
  Store,
  ArrowLeft,
  X,
  Phone,
  Lock,
  Sparkles,
  Loader2,
  LogIn,
  UserPlus,
  AlertCircle,
  Building,
} from "lucide-react";

interface RolePickerModalProps {
  onClose?: () => void;
  initialPortal?: "tech" | "customer" | "trader";
  isForced?: boolean;
  onSuccess?: () => void;
}

type PortalType = "tech" | "customer" | "trader";

interface PortalConfig {
  id: PortalType;
  title: string;
  subtitle: string;
  role: UserRole;
  icon: React.ReactNode;
  themeColor: string;
  bgGrad: string;
  borderGlow: string;
  iconBg: string;
}

const PORTALS: PortalConfig[] = [
  {
    id: "tech",
    title: "بوابة فنيي الصيانة",
    subtitle: "الدكتور الذكي، المخططات، وإدارة ورشة الصيانة",
    role: "TECH",
    icon: <Wrench className="w-5 h-5" />,
    themeColor: "text-[#FFC400]",
    bgGrad: "from-[#FFC400]/15 via-amber-500/5 to-transparent",
    borderGlow: "border-[#FFC400]/40 hover:border-[#FFC400] shadow-[0_0_25px_rgba(255,196,0,0.15)]",
    iconBg: "bg-[#FFC400]/20 text-[#FFC400] border-[#FFC400]/40 shadow-[0_0_20px_rgba(255,196,0,0.25)]",
  },
  {
    id: "customer",
    title: "بوابة الزبائن والمستخدمين",
    subtitle: "استعلام وتتبع حالة الأجهزة وسوق الهواتف",
    role: "CUSTOMER",
    icon: <User className="w-5 h-5" />,
    themeColor: "text-emerald-400",
    bgGrad: "from-emerald-500/15 via-teal-500/5 to-transparent",
    borderGlow: "border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.15)]",
    iconBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]",
  },
  {
    id: "trader",
    title: "بوابة التجار والمعارض",
    subtitle: "سوق الجملة، قطع الغيار، وبوردات التشليح",
    role: "TRADER",
    icon: <Store className="w-5 h-5" />,
    themeColor: "text-blue-400",
    bgGrad: "from-blue-500/15 via-cyan-500/5 to-transparent",
    borderGlow: "border-blue-500/40 hover:border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.15)]",
    iconBg: "bg-blue-500/20 text-blue-300 border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.25)]",
  },
];

export default function RolePickerModal({ onClose, initialPortal, isForced, onSuccess }: RolePickerModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [activePortal, setActivePortal] = useState<PortalConfig | null>(
    initialPortal ? PORTALS.find((p) => p.id === initialPortal) || null : null
  );
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("عمان");
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isForced) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, isForced]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePortal) return;
    setError("");

    if (!phone.trim()) {
      setError("يرجى إدخال رقم الهاتف المسجل");
      return;
    }

    if (authMode === "register" && !name.trim()) {
      setError("يرجى إدخال الاسم أو اسم النشاط");
      return;
    }

    setLoading(true);
    try {
      const payload =
        authMode === "login"
          ? { action: "login", phone: phone.trim() }
          : {
              action: "register",
              name: name.trim(),
              phone: phone.trim(),
              role: activePortal.role,
              city,
              shopName: activePortal.id === "trader" ? shopName.trim() : undefined,
              password: password.trim() || undefined,
            };

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (authMode === "login" ? "رقم الهاتف غير مسجل" : "حدث خطأ أثناء التسجيل"));
      } else {
        saveSession(data.user);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
        const intended = sessionStorage.getItem("alam_redirect");
        sessionStorage.removeItem("alam_redirect");
        router.push(intended || "/dashboard");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالخادم، حاول ثانية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (!isForced && onClose && e.target === overlayRef.current) onClose();
      }}
    >
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[#070707] transition-all duration-700" />
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('/auth-bg.jpg')" }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/10 via-[#0E0E0E]/80 to-[#070707] backdrop-blur-xl pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[480px] my-auto">
        <div className="relative rounded-[32px] bg-[#0E0E0E]/90 border border-[#2B2B2B] hover:border-[#FFC400]/30 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(255,196,0,0.12)] overflow-hidden p-6 sm:p-8 transition-all duration-300">

          {/* Top Gold Ambient Glow Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFC400] to-transparent shadow-[0_0_15px_#FFC400]" />

          {/* VIEW 1: PORTAL SELECTION */}
          {!activePortal ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black border border-[#FFC400]/40 p-1.5 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(255,196,0,0.35)]">
                  <img src="/logo.png" alt="عالم الصيانة" className="w-full h-full object-contain" />
                </div>

                <div className="pt-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                    عالم الصيانة
                    <span className="text-[#FFC400] text-sm font-bold mr-2">PRO</span>
                  </h1>
                  <p className="text-xs font-bold text-[#FFC400] mt-1 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
                    <span>سوبر آب هاردوير الهواتف الذكي</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
                  </p>
                </div>

                <p className="text-xs text-neutral-400 pt-1 font-medium">
                  أرجو تحديد بوابة الدخول الخاصة بك
                </p>
              </div>

              {/* Portals List */}
              <div className="space-y-3">
                {PORTALS.map((portal) => (
                  <button
                    key={portal.id}
                    onClick={() => {
                      setError("");
                      setActivePortal(portal);
                    }}
                    className={`w-full group relative rounded-2xl p-3.5 sm:p-4 bg-gradient-to-r ${portal.bgGrad} bg-[#141414] border ${portal.borderGlow} transition-all duration-300 flex items-center justify-between gap-3 text-right hover:scale-[1.01] active:scale-98`}
                  >
                    <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-[#FFC400] group-hover:border-[#FFC400]/40 transition-all shrink-0">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <h3 className={`text-sm sm:text-base font-black text-white group-hover:${portal.themeColor} transition-colors truncate`}>
                        {portal.title}
                      </h3>
                      <p className="text-[11px] text-neutral-400 group-hover:text-neutral-300 transition-colors truncate">
                        {portal.subtitle}
                      </p>
                    </div>

                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${portal.iconBg}`}>
                      {portal.icon}
                    </div>
                  </button>
                ))}
              </div>

              {!isForced && onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 left-4 w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center text-sm transition-colors"
                  title="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            /* VIEW 2: LOGIN / REGISTER FOR SELECTED PORTAL */
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setError("");
                    setActivePortal(null);
                  }}
                  className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-[#FFC400]/30 text-[#FFC400] flex items-center justify-center transition-all hover:scale-105"
                  title="العودة لاختيار البوابة"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/30 text-[#FFC400] font-mono">
                  {authMode === "login" ? "SIGN IN" : "REGISTER"}
                </span>
                {!isForced && onClose ? (
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-9" />
                )}
              </div>

              <div className="text-center space-y-2">
                <div className={`w-16 h-16 rounded-full border mx-auto flex items-center justify-center ${activePortal.iconBg}`}>
                  {activePortal.icon}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    {activePortal.title}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {authMode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center font-bold animate-in fade-in flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {authMode === "register" && (
                  <div className="space-y-1">
                    <label className="block text-neutral-300 font-bold pr-1">
                      {activePortal.id === "trader" ? "اسم المحل أو المعرض:" : "الاسم الكامل / اسم النشاط:"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: مركز النخبة للصيانة أو أحمد علي"
                        className="w-full bg-black/60 border border-neutral-800 focus:border-[#FFC400] rounded-xl px-3.5 py-3 text-white placeholder-neutral-500 outline-none transition-all pl-9"
                      />
                      <Building className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-neutral-300 font-bold pr-1">
                    رقم الهاتف / الواتساب:
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="079XXXXXXX"
                      className="w-full bg-black/60 border border-neutral-800 focus:border-[#FFC400] rounded-xl px-3.5 py-3 text-white placeholder-neutral-500 font-mono outline-none transition-all text-left pl-9"
                      dir="ltr"
                    />
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {authMode === "register" && (
                  <div className="space-y-1">
                    <label className="block text-neutral-300 font-bold pr-1">المدينة / المحافظة:</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-black/60 border border-neutral-800 focus:border-[#FFC400] rounded-xl px-3.5 py-3 text-white outline-none transition-all"
                    >
                      {["عمان", "إربد", "الزرقاء", "العقبة", "السلط", "المفرق", "مأدبا", "جرش", "عجلون", "الكرك"].map((c) => (
                        <option key={c} value={c} className="bg-[#121212] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-neutral-300 font-bold pr-1">
                    كلمة المرور:
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/60 border border-neutral-800 focus:border-[#FFC400] rounded-xl px-3.5 py-3 text-white placeholder-neutral-500 outline-none transition-all text-left pl-9"
                      dir="ltr"
                    />
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(255,196,0,0.25)] hover:shadow-[0_0_35px_rgba(255,196,0,0.5)] hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-3 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جارِ المعالجة...</span>
                    </>
                  ) : authMode === "login" ? (
                    <>
                      <span>دخول للنظام</span>
                      <LogIn className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>تأكيد وإنشاء الحساب</span>
                      <UserPlus className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-xs text-neutral-400 pt-3 border-t border-neutral-800">
                {authMode === "login" ? (
                  <p>
                    مستخدم جديد؟{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setAuthMode("register");
                      }}
                      className="text-[#FFC400] font-bold hover:underline"
                    >
                      إنشاء حساب
                    </button>
                  </p>
                ) : (
                  <p>
                    لديك حساب بالفعل؟{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setAuthMode("login");
                      }}
                      className="text-[#FFC400] font-bold hover:underline"
                    >
                      تسجيل الدخول
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Vision */}
        <div className="mt-4 text-center space-y-1.5 px-4 text-[11px] text-neutral-400 leading-relaxed">
          <p className="text-[#FFC400] font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
            <span>رؤيتنا للمستقبل</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
          </p>
          <p className="max-w-md mx-auto text-[10px] text-neutral-500">
            نسعى في عالم الصيانة إلى تنظيم قطاع صيانة الهواتف، تسهيل تتبع الأجهزة للزبائن، وتوفير أدوات فحص وتجارة حديثة للوصول إلى بيئة عمل متكاملة.
          </p>
          <p className="text-[9px] text-neutral-600 font-mono pt-1">
            ALAM AL-SIANA • VERSION 2.0 • JORDAN
          </p>
        </div>
      </div>
    </div>
  );
}

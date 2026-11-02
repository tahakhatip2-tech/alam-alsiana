"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { saveSession, UserRole } from "@/lib/auth";
import {
  Wrench,
  User,
  Store,
  Phone,
  Lock,
  Building,
  UserPlus,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

type PortalType = "tech" | "customer" | "trader";

const PORTALS = {
  tech: {
    title: "بوابة فنيي الصيانة",
    subtitle: "إنشاء حساب ورشة / فني",
    role: "TECH" as UserRole,
    icon: <Wrench className="w-8 h-8 text-[#FFC400]" />,
  },
  customer: {
    title: "بوابة الزبائن والمستخدمين",
    subtitle: "إنشاء حساب مستخدم",
    role: "CUSTOMER" as UserRole,
    icon: <User className="w-8 h-8 text-emerald-400" />,
  },
  trader: {
    title: "بوابة التجار والمعارض",
    subtitle: "إنشاء حساب معرض / تاجر",
    role: "TRADER" as UserRole,
    icon: <Store className="w-8 h-8 text-blue-400" />,
  },
};

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleKey = (searchParams.get("role") || "tech") as PortalType;
  const currentPortal = PORTALS[roleKey] || PORTALS.tech;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("عمان");
  const [shopName, setShopName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("يرجى إدخال الاسم ورقم الهاتف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: name.trim(),
          phone: phone.trim(),
          role: currentPortal.role,
          city,
          shopName: roleKey === "trader" ? shopName.trim() : undefined,
          password: password.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء إنشاء الحساب");
      } else {
        saveSession(data.user);
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
    <div className="relative min-h-[90vh] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#070707] pointer-events-none" />
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('/auth-bg.jpg')" }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFC400]/10 via-[#0E0E0E]/85 to-[#070707] backdrop-blur-xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-[480px]">
        <div className="rounded-[32px] bg-[#0E0E0E]/90 border border-[#2B2B2B] hover:border-[#FFC400]/30 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(255,196,0,0.15)] overflow-hidden p-7 sm:p-8 space-y-6">

          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFC400] to-transparent shadow-[0_0_15px_#FFC400]" />

          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-[#FFC400]/30 text-[#FFC400] flex items-center justify-center transition-all hover:scale-105"
              title="العودة للرئيسية"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/30 text-[#FFC400] font-mono">
              CREATE ACCOUNT
            </span>
            <div className="w-9" />
          </div>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-black border border-[#FFC400]/40 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(255,196,0,0.25)]">
              {currentPortal.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">
                {currentPortal.title}
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">{currentPortal.subtitle}</p>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center font-bold animate-in fade-in flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="block text-neutral-300 font-bold pr-1">
                {roleKey === "trader" ? "اسم المحل أو المعرض:" : "الاسم الكامل / اسم النشاط:"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: مركز النخبة للصيانة أو أحمد علي"
                  autoFocus
                  className="w-full bg-black/60 border border-neutral-800 focus:border-[#FFC400] rounded-xl px-3.5 py-3 text-white placeholder-neutral-500 outline-none transition-all pl-10"
                />
                <Building className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

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
                  className="w-full bg-black/60 border border-neutral-800 focus:border-[#FFC400] rounded-xl px-3.5 py-3 text-white placeholder-neutral-500 font-mono outline-none transition-all text-left pl-10"
                  dir="ltr"
                />
                <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

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
                  className="w-full bg-black/60 border border-neutral-800 focus:border-[#FFC400] rounded-xl px-3.5 py-3 text-white placeholder-neutral-500 outline-none transition-all text-left pl-10"
                  dir="ltr"
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(255,196,0,0.25)] hover:shadow-[0_0_35px_rgba(255,196,0,0.5)] hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارِ التسجيل...</span>
                </>
              ) : (
                <>
                  <span>تأكيد وإنشاء الحساب</span>
                  <UserPlus className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-neutral-400 pt-3 border-t border-neutral-800 space-y-2">
            <p>
              لديك حساب بالفعل؟{" "}
              <Link
                href={`/auth/login?role=${roleKey}`}
                className="text-[#FFC400] font-bold hover:underline"
              >
                تسجيل الدخول
              </Link>
            </p>
            <p className="text-[11px]">
              <Link href="/?auth=required" className="text-neutral-500 hover:text-neutral-300 transition-colors">
                اختيار بوابة أخرى ←
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center space-y-1 px-4 text-[10px] text-neutral-400">
          <p className="text-[#FFC400] font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
            <span>رؤيتنا للمستقبل</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
          </p>
          <p>منظومة هاردوير وتقنية متكاملة لخدمة فنيي وزبائن الأردن</p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#FFC400] animate-spin" />
        </div>
      }
    >
      <RegisterPageInner />
    </Suspense>
  );
}

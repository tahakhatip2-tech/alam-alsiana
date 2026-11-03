"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession, isMaintenanceRole, UserSession } from "@/lib/auth";
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Cpu,
  Sliders,
  Coins,
  LogIn,
  LogOut,
  Loader2,
} from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("TECH" | "TRADER" | "CUSTOMER" | "ADMIN")[];
  denyMessage?: string;
}

export default function AuthGuard({ children, allowedRoles, denyMessage }: AuthGuardProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null | "loading">("loading");

  useEffect(() => {
    const session = getSession();
    setUser(session);
    if (!session) {
      sessionStorage.setItem("alam_redirect", window.location.pathname);
      router.replace("/?auth=required");
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    clearSession();
    router.push("/");
  }, [router]);

  if (user === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <Loader2 className="w-8 h-8 text-[#FFC400] animate-spin" />
          <span className="text-xs font-bold">جارِ التحقق من جلستك...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const hasAccess =
    !allowedRoles ||
    allowedRoles.length === 0 ||
    allowedRoles.includes(user.role);

  if (!hasAccess) {
    const isMaintenance = isMaintenanceRole(user.role);
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#121212] border border-[#262626] rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">
              {denyMessage || "هذه الخدمة غير متاحة لحسابك"}
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isMaintenance
                ? "هذه الصفحة مخصصة للمستخدمين العاديين فقط."
                : "هذه الخدمة مخصصة لمراكز الصيانة والتجار المسجلين في المنصة."}
            </p>
          </div>

          {!isMaintenance && (
            <div className="bg-[#FFC400]/10 border border-[#FFC400]/20 rounded-2xl p-4 text-right space-y-2">
              <p className="text-xs font-black text-[#FFC400]">مراكز الصيانة تحصل على:</p>
              <ul className="text-[11px] text-neutral-300 space-y-1.5">
                <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-rose-400" /><span>خزنة الزبائن وسندات الاستلام</span></li>
                <li className="flex items-center gap-2"><Stethoscope className="w-3.5 h-3.5 text-amber-400" /><span>تشخيص أعطال الباور سبلاي</span></li>
                <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-blue-400" /><span>عارض المخططات التفاعلي (ZXW)</span></li>
                <li className="flex items-center gap-2"><Sliders className="w-3.5 h-3.5 text-cyan-400" /><span>صندوق العدة وبدائل الآيسيات</span></li>
                <li className="flex items-center gap-2"><Coins className="w-3.5 h-3.5 text-purple-400" /><span>دكتور الأسعار والتسعير</span></li>
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={() => router.push("/?auth=required")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFC400] to-[#E0AC00] text-black font-black text-sm hover:scale-[1.01] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,196,0,0.3)] flex items-center justify-center gap-2"
            >
              <span>تسجيل الدخول بحساب مختلف</span>
              <LogIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold text-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSession, clearSession, isMaintenanceRole, UserSession } from "@/lib/auth";
import RolePickerModal from "./RolePickerModal";
import {
  Wrench,
  Stethoscope,
  Cpu,
  Search,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  Coins,
  User,
  Settings,
  Zap,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LogIn,
  Home,
  Sliders,
  MapPin,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [diagOpen, setDiagOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);

  const diagRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getSession());
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (diagRef.current && !diagRef.current.contains(e.target as Node)) setDiagOpen(false);
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDiagOpen(false);
    setShopOpen(false);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(() => {
    clearSession();
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
  }, [router]);

  const isMaintenance = isMaintenanceRole(user?.role);
  const isDiagActive = pathname === "/hospital" || pathname === "/schematic" || pathname === "/tools";
  const isShopActive = pathname === "/vault" || pathname === "/pricing" || pathname === "/track";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#222222] bg-[#0A0A0A]/95 backdrop-blur-xl print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* ── Brand Logo ── */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink min-w-0 group">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-black border border-[#FFC400]/40 p-1 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(255,196,0,0.35)] group-hover:shadow-[0_0_35px_rgba(255,196,0,0.6)] group-hover:scale-105 transition-all">
              <img src="/logo.png" alt="شعار عالم الصيانة" className="w-full h-full object-contain rounded-lg sm:rounded-xl drop-shadow-md" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-black text-base sm:text-lg text-white tracking-wide truncate">عالم الصيانة</span>
                <span className="text-[9px] sm:text-[10px] bg-[#FFC400]/20 text-[#FFC400] px-1 sm:px-1.5 py-0.5 rounded border border-[#FFC400]/30 font-black shrink-0">PRO</span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 font-medium hidden sm:block truncate">سوبر آب هاردوير الهواتف</span>
            </div>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold">

            {/* Maintenance-only tools */}
            {isMaintenance && (
              <>
                {/* Group 1: التشخيص والمخططات */}
                <div className="relative" ref={diagRef}>
                  <button
                    onClick={() => { setDiagOpen(!diagOpen); setShopOpen(false); }}
                    className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                      isDiagActive || diagOpen
                        ? "bg-[#181818] text-[#FFC400] border border-[#FFC400]/30"
                        : "text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent"
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5 text-[#FFC400]" />
                    <span>التشخيص والمخططات</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${diagOpen ? "rotate-180" : ""}`} />
                  </button>
                  {diagOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#121212] border border-[#2B2B2B] rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                      {[
                        { href: "/hospital", icon: <Stethoscope className="w-5 h-5 text-amber-400" />, title: "الدكتور الذكي", desc: "تشخيص أعطال سحب الباور سبلاي" },
                        { href: "/schematic", icon: <Cpu className="w-5 h-5 text-blue-400" />, title: "عارض اللوحات (ZXW)", desc: "تتبع مسارات البوردات ونقاط الفحص" },
                        { href: "/tools", icon: <Sliders className="w-5 h-5 text-cyan-400" />, title: "صندوق العدة والبدائل", desc: "حاسبة الحقن وبدائل الآيسيات" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${pathname === item.href ? "bg-[#FFC400]/15 text-[#FFC400]" : "hover:bg-neutral-900 text-neutral-200"}`}>
                          <div className="p-1 rounded-lg bg-white/5 border border-white/5 shrink-0">{item.icon}</div>
                          <div>
                            <div className="font-black text-xs text-white">{item.title}</div>
                            <div className="text-[10px] text-neutral-400">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Group 2: إدارة الورشة */}
                <div className="relative" ref={shopRef}>
                  <button
                    onClick={() => { setShopOpen(!shopOpen); setDiagOpen(false); }}
                    className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                      isShopActive || shopOpen
                        ? "bg-[#181818] text-[#FFC400] border border-[#FFC400]/30"
                        : "text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FFC400]" />
                    <span>إدارة المحل والزبائن</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`} />
                  </button>
                  {shopOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#121212] border border-[#2B2B2B] rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                      {[
                        { href: "/vault", icon: <ShieldCheck className="w-5 h-5 text-rose-400" />, title: "خزنة وسندات الاستلام", desc: "توثيق IMEI وطباعة إيصالات QR" },
                        { href: "/pricing", icon: <Coins className="w-5 h-5 text-[#FFC400]" />, title: "دكتور الأسعار (JOD)", desc: "تسعير صيانة وشاشات السوق الأردني" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${pathname === item.href ? "bg-[#FFC400]/15 text-[#FFC400]" : "hover:bg-neutral-900 text-neutral-200"}`}>
                          <div className="p-1 rounded-lg bg-white/5 border border-white/5 shrink-0">{item.icon}</div>
                          <div>
                            <div className="font-black text-xs text-white">{item.title}</div>
                            <div className="text-[10px] text-neutral-400">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Shared Links for all */}
            <Link href="/track"
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${pathname === "/track" ? "bg-emerald-500 text-black font-black shadow" : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20"}`}>
              <Search className="w-3.5 h-3.5" />
              <span>استعلام عن جهاز</span>
            </Link>

            <Link href="/market"
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${pathname === "/market" ? "bg-[#FFC400] text-black font-black shadow" : "text-neutral-300 hover:text-white hover:bg-neutral-900"}`}>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>السوق</span>
            </Link>

            <Link href="/chat"
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors relative ${pathname === "/chat" ? "bg-[#FFC400] text-black font-black shadow" : "text-neutral-300 hover:text-white hover:bg-neutral-900"}`}>
              <MessageSquare className="w-3.5 h-3.5" />
              <span>المحادثات</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400] animate-pulse" />
            </Link>
          </nav>

          {/* ── Right Section ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${
                    userMenuOpen
                      ? "bg-[#FFC400]/15 text-[#FFC400] border-2 border-[#FFC400]"
                      : "bg-[#181818] border-neutral-700 text-neutral-200 hover:border-[#FFC400]/40 hover:text-[#FFC400]"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-[#121212] border border-[#2B2B2B] rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                      <p className="font-black text-white text-xs truncate">{user.name}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">{user.phone}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FFC400]" />
                        <span>{user.city}</span>
                      </p>
                    </div>

                    <Link href="/dashboard"
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-neutral-900 text-neutral-200 transition-colors text-xs font-bold">
                      <Home className="w-4 h-4 text-[#FFC400]" />
                      <span>لوحة التحكم</span>
                    </Link>

                    {isMaintenance && (
                      <Link href="/admin"
                        className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-amber-500/10 text-amber-400 transition-colors text-xs font-bold">
                        <Settings className="w-4 h-4" />
                        <span>لوحة الإدارة</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400 transition-colors text-xs font-bold text-right"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowRolePicker(true)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 border-[#FFC400] bg-[#FFC400]/10 text-[#FFC400] text-xs font-black hover:bg-[#FFC400] hover:text-black shadow-[0_0_15px_rgba(255,196,0,0.2)] transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">دخول / حساب</span>
                <span className="sm:hidden">دخول</span>
              </button>
            )}

            {isMaintenance && (
              <Link
                href="/hospital"
                className="hidden sm:flex px-3.5 py-2 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,196,0,0.2)] items-center gap-1.5"
              >
                <span>فحص سريع</span>
                <Zap className="w-3.5 h-3.5 fill-black" />
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white text-base hover:bg-neutral-800 transition-colors shrink-0"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#222] bg-[#0E0E0E] p-4 space-y-4 animate-in slide-in-from-top-2 duration-150">
            {isMaintenance && (
              <>
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold px-2 block">أدوات التشخيص والمخططات</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/hospital" className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-amber-400" />
                      <span>الدكتور الذكي</span>
                    </Link>
                    <Link href="/schematic" className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <span>عارض اللوحات</span>
                    </Link>
                    <Link href="/tools" className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2 col-span-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span>صندوق العدة</span>
                    </Link>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold px-2 block">إدارة المحل والورشة</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/vault" className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                      <span>خزنة الزبائن</span>
                    </Link>
                    <Link href="/pricing" className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2">
                      <Coins className="w-4 h-4 text-[#FFC400]" />
                      <span>دكتور الأسعار</span>
                    </Link>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 font-bold px-2 block">الخدمات المشتركة</span>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/track" className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-emerald-400 flex items-center gap-2 col-span-2">
                  <Search className="w-4 h-4" />
                  <span>استعلام عن جهاز</span>
                </Link>
                <Link href="/market" className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#FFC400]" />
                  <span>السوق</span>
                </Link>
                <Link href="/chat" className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>المحادثات</span>
                </Link>
              </div>
            </div>

            {user ? (
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-white">{user.name}</p>
                  <p className="text-[10px] text-neutral-400">{isMaintenance ? "مركز صيانة" : "مستخدم"}</p>
                </div>
                <button onClick={handleLogout} className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); setShowRolePicker(true); }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFC400] to-[#E0AC00] text-black font-black text-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول أو إنشاء حساب</span>
              </button>
            )}
          </div>
        )}
      </header>

      {showRolePicker && (
        <RolePickerModal onClose={() => setShowRolePicker(false)} />
      )}
    </>
  );
}

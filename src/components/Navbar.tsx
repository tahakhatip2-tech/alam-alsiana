"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [diagOpen, setDiagOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const diagRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (diagRef.current && !diagRef.current.contains(e.target as Node)) {
        setDiagOpen(false);
      }
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setDiagOpen(false);
    setShopOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isDiagActive = pathname === "/hospital" || pathname === "/schematic" || pathname === "/tools";
  const isShopActive = pathname === "/vault" || pathname === "/pricing" || pathname === "/track";

  return (
    <header className="sticky top-0 z-50 border-b border-[#222222] bg-[#0A0A0A]/95 backdrop-blur-xl print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-black border border-[#FFC400]/40 p-1 flex items-center justify-center shadow-[0_0_25px_rgba(255,196,0,0.35)] group-hover:shadow-[0_0_35px_rgba(255,196,0,0.6)] group-hover:scale-105 transition-all">
            <img
              src="/logo.png"
              alt="شعار عالم الصيانة"
              className="w-full h-full object-contain rounded-xl drop-shadow-md"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-white tracking-wide">عالم الصيانة</span>
              <span className="text-[10px] bg-[#FFC400]/20 text-[#FFC400] px-1.5 py-0.5 rounded border border-[#FFC400]/30 font-black">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium">سوبر آب هاردوير الهواتف</span>
          </div>
        </Link>

        {/* Clean Categorized Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold">
          {/* Group 1: التشخيص والمخططات (Dropdown) */}
          <div className="relative" ref={diagRef}>
            <button
              onClick={() => {
                setDiagOpen(!diagOpen);
                setShopOpen(false);
              }}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                isDiagActive || diagOpen
                  ? "bg-[#181818] text-[#FFC400] border border-[#FFC400]/30"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent"
              }`}
            >
              <span>🔬 التشخيص والمخططات</span>
              <span className={`text-[10px] transition-transform duration-200 ${diagOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {diagOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#121212] border border-[#2B2B2B] rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                <Link
                  href="/hospital"
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                    pathname === "/hospital" ? "bg-[#FFC400]/15 text-[#FFC400]" : "hover:bg-neutral-900 text-neutral-200"
                  }`}
                >
                  <span className="text-xl">🩺</span>
                  <div>
                    <div className="font-black text-xs text-white">الدكتور الذكي</div>
                    <div className="text-[10px] text-neutral-400">تشخيص أعطال سحب الباور سبلاي</div>
                  </div>
                </Link>

                <Link
                  href="/schematic"
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                    pathname === "/schematic" ? "bg-[#FFC400]/15 text-[#FFC400]" : "hover:bg-neutral-900 text-neutral-200"
                  }`}
                >
                  <span className="text-xl">🗺️</span>
                  <div>
                    <div className="font-black text-xs text-white">عارض اللوحات (ZXW)</div>
                    <div className="text-[10px] text-neutral-400">تتبع مسارات البوردات ونقاط الفحص</div>
                  </div>
                </Link>

                <Link
                  href="/tools"
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                    pathname === "/tools" ? "bg-[#FFC400]/15 text-[#FFC400]" : "hover:bg-neutral-900 text-neutral-200"
                  }`}
                >
                  <span className="text-xl">🧰</span>
                  <div>
                    <div className="font-black text-xs text-white">صندوق العدة والبدائل</div>
                    <div className="text-[10px] text-neutral-400">حاسبة الحقن وبدائل الآيسيات</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Group 2: إدارة الورشة والزبائن (Dropdown) */}
          <div className="relative" ref={shopRef}>
            <button
              onClick={() => {
                setShopOpen(!shopOpen);
                setDiagOpen(false);
              }}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                isShopActive || shopOpen
                  ? "bg-[#181818] text-[#FFC400] border border-[#FFC400]/30"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent"
              }`}
            >
              <span>🛡️ إدارة المحل والزبائن</span>
              <span className={`text-[10px] transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {shopOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#121212] border border-[#2B2B2B] rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                <Link
                  href="/vault"
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                    pathname === "/vault" ? "bg-[#FFC400]/15 text-[#FFC400]" : "hover:bg-neutral-900 text-neutral-200"
                  }`}
                >
                  <span className="text-xl">🛡️</span>
                  <div>
                    <div className="font-black text-xs text-white">خزنة وسندات الاستلام</div>
                    <div className="text-[10px] text-neutral-400">توثيق IMEI وطباعة إيصالات QR</div>
                  </div>
                </Link>

                <Link
                  href="/pricing"
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                    pathname === "/pricing" ? "bg-[#FFC400]/15 text-[#FFC400]" : "hover:bg-neutral-900 text-neutral-200"
                  }`}
                >
                  <span className="text-xl">💰</span>
                  <div>
                    <div className="font-black text-xs text-white">دكتور الأسعار (JOD)</div>
                    <div className="text-[10px] text-neutral-400">تسعير صيانة وشاشات السوق الأردني</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Direct Link: سوق الدراج */}
          <Link
            href="/market"
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
              pathname === "/market"
                ? "bg-[#FFC400] text-black font-black shadow"
                : "text-neutral-300 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <span>🛒 سوق الدراج</span>
          </Link>

          {/* Direct Link: المحادثات مع مؤشر حي */}
          <Link
            href="/chat"
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors relative ${
              pathname === "/chat"
                ? "bg-[#FFC400] text-black font-black shadow"
                : "text-neutral-300 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <span>💬 المحادثات</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400] animate-pulse"></span>
          </Link>
        </nav>

        {/* Right Section: Quick Action + Dashboard / Account + Admin + Mobile Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {/* User Dashboard / Account Button */}
          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all flex items-center gap-1.5 ${
              pathname === "/dashboard"
                ? "bg-[#FFC400] text-black border-[#FFC400] shadow-[0_0_15px_rgba(255,196,0,0.3)]"
                : "bg-[#181818] border-neutral-700 text-neutral-200 hover:text-[#FFC400] hover:border-[#FFC400]/40"
            }`}
          >
            <span>👤</span>
            <span>حسابي / لوحة التحكم</span>
          </Link>

          {/* Admin Link Button */}
          <Link
            href="/admin"
            className={`hidden sm:flex px-3 py-1.5 rounded-xl border text-xs font-bold transition-all items-center gap-1.5 ${
              pathname === "/admin"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow"
                : "border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <span>⚙️</span>
            <span>الإدارة</span>
          </Link>

          {/* Quick Doctor CTA Button */}
          <Link
            href="/hospital"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFC400] to-[#E0AC00] text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,196,0,0.3)] flex items-center gap-1.5"
          >
            <span>فحص سريع</span>
            <span>⚡</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white text-base hover:bg-neutral-800 transition-colors"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#222] bg-[#0E0E0E] p-4 space-y-4 animate-in slide-in-from-top-2 duration-150">
          {/* Category: التشخيص */}
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-500 font-bold px-2 block">أدوات التشخيص والمخططات</span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/hospital"
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2"
              >
                <span>🩺</span>
                <span>الدكتور الذكي</span>
              </Link>
              <Link
                href="/schematic"
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2"
              >
                <span>🗺️</span>
                <span>عارض اللوحات</span>
              </Link>
              <Link
                href="/tools"
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2 col-span-2"
              >
                <span>🧰</span>
                <span>صندوق العدة والبدائل</span>
              </Link>
            </div>
          </div>

          {/* Category: إدارة المحل والتجارة */}
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-500 font-bold px-2 block">إدارة المحل والسوق</span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/vault"
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2"
              >
                <span>🛡️</span>
                <span>خزنة الزبائن</span>
              </Link>
              <Link
                href="/pricing"
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2"
              >
                <span>💰</span>
                <span>دكتور الأسعار</span>
              </Link>
              <Link
                href="/market"
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2"
              >
                <span>🛒</span>
                <span>سوق الدراج</span>
              </Link>
              <Link
                href="/chat"
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200 flex items-center gap-2"
              >
                <span>💬</span>
                <span>المحادثات</span>
              </Link>
            </div>
          </div>

          {/* Admin link */}
          <Link
            href="/admin"
            className="w-full py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center gap-2"
          >
            <span>⚙️ لوحة التحكم الإدارية</span>
          </Link>
        </div>
      )}
    </header>
  );
}
